import Phaser from "phaser";
import {WakeUpCard} from "./cards/ProtoSceneCards/wakeUpCard.js";

export class ProtoScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to now which card we are at
     * in said scene
     */
    constructor() {
        super({key: 'Prototype'});

        this.wakeUpCard = new WakeUpCard(this);
        this.cardIdx = 0;

        this.current_card = this.wakeUpCard;
    }

    /**
     * @brief preload all of the elements of the first card 
     * that will be shown in the scene
     */
    preload() {
        this.wakeUpCard.preload();
    }

    /**
     * @brief create all of the elements of the first card
     * in the scene.
     */
    create() {
        this.wakeUpCard.create();
    }

    /**
     * @brief Update the scene
     */
    update() {
        this.current_card.update();
    }


}