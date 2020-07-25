import Phaser from "phaser";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { Months } from "./buildingScene.js";

export class StoreExtScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.STORE_EXT });

        this.month = Months.MARCH;

        this.current_card = new Card(
            this,
            [
                new Background(
                    this,
                    'sprites/StoreExteriorScene/bg.jpg',
                    'storeExtBG'
                ),
                new CardObject(
                    this,
                    { name: 'busExt', url: 'sprites/StoreExteriorScene/bus.png' },
                    new Phaser.Math.Vector2(0, 0)
                ),
                new CardObject(
                    this,
                    { name: 'car01Ext', url: 'sprites/StoreExteriorScene/car01.png' },
                    new Phaser.Math.Vector2(0, 0)
                ),
                new CardObject(
                    this,
                    { name: 'car02Ext', url: 'sprites/StoreExteriorScene/car02.png' },
                    new Phaser.Math.Vector2(0, 0)
                ),
                new CardObject(
                    this,
                    { name: 'car03Ext', url: 'sprites/StoreExteriorScene/car03.png' },
                    new Phaser.Math.Vector2(0, 0)
                ),
                new CardObject(
                    this,
                    { name: 'car04Ext', url: 'sprites/StoreExteriorScene/car04.png' },
                    new Phaser.Math.Vector2(0, 0)
                )
            ]
        );
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data { cardIdx, damien_gone }
     */
    init(data) {
        //Check if any saved data exists
        if(data) {
            this.month = data.month;
        }
    }

    /**
     * @brief preload all of the elements of all of the cards
     * that will be shown in the scene
     */
    preload() {
        this.current_card.preload();
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

            //Make the entire screen interactive
            this.input.on('pointerdown', this.nextScene, this);
        }

        //Update the saved data
        player.cur_scene = Scenes.STORE_EXT;

        //Data that will be saved
        const savable_data = {
            month: this.month
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
     * @brief Triggers the next scene
     */
    nextScene() {
        this.scene.start(Scenes.STORE, { month: this.month });    
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}