import Phaser from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";
import { ZoomMiniGameCard } from "./cards/ProtoSceneCards/zoomMiniGameCard.js";
import { CardObject } from "./objects/cardObject.js";
import { TVCard } from "./cards/IndepScene/tvCard.js";

export const IndepComputerCards = {
    IDLE_CARD : 0,
    TV_CARD: 1,
    COMPUTER_CARD: 2,
    MINI_GAME: 3
};

const NUM_CARDS = 4;

export class IndepComputerScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.INDEP_COMPUTER });

        this.idle_card = new Card(
            this,
            [
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
                    new Phaser.Math.Vector2(280, 375),
                    (scene) => {
                        scene.changeIndep();
                        if(player.nathan_failed) {
                            scene.dialogue.display("telephoneMauvais");
                        } else {
                            scene.dialogue.display("telephoneBon");
                        }
                    },
                    this
                ),
                new CardObject(
                    this,
                    { name: "indepIdleBigPlant", url: "sprites/IndepScene/01_IDLE/big_plant.png" },
                    new Phaser.Math.Vector2(-490, 114)
                ),
                new CardObject(
                    this,
                    { name: "indepIdleTV", url: "sprites/IndepScene/01_IDLE/tv.png" },
                    new Phaser.Math.Vector2(-218, 431),
                    null,
                    null,
                    0
                ),
                new CardObject(
                    this,
                    { name: "indepIdleDVD1", url: "sprites/IndepScene/01_IDLE/dvd_1.png" },
                    new Phaser.Math.Vector2(31, 761),
                    (scene) => scene.dialogue.display("dvd1"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "indepIdleDVD2", url: "sprites/IndepScene/01_IDLE/dvd_2.png" },
                    new Phaser.Math.Vector2(163, 724),
                    (scene) => scene.dialogue.display("dvd2"),
                    this
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

        this.tv_card = new TVCard(this);

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
            this.idle_card,
            this.tv_card,
            this.computer_card,
            this.mini_game_card
        ];

        //Keep track of wich card is displayed
        this.cardIdx = IndepComputerCards.IDLE_CARD;
        this.current_card = this.idle_card;

        this.onPhone = false;
        this.objective = false;
        this.has_arrow = false;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this, "patrickDialogApril");
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
            case IndepComputerCards.IDLE_CARD:
                this.cardIdx = IndepComputerCards.IDLE_CARD;
                this.current_card = this.idle_card;
                break;

            case IndepComputerCards.TV_CARD:
                this.cardIdx = IndepComputerCards.TV_CARD;
                this.current_card = this.tv_card;
                break;

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

            // Display the correct dialogue if needed
            if(this.cardIdx === IndepComputerCards.IDLE_CARD) {
                this.onPhone = true;
                this.changeIndep();

                this.dialogue.display("debut");

            } else if(this.cardIdx === IndepComputerCards.COMPUTER_CARD) {
                this.dialogue.display("patrick_computer");
            }
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
     * @brief Toggles the sprite used for the freelancer guy
     */
    changeIndep() {
        this.onPhone = !this.onPhone;

        //Toggle the guy on the phone sprite
        this.current_card.children[5].sprite.setActive(this.onPhone).setVisible(this.onPhone);

        //Toggle the guy idle sprite
        this.current_card.children[4].sprite.setActive(!this.onPhone).setVisible(!this.onPhone);
        this.current_card.children[7].sprite.setActive(!this.onPhone).setVisible(!this.onPhone);
    }

    /**
     * @brief shows the arrow that sends the user back to the building scene
     */
    showArrow() {
        this.has_arrow = true;

        // Create ring sprites
        this.anims.create({
            key: 'arrow_anim',
            frameRate: 15,
            frames: this.anims.generateFrameNames('arrow'),
            repeat: -1
        });

        //Play the cat animation
        this.arrow = this.add.sprite(
            245,
            716,
            'arrow'
        ).play('arrow_anim');

        //Make the arrow end the scene
        this.arrow.setInteractive().on(
            'pointerdown',
            () => this.nextCard(),
            this
        );
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
        if(this.cardIdx === IndepComputerCards.IDLE_CARD) {
            //Notify the current card if it is interested
            if(this.onPhone) {
                if(this.objective) {
                    this.showArrow();
                }

                this.changeIndep();
            }
        } else {
            this.nextCard();
        }
    }

    /**
     * @brief Notifies the current card that the dialogue objective was met
     * @param {boolean} status whether or not the objective was successful
     */
    notifyObjectiveMet(status) {
        this.objective = true;
    }

    /**
     * @brief moves to the next card
     * @param {Number} choice the choice that was made
     */
    nextCard(choice=-1) {

        let dontSave = false;

        //Data that will be saved
        const savable_data = {
            cardIdx: this.cardIdx
        };

        //Get rid of all existing sprites
        this.current_card.destroy();

        //Create the next card
        if(this.cardIdx === IndepComputerCards.COMPUTER_CARD) {
            this.cardIdx = IndepComputerCards.MINI_GAME;
            this.current_card = this.mini_game_card;

            dontSave = true;

            this.current_card.create();
        } else if(this.cardIdx === IndepComputerCards.TV_CARD) {
            this.cardIdx = IndepComputerCards.IDLE_CARD;
            this.current_card = this.idle_card;

            if(this.has_arrow) {
                this.showArrow();
            }

            this.current_card.create();

            this.onPhone = true;
            this.changeIndep();

        } else if(this.cardIdx === IndepComputerCards.IDLE_CARD) {
            //Remove the arrow if it still exists
            if(this.arrow) {
                this.arrow.destroy();
            }

            let callback = () => {};

            if(choice === -1) {
                this.has_arrow = false;

                this.cardIdx = IndepComputerCards.COMPUTER_CARD;
                this.current_card = this.computer_card;

                callback = () => this.dialogue.display("patrick_computer");
            } else {
                this.cardIdx = IndepComputerCards.TV_CARD;
                this.current_card = this.tv_card;
            }

            this.current_card.create();
            callback();

        } else {
            this.nextScene();
        }

        //Store the saved data
        if(!dontSave) {
            player.setData(savable_data);
            player.saveGame();
        }
    }

    /**
     * @brief Triggers the next scene
     */
    nextScene() {
        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.END_SCENE),
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