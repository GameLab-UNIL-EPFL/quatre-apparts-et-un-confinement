import { Card } from "../card";
import { Background } from "../../objects/background";
import { CardObject } from "../../objects/cardObject";

const N_NOTIFICATION = 10;
const N_DISTRACTIONS = 19;
const N_MSG = N_NOTIFICATION + N_DISTRACTIONS;
const NOTIF_SPREAD = 1500;
const NOTIF_OFFSET = 300;

const BEG_Y_ZONE = 1500;
const END_Y_ZONE = 3000;

const INIT_FOCUS = 5;
const SPAWN_DELAY = 500;
const NUM_SPAWNS = 100;

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
                new Phaser.Math.Vector2(1020, 1300)
            ),
            new CardObject(
                parent_scene,
                { name: "bar_fill", url: "sprites/ProtoScene/ZoomMiniGameCard/bar_fill.png" },
                new Phaser.Math.Vector2(1020, 1300)
            ),
            new CardObject(
                parent_scene,
                { name: "bar", url: "sprites/ProtoScene/ZoomMiniGameCard/bar.png" },
                new Phaser.Math.Vector2(1020, 1500)
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
                pos: new Phaser.Math.Vector2(0, -3000),
                sprite: null
            });
        }

        //Add all distractions to the card
        for(let i = 0; i < N_DISTRACTIONS; ++i) {
            this.messages.push({
                name: "distraction_" + i, 
                url: "sprites/ProtoScene/ZoomMiniGameCard/distraction_" + i + ".png" ,
                pos: new Phaser.Math.Vector2(0, -3000),
                sprite: null
            });
        }

        //Used to update the bar
        this.focus_bar_health = INIT_FOCUS;
    }

    preload() {
        super.preload();

        //Load all of the messages in
        this.messages.forEach(msg => {
            this.parent_scene.load.image(msg.name, msg.url);
        });
    }

    createMessage() {
        //Select the message to show
        let msg_idx = Math.round(Math.random() * (N_MSG - 1));
        let msg = this.messages[msg_idx];

        //Create the msg at a random location
        msg.pos.x = Math.round(Math.random() * NOTIF_SPREAD) + NOTIF_OFFSET;
        msg.sprite = this.parent_scene.add.image(msg.pos.x, msg.pos.y, msg.name);

        //Animate the msg
        this.parent_scene.tweens.add({
            targets: msg.sprite,
            y: 3000,
            duration: 3000,
            onComplete: () => {
                msg.sprite.destroy();
                this.focus_bar_health--;
            },
            onCompleteScope: this
        })

        //Make the card interactive
        this.parent_scene.input.on(
            'gameobjectdown',
            (pointer, gameObject) => {
                //Check that we clicked the object
                if(gameObject === msg.sprite) {
                    //Check the pointer's location
                    if(pointer.y > BEG_Y_ZONE && pointer.y < END_Y_ZONE) {
                        msg.destroy();
                    }
                }
            },
            this.parent_scene
        );
    }

    /**
     * @brief Sets all of the animations related to the objects in the card
     */
    create() {
        super.create();

        //Create the timer event
        this.msg_spawner = this.parent_scene.time.addEvent({
            delay: SPAWN_DELAY,
            repeat: NUM_SPAWNS,
            callback: this.createMessage,
            callbackScope: this
        });
    }

    /**
     * @brief Updates the sate of the card
     */
    update() {
        super.update();
    }
}