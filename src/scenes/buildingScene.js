import Phaser from "phaser";
import { Scenes } from "../core/player";
import { DIALOGUE_BOX_KEY, D_BOX_ANIMATION_KEY } from "../core/dialogueController";
import { player } from "..";

export const Months = {
    MARCH: 'march',
    MAY: 'may'
};

const WindowState = {
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
        super({key: 'Building'});

        //Information about what's shown in the scene
        this.info = {
            mainMenu: true,
            stage: 1,
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
                { frameWidth: 1886, frameHeight: 413 }  
            );
        }
        
        //Load in all of the sprites needed for this scene
        switch(this.info.month) {
            case Months.MARCH:
                this.load.image("building_bg_march", "sprites/BuildingScene/building_bg_march.jpg");

                //Load in clouds
                this.load.image("cloud_01_march", "sprites/BuildingScene/building_cloud01_march.png");
                this.load.image("cloud_02_march", "sprites/BuildingScene/building_cloud02_march.png");
                this.load.image("cloud_03_march", "sprites/BuildingScene/building_cloud03_march.png");
                this.load.image("cloud_04_march", "sprites/BuildingScene/building_cloud04_march.png");
                break;

            case Months.MAY:
                this.load.image("building_bg_may", "sprites/BuildingScene/building_bg_may.jpg");
        
                //Load in the clouds
                this.load.image("cloud_01_may", "sprites/BuildingScene/building_cloud01_may.png");
                this.load.image("cloud_02_may", "sprites/BuildingScene/building_cloud02_may.png");
                this.load.image("cloud_03_may", "sprites/BuildingScene/building_cloud03_may.png");
                this.load.image("cloud_04_may", "sprites/BuildingScene/building_cloud04_may.png");
                break;

            default:
                break;
        }

        //Load in everything needed no matter the month
        this.load.image("building", "sprites/BuildingScene/building.png");

        switch(this.info.windows.family) {
            case WindowState.ON:
                this.load.image("family_window_on", "sprites/BuildingScene/family_window_on.png");
                break;

            case WindowState.OFF:
                this.load.image("family_window_off", "sprites/BuildingScene/family_window_off.png");
                break;

            default:
                break;
        }
            
        switch(this.info.windows.damien) {
            case WindowState.ON:    
                this.load.image("student_window_on", "sprites/BuildingScene/student_window_on.png");
                break;

            case WindowState.OFF:
                this.load.image("student_window_off", "sprites/BuildingScene/student_window_off.png");   
                break;

            default:
                break;
        }

        switch(this.info.windows.grandma) {
            case WindowState.ON:
                this.load.image("grandma_window_on", "sprites/BuildingScene/grandma_window_on.png");
                break;

            case WindowState.OFF:
                this.load.image("grandma_window_off", "sprites/BuildingScene/grandma_window_off.png");
                break;

            default:
                break;
        }

        switch(this.info.windows.indep) {
            case WindowState.ON:
                this.load.image("indep_window_on", "sprites/BuildingScene/indep_window_on.png");     
                break;

            case WindowState.OFF:
                this.load.image("indep_window_off", "sprites/BuildingScene/indep_window_off.png");
                break;

            default:
                break;
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
            1000,
            1000,
            "Loading...",
            {font: "80px OpenSans", fill: "white"}
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
            //Create continue background sprite
            this.sprites['menu_continue'] = this.add.sprite(
                1000,
                195,
                DIALOGUE_BOX_KEY
            ).play(D_BOX_ANIMATION_KEY);

            this.sprites['menu_continue'].displayWidth *= .5;
            this.sprites['menu_continue'].displayHeight *= .5;

            //Add continue text
            this.sprites['continue_text'] = this.add.text(
                802, 
                150,
                "Continue",
                {font: "80px OpenSans", fill: "black"}
            );

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
        
        //Create new Game background sprite
        this.sprites['menu_new_game'] = this.add.sprite(
            1000,
            player.saveExists() ? 495 : 325,
            DIALOGUE_BOX_KEY
        ).play(D_BOX_ANIMATION_KEY);

        this.sprites['menu_new_game'].displayWidth *= .5;
        this.sprites['menu_new_game'].displayHeight *= .5;

        //Add new Game text
        this.sprites['new_game_text'] = this.add.text(
            779, 
            player.saveExists() ? 450 : 275,
            "New Game",
            {font: "80px OpenSans", fill: "black"}
        );

        //Make new game button start a new game
        this.sprites['new_game_text'].setInteractive();
        this.sprites['menu_new_game'].setInteractive();

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
        switch(this.info.month) {
            case Months.MARCH:
                this.sprites['building_bg'] = this.add.image(0, 0, "building_bg_march");

                //Load in clouds
                this.sprites['cloud_01'] = this.add.image(4306, 535, "cloud_01_march");
                this.sprites['cloud_02'] = this.add.image(2700, 1076, "cloud_02_march");
                this.sprites['cloud_03'] = this.add.image(4442, 1064, "cloud_03_march");
                this.sprites['cloud_04'] = this.add.image(3247, 190, "cloud_04_march");
                break;

            case Months.MAY:
                this.sprites['building_bg'] = this.add.image(0, 0, "building_bg_may");      
                //Load in the clouds
                this.sprites['cloud_01'] = this.add.image(4306, 535, "cloud_01_may");
                this.sprites['cloud_02'] = this.add.image(2700, 1076, "cloud_02_may");
                this.sprites['cloud_03'] = this.add.image(4442, 1064, "cloud_03_may");
                this.sprites['cloud_04'] = this.add.image(3247, 190, "cloud_04_may");
                break;

            default:
                break;
        }

        //Center the background
        this.sprites['building_bg'].setOrigin(0, 0);

        //Load in everything needed no matter the month
        this.sprites['building'] = this.add.image(1023, 1667, "building");

        switch(this.info.windows.family) {
            case WindowState.ON:    
                this.sprites['family_window'] = this.add.image(1023, 1648, "family_window_on");

                //Make window interactive
                if(this.info.nextScene.family) {
                    this.sprites['family_window'].setInteractive();

                    this.input.on(
                        'gameobjectdown', 
                        (_, gameObject) => {
                            //Check that we clicked on the right window
                            if(gameObject === this.sprites['family_window']) {
                                this.scene.start(this.info.nextScene.family);
                            }
                        },
                        this
                    );
                }
                break;
            
            case WindowState.OFF:
                this.sprites['family_window'] = this.add.image(1023, 1648, "family_window_off");
                break;

            default:
                break;
        }

        switch(this.info.windows.damien) {
            case WindowState.ON:
                this.sprites['student_window'] = this.add.image(500, 940, "student_window_on");

                //Make window interactive
                if(this.info.nextScene.damien) {
                    this.sprites['student_window'].setInteractive();

                    this.input.on(
                        'gameobjectdown', 
                        (_, gameObject) => {
                            //Check that we clicked on the right window
                            if(gameObject === this.sprites['student_window']) {

                                this.scene.start(this.info.nextScene.damien);
                            }
                        },
                        this
                    );
                }
                break;
            
            case WindowState.OFF:
                this.sprites['student_window'] = this.add.image(500, 940, "student_window_off");
                break;

            default:
                break;
        }

        switch(this.info.windows.grandma) {
            case WindowState.ON:
                this.sprites['grandma_window'] = this.add.image(1023, 981, "grandma_window_on");

                //Make window interactive
                if(this.info.nextScene.grandma) {
                    this.sprites['grandma_window'].setInteractive();

                    this.input.on(
                        'gameobjectdown', 
                        (_, gameObject) => {
                            //Check that we clicked on the right window
                            if(gameObject === this.sprites['grandma_window']) {
                                this.scene.start(this.info.nextScene.grandma);
                            }
                        },
                        this
                    );
                }
                break;
            
            case WindowState.OFF:
                this.sprites['grandma_window'] = this.add.image(1023, 981, "grandma_window_off");
                break;

            default:
                break;
        }

        switch(this.info.windows.indep) {
            case WindowState.ON:
                this.sprites['indep_window'] = this.add.image(1023, 1981, "indep_window_on");

                //Make window interactive
                if(this.info.nextScene.indep) {
                    this.sprites['indep_window'].setInteractive();

                    this.input.on(
                        'gameobjectdown', 
                        (_, gameObject) => {
                            //Check that we clicked on the right window
                            if(gameObject === this.sprites['indep_window']) {
                                this.scene.start(this.info.nextScene.indep);
                            }
                        },
                        this
                    );
                }
                break;
            
            case WindowState.OFF:
                this.sprites['indep_window'] = this.add.image(1023, 1981, "indep_window_off");
                break;

            default:
                break;
        }

        //Load in all of the windows
        this.sprites['empty_windows'] = this.add.image(1023, 1609, "empty_windows");

        //Load in the posters
        let poster_pos = new Phaser.Math.Vector2(1709, 2393);
        let poster_key = 'poster_0' + this.info.stage;
        this.sprites[poster_key] = this.add.image(poster_pos.x, poster_pos.y, poster_key);
        
        //Load in the cars
        this.sprites['car_01'] = this.add.image(1070, 2550, "car_01");
        this.sprites['car_02'] = this.add.image(1847, 2550, "car_02");
        this.sprites['car_03'] = this.add.image(-15, 2550, "car_03");

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
