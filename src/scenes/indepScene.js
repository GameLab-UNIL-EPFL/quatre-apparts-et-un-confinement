import Phaser from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { TVCard } from "./cards/IndepScene/tvCard.js";
import { WindowState, Months } from "./buildingScene.js";
import { IndepComputerCards } from "./indepComputerScene.js";

export const IndepCards = {
    IDLE_CARD: 0,
    PHONE_CARD: 1,
    TV_CARD: 2
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
                        scene.dialogue.display("telephone");
                    },
                    this,
                    -1,
                    {
                        name: 'indep_idle_phone_h',
                        url: "sprites/UI/01_Interactions/04_Independant/02_Spritesheets/01-Independant-Telephone-Spritesheet_280x160.png",
                        size: { frameWidth: 280, frameHeight: 160 },
                        pos: new Phaser.Math.Vector2(336, 325)
                    }
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
                    0,
                    {
                        name: 'indepIdleTV_h',
                        url: "sprites/UI/01_Interactions/04_Independant/02_Spritesheets/03-Independant-Television-Spritesheet_270x170.png",
                        size: { frameWidth: 270, frameHeight: 170 },
                        pos: new Phaser.Math.Vector2(-240, 80)
                    }
                ),
                new CardObject(
                    this,
                    { name: "indepIdleDVD1", url: "sprites/IndepScene/01_IDLE/dvd_1.png" },
                    new Phaser.Math.Vector2(31, 761),
                    (scene) => scene.dialogue.display("dvd1"),
                    this,
                    -1,
                    {
                        name: 'dvd_h',
                        url: "sprites/UI/01_Interactions/04_Independant/02_Spritesheets/02-Independant-Dvd-Spritesheet_340x180.png",
                        size: { frameWidth: 340, frameHeight: 180 },
                        pos: new Phaser.Math.Vector2(-38, 678)
                    }
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

        this.cards = [
            this.idle_card,
            this.tv_card
        ];

        //Keep track of wich card is displayed
        this.cardIdx = IndepCards.IDLE_CARD;
        this.current_card = this.idle_card;

        this.onPhone = false;
        this.objective = false;

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
            case IndepCards.IDLE_CARD:
                this.cardIdx = IndepCards.IDLE_CARD;
                this.current_card = this.idle_card;
                break;

            case IndepCards.TV_CARD:
                this.cardIdx = IndepCards.TV_CARD;
                this.current_card = this.tv_card;
                break;

            default:
                break;
            }
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
        this.current_card.children[7].highlight_sprite.setActive(!this.onPhone).setVisible(!this.onPhone);
    }

    /**
     * @brief preload all of the elements of all of the cards
     * that will be shown in the scene
     */
    preload() {
        //Preload the dialogue controller
        this.dialogue.preload();

        this.idle_card.preload();
        this.tv_card.preload();
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

            this.onPhone = true;
            this.changeIndep();
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
        //Notify the current card if it is interested
        if(this.onPhone) {
            //Only show the arrow if we spoke to Nathan
            if(this.objective) {
                this.showArrow();
            }
            this.changeIndep();
        }
    }

    /**
     * @brief Notifies the current card that the dialogue objective was met
     * @param {boolean} status whether or not the objective was successful
     */
    notifyObjectiveMet(status) {
        if(this.cardIdx === IndepCards.IDLE_CARD) {
            this.objective = true;

            player.nathan_failed = status;
            player.saveGame();

            // Send result to db as integer
            console.log('Send choice to db:', status);
            player.sendChoices({ player_id: player.id, freelancer_good_love_advice: +status });
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

        //Get rid of all existing sprites
        this.current_card.destroy();

        //Create the next card
        if(this.cardIdx === IndepCards.TV_CARD) {
            this.cardIdx = IndepCards.IDLE_CARD;
            this.current_card = this.idle_card;

            this.current_card.create();

            this.onPhone = true;
            this.changeIndep();

        } else {
            this.cardIdx = IndepCards.TV_CARD;
            this.current_card = this.tv_card;

            this.current_card.create();
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
                mainMenu: false,
                names: {
                    damien: false,
                    grandma: false,
                    family: false,
                    indep: false
                },
                stage: 1,
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

        this.dvd_h.destroy();
    }
}
