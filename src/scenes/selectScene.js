import Phaser, { Scene } from "phaser";
import { Scenes } from "../core/player.js";
import { Months } from "./buildingScene.js";
import { IndepComputerCards } from "./indepComputerScene.js";
import { player } from "../index.js";
import { IndepCards } from "./indepScene.js";

export class SelectScene extends Phaser.Scene {
    constructor() {
        super({ key: Scenes.SELECT });

        this.levels = [
            { key: Scenes.STATS, data: {}, text: "Stats" },
            { key: Scenes.STORE, data: {month: Months.APRIL}, text: "Store Patrick" },
            { key: Scenes.STORE, data: {month: Months.MAY}, text: "Store Damien" },
            { key: Scenes.DAMIEN_OUTSIDE, data: {}, text: "Damien Outside" },
            { key: Scenes.INDEP, data: {cardIdx: IndepCards.IDLE_CARD}, text: "Patrick March" },
            { key: Scenes.INDEP_COMPUTER, data: {cardIdx: IndepComputerCards.IDLE_CARD}, text: "Patrick April" },
            { key: Scenes.INDEP_SAD_HOME, data: {}, text: "Patrick June" },
            { key: Scenes.GRANDMA, data: { month: Months.APRIL }, text: "Grandma April" },
            { key: Scenes.MOTHER_KITCHEN, data: {}, text: "Mother Kitchen April" },
            { key: Scenes.MOTHER_COUCH, data: {}, text: "Mother Couch June" }
        ];

        this.texts = [];
    }

    preload() {}

    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBackgroundColor("#f4e1c5");

        const offset = window.innerHeight/(this.levels.length + 2);
        let y_offset = offset - window.innerHeight/2;

        this.levels.forEach(level => {
            const text = this.add.text(
                0,
                y_offset,
                level.text,
                {font: 55 + "px OpenSans", fill: "#27303A"}
            );

            y_offset += offset;

            text.setOrigin(0.5, 0.5);
            text.setInteractive().on('pointerdown', () => {
                player.cur_scene = level.key;
                player.setData(level.data);
                player.saveGame();

                this.destroy();

                player.loadGame();
            });

            this.texts.push(text);
        });
    }

    destroy() {
        this.cameras.main.setBackgroundColor("black");
        this.texts.forEach(text => text.destroy());
    }

}
