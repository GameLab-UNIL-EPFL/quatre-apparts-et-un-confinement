import Phaser from "phaser";
import { Scenes } from "../core/player";
import { DIALOGUE_BOX_KEY, D_BOX_ANIMATION_KEY, DIALOGUE_BOX_SPRITE_SIZE } from "../core/dialogueController";
import { player } from "..";
import { GrandmaCards } from "./grandmaScene";
import { BusCards } from "./busScene";

export const Months = {
    MARCH: 'march',
    APRIL: 'april',
    MAY: 'may',
    JUNE: 'june'
};

export const WindowState = {
    OFF: 0,
    ON: 1
};

/**
 * @brief Models the outdoor buidling scene
 */
export class BuildingScene extends Phaser.Scene {
    /**
     * @brief initializes the scene
     */
    constructor() {
        super({ key: Scenes.BUILDING });

        //Information about what's shown in the scene
        this.info = {
            mainMenu: true,
            stage: 1,
            names: {
                damien: false,
                grandma: false,
                family: false,
                indep: false
            },
            windows: {
                damien: WindowState.OFF,
                grandma: WindowState.OFF,
                family: WindowState.OFF,
                indep: WindowState.OFF
            },
            month: Months.MARCH,
            nextScene: {
                damien: null,
                grandma: null,
                family: null,
                indep: null
            }
        };

        this.buildingSound = true;

        //Dictionnary containing all of the scene's sprites
        this.sprites = {};
        this.interactions = {};
    }

    /**
     * @brief Preloads the scene using either saved data (if any)
     * or given data from an other scene
     * @param {JSON} data same format as this.info i.e.
     * {
     *     mainMenu: boolean,
     *     stage: Number,
     *     windows: { damien, grandma, family, indep : WindowState },
     *     month: Months,
     *     nextScene: { damien, grandma, family, indep : Scenes or null if window is OFF }
     * }
     */
    init(data) {
        if(data.names) {
            //Check if any saved data exists
            if(data.windows && data.nextScene) {
                this.info = data;
            } else {
                console.error("BUILDING_SCENE: Invalid configuration JSON");
            }
        }
        if( data.hasOwnProperty('buildingSound') ) {
            this.buildingSound = data.buildingSound;
        }
    }

