import Phaser from "phaser";

/**
 * @brief Models an Object that can be found in a Card
 */
export class CardObject {
    /**
     * @brief Constructs an instance of the clothes
     * @param {Phaser.Scene} parent_scene, the scene in which the clothes are contained
     * @param {JSON} sprite, {name, url} of the sprite that will be created
     * @param {Phaser.Vector2} position the position of the object in the scene
     * @param {Number} choice, the path that this item will entail (only if !-1)
     */
    constructor(parent_scene, sprite, position, choice=-1) {
        this.parent_scene = parent_scene;
        
        //Sprite parameters
        this.name = sprite.name;
        this.url = sprite.url;

        //Position of the object
        this.position = position;

        //Interaction parameters
        this.choice = choice;
    }

    /**
     * @brief Preloads the image associated to the sprite in memory
     */
    preload() {
        this.parent_scene.load.image(this.name, this.url);

        //Check if the spritesheet exists
        if(this.spriteSheet) {
            this.parent_scene.load.spritesheet(
                this.spriteSheet.name,
                this.spriteSheet.url, {
                    frameWidth: this.spriteSheet.frameWidth,
                    frameHeight: this.spriteSheet.frameHeight 
                }
            );

        }
    }

    /**
     * @brief Creates the object and makes it interactable if needed
     * and animates it if needed
     */
    create() {
        this.sprite = this.parent_scene.add.image(this.position.x, this.position.y, this.name);

        //Add a choice if needed
        if(this.choice != -1) {
            //Make the clothes interactive
            this.sprite.setInteractive();

            this.parent_scene.input.on(
                'gameobjectdown', 
                (_, gameObject) => {
                    //Check that we clicked the clothes
                    if(gameObject === this.sprite) {

                        this.parent_scene.cardIsDone();
                        this.parent_scene.nextCard(this.choice);
                    }
                },
                this.parent_scene 
            );
        }
    }

    /**
     * @brief Update method that is called on every frame.
     * Usually used to handle object animations
     */
    update() {}

    /**
     * @brief Deallocates the memory linked to the sprite
     */
    destroy() {
        this.sprite.destroy();
    }
} 