import Phaser from "phaser";
import { Scenes } from "../core/player.js";
import { DialogueController } from "../core/dialogueController.js";
import { BusCards } from "./busScene.js";

export class DamienKitchenNoFood extends Phaser.Scene {
    constructor() {
        super({ key: Scenes.DAMIEN_NO_FOOD });

        this.dialogue = new DialogueController(this, "damienDialogApril");
    }

    preload() {
        this.dialogue.preload();
        this.load.image('damien_kitchen_no_food_bg', "sprites/ProtoScene/KitchenCard/cuisine_01_00-model.jpg");
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);

        //Load in the background image
        this.bg = this.add.image(0, 0, 'damien_kitchen_no_food_bg');

        //Show the dialogue
        this.dialogue.display("frigo");
    }

    notifyDialogueEnd() {
        this.nextScene();
    }

    nextScene() {
        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.BUS, { cardIdx: BusCards.JUNE_CARD })
        );     
    }
    
    destroy() {
        this.bg.destroy();
    }
}
