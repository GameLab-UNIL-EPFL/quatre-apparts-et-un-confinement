import Phaser from "phaser";
import {Player} from "../player.js";

let listensToKeyboard = true;
let currentLevel = 1;
let allowMove = false;
let allowClimbing = false;

let updatedLevels = [];

const maxLevel = 7;
const tilesWidth = 8;
const debug = false;

const blueIsMirror = false;
const goDownEnabled = true;

export class Scene1 extends Phaser.Scene {
  constructor(){
    super({ key: 'Scene1' });
  }

  preload() {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });

    // sound
    this.load.audio('music', [ 'sound/game_jam_v2.mp3' ]);
    this.load.audio('switch', [ 'sound/interrupteur.wav' ]);

    // ugly bg
    this.load.image('background', 'sprites/background.png');

    // characters
    this.load.image('character1', 'sprites/characters/test_personnage_1.png');

    this.tweenTimeout = null;
    this.eventTimeout = null;
  }

  create() {
    this.scene.remove('TitleScene');

    const background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
    background.alpha = 0.5;
    background.depth = -15;

    const character = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'character1').setInteractive();
    let theScene = this;

    character.on('pointerdown', function(){
      console.log('touch')
      theScene.tweens.add({
        targets: character,
        x: character.x + 100 * (Math.random()-1),
        y: character.y + 100 * (Math.random()-1),
        duration: 800,
        ease: "Power2",
        yoyo: false,
        loop: 0
      });
    });

    // Music
    this.music = this.sound.add('music', {loop: true});
    if(!debug) this.music.play();

    // Quick UI using rexUI plugin
    // Example from: https://codepen.io/rexrainbow/pen/ePoRVz
    let createLabel = function (scene, text, backgroundColor) {
        return scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x6a4f4b),

            text: scene.add.text(0, 0, text, {
                fontSize: '24px'
            }),

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        });
    }

    this.add.text(20, 20, "Scene 1", {
        fontSize: '24px'
    });

    let dialog = this.rexUI.add.dialog({
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY,

      background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x3e2723),

      title: this.rexUI.add.label({
          background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x1e0000),
          text: this.add.text(0, 0, 'Aimez-vous cette couleur?', {
              fontSize: '24px'
          }),
          space: {
              left: 15,
              right: 15,
              top: 10,
              bottom: 10
          }
      }),

      content: this.add.text(0, 0, '(et cette police)', {
          fontSize: '24px'
      }),

      choices: [
          createLabel(this, 'Oui'),
          createLabel(this, 'Non'),
          createLabel(this, 'Bof')
      ],

      space: {
          title: 25,
          content: 25,
          choice: 15,

          left: 25,
          right: 25,
          top: 25,
          bottom: 25,
      },

      expand: {
          content: false,  // Content is a pure text object
      }
    })
    .layout()
    //.drawBounds(this.add.graphics(), 0xff0000)
    .popUp(1000);

    dialog
    .on('button.click', function (button, groupName, index) {
      this.scene.start('Scene2');
    }, this)
    .on('button.over', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle(1, 0xffffff);
    })
    .on('button.out', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle();
    });


    // Listen to events
    let scene = this;
    this.input.keyboard.on('keydown', function(e){
      scene.keyDown(e);
    });
  }

  keyDown(e, scene){
    if(!listensToKeyboard){
      return;
    }
    console.log('Key pressed:', e.key, ' // key code:', e.keyCode)
  }
}
