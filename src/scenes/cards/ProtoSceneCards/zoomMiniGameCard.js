import { Card } from "../card";
import { Background } from "../../objects/background";
import { CardObject } from "../../objects/cardObject";

const N_NOTIFICATION = 10;
const N_DISTRACTIONS = 19;
const N_MSG = N_NOTIFICATION + N_DISTRACTIONS;
const NOTIF_SPREAD = 1500;
const NOTIF_OFFSET = 300;

const BEG_Y_ZONE = 2200;
const END_Y_ZONE = 2535;

const INIT_FOCUS = 5;
const SPAWN_DELAY = 500;
const NUM_SPAWNS = 100;

const END_ZOOM_CALL_ID = "endZoom";
const LOSER_ID = "loseZoom";

const MessageType = {
    Cours: 0,
    Distraction: 1
};

/**
 * @brief Models a "Card" inside of a scene.
 * This card spefically handles the mechanics linked to the zoom minigame
 */
export class ZoomMiniGameCard extends Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param {Phaser.Scene} parent_scene, the Scene which this card belongs to
     */
    constructor(parent_scene) {
        //Initialize children array
        let children = [
            new CardObject(
                parent_scene,
                { name: "zoom_bg", url: "sprites/ProtoScene/ZoomMiniGameCard/zoom_bg.jpg" },
                new Phaser.Math.Vector2(1020, 1310)
            ),
            new Background(
                parent_scene,
                "sprites/ProtoScene/ZoomMiniGameCard/computer_screen.png", 
                "computer_bg"
            ),
            new CardObject(
                parent_scene,
                { name: "bar_bg", url: "sprites/ProtoScene/ZoomMiniGameCard/bar_bg.png" },
                new Phaser.Math.Vector2(1039, 253)
            ),
            new CardObject(
                parent_scene,
                { name: "bar_fill", url: "sprites/ProtoScene/ZoomMiniGameCard/bar_fill.png" },
                new Phaser.Math.Vector2(1039, 253)
            ),
            new CardObject(
                parent_scene,
                { name: "bar", url: "sprites/ProtoScene/ZoomMiniGameCard/bar.png" },
                new Phaser.Math.Vector2(1010, 2200)
            )
        ];

        //Call base constructor
        super(parent_scene, children);

        this.messages = [];

        //Add all notifications to the card
        for(let i = 0; i < N_NOTIFICATION; ++i) {
            this.messages.push({
                name: "notification_" + i,
                url: "sprites/ProtoScene/ZoomMiniGameCard/notif_" + i + ".png" ,
                pos: new Phaser.Math.Vector2(0, -2500),
                sprite: null,
                type: MessageType.Cours
            });
        }

        //Add all distractions to the card
        for(let i = 0; i < N_DISTRACTIONS; ++i) {
            this.messages.push({
                name: "distraction_" + i, 
                url: "sprites/ProtoScene/ZoomMiniGameCard/distraction_" + i + ".png" ,
                pos: new Phaser.Math.Vector2(0, -2500),
                sprite: null,
                type: MessageType.Distraction
            });
        }

        //Array containing all of the sprites shown on the screen
        this.cur_msg = [];
        this.cur_msg_idx = 0;

        //Used to update the bar
        this.focus_bar_health = INIT_FOCUS;
        this.num_spaws = NUM_SPAWNS;

        //Mutex to avoid multiple game ends
        this.lock = false;
        this.final_health = INIT_FOCUS;
    }

    /**
     * @brief loads in all of the images used in the scene
     */
    preload() {
        super.preload();

        //Load all of the messages in
        this.messages.forEach(msg => {
            this.parent_scene.load.image(msg.name, msg.url);
        });
    }

    /**
     * @brief handles the creation of a single message card
     * @param {Function} callback what will be done at the end of the minigame
     */
    createMessage(callback) {
        if(!this.lock) {
            //Select the message to show
            let msg_idx = Math.round(Math.random() * (N_MSG - 1));
    
            //Make sure that the current message isn't already displayed
            let max_loop = N_MSG;
            while(msg_idx in this.cur_msg) {
                //Make sure that we can't get stuck in the loop
                if(--max_loop <= 0) {
                    break;
                } 
                msg_idx = Math.round(Math.random() * (N_MSG - 1));
            } 
    
            this.cur_msg.push(msg_idx);
    
            //Create the msg at a random location
            this.messages[msg_idx].pos.x = Math.round(Math.random() * NOTIF_SPREAD) + NOTIF_OFFSET;
    
            this.messages[msg_idx].sprite = this.parent_scene.add.image(
                this.messages[msg_idx].pos.x, 
                this.messages[msg_idx].pos.y, 
                this.messages[msg_idx].name
            );
    
            //Animate the msg
            this.parent_scene.tweens.add({
                targets: this.messages[msg_idx].sprite,
                y: 3000,
                duration: 7000,
                onComplete: () => {
                    this.messages[msg_idx].sprite.destroy();
    
                    //Make sure that the player didn't miss a class notification
                    if(this.messages[msg_idx].type === MessageType.Cours) {
    
                        //Check that the health bar doesn't drop below 0
                        if(--this.focus_bar_health <= 0) {
                            if(typeof callback === "function") {
                                callback(this, true);
                            }
                        }
    
                        //Resize the health bar 
                        this.children[3].sprite.width = this.focus_bar_width * (1./(INIT_FOCUS + 1 - this.focus_bar_health));
                    }
    
                    //Remove the elelment in question
                    this.cur_msg.filter((val, _) => val === msg_idx);
                    
                    //Check if the game is over
                    if(--this.num_spaws === 0) {
                        if(typeof callback === "function") {
                            callback(this, false);
                        }
                    }
                },
                onCompleteScope: this
            })
    
            //Make the card interactive
            this.parent_scene.input.on(
                'gameobjectdown',
                (pointer, gameObject) => {
                    //Check that we clicked the object
                    if(gameObject === this.messages[msg_idx].sprite) {
    
                        //Check the pointer's location
                        if(pointer.y > BEG_Y_ZONE && pointer.y < END_Y_ZONE) {
                            gameObject.destroy();
    
                            //Remove the elelment in question
                            this.cur_msg.filter((val, _) => val === msg_idx);
    
                            //Make sure that the player didn't miss a class notification
                            if(this.messages[msg_idx].type === MessageType.Distraction) {
    
                                //Check that the health bar doesn't drop below 0
                                if(--this.focus_bar_health <= 0) {
                                    if(typeof callback === "function") {
                                        callback(this, true);
                                    }
                                }
                            }
                        }
                    }
                },
                this.parent_scene
            );
        }
    }

    /**
     * @brief Ends the minigame by closing the dialogue box and passing the card
     */
    endMiniGame(card, lose) {
        if(!card.lock) {
            card.lock = true;

            //Open the dialogue 
            card.parent_scene.dialogue.display(
                lose ? LOSER_ID : END_ZOOM_CALL_ID
            );

            //Save the card's health in case not all the notifications are gone
            card.final_health = card.focus_bar_health;

            //End the card
            card.endCard();
        }
    }

    /**
     * @brief Sets all of the animations related to the objects in the card
     */
    create() {
        super.create();

        //Save the bar's initial width
        this.focus_bar_width = this.children[3].sprite.width;

        //Create the timer event
        this.msg_spawner = this.parent_scene.time.addEvent({
            delay: SPAWN_DELAY,
            repeat: NUM_SPAWNS,
            callback: this.createMessage,
            callbackScope: this,
            args: [this.endMiniGame]
        });
    }

    /**
     * @brief Updates the sate of the card
     */
    update() {
        super.update();

        //Check the dialogue state
        if(this.isDone() && this.parent_scene.dialogue.isDone()) {
            this.parent_scene.nextCard(this.final_health);
        } 
    }

    destroy() {
        super.destroy();
        
        this.messages.forEach(msg => {
            if(msg.sprite) {
                msg.sprite.destroy()
            }
        });
    }
}