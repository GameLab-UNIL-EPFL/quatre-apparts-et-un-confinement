import { game } from "..";

export const Scenes = {
    INTRO: 'TitleScene',
    PROTOTYPE: 'Prototype',
    BUILDING: 'Building'
};

/**
 * @brief Class used to store the data related to the current player
 */
export class Player {
    /**
     * @brief Constructor for the player class
     */
    constructor() {
        this.cur_scene = Scenes.INTRO;
        this.scene_data = {};
        this.dialogue_tree = {};
    }

    /**
     * @brief Sets the internal data of the player
     * @param {JSON} data the new data of the current scene (scene dependent)
     * -- ProtoScene -- { cardIdx, clothes, food }
     */
    setData(data) {
        if(data) {
            this.scene_data = data;
        }
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
     * @brief Writes the current game data to a cookie
     */
    saveGame() {
        let serialized_data = {
            scene: this.cur_scene,
            data: this.scene_data,
            tree: this.dialogue_tree,
        };

        //Encode the data in base 64 before saving it
        serialized_data = btoa(JSON.stringify(serialized_data));

        localStorage.setItem('game', serialized_data);
    }

    /**
     * @brief Loads the game state from a cookie if any
     */
    loadGame() {
        //Retrieve the save file
        let storedGame = localStorage.getItem('game');
        let game_data;

        //Check if said file exists
        if(storedGame) {
            try{
                game_data = JSON.parse(atob(storedGame));
            } catch(e) {
                console.log('Could not get game data:', e);
            }

            if(game_data) {
                game.scene.start(game_data.scene, game_data.data);
            }
        }
    }
}

