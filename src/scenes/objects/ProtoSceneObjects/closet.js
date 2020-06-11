import Phaser from "phaser";

export class Closet {
    constructor(parent_scene, x, y) {
        this.parent_scene = parent_scene;

        this.name = "closet";
        this.url = "/sprites/ProtoScene/ChosePathCard/Closet.png";

        this.x = x;
        this.y = y;
    }

    preload() {
        this.parent_scene.load.image(this.name, this.url);
    }

    create() {
        this.sprite = this.parent_scene.add.image(this.x, this.y, this.name);

        //Make the sprite interactive and add an event listener
        this.sprite.setInteractive();
        this.parent_scene.input.on(
            'gameobjectdown',
            (pointer, gameObject) => {
                //Check that we clicked on the closet
                if(gameObject === this.sprite) {
                    
                    //Go to the next scene
                    this.parent_scene.nextCard(0);
                }
            },
            this.parent_scene
        );
    }

    update() {}

    destroy() {
        this.sprite.destroy();
    }
} 