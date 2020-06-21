import Phaser from "phaser";

export const DialogueState = {
    NONE: 0,
    DISPLAYED: 1,
    DONE: 2
};

export const DIALOGUE_BOX_KEY = "dialogueBox";
const D_BOX_ANIMATION_KEY = "dBoxAnim";

const UP_POS = {
    box: new Phaser.Math.Vector2(1020, 275),
    name: new Phaser.Math.Vector2(160, 100),
    content: new Phaser.Math.Vector2(160, 220)
};

const DOWN_POS = {
    box: new Phaser.Math.Vector2(1020, 2410),
    name: new Phaser.Math.Vector2(160, 2245),
    content: new Phaser.Math.Vector2(160, 2365)
};

/**
 * @brief Handles everything that has to do with dialogue
 */
export class DialogueController {
    
    /**
     * @brief Creates a dialogue controller by loading the dialogue 
     * directly from JSON.
     */
    constructor(parent_scene) {
        this.parent_scene = parent_scene;
        this.dialogueJSON = require("../dialogue/dialogData.json");
        this.current_conv_id = "";
        this.cur_state = DialogueState.NONE;
    }

    /**
     * @brief Retrieves the dialogue for a given ID
     * @param {string} id, the ID of the dialogue element we want to retrieve
     * @return {JSON} a dialogue element with the given structure:
     * { name: "", text: "", choices: {}, goto: [] }
     */
    requestDialogue(id) {
        return this.dialogueJSON[id];
    }

    /**
     * @brief Retrieves the text for a given id
     * @param {string} id, the ID of the dialogue element we want to retrieve
     * @return {Array<string>} the text that will be displayed for a given ID
     */
    getText(id) {
        return this.dialogueJSON[id].text;
    }

    /**
     * @brief Retrieves the name of the person speaking for a given ID
     * @param {string} id, the ID of the dialogue element we want to retrieve
     * @return {string} the name that will be displayed for a given ID
     */
    getName(id) {
        return this.dialogueJSON[id].name;
    }

    /**
     * @brief Retrieves the dialogue controller's current state
     * @return the value of the cur_state attribute
     */
    getState() {
        return this.cur_state;
    }

    /**
     * @brief Checks whether the dialogue box is still displayed or not
     * @return {boolean} whether the dialogue state is DONE 
     */
    isDone() {
        return this.cur_state === DialogueState.DONE;
    }

    /**
     * @brief displays the dialogue that has a given ID
     * @param {string} id the ID of the dialogue that we want to display 
     * @param {boolean} up_down true if the dialogue will be placed on the top, false if on the bottom
     */
    display(id, up_down=true) {
        this.dialogue_pos = up_down ? UP_POS : DOWN_POS;
        
        this.current_conv_id = id;
        this.cur_state = DialogueState.DISPLAYED;

        //Create background animation
        this.parent_scene.anims.create({
            key: D_BOX_ANIMATION_KEY,
            frameRate: 15,
            frames: this.parent_scene.anims.generateFrameNames(DIALOGUE_BOX_KEY),
            repeat: -1
        });

        this.background = this.parent_scene.add.sprite(
            this.dialogue_pos.box.x,
            this.dialogue_pos.box.y,
            DIALOGUE_BOX_KEY
        ).play(D_BOX_ANIMATION_KEY);

        this.background.alpha = .9;

        //Add name text
        this.name = this.parent_scene.add.text(
            this.dialogue_pos.name.x,
            this.dialogue_pos.name.y,
            this.getName(id),
            {font: "90px OpenSans ", fill: "black"}
        );

        this.text = this.getText(id);
        this.textIdx = 0;

        //Add dialogue content 
        this.content = this.parent_scene.add.text(
            this.dialogue_pos.content.x, 
            this.dialogue_pos.content.y,
            this.text[this.textIdx],
            {font: "80px OpenSans", fill: "black", wordWrap: { width: 1800}}
        );

        this.content.setInteractive();

        this.parent_scene.input.on(
            'gameobjectdown',
            (_, gameObject) => {
                //Check that we clicked on the text
                if(gameObject === this.content && this.cur_state != DialogueState.DONE) {

                    this.textIdx++;

                    //Check if we've shown all of the text
                    if(this.textIdx === this.text.length) {
                        //Get rid of all dialogue elements
                        this.content.destroy();
                        this.name.destroy();
                        this.background.destroy();
                        this.content.disableInteractive();

                        //Update dialogue state
                        this.cur_state = DialogueState.DONE;
                        
                    } else {
                        this.content.text = this.text[this.textIdx];
                    }
                }
            }
        )
    }

    /**
     * @brief Continues the current dialogue
     * @param choice_id, the ID of the choice that was made 
     */
    converse(choice_id) {
        let cur_dialogue = this.requestDialogue(this.current_conv_id);
        
        //Select the next dialogue 
        this.current_conv_id = cur_dialogue.choices[choice_id].goto;
        this.display(this.current_conv_id, true);
    }
}