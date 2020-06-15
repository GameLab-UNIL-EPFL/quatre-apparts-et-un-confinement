import Phaser from "phaser";
import { Background } from "../../objects/background";
import { ProtoGuy, ProtoGuyCard } from "../../../characters/protoGuy";
import { DialogueState } from "../../../core/dialogueController";
import { Food, FoodType } from "../../objects/ProtoSceneObjects/food";
import { CardObject } from "../../objects/cardObject";
import { Card } from "../card";

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent 
 * a given interactive moment in a scene
 */
export class ComputerCard extends Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param {Phaser.Scene} parent_scene, the Scene which this card belongs to
     */
    constructor(parent_scene) {
        //Initialize children array
        let children = [
            new Background(parent_scene, "/sprites/ProtoScene/ComputerCard/base.jpg", "ComputerBG"),
            new ProtoGuy(parent_scene, 1345, 1530, ProtoGuyCard.COMPUTER),
            new CardObject(
                parent_scene,
                "Bureau",
                "/sprites/ProtoScene/ComputerCard/bureau.png",
                new Phaser.Math.Vector2(1025, 1610),
                false
            ),
            new Food(parent_scene, 1700, 2550, FoodType.NONE)
        ];

        //Call base constructor
        super(parent_scene, children);
    }
    /**
     * @brief Updates the sate of the card
     */
    update() {
        super.update();

        //Check if it's time to move to the next scene
        if(this.parent_scene.dialogue.getState() == DialogueState.DONE) {
            this.parent_scene.nextCard();
        }
    }
}