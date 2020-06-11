import Phaser from "phaser";


export class Bureau {
    constructor(parent_scene, x, y) {
        this.parent_scene = parent_scene;

        this.name = "bureau";
        this.url = "/sprites/ProtoScene/ComputerCard/bureau.png";

        this.x = x;
        this.y = y;

    }

    preload() {
        this.parent_scene.load.image(this.name, this.url);
    }

    create() {
        this.sprite = this.parent_scene.add.image(this.x, this.y, this.name);
    }

    update() {

        
    }

    destroy() {
        this.sprite.destroy();
    }
} 