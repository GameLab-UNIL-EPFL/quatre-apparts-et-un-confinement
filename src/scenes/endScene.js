import Phaser from "phaser";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";

export class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: Scenes.END_SCENE });
    }

    preload() {
        //Load the cat animation spritesheet
        this.load.spritesheet(
            'cat',
            'sprites/GrandmaScene/cat.png',
            { frameWidth: 320, frameHeight: 240 }
        );
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBackgroundColor("#f4e1c5");

        // Create cat sprites
        this.anims.create({
            key: 'cat-tail',
            frameRate: 15,
            frames: this.anims.generateFrameNames('cat'),
            repeat: -1
        });

        //Play the cat animation
        this.cat_anim = this.add.sprite(
            0,
            -367,
            'cat'
        ).play('cat-tail');

        let divRepo = document.createElement('div');
        // divRepo.style = '';
        divRepo.classList.add('repo');
        divRepo.innerHTML = 'Ce jeu est en licence libre, ce qui signifie que le code source, les dessins et les sons peuvent être réutilisés. <a target="_blank" href="https://github.com/IMI-initiative/quatre-apparts-et-un-confinement">En savoir plus</a> <br> <br> Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller? Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller?  Ici peut-être qu’on a moyen de mettre du texte dans lequel on peut scroller? ';

        this.add.dom(0, 1000, divRepo);

        //Add name text
        this.text = this.add.text(
            0,
            -600,
            "Merci d'avoir joué !",
            {font: 55 + "px OpenSans", fill: "#27303A"}
        );

        this.text.setOrigin(0.5,0.5);

        this.input.on('pointerdown', () => this.nextScene(), this);
    }

    nextScene() {
        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.BUILDING, {
                mainMenu: true,
                names: {
                    damien: false,
                    grandma: false,
                    family: false,
                    indep: false
                },
                stage: 1,
                windows: {
                    damien: WindowState.OFF,
                    grandma: WindowState.OFF,
                    family: WindowState.OFF,
                    indep: WindowState.OFF
                },
                month: Months.MARCH,
                nextScene: {
                    damien: null,
                    grandma: null,
                    family: null,
                    indep: null
                }
            }),
            this
        );
    }

    destroy() {
        this.text.destroy();
        this.cat_anim.destroy();
    }

}
