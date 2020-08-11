import Phaser from "phaser";
import { Scenes } from "../core/player";
import { DIALOGUE_BOX_KEY, D_BOX_ANIMATION_KEY, DIALOGUE_BOX_SPRITE_SIZE } from "../core/dialogueController";
import { player } from "..";

export const Months = {
    MARCH: 'march',
    APRIL: 'april',
    MAY: 'may'
};

export const WindowState = {
    OFF: 0,
    ON: 1
};

/**
 * @brief Models the outdoor buidling scene
 */
export class StatsScene extends Phaser.Scene {
    /**
     * @brief initializes the scene
     */
    constructor() {
        super({ key: Scenes.STATS });

        //Dictionnary containing all of the scene's sprites
        this.sprites = {};
        this.boxes = [];
        this.texts = [];
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
    }

    /**
     * @brief Preload all of the elements of all of the cards
     * that will be shown in the scene
     */
    preload() {

        //Load the arrow animation spritesheet
        this.load.spritesheet(
            'arrow',
            'sprites/UI/arrow.png',
            { frameWidth: 100, frameHeight: 100 }
        );

        this.load.spritesheet(
            DIALOGUE_BOX_KEY,
            "sprites/UI/dialogueBox.png",
            DIALOGUE_BOX_SPRITE_SIZE.bg
        );

        //load sounds
        this.load.audio("bird", "sounds/building/birdTraffic.mp3");

        this.load.image("building_bg_may", "sprites/BuildingScene/building_bg_summer.jpg");

        //Load in the clouds
        this.load.image("cloud_01_may", "sprites/BuildingScene/building_cloud01_summer.png");
        this.load.image("cloud_02_may", "sprites/BuildingScene/building_cloud02_summer.png");
        this.load.image("cloud_03_may", "sprites/BuildingScene/building_cloud03_summer.png");
        this.load.image("cloud_04_may", "sprites/BuildingScene/building_cloud04_summer.png");

        //Load in everything needed no matter the month
        this.load.image("building", "sprites/BuildingScene/building.png");

        this.load.image("family_window_off", "sprites/BuildingScene/family_window_off.png");
        this.load.image("damien_window_off", "sprites/BuildingScene/damien_window_off.png");
        this.load.image("grandma_window_off", "sprites/BuildingScene/grandma_window_off.png");
        this.load.image("indep_window_off", "sprites/BuildingScene/indep_window_off.png");

        //Load in all of the windows
        this.load.image("empty_windows", "sprites/BuildingScene/building_empty_windows.png");

        //Load in the posters
        this.load.image("poster_03", "sprites/BuildingScene/poster_03.png");

        //Load in the cars
        this.load.image("car_01", "sprites/BuildingScene/car_01.png");
        this.load.image("car_02", "sprites/BuildingScene/car_02.png");
        this.load.image("car_03", "sprites/BuildingScene/car_03.png");

        //Load in percentage bar
        this.load.image('percentage_bar_bg', "sprites/StudentScene/ZoomMiniGameCard/bar_bg.png");
        this.load.image('percentage_bar_fill', "sprites/StudentScene/ZoomMiniGameCard/bar_fill.png");
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
            () => this.scene.start(Scenes.END_SCENE),
            this
        );

