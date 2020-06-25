import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import DebugObjects from './plugins/debugObjects.js';
import './style.scss';

import {IntroScene} from "./scenes/introScene.js";
import {ProtoScene} from "./scenes/protoScene.js";
// import Boot from './scenes/boot.js';

let plugins = [{
    key: 'rexUI',
    plugin: RexUIPlugin,
    mapping: 'rexUI'
}];
const consoleSeemsOpen = false; //window.outerHeight - window.innerHeight > 200;
if(consoleSeemsOpen === true){
  plugins.push({
    key: 'debugObjects',
    plugin: DebugObjects,
    mapping: 'debugObjects'
  });
}


let width = window.innerWidth * window.devicePixelRatio;
let height = window.innerHeight;
let ratio = width / height;

// Game Config reference: https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    // maxWidth: window.innerWidth,
    // resolution: 1 par defaut, on peut tester 2 sur Retina
    scale: {
      mode: Phaser.Scale.ENVELOP,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      height: 2732,
      width: 2048,
      /*min: {
        height: 2732,
        width: 2000
      }*/
    },
    plugins: {
        scene: plugins
    },
    scene: [ProtoScene],
    physics: {
        default: 'arcade'
    }
};

const game = new Phaser.Game(config);
