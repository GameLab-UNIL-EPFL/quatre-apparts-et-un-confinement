import Phaser, { Scene } from "phaser";
import { Scenes } from "../core/player";

export class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: Scenes.INTRO });
    }

    preload() {
        this.load.image('title', 'sprites/intro/title-image.png');
    }

    create() {
        let title = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'title').setInteractive();

        let scene = this;

        title.on('pointerdown', function() {
            scene.scene.start('Prototype');
        });
    }
}