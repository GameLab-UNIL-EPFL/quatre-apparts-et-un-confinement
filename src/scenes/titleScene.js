import Phaser from "phaser";
import { Scenes } from "../core/player.js";

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        this.load.image('title', 'sprites/TitleScene/CVD0087_Placeholder_Logo.png');
        this.load.spritesheet('start', 'sprites/TitleScene/01-Accueil-Demarrer-Spritesheet_260x85.png', {frameWidth: 260, frameHeight: 85});
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.setBackgroundColor('#ffffff');

        let title = this.add.sprite(0, -200, 'title');
        title.setScale(0.8);

        this.anims.create({
            key: 'start-anim',
            frameRate: 7,
            frames: this.anims.generateFrameNames('start'),
            repeat: -1
        });

        let start = this.add.sprite(
            0,
            200,
            'start'
        ).play('start-anim');


        let scene = this;
        title.setInteractive().on('pointerdown', function() {
            this.scene.start(Scenes.BUILDING);
        }, this);
        start.setInteractive().on('pointerdown', function() {
            this.scene.start(Scenes.BUILDING);
        }, this);
    }

}
