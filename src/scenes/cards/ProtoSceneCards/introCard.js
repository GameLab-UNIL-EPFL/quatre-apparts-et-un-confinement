import { Card } from "../card";

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent 
 * a given interactive moment in a scene
 */
export class IntroCard extends Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param parent_scene, the Scene which this card belongs to
     * @param {array} children, the objects that are in the card
     * represented as an array of pairs (name, imageurl)
     */
    constructor(parent_scene) {
        super(parent_scene, []);

        //Initialize children array
        this.name = "Intro";
        this.url = "/sprites/ProtoScene/IntroBg.png";
    }

    /**
     * @brief Preloads all of the elements in the group
     * Assumes that all objects are images
     */
    preload() {
        super.preload();

        this.parent_scene.load.image(this.name, this.url);
    }

    /**
     * @brief Creates all of the elements in the group
     * Assumes that all objects are images
     */
    create() {
        super.create();

        //Create and place the temp image correctly
        this.sprite = this.parent_scene.add.image(0, 0, this.name);
        this.sprite.setInteractive();
        this.sprite.setScale(5);
        this.sprite.y += 1500;
        this.sprite.x += 1000;

        //Make said image interactive
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
     * @breif Unloads all the different elements of the card from memory
     */
    destroy() {
        super.destroy();

        //Destroy the temp image
        this.sprite.destroy();
    }
}