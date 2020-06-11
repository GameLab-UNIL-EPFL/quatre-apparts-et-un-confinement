import Phaser from "phaser";

const BubbleState = {
    UP: 0,
    DOWN: 1
}

const MAX_UP = 100;
const MAX_RIGHT = 10;

export class TiredBubbles {
    constructor(parent_scene, x, y) {
        this.parent_scene = parent_scene;

        this.name = "bubbles";
        this.url = "/sprites/ProtoScene/WakeUpCard/tired_bubbles.png";

        this.cur_state = BubbleState.UP;
        this.x = x;
        this.y = y;

        //Counter for the state animation
        this.go_up = 0;
        this.go_right = 5;
        this.lr = true;
    }

    preload() {
        this.parent_scene.load.image(this.name, this.url);
    }

    create() {
        this.sprite = this.parent_scene.add.image(this.x, this.y, this.name);
    }

    update() {
        switch(this.cur_state) {
            case BubbleState.UP:
                this.sprite.y -= 0.2;
                this.go_up++;

                if(this.go_up >= MAX_UP) {
                    this.cur_state = BubbleState.DOWN;
                }
                break;
            case BubbleState.DOWN:
                this.sprite.y += 0.2;
                this.go_up--;

                if(this.go_up <= 0) {
                    this.cur_state = BubbleState.UP;
                }
                break;

            default:
                break;
        }
    }

    destroy() {
        this.sprite.destroy();
    }
} 