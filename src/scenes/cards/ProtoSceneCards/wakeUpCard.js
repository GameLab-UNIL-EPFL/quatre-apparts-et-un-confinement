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
        let children = [
            ("girl", "/sprites/characters/test_personnage_1.png"),
            ("bgBed", "/sprites/characters/BGProtoBed.jpg")
        ];

        this.id = 0;
        this.children = children;
        this.parent_scene = parent_scene;
    }

    /**
     * @brief Preloads all of the elements in the group
     * Assumes that all objects are images
     */
    preload() {
        this.parent_scene.load.image("bgBed", "/sprites/BGProtoBed.jpg");
    }

    /**
     * @brief Creates all of the elements in the group
     * Assumes that all objects are images
     */
    create() {
        this.bg = this.parent_scene.add.image(0, 0, "bgBed");
        this.bg.setOrigin(0, 0);
     
     
        this.bg.setScale(1);
    }

    /**
     * @brief Updates the sate of the card
     * @return the ID of the next card, -1 if it's not time to change cards yet
     */
    update() {
        return -1;
    }
}