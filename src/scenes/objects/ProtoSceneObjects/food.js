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
        this.foodType = foodType;

        switch(foodType) {
            case FoodType.TOAST:
                this.name = "toast";
                this.url = "/sprites/ProtoScene/ComputerCard/toast.png";
                break;

            case FoodType.YOGHURT:
                this.name = "yogourt";
                this.url = "/sprites/ProtoScene/ComputerCard/yogourt.png";
                break;

            case FoodType.WATER:
                this.name = "verre";
                this.url = "/sprites/ProtoScene/ComputerCard/verre.png";
                break;

            case FoodType.NONE:
                break;

            default:
                break;
        }
        
        this.x = x;
        this.y = y;
    }

    /**
     * @brief Loads up the correct sprite depending on the player's previous choice
     */
    preload() {
        //Only load an image if there is one
        if(this.foodType != FoodType.NONE) {
            this.parent_scene.load.image(this.name, this.url);
        }
    }

    /**
     * @brief Creates the food depending on what the player retrieved
     * from the kitchen in the previous card
     */
    create() {
        //Only create a sprite if an image has been loaded
        if(this.foodType != FoodType.NONE) {
            this.sprite = this.parent_scene.add.image(this.x, this.y, this.name);
        }
    }

    /**
     * @brief Makes the current item invisible
     */
    invisible() {
        if(this.foodType != FoodType.NONE) {
            this.sprite.visible = false;
        }
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