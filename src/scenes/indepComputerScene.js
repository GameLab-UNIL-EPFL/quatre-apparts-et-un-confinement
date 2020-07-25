import Phaser from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";
import { ZoomMiniGameCard } from "./cards/ProtoSceneCards/zoomMiniGameCard.js";

export const IndepComputerCards = {
    COMPUTER_CARD: 0,
    MINI_GAME: 1
};

const NUM_CARDS = 2;

export class IndepComputerScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.INDEP_COMPUTER });

        this.computer_card = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/IndepComputerScene/04_Bureau/independant-ordinateur_01-bkg.jpg",
                    "indep_computer_bg"
                )
            ]
        );

        this.mini_game_card = new ZoomMiniGameCard(this, Scenes.INDEP_COMPUTER);

        this.cards = [
            this.computer_card,
            this.mini_game_card
        ];

        //Keep track of wich card is displayed
        this.cardIdx = IndepComputerCards.COMPUTER_CARD;
        this.current_card = this.computer_card;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this, "patrickDialogMarch");
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
            case IndepComputerCards.COMPUTER_CARD:
                this.cardIdx = IndepComputerCards.COMPUTER_CARD;
                this.current_card = this.computer_card;
                break;

            case IndepComputerCards.MINI_GAME:
                this.cardIdx = IndepComputerCards.MINI_GAME;
                this.current_card = this.mini_game_card;
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

        this.computer_card.preload();
        this.mini_game_card.preload();
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
            this.dialogue.display("patrick_computer");
        }

        //Update the saved data
        player.cur_scene = Scenes.INDEP_COMPUTER;

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
        this.nextCard();
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

        //Get rid of all existing sprites
        this.current_card.destroy();

        //Create the next card
        if(this.cardIdx === IndepComputerCards.COMPUTER_CARD) {
            this.cardIdx = IndepComputerCards.MINI_GAME;
            this.current_card = this.mini_game_card;

            this.current_card.create();
        } else {
            this.nextScene();
        }

        //Store the saved data
        player.setData(savable_data);
        player.saveGame();
    }

    /**
     * @brief Triggers the next scene
     */
    nextScene() {
        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.BUILDING, {
                mainMenu: true,
                names: {
                    damien: false,
                    grandma: false,
                    family: false,
                    indep: false
                },
                stage: 1,
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
            }),
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