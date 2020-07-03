import Phaser from "phaser";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";
import { LivingRoomCard } from "./cards/GrandmaScene/livingRoomCard.js";

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

        this.livingRoomCard = new LivingRoomCard(this);
        this.radioCard = new Card(this, [
            new Background(
                this,
                "sprites/GrandmaScene/Radio/radio_bg.jpg",
                "radio_bg"
            ),
            new CardObject(
                this,
                { name: "radio_radio", url: "sprites/GrandmaScene/Radio/radio_radio.png" },
                new Phaser.Math.Vector2(795, 900),
                (scene) => scene.nextCard(GrandmaCards.LIVING_ROOM),
                this
            )
        ]);

        this.calendarCard = new Card(this, [
            new Background(
                this,
                "sprites/GrandmaScene/Calendar/calendar_bg.jpg",
                "calendar_bg"
            ),
            new CardObject(
                this,
                { name: "calendar_calendar", url: "sprites/GrandmaScene/Calendar/calendar_calendar.png" },
                new Phaser.Math.Vector2(871, 1113),
                (scene) => scene.nextCard(GrandmaCards.LIVING_ROOM),
                this
            )
        ]);

        this.cards = [
            this.livingRoomCard,
            this.radioCard,
            this.calendarCard
        ];

        this.current_card = this.livingRoomCard;
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
     * @param {GrandmaCards} card the next card to show
     */
    nextCard(card) {
        //Destroy the current card
        this.current_card.destroy();

        //Choose which card to show next
        switch(card) {
            case GrandmaCards.LIVING_ROOM:
                this.current_card = this.livingRoomCard;
                break;

            case GrandmaCards.RADIO:
                this.current_card = this.radioCard;
                break;

            case GrandmaCards.CALENDAR:
                this.current_card = this.calendarCard;
                break;
        }

        //Create the new card
        this.current_card.create();
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