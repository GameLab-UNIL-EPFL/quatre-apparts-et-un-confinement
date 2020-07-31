import Phaser from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { IndepComputerCards } from "./indepComputerScene.js";

export class MotherCouchScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.MOTHER_COUCH });

        this.main_card = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/MotherScene/03_Canape/mere-canape01_01-decors.jpg",
                    "motherCouchBG"
                ),
                new CardObject(
                    this,
                    {
                        name: 'plantMotherCouch',
                        url: 'sprites/MotherScene/03_Canape/mere-canape01_02-plante.png'
                    },
                    new Phaser.Math.Vector2(-352, -240)
                ),
                new CardObject(
                    this,
                    {
                        name: 'teaMotherCouch',
                        url: 'sprites/MotherScene/03_Canape/mere-canape01_03-the.png'
                    },
                    new Phaser.Math.Vector2(-234, 670)
                ),
                new CardObject(
                    this,
                    {
                        name: 'motherMotherCouch',
                        url: 'sprites/MotherScene/03_Canape/mere-canape01_04-mere.png'
                    },
                    new Phaser.Math.Vector2(197, 383)
                ),
                new CardObject(
                    this,
                    {
                        name: 'magazineMotherCouch',
                        url: 'sprites/MotherScene/03_Canape/mere-canape01_05-magazine.png'
                    },
                    new Phaser.Math.Vector2(-447, 368)
                )
            ]
        );

        this.cards = [
            this.main_card
        ];

        this.current_card = this.main_card;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this, "florenceDialogJune");
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data {  }
     */
    init(data) {

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

        //Load the arrow animation spritesheet
        this.load.spritesheet(
            'arrow',
            'sprites/UI/arrow.png',
            { frameWidth: 100, frameHeight: 100 }
        );
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

            //Display the first dialogue
            this.dialogue.display("florence");
        }

        //Update the saved data
        player.cur_scene = Scenes.MOTHER_COUCH;
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

    notifyDialogueEnd() {
        this.showArrow();
    }

    /**
     * @brief Ends the current card
     */
    endCard() {
        this.current_card.endCard();
    }

    /**
     * @brief shows the arrow that sends the user back to the building scene
     */
    showArrow() {
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
            () => this.nextScene(),
            this
        );
    }

    /**
     * @brief Triggers the next scene
     */
    nextScene() {

        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.STATS)
        );
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}
