import { Background } from "../../objects/background";
import { Card } from "../card";

const ANIM_SWITCH_N_TICKS = 150;

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent
 * a given interactive moment in a scene
 */
export class TVCard extends Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param parent_scene, the Scene which this card belongs to
     */
    constructor(parent_scene) {
        //Call base constructor
        super(parent_scene, []);

        //Initialize children array
        const children = [
            new Background(
                parent_scene,
                "sprites/IndepScene/03_Television/bg.png",
                "tvBG"
            )
        ];

        this.children = children;

        //True => conseil is playing, false => simonetta is playing
        this.which_anim = true;
        this.ticks = 0;
    }

    preload() {
        super.preload();

        //Load the cat animation spritesheet
        this.parent_scene.load.spritesheet(
            'conseil',
            'sprites/IndepScene/03_Television/conseil.png',
            { frameWidth: 1013, frameHeight: 554 }
        );

        //Load the arrow animation spritesheet
        this.parent_scene.load.spritesheet(
            'simonetta',
            'sprites/IndepScene/03_Television/simonetta.png',
            { frameWidth: 1013.5, frameHeight: 554 }
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

        //=========HANDLE_ANIMATIONS=========

        // Create animations for the tv sprites
        this.parent_scene.anims.create({
            key: 'conseil-anim',
            frameRate: 7,
            frames: this.parent_scene.anims.generateFrameNames('conseil'),
            repeat: -1
        });

        //Create the animation
        this.parent_scene.anims.create({
            key: 'simonetta-anim',
            frameRate: 7,
            frames: this.parent_scene.anims.generateFrameNames('simonetta'),
            repeat: -1
        });

        //Play the animation
        this.simonetta_anim = this.parent_scene.add.sprite(
            -4,
            -1,
            'simonetta'
        ).play('simonetta-anim').setVisible(false);

        //Play the animation
        this.conseil_anim = this.parent_scene.add.sprite(
            -4,
            -1,
            'conseil'
        ).play('conseil-anim'); 

        this.showArrow();
    }

    update() {
        if(++this.ticks >= ANIM_SWITCH_N_TICKS) {
            //Reset the tick counter
            this.ticks = 0;

            //Switch between the two animations
            if(this.which_anim) {
                this.conseil_anim.setVisible(false);
                this.simonetta_anim.setVisible(true);
                this.which_anim = false;
            } else {
                this.simonetta_anim.setVisible(false);
                this.conseil_anim.setVisible(true);
                this.which_anim = true;
            }
        }
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
            245,
            716,
            'arrow'
        ).play('arrow_anim');

        //Make the arrow end the scene
        this.arrow.setInteractive().on(
            'pointerdown',
            () => this.parent_scene.nextCard(),
            this
        );
    }

    destroy() {
        super.destroy();

        this.simonetta_anim.destroy();
        this.conseil_anim.destroy();
        this.arrow.destroy();
    }
}


