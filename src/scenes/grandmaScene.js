import Phaser from "phaser";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { LivingRoomCard } from "./cards/GrandmaScene/livingRoomCard.js";
import { DialogueController } from "../core/dialogueController.js";
import { HallwayCards } from "./hallwayScene.js";

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
        super({ key: Scenes.GRANDMA });

        this.livingRoomCard = new LivingRoomCard(this);
        this.radioCard = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/GrandmaScene/Radio/radio_bg.jpg",
                    "radio_bg"
                ),
                new CardObject(
                    this,
                    { name: "radio_radio", url: "sprites/GrandmaScene/Radio/radio_radio.png" },
                    new Phaser.Math.Vector2(-131, -273),
                    (scene) => scene.nextCard(GrandmaCards.LIVING_ROOM),
                    this
                )
            ]
        );

        this.calendarCard = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/GrandmaScene/Calendar/calendar_bg.jpg",
                    "calendar_bg"
                ),
                new CardObject(
                    this,
                    { name: "calendar_calendar", url: "sprites/GrandmaScene/Calendar/calendar_calendar.png" },
                    new Phaser.Math.Vector2(-88, -162),
                    (scene) => scene.nextCard(GrandmaCards.LIVING_ROOM),
                    this
                )
            ]
        );

        this.cards = [
            this.livingRoomCard,
            this.radioCard,
            this.calendarCard
        ];

        this.current_card = this.livingRoomCard;
        this.card_idx = GrandmaCards.LIVING_ROOM;

        //Create the scene's dialogue controller
        this.dialogue = new DialogueController(this, "grandmaDialogMarch");
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data { cardIdx, clothes, food }
     */
    init(data) {
        //Check if any saved data exists
        if(data.cardIdx) {
            this.cardIdx = data.cardIdx;
        }
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
        this.dialogue.display("news");

        //Save the new game state
        player.setData({ cardIdx: GrandmaCards.LIVING_ROOM });
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

        let callback = (scene) => {};

        //Choose which card to show next
        switch(card) {
            case GrandmaCards.LIVING_ROOM:
                this.current_card = this.livingRoomCard;
                break;

            case GrandmaCards.RADIO:
                this.current_card = this.radioCard;
                callback = (scene) => scene.dialogue.display("radio");
                break;

            case GrandmaCards.CALENDAR:
                this.current_card = this.calendarCard;
                callback = (scene) => scene.dialogue.display("calendrier");
                break;
        }

        //Create the new card
        this.current_card.create();

        //Run callback if needed
        callback(this);
    }

    nextScene() {
        this.scene.start(Scenes.HALLWAY, {
            cardIdx: HallwayCards.DAMIEN_CLOSED,
            damien_gone: false
        });
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}
