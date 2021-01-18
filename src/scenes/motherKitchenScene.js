import Phaser from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { IndepComputerCards } from "./indepComputerScene.js";

export const MotherKitchenCards = {
    DIRTY_CARD: 0,
    CLEAN_CARD: 1
};

export class MotherKitchenScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.MOTHER_KITCHEN });

        this.dirty_card = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/MotherScene/02-Salon/mere-salon01_01-decor.jpg",
                    "motherDirtyKitchenBG"
                ),
                new CardObject(
                    this,
                    {
                        name: 'motherKitchenDirtyAngry',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_02-mere.png'
                    },
                    new Phaser.Math.Vector2(-25, -177)
                ),
                new CardObject(
                    this,
                    {
                        name: 'girlKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_03-fille-turbulante.png'
                    },
                    new Phaser.Math.Vector2(-234, -11),
                    () => this.nextCard("girl"),
                    null
                ),
                new CardObject(
                    this,
                    {
                        name: 'boyBodyKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_04-corps-garcon-turbulant.png'
                    },
                    new Phaser.Math.Vector2(260, 55),
                    () => this.nextCard("boy"),
                    null
                ),
                new CardObject(
                    this,
                    {
                        name: 'tableKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_05-table.png'
                    },
                    new Phaser.Math.Vector2(-49, 431)
                ),
                new CardObject(
                    this,
                    {
                        name: 'girlPlacematKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_06-setdetable-fille.png'
                    },
                    new Phaser.Math.Vector2(-144, 159),
                    () => this.nextCard("girl"),
                    null
                ),
                new CardObject(
                    this,
                    {
                        name: 'boyPlacematKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_06-setdetable-garcon.png'
                    },
                    new Phaser.Math.Vector2(217, 162),
                    () => this.nextCard("boy"),
                    null
                ),
                new CardObject(
                    this,
                    {
                        name: 'boyHeadKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_07-tete-garcon-turbulant.png'
                    },
                    new Phaser.Math.Vector2(123, 102),
                    () => this.nextCard("boy"),
                    null
                ),
                new CardObject(
                    this,
                    {
                        name: 'saladBowlKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_10-saladier.png'
                    },
                    new Phaser.Math.Vector2(-88, 230)
                ),
                new CardObject(
                    this,
                    {
                        name: 'carafeKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_11-carafe-reversee.png'
                    },
                    new Phaser.Math.Vector2(-290, 305),
                    () => this.nextCard("carafe"),
                    null
                ),
                new CardObject(
                    this,
                    {
                        name: 'breadKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_13-pain.png'
                    },
                    new Phaser.Math.Vector2(5, 343),
                    () => this.nextCard("bread"),
                    null
                ),
                new CardObject(
                    this,
                    {
                        name: 'toyKitchenDirty',
                        url: 'sprites/MotherScene/02-Salon/mere-salon01_15-jouet.png'
                    },
                    new Phaser.Math.Vector2(138, 263),
                    () => this.nextCard("toy"),
                    null
                )
            ]
        );

        this.clean_sprites = {
            "girl"  : {
                name: 'girlKitchenClean',
                url: 'sprites/MotherScene/02-Salon/mere-salon01_08-fille-calme.png',
                pos: new Phaser.Math.Vector3(-215, 70, 0),
                matching_sprites: [2, 5],
            },
            "boy"   : {
                name: 'boyBodyKitchenClean',
                url: 'sprites/MotherScene/02-Salon/mere-salon01_09-garcon-calme.png',
                pos: new Phaser.Math.Vector3(193, 48, 0),
                matching_sprites: [3, 6, 7]
            },
            "salad" : {
                name: 'saladBowlKitchenClean',
                url: 'sprites/MotherScene/02-Salon/mere-salon01_10-saladier.png',
                pos: new Phaser.Math.Vector3(-88, 230, 0),
                matching_sprites: [8]
            },
            "carafe": {
                name: 'carafeKitchenClean',
                url: 'sprites/MotherScene/02-Salon/mere-salon01_12-carafe-droite.png',
                pos: new Phaser.Math.Vector3(86, 228, 1),
                matching_sprites: [9]
            },
            "bread": {
                name: 'breadKitchenClean',
                url: 'sprites/MotherScene/02-Salon/mere-salon01_14-pain-decoupe.png',
                pos: new Phaser.Math.Vector3(-6, 335, 0),
                matching_sprites: [10]
            },
            "toy" : {
                name: 'toyKitchenClean',
                url: 'sprites/MotherScene/02-Salon/mere-salon01_16-jouet-range.png',
                pos: new Phaser.Math.Vector3(198, 717, 0),
                matching_sprites: [11]
            }
        };

        this.new_sprites = [];
        this.cleanable = 5;

        this.cardIdx = MotherKitchenCards.DIRTY_CARD;
        this.current_card = this.dirty_card;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this, "florenceDialogApril");
        this.dialogue_count = 3;
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data {  }
     */
    init(data) {

    }

    /**
     * @brief preload all of the elements of all of the cards
     * that will be shown in the scene
     */
    preload() {
        //Preload the dialogue controller
        this.dialogue.preload();

        //Preload all of the cards
        this.current_card.preload();

        this.load.audio('bottle', ['sounds/kitchen/bottle.wav', 'sounds/kitchen/bottle.mp3']);
        this.load.audio('bread', ['sounds/kitchen/bread.wav', 'sounds/kitchen/bread.mp3']);
        this.load.audio('plates', ['sounds/kitchen/plates.wav', 'sounds/kitchen/plates.mp3']);
        this.load.audio('toy', ['sounds/room/toys.wav', 'sounds/room/toys.mp3']);

        //Load in all clean sprites
        for(const clean_sprite_name in this.clean_sprites) {
            const clean_sprite = this.clean_sprites[clean_sprite_name];

            if(clean_sprite) {
                this.load.image(clean_sprite.name, clean_sprite.url);
            }
        }

        //Load the arrow animation spritesheet
        this.load.spritesheet(
            'arrow',
            'sprites/UI/arrow.png',
            { frameWidth: 100, frameHeight: 100 }
        );
    }

    /**
     * @brief create all of the elements of the first card
     * in the scene.
     */
    create() {

        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);

        this.bottleSound = this.sound.add('bottle');
        this.breadSound = this.sound.add('bread');
        this.plateSound = this.sound.add('plates');
        this.toySound = this.sound.add('toy');

        if(this.current_card.isLoaded()) {
            this.current_card.create();

            //Display the first dialogue
            this.dialogue.display("florence");
        }

        //Update the saved data
        player.cur_scene = Scenes.MOTHER_KITCHEN;
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

    notifyDialogueEnd() {
        //The dialogue controller isn't good at handling dialogue
        //that doens't contain any prompts
        --this.dialogue_count;
        if(this.dialogue_count > 1) {
            this.dialogue.display("ranger");
        } else if(this.dialogue_count > 0) {
            this.dialogue.display("non");
        }
    }

    /**
     * @brief Ends the current card
     */
    endCard() {
        this.current_card.endCard();
    }

    /**
     * @brief shows the arrow that sends the user back to the building scene
     */
    showArrow() {
        // Create ring sprites
        this.anims.create({
            key: 'arrow_anim',
            frameRate: 15,
            frames: this.anims.generateFrameNames('arrow'),
            repeat: -1
        });

        //Play the cat animation
        this.arrow = this.add.sprite(
            245,
            716,
            'arrow'
        ).play('arrow_anim');

        //Make the arrow end the scene
        this.arrow.setInteractive().on(
            'pointerdown',
            () => this.nextScene(),
            this
        );
    }

    /**
     * @brief moves to the next card
     * @param {string} name the object that will be moved
     */
    nextCard(name) {
        if(this.clean_sprites[name] !== undefined) {
            const new_sprite = this.clean_sprites[name];
            let targets = [];

            new_sprite.matching_sprites.forEach(idx => {
                targets.push(this.current_card.children[idx]);
            });

            console.log(targets);

            if (name === 'carafe') {
                this.bottleSound.play();
            } else if (name === 'bread') {
                this.breadSound.play();
            } else if (name === 'girl' || name === 'boy') {
                this.plateSound.play();
            } else if (name === 'toy') {
                this.toySound.play();
            }

            this.tweens.add({
                targets: targets,
                x: new_sprite.pos.x,
                y: new_sprite.pos.y,
                z: new_sprite.pos.z,
                duration: 3000,
                callback: () => {
                    targets.forEach(child => child.sprite.destroy());
                    const sprite = this.add.image(new_sprite.pos.x, new_sprite.pos.y, new_sprite.name, new_sprite.url);
                    sprite.setDepth(new_sprite.pos.z);
                    this.new_sprites.push(sprite);

                    //Check objective
                    if (! this.clean_sprites[name].hasOwnProperty('cleaned') ) {
                        this.cleanable--;
                        // Prevent multiple calls if more than 1 target
                        this.clean_sprites[name].cleaned = true;
                    }

                    if(this.cleanable <= 0) {
                        this.showArrow();
                    }
                },
                callbackScope: this
            });
        }
    }

    /**
     * @brief Triggers the next scene
     */
    nextScene() {

        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.INDEP_COMPUTER, { cardIdx: IndepComputerCards.IDLE_CARD })
        );
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
        this.new_sprites.forEach(s => s.destroy());
    }
}
