import Phaser from "phaser";
import { Card } from "./cards/card.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { DialogueController } from "../core/dialogueController.js";

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
                    'sprites/IndepScene/01_IDLE/independant-salon02_00-model.jpg',
                    'indepSadHomeBG'
                )
            ]
        );

        this.dialogue = new DialogueController(this, "patrickDialogJune");
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

            this.dialogue.display("telephone");
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
