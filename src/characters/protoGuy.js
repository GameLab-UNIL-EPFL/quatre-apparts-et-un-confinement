import Phaser from "phaser";
import {ProtoGuyClothes} from "../scenes/protoScene.js"

const ProtoGuyState = {
    IDLE: 'idle',
    SCRATCH_DOWN: 'down',
    SCRATCH_UP: 'up'
};

export const ProtoGuyCard = {
    WAKE_UP: 0,
    CHOSE_PATH: 1,
    CLOTHES: 2,
    KITCHEN: 3,
    COMPUTER: 4,
    MINI_GAME: 5,
    MESSAGE: 6
};

/**
 * @brief Models the prototype guy
 * Is mostly used to keep track of the choices made with 
 * this character and his current state.
 */
export class ProtoGuy {
    /**
     * @brief Creates the character in the give scene
     * @param {Phaser.Scene} parent_scene, the scene in which the character is contained
     * @param {int} x, the x position of the character in the scene
     * @param {int} y, the y position of the character in the scene
     * @param {ProtoGuyCard} card, the card in which protoGuy is found
     */
    constructor(parent_scene, x, y, card) {
        this.parent_scene = parent_scene;
        this.x = x;
        this.y = y;

        this.card = card;
        this.sprites = [];

        switch(card) {
            case ProtoGuyCard.WAKE_UP:
                this.base_url = "/sprites/ProtoScene/WakeUpCard/character_body.png";
                this.base_name = "character_body";
                this.base_offset_x = 0;
                this.base_offset_y = 0;

                this.head_url = "/sprites/ProtoScene/WakeUpCard/character_head.png";
                this.head_name = "character_head";
                this.head_offset_x = 505;
                this.head_offset_y = -554;

                this.arm_url = "/sprites/ProtoScene/WakeUpCard/character_arm.png";
                this.arm_name = "chracter_arm";
                this.arm_offset_x = -85;
                this.arm_offset_y = -890;

                 //Initialize the different FSMs
                this.cur_state = ProtoGuyState.IDLE;
                this.rotate = 0;
                break;

            case ProtoGuyCard.CHOSE_PATH:
                this.name = "chosePathProtoGuy";
                this.url = "sprites/ProtoScene/ChosePathCard/ProtoGuy.png";
                break;

            case ProtoGuyCard.CLOTHES:

                this.dirty_name = "clothesProtoGuy_dirty";
                this.dirty_url = "/sprites/ProtoScene/ClothesCard/protoGuy_Y.png";

                this.clean_name = "clothesProtoGuy_clean";
                this.clean_url = "/sprites/ProtoScene/ClothesCard/protoGuy_G.png";

                this.pj_name = "clothesProtoGuy_pj";
                this.pj_url = "sprites/ProtoScene/ClothesCard/protoGuy.png";
                break;

            case ProtoGuyCard.KITCHEN:
                this.name = "kitchenProtoGuy";
                this.url = "sprites/ProtoScene/KitchenCard/protoGuy.png";
                break;

            case ProtoGuyCard.COMPUTER:
                this.dirty_name = "computeProtoGuyDirty";
                this.dirty_url = "sprites/ProtoScene/ComputerCard/habits-sales.png";

                this.clean_name = "computeProtoGuyClean";
                this.clean_url = "sprites/ProtoScene/ComputerCard/habits-propres.png";

                this.pj_name = "computeProtoGuyPJ";
                this.pj_url = "sprites/ProtoScene/ComputerCard/habits-pyjama.png";
                break;

            case ProtoGuyCard.MINI_GAME:
                break;

            case ProtoGuyCard.MESSAGE:
                this.dirty_name = "computeProtoGuyDirty_msg";
                this.dirty_url = "sprites/ProtoScene/MessageCard/protoGuyYesterdayClothes.png";

                this.clean_name = "computeProtoGuyClean_msg";
                this.clean_url = "sprites/ProtoScene/MessageCard/protoGuyGClothes.png";

                this.pj_name = "computeProtoGuyPJ_msg";
                this.pj_url = "sprites/ProtoScene/MessageCard/protoGuyPJs.png";
                break;

            default:
                break;
        }
    }

    /**
     * @brief Notifies the character of a change in his clothing
     */
    notifyClothesChange() {
        //Get rid of the existing protoGuy
        this.destroy();

        //Chose which clothes to wear
        switch(this.parent_scene.clothes) {
            case ProtoGuyClothes.PYJAMAS:
                this.sprite = this.parent_scene.add.image(this.x, this.y, this.pj_name);
                this.sprite.setInteractive();
                break;

            case ProtoGuyClothes.YESTERDAY_CLOTHES:
                this.sprite = this.parent_scene.add.image(this.x, this.y, this.dirty_name);
                this.sprite.setInteractive();
                break;

            case ProtoGuyClothes.CLEAN_CLOTHES:
                this.sprite = this.parent_scene.add.image(this.x, this.y, this.clean_name);
                this.sprite.setInteractive();
                break;

            default:
                break;
        }

        //Store sprite
        this.sprites = [this.sprite];
    }

    /**
     * @brief Loads the three different clothes sprites in
     */
    loadManyClothes() {
        this.parent_scene.load.image(this.dirty_name, this.dirty_url);
        this.parent_scene.load.image(this.clean_name, this.clean_url);
        this.parent_scene.load.image(this.pj_name, this.pj_url);
    }

