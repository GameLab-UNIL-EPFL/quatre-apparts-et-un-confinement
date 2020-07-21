import Phaser from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { ComputerCard } from "./cards/ProtoSceneCards/computerCard.js";
import { ZoomMiniGameCard } from "./cards/ProtoSceneCards/zoomMiniGameCard.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";
import { ProtoGuyClothes, ProtoCards } from "./protoScene.js";

const NUM_CARDS = 3;

export class DamienInitScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.DAMIEN_INIT });

        //Keep track of the clothes that protoguy is wearing
        this.clothes = ProtoGuyClothes.YESTERDAY_CLOTHES;

        this.computerCard = new ComputerCard(this, Scenes.DAMIEN_INIT);

        this.zoomMiniGame = new ZoomMiniGameCard(this, Scenes.DAMIEN_INIT);

        this.cards = [
            this.computerCard,
            this.zoomMiniGame
        ];

        //Keep track of wich card is displayed
        this.cardIdx = ProtoCards.COMPUTER;
        this.current_card = this.computerCard;
        this.food = -1;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this, "damienDialogMarch");
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
        this.cameras.main.fadeIn(1000);

        if(this.current_card.isLoaded()) {
            this.current_card.create();
        }

        //Update the saved data
        player.cur_scene = Scenes.DAMIEN_INIT;

        //Handle the loaded food case
        if(this.cardIdx === ProtoCards.COMPUTER) {
            this.current_card.showItem();
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
     */
    nextCard() {

        //Data that will be saved
        let savable_data = {
            cardIdx: this.cardIdx,
            clothes: this.clothes,
            food: -1
        };

        if(this.current_card.isDone()) {
            this.current_card.destroy();

            switch(this.cardIdx) {

            case ProtoCards.COMPUTER:
                this.cardIdx = ProtoCards.MINI_GAME;
                this.current_card = this.zoomMiniGame;
                this.current_card.create();
                break;

            case ProtoCards.MINI_GAME:
                this.nextScene();
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
        this.cameras.main.fadeOut(1000);
        this.scene.start(Scenes.BUILDING, {
            mainMenu: false,
            names: false,
            stage: 1,
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
