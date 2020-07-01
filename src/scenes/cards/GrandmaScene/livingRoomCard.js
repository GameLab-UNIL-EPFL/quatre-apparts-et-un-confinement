import { Background } from "../../objects/background";
import { Card } from "../card";
import { CardObject } from "../../objects/cardObject";
import { GrandmaCards } from "../../grandmaScene";

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
                new Phaser.Math.Vector2(1025, 1325)
            ),
            new CardObject(
                parent_scene,
                { name: "book_01", url: "sprites/GrandmaScene/books_01.png" },
                new Phaser.Math.Vector2(799, 919),
                () => {},
                null,
                -1,
                { name: "book_01_h", url: "sprites/GrandmaScene/books_01_h.png" }
            ),
            new CardObject(
                parent_scene,
                { name: "book_02", url: "sprites/GrandmaScene/books_02.png" },
                new Phaser.Math.Vector2(799, 1207),
                () => {},
                null,
                -1,
                { name: "book_02_h", url: "sprites/GrandmaScene/books_02_h.png" }
            ),
            new CardObject(
                parent_scene,
                { name: "book_03", url: "sprites/GrandmaScene/books_03.png" },
                new Phaser.Math.Vector2(799, 1459),
                () => {},
                null,
                -1,
                { name: "book_03_h", url: "sprites/GrandmaScene/books_03_h.png" }
            ),
            new CardObject(
                parent_scene,
                { name: "radio", url: "sprites/GrandmaScene/radio.png" },
                new Phaser.Math.Vector2(788, 1693),
                (scene) => scene.nextCard(GrandmaCards.RADIO),
                parent_scene,
                -1,
                { name: "radio_h", url: "sprites/GrandmaScene/radio_h.png" }
            ),
            new CardObject(
                parent_scene,
                { name: "calendar", url: "sprites/GrandmaScene/calendar.png" },
                new Phaser.Math.Vector2(768, 1986),
                (scene) => scene.nextCard(GrandmaCards.CALENDAR),
                parent_scene,
                -1,
                { name: "calendar_h", url: "sprites/GrandmaScene/calendar_h.png" }
            ),
            new CardObject(
                parent_scene,
                { name: "grandma", url: "sprites/GrandmaScene/grandma_idle.png" },
                new Phaser.Math.Vector2(1262, 1918)
            ),
            new CardObject(
                parent_scene,
                { name: "coffee_table", url: "sprites/GrandmaScene/coffee_table.png" },
                new Phaser.Math.Vector2(1781, 2289)
            )
        ];

        //Call base constructor
        super(parent_scene, children);
    }

    preload() {
        super.preload();

        //Load the ring animation spritesheet
        this.parent_scene.load.spritesheet(
            'cat',
            'sprites/GrandmaScene/cat.png',
            { frameWidth: 378, frameHeight: 269 }
        );
    }

    /**
     * @brief Sets all of the animations related to the objects in the card
     */
    create() {
        super.create();

        //=========HANDLE_ANIMATIONS=========

        // Create ring sprites
        this.parent_scene.anims.create({
            key: 'cat-tail',
            frameRate: 15,
            frames: this.parent_scene.anims.generateFrameNames('cat'),
            repeat: -1
        });

        //Play the ring animation
        this.cat_anim = this.parent_scene.add.sprite(
            1041,
            2568,
            'cat'
        ).play('cat-tail');
    }
}
