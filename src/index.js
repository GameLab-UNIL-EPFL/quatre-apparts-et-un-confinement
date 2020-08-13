import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import DebugObjects from './plugins/debugObjects.js';
import './style.scss';

import { TitleScene } from "./scenes/titleScene.js";
import { StudentScene } from "./scenes/studentScene.js";
import { BuildingScene } from "./scenes/buildingScene.js";
import { Player } from "./core/player.js";
import { GrandmaScene } from "./scenes/grandmaScene.js";
import { DamienComputerScene } from "./scenes/damienComputerScene.js";
import { DamienKitchenClothesScene } from "./scenes/damienKitchenClothesScene.js";
import { HallwayScene } from "./scenes/hallwayScene.js";
import { StoreScene } from "./scenes/storeScene.js";
import { IndepScene } from "./scenes/indepScene.js";
import { MotherScene } from "./scenes/motherScene.js";
import { DamienInitScene } from "./scenes/damienInitScene.js";
import { IndepMessageScene } from "./scenes/indepMessageScene.js";
import { BusScene } from "./scenes/busScene.js";
import { StoreExtScene } from "./scenes/storeExtScene.js";
import { IndepComputerScene } from "./scenes/indepComputerScene.js";
import { EndScene } from "./scenes/endScene.js";
import { DamienKitchenNoFood } from "./scenes/damienKitchenNoFoodScene.js";
import { SelectScene } from "./scenes/selectScene.js";
import { MotherKitchenScene } from "./scenes/motherKitchenScene.js";
import { StatsScene } from "./scenes/statsScene.js";
import { MotherCouchScene } from "./scenes/motherCouchScene.js";
import { DamienOutsideScene } from "./scenes/damienOutsideScene.js";
import { IndepSadHomeScene } from "./scenes/indepSadHomeScene.js";
import { DamienEndMessageScene } from "./scenes/damienEndMessageScene.js";

let resizeTimeout;
const plugins = [{
    key: 'rexUI',
    plugin: RexUIPlugin,
    mapping: 'rexUI'
}];

const OBJECT_DEBUG = false;

if(OBJECT_DEBUG === true) {
    plugins.push({
        key: 'debugObjects',
        plugin: DebugObjects,
        mapping: 'debugObjects'
    });
}

/*
  What we want:
  * target ratio of ~0.75 (iPad Pro 3rd gen)
  * scene height controls width
  * BUT: scene width shouldn't be cropped beyond a 0.45 ratio
*/

function getScale(innerWidth, innerHeight) {
    const innerRatio = innerWidth / innerHeight;
    const height = 1600; // default height
    let width = 1200; // default width
    const targetRatio = width / height;
    // Initial targeted ratio: 0.45
    const minRatio = 0.51;

    if(innerRatio < targetRatio) {
        if(innerRatio >= minRatio) {
            width = Math.round(innerRatio * height);
        } else {
            width = Math.round(minRatio * height);
        }
    }
    return { width: width, height: height, ratio: innerRatio };
}

export const scale = getScale(window.innerWidth, window.innerHeight);

// Game Config reference: https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
const config = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: 1, // we could use 2 for Retina
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: scale.width,
        height: scale.height
    },
    parent: 'container',
    dom: {
        createContainer: true
    },
    plugins: {
        scene: plugins
    },
    scene: [
        TitleScene,
        SelectScene,
        BuildingScene,
        BusScene,
        StudentScene,
        DamienInitScene,
        DamienKitchenClothesScene,
        DamienComputerScene,
        DamienKitchenNoFood,
        DamienOutsideScene,
        DamienEndMessageScene,
        GrandmaScene,
        HallwayScene,
        IndepScene,
        IndepMessageScene,
        IndepComputerScene,
        IndepSadHomeScene,
        StoreScene,
        StoreExtScene,
        MotherScene,
        MotherKitchenScene,
        MotherCouchScene,
        EndScene,
        StatsScene
    ],
    physics: {
        default: 'arcade'
    }
};

export const game = new Phaser.Game(config);
export const player = new Player();

const maxPictureWidth = 1200.0;

window.horizontalOffset = (maxPictureWidth - scale.width) / 2;
window.horizontalRatio = scale.width / maxPictureWidth;

function resizeGame() {
    console.log('Resize (wip)');
    /*let newScale = getScale(window.innerWidth, window.innerHeight);
    game.scale.resize(newScale.width, newScale.height);
    window.horizontalOffset = (maxPictureWidth - newScale.width) / 2;
    window.horizontalRatio = newScale.width / maxPictureWidth;*/
}

// This resize implies we also resize scene sprites, or they’d stretch.
// As we lack of time, the fastest workaround could be to instantiate the game again, or even worse...
window.addEventListener(
    'resize',
    (_) => {
        clearTimeout(resizeTimeout);
        // todo: new function – change game width and compute a better ratio
        resizeTimeout = setTimeout(() => resizeGame(), 200);
    },
    false
);

function handleSticky(agree) {
    if(agree === true) {
        player.enableStats();
    }
    document.getElementById('sticky-container').classList.add('closed');
}
document.getElementById('stickyYes').addEventListener("click", () => handleSticky(true) );
document.getElementById('stickyNo').addEventListener("click", () => handleSticky(false) );
