import Phaser from "phaser";

export const FoodType = {
    TOAST: 0,
    YOGHURT: 1,
    WATER: 2,
    NONE: 3
};

/**
 * @breif Models the food that the ProtoGuy can get from the kitchen
 */
export class Food {
    /**
     * 
     * @param {Phaser.Scene} parent_scene, the scene in which the food is contained
     * @param {int} x, the x position of the food in the scene
     * @param {int} y, the y position of the food in the scene
     * @param {FoodType} foodType, the type of food in that was selected
     */
    constructor(parent_scene, x, y, foodType) {
        this.parent_scene = parent_scene;

        this.name = "toast";
        this.url = "/sprites/ProtoScene/ComputerCard/toast.png";

        this.x = x;
        this.y = y;
    }

    /**
     * @brief Loads up the correct sprite depending on the player's previous choice
     */
    preload() {
        this.parent_scene.load.image(this.name, this.url);
    }

    /**
     * @brief Creates the food depending on what the player retrieved
     * from the kitchen in the previous card
     */
    create() {
        this.sprite = this.parent_scene.add.image(this.x, this.y, this.name);
    }

    /**
     * Does nothing intentionnally
     */
    update() {}

    /**
     * @breif Unloads the sprite from memory
     */
    destroy() {
        this.sprite.destroy();
    }
} 