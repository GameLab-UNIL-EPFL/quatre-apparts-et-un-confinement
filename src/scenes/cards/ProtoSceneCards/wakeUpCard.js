import { Background } from "../../objects/background";
import { ProtoGuy, ProtoGuyCard } from "../../../characters/protoGuy";
import { DialogueState } from "../../../core/dialogueController";
import { Card } from "../card";
import { CardObject } from "../../objects/cardObject";

const PHONE_MOVEMENT = 10;
const MAX_BUBBLE_UP = 100;
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
        //Initialize children array
        let children = [
            new Background(parent_scene, "sprites/ProtoScene/WakeUpCard/bg.jpg", "WakeUpBG"),
            new CardObject(
                parent_scene,
                { name: "phone", url: "sprites/ProtoScene/WakeUpCard/phone.png" },
                new Phaser.Math.Vector2(630, 1400),
            ),
            new ProtoGuy(parent_scene, 1528, 1750, ProtoGuyCard.WAKE_UP),
            new CardObject(
                parent_scene,
                { name: "bubbles", url: "sprites/ProtoScene/WakeUpCard/tired_bubbles.png" },
                new Phaser.Math.Vector2(1455, 550),
            )
        ];

        //Call base constructor
        super(parent_scene, children);
    }

    preload() {
        super.preload();

        //Load the ring animation spritesheet
        this.parent_scene.load.spritesheet(
            'ring',
            'sprites/ProtoScene/WakeUpCard/ring_spritesheet.png', 
            { frameWidth: 300, frameHeight: 99 }
        );
    }

    /**
     * @brief Sets all of the animations related to the objects in the card
     */
    create() {
        super.create();

        //Reset the phone's origin
        this.children[1].sprite.setOrigin(0, 0);

        //=========HANDLE_ANIMATIONS=========

        // Create ring sprites
        this.parent_scene.anims.create({
            key: 'phone-ring',
            frameRate: 30,
            frames: this.parent_scene.anims.generateFrameNames('ring'),
            repeat: -1
        });

        //Play the ring animation
        this.highlight = this.parent_scene.add.sprite(
            this.children[1].sprite.x + 150,
            this.children[1].sprite.y - 70, 
            'ring'
        ).play('phone-ring');

        //Create a tween animation for the phone
        this.parent_scene.tweens.add({
            targets: this.children[1].sprite,
            x: this.children[1].sprite.x + PHONE_MOVEMENT,
            y: this.children[1].sprite.y,
            duration: 30,
            ease: "Power2",
            yoyo: true,
            loop: -1,
        });

        //Create a tween animation for the bubbles
        this.parent_scene.tweens.add({
            targets: this.children[3].sprite,
            x: this.children[3].sprite.x,
            y: this.children[3].sprite.y - MAX_BUBBLE_UP,
            duration: 1000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });

        //========= HANDLE_INTERACTION =========
        //Make the phone interactive
        this.children[1].sprite.setInteractive();

        //Set an event listener for clicking on the phone
        this.parent_scene.input.on(
            'gameobjectdown',
            (_, gameObject) => {
                //Check that we clicked on the phone
                if(gameObject === this.children[1].sprite) {
                    this.highlight.destroy();

                    //Trigger the dialogue
                    this.parent_scene.dialogue.display(WAKE_UP_ID);
                }
            },
            this.parent_scene
        );
    }

    /**
     * @brief Updates the sate of the card
     */
    update() {
        super.update();

        //Check if it's time to move to the next scene
        if(this.parent_scene.dialogue.getState() == DialogueState.DONE) {
            this.parent_scene.nextCard();
            this.isDone = true;
        }
    }
}