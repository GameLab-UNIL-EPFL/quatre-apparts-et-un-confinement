import Phaser from "phaser";
import { WakeUpCard } from "./cards/ProtoSceneCards/wakeUpCard.js";
import { DialogueController, DIALOGUE_BOX_KEY, DIALOGUE_BOX_SPRITE_SIZE } from "../core/dialogueController.js";
import { IntroCard } from "./cards/ProtoSceneCards/introCard.js";
import { ComputerCard } from "./cards/ProtoSceneCards/computerCard.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { ProtoGuy, ProtoGuyCard } from "../characters/protoGuy.js";
import { ZoomMiniGameCard } from "./cards/ProtoSceneCards/zoomMiniGameCard.js";
import { MessageCard } from "./cards/ProtoSceneCards/messageCard.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";

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
        super({key: 'Prototype'});

        //Keep track of the clothes that protoguy is wearing
        this.clothes = ProtoGuyClothes.PYJAMAS;

        //Create all of the cards
        this.introCard = new IntroCard(this);

        this.wakeUpCard = new WakeUpCard(this);

        let characters = {
            'chosePath': new ProtoGuy(this, 733, 1222, ProtoGuyCard.CHOSE_PATH),
            'clothes': new ProtoGuy(this, 651, 915, ProtoGuyCard.CLOTHES),
            'kitchen': new ProtoGuy(this, 382, 768, ProtoGuyCard.KITCHEN)
        };

        this.chosePathCard = new Card(this, [
                new Background(
                    this,
                    "/sprites/ProtoScene/ChosePathCard/bg.jpg",
                    "choseBG"
                ),
                new CardObject(
                    this,
                    { name: "kitchen", url: "sprites/ProtoScene/ChosePathCard/kitchen.png" },
                    new Phaser.Math.Vector2(831, 740),
                    null,
                    null,
                    1,
                    { name: "kitchen_h", url: "sprites/ProtoScene/ChosePathCard/kitchen_h.png" }
                ),
                new CardObject(
                    this,
                    { name: "closet", url: "sprites/ProtoScene/ChosePathCard/closet.png" },
                    new Phaser.Math.Vector2(300, 783),
                    null,
                    null,
                    0,
                    { name: "closet_h", url: "sprites/ProtoScene/ChosePathCard/closet_h.png" }
                ),
                characters['chosePath'],
            ],
            characters['chosePath']
        );

        this.clothesCard = new Card(this, [
                new Background(
                    this,
                    "sprites/ProtoScene/ClothesCard/bg.jpg",
                    "ClothesBG"
                ),
                new CardObject(
                    this,
                    { name: "clothes", url: "sprites/ProtoScene/ClothesCard/clothes.png" },
                    new Phaser.Math.Vector2(893, 785),
                    (scene) => scene.changeClothes(ProtoGuyClothes.CLEAN_CLOTHES),
                    this,
                    -1,
                    { name: "clothes_h", url: "sprites/ProtoScene/ClothesCard/clothes_h.png" }
                ),
                new CardObject(
                    this,
                    { name: "chair", url: "sprites/ProtoScene/ClothesCard/chair.png" },
                    new Phaser.Math.Vector2(375, 1185),
                    (scene) => scene.changeClothes(ProtoGuyClothes.YESTERDAY_CLOTHES),
                    this,
                    -1,
                    { name: "chair_h", url: "sprites/ProtoScene/ClothesCard/chair_h.png" }
                ),
                characters['clothes']
            ],
            characters['clothes']
        );

        this.kitchenCard = new Card(this, [
                new Background(
                    this,
                    "sprites/ProtoScene/KitchenCard/bg.jpg",
                    "KitchenBG",
                ),
                characters['kitchen'],
                new CardObject(
                    this,
                    { name: "fridge", url: "sprites/ProtoScene/KitchenCard/frigo.png" },
                    new Phaser.Math.Vector2(794, 649),
                    null,
                    null,
                    1,
                    { name: "fridge_h", url: "sprites/ProtoScene/KitchenCard/frigo_h.png" }
                ),
                new CardObject(
                    this,
                    { name: "table", url: "sprites/ProtoScene/KitchenCard/table.png" },
                    new Phaser.Math.Vector2(571, 1188)
                ),
                new CardObject(
                    this,
                    { name: "counter", url: "sprites/ProtoScene/KitchenCard/comptoire.png" },
                    new Phaser.Math.Vector2(600, 1282)
                ),
                new CardObject(
                    this,
                    { name: "sink", url: "sprites/ProtoScene/KitchenCard/lavabo.png" },
                    new Phaser.Math.Vector2(824, 1407),
                    null,
                    null,
                    2,
                    { name: "sink_h", url: "sprites/ProtoScene/KitchenCard/lavabo_h.png" }
                ),
                new CardObject(
                    this,
                    { name: "counter_stuff", url: "sprites/ProtoScene/KitchenCard/objets.png" },
                    new Phaser.Math.Vector2(745, 1495)
                ),
                new CardObject(
                    this,
                    { name: "toaster", url: "sprites/ProtoScene/KitchenCard/toaster.png" },
                    new Phaser.Math.Vector2(242, 1453),
                    null,
                    null,
                    0,
                    { name: "toaster_h", url: "sprites/ProtoScene/KitchenCard/toaster_h.png" }
                ),
                new CardObject(
                    this,
                    { name: "lamp", url: "sprites/ProtoScene/KitchenCard/lampe.png" },
                    new Phaser.Math.Vector2(693, 322)
                )
            ],
            characters['kitchen']
        );

        this.computerCard = new ComputerCard(this);

        this.zoomMiniGame = new ZoomMiniGameCard(this);

        this.messageCard = new MessageCard(this);

        this.cards = [
            this.introCard,
            this.wakeUpCard,
            this.chosePathCard,
            this.clothesCard,
            this.kitchenCard,
            this.computerCard,
            this.zoomMiniGame,
            this.messageCard
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

                case ProtoCards.CLOTHES:
                    this.current_card = this.clothesCard;
                    this.cardIdx = ProtoCards.CLOTHES;
                    break;

                case ProtoCards.KITCHEN:
                    this.current_card = this.kitchenCard;
                    this.cardIdx = ProtoCards.KITCHEN;
                    break;

                case ProtoCards.COMPUTER:
                    this.current_card = this.computerCard;
                    this.clothes = data.clothes;
                    this.food = data.food;
                    this.cardIdx = ProtoCards.COMPUTER;
                    break;

                case ProtoCards.MINI_GAME:
                    this.current_card = this.zoomMiniGame;
                    this.cardIdx = ProtoCards.MINI_GAME;
                    break;

                case ProtoCards.MESSAGE:
                    this.current_card = this.messageCard;
                    this.clothes = data.clothes;
                    this.cardIdx = ProtoCards.MESSAGE;
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

        //Load in the dialogue box
        this.load.spritesheet(
            DIALOGUE_BOX_KEY,
            "sprites/UI/dialogueBox.png",
            DIALOGUE_BOX_SPRITE_SIZE.bg
        );

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
                            this.current_card = this.clothesCard;
                            this.current_card.create();
                            break;

                        //The kitchen was selected
                        case 1:
                            this.cardIdx = ProtoCards.KITCHEN;
                            this.current_card = this.kitchenCard;
                            this.current_card.create();
                            break;

                        //Proto guy was selected (back to bed)
                        case 2:
                            this.cardIdx = ProtoCards.WAKE_UP;
                            break;

                        default:
                            break;

                    }

                    break;

                case ProtoCards.CLOTHES:
                    //Chose the next card depending on the user's choice
                    this.cardIdx = ProtoCards.COMPUTER;
                    this.current_card = this.computerCard;
                    this.current_card.create();
                    this.current_card.showItem();
                    break;

                case ProtoCards.KITCHEN:
                    this.cardIdx = ProtoCards.COMPUTER;
                    this.current_card = this.computerCard;
                    this.current_card.create();
                    this.current_card.showItem(choice);

                    //Save the food choice
                    savable_data.food = choice;
                    break;

                case ProtoCards.COMPUTER:
                    this.cardIdx = ProtoCards.MINI_GAME;
                    this.current_card = this.zoomMiniGame;
                    this.current_card.create();
                    break;

                case ProtoCards.MINI_GAME:
                    this.cardIdx = ProtoCards.MESSAGE;
                    this.current_card = this.messageCard;
                    this.current_card.create();
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

    nextScene() {
        this.scene.start("Building", {
            mainMenu: false,
            stage: 3,
            windows: {
                damien: WindowState.OFF,
                grandma: WindowState.ON,
                family: WindowState.OFF,
                indep: WindowState.OFF
            },
            month: Months.MARCH,
            nextScene: {
                damien: null,
                grandma: Scenes.GRANDMA,
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
