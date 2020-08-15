import Phaser from "phaser";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { DialogueController } from "../core/dialogueController.js";

export class GrandmaEndScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.GRANDMA_END });

        this.livingRoomEndCard = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/GrandmaScene/bg.jpg",
                    "grandmaBG"
                ),
                new CardObject(
                    this,
                    { name: "furniture_end", url: "sprites/GrandmaScene/furniture.png" },
                    new Phaser.Math.Vector2(0, -23)
                ),
                new CardObject(
                    this,
                    { name: "book_01_end", url: "sprites/GrandmaScene/books_01.png" },
                    new Phaser.Math.Vector2(-131, -262)
                ),
                new CardObject(
                    this,
                    { name: "book_02_end", url: "sprites/GrandmaScene/books_02.png" },
                    new Phaser.Math.Vector2(-134, -92)
                ),
                new CardObject(
                    this,
                    { name: "book_03_end", url: "sprites/GrandmaScene/books_03.png" },
                    new Phaser.Math.Vector2(-131, 57)
                ),
                new CardObject(
                    this,
                    { name: "radio_end", url: "sprites/GrandmaScene/radio.png" },
                    new Phaser.Math.Vector2(-141, 193)
                ),
                new CardObject(
                    this,
                    { name: "calendar_end", url: "sprites/GrandmaScene/calendar.png" },
                    new Phaser.Math.Vector2(-150, 363)
                ), 
                new CardObject(
                    this,
                    { name: "grandma_phone_end", url: "sprites/GrandmaScene/grandma_phone.png" },
                    new Phaser.Math.Vector2(139, 324)
                ),
                new CardObject(
                    this,
                    { name: "coffee_table_end", url: "sprites/GrandmaScene/coffee_table.png" },
                    new Phaser.Math.Vector2(443, 542)
                )
            ]
        );

        this.cards = [
            this.livingRoomEndCard
        ];

        this.current_card = this.livingRoomEndCard;

        this.dialogue = new DialogueController(this, "grandmaDialogJune");
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data { cardIdx, month }
     */
    init(data) {
    }

    /**
     * @brief preload all of the elements of all of the cards
     * that will be shown in the scene
     */
    preload() {
        //Preload the dialogue controller
        this.dialogue.preload();

        //Preload all of the cards
        this.cards.forEach(card => card.preload());
    }

    /**
     * @brief create all of the elements of the first card
     * in the scene.
     */
    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);

        if(this.current_card.isLoaded()) {
            this.current_card.create();
        }

        //Update the saved data
        player.cur_scene = Scenes.GRANDMA;

        //Show the radio dialogue
        this.dialogue.display("sophie");

        //Save the new game state
        player.saveGame();
    }

    /**
     * @brief Ends the current card
     */
    endCard() {
        this.current_card.endCard();
    }

    /**
     * @brief Notifies the current card that the dialogue has ended
     */
    notifyDialogueEnd() {
        this.nextScene();
    }

    /**
     * @brief Notifies the current card that the dialogue objective was met
     */
    notifyObjectiveMet(status) {
    }

    /**
     * @brief moves to the next card
     * @param {GrandmaCards} card the next card to show
     */
    nextCard(card) {
    }

    nextScene() {
        this.cameras.main.fadeOut(1000);
        this.scene.start(Scenes.STATS);
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}
