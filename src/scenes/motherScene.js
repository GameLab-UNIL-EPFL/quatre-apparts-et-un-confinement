import Phaser from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";
import { GrandmaScene } from "./grandmaScene.js";

const INIT_CLEANABLE_OBJECTS = 8;

export class MotherScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.MOTHER });

        //Predefine the current card
        let current_card = new Card(this, []);

        this.main_card = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/MotherScene/01_Chambre-Enfants/bg.jpg",
                    "motherBG"
                ),
                new CardObject(
                    this,
                    { name: "motherSceneMother", url: "sprites/MotherScene/01_Chambre-Enfants/mother.png" },
                    new Phaser.Math.Vector2(283, -419)
                ),
                new CardObject(
                    this,
                    { name: "motherSceneKid_boy", url: "sprites/MotherScene/01_Chambre-Enfants/kid_b.png" },
                    new Phaser.Math.Vector2(161, -262)
                ),
                new CardObject(
                    this,
                    { name: "motherSceneKid_girl", url: "sprites/MotherScene/01_Chambre-Enfants/kid_g.png" },
                    new Phaser.Math.Vector2(296, -234)
                ),
                new CardObject(
                    this,
                    { name: "motherSceneBed_d", url: "sprites/MotherScene/01_Chambre-Enfants/bed_d.png" },
                    new Phaser.Math.Vector2(-265, 608)
                ),
                new CardObject(
                    this,
                    { name: "motherSceneColoring_d", url: "sprites/MotherScene/01_Chambre-Enfants/coloring_d.png" },
                    new Phaser.Math.Vector2(30, 467)
                ),
                new CardObject(
                    this,
                    { name: "motherSceneXwing_d", url: "sprites/MotherScene/01_Chambre-Enfants/xwing_d.png" },
                    new Phaser.Math.Vector2(-151, 515)
                ),
                new CardObject(
                    this,
                    { name: "motherSceneBooks_d", url: "sprites/MotherScene/01_Chambre-Enfants/books_d.png" },
                    new Phaser.Math.Vector2(39, 382)
                ),
                new CardObject(
                    this,
                    { name: "motherSceneBox_d", url: "sprites/MotherScene/01_Chambre-Enfants/box_d.png" },
                    new Phaser.Math.Vector2(-74, 296)
                ),
                new CardObject(
                    this,
                    { name: "motherSceneHamper_d", url: "sprites/MotherScene/01_Chambre-Enfants/hamper_d.png" },
                    new Phaser.Math.Vector2(0, 79)
                ),
                new CardObject(
                    this,
                    { name: "motherSceneSwitch_d", url: "sprites/MotherScene/01_Chambre-Enfants/switch_d.png" },
                    new Phaser.Math.Vector2(382, 396)
                ),
                new CardObject(
                    this,
                    { name: "motherSceneGlobe_d", url: "sprites/MotherScene/01_Chambre-Enfants/globe_d.png" },
                    new Phaser.Math.Vector2(338, 145)
                )
            ]
        );

        this.cards = [
            this.main_card
        ];

        //Keep track of wich card is displayed
        current_card = this.main_card;
        this.current_card = current_card;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this, "florenceDialogMarch");

        //Keep track of all cleanable objects
        this.cleanable_objects = INIT_CLEANABLE_OBJECTS;
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data {  }
     */
    init(data) {

    }

    /**
     * @brief Cleans up an item in the scene
     * @param {CardObject} cardObj the object that will be cleaned
     * @param {Phaser.Math.Vector3} cleanPos the new position of said object
     * @param {string} cleanName name of the object's "clean" sprite
     * @param {boolean} animate whether or not we would like to animate the object
     */
    cleanObject(cardObj, cleanPos, cleanName, animate = true) {
        //retrieve the object's position and destroy it
        const obj_pos = new Phaser.Math.Vector2(cardObj.x, cardObj.y);
        cardObj.destroy();

        //Create the new sprite at the old position
        const clean_obj = this.add.image(obj_pos.x, obj_pos.y, cleanName);
        clean_obj.setDepth(cleanPos.z);

        if(animate) {
            //Animate the object to go to its final location
            this.tweens.add({
                targets: clean_obj,
                x: cleanPos.x,
                y: cleanPos.y,
                duration: 800,
                ease: 'Quadratic',
                loop: 0
            });
        } else {
            clean_obj.x = cleanPos.x;
            clean_obj.y = cleanPos.y;
        }

        if(--this.cleanable_objects === 0) {
            this.showArrow();
        }
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

        //Load in all of the "clean" sprites
        this.load.image("motherSceneBed_c", "sprites/MotherScene/01_Chambre-Enfants/bed_c.png");
        this.load.image("motherSceneColoring_c", "sprites/MotherScene/01_Chambre-Enfants/coloring_c.png");
        this.load.image("motherSceneXwing_c", "sprites/MotherScene/01_Chambre-Enfants/xwing_c.png");
        this.load.image("motherSceneBooks_c", "sprites/MotherScene/01_Chambre-Enfants/books_c.png");
        this.load.image("motherSceneBox_c", "sprites/MotherScene/01_Chambre-Enfants/box_c.png");
        this.load.image("motherSceneHamper_c", "sprites/MotherScene/01_Chambre-Enfants/hamper_c.png");
        this.load.image("motherSceneSwitch_c", "sprites/MotherScene/01_Chambre-Enfants/switch_c.png");
        this.load.image("motherSceneGlobe_c", "sprites/MotherScene/01_Chambre-Enfants/globe_c.png");

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

        if(this.current_card.isLoaded()) {
            this.current_card.create();

            //Display the first dialogue
            this.dialogue.display("florence");
        }

        //Set all clickable objects
        const clean_positions = [
            new Phaser.Math.Vector3(-244, 696, 1),  //bed
            new Phaser.Math.Vector3(-379, -687, 2), //coloring
            new Phaser.Math.Vector3(-133, -746, 2), //xwing
            new Phaser.Math.Vector3(-261, -746, 2), //books
            new Phaser.Math.Vector3(-122, -124, 0), //box
            new Phaser.Math.Vector3(-313, -129, 1), //hamper
            new Phaser.Math.Vector3(-408, -355, 2), //switch
            new Phaser.Math.Vector3(-304, -478, 2)  //globe
        ];

        const clean_names = [
            "motherSceneBed_c",
            "motherSceneColoring_c",
            "motherSceneXwing_c",
            "motherSceneBooks_c",
            "motherSceneBox_c",
            "motherSceneHamper_c",
            "motherSceneSwitch_c",
            "motherSceneGlobe_c"
        ];

        //Make all cleanable objects clickable
        for(let i = 0; i < INIT_CLEANABLE_OBJECTS; ++i) {
            const clean_obj = this.current_card.children[4 + i].sprite;

            clean_obj.setInteractive().on(
                'pointerdown',
                () => {
                    if(this.dialogue.isDone()) {
                        this.cleanObject(
                            clean_obj,
                            clean_positions[i],
                            clean_names[i],
                            (i !== 0 && i !== 5) //don't animate the bed and the hamper
                        );  
                    }
                },
                this
            );
        }

        //Update the saved data
        player.cur_scene = Scenes.MOTHER;
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
     * @brief Notifies the current card that the dialogue has ended
     */
    notifyDialogueEnd() {
        //Notify the current card if it is interested
        if(this.current_card.isDialogueSensitive()) {
            this.current_card.notifyDialogueEnd();
        }
    }

    /**
     * @brief moves to the next card
     * @param {Number} choice the choice that was made
     */
    nextCard(choice=-1) {

        if(this.current_card.isDone()) {
            this.current_card.destroy();
        }

        //Store the saved data
        player.saveGame();
    }

    /**
     * @brief Triggers the next scene
     */
    nextScene() {

        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.BUILDING, {
                mainMenu: false,
                names: false,
                stage: 2,
                windows: {
                    damien: WindowState.OFF,
                    grandma: WindowState.ON,
                    family: WindowState.OFF,
                    indep: WindowState.OFF
                },
                month: Months.MAY,
                nextScene: {
                    damien: null,
                    grandma: Scenes.GRANDMA,
                    family: null,
                    indep: null
                }
            }),
            this
        );        
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}