import { Background } from "../../objects/background";
import { Card } from "../card";
import { CardObject } from "../../objects/cardObject";
import { GrandmaCards } from "../../grandmaScene";

const GRANDMA_STATES = {
    IDLE: 0,
    BOOK_1: 1,
    BOOK_2: 2,
    BOOK_3: 3,
    PHONE: 4
};

const GRANDMA_POS = new Phaser.Math.Vector2(139, 324);

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent
 * a given interactive moment in a scene
 */
export class LivingRoomCard extends Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param parent_scene, the Scene which this card belongs to
     */
    constructor(parent_scene) {
        //Call base constructor
        super(parent_scene, [], null, true);

        //Initialize children array
        let children = [
            new Background(
                parent_scene,
                "sprites/GrandmaScene/bg.jpg",
                "grandmaBG"
            ),
            new CardObject(
                parent_scene,
                { name: "furniture", url: "sprites/GrandmaScene/furniture.png" },
                new Phaser.Math.Vector2(0, -23)
            ),
            new CardObject(
                parent_scene,
                { name: "book_01", url: "sprites/GrandmaScene/books_01.png" },
                new Phaser.Math.Vector2(-131, -262),
                (card) => card.changeGrandma(GRANDMA_STATES.BOOK_1),
                this,
                -1,
                { name: "book_01_h", url: "sprites/GrandmaScene/books_01_h.png" }
            ),
            new CardObject(
                parent_scene,
                { name: "book_02", url: "sprites/GrandmaScene/books_02.png" },
                new Phaser.Math.Vector2(-134, -92),
                (card) => card.changeGrandma(GRANDMA_STATES.BOOK_2),
                this,
                -1,
                { name: "book_02_h", url: "sprites/GrandmaScene/books_02_h.png" }
            ),
            new CardObject(
                parent_scene,
                { name: "book_03", url: "sprites/GrandmaScene/books_03.png" },
                new Phaser.Math.Vector2(-131, 57),
                (card) => card.changeGrandma(GRANDMA_STATES.BOOK_3),
                this,
                -1,
                { name: "book_03_h", url: "sprites/GrandmaScene/books_03_h.png" }
            ),
            new CardObject(
                parent_scene,
                { name: "radio", url: "sprites/GrandmaScene/radio.png" },
                new Phaser.Math.Vector2(-141, 193),
                (scene) => scene.nextCard(GrandmaCards.RADIO),
                parent_scene,
                -1,
                { name: "radio_h", url: "sprites/GrandmaScene/radio_h.png" }
            ),
            new CardObject(
                parent_scene,
                { name: "calendar", url: "sprites/GrandmaScene/calendar.png" },
                new Phaser.Math.Vector2(-150, 363),
                (scene) => scene.nextCard(GrandmaCards.CALENDAR),
                parent_scene,
                -1,
                { name: "calendar_h", url: "sprites/GrandmaScene/calendar_h.png" }
            ),
            new CardObject(
                parent_scene,
                { name: "phone_grandma", url: "sprites/GrandmaScene/phone.png" },
                new Phaser.Math.Vector2(356, 420),
                (card) => card.changeGrandma(GRANDMA_STATES.PHONE),
                this,
                -1,
                { name: "phone_grandma_h", url: "sprites/GrandmaScene/phone_h.png" }
            ),
            new CardObject(
                parent_scene,
                { name: "coffee_table", url: "sprites/GrandmaScene/coffee_table.png" },
                new Phaser.Math.Vector2(443, 542)
            )
        ];

        this.grandma_state = GRANDMA_STATES.IDLE;
        this.children = children;
        this.objective_complete = false;
    }

    preload() {
        super.preload();

        //Load in grandma sprites
        this.parent_scene.load.image("grandma_idle", "sprites/GrandmaScene/grandma_idle.png");
        this.parent_scene.load.image("grandma_phone", "sprites/GrandmaScene/grandma_phone.png");
        this.parent_scene.load.image("grandma_book1", "sprites/GrandmaScene/grandma_book_01.png");
        this.parent_scene.load.image("grandma_book2", "sprites/GrandmaScene/grandma_book_02.png");
        this.parent_scene.load.image("grandma_book3", "sprites/GrandmaScene/grandma_book_03.png");

        //Load the cat animation spritesheet
        this.parent_scene.load.spritesheet(
            'cat',
            'sprites/GrandmaScene/cat.png',
            { frameWidth: 320, frameHeight: 240 }
        );

        //Load the arrow animation spritesheet
        this.parent_scene.load.spritesheet(
            'arrow',
            'sprites/UI/arrow.png',
            { frameWidth: 100, frameHeight: 100 }
        );
    }

    /**
     * @brief Sets all of the animations related to the objects in the card
     */
    create() {
        super.create();

        //Add in the initial grandma
        this.grandma_sprite = this.parent_scene.add.image(GRANDMA_POS.x, GRANDMA_POS.y, "grandma_idle");

        //Bring the phone and the
        this.children[this.children.length - 1].sprite.setDepth(2);
        this.children[this.children.length - 2].sprite.setDepth(3);
        this.children[this.children.length - 2].highlight_sprite.setDepth(3);

        //=========HANDLE_ANIMATIONS=========

        // Create ring sprites
        this.parent_scene.anims.create({
            key: 'cat-tail',
            frameRate: 15,
            frames: this.parent_scene.anims.generateFrameNames('cat'),
            repeat: -1
        });

        //Play the cat animation
        this.cat_anim = this.parent_scene.add.sprite(
            11,
            677,
            'cat'
        ).play('cat-tail');

        //Update the phone's onclickcallback
        this.children[7].updateOnClickCallback(
            (args) => {
                //Exract arguments
                const card = args[0];
                const sprite = args[1];
                const highlight = args[2];

                //Change the grandma
                card.changeGrandma(GRANDMA_STATES.PHONE);

                //hide the phone
                sprite.setActive(false).setVisible(false);
                highlight.setActive(false).setVisible(false);
            },
            [this, this.children[7].sprite, this.children[7].highlight_sprite]
        );
    }

    /**
     * @brief shows the arrow that sends the user back to the building scene
     */
    showArrow() {
        // Create ring sprites
        this.parent_scene.anims.create({
            key: 'arrow_anim',
            frameRate: 15,
            frames: this.parent_scene.anims.generateFrameNames('arrow'),
            repeat: -1
        });

        //Play the cat animation
        this.arrow = this.parent_scene.add.sprite(
            845 * window.horizontalRatio,
            1516,
            'arrow'
        ).play('arrow_anim');

        //Make the arrow end the scene
        this.arrow.setInteractive().on(
            'pointerdown',
            () => {
                this.parent_scene.destroy();
                this.parent_scene.nextScene();
            },
            this
        );
    }

    /**
     * @brief Disables the correct interaction at the end of a dialogue
     */
    notifyDialogueEnd() {
        switch(this.grandma_state) {
            case GRANDMA_STATES.IDLE:
                break;

            case GRANDMA_STATES.BOOK_1:
                //Reset grandma
                this.changeGrandma(GRANDMA_STATES.IDLE);
                break;

            case GRANDMA_STATES.BOOK_2:
                //Reset grandma
                this.changeGrandma(GRANDMA_STATES.IDLE);
                break;

            case GRANDMA_STATES.BOOK_3:
                //Reset grandma
                this.changeGrandma(GRANDMA_STATES.IDLE);
                break;

            case GRANDMA_STATES.PHONE:
                //show the phone
                this.children[7].sprite.setActive(true).setVisible(true);
                this.children[7].highlight_sprite.setActive(true).setVisible(true);

                this.enableAllInteractions();

                //Reset grandma
                this.changeGrandma(GRANDMA_STATES.IDLE);

                this.showArrow();
                break;

            default:
                break;
        }
    }

    disableAllInteractions() {
        this.children.forEach(child => {

            if(child.sprite) {
                child.sprite.disableInteractive();
            }

            if(child.highlight_sprite) {
                child.highlight_sprite.disableInteractive();
            }
        });
    }

    enableAllInteractions(except=null) {
        this.children.forEach(child => {
            if(child !== except) {
                if(child.sprite) {
                    child.sprite.setInteractive();
                }

                if(child.highlight_sprite) {
                    child.highlight_sprite.setInteractive();
                }
            }
        });
    }

    changeGrandma(state) {
        if(this.parent_scene.dialogue.isDone()) {

            switch(state) {
                case GRANDMA_STATES.IDLE:
                    this.grandma_sprite = this.parent_scene.add.image(
                        GRANDMA_POS.x,
                        GRANDMA_POS.y,
                        "grandma_idle"
                    );
                    break;

                case GRANDMA_STATES.BOOK_1:
                    this.grandma_sprite = this.parent_scene.add.image(
                        GRANDMA_POS.x,
                        GRANDMA_POS.y,
                        "grandma_book1"
                    );

                    //Trigger the book's dialogue
                    this.parent_scene.dialogue.display("livre1");
                    break;

                case GRANDMA_STATES.BOOK_2:
                    this.grandma_sprite = this.parent_scene.add.image(
                        GRANDMA_POS.x,
                        GRANDMA_POS.y,
                        "grandma_book2"
                    );

                    //Trigger the book's dialogue
                    this.parent_scene.dialogue.display("livre2");
                    break;

                case GRANDMA_STATES.BOOK_3:
                    this.grandma_sprite = this.parent_scene.add.image(
                        GRANDMA_POS.x,
                        GRANDMA_POS.y,
                        "grandma_book3"
                    );

                    //Trigger the book's dialogue
                    this.parent_scene.dialogue.display("livre3");
                    break;

                case GRANDMA_STATES.PHONE:
                    this.grandma_sprite = this.parent_scene.add.image(
                        GRANDMA_POS.x,
                        GRANDMA_POS.y,
                        "grandma_phone"
                    );

                    //Disable all of the scenes interactions
                    this.disableAllInteractions();

                    //Trigger the phone's dialogue
                    this.parent_scene.dialogue.display("telephone");
                    break;

                default:
                    break;
            }
        }
    }
}

