import Phaser from "phaser";
import { Background } from "../../objects/background";
import { Phone } from "../../objects/ProtoSceneObjects/phone";
import { ProtoGuy } from "../../../characters/protoGuy";

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent 
 * a given interactive moment in a scene
 */
export class WakeUpCard {

    /**
     * @brief Constructs a group of objects in the scene
     * @param parent_scene, the Scene which this card belongs to
     * @param {array} children, the objects that are in the card
     * represented as an array of pairs (name, imageurl)
     */
    constructor(parent_scene) {
        //Initialize children array
        let children = [
            new Background(parent_scene, "/sprites/ProtoScene/WakeUpCard/bg.jpg", "WakeUpBG"),
            new Phone(parent_scene, 630, 1400),
            new ProtoGuy(parent_scene, 1528, 1750)
        ];

        //Initialize attributes
        this.id = 0;
        this.children = children;
        this.parent_scene = parent_scene;
    }

    /**
     * @brief Preloads all of the elements in the group
     * Assumes that all objects are images
     */
    preload() {
        this.children.forEach(child => child.preload());
    }

    /**
     * @brief Creates all of the elements in the group
     * Assumes that all objects are images
     */
    create() {
        this.children.forEach(child => child.create());
    }

    /**
     * @brief Updates the sate of the card
     * @return the ID of the next card, -1 if it's not time to change cards yet
     */
    update() {
        this.children.forEach(child => child.update());
        return -1;
    }
}