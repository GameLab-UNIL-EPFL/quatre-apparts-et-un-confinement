import Phaser from "phaser";

const ProtoGuyState = {
    IDLE: 'idle',
    SCRATCH_DOWN: 'down',
    SCRATCH_UP: 'up'
};

const ProtoGuyCard = {
    WAKE_UP: 'wake_up_card'
};

/**
 * @brief Models the prototype guy
 * Is mostly used to keep track of the choices made with 
 * this character and his current state.
 */
export class ProtoGuy {
    /**
     * @brief Creates the character in the give scene
     * @param {Phaser.Scene} parent_scene, the scene in which the character is contained
     * @param {int} x, the x position of the character in the scene
     * @param {int} y, the y position of the character in the scene
     */
    constructor(parent_scene, x, y) {
        this.parent_scene = parent_scene;

        this.base_url = "/sprites/ProtoScene/WakeUpCard/character_body.png";
        this.base_name = "character_body";

        this.head_url = "/sprites/ProtoScene/WakeUpCard/character_head.png";
        this.head_name = "character_head";

        this.arm_url = "/sprites/ProtoScene/WakeUpCard/character_arm.png";
        this.arm_name = "chracter_arm";

        this.x = x;
        this.y = y;

        //Initialize the different FSMs
        this.cur_card = ProtoGuyCard.WAKE_UP;
        this.cur_state = ProtoGuyState.IDLE;
        this.rotate = 0;
    }

    /**
     * @brief Loads in all of the images needed to draw the character
     */
    preload() {
        this.parent_scene.load.image(this.base_name, this.base_url);
        this.parent_scene.load.image(this.arm_name, this.arm_url);
        this.parent_scene.load.image(this.head_name, this.head_url);
    }

    /**
     * @brief Draws and places all of the character's images in the scene
     */
    create() {
        //Create the different sprites that make up the character
        this.base_sprite = this.parent_scene.add.image(this.x, this.y, this.base_name);
        this.arm_sprite = this.parent_scene.add.image(this.x + 505, this.y - 554,this.arm_name);
        this.head_sprite = this.parent_scene.add.image(this.x - 85, this.y - 890, this.head_name);

        this.sprites = [this.base_sprite, this.arm_sprite, this.head_sprite];

        this.arm_sprite.setOrigin(0, 0); 
        this.arm_sprite.angle += 190;
        this.arm_sprite.x -= 10; 
        this.arm_sprite.y += 10;
        this.cur_state = ProtoGuyState.SCRATCH_DOWN;
    }

    update() {
        switch(this.cur_state) {
            case ProtoGuyState.SCRATCH_DOWN:
                this.arm_sprite.angle -= 0.3;
                this.arm_sprite.x += 0.3;
                this.arm_sprite.y -= 0.3;
                this.rotate++;

                if(this.rotate >= 30) {
                    this.cur_state = ProtoGuyState.SCRATCH_UP;
                }
                break;

            case ProtoGuyState.SCRATCH_UP:
                this.arm_sprite.angle += 0.3;
                this.arm_sprite.x -= 0.3;
                this.arm_sprite.y += 0.3;
                this.rotate--;

                if(this.rotate <= 0) {
                    this.cur_state = ProtoGuyState.SCRATCH_DOWN;
                }
                break;

            case ProtoGuyState.IDLE:
                break;
            default:
                break;
        }
    }

    destroy() {
        this.sprites.forEach(sprite => sprite.destroy());
    }
}