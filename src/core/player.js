import { game } from "..";

const endpoint = /labs\.letemps/.test(window.location.hostname) ? 'https://labs.letemps.ch/interactive/2020/quatre-apparts-un-confinement/server/': 'https://labs.letemps.ch/interactive/2020/quatre-apparts-un-confinement/server-dev/';

export const Scenes = {
    INTRO: 'TitleScene',
    BUS: 'BusScene',
    DAMIEN_INIT: 'DamienInit',
    PROTOTYPE: 'Prototype',
    DAMIEN_KITCHEN_CLOTHES: 'DamienKitchenClothesScene',
    DAMIEN_COMPUTER: 'DamienComputer',
    DAMIEN_OUTSIDE: 'DamienOutside',
    DAMIEN_END_MESSAGE: 'DamienEndMessage',
    BUILDING: 'Building',
    GRANDMA: 'Grandma',
    GRANDMA_END: 'Grandma_End',
    HALLWAY: 'Hallway',
    INDEP: 'Indep',
    INDEP_COMPUTER: 'IndepComputer',
    INDEP_MSG: 'IndepMsg',
    INDEP_SAD_HOME: 'IndepSadHome',
    STORE: 'Store',
    STORE_EXT : 'Store_ext',
    MOTHER: 'Mother',
    MOTHER_KITCHEN: 'MotherKitchen',
    MOTHER_COUCH: 'MotherCouch',
    DAMIEN_NO_FOOD: 'DamienKitchenNoFood',
    END_SCENE: 'EndScene',
    SELECT: 'Select',
    STATS: 'Stats'
};

export const LANGUAGES = {
    FR: 'fr',
    EN: 'en'
};

/**
 * @brief Class used to store the data related to the current player
 */
export class Player {
    /**
     * @brief Constructor for the player class
     */
    constructor() {
        this.id = this.generateId();
        this.statsEnabled = false;
        this.version = 0.3;
        this.cur_scene = Scenes.INTRO;
        this.scene_data = {};
        this.dialogue_tree = {};
        this.damien_gone = false;       //Whether or not damien chose to go see his gf
        this.freelancer_good_love_advice = false;     //Whether or not Patrick gave good dating advice
        this.kids_park = false;         //Whether or not Florence chose to take her kids to the park
        this.suzanne_hair = false;      //Whether or not Suzanne chose to go to the hair-dresser
        this.indep_shopping_basket = [];
        this.completed = false;         //Whether or not the game was ever completed
        this.language = LANGUAGES.FR;
    }

    /**
     * Toggles the current language stored in the player
     */
    toggleLanguage() {
        if(this.language === LANGUAGES.EN) {
            this.language = LANGUAGES.FR;
        } else {
            this.language = LANGUAGES.EN;
        }
    }

    languageToText() {
        switch(this.language) {
            case LANGUAGES.EN:
                return "English";
            case LANGUAGES.FR:
                return "Français";
            default:
                return "";
        }
    }

    /**
     * @brief Sets the internal data of the player
     * @param {JSON} data the new data of the current scene (scene dependent)
     * -- StudentScene -- { cardIdx, clothes, food }
     * -- BuildingScene -- { mainMenu, stage, windows: { damien, grandma, family, indep }, month, nextScene: { damien, grandma, family, indep }}
     */

