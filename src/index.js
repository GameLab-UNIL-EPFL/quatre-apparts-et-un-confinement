import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import DebugObjects from './plugins/debugObjects.js';
import './style.scss';

import { ProtoScene } from "./scenes/protoScene.js";
import { BuildingScene } from "./scenes/buildingScene.js";
import { Player } from "./core/player.js";
import { GrandmaScene } from "./scenes/grandmaScene.js";
import { DamienComputerScene } from "./scenes/damienComputerScene.js";
import { DamienKitchenClothesScene } from "./scenes/damienKitchenClothesScene.js";

let resizeTimeout;
let plugins = [{
    key: 'rexUI',
    plugin: RexUIPlugin,
    mapping: 'rexUI'
}];
const OBJECT_DEBUG = false;
if(OBJECT_DEBUG === true){
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
    let innerRatio = innerWidth / innerHeight;
    const height = 1600; // default height
    let width = 1200; // default width
    const targetRatio = width / height;
    const minRatio = 0.45;

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
    plugins: {
        scene: plugins
    },
    scene: [
      BuildingScene,
      ProtoScene,
      DamienKitchenClothesScene,
      DamienComputerScene,
      GrandmaScene
    ],
    physics: {
        default: 'arcade'
    }
};

export const game = new Phaser.Game(config);
export const player = new Player();

// We’re about to change picture width (1365 pixels wide)
const maxPictureWidth = 1200.0;

// si on veut le stocker dans game
game.horizontalRatio = scale.width / maxPictureWidth;

// ou betement dans window (puisque le jeu met du temps à s’instancier)
window.horizontalOffset = (maxPictureWidth - scale.width) / 2;
window.horizontalRatio = scale.width / maxPictureWidth;

function resizeGame(){
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
