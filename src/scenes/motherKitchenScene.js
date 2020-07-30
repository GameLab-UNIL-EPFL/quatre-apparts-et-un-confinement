import Phaser from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { IndepComputerCards } from "./indepComputerScene.js";

export const MotherKitchenCards = {
    DIRTY_CARD: 0,
    CLEAN_CARD: 1
};

export class MotherKitchenScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.MOTHER_KITCHEN });

        this.dirty_card = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/MotherScene/02-Salon/mere-salon01_01-decor.jpg",
                    "motherDirtyKitchenBG"
                ),
                new CardObject(
                    this,
                    {
                        name: 'motherKitchenDirtyAngry',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_02-mere.png'
                    },
                    new Phaser.Math.Vector2(-25, -177)
                ),
                new CardObject(
                    this,
                    {
                        name: 'girlKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_03-fille-turbulante.png'
                    },
                    new Phaser.Math.Vector2(-234, -11),
                    (scene) => scene.nextCard(),
                    this
                ),
                new CardObject(
                    this,
                    {
                        name: 'boyBodyKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_04-corps-garcon-turbulant.png'
                    },
                    new Phaser.Math.Vector2(260, 55),
                    (scene) => scene.nextCard(),
                    this
                ),
                new CardObject(
                    this,
                    {
                        name: 'tableKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_05-table.png'
                    },
                    new Phaser.Math.Vector2(-49, 431)
                ),
                new CardObject(
                    this,
                    {
                        name: 'girlPlacematKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_06-setdetable-fille.png'
                    },
                    new Phaser.Math.Vector2(-144, 159),
                    (scene) => { 
                        this.nextCard();
                        console.log("click");
                    },
                    this
                ),
                new CardObject(
                    this,
                    {
                        name: 'boyPlacematKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_06-setdetable-garcon.png'
                    },
                    new Phaser.Math.Vector2(217, 162),
                    (scene) => scene.nextCard(),
                    this
                ),
                new CardObject(
                    this,
                    {
                        name: 'boyHeadKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_07-tete-garcon-turbulant.png'
                    },
                    new Phaser.Math.Vector2(123, 102),
                    (scene) => scene.nextCard(),
                    this
                ),
                new CardObject(
                    this,
                    {
                        name: 'saladBowlKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_10-saladier.png'
                    },
                    new Phaser.Math.Vector2(-88, 230)
                ),
                new CardObject(
                    this,
                    {
                        name: 'caraffeKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_11-caraffe-reversee.png'
                    },
                    new Phaser.Math.Vector2(-290, 305)
                ),
                new CardObject(
                    this,
                    {
                        name: 'breadKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_13-pain.png'
                    },
                    new Phaser.Math.Vector2(5, 343)
                ),
                new CardObject(
                    this,
                    {
                        name: 'toyKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_15-jouet.png'
                    },
                    new Phaser.Math.Vector2(138, 263)
                )
            ]
        );

        this.clean_card = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/MotherScene/02-Salon/mere-salon01_01-decor.jpg",
                    "motherCleanKitchenBG"
                ),
                new CardObject(
                    this,
                    {
                        name: 'motherKitchenCleanAngry',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_02-mere.png'
                    },
                    new Phaser.Math.Vector2(-25, -177)
                ),
                new CardObject(
                    this,
                    {
                        name: 'tableKitchenClean',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_05-table.png'
                    },
                    new Phaser.Math.Vector2(-49, 431)
                ),
                new CardObject(
                    this,
                    {
                        name: 'girlKitchenClean',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_08-fille-calme.png'
                    },
                    new Phaser.Math.Vector2(-215, 70)
                ),
                new CardObject(
                    this,
                    {
                        name: 'boyBodyKitchenClean',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_09-garcon-calme.png'
                    },
                    new Phaser.Math.Vector2(193, 48)
                ),
                new CardObject(
                    this,
                    {
                        name: 'saladBowlKitchenClean',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_10-saladier.png'
                    },
                    new Phaser.Math.Vector2(-88, 230)
                ),
                new CardObject(
                    this,
                    {
                        name: 'caraffeKitchenClean',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_12-caraffe-droite.png'
                    },
                    new Phaser.Math.Vector2(86, 228)
                ),
                new CardObject(
                    this,
                    {
                        name: 'breadKitchenClean',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_14-pain-decoupe.png'
                    },
                    new Phaser.Math.Vector2(-6, 335)
                ),
                new CardObject(
                    this,
                    {
                        name: 'toyKitchenClean',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_16-jouet-range.png'
                    },
                    new Phaser.Math.Vector2(198, 717)
                )
            ]
        );

        this.cards = [
            this.dirty_card,
            this.clean_card
        ];

        this.cardIdx = MotherKitchenCards.DIRTY_CARD;
        this.current_card = this.dirty_card;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this, "florenceDialogApril");
        this.dialogue_count = 3;
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
        player.cur_scene = Scenes.MOTHER_KITCHEN;
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
        //The dialogue controller isn't good at handling dialogue 
        //that doens't contain any prompts
        --this.dialogue_count;
        if(this.dialogue_count > 1) {
            this.dialogue.display("ranger");
        } else if(this.dialogue_count > 0) {
            this.dialogue.display("non");
        }
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
     * @brief moves to the next card
     * @param {Number} choice the choice that was made
     */
    nextCard(choice=-1) {

        this.current_card.endCard();

        if(this.current_card.isDone()) {
            this.current_card.destroy();

            if(this.cardIdx === MotherKitchenCards.DIRTY_CARD) {
                this.cardIdx = MotherKitchenCards.CLEAN_CARD;
                this.current_card = this.clean_card;

                this.current_card.create();
                this.showArrow();

            } else {
                this.nextScene();
            }
        }

        //Store the saved data
        player.saveGame();
    }

    /**
     * @brief Triggers the next scene
     */
    nextScene() {

        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.INDEP_COMPUTER, { cardIdx: IndepComputerCards.IDLE_CARD })
        );
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}
