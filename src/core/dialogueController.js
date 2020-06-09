import Phaser from "phaser";

export class DialogueController {
    
    /**
     * @brief Creates a dialogue controller by loading the dialogue 
     * directly from JSON.
     */
    constructor() {
        this.dialogueJSON = require("../dialogue/example.json");
        this.current_conv_id = "";
    }

    requestDialogue(id) {
        return this.dialogueJSON[id];
    }

    /**
     * @brief Continues the current dialogue
     * @param choice_id, the ID of the choice that was made 
     */
    converse(choice_id) {
        let cur_dialogue = this.requestDialogue(this.current_conv_id);
        
        //Select the next dialogue 
        this.current_conv_id = cur_dialogue.choices[choice_id].goto;
        return this.requestDialogue(this.current_conv_id);
    }
}