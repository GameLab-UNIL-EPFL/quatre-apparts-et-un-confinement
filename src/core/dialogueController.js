import Phaser from "phaser";
import { scale } from "..";
import { player } from "../index.js";

export const DialogueState = {
    NONE: 0,
    DISPLAYED: 1,
    PROMPT: 2,
    DONE: 3,
    MSG: 4
};

export const DIALOGUE_BOX_SPRITE_SIZE = {
    bg: { frameWidth: 1200, frameHeight: 260 },
    prompt: { frameWidth: 340, frameHeight: 96 }
};

export const DIALOGUE_BOX_KEY = "dialogueBox";
export const D_BOX_ANIMATION_KEY = "dBoxAnim";

const MIN_Y_MSG_POS = {
    msg_1: {
        text: 200,
        box: 200
    },
    msg_2: {
        text: 200,
        box: 200
    },
    msg_3: {
        text: 235,
        box: 315
    },
    msg_4: {
        text: 270,
        box: 332
    },
    msg_5: {
        text: 293,
        box: 352
    },
    msg_6: {
        text: 330,
        box: 369
    },
    msg_7: {
        text: 356,
        box: 382
    },
};

const MIN_LEFT_X = {
    text: -289,
    box: -129
};

const MIN_RIGHT_X = {
    text: -53,
    box: 112
};

const MSG_HEIGHT = {
    typing: 88,
    msg_1: 271,
    msg_2: 237,
    msg_3: 213,
    msg_4: 183,
    msg_5: 149,
    msg_6: 119,
    msg_7: 84,
    msg_space: 15
};

const MSG_LINE_CHARS = 18;
const MSG_RESP_DELAY = 1500;
const PROMT_HEIGHT = 200;
const SPACING = 25;
const MAX_N_PROMPTS = 3;

const UP_POS = {
    box: new Phaser.Math.Vector2(0, -650),
    name: new Phaser.Math.Vector2(-488, -745),
    content: new Phaser.Math.Vector2(-488, -675)
};

const DOWN_POS = {
    box: new Phaser.Math.Vector2(0, 646),
    name: new Phaser.Math.Vector2(-488, 551),
    content: new Phaser.Math.Vector2(-488, 626)
};

/**
 * @brief Handles everything that has to do with dialogue
 */
export class DialogueController {

    /**
     * @brief Creates a dialogue controller by loading the dialogue
     * directly from JSON.
     * @param {Phaser.Scene} parent_scene the scene in which the controller is contained
     * @param {string} dialogue_name the name of the dialogue JSON that will be loading in for the scene
     */
    constructor(parent_scene, dialogue_name="example") {
        this.parent_scene = parent_scene;
        this.dialogueJSON = require("../dialogue/" + dialogue_name + ".json");

        this.phone_dialogue_done = {};
        if ("telephone" in this.dialogueJSON) {
            if( "choices" in this.dialogueJSON["telephone"] ) {
                this.dialogueJSON["telephone"]["choices"].map(choice => this.phone_dialogue_done[choice.goto] = false);
            }
        }

        this.current_conv_id = "";
        this.cur_state = DialogueState.NONE;

        this.displayed = [];
        this.prev_height = MSG_HEIGHT.typing;
    }

    /**
     * @brief loads in all of the data needed by the dialogue controller
     */
    preload() {
        //Load in the dialogue box
        this.parent_scene.load.spritesheet(
            DIALOGUE_BOX_KEY,
            "sprites/UI/dialogueBox.png",
            DIALOGUE_BOX_SPRITE_SIZE.bg
        );

        //Load in prompts
        this.parent_scene.load.spritesheet(
            "prompts_1",
            "sprites/UI/prompts_1.png",
            DIALOGUE_BOX_SPRITE_SIZE.prompt
        );

        this.parent_scene.load.spritesheet(
            "prompts_2",
            "sprites/UI/prompts_2.png",
            DIALOGUE_BOX_SPRITE_SIZE.prompt
        );

        this.parent_scene.load.spritesheet(
            "prompts_1_done",
            "sprites/UI/prompts_1_done.png",
            DIALOGUE_BOX_SPRITE_SIZE.prompt
        );

        this.parent_scene.load.spritesheet(
            "prompts_2_done",
            "sprites/UI/prompts_2_done.png",
            DIALOGUE_BOX_SPRITE_SIZE.prompt
        );
    }

