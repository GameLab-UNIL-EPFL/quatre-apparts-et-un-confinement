import Phaser from "phaser";
import { Scenes } from "../core/player";
import { DIALOGUE_BOX_KEY, D_BOX_ANIMATION_KEY, DIALOGUE_BOX_SPRITE_SIZE } from "../core/dialogueController";
import { player } from "..";

export const Months = {
    MARCH: 'march',
    MAY: 'may'
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
            stage: 3,
            windows: {
                damien: WindowState.ON,
                grandma: WindowState.ON,
                family: WindowState.ON,
                indep: WindowState.ON
            },
            month: Months.MAY,
            nextScene: {
                damien: Scenes.PROTOTYPE,
                grandma: Scenes.GRANDMA,
                family: Scenes.MOTHER,
                indep: Scenes.INDEP
            }
        };

        //Dictionnary containing all of the scene's sprites
        this.sprites = {};

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
        //Check if any saved data exists
        if(data.stage && data.windows && data.month && data.nextScene) {
            this.info = data;
        }
    }

    /**
     * @brief Preload all of the elements of all of the cards
     * that will be shown in the scene
     */
    preload() {
        //Load in the dialogue box if needed
        if(this.info.mainMenu) {
            this.load.spritesheet(
                DIALOGUE_BOX_KEY,
                "sprites/UI/dialogueBox.png",
                DIALOGUE_BOX_SPRITE_SIZE.bg
            );
        }

        //Load in all of the sprites needed for this scene
        switch(this.info.month) {
            case Months.MARCH:
                this.load.image("building_bg_march", "sprites/BuildingScene/building_bg_winter.jpg");

                //Load in clouds
                this.load.image("cloud_01_march", "sprites/BuildingScene/building_cloud01_winter.png");
                this.load.image("cloud_02_march", "sprites/BuildingScene/building_cloud02_winter.png");
                this.load.image("cloud_03_march", "sprites/BuildingScene/building_cloud03_winter.png");
                this.load.image("cloud_04_march", "sprites/BuildingScene/building_cloud04_winter.png");
                break;

            case Months.MAY:
                this.load.image("building_bg_may", "sprites/BuildingScene/building_bg_summer.jpg");

                //Load in the clouds
                this.load.image("cloud_01_may", "sprites/BuildingScene/building_cloud01_summer.png");
                this.load.image("cloud_02_may", "sprites/BuildingScene/building_cloud02_summer.png");
                this.load.image("cloud_03_may", "sprites/BuildingScene/building_cloud03_summer.png");
                this.load.image("cloud_04_may", "sprites/BuildingScene/building_cloud04_summer.png");
                break;

            default:
                break;
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
            DIALOGUE_BOX_KEY
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
            frames: this.anims.generateFrameNames(DIALOGUE_BOX_KEY),
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
            DIALOGUE_BOX_KEY
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

        //Make new game button start a new game
        this.sprites['new_game_text'].setInteractive();
        this.sprites['menu_new_game'].setInteractive();

        //Adapt width for small ratio screens
        // this.sprites['menu_continue'].displayWidth *= window.horizontalRatio;
        // this.sprites['menu_new_game'].displayWidth *= window.horizontalRatio;

        this.input.on(
            'gameobjectdown',
            (_, gameObject) => {
                //Check that we clicked on the right button
                if(gameObject === this.sprites['menu_new_game'] ||
                   gameObject === this.sprites['new_game_text'])
                {
                    //Sart a new game
                    this.scene.start(
                        Scenes.BUILDING,
                        {
                            mainMenu: false,
                            stage: 2,
                            windows: {
                                damien: WindowState.ON,
                                grandma: WindowState.OFF,
                                family: WindowState.OFF,
                                indep: WindowState.OFF
                            },
                            month: Months.MAY,
                            nextScene: {
                                damien: Scenes.PROTOTYPE,
                                grandma: null,
                                family: null,
                                indep: null
                            }
                        }
                    );
                }
            },
            this
        );
    }

    /**
     * @brief create all of the elements of the scene.
     */
    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);

        switch(this.info.month) {
            case Months.MARCH:
                this.sprites['building_bg'] = this.add.image(0, 0, "building_bg_march");

                //Load in clouds
                this.sprites['cloud_01'] = this.add.image(1983, -479, "cloud_01_march");
                this.sprites['cloud_02'] = this.add.image(1020, -155, "cloud_02_march");
                this.sprites['cloud_03'] = this.add.image(2065, -162, "cloud_03_march");
                this.sprites['cloud_04'] = this.add.image(1348, -686, "cloud_04_march");
                break;

            case Months.MAY:
                this.sprites['building_bg'] = this.add.image(0, 0, "building_bg_may");
                //Load in the clouds
                this.sprites['cloud_01'] = this.add.image(1983, -479, "cloud_01_may");
                this.sprites['cloud_02'] = this.add.image(1020, -155, "cloud_02_may");
                this.sprites['cloud_03'] = this.add.image(2065, -162, "cloud_03_may");
                this.sprites['cloud_04'] = this.add.image(1348, -686, "cloud_04_may");
                break;

            default:
                break;
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
                    this.sprites['family_window'].setInteractive();
                    this.sprites['family_window_mid'].setInteractive();

                    this.input.on(
                        'gameobjectdown',
                        (_, gameObject) => {
                            //Check that we clicked on the right window
                            if(gameObject === this.sprites['family_window'] || gameObject === this.sprites['family_window_mid']) {
                                this.scene.start(this.info.nextScene.family);
                            }
                        },
                        this
                    );
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
                    this.sprites['damien_window'].setInteractive();
                    this.sprites['damien_window_mid'].setInteractive();

                    this.input.on(
                        'gameobjectdown',
                        (_, gameObject) => {
                            //Check that we clicked on the right window
                            if(gameObject === this.sprites['damien_window'] || gameObject === this.sprites['damien_window_mid']) {

                                this.scene.start(this.info.nextScene.damien);
                            }
                        },
                        this
                    );
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
                    this.sprites['grandma_window'].setInteractive();
                    this.sprites['grandma_window_mid'].setInteractive();

                    this.input.on(
                        'gameobjectdown',
                        (_, gameObject) => {
                            //Check that we clicked on the right window
                            if(gameObject === this.sprites['grandma_window'] || gameObject === this.sprites['grandma_window_mid']) {
                                this.scene.start(this.info.nextScene.grandma);
                            }
                        },
                        this
                    );
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
                    const interaction = () => this.scene.start(this.info.nextScene.indep);

                    this.sprites['indep_window'].setInteractive().on('pointerdown', interaction, this);
                    this.sprites['indep_window_mid'].setInteractive().on('pointerdown', interaction, this);
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
