import { Card } from "../card";

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent
 * a given interactive moment in a scene
 */
export class SizeTestCard extends Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param parent_scene, the Scene which this card belongs to
     */
    constructor(parent_scene) {
        super(parent_scene, []);

        //Initialize children array
        this.name = "Intro";
        this.url = "sprites/test-scaled-delivery/sample@x3-borders.jpg";
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

        console.log('Current horizontal ratio:', window.horizontalRatio)

        //Create and place the temp image correctly
        // origine centrée
        this.sprite = this.parent_scene.add.image(this.parent_scene.scale.baseSize.width/2, this.parent_scene.scale.baseSize.height/2, this.name);

        // ou origine à gauche
        // this.sprite = this.parent_scene.add.image(0, 0, this.name);
        // this.sprite.setOrigin(0, 0);

        this.sprite.setInteractive();

        //Make said image interactive
        this.parent_scene.input.on(
            'gameobjectdown',
            (_, gameObject) => {
                if(gameObject === this.sprite) {
                    this.parent_scene.endCard();
                    this.parent_scene.nextCard();
                }
            },
            this.parent_scene
        );
    }

    /**
     * @brief Unloads all the different elements of the card from memory
     */
    destroy() {
        super.destroy();

        //Destroy the temp image
        this.sprite.destroy();
    }
}