import Phaser from "phaser";

export const DialogueState = {
    NONE: 0,
    DISPLAYED: 1,
    PROMPT: 2,
    DONE: 3
};

export const DIALOGUE_BOX_KEY = "dialogueBox";
const D_BOX_ANIMATION_KEY = "dBoxAnim";

const PROMT_HEIGHT = 400;
const SPACING = 100;

const UP_POS = {
    box: new Phaser.Math.Vector2(1020, 275), // ici: multiplier par horizontalRatio
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

        //Destroy the box if it is displayed
        if(this.background) {
            this.background.destroy();
        }
        if(this.name) {
            this.name.destroy();
        }
        if(this.content) {
            this.content.destroy();
        }

        //Create background sprite
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

        //Make the text interactive
        this.content.setInteractive();

        this.parent_scene.input.on(
            'gameobjectdown',
            (_, gameObject) => {
                //Check that we clicked on the text
                if(gameObject === this.content && this.cur_state != DialogueState.DONE) {

                    this.textIdx++;

                    //Make sure that it's not a prompt
                    if(this.cur_state === DialogueState.DISPLAYED) {
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
            },
            this
        );

        //Prompt user if necessary
        if(this.requestDialogue(id).goto.length !== 0) {
            this.promptAnswers(id);
        }
    }

    /**
     * @brief Shows (if any) the possible answers to a question
     * @param {string} id, the ID of the dialogue that requires a prompt
     */
    promptAnswers(id) {
        //Retrieve the dialogue
        const cur_dialogue = this.requestDialogue(id);

        this.prompts = [];

        //Check the amount of possible answers
        const num_answers = cur_dialogue.goto.length;
        if(num_answers !== 0) {
            this.cur_state = DialogueState.PROMPT;
            cur_dialogue.choices.forEach(choice => {

                //Create the prompt rectangle
                const bg = new Phaser.Geom.Rectangle(
                    0,
                    1200 - ((PROMT_HEIGHT + SPACING) * this.prompts.length),
                    2200,
                    PROMT_HEIGHT
                );
                const prompt_sprite = this.parent_scene.add.graphics({ fillStyle: { color: 0xffffff, alpha: 50 }});
                prompt_sprite.fillRectShape(bg);

                //Create the prompt text
                const prompt_text = this.parent_scene.add.text(
                    700,
                    1300 - ((PROMT_HEIGHT + SPACING) * this.prompts.length),
                    choice.text,
                    {font: "90px OpenSans ", fill: "black"}
                );

                //Activate prompt interactivity
                prompt_text.setInteractive();
                prompt_sprite.setInteractive();

                //Make the prompt interactive
                this.parent_scene.input.on(
                    'gameobjectdown',
                    (_, gameObject) => {
                        if(prompt_text === gameObject || prompt_sprite === gameObject) {
                            //Destroy all prompts if clicked
                            this.prompts.forEach(prompt => {
                                prompt.text.destroy();
                                prompt.sprite.destroy();
                            });

                            //Update the state
                            this.cur_state = DialogueState.DISPLAYED;

                            //Make a decision
                            this.display(choice.goto);
                        }
                    },
                    this
                );

                this.prompts.push({sprite: prompt_sprite, text: prompt_text});
            });
        }
    }
}
