import Phaser from "phaser";
import { Background } from "../../objects/background";
import { Phone } from "../../objects/ProtoSceneObjects/phone";
import { ProtoGuy, ProtoGuyCard } from "../../../characters/protoGuy";
import { DialogueController, DialogueState } from "../../../core/dialogueController";
import { TiredBubbles } from "../../objects/ProtoSceneObjects/tiredBubbles";

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent 
 * a given interactive moment in a scene
 */
export class IntroCard {
    /**
     * @brief Constructs a group of objects in the scene
     * @param parent_scene, the Scene which this card belongs to
     * @param {array} children, the objects that are in the card
     * represented as an array of pairs (name, imageurl)
     */
    constructor(parent_scene) {
        //Initialize children array
        this.name = "Intro";
        this.url = "/sprites/ProtoScene/IntroBg.png";

        //Initialize attributes
        this.parent_scene = parent_scene;
        this.isLoaded = false;
        this.isDone = true;
    }

    /**
     * @brief Preloads all of the elements in the group
     * Assumes that all objects are images
     */
    preload() {
        this.parent_scene.load.image(this.name, this.url);
    }

    /**
     * @brief Creates all of the elements in the group
     * Assumes that all objects are images
     */
    create() {
        
        this.sprite = this.parent_scene.add.image(0, 0, this.name);
        this.sprite.setInteractive();
        this.sprite.setScale(5);
        this.sprite.y += 1500;
        this.sprite.x += 1000;

        this.parent_scene.input.on(
            'gameobjectdown',
            (pointer, gameObject) => {
                this.parent_scene.nextCard();
            },
            this.parent_scene
        );

        this.isLoaded = true;
        this.isDone = true;
    }

    /**
     * @brief Updates the sate of the card
     */
    update() {}

    /**
     * @breif Unloads all the different elements of the card from memory
     */
    destroy() {
        this.sprite.destroy();
    }
}