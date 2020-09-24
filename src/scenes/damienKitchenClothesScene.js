import Phaser, { GameObjects } from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { ProtoGuy, ProtoGuyCard } from "../characters/protoGuy.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { ProtoGuyClothes, StudentCards } from "./studentScene.js";

const NUM_CARDS = 2;

export class DamienKitchenClothesScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({ key: Scenes.DAMIEN_KITCHEN_CLOTHES });

        //Keep track of the clothes that protoguy is wearing
        this.clothes = ProtoGuyClothes.PYJAMAS;

        const characters = {
            'clothes': new ProtoGuy(this, 51, 115, ProtoGuyCard.CLOTHES),
            'kitchen': new ProtoGuy(this, -218, -32, ProtoGuyCard.KITCHEN)
        };

        this.clothesCard = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/StudentScene/ClothesCard/bg.jpg",
                    "ClothesBG"
                ),
                new CardObject(
                    this,
                    { name: "clothes", url: "sprites/StudentScene/ClothesCard/clothes.png" },
                    new Phaser.Math.Vector2(293, -15),
                    (scene) => scene.changeClothes(ProtoGuyClothes.CLEAN_CLOTHES),
                    this,
                    -1,
                    {
                        name: 'clothes_h',
                        url: "sprites/UI/01_Interactions/01_Etudiants/02_Spritesheets/04-Etudiant-HabitsPropres-Spritesheet_400x210.png",
                        size: { frameWidth: 400, frameHeight: 210 },
                        pos: new Phaser.Math.Vector2(157, -649)
                    }
                ),
                new CardObject(
                    this,
                    { name: "chair", url: "sprites/StudentScene/ClothesCard/chair.png" },
                    new Phaser.Math.Vector2(-225, 385),
                    (scene) => scene.changeClothes(ProtoGuyClothes.YESTERDAY_CLOTHES),
                    this,
                    -1,
                    {
                        name: 'chair_h',
                        url: "sprites/UI/01_Interactions/01_Etudiants/02_Spritesheets/03-Etudiant-HabitsSales-Spritesheet_280x204.png",
                        size: { frameWidth: 280, frameHeight: 204 },
                        pos: new Phaser.Math.Vector2(-297, 40)
                    }
                ),
                characters['clothes']
            ],
            characters['clothes']
        );

        this.kitchenCard = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/StudentScene/KitchenCard/bg.jpg",
                    "KitchenBG"
                ),
                characters['kitchen'],
                new CardObject(
                    this,
                    { name: "fridge", url: "sprites/StudentScene/KitchenCard/frigo.png" },
                    new Phaser.Math.Vector2(194, -151),
                    null,
                    null,
                    1,
                    {
                        name: 'fridge_h',
                        url: "sprites/UI/01_Interactions/01_Etudiants/02_Spritesheets/07-Etudiant-Yogourt-Spritesheet_220x170.png",
                        size: { frameWidth: 220, frameHeight: 170 },
                        pos: new Phaser.Math.Vector2(111, -144)
                    }
                ),
                new CardObject(
                    this,
                    { name: "table", url: "sprites/StudentScene/KitchenCard/table.png" },
                    new Phaser.Math.Vector2(-29, 388)
                ),
                new CardObject(
                    this,
                    { name: "counter", url: "sprites/StudentScene/KitchenCard/comptoire.png" },
                    new Phaser.Math.Vector2(0, 482)
                ),
                new CardObject(
                    this,
                    { name: "sink", url: "sprites/StudentScene/KitchenCard/lavabo.png" },
                    new Phaser.Math.Vector2(224, 607),
                    null,
                    null,
                    2,
                    {
                        name: 'sink_h',
                        url: "sprites/UI/01_Interactions/01_Etudiants/02_Spritesheets/08-Etudiant-Verre-Spritesheet_295x180.png",
                        size: { frameWidth: 295, frameHeight: 180 },
                        pos: new Phaser.Math.Vector2(105, 593)
                    }
                ),
                new CardObject(
                    this,
                    { name: "counter_stuff", url: "sprites/StudentScene/KitchenCard/objets.png" },
                    new Phaser.Math.Vector2(145, 695)
                ),
                new CardObject(
                    this,
                    { name: "toaster", url: "sprites/StudentScene/KitchenCard/toaster.png" },
                    new Phaser.Math.Vector2(-358, 653),
                    null,
                    null,
                    0,
                    {
                        name: 'toast_h',
                        url: "sprites/UI/01_Interactions/01_Etudiants/02_Spritesheets/06-Etudiant-Toast-Spritesheet_180x160.png",
                        size: { frameWidth: 180, frameHeight: 160 },
                        pos: new Phaser.Math.Vector2(-278, 556)
                    }
                ),
                new CardObject(
                    this,
                    { name: "lamp", url: "sprites/StudentScene/KitchenCard/lampe.png" },
                    new Phaser.Math.Vector2(93, -478)
                )
            ],
            characters['kitchen']
        );

        this.cards = [
            this.clothesCard,
            this.kitchenCard
        ];

        //Keep track of wich card is displayed
        this.cardIdx = null;
        this.current_card = null;

        //Create the dialogue controller
        this.dialogue = new DialogueController(this, "damienDialogMarch");
    }

    /**
     * @brief Preloads the scene using saved data (if any)
     * @param {JSON} data { cardIdx }
     */
    init(data) {
        //Check if any saved data exists
        if(data) {

            //Set the correct card
            switch(data.cardIdx) {
            case StudentCards.CLOTHES:
                this.current_card = this.clothesCard;
                this.cardIdx = StudentCards.CLOTHES;
                break;

            case StudentCards.KITCHEN:
                this.current_card = this.kitchenCard;
                this.cardIdx = StudentCards.KITCHEN;
                break;

            default:
                break;
            }
        }
    }

    /**
     * @brief Notifies the protoGuy that his clothes have changed
     * @param {ProtoGuyClothes} clothes the protoguy's new clothes
     */
    changeClothes(clothes) {
        if(this.current_card.hasCharacter()) {
            this.clothes = clothes;
            this.current_card.character.notifyClothesChange();
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

        //load sounds
        this.load.audio("toast",["sounds/kitchen/toasterPop.wav", "sounds/kitchen/toasterPop.mp3"]);
        this.load.audio("fridge",["sounds/kitchen/fridge.wav", "sounds/kitchen/fridge.mp3"]);
        this.load.audio("glass",["sounds/kitchen/glass.wav", "sounds/kitchen/glass.mp3"]);

        if(this.cardIdx === StudentCards.CLOTHES) {
            this.load.spritesheet(
                'pj_h',
                'sprites/UI/01_Interactions/01_Etudiants/02_Spritesheets/05-Etudiant-Pyjama-Spritesheet_208x146.png',
                { frameWidth: 208, frameHeight: 146 }
            );
        }
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

            //Trigger the dialogue
            if(this.cardIdx === StudentCards.CLOTHES) {
                this.dialogue.display("habit");

                this.anims.create({
                    key: "pj_h_anim",
                    frameRate: 7,
                    frames: this.anims.generateFrameNames('pj_h'),
                    repeat: -1
                });

                this.pj_h = this.add.sprite(
                    96,
                    -50,
                    'pj_h'
                ).play("pj_h_anim");

            } else {
                this.dialogue.display("frigo");
            }
        }

        //Update the saved data
        player.cur_scene = Scenes.DAMIEN_KITCHEN_CLOTHES;

        this.toast = this.sound.add("toast");
        this.fridge = this.sound.add("fridge");
        this.glass = this.sound.add("glass");

        this.input.on(
            'gameobjectdown',
            (_, GameObject) => {
                if(GameObject.texture.key === "toaster_h") {
                    this.toast.play();
                }
                else if(GameObject.texture.key === "fridge_h") {
                    this.fridge.play();
                }
                else if(GameObject.texture.key === "sink_h") {
                    this.glass.play();
                }

            }
        );
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
    nextCard(choice) {

        //Data that will be saved
        let savable_data = {
            cardIdx: this.cardIdx,
            clothes: this.clothes,
            food: -1
        };

        this.current_card.destroy();

        switch(this.cardIdx) {

        case StudentCards.CLOTHES:
            //Chose the next card depending on the user's choice
            this.cardIdx = StudentCards.COMPUTER;
            this.nextScene({food: choice, clothes: this.clothes});
            break;

        case StudentCards.KITCHEN:
            this.cardIdx = StudentCards.COMPUTER;
            this.nextScene({food: choice, clothes: this.clothes});

            //Save the food choice
            savable_data.food = choice;
            break;

        default:
            break;
        }

        //Save the card and clothes choices
        savable_data.cardIdx = this.cardIdx;
        savable_data.clothes = this.clothes;

        //Store the saved data
        player.setData(savable_data);
        player.saveGame();
    }

    nextScene(choices) {
        this.cameras.main.fadeOut(1000);

        this.scene.start(Scenes.DAMIEN_COMPUTER, {
            cardIdx: StudentCards.COMPUTER,
            clothes: choices.clothes,
            food: choices.food
        });
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();

        this.pj_h.destroy();
    }
}