    /**
     * @brief Preload all of the elements of all of the cards
     * that will be shown in the scene
     */
    preload() {
        //Load in the dialogue box if needed
        if(this.info.mainMenu) {

            //Load the arrow animation spritesheet
            this.load.spritesheet(
                'arrow',
                'sprites/UI/arrow.png',
                { frameWidth: 100, frameHeight: 100 }
            );

            this.load.spritesheet(
                'BuildingDialogBox',
                "sprites/UI/dialogueBox.png",
                DIALOGUE_BOX_SPRITE_SIZE.bg
            );

            //Load in interaction arrows
            this.load.spritesheet(
                'damien_interaction',
                "sprites/UI/01_Interactions/00_Immeuble/02_Spritesheets/01-Immeuble-Damien-Spritesheet_240x210.png",
                {frameWidth: 240, frameHeight: 210}
            );
            this.load.spritesheet(
                'grandma_interaction',
                "sprites/UI/01_Interactions/00_Immeuble/02_Spritesheets/02-Immeuble-Suzanne-Spritesheet_240x190.png",
                {frameWidth: 240, frameHeight: 190}
            );
            this.load.spritesheet(
                'mother_interaction',
                "sprites/UI/01_Interactions/00_Immeuble/02_Spritesheets/05-Immeuble-Florence-Spritesheet_220x153.png",
                {frameWidth: 220, frameHeight: 153}
            );
            this.load.spritesheet(
                'indep_interaction',
                "sprites/UI/01_Interactions/00_Immeuble/02_Spritesheets/04-Immeuble-Patrick-Spritesheet_260x170.png",
                {frameWidth: 260, frameHeight: 170}
            );
        }

        //load sounds
        this.load.audio("bird", "sounds/building/birdTraffic.mp3");
        this.load.audio("theme", "sounds/building/theme.mp3");
        this.load.audio("click", "sounds/UI/UIClick.wav");

        //Load in all of the sprites needed for this scene
        if(this.info.month === Months.MARCH) {
            this.load.image("building_bg_march", "sprites/BuildingScene/building_bg_winter.jpg");

            //Load in clouds
            this.load.image("cloud_01_march", "sprites/BuildingScene/building_cloud01_winter.png");
            this.load.image("cloud_02_march", "sprites/BuildingScene/building_cloud02_winter.png");
            this.load.image("cloud_03_march", "sprites/BuildingScene/building_cloud03_winter.png");
            this.load.image("cloud_04_march", "sprites/BuildingScene/building_cloud04_winter.png");
        } else {
            this.load.image("building_bg_may", "sprites/BuildingScene/building_bg_summer.jpg");

            //Load in the clouds
            this.load.image("cloud_01_may", "sprites/BuildingScene/building_cloud01_summer.png");
            this.load.image("cloud_02_may", "sprites/BuildingScene/building_cloud02_summer.png");
            this.load.image("cloud_03_may", "sprites/BuildingScene/building_cloud03_summer.png");
            this.load.image("cloud_04_may", "sprites/BuildingScene/building_cloud04_summer.png");
        }

        //Load in everything needed no matter the month
        this.load.image("building", "sprites/BuildingScene/building.png");

        //Load the different windows
        if(this.info.windows.family === WindowState.ON) {
            this.load.image("family_window_on", "sprites/BuildingScene/family_window_on.png");
            this.load.image("family_window_mid", "sprites/BuildingScene/family_window_mid.png");
        } else {
            this.load.image("family_window_off", "sprites/BuildingScene/family_window_off.png");
        }

        if(this.info.windows.damien === WindowState.ON) {
            this.load.image("damien_window_on", "sprites/BuildingScene/damien_window_on.png");
            this.load.image("damien_window_mid", "sprites/BuildingScene/damien_window_mid.png");
        } else {
            this.load.image("damien_window_off", "sprites/BuildingScene/damien_window_off.png");
        }

        if(this.info.windows.grandma === WindowState.ON) {
            this.load.image("grandma_window_on", "sprites/BuildingScene/grandma_window_on.png");
            this.load.image("grandma_window_mid", "sprites/BuildingScene/grandma_window_mid.png");

        } else {
            this.load.image("grandma_window_off", "sprites/BuildingScene/grandma_window_off.png");
        }

        if(this.info.windows.indep === WindowState.ON) {
            this.load.image("indep_window_on", "sprites/BuildingScene/indep_window_on.png");
            this.load.image("indep_window_mid", "sprites/BuildingScene/indep_window_mid.png");
        } else {
            this.load.image("indep_window_off", "sprites/BuildingScene/indep_window_off.png");
        }

        //Load in all of the windows
        this.load.image("empty_windows", "sprites/BuildingScene/building_empty_windows.png");

        //Load in the posters
        this.load.image("poster_0" + this.info.stage, "sprites/BuildingScene/poster_0" + this.info.stage + ".png");

        //Load in the cars
        this.load.image("car_01", "sprites/BuildingScene/car_01.png");
        this.load.image("car_02", "sprites/BuildingScene/car_02.png");
        this.load.image("car_03", "sprites/BuildingScene/car_03.png");
    }

    /**
     * @brief Shows the loading screen
     */
    showLoading() {
        this.destroy();

        this.sprites['loading'] = this.add.text(
            0,
            0,
            "Loading...",
            {font: "80px OpenSans", fill: "white"}
        );
    }

    /**
     * @brief Adds a continue button to the main menu
     */
    createContinueButton() {
        //Create continue background sprite
        this.sprites['menu_continue'] = this.add.sprite(
            0,
            -683,
            'BuildingDialogBox'
        ).play(D_BOX_ANIMATION_KEY);

        //Resize the box
        this.sprites['menu_continue'].displayWidth *= .5;
        this.sprites['menu_continue'].displayHeight *= .5;

        //Add continue text
        this.sprites['continue_text'] = this.add.text(
            0,
            this.sprites['menu_continue'].y,
            "Continuer",
            {font: "54px OpenSans", fill: "black"}
        );
        this.sprites['continue_text'].setOrigin(0.5, 0.5);

        //Make continue button interactive
        this.sprites['continue_text'].setInteractive();
        this.sprites['menu_continue'].setInteractive();

        this.input.on(
            'gameobjectdown',
            (_, gameObject) => {
                //Check that we clicked on the right button
                if(gameObject === this.sprites['menu_continue'] ||
                   gameObject === this.sprites['continue_text'])
                {
                    this.clickSound.play();

                    //Show a loading screen
                    this.showLoading();

                    //Load up previous save
                    player.loadGame();
                }
            },
            this
        );
    }

