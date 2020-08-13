import { Background } from "../../objects/background";
import { ProtoGuy, ProtoGuyCard } from "../../../characters/protoGuy";
import { Card } from "../card";
import { CardObject } from "../../objects/cardObject";

const WAKE_UP_ID = 'reveil';

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent
 * a given interactive moment in a scene
 */
export class WakeUpCard extends Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param parent_scene, the Scene which this card belongs to
     */
    constructor(parent_scene) {
        //Store the scene's character
        let character = new ProtoGuy(parent_scene, 300, 222, ProtoGuyCard.WAKE_UP);

        //Initialize children array
        const children = [
            new Background(parent_scene, "sprites/StudentScene/WakeUpCard/bg.jpg", "WakeUpBG"),
            new CardObject(
                parent_scene,
                { name: "phone", url: "sprites/StudentScene/WakeUpCard/phone.png" },
                new Phaser.Math.Vector2(-153, 60),
                () => {},
                null,
                -1
            ),
            character
        ];

        //Call base constructor
        super(parent_scene, children, character, true);

        this.phone_ring = true;
    }

    preload() {
        super.preload();

        //Load the sounds
        //this.parent_scene.load.audio("alarm", "sounds/damien/alarmClock.wav");
        //this.parent_scene.load.audio("vibrate", "sounds/damien/vibration.wav");
        this.parent_scene.load.audio("click", "sounds/UI/click01.wav");

        //Load the ring animation spritesheet
        this.parent_scene.load.spritesheet(
            'ring',
            'sprites/StudentScene/WakeUpCard/ring.png',
            { frameWidth: 200, frameHeight: 80 }
        );

        //Load in the tired-bubble spritesheet
        this.parent_scene.load.spritesheet(
            'tired-bubble',
            'sprites/StudentScene/WakeUpCard/tired_bubbles.png',
            { frameWidth: 100, frameHeight: 100 }
        );
    }

    /**
     * @brief Sets all of the animations related to the objects in the card
     */
    create() {
        super.create();

        //=========HANDLE_ANIMATIONS=========

        // Create ring sprites
        this.parent_scene.anims.create({
            key: 'phone-ring',
            frameRate: 15,
            frames: this.parent_scene.anims.generateFrameNames('ring'),
            repeat: -1
        });

        //Create tired bubble sprites
        this.parent_scene.anims.create({
            key: 'tired-bubbles',
            frameRate: 15,
            frames: this.parent_scene.anims.generateFrameNames('tired-bubble'),
            repeat: -1
        });

        //Play the ring animation
        this.highlight = this.parent_scene.add.sprite(
            this.children[1].sprite.x + 34,
            this.children[1].sprite.y - 55,
            'ring'
        ).play('phone-ring');

        this.bubbles = this.parent_scene.add.sprite(
            243,
            -475,
            'tired-bubble'
        ).play('tired-bubbles');

        //========= HANDLE_SOUNDS =========
        this.clickSound = this.parent_scene.sound.add("click");


        //========= HANDLE_INTERACTION =========
        //Make the phone interactive
        this.children[1].sprite.setInteractive().on('pointerdown', () => {
            this.phone_ring = false;

            this.clickSound.play();
            this.parent_scene.sound.stopByKey('alarm');
            this.parent_scene.sound.stopByKey('vibrate');

            this.parent_scene.tweens.add({
                targets: [this.children[1].sprite, this.children[1].highlight_sprite],
                y: '+= 10',
                duration: 30,
                ease: "Quad.easeOut",
                yoyo: true,
                loop: 0,
                onComplete: () => {
                    this.highlight.destroy();

                    //Trigger the dialogue
                    this.parent_scene.dialogue.display(WAKE_UP_ID);
                },
                onCompleteScope: this
            });
        }, this);
    }

    destroy() {
        super.destroy();

        this.bubbles.destroy();
    }
}
