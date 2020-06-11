import Phaser from "phaser";
import { Background } from "../../objects/background";
import { Phone } from "../../objects/ProtoSceneObjects/phone";
import { ProtoGuy, ProtoGuyCard } from "../../../characters/protoGuy";
import { DialogueController, DialogueState } from "../../../core/dialogueController";
import { Closet } from "../../objects/ProtoSceneObjects/closet";
import { Kitchen } from "../../objects/ProtoSceneObjects/kitchen";

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent 
 * a given interactive moment in a scene
 */
export class ChosePathCard {
    /**
     * @brief Constructs a group of objects in the scene
     * @param parent_scene, the Scene which this card belongs to
     * @param {array} children, the objects that are in the card
     * represented as an array of pairs (name, imageurl)
     */
    constructor(parent_scene) {
        //Initialize children array
        let children = [
            new Background(parent_scene, "/sprites/ProtoScene/ChosePathCard/bg.png", "choseBG"),
            new Kitchen(parent_scene, 1418, 1260),
            new Closet(parent_scene, 460, 1340),
            new ProtoGuy(parent_scene, 1270, 2080, ProtoGuyCard.CHOSE_PATH)
        ];

        //Initialize attributes
        this.id = 0;
        this.children = children;
        this.parent_scene = parent_scene;
        this.isLoaded = false;
        this.isDone = false;
    }

    /**
     * @brief Preloads all of the elements in the group
     * Assumes that all objects are images
     */
    preload() {
        console.log("PRELOAD");
        this.children.forEach(child => child.preload());
    }

    /**
     * @brief Creates all of the elements in the group
     * Assumes that all objects are images
     */
    create() {
        this.children.forEach(child => {
            let sprite = child.create();
            console.log("CREATE");
        });

        this.isLoaded = true;
        this.isDone = true;
    }

    /**
     * @brief Updates the sate of the card
     */
    update() {
        this.children.forEach(child => child.update());
    }

    /**
     * @breif Unloads all the different elements of the card from memory
     */
    destroy() {
        this.children.forEach(child => child.destroy());
    }
}