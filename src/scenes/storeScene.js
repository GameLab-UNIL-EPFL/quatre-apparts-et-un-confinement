import Phaser from "phaser";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { DialogueController } from "../core/dialogueController.js";

export const StoreCards = {
    FIRST_SHELF: 0,
};

export class StoreScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({key: 'Store'});

        this.firstShelf = new Card(this, [
                new Background(
                    this,
                    "sprites/StoreScene/part1/rayon01_00_model_light.jpg",
                    "damienHallwayBGClosed"
                ),
                new CardObject(
                    this,
                    { name: "pasta1", url: "sprites/StoreScene/part1/rayon01_03_pate01.png" },
                    new Phaser.Math.Vector2(-326, -380),
                ),
                new CardObject(
                    this,
                    { name: "pasta2", url: "sprites/StoreScene/part1/rayon01_03_pate02.png" },
                    new Phaser.Math.Vector2(-182, -378)
                ),
                new CardObject(
                    this,
                    { name: "liste", url: "sprites/StoreScene/part1/rayon01_04_liste.png" },
                    new Phaser.Math.Vector2(-306, 489)
                ),
                new CardObject(
                    this,
                    { name: "caddie", url: "sprites/StoreScene/part1/rayon01_02_panier.png" },
                    new Phaser.Math.Vector2(290, 669)
                ),
            ]
        );

        this.cards = [
            this.firstShelf
        ];

        //Keep track of wich card is displayed
        this.cardIdx = StoreCards.FIRST_SHELF;
        this.current_card = this.firstShelf;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this);
    }

    init(data) {
        //Check if any saved data exists
        if(data) {
            console.log("INIT_STORE");
         }
    }

    preload() {
        //Preload the dialogue controller
        this.dialogue.preload();

        //Preload all of the cards
        this.cards.forEach(card => card.preload());
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);

        if(this.current_card.isLoaded()) {
            this.current_card.create();
        }

        //Update the saved data
        // player.cur_scene = Scenes.HALLWAY;
    }

    nextScene(cardIdx) {
        // TODO
        /*this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.DAMIEN_KITCHEN_CLOTHES, { cardIdx: cardIdx }),
            this
        );*/
    }
}
