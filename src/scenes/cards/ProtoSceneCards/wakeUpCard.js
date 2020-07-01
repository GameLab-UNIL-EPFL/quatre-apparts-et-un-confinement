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
        let character = new ProtoGuy(parent_scene, 900, 1022, ProtoGuyCard.WAKE_UP);

        //Initialize children array
        let children = [
            new Background(parent_scene, "sprites/ProtoScene/WakeUpCard/bg.jpg", "WakeUpBG"),
            new CardObject(
                parent_scene,
                { name: "phone", url: "sprites/ProtoScene/WakeUpCard/phone.png" },
                new Phaser.Math.Vector2(447 * window.horizontalRatio, 860), // ici: multiplier par horizontalRatio, mais game et la scene sont encore en construction
                () => {},
                null,
                -1,
                { name: "phone_h", url: "sprites/ProtoScene/WakeUpCard/phone_h.png" }  
            ),
            character
        ];

        //Call base constructor
        super(parent_scene, children, character, true);

        this.phone_ring = true;
    }

    preload() {
        super.preload();

        //Load the ring animation spritesheet
        this.parent_scene.load.spritesheet(
            'ring',
            'sprites/ProtoScene/WakeUpCard/ring.png',
            { frameWidth: 200, frameHeight: 80 }
        );

        //Load in the tired-bubble spritesheet
        this.parent_scene.load.spritesheet(
            'tired-bubble',
            'sprites/ProtoScene/WakeUpCard/tired_bubbles.png',
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
            843,
            325,
            'tired-bubble'
        ).play('tired-bubbles');

        //========= HANDLE_INTERACTION =========
        //Make the phone interactive
        this.children[1].sprite.setInteractive();
        this.children[1].highlight_sprite.setInteractive();

        //Set an event listener for clicking on the phone
        this.parent_scene.input.on(
            'gameobjectdown',
            (_, gameObject) => {
                //Check that we clicked on the phone

                if((gameObject === this.children[1].sprite || gameObject === this.children[1].highlight_sprite) && this.phone_ring) {
                    this.phone_ring = false;
                    this.children[1].highlight_sprite.destroy();

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
                }
            },
            this.parent_scene
        );
    }

    destroy() {
        super.destroy();

        this.bubbles.destroy();
    }
}
