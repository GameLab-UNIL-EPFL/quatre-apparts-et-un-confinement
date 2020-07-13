import Phaser from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";

export const IndepCards = {
    IDLE_CARD: 0,
    PHONE_CARD: 1
};

const NUM_CARDS = 2;

export class IndepScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.INDEP });

        this.idle_card = new Card(this, [
                new Background(
                    this,
                    "sprites/IndepScene/01_IDLE/bg.jpg",
                    "indepIdleBG"
                ),
                new CardObject(
                    this,
                    { name: "indepIdleDesk", url: "sprites/IndepScene/01_IDLE/desk.png" },
                    new Phaser.Math.Vector2(55, 31)
                ),
                new CardObject(
                    this,
                    { name: "indepIdleChair", url: "sprites/IndepScene/01_IDLE/chair.png" },
                    new Phaser.Math.Vector2(101, 132)
                ),
                new CardObject(
                    this,
                    { name: "indepIdleCouch", url: "sprites/IndepScene/01_IDLE/couch.png" },
                    new Phaser.Math.Vector2(229, 234)
                ),
                new CardObject(
                    this,
                    { name: "indepIdleGuy", url: "sprites/IndepScene/01_IDLE/indep.png" },
                    new Phaser.Math.Vector2(216, 77)
                ),
                new CardObject(
                    this,
                    { name: "indepIdleGuyPhone", url: "sprites/IndepScene/01_IDLE/indep_phone.png" },
                    new Phaser.Math.Vector2(216, 77)
                ),
                new CardObject(
                    this,
                    { name: "indepIdleTable", url: "sprites/IndepScene/01_IDLE/table.png" },
                    new Phaser.Math.Vector2(66, 464)
                ),
                new CardObject(
                    this,
                    { name: "indepIdlePhone", url: "sprites/IndepScene/01_IDLE/phone.png" },
                    new Phaser.Math.Vector2(161, 374)
                ),
                new CardObject(
                    this,
                    { name: "indepIdleBigPlant", url: "sprites/IndepScene/01_IDLE/big_plant.png" },
                    new Phaser.Math.Vector2(-490, 114)
                ),
                new CardObject(
                    this,
                    { name: "indepIdleTV", url: "sprites/IndepScene/01_IDLE/tv.png" },
                    new Phaser.Math.Vector2(-189, 460)
                ),
                new CardObject(
                    this,
                    { name: "indepIdlePlant", url: "sprites/IndepScene/01_IDLE/plant.png" },
                    new Phaser.Math.Vector2(513, 637)
                ),
            ],
            null,
            true
        );

        this.phone_card = new Card(this, [
                new Background(
                    this,
                    "sprites/IndepScene/02_Messages/bg.png",
                    "indepPhoneBG"
                ),
                new CardObject(
                    this,
                    { name: "indepPhoneDesk", url: "sprites/IndepScene/02_Messages/desk.png" },
                    new Phaser.Math.Vector2(53, 22)
                ),
                new CardObject(
                    this,
                    { name: "indepPhoneCouch", url: "sprites/IndepScene/02_Messages/couch.png" },
                    new Phaser.Math.Vector2(397, 236)
                ),
                new CardObject(
                    this,
                    { name: "indepPhoneGuyPhone", url: "sprites/IndepScene/02_Messages/indepPhone.png" },
                    new Phaser.Math.Vector2(380, 44)
                ),
                new CardObject(
                    this,
                    { name: "indepPhoneTable", url: "sprites/IndepScene/02_Messages/table.png" },
                    new Phaser.Math.Vector2(77, 473)
                ),
                new CardObject(
                    this,
                    { name: "indepPhoneBigPlant", url: "sprites/IndepScene/02_Messages/big_plant.png" },
                    new Phaser.Math.Vector2(-490, 114)
                ),
                new CardObject(
                    this,
                    { name: "indepPhoneTV", url: "sprites/IndepScene/02_Messages/tv.png" },
                    new Phaser.Math.Vector2(-185, 438)
                ),
                new CardObject(
                    this,
                    { name: "indepPhonePlant", url: "sprites/IndepScene/02_Messages/plant.png" },
                    new Phaser.Math.Vector2(513, 637)
                ),
                new CardObject(
                    this,
                    { name: "indepPhoneScreen", url: "sprites/IndepScene/02_Messages/phone_screen.png" },
                    new Phaser.Math.Vector2(-59, 343)
                ),
            ],
            null,
            true
        );

        this.cards = [
            this.idle_card,
            this.phone_card
        ];

        //Keep track of wich card is displayed
        this.cardIdx = IndepCards.PHONE_CARD;
        this.current_card = this.phone_card;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this);
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data { cardIdx }
     */
    init(data) {
        //Check if any saved data exists
        if(data) {

            //Set the correct card
            switch(data.cardIdx) {
                case IndepCards.IDLE_CARD:
                    this.cardIdx = IndepCards.IDLE_CARD;
                    this.current_card = this.idle_card;
                    break;

                case IndepCards.PHONE_CARD:
                    this.cardIdx = IndepCards.PHONE_CARD;
                    this.current_card = this.phone_card;
                    break;

                default:
                    break;
            }
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
        if(this.cardIdx === IndepCards.IDLE_CARD) {
            this.idle_card.preload();
        } else {
            this.phone_card.preload();
        }
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

            if(this.cardIdx === IndepCards.IDLE_CARD) {
                //Initially hide the phone guy sprite
                this.current_card.children[5].sprite.setActive(false).setVisible(false);
            }
        }

        //Update the saved data
        player.cur_scene = Scenes.INDEP;

        //Data that will be saved
        const savable_data = {
            cardIdx: this.cardIdx
        };

        player.setData(savable_data);
        player.saveGame();
    }

    /**
     * @brief Update the scene
     */
    update() {
        if(this.current_card.isLoaded()) {
            this.current_card.update();
        }
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
    nextCard(choice=-1) {

        //Data that will be saved
        let savable_data = {
            cardIdx: this.cardIdx
        };

        if(this.current_card.isDone()) {
            this.current_card.destroy();

            //Move on to the next scene
            this.nextScene(this.current_card);
        }

        //Store the saved data
        player.setData(savable_data);
        player.saveGame();
    }

    /**
     * @brief Triggers the next scene
     * @param {HallwayCards} cardIdx 
     */
    nextScene(cardIdx) {
        let data;
        switch(data.cardIdx) {
            case IndepCards.IDLE_CARD:
                data = {
                    mainMenu: false,
                    stage: 3,
                    windows: {
                        damien: WindowState.OFF,
                        grandma: WindowState.OFF,
                        family: WindowState.OFF,
                        indep: WindowState.OFF
                    },
                    month: Months.MARCH,
                    nextScene: {
                        damien: null,
                        grandma: null,
                        family: null,
                        indep: null
                    }
                }
                break;

            case IndepCards.PHONE_CARD:
                data = {
                    mainMenu: false,
                    stage: 3,
                    windows: {
                        damien: WindowState.OFF,
                        grandma: WindowState.OFF,
                        family: WindowState.OFF,
                        indep: WindowState.OFF
                    },
                    month: Months.MARCH,
                    nextScene: {
                        damien: null,
                        grandma: null,
                        family: null,
                        indep: null
                    }
                }
                break;

            default:
                break;
        }

        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.BUILDING, data),
            this
        );        
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}