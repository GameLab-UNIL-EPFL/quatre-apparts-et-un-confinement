import Phaser from "phaser";


export class Food {
    constructor(parent_scene, x, y, foodType) {
        this.parent_scene = parent_scene;

        this.name = "toast";
        this.url = "/sprites/ProtoScene/ComputerCard/toast.png";

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