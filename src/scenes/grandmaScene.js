import Phaser from "phaser";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";

export const GrandmaCards = {
    LIVING_ROOM: 0,
    RADIO: 1,
    CALENDAR: 2
};

const NUM_CARDS = 3;

export class GrandmaScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({key: 'Grandma'});

        this.grandmaCard = new Card(this, [
            new Background(
                this,
                "sprites/GrandmaScene/bg.jpg",
                "grandmaBG"
            ),
            new CardObject(
                this,
                { name: "furniture", url: "sprites/GrandmaScene/furniture.png" },
                new Phaser.Math.Vector2(1025, 1325)
            ),
            new CardObject(
                this,
                { name: "book_01", url: "sprites/GrandmaScene/books_01.png" },
                new Phaser.Math.Vector2(799, 919),
                () => {},
                null,
                -1,
                { name: "book_01_h", url: "sprites/GrandmaScene/books_01_h.png" }
            ),
            new CardObject(
                this,
                { name: "book_02", url: "sprites/GrandmaScene/books_02.png" },
                new Phaser.Math.Vector2(799, 1207),
                () => {},
                null,
                -1,
                { name: "book_02_h", url: "sprites/GrandmaScene/books_02_h.png" }
            ),
            new CardObject(
                this,
                { name: "book_03", url: "sprites/GrandmaScene/books_03.png" },
                new Phaser.Math.Vector2(799, 1459),
                () => {},
                null,
                -1,
                { name: "book_03_h", url: "sprites/GrandmaScene/books_03_h.png" }
            ),
            new CardObject(
                this,
                { name: "radio", url: "sprites/GrandmaScene/radio.png" },
                new Phaser.Math.Vector2(788, 1693),
                () => {},
                null,
                -1,
                { name: "radio_h", url: "sprites/GrandmaScene/radio_h.png" }
            ),
            new CardObject(
                this,
                { name: "calendar", url: "sprites/GrandmaScene/calendar.png" },
                new Phaser.Math.Vector2(768, 1986),
                () => {},
                null,
                -1,
                { name: "calendar_h", url: "sprites/GrandmaScene/calendar_h.png" }
            ),
            new CardObject(
                this,
                { name: "grandma", url: "sprites/GrandmaScene/grandma_idle.png" },
                new Phaser.Math.Vector2(1262, 1918)
            ),
            new CardObject(
                this,
                { name: "coffee_table", url: "sprites/GrandmaScene/coffee_table.png" },
                new Phaser.Math.Vector2(1781, 2289)
            )
        ]);

        this.cards = [
            this.grandmaCard
        ];

        this.current_card = this.grandmaCard;
        this.card_idx = GrandmaCards.LIVING_ROOM;
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data { cardIdx, clothes, food }
     */
    init(data) {
        //Check if any saved data exists
        if(data) {}
    }

    /**
     * @brief preload all of the elements of all of the cards 
     * that will be shown in the scene
     */
    preload() {
        this.cards.forEach(card => card.preload());
    }

    /**
     * @brief create all of the elements of the first card
     * in the scene.
     */
    create() {
        if(this.current_card.isLoaded()) {
            this.current_card.create();
        }

        //Update the saved data
        player.cur_scene = Scenes.GRANDMA;
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
        //Notify the current card if it is interested
        if(this.current_card.isDialogueSensitive()) {
            this.current_card.notifyDialogueEnd();
        }
    }

    /**
     * @brief moves to the next card
     * @param {Number} choice the choice that was made
     */
    nextCard() {
    }

    nextScene() {
        this.scene.start("Building", {
            mainMenu: false,
            stage: 2,
            windows: {
                damien: WindowState.OFF,
                grandma: WindowState.OFF,
                family: WindowState.OFF,
                indep: WindowState.ON
            },
            month: Months.MARCH,
            nextScene: {
                damien: null,
                grandma: null,
                family: null,
                indep: null
            }
        });
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}