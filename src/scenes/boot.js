/*
 Adapted from Quinten’s phaser-3-retina example:
 https://github.com/Quinten/phaser3-retina/blob/master/src/scenes/Boot.js
*/


class Boot extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'boot' });
    }

    create ()
    {
      console.log('boot - create')
        // more setup stuff here
        // ...
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));

        this.scene.start('Prototype');
    }

    resize ()
    {
        let w = window.innerWidth * window.devicePixelRatio;
        let h = window.innerHeight * window.devicePixelRatio;
        let game_width = w;
        let game_height = h;
        let ratio = w / h;

        if(ratio > 2){
          game_width = game_height * 1.5;
        }

        // ratio iPad pro ~= 0.75
        if(ratio < 0.7){
          // game_height = game_width * 0.7;
        }
        console.log('Resize function called; w =', w, 'h = ', h, 'ratio = ', w / h)


        // manually resize the game with the Phaser 3.16 scalemanager
        this.scale.resize(game_width * 1.5, game_height * 1.5);
        // Check which scene is active.
        for (let scene of this.scene.manager.scenes) {
            if (scene.scene.settings.active) {
                // Scale the camera
                scene.cameras.main.setViewport(0, 0, w, h);
                if (scene.resizeField) {
                    // Scale/position stuff in the scene itself with this method, that the scene must implement.
                    scene.resizeField(w, h);
                }
            }
        }
    }

}

export default Boot;
