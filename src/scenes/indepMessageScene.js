import Phaser from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";
import { IndepCards } from "./indepScene.js";

const NUM_CARDS = 2;

export class IndepMessageScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.INDEP_MSG });

        this.phone_card = new Card(
            this,
            [
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
            this.phone_card
        ];

        //Keep track of wich card is displayed
        this.cardIdx = IndepCards.PHONE_CARD;
        this.current_card = this.phone_card;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this, "patrickDialogMarch");
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data { }
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
        this.dialogue.preloadMessages();

        this.phone_card.preload();

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

            this.dialogue.createMessageBG();

            this.dialogue.display("telephone", false, true);
        }

        //Update the saved data
        player.cur_scene = Scenes.INDEP_MSG;

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
     * @brief Notifies the current card that the dialogue has ended
     */
    notifyDialogueEnd() {
        this.showArrow();
    }

    /**
     * @brief Triggers the next scene
     * @param {HallwayCards} cardIdx 
     */
    nextScene(cardIdx) {
        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.BUILDING, {
                mainMenu: false,
                names: {
                    damien: false,
                    grandma: false,
                    family: false,
                    indep: false
                },
                stage: 3,
                windows: {
                    damien: WindowState.ON,
                    grandma: WindowState.OFF,
                    family: WindowState.OFF,
                    indep: WindowState.OFF
                },
                month: Months.MARCH,
                nextScene: {
                    damien: Scenes.PROTOTYPE,
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