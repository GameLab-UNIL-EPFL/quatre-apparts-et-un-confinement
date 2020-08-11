import { Background } from "../../objects/background";
import { ProtoGuy, ProtoGuyCard } from "../../../characters/protoGuy";
import { Card } from "../card";
import { CardObject } from "../../objects/cardObject";

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent
 * a given interactive moment in a scene
 */
export class MessageCard extends Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param parent_scene, the Scene which this card belongs to
     */
    constructor(parent_scene) {
        //Store the card's character
        let character = new ProtoGuy(parent_scene, 1, -1, ProtoGuyCard.MESSAGE);

        //Initialize children array
        let children = [
            new Background(parent_scene, "sprites/StudentScene/MessageCard/bg.png", "MessageBG"),
            character,
            new CardObject(
                parent_scene,
                { name: "phone-cover", url: "sprites/StudentScene/MessageCard/phone.png" },
                new Phaser.Math.Vector2(-2, 289)
            )
        ];

        //Call base constructor
        super(parent_scene, children, character, true);
    }

    /**
     * @brief Ends the card by moving on to the next scene
     */
    notifyDialogueEnd() {
        this.parent_scene.nextScene();
    }

    preload() {
        super.preload();
        
        this.parent_scene.dialogue.preloadMessages();
    }

    /**
     * @brief Sets all of the animations related to the objects in the card
     */
    create() {
        super.create();

        this.message = this.parent_scene.sound.add("newMessage");
        this.message.play();

        
        this.parent_scene.dialogue.createMessageBG();
        this.parent_scene.dialogue.displayMessage("hello", true);
    }
}