    /**
     * @brief Loads in all of the images needed to draw the character
     */
    preload() {
        switch(this.card) {
            case ProtoGuyCard.WAKE_UP:
                this.parent_scene.load.image(this.base_name, this.base_url);
                this.parent_scene.load.image(this.arm_name, this.arm_url);
                this.parent_scene.load.image(this.head_name, this.head_url);
                break;

            case ProtoGuyCard.CHOSE_PATH:
                this.parent_scene.load.image(this.name, this.url);
                break;

            case ProtoGuyCard.CLOTHES:
                this.loadManyClothes();
                break;

            case ProtoGuyCard.KITCHEN:
                this.parent_scene.load.image(this.name, this.url);
                break;

            case ProtoGuyCard.COMPUTER:
                this.loadManyClothes();
                break;

            case ProtoGuyCard.MINI_GAME:
                break;

            case ProtoGuyCard.MESSAGE:
                this.loadManyClothes();
                break;

            default:
                break;
        }
    }

    /**
     * @brief Makes protoguy a card changing trigger
     * @param {int} choice, the choice that this trigger intells
     */
    setProtoGuyCardTrigger(choice) {
        this.sprite = this.parent_scene.add.image(this.x, this.y, this.name);
        this.sprites = [this.sprite];

        //Make the sprite interactive and add an event listener
        this.sprite.setInteractive();
        this.parent_scene.input.on(
            'gameobjectdown',
            (pointer, gameObject) => {
                //Check that we clicked on the closet
                if(gameObject === this.sprite) {
                    console.log("click protoGuy");

                    //Go to the next scene
                    this.parent_scene.endCard();
                    this.parent_scene.nextCard(choice);
                }
            },
            this.parent_scene
        );
    }

    /**
     * @brief Draws and places all of the character's images in the scene
     */
    create() {
        switch(this.card) {
            case ProtoGuyCard.WAKE_UP:
                //Create the different sprites that make up the character
                this.base_sprite = this.parent_scene.add.image(this.x, this.y, this.base_name);
                this.arm_sprite = this.parent_scene.add.image(this.x + this.head_offset_x, this.y + this.head_offset_y, this.arm_name);
                this.head_sprite = this.parent_scene.add.image(this.x + this.arm_offset_x, this.y + this.arm_offset_y, this.head_name);

                this.sprites = [this.base_sprite, this.arm_sprite, this.head_sprite];

                this.arm_sprite.setOrigin(0, 0); 
                this.arm_sprite.angle += 190;
                this.arm_sprite.x -= 10; 
                this.arm_sprite.y += 10;
                this.cur_state = ProtoGuyState.SCRATCH_DOWN;

                //Set wake up card animation
                this.parent_scene.tweens.add({
                    targets: this.arm_sprite,
                    angle: this.arm_sprite.angle - 10,
                    x: this.arm_sprite.x + 10,
                    y: this.arm_sprite.y - 10,
                    duration: 500,
                    ease: "Linear",
                    yoyo: true,
                    loop: -1
                });

                break;

            case ProtoGuyCard.CHOSE_PATH:
                //Make protoguy trigger a card change
                this.setProtoGuyCardTrigger(2);
                break;

            case ProtoGuyCard.CLOTHES:
                this.sprite = this.parent_scene.add.image(this.x, this.y, this.pj_name);
                this.sprites = [this.sprite];

                //Make protoguy trigger a card change
                this.sprite.setInteractive();
                this.parent_scene.input.on(
                    'gameobjectdown',
                    (pointer, gameObject) => {
                        //Check that we clicked on the closet
                        if(gameObject === this.sprite) {
                            console.log("click protoGuy");
        
                            //Go to the next scene
                            this.parent_scene.endCard();
                            this.parent_scene.nextCard();
                        }
                    },
                    this.parent_scene
                );
                break;

            case ProtoGuyCard.KITCHEN:
                this.sprite = this.parent_scene.add.image(this.x, this.y, this.name);
                this.sprites = [this.sprite];
                break;

            case ProtoGuyCard.COMPUTER:
                //Show the version of the character wearing the selected clothes
                switch(this.parent_scene.clothes) {
                    case ProtoGuyClothes.PYJAMAS:
                        this.sprite = this.parent_scene.add.image(this.x, this.y, this.pj_name);
                        break;

                    case ProtoGuyClothes.CLEAN_CLOTHES:
                        this.sprite = this.parent_scene.add.image(this.x, this.y, this.clean_name);
                        break;

                    case ProtoGuyClothes.YESTERDAY_CLOTHES:
                        this.sprite = this.parent_scene.add.image(this.x, this.y, this.dirty_name);
                        break;
                }

                this.sprites = [this.sprite];
                break;

            case ProtoGuyCard.MINI_GAME:
                break;

            case ProtoGuyCard.MESSAGE:
                 //Show the version of the character wearing the selected clothes
                 switch(this.parent_scene.clothes) {
                    case ProtoGuyClothes.PYJAMAS:
                        this.sprite = this.parent_scene.add.image(this.x, this.y, this.pj_name);
                        break;

                    case ProtoGuyClothes.CLEAN_CLOTHES:
                        this.sprite = this.parent_scene.add.image(this.x, this.y, this.clean_name);
                        break;

                    case ProtoGuyClothes.YESTERDAY_CLOTHES:
                        this.sprite = this.parent_scene.add.image(this.x, this.y, this.dirty_name);
                        break;
                }

                this.sprites = [this.sprite];
                break;

            default:
                break;
        }
    }

    /**
     * Intentionally does nothing
     */
    update() {}

    /**
     * @brief Unloads all of the sprites from memory
     */
    destroy() {
        this.sprites.forEach(sprite => sprite.destroy());
        this.sprites = [];
    }
}