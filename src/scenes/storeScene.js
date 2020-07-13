import Phaser from "phaser";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { DialogueController } from "../core/dialogueController.js";

export const StoreCards = {
    FIRST_SHELF: 0,
    SECOND_SHELF: 1
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
                    "storeBg1"
                ),
                new CardObject(
                    this,
                    { name: "pasta1", url: "sprites/StoreScene/part1/rayon01_03_pate01.png" },
                    new Phaser.Math.Vector2(-326, -380),
                    (scene) => scene.takeObject("pasta1"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pasta2", url: "sprites/StoreScene/part1/rayon01_03_pate02.png" },
                    new Phaser.Math.Vector2(-182, -378),
                    (scene) => scene.takeObject("pasta2"),
                    this
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

        this.secondShelf = new Card(this, [
                new Background(
                    this,
                    "sprites/StoreScene/part2/rayon01_00_model_light.jpg",
                    "storeBg1"
                ),
                new CardObject(
                    this,
                    { name: "pasta1", url: "sprites/StoreScene/part1/rayon01_02_pain03.png" },
                    new Phaser.Math.Vector2(1274, -380),
                    (scene) => scene.takeObject("pain3"),
                    this
                )
            ]
        );

        this.cards = [
            this.firstShelf,
            this.secondShelf
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

        this.nextCardArrow = this.load.spritesheet(
            'next-card-arrow',
            'sprites/StoreScene/part1/rayon01_06-rayonsuivant-spritesheet_100x100.png',
            { frameWidth: 100, frameHeight: 100 }
        );
    }

    addArrow() {
        // Create ring sprites
        this.nextCardButton = this.anims.create({
            key: 'next-card-anim',
            frameRate: 15,
            frames: this.anims.generateFrameNames('next-card-arrow'),
            repeat: -1
        });

        //Play the cat animation
        this.nextCardButton = this.add.sprite(
            470,
            120,
            'next-card-arrow'
        ).play('next-card-anim');

        let scene = this;
        this.nextCardButton.setInteractive().on('pointerdown', () => scene.nextCard() );
    }

    takeObject(object_name) {
      console.log('take', object_name);
      let object = this.children.getByName(object_name);
      object.depth = 5;
      this.tweens.add({
          targets: object,
          x: 290,
          y: 669,
          duration: 500,
          ease: 'Quadratic',
          yoyo: false,
          loop: 0
      });

      /*
      // si on veut le faire tomber
      let physicalObject = this.physics.add.sprite(object.x, object.y, object_name);
      physicalObject.setGravityY(500);
      */

    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);

        if(this.current_card.isLoaded()) {
            this.current_card.create();
            this.addArrow()
        }

        //Update the saved data
        // ! Cette scene apparaitra pour deux personnages: independant, etudiant
        // player.cur_scene = Scenes.STORE;
    }

    nextCard(){
      console.log('next card!')
      if(this.cardIdx < this.cards.length - 1){
        this.cardIdx++;
        this.current_card = this.cards[this.cardIdx];

        this.current_card.create();

        this.tweens.add({
            targets: this.cameras.main,
            x: '-4200',
            duration: 500,
            ease: 'Quadratic',
            yoyo: false,
            loop: 0
        });
      }
    }

    nextScene(cardIdx) {
        // TODO
        /*this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.XXXX, { cardIdx: cardIdx }),
            this
        );*/
    }
}
