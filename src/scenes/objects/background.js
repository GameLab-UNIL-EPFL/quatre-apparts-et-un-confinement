import Phaser from "phaser";

/**
 * @brief Models any background of any scene
 */
export class Background {
    /**
     * @brief Constructs the background of a given scene
     * @param {Phaser.Scene} parent_scene the scene in which the background is contained
     * @param {string} url, absolute path to the background image to display
     */
    constructor(parent_scene, url, name) {
        //Initilaize attributes
        this.url = url;
        this.name = name;
        this.parent_scene = parent_scene;
    }

    /**
     * @brief Loads the background image from memory
     */
    preload() {
        this.parent_scene.load.image(this.name, this.url);
    }

    /**
     * @brief Creates and places the background image in the scene
     */
    create() {
        this.sprite = this.parent_scene.add.image(0, 0, this.name);
        this.sprite.setOrigin(0, 0);
    }

    update() {}
}