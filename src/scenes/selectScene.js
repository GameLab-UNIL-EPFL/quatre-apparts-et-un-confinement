import Phaser, { Scene } from "phaser";
import { Scenes } from "../core/player.js";
import { Months } from "./buildingScene.js";
import { IndepComputerCards } from "./indepComputerScene.js";
import { player } from "../index.js";

export class SelectScene extends Phaser.Scene {
    constructor() {
        super({ key: Scenes.SELECT });

        this.levels = [
            { key: Scenes.STORE, data: {month: Months.MARCH}, text: "Store Patrick" },
            { key: Scenes.STORE, data: {month: Months.MAY}, text: "Store Damien" },
            { key: Scenes.INDEP_COMPUTER, data: {cardIdx: IndepComputerCards.IDLE_CARD}, text: "Patrick April" },
            { key: Scenes.GRANDMA, data: { month: Months.APRIL }, text: "Grandma April" },
            { key: Scenes.MOTHER_KITCHEN, data: {}, text: "Mother Kitchen April" }
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