    /**
     * @brief Creates the menu buttons
     */
    createMainMenu() {
        //Create background animation
        this.anims.create({
            key: D_BOX_ANIMATION_KEY,
            frameRate: 6,
            frames: this.anims.generateFrameNames('BuildingDialogBox'),
            repeat: -1
        });

        //Only show continue option if there is a local save file
        if(player.saveExists()) {
            this.createContinueButton();
        }

        //Create new Game background sprite
        this.sprites['menu_new_game'] = this.add.sprite(
            0,
            player.saveExists() ? -503 : -605,
            'BuildingDialogBox'
        ).play(D_BOX_ANIMATION_KEY);

        //Resize the box
        this.sprites['menu_new_game'].displayWidth *= .5;
        this.sprites['menu_new_game'].displayHeight *= .5;


        //Add new Game text
        this.sprites['new_game_text'] = this.add.text(
            0,
            this.sprites['menu_new_game'].y,
            "Nouvelle partie",
            {font: "54px OpenSans", fill: "black"}
        );

        //Center the new game box
        this.sprites['new_game_text'].setOrigin(0.5, 0.5);

        const interaction = () => {
            this.clickSound.play();
            player.checkPlayerId();
            this.scene.start(
                Scenes.BUS,
                { cardIdx: BusCards.MARCH_CARD }
            );
        };

        //Make new game button start a new game
        this.sprites['new_game_text'].setInteractive().on('pointerdown', interaction, this);
        this.sprites['menu_new_game'].setInteractive().on('pointerdown', interaction, this);
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
            () => this.scene.start('Select'),
            this
        );

