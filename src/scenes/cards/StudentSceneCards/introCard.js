import { Card } from "../card";

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent
 * a given interactive moment in a scene
 */
export class IntroCard extends Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param parent_scene, the Scene which this card belongs to
     */
    constructor(parent_scene) {
        super(parent_scene, []);

        //Initialize children array
        this.name = "Intro";
        this.url = "sprites/StudentScene/IntroCard/Case01-00-bkg.jpg";
    }

    /**
     * @brief Preloads all of the elements in the group
     * Assumes that all objects are images
     */
    preload() {
        super.preload();

        this.parent_scene.load.image(this.name, this.url);

        this.parent_scene.load.spritesheet(
            'bipbip',
            'sprites/StudentScene/IntroCard/Case01-01-spritesheet-sonnerie-280x180.png',
            { frameWidth: 280, frameHeight: 180 }
        );

        //Load the sounds
        this.parent_scene.load.audio("alarm",["sounds/damien/alarmClock.wav", "sounds/damien/alarmClock.mp3"]);
        this.parent_scene.load.audio("vibrate",["sounds/damien/vibration.wav", "sounds/damien/vibration.mp3"]);
    }

    /**
     * @brief Creates all of the elements in the group
     * Assumes that all objects are images
     */
    create() {
        super.create();

        //Create and place the temp image correctly
        this.bg = this.parent_scene.add.image(0, 0, this.name);
        this.bg.setInteractive();

        // Create ring sprites
        this.parent_scene.anims.create({
            key: 'bipbip-anim',
            frameRate: 15,
            frames: this.parent_scene.anims.generateFrameNames('bipbip'),
            repeat: -1
        });

        this.bipbipAnim = this.parent_scene.add.sprite(
            0,
            0,
            'bipbip'
        ).play('bipbip-anim');

        //Make said image interactive
        this.parent_scene.input.on(
            'gameobjectdown',
            (_, gameObject) => {
                if(gameObject === this.bg || gameObject === this.bipbipAnim) {
                    this.parent_scene.endCard();
                    this.parent_scene.nextCard();
                }
            },
            this.parent_scene
        );

        // add sounds
        this.alarmSound = this.parent_scene.sound.add("alarm");
        this.vibrateSound = this.parent_scene.sound.add("vibrate");

        this.alarmSound.play({loop: true});
        this.vibrateSound.play({loop: true});
    }

    /**
     * @brief Unloads all the different elements of the card from memory
     */
    destroy() {
        super.destroy();

        //Destroy the sprites
        this.bg.destroy();
        this.bipbipAnim.destroy();
    }
}
