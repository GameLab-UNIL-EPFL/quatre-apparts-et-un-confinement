/**
 * @brief Represents the card's current state
 * meaning whether it has finished loading or not and 
 * whether the card is still in use or not
 */
export const CardState = {
    INIT: 0,
    LOADED: 1,
    DONE: 2
};

/**
 * @brief Models a "Card" inside of a scene.
 * A card can be seen as a set of images that represent 
 * a given interactive moment in a scene
 */
export class Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param {Phaser.Scene} parent_scene, the Scene which this card belongs to
     * @param {array} children, the objects that are in the card
     */
    constructor(parent_scene, children) {
        //Initialize attributes
        this.children = children;
        this.parent_scene = parent_scene;
        this.cur_state = CardState.INIT;
    }

    /**
     * @brief getter for the card's state
     * @return {CardState} The card's current state
     */
    getState() {
        return this.cur_state;
    }

    /**
     * @brief Ends the current card
     */
    endCard() {
        this.cur_state = CardState.DONE;
    }

    /**
     * @brief Preloads all of the elements in the group
     * Assumes that all objects are images
     */
    preload() {
        this.children.forEach(child => child.preload());
    }

    /**
     * @brief Creates all of the elements in the group
     * Assumes that all objects are images
     */
    create() {
        this.children.forEach(child => child.create());
        this.cur_state = CardState.DONE;
    }

    /**
     * @brief Updates the sate of the card
     */
    update() {
        this.children.forEach(child => child.update());
    }

    /**
     * @breif Unloads all the different elements of the card from memory
     */
    destroy() {
        this.children.forEach(child => child.destroy());
    }
}