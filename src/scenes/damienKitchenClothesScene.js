import Phaser, { GameObjects } from "phaser";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { ProtoGuy, ProtoGuyCard } from "../characters/protoGuy.js";
import { player } from "../index.js";
import { Scenes } from "../core/player.js";
import { ProtoGuyClothes, ProtoCards } from "./protoScene.js";

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
                    "sprites/ProtoScene/ClothesCard/bg.jpg",
                    "ClothesBG"
                ),
                new CardObject(
                    this,
                    { name: "clothes", url: "sprites/ProtoScene/ClothesCard/clothes.png" },
                    new Phaser.Math.Vector2(293, -15),
                    (scene) => scene.changeClothes(ProtoGuyClothes.CLEAN_CLOTHES),
                    this,
                    -1,
                    { name: "clothes_h", url: "sprites/ProtoScene/ClothesCard/clothes_h.png" }
                ),
                new CardObject(
                    this,
                    { name: "chair", url: "sprites/ProtoScene/ClothesCard/chair.png" },
                    new Phaser.Math.Vector2(-225, 385),
                    (scene) => scene.changeClothes(ProtoGuyClothes.YESTERDAY_CLOTHES),
                    this,
                    -1,
                    { name: "chair_h", url: "sprites/ProtoScene/ClothesCard/chair_h.png" }
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
                    "sprites/ProtoScene/KitchenCard/bg.jpg",
                    "KitchenBG"
                ),
                characters['kitchen'],
                new CardObject(
                    this,
                    { name: "fridge", url: "sprites/ProtoScene/KitchenCard/frigo.png" },
                    new Phaser.Math.Vector2(194, -151),
                    null,
                    null,
                    1,
                    { name: "fridge_h", url: "sprites/ProtoScene/KitchenCard/frigo_h.png" }
                ),
                new CardObject(
                    this,
                    { name: "table", url: "sprites/ProtoScene/KitchenCard/table.png" },
                    new Phaser.Math.Vector2(-29, 388)
                ),
                new CardObject(
                    this,
                    { name: "counter", url: "sprites/ProtoScene/KitchenCard/comptoire.png" },
                    new Phaser.Math.Vector2(0, 482)
                ),
                new CardObject(
                    this,
                    { name: "sink", url: "sprites/ProtoScene/KitchenCard/lavabo.png" },
                    new Phaser.Math.Vector2(224, 607),
                    null,
                    null,
                    2,
                    { name: "sink_h", url: "sprites/ProtoScene/KitchenCard/lavabo_h.png" }
                ),
                new CardObject(
                    this,
                    { name: "counter_stuff", url: "sprites/ProtoScene/KitchenCard/objets.png" },
                    new Phaser.Math.Vector2(145, 695)
                ),
                new CardObject(
                    this,
                    { name: "toaster", url: "sprites/ProtoScene/KitchenCard/toaster.png" },
                    new Phaser.Math.Vector2(-358, 653),
                    null,
                    null,
                    0,
                    { name: "toaster_h", url: "sprites/ProtoScene/KitchenCard/toaster_h.png" }
                ),
                new CardObject(
                    this,
                    { name: "lamp", url: "sprites/ProtoScene/KitchenCard/lampe.png" },
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
                case ProtoCards.CLOTHES:
                    this.current_card = this.clothesCard;
                    this.cardIdx = ProtoCards.CLOTHES;
                    break;

                case ProtoCards.KITCHEN:
                    this.current_card = this.kitchenCard;
                    this.cardIdx = ProtoCards.KITCHEN;
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
        this.load.audio("toast", "sounds/kitchen/toasterPop.wav");
        this.load.audio("fridge", "sounds/kitchen/fridge.wav");
        this.load.audio("glass", "sounds/kitchen/glass.wav");
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
            if(this.cardIdx === ProtoCards.CLOTHES) {
                this.dialogue.display("habit");
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
                console.log(GameObject.texture.key);
                if(GameObject.texture.key === "toaster_h"){
                    this.toast.play();
                }
                else if(GameObject.texture.key === "fridge_h"){
                    this.fridge.play();
                }
                else if(GameObject.texture.key === "sink_h"){
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

            case ProtoCards.CLOTHES:
                //Chose the next card depending on the user's choice
                this.cardIdx = ProtoCards.COMPUTER;
                this.nextScene({food: choice, clothes: this.clothes});
                break;

            case ProtoCards.KITCHEN:
                this.cardIdx = ProtoCards.COMPUTER;
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
            cardIdx: ProtoCards.COMPUTER,
            clothes: choices.clothes,
            food: choices.food
        });
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        this.current_card.destroy();
    }
}
