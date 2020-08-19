import { Background } from "../../objects/background";
import { Card } from "../card";
import { Scenes } from "../../../core/player";

const ANIM_SWITCH_N_TICKS = 150;

const TV_STATE = {
    CONSEIL: 0,
    SIMONETTA: 1,
    GRAPH: 2
};

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
    constructor(parent_scene, scene_key) {
        //Call base constructor
        super(parent_scene, []);

        this.scene_key = scene_key;

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
        this.which_anim = TV_STATE.CONSEIL;
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

        //Load the simonetta animation spritesheet
        this.parent_scene.load.spritesheet(
            'simonetta',
            'sprites/IndepScene/03_Television/simonetta.png',
            { frameWidth: 1013.5, frameHeight: 554 }
        );

        //Load the graph animation spritesheets
        this.parent_scene.load.spritesheet(
            'graph_up',
            'sprites/IndepScene/03_Television/graph_up.png',
            { frameWidth: 1013, frameHeight: 546 }
        );

        this.parent_scene.load.spritesheet(
            'graph_flat',
            'sprites/IndepScene/03_Television/graph_flat.png',
            { frameWidth: 1013, frameHeight: 546 }
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

        //Create the animations
        this.parent_scene.anims.create({
            key: 'simonetta-anim',
            frameRate: 7,
            frames: this.parent_scene.anims.generateFrameNames('simonetta'),
            repeat: -1
        });

        this.parent_scene.anims.create({
            key: 'graph_up-anim',
            frameRate: 7,
            frames: this.parent_scene.anims.generateFrameNames('graph_up'),
            repeat: -1
        });

        this.parent_scene.anims.create({
            key: 'graph_flat-anim',
            frameRate: 7,
            frames: this.parent_scene.anims.generateFrameNames('graph_flat'),
            repeat: -1
        });

        //Play the animation
        this.simonetta_anim = this.parent_scene.add.sprite(
            -4,
            -1,
            'simonetta'
        ).play('simonetta-anim').setVisible(false);

        if(this.scene_key === Scenes.INDEP) {
            console.log("Month = March");
            this.graph_anim = this.parent_scene.add.sprite(
                12,
                -4,
                'graph_up'
            ).play('graph_up-anim').setVisible(false);
        } else {
            console.log("Month = April");
            this.graph_anim = this.parent_scene.add.sprite(
                12,
                -4,
                'graph_flat'
            ).play('graph_flat-anim').setVisible(false);
        }

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
            if(this.which_anim === TV_STATE.CONSEIL) {
                this.conseil_anim.setVisible(false);
                this.simonetta_anim.setVisible(true);
                this.which_anim = TV_STATE.SIMONETTA;
            } else if(this.which_anim === TV_STATE.SIMONETTA) {
                this.simonetta_anim.setVisible(false);
                this.graph_anim.setVisible(true);
                this.which_anim = TV_STATE.GRAPH;
            } else {
                this.graph_anim.setVisible(false);
                this.conseil_anim.setVisible(true);
                this.which_anim = TV_STATE.CONSEIL;
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
        this.graph_anim.destroy();
        this.arrow.destroy();
    }
}
