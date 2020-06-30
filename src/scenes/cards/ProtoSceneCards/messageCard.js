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
        let character = new ProtoGuy(parent_scene, 1035, 1350, ProtoGuyCard.MESSAGE);

        //Initialize children array
        let children = [
            new Background(parent_scene, "sprites/ProtoScene/MessageCard/bg.png", "MessageBG"),
            character,
            new CardObject(
                parent_scene,
                { name: "phone-cover", url: "sprites/ProtoScene/MessageCard/phone.png" },
                new Phaser.Math.Vector2(1020, 1857)
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

        //Load in the phone message sprites
        this.parent_scene.load.image("promptBox", "sprites/UI/Messages/SelectionMessage.png");
        this.parent_scene.load.image("sentMsg1", "sprites/UI/Messages/SendMessage_01.png");
        this.parent_scene.load.image("sentMsg2", "sprites/UI/Messages/SendMessage_02.png");
        this.parent_scene.load.image("sentMsg3", "sprites/UI/Messages/SendMessage_03.png");
        this.parent_scene.load.image("sentMsg4", "sprites/UI/Messages/SendMessage_04.png");
        this.parent_scene.load.image("recievedMsg1", "sprites/UI/Messages/ReceivedMessage_01.png");
        this.parent_scene.load.image("recievedMsg2", "sprites/UI/Messages/ReceivedMessage_02.png");
        this.parent_scene.load.image("recievedMsg3", "sprites/UI/Messages/ReceivedMessage_03.png");
        this.parent_scene.load.image("recievedMsg4", "sprites/UI/Messages/ReceivedMessage_04.png");
        this.parent_scene.load.image("typing", "sprites/UI/Messages/TappingMessage_05.png");
    }

    /**
     * @brief Sets all of the animations related to the objects in the card
     */
    create() {
        super.create();

        //Create dialogue background
        const bg = new Phaser.Geom.Rectangle(
            0, 
            0, 
            5000, 
            5000
        );
        const prompt_sprite = this.parent_scene.add.graphics({ fillStyle: { color: 0xf8f2df }});
        prompt_sprite.fillRectShape(bg);

        prompt_sprite.setDepth(-2);

        //Create the prompt box
        this.parent_scene.add.image(1009, 2421, "promptBox");

        this.parent_scene.dialogue.displayMessage("sortir", true);
    }
}