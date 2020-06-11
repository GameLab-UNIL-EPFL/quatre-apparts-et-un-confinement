import Phaser from "phaser";

export class Kitchen {
    constructor(parent_scene, x, y) {
        this.parent_scene = parent_scene;

        this.name = "room";
        this.url = "/sprites/ProtoScene/ChosePathCard/room.png";

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
                    this.parent_scene.nextCard(1);
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