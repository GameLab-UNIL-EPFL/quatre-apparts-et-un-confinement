import Phaser from "phaser";

export class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' })
    }

    preload() {
        this.load.image('title', 'sprites/intro/title-image.png');
    }

    create() {
        let title = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'title').setInteractive();

        let scene = this;

        title.on('pointerdown', function(){
            scene.scene.start('Prototype');
        });
    }
}