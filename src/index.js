import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import DebugObjects from './plugins/debugObjects.js';
import './style.scss';

import { IntroScene } from "./scenes/introScene.js";
import { ProtoScene } from "./scenes/protoScene.js";
import { BuildingScene } from "./scenes/buildingScene.js";
import { Player } from "./core/player.js";

let resizeTimeout;
let plugins = [{
    key: 'rexUI',
    plugin: RexUIPlugin,
    mapping: 'rexUI'
}];
const consoleSeemsOpen = window.outerHeight - window.innerHeight > 200;
if(consoleSeemsOpen === true){
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

function getScale(innerWidth, innerHeight){
  let innerRatio = innerWidth / innerHeight;
  const height = 2732; // default height
  let width = 2048; // default width
  const targetRatio = width / height;
  const minRatio = 0.45;


  if(innerRatio < targetRatio){
    if(innerRatio >= minRatio){
      width = Math.round(innerRatio * height);
    } else {
      width = Math.round(minRatio * height);
    }
  }
  return {width: width, height: height};
}
const scale = getScale(window.innerWidth, window.innerHeight);

// Game Config reference: https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
const config = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: 1, // we could use 2 for Retina
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: scale.width,
      height: scale.height
    },
    plugins: {
        scene: plugins
    },
    scene: [BuildingScene, ProtoScene],
    physics: {
        default: 'arcade'
    }
};

// @TODO: a clean resize. Implies some changes in scene classes
/*
window.addEventListener('resize', function (event) {
  clearTimeout(resize);
  resize = setTimeout(function(){
    let newScale = getScale(window.innerWidth, window.innerHeight);
    if(newScale.width !== game.scale.width || newScale.height !== game.scale.height){
      console.log('Resize:', newScale);
      game.scale.resize(newScale.width, newScale.height);
      game.horizontalRatio = maxPictureWidth / newScale.width;
    }else{
      console.log('No resize: same scale')
    }
  }, 200);
}, false);
*/

export const game = new Phaser.Game(config);
export const player = new Player();

//Load the game
player.loadGame();

// We’re about to change picture width (1365 pixels wide)
const maxPictureWidth = 2048;

// si on veut le stocker dans game
game.horizontalRatio = scale.width / maxPictureWidth;

// ou betement dans window (puisque le jeu met du temps à s’instancier)
window.horizontalRatio = scale.width / maxPictureWidth;

// This resize implies we also resize scene sprites, or they’d stretch.
// As we lack of time, the fastest workaround could be to instantiate the game again, or even worse...
window.addEventListener('resize', function (event) {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function(){
    // Let’s pretend it was for debug and we forgot
    location.reload();
  }, 200);
}, false);
