import { game } from "..";

export const Scenes = {
    INTRO: 'TitleScene',
    BUS: 'BusScene',
    DAMIEN_INIT: 'DamienInit',
    PROTOTYPE: 'Prototype',
    DAMIEN_KITCHEN_CLOTHES: 'DamienKitchenClothesScene',
    DAMIEN_COMPUTER: 'DamienComputer',
    BUILDING: 'Building',
    GRANDMA: 'Grandma',
    HALLWAY: 'Hallway',
    INDEP: 'Indep',
    INDEP_COMPUTER: 'IndepComputer',
    INDEP_MSG: 'IndepMsg',
    STORE: 'Store',
    STORE_EXT : 'Store_ext',
    MOTHER: 'Mother',
    DAMIEN_NO_FOOD: 'DamienKitchenNoFood',
    END_SCENE: 'EndScene'
};

/**
 * @brief Class used to store the data related to the current player
 */
export class Player {
    /**
     * @brief Constructor for the player class
     */
    constructor() {
        // THIS IS TEMPORARY: We should actually query the database to get an ID without risking collisions
        this.id = Math.random().toString(36).substr(2, 9);
        this.cur_scene = Scenes.INTRO;
        this.scene_data = {};
        this.dialogue_tree = {};
        this.damien_gone = false;
        this.nathan_failed = false;
    }

    /**
     * @brief Sets the internal data of the player
     * @param {JSON} data the new data of the current scene (scene dependent)
     * -- ProtoScene -- { cardIdx, clothes, food }
     * -- BuildingScene -- { mainMenu, stage, windows: { damien, grandma, family, indep }, month, nextScene: { damien, grandma, family, indep }}
     */
    setData(data) {
        if(data) {
            this.scene_data = data;
        }
    }

    /**
     * @brief getter for the data attribute
     * @returns {JSON} the data saved for the current scene
     */
    getData() {
        return this.scene_data;
    }

    /**
     * @brief Sets the player's dialogue tree
     * @param {JSON} dialogue_tree the decisions made by the player up until now
     * { 'id': { goto: 'next_id' }, 'id2': { goto: 'next_id' }, ... }
     * If no choice was possible, then the id will simply be the dialogue that happened
     */
    setDialogueTree(dialogue_tree) {
        this.dialogue_tree = dialogue_tree;
    }

    /**
     * @brief Adds an entry to the stored dialogue tree
     * @param {JSON} entry { id: 'id', goto: 'next_id' } a new entry in the dialogue tree
     */
    addDialogueTreeEntry(entry) {
        //Sanity check
        if(entry.id && entry.goto) {
            this.dialogue_tree[entry.id] = entry.goto;
        }
    }

    /**
     * @brief Returns whether or not a save file exists
     */
    saveExists() {
        return localStorage.getItem('game') !== null;
    }

    /**
     * @brief Writes the current game data to local storage
     */
    saveGame() {
        let serialized_data = {
            scene: this.cur_scene,
            data: this.scene_data,
            tree: this.dialogue_tree,
            damien_gone: this.damien_gone,
            nathan_failed: this.nathan_failed
        };

        //Encode the data in base 64 before saving it
        serialized_data = btoa(JSON.stringify(serialized_data));

        localStorage.setItem('game', serialized_data);
    }

    /**
     * @brief Loads the game state from local storage if any
     */
    loadGame() {
        //Retrieve the save file
        let storedGame = localStorage.getItem('game');
        let game_data;

        //Check if said file exists
        if(storedGame) {
            try {
                game_data = JSON.parse(atob(storedGame));
            } catch(e) {
                console.log('Could not get game data:', e);
            }

            if(game_data) {

                //Load all data into the player
                this.dialogue_tree = game_data.tree;
                this.cur_scene = game_data.scene;
                this.scene_data = game_data.data;
                this.damien_gone = game_data.damien_gone;
                this.nathan_failed = game_data.nathan_failed;

                //Start the loaded scene
                game.scene.start(game_data.scene, game_data.data);
            }
        }
    }

    sendChoices(payload) {
        /*
        Payload must match these SQL columns:
        ['player_id', 'damien_stay_home', 'damien_food', 'damien_game_score_mean', 'damien_clothes', 'damien_see_grandma', 'mother_stay_home', 'mother_game_score', 'freelancer_food_set', 'freelancer_food_amount', 'freelancer_love_advice', 'freelancer_game_score', 'grandma_books', 'grandma_advice'];

        example:
        payload = {
            'player_id': 1235, // required!
            'damien_clothes': 1
        };
        */

        (async () => {
            const rawResponse = await fetch('https://labs.letemps.ch/interactive/2020/_sandbox/_covidou_server/add_choices.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const content = await rawResponse.json();
            // Tells if database was successfully updated
            console.log(content);
        })();
    }
}