        this.sprites['interact_arrow'] = this.arrow;
    }

    showStats() {
        //Create the box
        const choice_box = this.add.sprite(
            0,
            -600,
            DIALOGUE_BOX_KEY
        ).play(D_BOX_ANIMATION_KEY);

        //Set origin of the box in the middle
        choice_box.setOrigin(0.5, 0.5);
        choice_box.setDepth(10);
        choice_box.displayWidth /= 4;
        choice_box.displayHeight /= 2;

        //Add in the text
        const choice_text = this.add.text(
            choice_box.x,
            choice_box.y,
            "Vos choix",
            {font: "44px OpenSans-Bold", fill: "black"}
        );
        choice_text.setOrigin(0.5, 0.5);
        choice_text.setDepth(10);

        //Retrieve the statistics
        const stats = player.getStats();
        const offset = 200;
        let y_offset = -400;

        stats.then(result => result.forEach(stat => {
            const choice = stat.choice;
            const percent = parseInt(stat.percentage);

            console.log("RESULT: " + result + ", CHOICE: " + choice + ", PERCENT: " + percent);

            let name = "";
            let text = "";
            let disaplayPercent = percent;

            switch(choice) {
            case 'kids_park':
                name = "Florence";

                if(player.kids_park) {
                    text = "Vous et " + percent + "% des joueurs avez choisi d’amener les enfants au parc.";
                } else {
                    disaplayPercent = (100 - percent);
                    text = "Vous et " + disaplayPercent + "% des joueurs avez choisi de ne pas aller au parc.";
                }
                break;

            case 'grandma_hairdresser':
                name = "Suzanne";

                if(player.suzanne_hair) {
                    text = "Vous et " + percent + "% des joueurs avez choisi d'aller chez le coiffeur.";
                } else {
                    disaplayPercent = (100 - percent);
                    text = "Vous et " + disaplayPercent + "% des joueurs avez choisi de ne pas aller chez le coiffeur.";
                }
                break;

            case 'damien_stay_home':
                name = "Damien";

                if(player.damien_gone) {
                    disaplayPercent = (100 - percent);
                    text = "Vous et " + disaplayPercent + "% des joueurs avez choisi de sortir voir votre copine.";
                } else {
                    text = "Vous et " + percent + "% des joueurs avez choisi de rester à la maison.";
                }
                break;

            case 'freelancer_good_love_advice':
                name = "Patrick";

                if(player.nathan_failed) {
                    disaplayPercent = (100 - percent);
                    text = "Vos conseils et ceux de " + disaplayPercent + "% des joueurs ont brisé un couple.";
                } else {
                    text = "Vos conseils et ceux de " + percent + "% des joueurs ont sauvé un couple.";
                }
                break;
            }

            //Create the box
            const box = this.add.sprite(
                0,
                y_offset,
                DIALOGUE_BOX_KEY
            ).play(D_BOX_ANIMATION_KEY);

            //Set origin of the box in the middle
            box.setOrigin(0, 0);
            box.setDepth(10);

            //Add in the text
            const name_sprite = this.add.text(
                box.x - (2 * box.displayWidth / 5),
                50 + box.y - box.displayHeight / 2,
                name,
                {font: (44) + "px OpenSans-Bold", fill: "black"}
            );
            name_sprite.setDepth(10);

            //Add dialogue content
            const text_sprite = this.add.text(
                name_sprite.x,
                name_sprite.y + (name_sprite.displayHeight * 1.2),
                text,
                {
                    font: (44) + "px OpenSans",
                    fill: "black",
                    wordWrap: { width: (box.displayWidth - 200) }
                }
            );
            text_sprite.setDepth(10);

            box.y -= box.displayHeight / 2;
            box.x -= box.displayWidth / 2;
            box.displayHeight *= 1.25;
                
            //Add a percentage bar to each stat
            const percentage_bar_bg = this.add.image(
                name_sprite.x,
                text_sprite.y + (text_sprite.displayHeight * 1.1),
                'percentage_bar_bg'
            );

            const percentage_bar_fill = this.add.image(
                percentage_bar_bg.x + 5,
                percentage_bar_bg.y + 5,
                'percentage_bar_fill'
            );

            percentage_bar_bg.setOrigin(0, 0);
            percentage_bar_fill.setOrigin(0, 0);
            
            percentage_bar_bg.setDepth(10);
            percentage_bar_fill.setDepth(10);
            
            percentage_bar_fill.displayWidth *= (disaplayPercent/100);
            percentage_bar_fill.displayHeight *= 0.95;
            
            //Add the inverted fill for the rest of the bar
            const percentage_bar_fill_wrong = this.add.image(
                percentage_bar_fill.x + percentage_bar_fill.displayWidth - 3,
                percentage_bar_fill.y,
                'percentage_bar_fill'
            );

            percentage_bar_fill_wrong.setOrigin(0, 0);
            percentage_bar_fill_wrong.setDepth(10);

            percentage_bar_fill_wrong.displayWidth *= (1 - (disaplayPercent/100));
            percentage_bar_fill_wrong.displayHeight *= 0.95; 

            //Colors
            percentage_bar_fill.setTint("0x00ff00");
            percentage_bar_fill_wrong.setTint("0xff0000");

            //Update the vertical offset
            y_offset += offset * 1.5;

            this.texts.push(name_sprite);
            this.texts.push(text_sprite);
            this.boxes.push(box);

            console.log("TEXT: " + text + " PERCENT: " + percent);
        }));
    }

    /**
     * @brief create all of the elements of the scene.
     */
    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.flash(1000);

        //Create the dialogue box animation
        this.anims.create({
            key: D_BOX_ANIMATION_KEY,
            frameRate: 6,
            frames: this.anims.generateFrameNames(DIALOGUE_BOX_KEY),
            repeat: -1
        });

        this.sprites['building_bg'] = this.add.image(0, 0, "building_bg_may");

        //Load in the clouds
        this.sprites['cloud_01'] = this.add.image(1983, -479, "cloud_01_may");
        this.sprites['cloud_02'] = this.add.image(1020, -155, "cloud_02_may");
        this.sprites['cloud_03'] = this.add.image(2065, -162, "cloud_03_may");
        this.sprites['cloud_04'] = this.add.image(1348, -686, "cloud_04_may");

        //Load in everything needed no matter the month
        this.sprites['building'] = this.add.image(0, 200, "building");

        //Load in all of the windows
        this.sprites['empty_windows'] = this.add.image(0, 165, "empty_windows");

        //Load in the posters
        const poster_pos = new Phaser.Math.Vector2(425, 635);
        const poster_key = 'poster_03';
        this.sprites[poster_key] = this.add.image(poster_pos.x, poster_pos.y, poster_key);

        //Load in the cars
        this.sprites['car_01'] = this.add.image(-136, 719, "car_01");
        this.sprites['car_02'] = this.add.image(598, 712, "car_02");
        this.sprites['car_03'] = this.add.image(-600, 714, "car_03");

        this.sprites['family_window'] = this.add.image(0, 188, "family_window_off");
        this.sprites['damien_window'] = this.add.image(-305, -236, "damien_window_off");
        this.sprites['grandma_window'] = this.add.image(0, -212, "grandma_window_off");
        this.sprites['indep_window'] = this.add.image(0, 388, "indep_window_off");

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

        this.showArrow();
        this.showStats();
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

        this.texts.forEach(text => text.destroy());
        this.boxes.forEach(box => box.destroy());
    }
}