        this.sprites['interact_arrow'] = this.arrow;
    }

    showMonth() {
        let month_text = "";

        //Pick which text to show
        switch(this.info.month) {
        case Months.MARCH:
            month_text = "Mars 2020";
            break;
        case Months.APRIL:
            month_text = "Avril 2020";
            break;
        default:
            month_text = "Juin 2020";
            break;
        }

        //Create the text sprite
        const month_sprite = this.add.text(
            0,
            -650,
            month_text,
            { font: "65px OpenSans-Bold", fill: "black" }
        );

        month_sprite.setOrigin(0.5, 0.5);
        const set_fadeOut = () => {
            this.tweens.add({
                targets: month_sprite,
                alpha: 0,
                duration: 2000
            });
        };

        //Have it fade out after a few seconds
        this.time.addEvent({
            delay: 3000,
            repeat: 0,
            callback: set_fadeOut,
            callbackScope: this
        });
    }

    /**
     * @brief Adds in the character names in the building scene
     * @param {boolean} interact Whether or not to take into account player interaction
     */
    addCharacterNames(interact = false) {

        if(this.info.names.damien) {
            //Create interaction animations
            this.anims.create({
                key: 'damien_interaction_anim',
                frameRate: 7,
                frames: this.anims.generateFrameNames('damien_interaction'),
                repeat: -1
            });

            //Add interaction arrows
            this.sprites['damien_interaction'] = this.add.sprite(
                -211,
                -337,
                'damien_interaction'
            ).play('damien_interaction_anim');

            //Add interaction if needed
            if(this.interactions['damien'] && interact) {
                this.sprites['damien_interaction']
                    .setInteractive()
                    .on('pointerdown', this.interactions['damien'], this);
            }
        }

        //Handle the grandma's name
        if(this.info.names.grandma) {
            this.anims.create({
                key: 'grandma_interaction_anim',
                frameRate: 7,
                frames: this.anims.generateFrameNames('grandma_interaction'),
                repeat: -1
            });

            this.sprites['grandma_interaction'] = this.add.sprite(
                22,
                -370,
                'grandma_interaction'
            ).play('grandma_interaction_anim');

            if(this.interactions['grandma'] && interact) {
                this.sprites['grandma_interaction']
                    .setInteractive()
                    .on('pointerdown', this.interactions['grandma'], this);
            }
        }

        //Handle the mother's name
        if(this.info.names.family) {
            this.anims.create({
                key: 'mother_interaction_anim',
                frameRate: 7,
                frames: this.anims.generateFrameNames('mother_interaction'),
                repeat: -1
            });

            this.sprites['mother_interaction'] = this.add.sprite(
                291,
                103,
                'mother_interaction'
            ).play('mother_interaction_anim');

            if(this.interactions['mother'] && interact) {
                this.sprites['mother_interaction']
                    .setInteractive()
                    .on('pointerdown', this.interactions['mother'], this);
            }
        }

        //Handle the freelancer's name
        if(this.info.names.indep) {
            this.anims.create({
                key: 'indep_interaction_anim',
                frameRate: 7,
                frames: this.anims.generateFrameNames('indep_interaction'),
                repeat: -1
            });

            this.sprites['indep_interaction'] = this.add.sprite(
                294,
                447,
                'indep_interaction'
            ).play('indep_interaction_anim');

            if(this.interactions['indep'] && interact) {
                this.sprites['indep_interaction']
                    .setInteractive()
                    .on('pointerdown', this.interactions['indep'], this);
            }
        }
    }

    /**
     * @brief create all of the elements of the scene.
     */
    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);

        // TODO: rerecord birdTraffic sound
        this.birdSound = this.sound.add("bird");
        this.themeSong = this.sound.add("theme");
        this.clickSound = this.sound.add("click");
        this.birdSound.play();

        if(this.buildingSound) {
            this.themeSong.play({loop: true});
        }

        this.input.on('gameobjectdown',
            (_, gameObject) => {
                if(gameObject.input.enabled) {

                    //need to make this work
                    this.tweens.add({
                        targets:  this.theme,
                        volume:   0,
                        duration: 800
                    });

                    this.themeSong.stop();
                    this.birdSound.stop();
                }
            }
        );



        if(this.info.month === Months.MARCH) {
            this.sprites['building_bg'] = this.add.image(0, 0, "building_bg_march");

            //Load in clouds
            this.sprites['cloud_01'] = this.add.image(1983, -479, "cloud_01_march");
            this.sprites['cloud_02'] = this.add.image(1020, -155, "cloud_02_march");
            this.sprites['cloud_03'] = this.add.image(2065, -162, "cloud_03_march");
            this.sprites['cloud_04'] = this.add.image(1348, -686, "cloud_04_march");
        } else {
            this.sprites['building_bg'] = this.add.image(0, 0, "building_bg_may");
            //Load in the clouds
            this.sprites['cloud_01'] = this.add.image(1983, -479, "cloud_01_may");
            this.sprites['cloud_02'] = this.add.image(1020, -155, "cloud_02_may");
            this.sprites['cloud_03'] = this.add.image(2065, -162, "cloud_03_may");
            this.sprites['cloud_04'] = this.add.image(1348, -686, "cloud_04_may");
        }

        //Center the background
        // this.sprites['building_bg'].setOrigin(0, 0);

        //Load in everything needed no matter the month
        this.sprites['building'] = this.add.image(0, 200, "building");

        //Load in all of the windows
        this.sprites['empty_windows'] = this.add.image(0, 165, "empty_windows");

        //Load in the posters
        const poster_pos = new Phaser.Math.Vector2(425, 635);
        const poster_key = 'poster_0' + this.info.stage;
        this.sprites[poster_key] = this.add.image(poster_pos.x, poster_pos.y, poster_key);

        //Load in the cars
        this.sprites['car_01'] = this.add.image(-136, 719, "car_01");
        this.sprites['car_02'] = this.add.image(598, 712, "car_02");
        this.sprites['car_03'] = this.add.image(-600, 714, "car_03");

        switch(this.info.windows.family) {
        case WindowState.ON:
            this.sprites['family_window'] = this.add.image(0, 188, "family_window_on");
            this.sprites['family_window_mid'] = this.add.image(0, 188, "family_window_mid");

            this.tweens.add({
                targets: this.sprites['family_window_mid'],
                alpha: 0,
                duration: 3000,
                ease: 'Quadratic',
                yoyo: true,
                loop: -1
            });

            //Make window interactive
            if(this.info.nextScene.family) {

                this.interactions['mother'] = () => this.scene.start(this.info.nextScene.family);

                this.sprites['family_window'].setInteractive().on('pointerdown', this.interactions['mother'], this);
                this.sprites['family_window_mid'].setInteractive().on('pointerdown', this.interactions['mother'], this);
            }
            break;

        case WindowState.OFF:
            this.sprites['family_window'] = this.add.image(0, 188, "family_window_off");
            break;

        default:
            break;
        }

        switch(this.info.windows.damien) {
        case WindowState.ON:
            this.sprites['damien_window'] = this.add.image(-305, -236, "damien_window_on");
            this.sprites['damien_window_mid'] = this.add.image(-305, -236, "damien_window_mid");

            this.tweens.add({
                targets: this.sprites['damien_window_mid'],
                alpha: 0,
                duration: 3000,
                ease: 'Quadratic',
                yoyo: true,
                loop: -1
            });

            //Make window interactive
            if(this.info.nextScene.damien) {

                this.interactions['damien'] = () => this.scene.start(this.info.nextScene.damien);

                this.sprites['damien_window'].setInteractive().on('pointerdown', this.interactions['damien'], this);
                this.sprites['damien_window_mid'].setInteractive().on('pointerdown', this.interactions['damien'], this);
            }
            break;

        case WindowState.OFF:
            this.sprites['damien_window'] = this.add.image(-305, -236, "damien_window_off");
            break;

        default:
            break;
        }

        switch(this.info.windows.grandma) {
        case WindowState.ON:
            this.sprites['grandma_window'] = this.add.image(0, -212, "grandma_window_on");
            this.sprites['grandma_window_mid'] = this.add.image(0, -212, "grandma_window_mid");

            this.tweens.add({
                targets: this.sprites['grandma_window_mid'],
                alpha: 0,
                duration: 3000,
                ease: 'Quadratic',
                yoyo: true,
                loop: -1
            });

            //Make window interactive
            if(this.info.nextScene.grandma) {

                this.interactions['grandma'] = () => this.scene.start(
                    this.info.nextScene.grandma,
                    { cardIdx: GrandmaCards.LIVING_ROOM, month: this.info.month }
                );

                this.sprites['grandma_window'].setInteractive().on('pointerdown', this.interactions['grandma'], this);
                this.sprites['grandma_window_mid'].setInteractive().on('pointerdown', this.interactions['grandma'], this);
            }
            break;

        case WindowState.OFF:
            this.sprites['grandma_window'] = this.add.image(0, -212, "grandma_window_off");
            break;

        default:
            break;
        }

        switch(this.info.windows.indep) {
        case WindowState.ON:
            this.sprites['indep_window'] = this.add.image(0, 388, "indep_window_on");
            this.sprites['indep_window_mid'] = this.add.image(0, 388, "indep_window_mid");

            this.tweens.add({
                targets: this.sprites['indep_window_mid'],
                alpha: 0,
                duration: 3000,
                ease: 'Quadratic',
                yoyo: true,
                loop: -1
            });

            //Make window interactive
            if(this.info.nextScene.indep) {
                this.interactions['indep'] = () => this.scene.start(this.info.nextScene.indep);

                this.sprites['indep_window'].setInteractive().on('pointerdown', this.interactions['indep'], this);
                this.sprites['indep_window_mid'].setInteractive().on('pointerdown', this.interactions['indep'], this);
            }
            break;

        case WindowState.OFF:
            this.sprites['indep_window'] = this.add.image(0, 388, "indep_window_off");
            break;

        default:
            break;
        }

        //Create cloud animations
        this.tweens.add({
            targets: this.sprites['cloud_01'],
            x: -1000,
            duration: 90000,
            ease: "Quadratic",
            loop: -1
        });
        this.tweens.add({
            targets: this.sprites['cloud_02'],
            x: -1000,
            duration: 75000,
            ease: "Quadratic",
            loop: -1
        });
        this.tweens.add({
            targets: this.sprites['cloud_03'],
            x: -1000,
            duration: 80000,
            ease: "Quadratic",
            loop: -1
        });
        this.tweens.add({
            targets: this.sprites['cloud_04'],
            x: -1000,
            duration: 60000,
            ease: "Quadratic",
            loop: -1
        });

        //Add menu buttons if needed
        if(this.info.mainMenu) {
            this.createMainMenu();

            this.showArrow();
        } else if(this.info.new_month) {
            this.showMonth();
        }

        //Handle the special "names" case
        if(this.info.names) {
            //Create interaction animations
            this.addCharacterNames();
        }
    }

    /**
     * @brief destroys the scene
     */
    destroy() {
        //Destroy all of the sprites in the scene
        for (var key in this.sprites) {

            if (this.sprites.hasOwnProperty(key)) {
                this.sprites[key].destroy();
            }
        }
    }
}
