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
        let title = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'title').setInteractive();
        let scene = this;

        title.on('pointerdown', function() {
            scene.scene.start(Scenes.BUILDING);
        });

    }

}
