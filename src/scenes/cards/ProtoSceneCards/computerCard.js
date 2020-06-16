import Phaser from "phaser";
import { Background } from "../../objects/background";
import { ProtoGuy, ProtoGuyCard } from "../../../characters/protoGuy";
import { CardObject } from "../../objects/cardObject";
import { Card } from "../card";
import { DialogueState } from "../../../core/dialogueController";

const CLASS_ID = "zoom";

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
            new Background(parent_scene, "sprites/ProtoScene/ComputerCard/base.jpg", "ComputerBG"),
            new ProtoGuy(parent_scene, 1345, 1535, ProtoGuyCard.COMPUTER),
            new CardObject(
                parent_scene,
                { name: "Bureau", url: "sprites/ProtoScene/ComputerCard/bureau.png" },
                new Phaser.Math.Vector2(1025, 1610)
            ),
            new CardObject(
                parent_scene,
                { name: "toast", url: "sprites/ProtoScene/ComputerCard/toast.png" },
                new Phaser.Math.Vector2(1700, 2550)
            ),
            new CardObject(
                parent_scene,
                { name: "yogourt", url: "sprites/ProtoScene/ComputerCard/yogourt.png" },
                new Phaser.Math.Vector2(1700, 2550)
            ),
            new CardObject(
                parent_scene,
                { name: "verre", url: "sprites/ProtoScene/ComputerCard/verre.png" },
                new Phaser.Math.Vector2(1700, 2550)
            )
        ];

        //Call base constructor
        super(parent_scene, children);
    }

    /**
     * @brief Creates the card and shows the text
     */
    create() {
        super.create();

        //Show the dialogue
        this.parent_scene.dialogue.display(CLASS_ID);
    }

    /**
     * @brief Shows one of the items
     * @param {Number} choice the choice that was made to get here
     */
    showItem(choice) {
        let destructs = [];
        switch(choice) {
            case 0:
                destructs = [this.children[4], this.children[5]];
                destructs.forEach(child => child.destroy());
                break;
            
            case 1:
                destructs = [this.children[3], this.children[5]];
                destructs.forEach(child => child.destroy());
                break;

            case 2:
                destructs = [this.children[3], this.children[4]];
                destructs.forEach(child => child.destroy());
                break;

            default:
                destructs = [this.children[3], this.children[4], this.children[5]];
                destructs.forEach(child => child.destroy());
                break;
        }
    }

    /**
     * @brief Updates the sate of the card
     */
    update() {
        super.update();

        //Check if it's time to move to the next scene
        if(this.parent_scene.dialogue.getState() === DialogueState.DONE) {
            this.endCard();
            this.parent_scene.nextCard();
        }
    }
}