import Phaser from "phaser";

export class Player {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.plugged = false;
  }
  
  didPlug() {
    this.plugged = true;
  }
  
  reset(x, y) {
    this.plugged = false;
    this.x = x;
    this.y = y;
    if(this.sprite){
      this.sprite.x = 50;
      this.sprite.y = y * 100 + 50;
      this.sprite.alpha = 1;
    }
  }
}