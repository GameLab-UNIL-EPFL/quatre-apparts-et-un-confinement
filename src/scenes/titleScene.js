import Phaser from "phaser";
import { Scenes } from "../core/player.js";

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        // this.load.spritesheet('title', 'sprites/TitleScene/01-Accueil-Intro-Spritesheet_700x500.jpg', {frameWidth: 700, frameHeight: 500});
        this.load.image('title', 'sprites/TitleScene/UI-Intro-texte.jpg');
        this.load.spritesheet('start', 'sprites/TitleScene/01-Accueil-Demarrer-Spritesheet_260x85.png', {frameWidth: 260, frameHeight: 85});
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.setBackgroundColor('#f4e1c5');

        let title = this.add.sprite(0, -200, 'title');

        if(window.horizontalRatio < 1) {
            title.setScale(window.horizontalRatio + 0.1);
        }
        /*
        this.anims.create({
            key: 'title-anim',
            frameRate: 7,
            frames: this.anims.generateFrameNames('title'),
            repeat: -1
        });

        let title = this.add.sprite(
            0,
            -300,
            'title'
        ).play('title-anim');
        */

        this.anims.create({
            key: 'start-anim',
            frameRate: 7,
            frames: this.anims.generateFrameNames('start'),
            repeat: -1
        });

        let start = this.add.sprite(
            0,
            150,
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
