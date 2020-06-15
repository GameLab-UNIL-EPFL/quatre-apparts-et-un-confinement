import Phaser from "phaser";
import { CardObject } from "../cardObject";

export const FoodType = {
    TOAST: 0,
    YOGHURT: 1,
    WATER: 2,
    NONE: 3
};

/**
 * @breif Models the food that the ProtoGuy can get from the kitchen
 */
export class Food extends CardObject {
    /**
     * @brief Creates a food object depending on the given food type
     * @param {Phaser.Scene} parent_scene, the scene in which the food is contained
     * @param {int} x, the x position of the food in the scene
     * @param {int} y, the y position of the food in the scene
     * @param {FoodType} foodType, the type of food in that was selected
     */
    constructor(parent_scene, x, y, foodType) {
        let name = "";
        let url = "";

        switch(foodType) {
            case FoodType.TOAST:
                name = "toast";
                url = "/sprites/ProtoScene/ComputerCard/toast.png";
                break;

            case FoodType.YOGHURT:
                name = "yogourt";
                url = "/sprites/ProtoScene/ComputerCard/yogourt.png";
                break;

            case FoodType.WATER:
                name = "verre";
                url = "/sprites/ProtoScene/ComputerCard/verre.png";
                break;

            case FoodType.NONE:
                break;

            default:
                break;
        }

        //Call base constructor
        super(
            parent_scene,
            name,
            url,
            new Phaser.Math.Vector2(x, y),
            false
        );

        this.foodType = foodType;
    }

    /**
     * @brief Loads up the correct sprite depending on the player's previous choice
     */
    preload() {
        //Only load an image if there is one
        if(this.foodType != FoodType.NONE) {
            super.preload();
        }
    }

    /**
     * @brief Creates the food depending on what the player retrieved
     * from the kitchen in the previous card
     */
    create() {
        //Only create a sprite if an image has been loaded
        if(this.foodType != FoodType.NONE) {
            super.create();
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
} 