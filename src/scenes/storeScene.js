import Phaser from "phaser";
import { Card } from "./cards/card.js";
import { CardObject } from "./objects/cardObject.js";
import { Background } from "./objects/background.js";
import { Scenes } from "../core/player.js";
import { HallwayCards } from "./hallwayScene.js";
import { player } from "../index.js";
import { Months } from "./buildingScene.js";

export const StoreCards = {
    FIRST_SHELF: 0,
    SECOND_SHELF: 1
};

export class StoreScene extends Phaser.Scene {
    /**
     * @brief initializes the different cards needed in the scene
     * and the index that will be used to know which card we are at
     * in said scene
     */
    constructor() {
        super({key: Scenes.STORE});

        this.shoppingBasket = [];

        /* === FIRST SHELF === */
        this.firstShelf = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/StoreScene/part1/rayon01_01_rayonnage.jpg",
                    "storeBg1"
                ),
                new CardObject(
                    this,
                    { name: "pate01", url: "sprites/StoreScene/part1/rayon01_03_pate01.png" },
                    new Phaser.Math.Vector2(-326, -380),
                    (scene) => scene.takeObject("pate01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate02", url: "sprites/StoreScene/part1/rayon01_03_pate02.png" },
                    new Phaser.Math.Vector2(-182, -378),
                    (scene) => scene.takeObject("pate02"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate03", url: "sprites/StoreScene/part1/rayon01_03_pate03.png" },
                    new Phaser.Math.Vector2(-441, -132),
                    (scene) => scene.takeObject("pate03"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate04", url: "sprites/StoreScene/part1/rayon01_03_pate04.png" },
                    new Phaser.Math.Vector2(-328, -132),
                    (scene) => scene.takeObject("pate04"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate05", url: "sprites/StoreScene/part1/rayon01_03_pate05.png" },
                    new Phaser.Math.Vector2(-206, -132),
                    (scene) => scene.takeObject("pate05"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine01", url: "sprites/StoreScene/part1/rayon01_03_farine01.png" },
                    new Phaser.Math.Vector2(-525, 145),
                    (scene) => scene.takeObject("farine01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine02", url: "sprites/StoreScene/part1/rayon01_03_farine02.png" },
                    new Phaser.Math.Vector2(-417, 148),
                    (scene) => scene.takeObject("farine02"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine03", url: "sprites/StoreScene/part1/rayon01_03_farine03.png" },
                    new Phaser.Math.Vector2(-294, 145),
                    (scene) => scene.takeObject("farine03"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine04", url: "sprites/StoreScene/part1/rayon01_03_farine04.png" },
                    new Phaser.Math.Vector2(-119, 148),
                    (scene) => scene.takeObject("farine04"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine05", url: "sprites/StoreScene/part1/rayon01_03_farine05.png" },
                    new Phaser.Math.Vector2(-8, 145),
                    (scene) => scene.takeObject("farine05"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine06", url: "sprites/StoreScene/part1/rayon01_03_farine06.png" },
                    new Phaser.Math.Vector2(97, 142),
                    (scene) => scene.takeObject("farine06"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine07", url: "sprites/StoreScene/part1/rayon01_03_farine07.png" },
                    new Phaser.Math.Vector2(203, 142),
                    (scene) => scene.takeObject("farine07"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "farine08", url: "sprites/StoreScene/part1/rayon01_03_farine08.png" },
                    new Phaser.Math.Vector2(306, 148),
                    (scene) => scene.takeObject("farine08"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "sac01", url: "sprites/StoreScene/part1/rayon01_03_sac01.png" },
                    new Phaser.Math.Vector2(-119, 431),
                    (scene) => scene.takeObject("sac01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "sac02", url: "sprites/StoreScene/part1/rayon01_03_sac02.png" },
                    new Phaser.Math.Vector2(159, 420),
                    (scene) => scene.takeObject("sac02"),
                    this
                ),

                new CardObject(
                    this,
                    { name: "pate06", url: "sprites/StoreScene/part1/rayon01_03_pate06.png" },
                    new Phaser.Math.Vector2(-60, -120),
                    (scene) => scene.takeObject("pate06"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate07", url: "sprites/StoreScene/part1/rayon01_03_pate07.png" },
                    new Phaser.Math.Vector2(46, -120),
                    (scene) => scene.takeObject("pate07"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate10", url: "sprites/StoreScene/part1/rayon01_03_pate10.png" },
                    new Phaser.Math.Vector2(-152, -627),
                    (scene) => scene.takeObject("pate10"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate11", url: "sprites/StoreScene/part1/rayon01_03_pate11.png" },
                    new Phaser.Math.Vector2(-42, -627),
                    (scene) => scene.takeObject("pate11"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate12", url: "sprites/StoreScene/part1/rayon01_03_pate12.png" },
                    new Phaser.Math.Vector2(115, -634),
                    (scene) => scene.takeObject("pate12"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "sac03", url: "sprites/StoreScene/part1/rayon01_03_sac03.png" },
                    new Phaser.Math.Vector2(437, 423),
                    (scene) => scene.takeObject("sac03"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate_spaghetti01", url: "sprites/StoreScene/part1/rayon01_03_spaghetti01.png" },
                    new Phaser.Math.Vector2(28, -333),
                    (scene) => scene.takeObject("pate_spaghetti01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate_spaghetti02", url: "sprites/StoreScene/part1/rayon01_03_spaghetti02.png" },
                    new Phaser.Math.Vector2(30, -385),
                    (scene) => scene.takeObject("pate_spaghetti02"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate_spaghetti03", url: "sprites/StoreScene/part1/rayon01_03_spaghetti03.png" },
                    new Phaser.Math.Vector2(318, -336),
                    (scene) => scene.takeObject("pate_spaghetti03"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate08", url: "sprites/StoreScene/part1/rayon01_03_pate08.png" },
                    new Phaser.Math.Vector2(223, -128),
                    (scene) => scene.takeObject("pate08"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pate09", url: "sprites/StoreScene/part1/rayon01_03_pate09.png" },
                    new Phaser.Math.Vector2(362, -125),
                    (scene) => scene.takeObject("pate09"),
                    this
                )
            ]
        );

        /* === SECOND SHELF === */

        this.secondShelf = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/StoreScene/part2/rayon01_01_rayonnage.jpg",
                    "storeBg2"
                ),
                new CardObject(
                    this,
                    { name: "banane01", url: "sprites/StoreScene/part2/rayon01_02_banane01.png" },
                    new Phaser.Math.Vector2(190, 390),
                    (scene) => scene.takeObject("banane01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "banane02", url: "sprites/StoreScene/part2/rayon01_02_banane02.png" },
                    new Phaser.Math.Vector2(204, 398),
                    (scene) => scene.takeObject("banane02"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "banane03", url: "sprites/StoreScene/part2/rayon01_02_banane03.png" },
                    new Phaser.Math.Vector2(208, 390),
                    (scene) => scene.takeObject("banane03"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "banane04", url: "sprites/StoreScene/part2/rayon01_02_banane04.png" },
                    new Phaser.Math.Vector2(210, 402),
                    (scene) => scene.takeObject("banane04"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "banane05", url: "sprites/StoreScene/part2/rayon01_02_banane05.png" },
                    new Phaser.Math.Vector2(195, 400),
                    (scene) => scene.takeObject("banane05"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "banane06", url: "sprites/StoreScene/part2/rayon01_02_banane06.png" },
                    new Phaser.Math.Vector2(215, 405),
                    (scene) => scene.takeObject("banane06"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "banane07", url: "sprites/StoreScene/part2/rayon01_02_banane07.png" },
                    new Phaser.Math.Vector2(205, 395),
                    (scene) => scene.takeObject("banane07"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "banane08", url: "sprites/StoreScene/part2/rayon01_02_banane08.png" },
                    new Phaser.Math.Vector2(259, 398),
                    (scene) => scene.takeObject("banane08"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain01", url: "sprites/StoreScene/part2/rayon01_02_pain01.png" },
                    new Phaser.Math.Vector2(-471, 182),
                    (scene) => scene.takeObject("pain01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain02", url: "sprites/StoreScene/part2/rayon01_02_pain02.png" },
                    new Phaser.Math.Vector2(-546, 174),
                    (scene) => scene.takeObject("pain02"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain03", url: "sprites/StoreScene/part2/rayon01_02_pain03.png" },
                    new Phaser.Math.Vector2(5, 447),
                    (scene) => scene.takeObject("pain03"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain04", url: "sprites/StoreScene/part2/rayon01_02_pain04.png" },
                    new Phaser.Math.Vector2(23, 192),
                    (scene) => scene.takeObject("pain04"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain05", url: "sprites/StoreScene/part2/rayon01_02_pain05.png" },
                    new Phaser.Math.Vector2(-507, 439),
                    (scene) => scene.takeObject("pain05"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain06", url: "sprites/StoreScene/part2/rayon01_02_pain06.png" },
                    new Phaser.Math.Vector2(-83, 182),
                    (scene) => scene.takeObject("pain06"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain07", url: "sprites/StoreScene/part2/rayon01_02_pain07.png" },
                    new Phaser.Math.Vector2(-230, 177),
                    (scene) => scene.takeObject("pain07"),
                    this
                ),

                new CardObject(
                    this,
                    { name: "pain08", url: "sprites/StoreScene/part2/rayon01_02_pain08.png" },
                    new Phaser.Math.Vector2(-340, 174),
                    (scene) => scene.takeObject("pain08"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain09", url: "sprites/StoreScene/part2/rayon01_02_pain09.png" },
                    new Phaser.Math.Vector2(-8, -63),
                    (scene) => scene.takeObject("pain09"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain10", url: "sprites/StoreScene/part2/rayon01_02_pain10.png" },
                    new Phaser.Math.Vector2(-181, -63),
                    (scene) => scene.takeObject("pain10"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain11", url: "sprites/StoreScene/part2/rayon01_02_pain11.png" },
                    new Phaser.Math.Vector2(-134, -63),
                    (scene) => scene.takeObject("pain11"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain12", url: "sprites/StoreScene/part2/rayon01_02_pain12.png" },
                    new Phaser.Math.Vector2(-276, -60),
                    (scene) => scene.takeObject("pain12"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain13", url: "sprites/StoreScene/part2/rayon01_02_pain13.png" },
                    new Phaser.Math.Vector2(-415, -65),
                    (scene) => scene.takeObject("pain13"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain14", url: "sprites/StoreScene/part2/rayon01_02_pain14.png" },
                    new Phaser.Math.Vector2(7, -340),
                    (scene) => scene.takeObject("pain14"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain15", url: "sprites/StoreScene/part2/rayon01_02_pain15.png" },
                    new Phaser.Math.Vector2(-65, -338),
                    (scene) => scene.takeObject("pain15"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain16", url: "sprites/StoreScene/part2/rayon01_02_pain16.png" },
                    new Phaser.Math.Vector2(-142, -346),
                    (scene) => scene.takeObject("pain16"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain17", url: "sprites/StoreScene/part2/rayon01_02_pain17.png" },
                    new Phaser.Math.Vector2(-250, -340),
                    (scene) => scene.takeObject("pain17"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain18", url: "sprites/StoreScene/part2/rayon01_02_pain18.png" },
                    new Phaser.Math.Vector2(-410, -346),
                    (scene) => scene.takeObject("pain18"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain19", url: "sprites/StoreScene/part2/rayon01_02_pain19.png" },
                    new Phaser.Math.Vector2(-209, -585),
                    (scene) => scene.takeObject("pain19"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pain20", url: "sprites/StoreScene/part2/rayon01_02_pain20.png" },
                    new Phaser.Math.Vector2(-98, -587),
                    (scene) => scene.takeObject("pain20"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pomme01", url: "sprites/StoreScene/part2/rayon01_02_pomme01.png" },
                    new Phaser.Math.Vector2(300, 125),
                    (scene) => scene.takeObject("pomme01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pomme02", url: "sprites/StoreScene/part2/rayon01_02_pomme02.png" },
                    new Phaser.Math.Vector2(244, 128),
                    (scene) => scene.takeObject("pomme02"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pomme03", url: "sprites/StoreScene/part2/rayon01_02_pomme03.png" },
                    new Phaser.Math.Vector2(221, 110),
                    (scene) => scene.takeObject("pomme03"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pomme04", url: "sprites/StoreScene/part2/rayon01_02_pomme04.png" },
                    new Phaser.Math.Vector2(200, 115),
                    (scene) => scene.takeObject("pomme04"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pomme05", url: "sprites/StoreScene/part2/rayon01_02_pomme05.png" },
                    new Phaser.Math.Vector2(230, 120),
                    (scene) => scene.takeObject("pomme05"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "pomme06", url: "sprites/StoreScene/part2/rayon01_02_pomme06.png" },
                    new Phaser.Math.Vector2(208, 122),
                    (scene) => scene.takeObject("pomme06"),
                    this
                )
            ]
        );

        this.thirdShelf = new Card(
            this,
            [
                new Background(
                    this,
                    "sprites/StoreScene/part3/rayon03_01_rayonnage.jpg",
                    "storeBg3"
                ),
                new CardObject(
                    this,
                    { name: "lessive01", url: "sprites/StoreScene/part3/rayon03_03_lessive01.png" },
                    new Phaser.Math.Vector2(-343, -379),
                    (scene) => scene.takeObject("lessive01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "lessive02", url: "sprites/StoreScene/part3/rayon03_03_lessive02.png" },
                    new Phaser.Math.Vector2(-268, -379),
                    (scene) => scene.takeObject("lessive02"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "lessive03", url: "sprites/StoreScene/part3/rayon03_03_lessive03.png" },
                    new Phaser.Math.Vector2(-199, -379),
                    (scene) => scene.takeObject("lessive03"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "lessive04", url: "sprites/StoreScene/part3/rayon03_03_lessive04.png" },
                    new Phaser.Math.Vector2(-137, -382),
                    (scene) => scene.takeObject("lessive04"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "lessive05", url: "sprites/StoreScene/part3/rayon03_03_lessive05.png" },
                    new Phaser.Math.Vector2(-11, -376),
                    (scene) => scene.takeObject("lessive05"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "lessive06", url: "sprites/StoreScene/part3/rayon03_03_lessive06.png" },
                    new Phaser.Math.Vector2(89, -382),
                    (scene) => scene.takeObject("lessive06"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "lessive07", url: "sprites/StoreScene/part3/rayon03_03_lessive07.png" },
                    new Phaser.Math.Vector2(177, -379),
                    (scene) => scene.takeObject("lessive07"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "lessive08", url: "sprites/StoreScene/part3/rayon03_03_lessive08.png" },
                    new Phaser.Math.Vector2(270, -382),
                    (scene) => scene.takeObject("lessive08"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "lessive09", url: "sprites/StoreScene/part3/rayon03_03_lessive09.png" },
                    new Phaser.Math.Vector2(-235, -652),
                    (scene) => scene.takeObject("lessive09"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "lessive10", url: "sprites/StoreScene/part3/rayon03_03_lessive10.png" },
                    new Phaser.Math.Vector2(-109, -652),
                    (scene) => scene.takeObject("lessive10"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "lessive11", url: "sprites/StoreScene/part3/rayon03_03_lessive11.png" },
                    new Phaser.Math.Vector2(2, -654),
                    (scene) => scene.takeObject("lessive11"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "lessive12", url: "sprites/StoreScene/part3/rayon03_03_lessive12.png" },
                    new Phaser.Math.Vector2(133, -652),
                    (scene) => scene.takeObject("lessive12"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier01", url: "sprites/StoreScene/part3/rayon03_03_papier01.png" },
                    new Phaser.Math.Vector2(491, 395),
                    (scene) => scene.takeObject("papier01"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier02", url: "sprites/StoreScene/part3/rayon03_03_papier02.png" },
                    new Phaser.Math.Vector2(215, 393),
                    (scene) => scene.takeObject("papier02"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier03", url: "sprites/StoreScene/part3/rayon03_03_papier03.png" },
                    new Phaser.Math.Vector2(-57, 393),
                    (scene) => scene.takeObject("papier03"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier04", url: "sprites/StoreScene/part3/rayon03_03_papier04.png" },
                    new Phaser.Math.Vector2(480, 138),
                    (scene) => scene.takeObject("papier04"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier05", url: "sprites/StoreScene/part3/rayon03_03_papier05.png" },
                    new Phaser.Math.Vector2(203, 138),
                    (scene) => scene.takeObject("papier05"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier06", url: "sprites/StoreScene/part3/rayon03_03_papier06.png" },
                    new Phaser.Math.Vector2(-62, 135),
                    (scene) => scene.takeObject("papier06"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier07", url: "sprites/StoreScene/part3/rayon03_03_papier07.png" },
                    new Phaser.Math.Vector2(-312, 135),
                    (scene) => scene.takeObject("papier07"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier08", url: "sprites/StoreScene/part3/rayon03_03_papier08.png" },
                    new Phaser.Math.Vector2(-479, -106),
                    (scene) => scene.takeObject("papier08"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier09", url: "sprites/StoreScene/part3/rayon03_03_papier09.png" },
                    new Phaser.Math.Vector2(-302, -106),
                    (scene) => scene.takeObject("papier09"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier10", url: "sprites/StoreScene/part3/rayon03_03_papier10.png" },
                    new Phaser.Math.Vector2(-39, -114),
                    (scene) => scene.takeObject("papier10"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier11", url: "sprites/StoreScene/part3/rayon03_03_papier11.png" },
                    new Phaser.Math.Vector2(159, -111),
                    (scene) => scene.takeObject("papier11"),
                    this
                ),
                new CardObject(
                    this,
                    { name: "papier12", url: "sprites/StoreScene/part3/rayon03_03_papier12.png" },
                    new Phaser.Math.Vector2(401, -111),
                    (scene) => scene.takeObject("papier12"),
                    this
                )
            ]
        );

        this.checklist_done = {
            'pate': {
                position_x: -0.23, // Will be multiplied by this.cameras.main.width (<= 1200px). Calculation for -0.23: (-276 / 1200)
                position_y: 234,
                done: false
            },
            'banane': {
                position_x: -0.23,
                position_y: 280,
                done: false
            },
            'pain': {
                position_x: -0.23,
                position_y: 373,
                done: false
            },
            'papier': {
                position_x: -0.23,
                position_y: 422,
                done: false
            },
        };

        this.cards = [
            this.firstShelf,
            this.secondShelf,
            this.thirdShelf
        ];

        //Keep track of wich card is displayed
        this.cardIdx = StoreCards.FIRST_SHELF;
        this.current_card = this.firstShelf;

        this.month = Months.MARCH;
    }

    init(data) {
        //Check if any saved data exists
        if(data) {
            console.log("INIT_STORE");
            console.log(this.shoppingBasket); // contains shoppingBasket

            if(data.month === Months.MARCH) {
                this.month = Months.MARCH;
            } else if(data.month === Months.MAY) {
                this.month = Months.MAY;
            }
            /*
                @TODO:
                - is it Patrick or Damien?
                - if Damien: remove sprites by name using indepShoppingBasket
            */
        }
    }

    preload() {
        //Preload all of the cards
        this.cards.forEach(card => card.preload());

        // Sprites for the whole scene (all 3 cards)
        this.load.image('liste', "sprites/StoreScene/part1/rayon01_04_liste.png");
        this.load.image('basket', "sprites/StoreScene/part1/rayon01_02_panier.png");
        this.load.image('basket-front', "sprites/StoreScene/part1/rayon01_02_panier-02front.png");

        this.load.image('rature', "sprites/StoreScene/part1/rayon01_05_rature.png");

        //Load in the music
        this.load.audio('bg_music', 'sounds/supermarket/Supermarket.mp3');

        this.nextCardArrow = this.load.spritesheet(
            'next-card-arrow',
            'sprites/StoreScene/part1/rayon01_06-rayonsuivant-spritesheet_100x100.png',
            { frameWidth: 100, frameHeight: 100 }
        );
    }

    addArrow() {
        // Create arrow sprites
        this.anims.create({
            key: 'next-card-anim',
            frameRate: 15,
            frames: this.anims.generateFrameNames('next-card-arrow'),
            repeat: -1
        });

        // Position relative to scene width
        this.nextCardButton = this.add.sprite(
            this.cameras.main.width * 0.39,
            120,
            'next-card-arrow'
        ).play('next-card-anim');

        this.nextCardButton.depth = 4;

        let scene = this;
        this.nextCardButton.setInteractive().on('pointerdown', () => scene.nextCard() );
    }

    takeObject(object_name) {

        this.shoppingBasket.push(object_name);

        let object = this.children.getByName(object_name);
        object.depth = 5;

        let yDistance = this.basket.y - object.y; // between 280 and 1340

        let target_objects = [object];
        if(object_name === 'pate_spaghetti01') {
            // also move the other pack
            target_objects.push(this.children.getByName('pate_spaghetti02'));
            this.shoppingBasket.push('pate_spaghetti02');
        }

        // Move to basket
        this.tweens.add({
            targets: target_objects,
            x: this.basket.x + (Math.random() * 50),
            y: this.basket.y + 25 + (Math.random() * 25),
            duration: 150 + (yDistance / 8),
            ease: 'Quadratic',
            yoyo: false,
            loop: 0,
            onComplete: () => {
                // this.rature = this.add.image(this.listPositions[object_name], 'rature')
                // todo: add flag
                for (const item in this.checklist_done) {
                    if(object_name.indexOf(item) >= 0) {
                        if(!this.checklist_done[item].done) {
                            this.rature = this.add.image(
                                this.cameras.main.width * this.checklist_done[item].position_x,
                                this.checklist_done[item].position_y,
                                'rature'
                            );

                            this.rature.depth = 20;
                            this.checklist_done[item].done = true;
                        }
                    }
                }

                // Animate basket
                this.tweens.add({
                    targets: [this.basket, this.basket_front],
                    scale: 1.2,
                    duration: 100,
                    ease: 'Quadratic',
                    yoyo: true,
                    loop: 0
                });
            },
            onCompleteScope: this
        });
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);

        if(this.current_card.isLoaded()) {
            this.current_card.create();
            this.addArrow();
        }

        this.checklist = this.add.image(this.cameras.main.width * -0.255, 489, 'liste');
        this.checklist.depth = 20;

        this.basket = this.add.image(this.cameras.main.width * 0.24166, 700, 'basket');
        this.basket.depth = 4;

        this.basket_front = this.add.image(this.cameras.main.width * 0.24166, 700, 'basket-front');
        this.basket_front.depth = 25;

        //Create and play the background music
        this.music = this.sound.add('bg_music');
        this.music.play({loop: true});

        // Update the saved data
        player.cur_scene = Scenes.STORE;
        player.saveGame();
    }

    nextCard() {
        if(this.cardIdx < this.cards.length - 1) {

            // move previous card
            let container = this.add.container();
            container.depth = 2;

            for(let i in this.current_card.children) {
                if(this.current_card.children[i].sprite.depth != 5) {
                    container.add(this.current_card.children[i].sprite);
                }
            }

            this.tweens.add({
                targets: container,
                x: -1200,
                duration: 500,
                ease: 'Quadratic',
                yoyo: false,
                loop: 0
            });

            this.cardIdx++;
            this.current_card = this.cards[this.cardIdx];
            this.current_card.create();
        } else {
            this.nextCardButton.destroy();
            this.tweens.add({
                targets:  this.music,
                volume:   0,
                duration: 800,
                onComplete: () => {
                    // TODO: if current character is Patrick
                    player.setData({ indepShoppingBasket: this.shoppingBasket });
                    player.saveGame();
                    player.sendChoices({ player_id: player.id, freelancer_food_set: this.shoppingBasket.join(','), freelancer_food_amount: this.shoppingBasket.length });
                    this.nextScene();
                },
                onCompleteScope: this
            });
        }
    }

    nextScene() {
        this.music.stop();
        if(this.month === Months.MARCH) {
            this.scene.start(Scenes.HALLWAY, {cardIdx: HallwayCards.INDEP_GRANDMA, damien_gone: false});
        } else {
            this.scene.start(Scenes.END_SCENE);
        }
    }
}
