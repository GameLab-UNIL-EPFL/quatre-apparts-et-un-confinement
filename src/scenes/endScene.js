import Phaser from "phaser";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";

export const EndCards = {
    FIRST_SCREEN: 0,
    SECOND_SCREEN: 1
};

export class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: Scenes.END_SCENE });
        this.title = 'Merci d’avoir joué!';
    }

    init(data) {
        if (data.aboutTitle) {
            this.title = 'À propos';
        }
    }

    preload() {
        //Load the cat animation spritesheet
        this.load.spritesheet(
            'cat',
            'sprites/GrandmaScene/cat.png',
            { frameWidth: 320, frameHeight: 240 }
        );

        this.cardIdx = EndCards.FIRST_SCREEN;
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBackgroundColor("#f4e1c5");

        this.thank_you = this.add.text(
            0,
            -600,
            this.title,
            {font: 55 + "px OpenSans", fill: "#27303A"}
        );
        this.thank_you.setOrigin(0.5,0.5);

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

        let divTeam = document.createElement('div');

        divTeam.innerHTML =  `<h4>Programmation</h4>
        Andrew Dobis, Paul Ronga
        <h4>Graphisme</h4>
        Mathias Hängärtner
        <h4>Récit, conception sonore</h4>
        Saara Jones
        <h4>Gestion de projet</h4>
        Yannick Rochat, Paul Ronga</br></br>
        <p>Vos commentaires sont les bienvenus à l’adresse: <a target="_blank" href="mailto:data@letemps.ch">data@letemps.ch</a></p>`;

        divTeam.classList.add('team');

        this.divTeam = this.add.dom(0, 200, divTeam);
        this.divTeam.setOrigin(0.5, 0.5);

        this.firstScreenContainer = this.add.container();
        this.firstScreenContainer.add(this.cat_anim);
        this.firstScreenContainer.add(this.divTeam);
        this.firstScreenContainer.add(this.thank_you);

        let divRepo = document.createElement('div');
        divRepo.classList.add('repo');
        divRepo.innerHTML = `<p>Ce jeu est en licence libre, ce qui signifie que le code source, les dessins et les sons peuvent être réutilisés.
        <a target="_blank" href="https://github.com/IMI-initiative/quatre-apparts-et-un-confinement">En savoir plus</a></p>
        <h4>Organisation et soutien</h4>
        <p><a target="_blank" href="https://www.media-initiative.ch">Initiative pour l’innovation dans les médias (IMI)</a><br>
        <a target="_blank" href="https://www.letemps.ch">Le Temps</a><br>
        <a target="_blank" href="https://www.epfl.ch/schools/cdh/fr/">Collège des humanités (CDH), EPFL</a>
        <a target="_blank" href="https://wp.unil.ch/gamelab/">UNIL Gamelab</a></p>

        <h4>Un grand merci à nos testeurs</h4>
        <p>Lesli__e, Vincent, Sashiro (formule pour remercier aussi tous ceux qui préféraient ne pas être mentionnés)</p>
        `;

        this.divRepo = this.add.dom(0, -2600, divRepo);
        this.divRepo.setOrigin(0.5, 0.5);

        divTeam.addEventListener('click', () => this.nextCard(), this);
        divRepo.addEventListener('click', () => this.nextCard(), this);
        document.querySelectorAll('a').forEach((a, idx) => {
            a.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        });

        this.input.on('pointerdown', () => this.nextCard(), this);
        this.divTeam.on('pointerdown', () => this.nextCard(), this);
    }

    nextCard() {
        console.log('nextCard()');
        if(this.cardIdx === EndCards.FIRST_SCREEN) {
            this.tweens.add({
                targets: [this.firstScreenContainer],
                x: -1200,
                duration: 500,
                ease: 'Quadratic',
                yoyo: false,
                loop: 0
            });
            this.tweens.add({
                targets: [this.firstScreenContainer, this.divRepo],
                y: 0,
                duration: 500,
                ease: 'Quadratic',
                yoyo: false,
                loop: 0
            });
            this.cardIdx++;
        } else {
            this.nextScene();
        }
    }

    nextScene() {
        console.log('Go back to main menu');
        this.destroy();
        this.scene.start(Scenes.BUILDING, {
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
        });
    }

    destroy() {
        this.divRepo.destroy();
        this.divTeam.destroy();
    }

}
