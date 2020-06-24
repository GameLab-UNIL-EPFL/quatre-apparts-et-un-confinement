import { game } from "..";

export const Scenes = {
    INTRO: 'intro',
    PROTOTYPE: 'Prototype'
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
     * @brief parses a given cookie string and converts it into a JSON
     * @param {string} cookie the cookie string to be converted
     * @returns {JSON} a JSON version of the cookie string
     */
    parseCookie(cookie) {
        //Split the cookie into elements
        let elems = cookie.split(";");

        //Split the element into key, value
        let game_s = elems[0].split("=");

        return {game: game_s[1]};
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

        //Write the data to a cookie
        document.cookie = "game=" + serialized_data + "; SameSite=Lax;"
    } 

    /**
     * @brief Loads the game state from a cookie if any
     */
    loadGame() {
        //Check that the cookie exists
        if(document.cookie.game) {
            //Decode the data and convert it back to a JSON
            let game_data = atob(this.parseCookie(document.cookie).game);
            game_data = JSON.parse(game_data);

            //Launch the current scene
            game.scene.scene.start(game_data.scene, game_data.data);
        }
    }
}