    preloadMessages() {
        //Load in message audio
        this.parent_scene.load.audio("newMessage", "sounds/textMessages/newMessage.wav");
        this.parent_scene.load.audio("sent", "sounds/textMessages/sentMessage.wav");

        //Load in the phone message sprites
        this.parent_scene.load.image("promptBox1", "sprites/UI/Messages/SelectionMessage_01.png");
        this.parent_scene.load.image("promptBox2", "sprites/UI/Messages/SelectionMessage_02.png");
        this.parent_scene.load.image("promptBox3", "sprites/UI/Messages/SelectionMessage_03.png");

        this.parent_scene.load.image("sentMsg1", "sprites/UI/Messages/SendMessage_01.png");
        this.parent_scene.load.image("sentMsg2", "sprites/UI/Messages/SendMessage_02.png");
        this.parent_scene.load.image("sentMsg3", "sprites/UI/Messages/SendMessage_03.png");
        this.parent_scene.load.image("sentMsg4", "sprites/UI/Messages/SendMessage_04.png");
        this.parent_scene.load.image("sentMsg5", "sprites/UI/Messages/SendMessage_05.png");
        this.parent_scene.load.image("sentMsg6", "sprites/UI/Messages/SendMessage_06.png");
        this.parent_scene.load.image("sentMsg7", "sprites/UI/Messages/SendMessage_07.png");

        this.parent_scene.load.image("recievedMsg1", "sprites/UI/Messages/ReceivedMessage_01.png");
        this.parent_scene.load.image("recievedMsg2", "sprites/UI/Messages/ReceivedMessage_02.png");
        this.parent_scene.load.image("recievedMsg3", "sprites/UI/Messages/ReceivedMessage_03.png");
        this.parent_scene.load.image("recievedMsg4", "sprites/UI/Messages/ReceivedMessage_04.png");
        this.parent_scene.load.image("recievedMsg5", "sprites/UI/Messages/ReceivedMessage_05.png");
        this.parent_scene.load.image("recievedMsg6", "sprites/UI/Messages/ReceivedMessage_06.png");
        this.parent_scene.load.image("recievedMsg7", "sprites/UI/Messages/ReceivedMessage_07.png");

        this.parent_scene.load.image("typing", "sprites/UI/Messages/typing.png");
    }

    createMessageBG() {
        //Create dialogue background
        const bg = new Phaser.Geom.Rectangle(
            -600,
            -800,
            5000,
            5000
        );

        const prompt_sprite = this.parent_scene.add.graphics({ fillStyle: { color: 0xf8f2df }});
        prompt_sprite.fillRectShape(bg);

        prompt_sprite.setDepth(-3);
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
        return this.cur_state === DialogueState.DONE || this.cur_state === DialogueState.NONE;
    }

    /**
     * @brief Ends the current dialogue
     */
    endDialogue() {
        this.cur_state = DialogueState.DONE;

        //Notify the parent scene
        if(this.parent_scene.notifyDialogueEnd) {
            this.parent_scene.notifyDialogueEnd();
        }
    }

    /**
     * @brief Destroys all of the sprites used by the current dialogue box
     */
    destroyDialogueBox() {
        if(this.background) {
            this.background.destroy();
        }
        if(this.name) {
            this.name.destroy();
        }
        if(this.content) {
            this.content.destroy();
        }
    }

