import { Card } from "../card";
import { Background } from "../../objects/background";
import { CardObject } from "../../objects/cardObject";

const N_NOTIFICATION = 10;
const N_DISTRACTIONS = 19;
const N_MSG = (N_NOTIFICATION * 2) + N_DISTRACTIONS;
const NOTIF_SPREAD = 900;
const NOTIF_OFFSET = 180-600;

const BEG_Y_ZONE = 1300;

const INIT_FOCUS = 5;
const SPAWN_DELAY = 1000;
const NUM_SPAWNS = 50;

const FOCUS_BAR_COLOR = {
    FULL: 0x2EC62E,
    MID: 0xEFA81B,
    LOW: 0xE53D3D
};

const END_ZOOM_CALL_ID = "endZoom";
const LOSER_ID = "loseZoom";

const MessageType = {
    Cours: 1,
    Distraction: 0
};

var END = false;

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
                { name: "zoom_bg", url: "sprites/ProtoScene/ZoomMiniGameCard/zoom_bg.png" },
                new Phaser.Math.Vector2(0, -14)
            ),
            new Background(
                parent_scene,
                "sprites/ProtoScene/ZoomMiniGameCard/computer_screen.png",
                "computer_bg"
            ),
            new CardObject(
                parent_scene,
                { name: "bar_bg", url: "sprites/ProtoScene/ZoomMiniGameCard/bar_bg.png" },
                new Phaser.Math.Vector2(12, -633)
            ),
            new CardObject(
                parent_scene,
                { name: "bar_fill", url: "sprites/ProtoScene/ZoomMiniGameCard/bar_fill.png" },
                new Phaser.Math.Vector2(12, -633)
            ),
            new CardObject(
                parent_scene,
                { name: "line", url: "sprites/ProtoScene/ZoomMiniGameCard/line.png" },
                new Phaser.Math.Vector2(-7, 509)
            )
        ];

        //Call base constructor
        super(parent_scene, children, null, true);

        this.messages = [];

        //Add all notifications to the card
        for(let i = 0; i < N_NOTIFICATION; ++i) {
            this.messages.push({
                name: "notification_" + i,
                url: "sprites/ProtoScene/ZoomMiniGameCard/notif_" + i + ".png" ,
                pos: new Phaser.Math.Vector2(-600, -1000),
                sprite: null,
                type: MessageType.Cours,
                isDestroyed: false
            });

            //Push the notif again
            this.messages.push({
                name: "notification_" + i,
                url: "sprites/ProtoScene/ZoomMiniGameCard/notif_" + i + ".png" ,
                pos: new Phaser.Math.Vector2(-600, -1000),
                sprite: null,
                type: MessageType.Cours,
                isDestroyed: false
            });
        }

        //Add all distractions to the card
        for(let i = 0; i < N_DISTRACTIONS; ++i) {
            this.messages.push({
                name: "distraction_" + i,
                url: "sprites/ProtoScene/ZoomMiniGameCard/distraction_" + i + ".png" ,
                pos: new Phaser.Math.Vector2(-600, -1000),
                sprite: null,
                type: MessageType.Distraction,
                isDestroyed: false
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

        //Load sounds
        this.parent_scene.load.audio("music", "sounds/ZoomMiniGame/ZoomMusic.mp3");
        this.parent_scene.load.audio("wrong", "sounds/ZoomMiniGame/wrong.wav");
        this.parent_scene.load.audio("right", "sounds/ZoomMiniGame/right.wav");
        this.parent_scene.load.audio("lose", "sounds/ZoomMiniGame/Lose.wav");

        //Load all of the messages in
        this.messages.forEach(msg => {
            this.parent_scene.load.image(msg.name, msg.url);
        });

        //Load in the pop animation
        this.parent_scene.load.spritesheet(
            'notif-pop',
            'sprites/ProtoScene/ZoomMiniGameCard/notif_pop.png',
            { frameWidth: 460, frameHeight: 160 }
        );

        //Load in the click animation
        this.parent_scene.load.spritesheet(
            'pointer-click',
            'sprites/UI/pointer.png',
            { frameWidth: 340, frameHeight: 340 }
        );
    }

    /**
     * @brief Only ends the card is both the dialogue and the game are done
     */
    notifyDialogueEnd() {
        if(this.isDone()) {
            super.notifyDialogueEnd();
        }
    }

    /**
     * @brief handles the creation of a single message card
     * @param {Function} callback what will be done at the end of the minigame
     */
    createMessage(callback = () => {}) {
        if(!this.lock) {
            //Select the message to show
            let msg_idx = Math.round(Math.random() * (N_MSG - 1));

            //Make sure that the current message isn't already displayed
            let max_loop = N_MSG / 2;
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

            this.messages[msg_idx].isDestroyed = false;

            //Animate the msg
            this.parent_scene.tweens.add({
                targets: this.messages[msg_idx].sprite,
                y: 1000,
                duration: 10000,
                onComplete: () => {
                    if(!this.messages[msg_idx].isDestroyed) {
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
                            this.children[3].sprite.displayWidth -= this.focus_bar_width / INIT_FOCUS;
                            this.children[3].sprite.tint = FOCUS_BAR_COLOR.MID;

                            if(this.children[3].sprite.displayWidth < 300) {
                                this.children[3].sprite.tint = FOCUS_BAR_COLOR.LOW;
                            }

                        }

                        //Remove the elelment in question
                        this.cur_msg.filter((val, _) => val === msg_idx);
                    }

                        //Check if the game is over
                        if(--this.num_spaws === 0) {
                            if(typeof callback === "function") {
                                callback(this, false);
                                this.lose.play();
                            }
                        }
                },
                onCompleteScope: this
            });

            //Activate interactivity
            this.messages[msg_idx].sprite.setInteractive();

            //Make the card interactive
            this.parent_scene.input.on(
                'gameobjectdown',
                (pointer, gameObject) => {
                    //Check that we clicked the object
                    if(gameObject === this.messages[msg_idx].sprite) {
                        if(this.anim) {
                            this.anim.destroy();
                        }

                        //Check the pointer's location
                        if(pointer.y >= BEG_Y_ZONE) {
                            gameObject.destroy();

                            this.anim = this.parent_scene.add.sprite(
                                gameObject.x,
                                gameObject.y,
                                "notif-pop"
                            ).play('pop').on('complete', () => this.anim.destroy(), this);

                            //Remove the elelment in question
                            this.cur_msg.filter((val, _) => val === msg_idx);

                            if(this.messages[msg_idx].type === MessageType.Cours) {
                                this.right.play();
                            }

                            //Make sure that the player didn't miss a class notification
                            if(this.messages[msg_idx].type === MessageType.Distraction) {

                                //play sound
                                this.wrong.play();

                                //Check that the health bar doesn't drop below 0
                                if(--this.focus_bar_health <= 0) {
                                    if(typeof callback === "function") {
                                        callback(this, true);
                                        this.lose.play();
                                    }
                                }

                                this.children[3].sprite.displayWidth -= this.focus_bar_width / INIT_FOCUS;
                                this.children[3].sprite.tint = FOCUS_BAR_COLOR.MID;

                                if(this.children[3].sprite.displayWidth < 300) {
                                    this.children[3].sprite.tint = FOCUS_BAR_COLOR.LOW;
                                }
                            } else {
                                this.messages[msg_idx].isDestroyed = true;
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
    endMiniGame(card, lose=false) {
        if(!card.lock) {

            //Destroy all remaining cards
            card.messages.forEach(msg => {
                if(msg.sprite) {
                    msg.sprite.destroy();
                }
            })

            card.lock = true;

            //Open the dialogue
            card.parent_scene.dialogue.display(
                lose ? LOSER_ID : END_ZOOM_CALL_ID
            );

            //Save the card's health in case not all the notifications are gone
            card.final_health = card.focus_bar_health;

            //End the card
            card.endCard();

            END = true;

        }
    }

    showTutorial() {
        //Create the tutorial notification
        const tutorial_sprite = this.parent_scene.add.image(
            0,
            -1000,
            'notification_0'
        );

        //Animate it down the screen
        this.parent_scene.tweens.add({
            targets: tutorial_sprite,
            y: 600,
            duration: 7500,
            onComplete: () => {
                const pointer = this.parent_scene.add.sprite(
                    tutorial_sprite.x,
                    tutorial_sprite.y + 50,
                    'pointer-click'
                ).play('pointer-anim');

                pointer.setScale(0.5, 0.5),
                pointer.setDepth(5);

                const interaction = () => {

                    //Play pop animation
                    this.anim = this.parent_scene.add.sprite(
                        tutorial_sprite.x,
                        tutorial_sprite.y,
                        "notif-pop"
                    ).play('pop');

                    tutorial_sprite.destroy();
                    pointer.destroy();

                    //Create the timer event and start the game
                    this.msg_spawner = this.parent_scene.time.addEvent({
                        delay: SPAWN_DELAY,
                        repeat: NUM_SPAWNS,
                        callback: this.createMessage,
                        callbackScope: this,
                        args: [this.endMiniGame]
                    });
                };

                tutorial_sprite.setInteractive().on('pointerdown', interaction, this);
                pointer.setInteractive().on('pointerdown', interaction, this);
            },
            onCompleteScope: this
        });
    }

    /**
     * @brief Sets all of the animations related to the objects in the card
     */
    create() {
        super.create();

        //starts the song at the beginning of the scene
        this.music = this.parent_scene.sound.add("music");
        this.wrong = this.parent_scene.sound.add("wrong");
        this.right = this.parent_scene.sound.add("right");
        this.lose = this.parent_scene.sound.add("lose");

        this.music.play();

        //Save the bar's initial info
        this.focus_bar_width = this.children[3].sprite.width;
        this.children[3].sprite.tint = FOCUS_BAR_COLOR.FULL;

        //Move all of the UI stuff to the front
        this.children[2].sprite.setDepth(1);
        this.children[3].sprite.setDepth(1);

        //Create pop animation
        this.parent_scene.anims.create({
            key: 'pop',
            frameRate: 15,
            frames: this.parent_scene.anims.generateFrameNames('notif-pop'),
            repeat: 0,
            onComplete: () => {
                this.anim.setActive(false).setVisible(false);
            },
            onCompleteScope: this
        });

        //Create pop animation
        this.parent_scene.anims.create({
            key: 'pointer-anim',
            frameRate: 15,
            frames: this.parent_scene.anims.generateFrameNames('pointer-click'),
            repeat: -1
        });

        //Move background to the front
        this.children[1].sprite.setDepth(1);

        //Start with the tutorial
        this.showTutorial();

    }

    update() {
        if(END){
            this.parent_scene.tweens.add({
                targets:  this.music,
                volume:   0,
                duration: 800
            });
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
