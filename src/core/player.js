import Phaser from "phaser";
import { IntroScene } from "../scenes/introScene";

/**
 * @brief Represent the interface between the player and the game
 */
export class Player {
    /**
     * @brief Constructor for the player class
     */
    constructor(narractionTree) {
        this.cur_character = null;
        this.cur_scene = new IntroScene();
        this.narraction_tree = narractionTree;
    }
}