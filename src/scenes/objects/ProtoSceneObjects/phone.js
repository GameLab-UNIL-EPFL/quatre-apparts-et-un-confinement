import Phaser from "phaser";

/**
 * @brief FSM states used for the phone's animation
 */
const phoneState = {
    IDLE: 'idle',
    MOVE_LEFT: 'left',
    MOVE_RIGHT: 'right',
    DONE: 'done'
};

const PHONE_MOVEMENT = 10;

const WAKE_UP_ID = "reveil";

/**
 * @brief Models the ProtoGuy's phone as a custom sprite
 */
export class Phone {
    /**
     * @brief Creates the phone as a custom sprite
     * @param parent_scene, the scene in which the phone is contained 
     * @param x, the phone's x position in the scene
     * @param y, the phone's y position in the scene
     */
    constructor(parent_scene, x, y) {
        //Initialize the phone's attributes
        this.parent_scene = parent_scene;
        this.name = "phone";
        this.url = "/sprites/ProtoScene/WakeUpCard/phone.png";
        this.x = x;
        this.y = y;
        this.cur_state = phoneState.IDLE;
    }

    /**
     * @brief loads in the sprite needed to display the phone
     */
    preload() {
        this.parent_scene.load.image(this.name, this.url);
    }

    /**
     * @brief created the phone and places it in the scene
     */
    create() {
        this.sprite = this.parent_scene.add.image(this.x, this.y, this.name);
        this.sprite.setOrigin(0, 0);
        this.sprite.setScale(1);

        //Make the phone interactive
        this.sprite.setInteractive();

        //Set an event listener for clicking on the phone
        this.parent_scene.input.on(
            'gameobjectdown',
            (pointer, gameObject) => {
                //Check that we clicked on the phone
                if(gameObject === this.sprite) {
                    this.cur_state = phoneState.DONE;

                    //Trigger the dialogue
                    this.parent_scene.dialogue.display(WAKE_UP_ID);
                }
            },
            this.parent_scene
        );
    }

    /**
     * @brief Updates the phone's state and handles the animation
     */
    update() {
        //Check the current state of the phone
        switch(this.cur_state) {
            case phoneState.IDLE:
                //Start the phone's vibration
                this.cur_state = phoneState.MOVE_LEFT;
                break;

            case phoneState.MOVE_LEFT:
                //Move the phone to the left
                this.sprite.x -= PHONE_MOVEMENT;
                this.cur_state = phoneState.MOVE_RIGHT;
                break;

            case phoneState.MOVE_RIGHT:
                //Move the phone to the right
                this.sprite.x += PHONE_MOVEMENT;
                this.cur_state = phoneState.MOVE_LEFT;
                break;

            case phoneState.DONE:
                break;

            default:
                break;
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}