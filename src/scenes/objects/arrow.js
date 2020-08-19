import Phaser from "phaser";

/**
 * @brief Models any arrow of any scene
 */
export class Arrow {
  /**
   * @brief Constructs the arrow of a given scene
   * @param {Phaser.Scene} parent_scene the scene in which the background is contained
   */
  constructor(parent_scene, position) {
      //Initilaize attributes
      this.parent_scene = parent_scene;
      this.position = position;
  }

  /**
   * @brief Loads the background image from memory
   */
  preload() {
      this.parent_scene.load.image('arrow', 'sprites/StoreScene/part1/rayon01_06-rayonsuivant-spritesheet_100x100.png');
  }

  /**
   * @brief Creates and places the arrow image in the scene
   */
  show(interaction) {
      this.sprite = this.parent_scene.add.image(this.position.x, this.position.y, 'arrow');

      this.parent_scene.anims.create({
          key: 'arrow-anim',
          frameRate: 15,
          frames: this.anims.generateFrameNames('arrow'),
          repeat: -1
      });

      this.nextCardButton.setInteractive().on('pointerdown', () => console.log('arrow'), this.parent_scene );
  }
}
