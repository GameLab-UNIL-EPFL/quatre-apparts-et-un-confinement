import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import DebugObjects from './plugins/debugObjects.js';
import './style.scss';

import {IntroScene} from "./scenes/introScene.js";
import {ProtoScene} from "./scenes/protoScene.js";

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

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        height: 2732,
        //Limit the ratio to 1:1
        width: 2048
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