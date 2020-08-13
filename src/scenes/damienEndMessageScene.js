import Phaser from "phaser";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { DialogueController } from "../core/dialogueController.js";
import { Months } from "./buildingScene.js";
import { Background } from "./objects/background.js";
import { CardObject } from "./objects/cardObject.js";
import { Card } from "./cards/card.js";

export class DamienEndMessageScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.DAMIEN_END_MESSAGE });

        this.current_card = new Card(
            this,
            [
                new Background(
                    this,
                    'sprites/StudentScene/MessageCard/bg.png',
                    'DamienEndMessageBG'
                ),
                new CardObject(
                    this,
                    { name: 'DamienEndMessageDamien', url: 'sprites/StudentScene/MessageCard/damien_pj.png' },
                    new Phaser.Math.Vector2(1, -1)
                ),
                new CardObject(
                    this,
                    { name: "phone-cover", url: "sprites/StudentScene/MessageCard/phone.png" },
                    new Phaser.Math.Vector2(-2, 289)
                )
            ]
        );

        this.dialogue = new DialogueController(this, "damienDialogJune");
    }

    /**
     * @brief preload all of the elements of all of the cards
     * that will be shown in the scene
     */
    preload() {
        this.current_card.preload();
        this.dialogue.preloadMessages();
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
            this.dialogue.displayMessage("copine", true);
        }

        //Update the saved data
        player.cur_scene = Scenes.DAMIEN_END_MESSAGE;
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
        this.scene.start(Scenes.GRANDMA, { month: Months.JUNE });
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
        this.dialogue.destroyAllDisplayed();
    }
}