    /**
     * @brief displays the dialogue that has a given ID
     * @param {string} id the ID of the dialogue that we want to display
     * @param {boolean} up_down true if the dialogue will be placed on the top, false if on the bottom
     */
    display(id, dontEnd=false, toMessage=false, up_down=true) {
        this.dialogue_pos = up_down ? UP_POS : DOWN_POS;

        this.current_conv_id = id;
        this.cur_state = DialogueState.DISPLAYED;

        const cur_dialogue = this.requestDialogue(id);

        //Check if an objective was met
        if(cur_dialogue.objective) {
            if(this.parent_scene.notifyObjectiveMet) {
                this.parent_scene.notifyObjectiveMet(cur_dialogue.objective.status);
            } else {
                console.error("DIALOG_OBJECTIVE: Parent scene doesn't implement notifyObjectiveMet");
            }
        }

        //Create background animation
        this.parent_scene.anims.create({
            key: D_BOX_ANIMATION_KEY,
            frameRate: 6,
            frames: this.parent_scene.anims.generateFrameNames(DIALOGUE_BOX_KEY),
            repeat: -1
        });

        //Destroy the box if it is displayed
        this.destroyDialogueBox();

        //Create background sprite
        this.background = this.parent_scene.add.sprite(
            this.dialogue_pos.box.x,
            this.dialogue_pos.box.y,
            DIALOGUE_BOX_KEY
        ).play(D_BOX_ANIMATION_KEY);

        this.background.alpha = .9;
        this.background.setDepth(5);

        //Add name text
        this.name = this.parent_scene.add.text(
            this.dialogue_pos.name.x,
            this.dialogue_pos.name.y,
            this.getName(id),
            {font: "44px OpenSans-Bold", fill: "#27303a"}
        );

        this.name.setDepth(5);

        this.text = this.getText(id);
        this.textIdx = 0;

        //Add dialogue content
        this.content = this.parent_scene.add.text(
            this.dialogue_pos.content.x,
            this.dialogue_pos.content.y,
            this.text[this.textIdx],
            {
                font: "44px OpenSans",
                fill: "#27303a",
                wordWrap: { width: (this.background.displayWidth - (SPACING * 8)) }
            }
        );

        this.content.setDepth(5);

        const interaction = () => {
            //Prompt user if necessary on interaction
            if(this.requestDialogue(id).goto.length !== 0 && this.textIdx === this.text.length - 1) {
                if(Object.keys(this.requestDialogue(id).choices).length !== 0) {
                    this.promptAnswers(id, toMessage);
                } else {
                    this.display(this.requestDialogue(id).goto[0], false);
                    return;
                }
            }

            //Check that we clicked on the text
            if(this.cur_state !== DialogueState.DONE) {

                this.textIdx++;

                //Make sure that it's not a prompt
                if(this.cur_state === DialogueState.DISPLAYED) {

                    //Check if we've shown all of the text
                    if(this.textIdx === this.text.length) {

                        if(!dontEnd) {
                            //Get rid of all dialogue elements
                            this.content.destroy();
                            this.name.destroy();
                            this.background.destroy();
                            this.content.disableInteractive();
                            this.textIdx = 0;

                            //Update dialogue state
                            this.endDialogue();
                        }
                    } else {
                        this.content.text = this.text[this.textIdx];
                    }
                }
            }
        };

        //Make the text interactive
        this.content.setInteractive().on('pointerdown', interaction, this);
        this.background.setInteractive().on('pointerdown', interaction, this);

        //Prompt user if necessary
        if(this.requestDialogue(id).goto.length !== 0 && this.textIdx === this.text.length - 1) {
            if(Object.keys(this.requestDialogue(id).choices).length !== 0) {
                this.promptAnswers(id, toMessage);
            } else {
                this.display(this.requestDialogue(id).goto[0], false);
                return;
            }
        }
    }

