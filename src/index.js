import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import './style.scss';

import {IntroScene} from "./scenes/introScene.js";
import {Scene1} from "./scenes/scene1.js";
import {Scene2} from "./scenes/scene2.js";


const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		width: 640,
		height: 960
	},
  plugins: {
      scene: [{
          key: 'rexUI',
          plugin: RexUIPlugin,
          mapping: 'rexUI'
      }]
  },
  scene: [IntroScene, Scene1, Scene2],
  physics: {
    default: 'arcade'
  }
};

const game = new Phaser.Game(config);