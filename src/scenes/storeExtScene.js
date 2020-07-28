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

        this.month = Months.APRIL;

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
                    new Phaser.Math.Vector2(-364, -236)
                ),
                new CardObject(
                    this,
                    { name: 'car01Ext', url: 'sprites/StoreExteriorScene/car01.png' },
                    new Phaser.Math.Vector2(319, 429)
                ),
                new CardObject(
                    this,
                    { name: 'car02Ext', url: 'sprites/StoreExteriorScene/car02.png' },
                    new Phaser.Math.Vector2(189, 355)
                ),
                new CardObject(
                    this,
                    { name: 'car03Ext', url: 'sprites/StoreExteriorScene/car03.png' },
                    new Phaser.Math.Vector2(-28, 260)
                ),
                new CardObject(
                    this,
                    { name: 'car04Ext', url: 'sprites/StoreExteriorScene/car04.png' },
                    new Phaser.Math.Vector2(415, 52)
                )
            ]
        );

        this.june_pos = [
            new Phaser.Math.Vector2(-800, -200),
            new Phaser.Math.Vector2(319, 429),
            new Phaser.Math.Vector2(-50, 471),
            new Phaser.Math.Vector2(421, 47),
            new Phaser.Math.Vector2(-36, 259),
        ];
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data { month }
     */
    init(data) {
        //Check if any saved data exists
        if(data.month === Months.MAY) {
            this.month = Months.MAY;
        } else if(data.month === Months.APRIL) {
            this.month = Months.APRIL;
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

            if(this.month === Months.MAY) {
                //Give all of the sprites their june positions
                for(let i = 0; i < this.current_card.children.length - 1; ++i) {
                    this.current_card.children[i + 1].sprite.x = this.june_pos[i].x;
                    this.current_card.children[i + 1].sprite.y = this.june_pos[i].y;
                }
            }

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
