import Phaser from "phaser";

/**
 * @brief Models an Object that can be found in a Card
 */
export class CardObject {
    /**
     * @brief Constructs an instance of the clothes
     * @param {Phaser.Scene} parent_scene, the scene in which the clothes are contained
     * @param {string} name, the name of the sprite that will be created
     * @param {string} url, the url of the image that will be used for the sprite 
     * @param {Phaser.Vector2} position the position of the object in the scene
     * @param {bool} isTrigger, whether or not this object can trigger the passage to the next scene
     * @param {Number} choice, the path that this item will entail (only if isTrigger)
     */
    constructor(parent_scene, name, url, position, isTrigger, choice=-1) {
        this.parent_scene = parent_scene;
        
        //Sprite parameters
        this.name = name;
        this.url = url;

        //Position of the object
        this.position = position;

        //Interaction parameters
        this.isTrigger = isTrigger;
        this.choice = choice;
    }

    /**
     * @brief Preloads the image associated to the sprite in memory
     */
    preload() {
        this.parent_scene.load.image(this.name, this.url);
    }

    /**
     * @brief Creates the object and makes it interactable if needed
     */
    create() {
        this.sprite = this.parent_scene.add.image(this.position.x, this.position.y, this.name);

        if(this.isTrigger) {
            //Make the clothes interactive
            this.sprite.setInteractive();

            this.parent_scene.input.on(
                'gameobjectdown', 
                (_, gameObject) => {
                    //Check that we clicked the clothes
                    if(gameObject === this.sprite) {

                        this.parent_scene.cardIsDone();
                        this.parent_scene.nextCard(choice);
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