import Phaser from "phaser";
import { IntroScene } from "../scenes/introScene";

const Scenes = {
    INTRO: 'intro',
    PROTOTYPE: 'proto'
};

const Characters = {
    PROTO_GUY: 'proto_guy'
}

/**
 * @brief Represent the interface between the player and the game
 */
export class Player {
    /**
     * @brief Constructor for the player class
     */
    constructor(narractionTree) {
        this.cur_character = Characters.PROTO_GUY;
        this.cur_scene = Scenes.INTRO;
        this.narraction_tree = narractionTree;
    }
}