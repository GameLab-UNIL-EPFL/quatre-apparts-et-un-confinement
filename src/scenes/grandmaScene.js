import Phaser from "phaser";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { LivingRoomCard } from "./cards/GrandmaScene/livingRoomCard.js";
import { DialogueController } from "../core/dialogueController.js";
import { WindowState, Months } from "./buildingScene.js";
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

        this.current_sound = null;
        this.radioSound = null;
        this.radioSound02 = null;
        this.radioMusic = null;

        this.objective = false;
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data { cardIdx, month }
     */
    init(data) {
        //Check if any saved data exists
        if(data.cardIdx) {
            this.cardIdx = data.cardIdx;
        }

        this.month = data.month;
        console.log('Current month:', this.month);

        // load sound after preload()
        this.load.audio("radioSound", "sounds/grandma/" + this.month + "_radio.mp3");
        this.load.audio("radioSound02", "sounds/grandma/" + this.month + "2_radio.mp3");
        this.load.audio("radioMusic", "sounds/grandma/" + this.month + "_music.mp3");

        this.load.on('filecomplete', (file) => {
            if(file === 'radioSound') {
                this.radioSound = this.sound.add('radioSound');
                this.radioSound.play();
                this.current_sound = this.radioSound;
            } else if (file === 'radioSound02') {
                this.radioSound02 = this.sound.add('radioSound02');
            } else if (file === 'radioMusic') {
                this.radioMusic = this.sound.add('radioMusic');
            }
        },
        this);
        this.load.start();

        if(data.month === Months.MARCH) {
            //Create the scene's dialogue controller
            this.dialogue = new DialogueController(this, "grandmaDialogMarch");
        } else if(data.month === Months.APRIL) {
            //Create the scene's dialogue controller
            this.dialogue = new DialogueController(this, "grandmaDialogApril");

            //Change the calendar sprite and name
            this.calendarCard.children[1].name = "calendar_april";
            this.calendarCard.children[1].url = "sprites/GrandmaScene/Calendar/calendrier02_02-calendrier.png";
        } else {
            //Create the scene's dialogue controller
            this.dialogue = new DialogueController(this, "grandmaDialogJune");

            //Change the calendar sprite and name
            this.calendarCard.children[1].name = "calendar_mai";
            this.calendarCard.children[1].url = "sprites/GrandmaScene/Calendar/calendrier03_02-calendrier.png";
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
        player.setData({ cardIdx: GrandmaCards.LIVING_ROOM, month: this.month });
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
     * @brief Notifies the current card that the dialogue objective was met
     */
    notifyObjectiveMet(status) {
        if(this.current_card.notifyObjectiveMet) {
            this.current_card.notifyObjectiveMet(status);
        }
        console.log('Grandmascard radio?', this.card_idx === GrandmaCards.RADIO, this.card_idx);
        if(this.card_idx === GrandmaCards.RADIO) {
            console.log('Radio');
            if(this.radioSound02 !== null) {
                if(this.radioSound !== null) {
                    this.radioSound.stop();
                }
            }
            if(status === 'radio-music') {
                this.current_sound.stop();
                this.radioMusic.play();
                this.current_sound = this.radioMusic;
            } else {
                this.current_sound.stop();
                this.radioSound02.play();
                this.current_sound = this.radioSound02;
            }
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
            this.card_idx = GrandmaCards.LIVING_ROOM;
            break;

        case GrandmaCards.RADIO:
            this.current_card = this.radioCard;
            this.card_idx = GrandmaCards.RADIO;
            callback = (scene) => scene.dialogue.display("radio");
            break;

        case GrandmaCards.CALENDAR:
            this.current_card = this.calendarCard;
            this.card_idx = GrandmaCards.CALENDAR;
            callback = (scene) => scene.dialogue.display("calendrier");
            break;
        }

        //Create the new card
        this.current_card.create();

        //Run callback if needed
        callback(this);
    }

    nextScene() {
        this.cameras.main.fadeOut(1000);
        if(this.current_sound !== null) {
            this.current_sound.stop();
        }

        if(this.month === Months.MARCH) {
            this.scene.start(Scenes.BUILDING, {
                mainMenu: false,
                names: {
                    damien: false,
                    grandma: false,
                    family: false,
                    indep: true
                },
                stage: 1,
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
                    indep: Scenes.INDEP
                }
            });
        } else if(this.month === Months.APRIL) {
            this.scene.start(
                Scenes.HALLWAY,
                { cardIdx: HallwayCards.DAMIEN_CLOSED }
            );
        } else {
            this.scene.start(Scenes.STATS);
        }
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}
