import Phaser from "phaser";
import { Card } from "./cards/card.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { DialogueController } from "../core/dialogueController.js";
import { CardObject } from "./objects/cardObject.js";

export class IndepSadHomeScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.INDEP_SAD_HOME });

        this.current_card = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/IndepScene/01_IDLE/bg.jpg",
                    "indepSadBG"
                ),
                new CardObject(
                    this,
                    { name: "indepSadDesk", url: "sprites/IndepScene/01_IDLE/desk.png" },
                    new Phaser.Math.Vector2(55, 31)
                ),
                new CardObject(
                    this,
                    { name: "indepSadChair", url: "sprites/IndepScene/01_IDLE/chair.png" },
                    new Phaser.Math.Vector2(101, 132)
                ),
                new CardObject(
                    this,
                    { name: "indepSadGuy", url: "sprites/IndepScene/01_IDLE/independant-salon02_09-personnage-debout.png" },
                    new Phaser.Math.Vector2(232, 12)
                ),
                new CardObject(
                    this,
                    { name: "indepSadTable", url: "sprites/IndepScene/01_IDLE/table.png" },
                    new Phaser.Math.Vector2(75, 464)
                ),
                new CardObject(
                    this,
                    { name: "indepSadBigPlant", url: "sprites/IndepScene/01_IDLE/big_plant.png" },
                    new Phaser.Math.Vector2(-490, 114)
                ),
                new CardObject(
                    this,
                    { name: "indepSadTV", url: "sprites/IndepScene/01_IDLE/tv.png" },
                    new Phaser.Math.Vector2(-218, 431)
                ),
                new CardObject(
                    this,
                    { name: "indepSadDVD1", url: "sprites/IndepScene/01_IDLE/dvd_1.png" },
                    new Phaser.Math.Vector2(31, 761)
                ),
                new CardObject(
                    this,
                    { name: "indepSadDVD2", url: "sprites/IndepScene/01_IDLE/dvd_2.png" },
                    new Phaser.Math.Vector2(163, 724)
                ),
                new CardObject(
                    this,
                    { name: "indepSadPlant", url: "sprites/IndepScene/01_IDLE/plant.png" },
                    new Phaser.Math.Vector2(513, 637)
                ),
            ],
            null,
            true
        );

        this.dialogue = new DialogueController(this, "patrickDialogJune");
    }

    /**
     * @brief preload all of the elements of all of the cards
     * that will be shown in the scene
     */
    preload() {
        this.current_card.preload();
        this.load.audio('endTheme', 'sounds/building/endTheme.mp3');
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

            this.dialogue.display("telephone");

            this.endTheme = this.sound.add('endTheme').play({loop: true});
        }

        //Update the saved data
        player.cur_scene = Scenes.INDEP_SAD_HOME;
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

    notifyDialogueEnd() {
        this.nextScene();
    }

    /**
     * @brief Triggers the next scene
     */
    nextScene() {
        this.scene.start(Scenes.MOTHER_COUCH);
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}
