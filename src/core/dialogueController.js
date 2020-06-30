import Phaser from "phaser";

export const DialogueState = {
    NONE: 0,
    DISPLAYED: 1,
    PROMPT: 2,
    DONE: 3,
    MSG: 4
};

export const DIALOGUE_BOX_KEY = "dialogueBox";
export const D_BOX_ANIMATION_KEY = "dBoxAnim";

const MIN_Y_MSG_POS = {
    prompts: [2188, 2388, 2588],
    msg_1: {
        text: 1680,
        box: 1862
    },
    msg_2: {
        text: 1772,
        box: 1913
    },
    msg_3: {
        text: 1900,
        box: 1967
    },
    msg_4: {
        text: 1989,
        box: 2025
    }
};

const MIN_LEFT_X = {
    text: 518,
    box: 800
};

const MIN_RIGHT_X = {
    text: 943,
    box: 1217
};

const MSG_HEIGHT = {
    typing: 88,
    msg_1: 460,
    msg_2: 362,
    msg_3: 253,
    msg_4: 141,
    msg_space: 25
};

const MSG_LINE_CHARS = 19;
const MSG_RESP_DELAY = 1500;
const PROMT_HEIGHT = 400;
const SPACING = 100;
const MAX_N_PROMPTS = 3;

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
     * @param {Phaser.Scene} parent_scene the scene in which the controller is contained
     */
    constructor(parent_scene) {
        this.parent_scene = parent_scene;
        this.dialogueJSON = require("../dialogue/dialogData.json");
        this.current_conv_id = "";
        this.cur_state = DialogueState.NONE;

        this.displayed = [];
        this.prev_height = MSG_HEIGHT.typing;
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
     * @brief Ends the current dialogue
     */
    endDialogue() {
        this.cur_state = DialogueState.DONE;

        //Notify the parent scene
        this.parent_scene.notifyDialogueEnd();
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
            frameRate: 6,
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
                            this.endDialogue();

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

    /**
     * @brief Moves all of the displayed messages up to make room for a new message
     * @param {boolean} isTyping true is the message is a typing bubble, false otherwise
     */
    moveDisplayedUp(isTyping=false) {
        let move_dist = isTyping ?
            MSG_HEIGHT.typing :
            this.prev_height + MSG_HEIGHT.msg_space;

        this.parent_scene.tweens.add({
            targets: this.displayed,
            y: ("-= " + move_dist),
            duration: 100
        });
    }

    /**
     * @brief Displays a phone message in a tchat like fashion
     * @param {string} id the id of the dialogue to display
     * @param {boolean} lr true if the message is on the left, false otherwise
     * @param {string} choice_id the id of the choice that was made by the user (if any)
     * @param {Number} idx the index of the text we want to display (default is the first one)
     */
    displayMessage(id, lr, choice_id=null, idx=0) {
        //Set dialogue state
        this.cur_state = DialogueState.MSG;

        //Retrieve the dialogue
        let cur_text = choice_id ?
            this.requestDialogue(id).choices[choice_id].text :
            this.getText(id)[idx];

        let cur_dialogue = this.requestDialogue(id);

        //Decide which box to use
        let box = null;
        let ypos = {};
        if(cur_text.length < MSG_LINE_CHARS) {
            box = lr ? "recievedMsg4" : "sentMsg4";
            ypos = {
                text: MIN_Y_MSG_POS.msg_4.text,
                box: MIN_Y_MSG_POS.msg_4.box
            };
            this.prev_height = MSG_HEIGHT.msg_4;

        } else if(cur_text.length < 2 * MSG_LINE_CHARS) {
            box = lr ? "recievedMsg3" : "sentMsg3";
            ypos = {
                text: MIN_Y_MSG_POS.msg_3.text,
                box: MIN_Y_MSG_POS.msg_3.box
            };
            this.prev_height = MSG_HEIGHT.msg_3;

        } else if(cur_text.length < 3 * MSG_LINE_CHARS) {
            box = lr ? "recievedMsg2" : "sentMsg2";
            ypos = {
                text: MIN_Y_MSG_POS.msg_2.text,
                box: MIN_Y_MSG_POS.msg_2.box
            };
            this.prev_height = MSG_HEIGHT.msg_2;

        } else {
            box = lr ? "recievedMsg1" : "sentMsg1";
            ypos = {
                text: MIN_Y_MSG_POS.msg_1.text,
                box: MIN_Y_MSG_POS.msg_1.box
            };
            this.prev_height = MSG_HEIGHT.msg_1;
        }

        //Move the display up to make room for the new message
        this.moveDisplayedUp();

        //Create dialogue background
        let box_elem = this.parent_scene.add.image(
            lr ? MIN_LEFT_X.box : MIN_RIGHT_X.box,
            ypos.box,
            box
        );

        let text_elem = this.parent_scene.add.text(
            (lr ? MIN_LEFT_X.text : MIN_RIGHT_X.text),
            ypos.text,
            cur_text,
            {font: "60px OpenSans ", fill: lr ? "black" : "white", wordWrap: { width: 600 }}
        );

        //Move the messages back
        box_elem.setDepth(-1);
        text_elem.setDepth(-1);

        this.displayed.push(box_elem);
        this.displayed.push(text_elem);

        //Show answers
        if(cur_dialogue.goto.length > 0 && choice_id === null) {
            //this.msg_prompts.forEach(msg => msg.destroy());
            this.promptMessageAnswers(id);
        } else if(cur_dialogue.goto.length === 0) {
            //Trigger end of dialogue
            this.parent_scene.time.addEvent({
                delay: 3000,
                repeat: 0,
                callback: () => {
                    this.endDialogue();
                },
                callbackScope: this,
            });
        }
    }

    /**
     * @brief Displays the different possible answers to a given message
     * @param {string} id the id of the dialogue that triggered the prompt
     */
    promptMessageAnswers(id) {
        const dialogue = this.requestDialogue(id);
        let n_prompts = 0;

        this.msg_prompts = [];

        //Create all of the prompts texts (max MAX_N_PROMPTS)
        for(let choice_key in dialogue.choices) {

            const text_msg_elem = this.parent_scene.add.text(
                MIN_LEFT_X.text + SPACING,
                MIN_Y_MSG_POS.prompts[n_prompts++],
                dialogue.choices[choice_key].preview,
                {font: "60px OpenSans ", fill: "white"}
            );

            this.msg_prompts.push(text_msg_elem);

            //Make the element interactive
            text_msg_elem.setInteractive();
            this.parent_scene.input.on(
                'gameobjectdown',
                (_, gameObject) => {
                    if(gameObject === text_msg_elem) {
                        this.msg_prompts.forEach(msg => msg.destroy());

                        //Show the message above
                        this.displayMessage(id, false, choice_key);

                        //Goto the next dialogue
                        let next_id = dialogue.choices[choice_key].goto;

                        //Add a timer event to trigger the next message
                        this.parent_scene.time.addEvent({
                            delay: MSG_RESP_DELAY,
                            repeat: 0,
                            callback: () => {
                                if((next_id.length) > 0) {
                                    this.displayMessage(next_id, true);
                                }
                            },
                            callbackScope: this,
                        });
                    }
                },
                this
            );
        }

    }

    /**
     * @brief Destroys all dialogue currently shown on screen
     */
    destroyAllDisplayed() {
        this.displayed.forEach(dis => dis.destroy());

    }
}
