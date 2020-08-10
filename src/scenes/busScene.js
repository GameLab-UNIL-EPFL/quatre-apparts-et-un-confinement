import Phaser from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";
import { IndepCards } from "./indepScene.js";

export const BusCards = {
    MARCH_CARD: 0,
    JUNE_CARD: 1
};

const NUM_CARDS = 5;

export class BusScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.BUS });

        this.bus_march_card = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/BusScene/Bus01/Bus01-01-bus.png",
                    "bus_march_bg"
                ),
                new CardObject(
                    this,
                    { name: "bus_dechet_march", url: "sprites/BusScene/Bus01/Bus01-02-dechet.png" },
                    new Phaser.Math.Vector2(222, 381)
                ),
                new CardObject(
                    this,
                    { name: "perso2_bus_march", url: "sprites/BusScene/Bus01/Bus01-04-personnage02.png" },
                    new Phaser.Math.Vector2(148, 238)
                ),
                new CardObject(
                    this,
                    { name: "sieges_bus_march", url: "sprites/BusScene/Bus01/Bus01-03-sieges.png" },
                    new Phaser.Math.Vector2(0, 509)
                ),
                new CardObject(
                    this,
                    { name: "perso1_bus_march", url: "sprites/BusScene/Bus01/Bus01-04-personnage01.png" },
                    new Phaser.Math.Vector2(455, 391)
                ),
                new CardObject(
                    this,
                    { name: "perso3_bus_march", url: "sprites/BusScene/Bus01/Bus01-04-personnage03.png" },
                    new Phaser.Math.Vector2(-397, 381)
                ),
                new CardObject(
                    this,
                    { name: "damien_bus_march", url: "sprites/BusScene/Bus01/Bus01-04-personnage04.png" },
                    new Phaser.Math.Vector2(-142, 135)
                ),
                new CardObject(
                    this,
                    { name: "barre_bus_march", url: "sprites/BusScene/Bus01/Bus01-05-barre.png" },
                    new Phaser.Math.Vector2(-400, 0)
                )
            ]
        );

        this.bus_june_card = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/BusScene/Bus02/Bus02-01-bus.png",
                    "bus_june_bg"
                ),
                new CardObject(
                    this,
                    { name: "bus_dechet_june", url: "sprites/BusScene/Bus02/Bus02-05-dechet.png" },
                    new Phaser.Math.Vector2(222, 381)
                ),
                new CardObject(
                    this,
                    { name: "damien_bus_june", url: "sprites/BusScene/Bus02/Bus02-03-damien.png" },
                    new Phaser.Math.Vector2(107, 207)
                ),
                new CardObject(
                    this,
                    { name: "sieges_bus_june", url: "sprites/BusScene/Bus02/Bus02-02-bus.png" },
                    new Phaser.Math.Vector2(0, 509)
                ),
                new CardObject(
                    this,
                    { name: "perso_bus_june", url: "sprites/BusScene/Bus02/Bus02-04-personnage.png" },
                    new Phaser.Math.Vector2(-436, 427)
                ),
                new CardObject(
                    this,
                    { name: "barre_bus_june", url: "sprites/BusScene/Bus02/Bus02-06-barre.png" },
                    new Phaser.Math.Vector2(-400, 0)
                )
            ]
        );

        this.cards = [
            this.bus_march_card,
            this.bus_june_card
        ];

        //Keep track of wich card is displayed
        this.cardIdx = null;
        this.current_card = null;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this, "introDialog");
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data { cardIdx }
     */
    init(data) {
        //Check if any saved data exists
        if(data) {
            if(data.cardIdx === BusCards.MARCH_CARD) {
                this.cardIdx = BusCards.MARCH_CARD;
                this.current_card = this.bus_march_card;
            } else {
                this.cardIdx = BusCards.JUNE_CARD;
                this.current_card = this.bus_june_card;
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
        this.current_card.preload();

        //Preload the background spritesheet
        if(this.cardIdx === BusCards.MARCH_CARD) {
            this.load.spritesheet(
                'bus_city_march',
                'sprites/BusScene/Bus01/00_Spritesheet/Bus01-00-spirtesheet-BKG-1200x595.jpg',
                { frameWidth: 1200, frameHeight: 595 }
            );
        } else {
            this.load.spritesheet(
                'bus_city_june',
                'sprites/BusScene/Bus02/Bus02-00-spirtesheet-BKG-1200x595.jpg',
                { frameWidth: 1200, frameHeight: 595 }
            );
        }

        this.load.audio('bus_cough', 'sounds/other/busCough.mp3');
    }

    /**
     * @brief Creates a moving background given a loaded spritesheet
     * @param {string} name the name of the background spritesheet that will be used
     */
    createMovingBG(name) {
        this.anims.create({
            key: name + "_anim",
            frameRate:
            15,
            frames: this.anims.generateFrameNames(name),
            repeat: -1
        });

        //Play the city animation
        this.city_bg = this.add.sprite(
            0,
            -100,
            name
        ).play(name + "_anim");

        //Move it to the back
        this.city_bg.setDepth(-10);
    }

    /**
     * @brief create all of the elements of the first card
     * in the scene.
     */
    create() {

        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);

        this.busCough = this.sound.add('bus_cough', {loop: false});
        this.busCough.play();


        if(this.current_card.isLoaded()) {
            this.current_card.create();

            //Make entire screen interactive
            // this.input.on('pointerdown', () => this.nextScene(), this);

            //Create the moving background
            if(this.cardIdx === BusCards.MARCH_CARD) {
                this.createMovingBG("bus_city_march");

                //Display the intro dialogue
                this.dialogue.display("init");
            } else {
                this.createMovingBG("bus_city_june");
            }
        }

        //Update the saved data
        player.cur_scene = Scenes.BUS;

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
     * @brief moves to the next scene, usefull for compatibility reasons
     */
    nextCard() {
        this.nextScene();
    }

    /**
     * @brief Triggers the next scene
     */
    nextScene() {
        this.busCough.stop();
        switch(this.cardIdx) {
        case BusCards.MARCH_CARD:
            this.scene.start(Scenes.BUILDING, {
                mainMenu: false,
                names: {
                    damien: true,
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
                new_month: true,
                nextScene: {
                    damien: Scenes.DAMIEN_INIT,
                    grandma: null,
                    family: null,
                    indep: null
                },
                buildingSound: false
            });
            break;

        case BusCards.JUNE_CARD:
            this.scene.start(Scenes.STORE_EXT, {month: Months.MAY});
            break;

        default:
            break;
        }
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}