    enableStats() {
        this.statsEnabled = true;

        // analytics setup - experimental
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(), event:'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer'?'&l='+l:'';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j,f);
        })(window, document, 'script', 'dataLayer', 'GTM-TQ2B8Q');

        console.log('Stats enabled');
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9) + ((new Date()).getTime()).toString(36);
    }

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

    getBasket() {
        console.log(this);
        return this.indep_shopping_basket;
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
        // TODO: check if has “version” property and if current version is high enough
        return localStorage.getItem('game') !== null;
    }

    loadSave() {
        if(this.saveExists()) {
            const game_data = JSON.parse(atob(localStorage.getItem('game')));

            this.id = game_data.id;
            this.statsEnabled = game_data.statsEnabled;
            this.version = game_data.version;
            this.dialogue_tree = game_data.tree;
            this.cur_scene = game_data.scene;
            this.scene_data = game_data.data;
            this.damien_gone = game_data.damien_gone;
            this.freelancer_good_love_advice = game_data.freelancer_good_love_advice;
            this.kids_park = game_data.kids_park;
            this.suzanne_hair = game_data.suzanne_hair;
            this.indep_shopping_basket = game_data.indep_shopping_basket;
            this.completed = game_data.completed;
            this.language = game_data.language ? game_data.language : LANGUAGES.FR;
        }
    }

    /**
     * @brief Writes the current game data to local storage
     */
    saveGame() {
        let serialized_data = {
            id: this.id,
            statsEnabled: this.statsEnabled,
            version: this.version,
            scene: this.cur_scene,
            data: this.scene_data,
            tree: this.dialogue_tree,
            damien_gone: this.damien_gone,
            freelancer_good_love_advice: this.freelancer_good_love_advice,
            kids_park: this.kids_park,
            suzanne_hair: this.suzanne_hair,
            indep_shopping_basket: this.indep_shopping_basket,
            completed: this.completed,
            language: this.language
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
        const storedGame = localStorage.getItem('game');
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
                this.id = game_data.id;
                this.statsEnabled = game_data.statsEnabled;
                this.version = game_data.version;
                this.dialogue_tree = game_data.tree;
                this.cur_scene = game_data.scene;
                this.scene_data = game_data.data;
                this.damien_gone = game_data.damien_gone;
                this.freelancer_good_love_advice = game_data.freelancer_good_love_advice;
                this.kids_park = game_data.kids_park;
                this.suzanne_hair = game_data.suzanne_hair;
                this.indep_shopping_basket = game_data.indep_shopping_basket;
                this.completed = game_data.completed;
                this.language = game_data.language ? game_data.language : LANGUAGES.FR;

                //Start the loaded scene
                game.scene.start(game_data.scene, game_data.data);
            }
        }
    }

    checkIdCallback(data, iteration) {
        if(data['count'] !== "0" && iteration < 10) {
            iteration++;
            this.player_id = this.generateId();
            setTimeout(function(_this) {
                _this.checkPlayerId(iteration);
            }, 500, this);
        } else {
            this.sendChoices({'player_id': this.player_id});
        }
    }

    checkPlayerId(iteration = 0) {
        if (this.statsEnabled === true) {
            (async () => {
                const rawResponse = await fetch(endpoint + 'check_player_id.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'player_id': this.player_id})
                }).catch( (e) => console.warn(e) );

                if(rawResponse) {
                    const content = await rawResponse.json();
                    // Output if player_id already exists: {"result": "success", "count": "1"}
                    this.checkIdCallback(content, iteration);
                }
            })();
        } else {
            console.log('“No” to sticky => stats disabled');
        }
    }

    sendChoices(payload) {
        /*
        Payload must match these SQL columns:
        ['player_id', 'damien_stay_home', 'damien_food', 'damien_game_score_mean', 'damien_clothes', 'damien_see_grandma', 'mother_stay_home', 'mother_game_score', 'freelancer_food_set', 'freelancer_food_amount', 'freelancer_love_advice', 'freelancer_game_score', 'grandma_hairdresser', 'grandma_books', 'grandma_advice'];

        example:
        payload = {
            'player_id': 1235, // required!
            'damien_clothes': 1
        };
        */
        if (this.statsEnabled) {
            (async () => {
                const rawResponse = await fetch(endpoint + 'add_choices.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }).catch( (e) => console.warn(e) );

                if(rawResponse) {
                    const content = await rawResponse.json();
                    // Tells if database was successfully updated
                    console.log(content);
                }
            })();
        } else {
            console.log('“No” to sticky => stats disabled');
        }
    }

    async getStats() {
        const rawResponse = await fetch(endpoint + 'get_choice_stats.php', {
            method: 'GET'
        }).catch( (e) => console.warn(e) );

        if(rawResponse) {
            const content = await rawResponse.json();
            // Example output: [{"choice":"kids_park","percentage":"35.0"},{"choice":"grandma_hairdresser","percentage":"39.0"},{"choice":"damien_stay_home","percentage":"0.0"},{"choice":"freelancer_good_love_advice","percentage":"28.0"}]
            return content;
        }
        return false;
    }
}
