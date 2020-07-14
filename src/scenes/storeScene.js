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
                    "sprites/StoreScene/part1/rayon01_01_rayonnage.jpg",
                    "storeBg1"
                ),
                new CardObject(
                    this,
                    { name: "pate01", url: "sprites/StoreScene/part1/rayon01_03_pate01.png" },
                    new Phaser.Math.Vector2(-326, -380),
                    (scene) => scene.takeObject("pate01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate02", url: "sprites/StoreScene/part1/rayon01_03_pate02.png" },
                    new Phaser.Math.Vector2(-182, -378),
                    (scene) => scene.takeObject("pate02"),
                    this
                ),
                
                new CardObject(
                    this,
                    { name: "pate03", url: "sprites/StoreScene/part1/rayon01_03_pate03.png" },
                    new Phaser.Math.Vector2(-441, -132),
                    (scene) => scene.takeObject("pate03"),
                    this
                ),
                
                new CardObject(
                    this,
                    { name: "pate04", url: "sprites/StoreScene/part1/rayon01_03_pate04.png" },
                    new Phaser.Math.Vector2(-328, -132),
                    (scene) => scene.takeObject("pate04"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate05", url: "sprites/StoreScene/part1/rayon01_03_pate05.png" },
                    new Phaser.Math.Vector2(-206, -132),
                    (scene) => scene.takeObject("pate05"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine01", url: "sprites/StoreScene/part1/rayon01_03_farine01.png" },
                    new Phaser.Math.Vector2(-525, 145),
                    (scene) => scene.takeObject("farine01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine02", url: "sprites/StoreScene/part1/rayon01_03_farine02.png" },
                    new Phaser.Math.Vector2(-417, 148),
                    (scene) => scene.takeObject("farine02"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine03", url: "sprites/StoreScene/part1/rayon01_03_farine03.png" },
                    new Phaser.Math.Vector2(-294, 145),
                    (scene) => scene.takeObject("farine03"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine04", url: "sprites/StoreScene/part1/rayon01_03_farine04.png" },
                    new Phaser.Math.Vector2(-119, 148),
                    (scene) => scene.takeObject("farine04"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine05", url: "sprites/StoreScene/part1/rayon01_03_farine05.png" },
                    new Phaser.Math.Vector2(-8, 145),
                    (scene) => scene.takeObject("farine05"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine06", url: "sprites/StoreScene/part1/rayon01_03_farine06.png" },
                    new Phaser.Math.Vector2(97, 142),
                    (scene) => scene.takeObject("farine06"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine07", url: "sprites/StoreScene/part1/rayon01_03_farine07.png" },
                    new Phaser.Math.Vector2(203, 142),
                    (scene) => scene.takeObject("farine07"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine08", url: "sprites/StoreScene/part1/rayon01_03_farine08.png" },
                    new Phaser.Math.Vector2(306, 148),
                    (scene) => scene.takeObject("farine08"),
                    this
                ),
                
                new CardObject(
                    this,
                    { name: "sac01", url: "sprites/StoreScene/part1/rayon01_03_sac01.png" },
                    new Phaser.Math.Vector2(-119, 431),
                    (scene) => scene.takeObject("sac01"),
                    this
                ),
                
                new CardObject(
                    this,
                    { name: "sac02", url: "sprites/StoreScene/part1/rayon01_03_sac02.png" },
                    new Phaser.Math.Vector2(159, 420),
                    (scene) => scene.takeObject("sac02"),
                    this
                ),
                
                new CardObject(
                    this,
                    { name: "pate06", url: "sprites/StoreScene/part1/rayon01_03_pate06.png" },
                    new Phaser.Math.Vector2(-60, -120),
                    (scene) => scene.takeObject("pate06"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate07", url: "sprites/StoreScene/part1/rayon01_03_pate07.png" },
                    new Phaser.Math.Vector2(46, -120),
                    (scene) => scene.takeObject("pate07"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate10", url: "sprites/StoreScene/part1/rayon01_03_pate10.png" },
                    new Phaser.Math.Vector2(-152, -627),
                    (scene) => scene.takeObject("pate10"),
                    this
                ),
                
                new CardObject(
                    this,
                    { name: "pate11", url: "sprites/StoreScene/part1/rayon01_03_pate11.png" },
                    new Phaser.Math.Vector2(-42, -627),
                    (scene) => scene.takeObject("pate11"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate12", url: "sprites/StoreScene/part1/rayon01_03_pate12.png" },
                    new Phaser.Math.Vector2(115, -634),
                    (scene) => scene.takeObject("pate12"),
                    this
                ),

                new CardObject(
                    this,
                    { name: "sac03", url: "sprites/StoreScene/part1/rayon01_03_sac03.png" },
                    new Phaser.Math.Vector2(437, 423),
                    (scene) => scene.takeObject("sac03"),
                    this
                ),

                new CardObject(
                    this,
                    { name: "spaghetti01", url: "sprites/StoreScene/part1/rayon01_03_spaghetti01.png" },
                    new Phaser.Math.Vector2(28, -333),
                    (scene) => scene.takeObject("spaghetti01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "spaghetti02", url: "sprites/StoreScene/part1/rayon01_03_spaghetti02.png" },
                    new Phaser.Math.Vector2(30, -385),
                    (scene) => scene.takeObject("spaghetti02"),
                    this
                ),

                new CardObject(
                    this,
                    { name: "spaghetti03", url: "sprites/StoreScene/part1/rayon01_03_spaghetti03.png" },
                    new Phaser.Math.Vector2(318, -336),
                    (scene) => scene.takeObject("spaghetti03"),
                    this
                ),



                new CardObject(
                    this,
                    { name: "pate08", url: "sprites/StoreScene/part1/rayon01_03_pate08.png" },
                    new Phaser.Math.Vector2(223, -128),
                    (scene) => scene.takeObject("pate08"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate09", url: "sprites/StoreScene/part1/rayon01_03_pate09.png" },
                    new Phaser.Math.Vector2(362, -125),
                    (scene) => scene.takeObject("pate09"),
                    this
                ),
            ]
        );

        this.secondShelf = new Card(this, [
                new Background(
                    this,
                    "sprites/StoreScene/part2/rayon01_00_model_light.jpg",
                    "storeBg2"
                ),
                new CardObject(
                    this,
                    { name: "pain3", url: "sprites/StoreScene/part2/rayon01_02_pain03.png" },
                    new Phaser.Math.Vector2(23, 191),
                    (scene) => scene.takeObject("pain3"),
                    this
                )
            ]
        );
        
        this.thirdShelf = new Card(this, [
                new Background(
                    this,
                    "sprites/StoreScene/part3/rayon03_00_model.jpg",
                    "storeBg3"
                ),
          
            ]
        );
        
        this.checklist_done = {
          'pate': {
            position_x: -276,
            position_y: 234,
            done: false
          }
        }
        
        this.cards = [
            this.firstShelf,
            this.secondShelf,
            this.thirdShelf
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

        // Sprites for the whole scene (all 3 cards)
        this.load.image('liste', "sprites/StoreScene/part1/rayon01_04_liste.png");
        this.load.image('basket', "sprites/StoreScene/part1/rayon01_02_panier.png");
        this.load.image('basket-front', "sprites/StoreScene/part1/rayon01_02_panier-02front.png");
        
        this.load.image('rature', "sprites/StoreScene/part1/rayon01_05_rature.png");
        

        this.nextCardArrow = this.load.spritesheet(
            'next-card-arrow',
            'sprites/StoreScene/part1/rayon01_06-rayonsuivant-spritesheet_100x100.png',
            { frameWidth: 100, frameHeight: 100 }
        );
    }

    addArrow() {
        // Create arrow sprites
        this.nextCardButton = this.anims.create({
            key: 'next-card-anim',
            frameRate: 15,
            frames: this.anims.generateFrameNames('next-card-arrow'),
            repeat: -1
        });

        // Position relative to scene width
        this.nextCardButton = this.add.sprite(
            this.cameras.main.width * 0.39,
            120,
            'next-card-arrow'
        ).play('next-card-anim');

        let scene = this;
        this.nextCardButton.setInteractive().on('pointerdown', () => scene.nextCard() );
    }

    takeObject(object_name) {
      // return; // debug
      
      console.log('take', object_name);
      let object = this.children.getByName(object_name);
      object.depth = 5;
      
      // Move to basket
      this.tweens.add({
          targets: object,
          x: this.basket.x + (Math.random() * 50),
          y: this.basket.y + 25 + (Math.random() * 25),
          duration: 300,
          ease: 'Quadratic',
          yoyo: false,
          loop: 0,
          onComplete: () => {
              // this.rature = this.add.image(this.listPositions[object_name], 'rature')
              // todo: add flag
              for (const item in this.checklist_done) {
                if(object_name.indexOf(item) >= 0){
                  if(this.checklist_done[item].done == false) {
                    this.rature = this.add.image(-276, 234, 'rature')
                    this.rature.depth = 20;
                    this.checklist_done[item].done = true;
                  } else {
                    console.log('rature deja ajoutée')
                  }
                }else{
                  console.log('pas de', item)
                }
              }
              
              // Animate basket
              this.tweens.add({
                targets: [this.basket, this.basket_front],
                scale: 1.2,
                duration: 100,
                ease: 'Quadratic',
                yoyo: true,
                loop: 0
              })
          },
          onCompleteScope: this
      });
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);

        if(this.current_card.isLoaded()) {
            this.current_card.create();
            this.addArrow()
        }
        
        this.checklist = this.add.image(-this.cameras.main.width * 0.255, 489, 'liste');
        this.checklist.depth = 20;
        
        
        this.basket = this.add.image(this.cameras.main.width * 0.24166, 700, 'basket');
        this.basket.depth = 4;
        
        this.basket_front = this.add.image(this.cameras.main.width * 0.24166, 700, 'basket-front');
        this.basket_front.depth = 25;
        
        // Update the saved data
        // ! Cette scene apparaitra pour deux personnages: independant, etudiant
        // player.cur_scene = Scenes.STORE;
    }

    nextCard(){
        if(this.cardIdx < this.cards.length - 1){
        
        // move previous card
        let container = this.add.container();
        container.depth = 2;
        for(let i in this.current_card.children){
          if(this.current_card.children[i].sprite.depth != 5){
            container.add(this.current_card.children[i].sprite)
          }
        }
        this.tweens.add({
          targets: container,
          x: -1200,
          duration: 500,
          ease: 'Quadratic',
          yoyo: false,
          loop: 0
        })
        
        this.cardIdx++;
        this.current_card = this.cards[this.cardIdx];
        this.current_card.create();
        if(this.cardIdx < this.cards.length - 1){
          this.addArrow();
        }
      }
    }
    
    nextScene(cardIdx) {
        // TODO -- depends on current position in story
        /*this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.XXXX, { cardIdx: cardIdx }),
            this
        );*/
    }
}
