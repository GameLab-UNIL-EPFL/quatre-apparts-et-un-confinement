import Phaser from "phaser";

/**
 * @brief Models the chiar in ProtoGuy's room
 */
export class Chair {
    /**
     * @brief Constructs an instance of the clothes
     * @param {Phaser.Scene} parent_scene, the scene in which the clothes are contained
     * @param {int} x, the x postition of the clothes relative to the scene 
     * @param {int} y, the y position of the clothes relative to the scene
     */
    constructor(parent_scene, x, y) {
        this.parent_scene = parent_scene;

        this.name = "chair";
        this.url = "/sprites/ProtoScene/ClothesCard/chair.png";

        this.x = x;
        this.y = y;
    }

    preload() {
        this.parent_scene.load.image(this.name, this.url);
    }

    create() {
        this.sprite = this.parent_scene.add.image(this.x, this.y, this.name);

        //Make the clothes interactive
        this.sprite.setInteractive();
        this.parent_scene.input.on(
            'gameobjectdown', 
            (pointer, gameObject) => {
                //Check that we clicked the clothes
                if(gameObject === this.sprite) {
                    
                    //TODO change the character's clothes
                    this.parent_scene.cardIsDone();
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