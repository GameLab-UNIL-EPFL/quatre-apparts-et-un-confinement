import Phaser from "phaser";
import { Scenes } from "../core/player.js";

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        this.load.image('title', 'sprites/TitleScene/CVD0087_Placeholder_Logo.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#ffffff');

        let title = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'title').setInteractive();
        title.setScale(0.8);
        let scene = this;

        title.on('pointerdown', function() {
            scene.scene.start(Scenes.BUILDING);
        });

    }

}
