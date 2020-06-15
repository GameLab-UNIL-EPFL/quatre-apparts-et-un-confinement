import { Background } from "../../objects/background";
import { Phone } from "../../objects/ProtoSceneObjects/phone";
import { ProtoGuy, ProtoGuyCard } from "../../../characters/protoGuy";
import { DialogueState } from "../../../core/dialogueController";
import { TiredBubbles } from "../../objects/ProtoSceneObjects/tiredBubbles";
import { Card } from "../card";

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent 
 * a given interactive moment in a scene
 */
export class WakeUpCard extends Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param parent_scene, the Scene which this card belongs to
     */
    constructor(parent_scene) {
        //Initialize children array
        let children = [
            new Background(parent_scene, "/sprites/ProtoScene/WakeUpCard/bg.jpg", "WakeUpBG"),
            new Phone(parent_scene, 630, 1400),
            new ProtoGuy(parent_scene, 1528, 1750, ProtoGuyCard.WAKE_UP),
            new TiredBubbles(parent_scene, 1455, 550)
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
            this.isDone = true;
        }
    }
}