    /**
     * @brief Shows (if any) the possible answers to a question
     * @param {string} id, the ID of the dialogue that requires a prompt
     */
    promptAnswers(id, toMessage = false) {
        //Retrieve the dialogue
        const cur_dialogue = this.requestDialogue(id);

        //Get rid of all existing prompts
        if(this.prompts) {
            this.prompts.forEach(prompt => {
                prompt.text.destroy();
                prompt.sprite.destroy();
            });
        }

        this.prompts = [];

        //Check the amount of possible answers
        const num_answers = Object.keys(cur_dialogue.choices).length;
        if(num_answers !== 0) {
            this.cur_state = DialogueState.PROMPT;
            cur_dialogue.choices.forEach(choice => {
                console.log('Choice:', choice.goto);

                //Chose which of the two spritesheets to use
                let prompts_name = "prompts_" + ((this.prompts.length % 2) + 1);

                // If dialogue already played: grey background
                let dialogue_done_suffix = '';
                if(this.phone_dialogue_done.hasOwnProperty(choice.goto)) {
                    if(this.phone_dialogue_done[choice.goto] === true) {
                        dialogue_done_suffix = '_done';
                    }
                }

                //Create background animation
                this.parent_scene.anims.create({
                    key: "prompt_anim_" + this.prompts.length +  dialogue_done_suffix,
                    frameRate: 6,
                    frames: this.parent_scene.anims.generateFrameNames(prompts_name + dialogue_done_suffix),
                    repeat: -1
                });

                //Compute the prompt position
                let prompt_position = this.background.y + this.background.displayHeight;

                if(this.prompts.length > 0) {
                    prompt_position = this.prompts[this.prompts.length - 1].sprite.y +
                        (this.prompts[this.prompts.length - 1].sprite.displayHeight + SPACING);
                }

                //Create the prompt rectangle
                const prompt_sprite = this.parent_scene.add.sprite(
                    0,
                    prompt_position,
                    prompts_name
                ).play("prompt_anim_" + this.prompts.length + dialogue_done_suffix);

                //Center the box
                prompt_sprite.setOrigin(0.5, 0.5);
                prompt_sprite.setDepth(5);

                //Create the prompt text
                const prompt_text = this.parent_scene.add.text(
                    0,
                    prompt_sprite.y,
                    choice.text,
                    {
                        font: (54) + "px OpenSans",
                        fill: "white",
                        wordWrap: { width: this.background.displayWidth - (4 * SPACING) }
                    }
                );

                //Center the text
                prompt_text.setOrigin(0.5, 0.5);
                prompt_text.setDepth(5);

                //Adapt the box size to fit the text if needed
                if(prompt_text.displayWidth > prompt_sprite.displayWidth) {
                    prompt_sprite.displayWidth = prompt_text.displayWidth + 100;
                }

                if(prompt_text.displayHeight > prompt_sprite.displayHeight) {
                    prompt_sprite.displayHeight = prompt_text.displayHeight + SPACING;
                }

                const interaction = () => {
                    if(this.phone_dialogue_done.hasOwnProperty(choice.goto)) {
                        // Save choice so it’ll appear grey next time
                        this.phone_dialogue_done[choice.goto] = true;
                    }

                    //Destroy all prompts if clicked
                    this.prompts.forEach(prompt => {
                        prompt.text.destroy();
                        prompt.sprite.destroy();
                    });

                    //Update the state
                    this.cur_state = DialogueState.DISPLAYED;

                    //Make a decision
                    if(toMessage) {
                        this.displayMessage(choice.goto, true);
                    } else {
                        this.display(choice.goto);
                    }

                    //Save the dialogue entry
                    player.addDialogueTreeEntry({
                        id: id,
                        next_id: choice.goto
                    });
                };

                //Make the prompt interactive
                prompt_text.setInteractive().on('pointerdown', interaction, this);
                prompt_sprite.setInteractive().on('pointerdown', interaction, this);

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
        const cur_text = choice_id ?
            this.requestDialogue(id).choices[choice_id].text[0] :
            this.getText(id)[idx];

        const cur_dialogue = this.requestDialogue(id);

        //Check if an objective was met
        if(cur_dialogue.objective) {
            if(this.parent_scene.notifyObjectiveMet) {
                this.parent_scene.notifyObjectiveMet(cur_dialogue.objective.status);
            } else {
                console.error("DIALOG_OBJECTIVE: Parent scene doesn't implement notifyObjectiveMet");
            }
        }

        //Decide which box to use
        let box = null;
        let ypos = {};
        if(cur_text.length < MSG_LINE_CHARS) {
            box = lr ? "recievedMsg7" : "sentMsg7";
            ypos = {
                text: MIN_Y_MSG_POS.msg_7.text,
                box: MIN_Y_MSG_POS.msg_7.box
            };
            this.prev_height = MSG_HEIGHT.msg_7;

        } else if(cur_text.length < 2 * MSG_LINE_CHARS) {
            box = lr ? "recievedMsg6" : "sentMsg6";
            ypos = {
                text: MIN_Y_MSG_POS.msg_6.text,
                box: MIN_Y_MSG_POS.msg_6.box
            };
            this.prev_height = MSG_HEIGHT.msg_6;

        } else if(cur_text.length < 3 * MSG_LINE_CHARS) {
            box = lr ? "recievedMsg5" : "sentMsg5";
            ypos = {
                text: MIN_Y_MSG_POS.msg_5.text,
                box: MIN_Y_MSG_POS.msg_5.box
            };
            this.prev_height = MSG_HEIGHT.msg_5;

        } else if(cur_text.length < 4 * MSG_LINE_CHARS) {
            box = lr ? "recievedMsg4" : "sentMsg4";
            ypos = {
                text: MIN_Y_MSG_POS.msg_4.text,
                box: MIN_Y_MSG_POS.msg_4.box
            };
            this.prev_height = MSG_HEIGHT.msg_4;
        } else if(cur_text.length < 5 * MSG_LINE_CHARS) {
            box = lr ? "recievedMsg3" : "sentMsg3";
            ypos = {
                text: MIN_Y_MSG_POS.msg_3.text,
                box: MIN_Y_MSG_POS.msg_3.box
            };
            this.prev_height = MSG_HEIGHT.msg_3;
        } else if(cur_text.length < 6 * MSG_LINE_CHARS) {
            box = lr ? "recievedMsg2" : "sentMsg2";
            ypos = {
                text: MIN_Y_MSG_POS.msg_2.text,
                box: MIN_Y_MSG_POS.msg_2.box
            };
            this.prev_height = MSG_HEIGHT.msg_2;
        } else if(cur_text.length < 7 * MSG_LINE_CHARS) {
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
        const box_elem = this.parent_scene.add.image(
            lr ? MIN_LEFT_X.box : MIN_RIGHT_X.box,
            ypos.box,
            box
        );

        const text_elem = this.parent_scene.add.text(
            (lr ? MIN_LEFT_X.text : MIN_RIGHT_X.text),
            ypos.text,
            cur_text,
            {font: (30) + "px OpenSans", fill: lr ? "black" : "white", wordWrap: { width: 350 }}
        );

        //Move the messages back
        box_elem.setDepth(-2);
        text_elem.setDepth(-2);

        this.displayed.push(box_elem);
        this.displayed.push(text_elem);

        //Show answers
        if(cur_dialogue.goto.length > 0 && choice_id === null) {
            //this.msg_prompts.forEach(msg => msg.destroy());
            this.promptMessageAnswers(id);
        } else if(cur_dialogue.goto.length === 0) {
            //Save the dialogue entry
            player.addDialogueTreeEntry({
                id: id,
                next_id: ""
            });

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

        let font_size;
        let prompt_ypos = [];
        let prompt_xpos = -277;

        //Display the correct prompt box
        if(Object.keys(dialogue.choices).length <= 1) {
            this.parent_scene.add.image(-7, 616, 'promptBox1');
            font_size = 40;
            prompt_ypos = [584];
        } else if(Object.keys(dialogue.choices).length <= 2) {
            this.parent_scene.add.image(-7, 616, 'promptBox2');
            font_size = 35;
            prompt_ypos = [497, 677];
        } else {
            this.parent_scene.add.image(-7, 616, 'promptBox3');
            font_size = 30;
            prompt_ypos = [476, 592, 711];
        }

        //Create all of the prompts texts (max MAX_N_PROMPTS)
        for(let choice_key in dialogue.choices) {

            const text_msg_elem = this.parent_scene.add.text(
                prompt_xpos,
                prompt_ypos[n_prompts++],
                dialogue.choices[choice_key].preview,
                {font: font_size + "px OpenSans", fill: "white"}
            );

            this.msg_prompts.push(text_msg_elem);

            const touchMsgAnswer = () => {
                // NICE TO HAVE: animate
                this.msg_prompts.forEach(msg => msg.destroy());

                //Show the message above
                this.displayMessage(id, false, choice_key);

                //Goto the next dialogue
                const next_id = dialogue.choices[choice_key].goto;

                //play sound
                this.sent = this.parent_scene.sound.add("sent");
                this.sent.play({volume: 0.5});
                //Retrieve dialiogue
                const next_msg = this.requestDialogue(next_id);

                //Add a timer event to trigger the next message
                this.parent_scene.time.addEvent({
                    delay: MSG_RESP_DELAY,
                    repeat: 0,
                    callback: () => {
                        if((next_id.length) > 0) {
                            this.displayMessage(next_id, true, null, 0);

                            if(next_msg.text.length > 1) {
                                this.parent_scene.time.addEvent({
                                    delay: MSG_RESP_DELAY,
                                    repeat: 0,
                                    callback: () => {
                                        if((next_id.length) > 0) {
                                            this.displayMessage(next_id, true, null, 1);

                                            if(next_msg.text.length > 2) {
                                                this.parent_scene.time.addEvent({
                                                    delay: MSG_RESP_DELAY,
                                                    repeat: 0,
                                                    callback: () => {
                                                        if((next_id.length) > 0) {
                                                            this.displayMessage(next_id, true, null, 2);
                                                        }
                                                    },
                                                    callbackScope: this,
                                                });
                                            }
                                        }
                                    },
                                    callbackScope: this,
                                });
                            }
                        }
                    },
                    callbackScope: this,
                });

                //Save the dialogue entry
                player.addDialogueTreeEntry({
                    id: id,
                    next_id: next_id
                });
            };

            //Make the element interactive

            // prompt_sprite.setInteractive().on('pointerdown', touchMsgAnswer, this);
            text_msg_elem.setInteractive(
                new Phaser.Geom.Rectangle(-30, -30, 580, 100), Phaser.Geom.Rectangle.Contains
            ).on('pointerdown', touchMsgAnswer, this);
        }
    }

    /**
     * @brief Destroys all dialogue currently shown on screen
     */
    destroyAllDisplayed() {
        this.displayed.forEach(dis => dis.destroy());
    }
}
