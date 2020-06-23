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
        //Initialize children array
        let children = [
            new Background(parent_scene, "sprites/ProtoScene/MessageCard/bg.png", "MessageBG"),
            new ProtoGuy(parent_scene, 1035, 1350, ProtoGuyCard.MESSAGE),
            new CardObject(
                parent_scene,
                { name: "phone-cover", url: "sprites/ProtoScene/MessageCard/phone.png" },
                new Phaser.Math.Vector2(1020, 1857)
            )
        ];

        //Call base constructor
        super(parent_scene, children);
    }

    preload() {
        super.preload();
    }

    /**
     * @brief Sets all of the animations related to the objects in the card
     */
    create() {
        super.create();

    }

    /**
     * @brief Updates the sate of the card
     */
    update() {
        super.update();
    }
}