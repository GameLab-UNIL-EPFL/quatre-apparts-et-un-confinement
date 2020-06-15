import Phaser from "phaser";
import { CardObject } from "../cardObject";

const BubbleState = {
    UP: 0,
    DOWN: 1
}

const MAX_UP = 100;

export class TiredBubbles extends CardObject {
    /**
     * @brief Creates the tired bubbles as a custom card object
     * @param {Phaser.Scene} parent_scene, the scene in which the phone is contained 
     * @param {Number} x, the bubbles's x position in the scene
     * @param {Number} y, the bubbles's y position in the scene
     */
    constructor(parent_scene, x, y) {
        //Call the base constructor
        super(
            parent_scene,
            "bubbles", 
            "/sprites/ProtoScene/WakeUpCard/tired_bubbles.png",
            new Phaser.Math.Vector2(x, y),
            false
        );

        this.cur_state = BubbleState.UP;

        //Counter for the state animation
        this.go_up = 0;
    }

    /**
     * @brief Animates the bubbles
     */
    update() {
        switch(this.cur_state) {
            case BubbleState.UP:
                this.sprite.y -= 0.2;
                this.go_up++;

                if(this.go_up >= MAX_UP) {
                    this.cur_state = BubbleState.DOWN;
                }
                break;
            case BubbleState.DOWN:
                this.sprite.y += 0.2;
                this.go_up--;

                if(this.go_up <= 0) {
                    this.cur_state = BubbleState.UP;
                }
                break;

            default:
                break;
        }
    }
} 