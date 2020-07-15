import Phaser from "phaser";
import { WakeUpCard } from "./cards/ProtoSceneCards/wakeUpCard.js";
import { DialogueController } from "../core/dialogueController.js";
import { IntroCard } from "./cards/ProtoSceneCards/introCard.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { ProtoGuy, ProtoGuyCard } from "../characters/protoGuy.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";

export const ProtoCards = {
    INTRO: 0,
    WAKE_UP: 1,
    CHOSE_PATH: 2,
    CLOTHES: 3,
    KITCHEN: 4,
    COMPUTER: 5,
    MINI_GAME: 6,
    MESSAGE: 7
};
const NUM_CARDS = 8;

export const ProtoGuyClothes = {
    PYJAMAS: 0,
    CLEAN_CLOTHES: 1,
    YESTERDAY_CLOTHES: 2
};

export class ProtoScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.PROTOTYPE });

        //Keep track of the clothes that protoguy is wearing
        this.clothes = ProtoGuyClothes.PYJAMAS;

        //Create all of the cards
        this.introCard = new IntroCard(this);

        this.wakeUpCard = new WakeUpCard(this);

        let characters = {
            'chosePath': new ProtoGuy(this, 133, 422, ProtoGuyCard.CHOSE_PATH)
        };

        this.chosePathCard = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/ProtoScene/ChosePathCard/bg.jpg",
                    "choseBG"
                ),
                new CardObject(
                    this,
                    { name: "kitchen", url: "sprites/ProtoScene/ChosePathCard/kitchen.png" },
                    new Phaser.Math.Vector2(231, -60),
                    null,
                    null,
                    1,
                    { name: "kitchen_h", url: "sprites/ProtoScene/ChosePathCard/kitchen_h.png" }
                ),
                new CardObject(
                    this,
                    { name: "closet", url: "sprites/ProtoScene/ChosePathCard/closet.png" },
                    new Phaser.Math.Vector2(-300, -17),
                    null,
                    null,
                    0,
                    { name: "closet_h", url: "sprites/ProtoScene/ChosePathCard/closet_h.png" }
                ),
                characters['chosePath'],
            ],
            characters['chosePath']
        );

        this.cards = [
            this.introCard,
            this.wakeUpCard,
            this.chosePathCard
        ];

        //Keep track of wich card is displayed
        this.cardIdx = ProtoCards.INTRO;
        this.current_card = this.introCard;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this);
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data { cardIdx, clothes, food }
     */
    init(data) {
        //Check if any saved data exists
        if(data) {

            //Set the correct card
            switch(data.cardIdx) {
                case ProtoCards.INTRO:
                this.cardIdx = ProtoCards.INTRO;
                    break;

                case ProtoCards.WAKE_UP:
                    this.current_card = this.wakeUpCard;
                    this.cardIdx = ProtoCards.WAKE_UP;
                    break;

                case ProtoCards.CHOSE_PATH:
                    this.current_card = this.chosePathCard;
                    this.cardIdx = ProtoCards.CHOSE_PATH;
                    break;

                default:
                    break;
            }
        }
    }

    /**
     * @brief Notifies the protoGuy that his clothes have changed
     * @param {ProtoGuyClothes} clothes the protoguy's new clothes
     */
    changeClothes(clothes) {
        if(this.current_card.hasCharacter()) {
            this.clothes = clothes;
            this.current_card.character.notifyClothesChange();
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

        if(this.current_card.isLoaded()) {
            this.current_card.create();
        }

        //Update the saved data
        player.cur_scene = Scenes.PROTOTYPE;

        //Handle the loaded food case
        if(this.food) {
            this.current_card.showItem(this.food);
        }
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
    nextCard(choice) {

        //Data that will be saved
        let savable_data = {
            cardIdx: this.cardIdx,
            clothes: this.clothes,
            food: -1
        };

        if(this.cardIdx < NUM_CARDS - 1 && this.current_card.isDone()) {
            this.current_card.destroy();

            switch(this.cardIdx) {
                case ProtoCards.INTRO:
                    this.cardIdx = ProtoCards.WAKE_UP;
                    this.current_card = this.wakeUpCard;

                    //Load the next card
                    this.current_card.create();
                    break;

                case ProtoCards.WAKE_UP:
                        this.cardIdx = ProtoCards.CHOSE_PATH;
                        this.current_card = this.chosePathCard;

                        //Load the next card
                        this.current_card.create();
                    break;

                case ProtoCards.CHOSE_PATH:

                    //Chose the next card depending on the user's choice
                    switch(choice) {
                        //The Closet was selected
                        case 0:
                            this.cardIdx = ProtoCards.CLOTHES;
                            this.nextScene(this.cardIdx);
                            break;

                        //The kitchen was selected
                        case 1:
                            this.cardIdx = ProtoCards.KITCHEN;
                            this.nextScene(this.cardIdx);
                            break;

                        default:
                            break;

                    }

                    break;

                default:
                    break;
            }

            //Save the card and clothes choices
            savable_data.cardIdx = this.cardIdx;
            savable_data.clothes = this.clothes;
        }

        //Store the saved data
        player.setData(savable_data);
        player.saveGame();
    }

    nextScene(cardIdx) {
        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.DAMIEN_KITCHEN_CLOTHES, { cardIdx: cardIdx }),
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