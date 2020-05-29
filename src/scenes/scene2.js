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

export class Scene2 extends Phaser.Scene {
  constructor(){
    super({ key: 'Scene2' });
  }
  
  preload() {
    
    // Tiled level
    this.load.tilemapTiledJSON('lvl1', 'levels/sample_level.json');
    
    // Level tiles
    this.load.image('Tiles', 'sprites/Tiles.png');
    
    // character sprites
    this.load.spritesheet('anime-red', 'sprites/animeRed.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('anime-blue', 'sprites/animeBlue.png', { frameWidth: 100, frameHeight: 100 });
    
    // trapped anim
    this.load.spritesheet('trap-red', 'sprites/chocRed.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('trap-blue', 'sprites/chocBlue.png', { frameWidth: 100, frameHeight: 100 });
    
    // not plugged death anim
    this.load.spritesheet('notPlugged-red', 'sprites/mortRed.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('notPlugged-blue', 'sprites/mortBlue.png', { frameWidth: 100, frameHeight: 100 });
    
    this.load.image('red', 'sprites/red.png');
    this.load.image('blue', 'sprites/blue.png');
    this.load.image('background', 'sprites/background.png');
    this.load.image('winMessage', 'sprites/win-message.png');

    // sound
    // this.load.audio('music', [ 'sound/game_jam_v2.mp3' ]);
    
    this.load.audio('up', [ 'sound/up.wav' ]);
    this.load.audio('move', [ 'sound/deplacement.wav' ]);
    this.load.audio('trap', [ 'sound/decharge.wav' ]);
    this.load.audio('end', [ 'sound/fin.wav' ]);
    this.load.audio('switch', [ 'sound/interupteur.wav' ]);
    this.load.audio('death', [ 'sound/mort.wav' ]);
    
    
    this.tweenTimeout = null;
    this.eventTimeout = null;
  }

  loadLevel(){
    updatedLevels = [];
    this.map = this.make.tilemap({ key: `lvl1` });
    let tileset = this.map.addTilesetImage('Tiles');
    let layerCollision = this.map.createStaticLayer('Collision', tileset, 0, 0);
    this.layerEvent = this.map.createDynamicLayer('Event', tileset, 0, 0);
    let layerFloor = this.map.createStaticLayer('Floor', tileset, 0, 0);

    layerCollision.depth = -10;
    this.layerEvent.depth = -5;
    
    // for objects:
    // const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
  }
  
  resetLevel(){
    this.map.removeAllLayers(); 
    this.loadLevel();
  }

  create() {
    this.scene.remove('Scene1');
    
    this.add.text(200, 20, "Scene 2", {
        fontSize: '24px'
    })

    const background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
    background.alpha = 0.5;
    background.depth = -15;
        
    this.loadLevel()

    // Sound FX
    this.moveSound = this.sound.add('move');
    this.upSound = this.sound.add('up');
    
    this.trapSound = this.sound.add('trap');
    this.endSound = this.sound.add('end');
    this.switchSound = this.sound.add('switch');
    this.deathSound = this.sound.add('death');

    // Music
    //this.music = this.sound.add('music', {loop: true});
    //if(!debug) this.music.play();
    
    // Add characters
    this.redPlayer = new Player(0, 2, 'Red');
    this.redPlayer.sprite = this.add.sprite(50, 250, 'red');;
    
    this.bluePlayer = new Player(0, 3, 'Blue');
    this.bluePlayer.sprite = this.add.sprite(50, 350, 'blue');
    
    // Listen to events
    let scene = this;
    this.input.keyboard.on('keydown', function(e){
      scene.keyDown(e);
    });
    
    // swipe
    this.input.on('pointerdown', function(e){
      scene.pointerDown(e);
     });
    this.input.on('pointerup', function(e){
      scene.pointerUp(e);
    });
  }
  
  deathEvent(target){
    // death anim
    // console.log('--- death event for' + target.name + ' ---')
    this.deathSound.play();
    
    let anim;
    if(target.name === 'Red'){
      this.anims.create({ key: 'notPlugged',  frameRate: 12, frames: this.anims.generateFrameNames('notPlugged-red'), repeat: 0 });
      anim = this.add.sprite(target.sprite.x, target.sprite.y, 'notPlugged-red').play('notPlugged');
    } else {
      this.anims.create({ key: 'notPlugged',  frameRate: 12, frames: this.anims.generateFrameNames('notPlugged-blue'), repeat: 0 });
      anim = this.add.sprite(target.sprite.x, target.sprite.y, 'notPlugged-blue').play('notPlugged');
    }
    target.sprite.alpha = 0;

    let scene = this;
    anim.once('animationcomplete', function(){
      console.log('complete')
      setTimeout(function(){
        if(updatedLevels.includes(currentLevel)){
          console.log('reset level')
          scene.resetLevel();
        }
        anim.destroy();
        scene.redPlayer.reset(0, 2);
        scene.bluePlayer.reset(0, 3);
      }, 800)
    }, this);
  }
  
  win(){
    const winMessage = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'winMessage'); //.setInteractive();
    let scene = this;
    listensToKeyboard = false;
  }
  
  tweenComplete(target){
    clearTimeout(this.tweenTimeout);
    let scene = this;
    this.tweenTimeout = setTimeout(function(){
      listensToKeyboard = true;
      scene.fall();
      
      scene.checkForEvents(scene.redPlayer);
      scene.checkForEvents(scene.bluePlayer);
    })
  }
  
  fall(target){
    this.attemptFall(this.redPlayer, 1);
    this.attemptFall(this.bluePlayer, -1);
  }

  move(target, xSpan, ySpan){
    if((ySpan > 0 && target.name == 'Blue') || (ySpan < 0 && target.name == 'Red') ){
      this.upSound.play();
    } else{
      this.moveSound.play();
    }
    
    target.x += xSpan;
    target.y += ySpan;
    
    listensToKeyboard = false;
    
    this.tweens.add({
      targets: target.sprite,
      x: target.sprite.x + xSpan * 100,
      y: target.sprite.y + ySpan * 100,
      duration: 800,
      ease: "Power2",
      yoyo: false,
      loop: 0,
      onComplete: this.tweenComplete.bind(this)
    });
  }
  
  showCollision(target, xSpan, ySpan){
    this.tweens.add({
      targets: target.sprite,
      x: target.sprite.x + xSpan * 20,
      y: target.sprite.y + ySpan * 10,
      duration: 100,
      ease: "Power2",
      yoyo: true,
      loop: 0
    });
  }
  
  attemptClimb(target, xSpan, ySpan){
    // console.log(target.name + ' attempts to climb')
    let resultEvent = this.map.getTileAt(target.x, target.y, false, 'Event');
    if (resultEvent !== null){
      // if ladder
      
      if(blueIsMirror){
        // “dead body” logic, blue moves if red moves
        if(resultEvent.index == 3){
          this.move(target, xSpan, ySpan);
          
          // dirty
          allowClimbing = true;
          setTimeout(function(){
            console.log('not anymore')
            allowClimbing = false;
          }, 500);
        }
        
        let scene = this;
        
        setTimeout(function(){
          if(resultEvent.index == 3 + 2 * tilesWidth){
            scene.move(target, xSpan, ySpan);

          }
        }, 200)
      }else{
        // both characters move freely
        if(resultEvent.index == 3 || resultEvent.index == 3 + 2 * tilesWidth){
          this.move(target, xSpan, ySpan);
        }     
      }
      
   }
  }
  
  attemptFall(target, ySpan){
    let resultFloor = this.map.getTileAt(target.x, target.y, false, 'Floor');
    if(resultFloor){
      // console.log('fall: floor')
      return;
    }
    let resultCollision = this.map.getTileAt(target.x, target.y + ySpan, false, 'Collision');
    if(resultCollision){
      // console.log('fall: collision')
      return;
    } else if ( (target.name == 'Red' && target.y >= 2) || (target.name == 'Blue' && target.y <= 3) ){
      // console.log('too low')
    } else {
      this.move(target, 0, ySpan);
    }
  }
  
  // nearPlug()
  
  checkForEvents(target, xSpan = 0, ySpan = 0){
    let resultEvent = this.map.getTileAt(target.x, target.y, false, 'Event');
    if (resultEvent !== null){
      // special tile
      // console.log('Event!', resultEvent.layer.name);
      // console.log(resultEvent);  
  
      if(resultEvent.index == 2 || resultEvent.index == 2 + 2 * tilesWidth){
        console.log(target.name, 'found the exit')
        target.didPlug();
        
        clearTimeout(this.eventTimeout);
        let scene = this;
        this.eventTimeout = setTimeout(function(){
          scene.win();
        }, 100);
      } else if (resultEvent.index == 6 || resultEvent.index == 6 + 2 * tilesWidth){
        // Trap
        this.trapEvent(target);
      } else if (resultEvent.index == 10){
        // Button!
        this.switchSound.play();
        this.updateLevel();
      }
    }
  }
  
  attemptMove(target, xSpan, ySpan){
    let result = this.map.getTileAt(target.x + xSpan, target.y + ySpan, false, 'Collision');
    let resultEvent = this.map.getTileAt(target.x + xSpan, target.y + ySpan, false, 'Event');
    
    if (xSpan != 0){ // horizontal movement
      
      // Out of bounds
      if(target.x + xSpan < 0 || target.x + xSpan >= 8){
        this.showCollision(target, xSpan, ySpan);
        return;
      }
      
      if(!result){
        if(blueIsMirror){ // blue only moves if red moves
          if(target.name == 'Red'){
            this.move(target, xSpan, ySpan);
            allowMove = true;
            setTimeout(function(){
              allowMove = false;
            }, 500);
          } else {
            let scene = this;
            setTimeout(function(){
              if(allowMove){
                scene.move(target, xSpan, ySpan);
              }
            }, 200);
          }
          
        } else {
          this.move(target, xSpan, ySpan);          
        }
      } else {
        // collision
        this.showCollision(target, xSpan, ySpan);
        return;
      }
    }else{
      // vertical movement
      if(!result){
        if (ySpan < 0 && target.name == 'Red'){
          this.attemptClimb(target, xSpan, ySpan);
        } else if (ySpan > 0 && target.name == 'Blue'){
          this.attemptClimb(target, xSpan, ySpan);
        }
      }else{
        this.showCollision(target, xSpan, ySpan);
      }
    }
  }
  
  pointerDown(e, scene){
    this.touchStartPosition = {x: e.x, y: e.y};
  }
  pointerUp(e, scene){
    if(!listensToKeyboard){
      return;
    }
    let deltaX = e.x - this.touchStartPosition.x;
    let deltaY = e.y - this.touchStartPosition.y;
    
    if(deltaX > 100){
      this.attemptMove(this.redPlayer, 1, 0);
      this.attemptMove(this.bluePlayer, 1, 0);
    }else  if(deltaX < -100){
      this.attemptMove(this.redPlayer, -1, 0);
      this.attemptMove(this.bluePlayer, -1, 0);
    }else if(deltaY < -100){
      this.attemptMove(this.redPlayer, 0, -1);
      this.attemptMove(this.bluePlayer, 0, 1);
    }else if(deltaY > 100){
      this.attemptMove(this.redPlayer, 0, 1);
      this.attemptMove(this.bluePlayer, 0, -1);
    }
  }
  
  keyDown(e, scene){
    if(!listensToKeyboard){
      return;
    }
    // console.log(this.redPlayer.x, this.redPlayer.y)
    if(e.key == 'ArrowRight'){
      // is next case free? If yes: go
      
      this.attemptMove(this.redPlayer, 1, 0);
      
      this.attemptMove(this.bluePlayer, 1, 0);
      
      
      // If no: stay in place
      // scene.tweens.add({
      //   targets: this.redPlayer,
      //   x: this.redPlayer.sprite.x + 20,
      //   duration: 100,
      //   ease: "Power2",
      //   yoyo: true,
      //   loop: 0
      // });
    } else if (e.key == 'ArrowLeft'){
      
      this.attemptMove(this.redPlayer, -1, 0);
      this.attemptMove(this.bluePlayer, -1, 0);
    } else if(e.key == 'ArrowUp'){
      
      this.attemptMove(this.redPlayer, 0, -1);
      this.attemptMove(this.bluePlayer, 0, 1);
      
    } else if(e.key == 'ArrowDown'){
      this.attemptMove(this.redPlayer, 0, 1);
      this.attemptMove(this.bluePlayer, 0, -1);

      // this.nextLevel();
      // scene.load.script('main-scene', 'scene.js');
    }
  }
  
}