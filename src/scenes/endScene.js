import Phaser from "phaser";
import { Scenes } from "../core/player.js";
import { WindowState, Months } from "./buildingScene.js";
import { Arrow } from "./objects/arrow.js";

export const EndCards = {
    FIRST_SCREEN: 0,
    SECOND_SCREEN: 1,
    THIRD_SCREEN: 2
};

export class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: Scenes.END_SCENE });
        this.nextCardArrow = new Arrow(this);
        this.title = 'Merci d’avoir joué!';
    }

    init(data) {
        if (data.aboutTitle) {
            this.title = 'À propos';
        }
    }

    preload() {
        this.nextCardArrow.preload();

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

        this.nextCardArrow.createAtPosition(this.cameras.main.width * 0.39, 0);
        this.nextCardArrow.show();

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

        // Play the cat animation
        this.cat_anim = this.add.sprite(
            0,
            -367,
            'cat'
        ).play('cat-tail');

        // Team
        let divTeam = document.createElement('div');
        divTeam.innerHTML =  `
        <h4>Programmation</h4>Andrew Dobis
        <h4>Graphisme</h4>Mathias Hängärtner
        <h4>Récit, Conception sonore</h4>Saara Jones
        <h4>Gestion de projet</h4>Yannick Rochat, Paul Ronga
        `;
        divTeam.classList.add('team');
        this.divTeam = this.add.dom(0, 200, divTeam);
        this.divTeam.setOrigin(0.5, 0.5);

        // Comments are welcome, repo, and partners
        let divRepo = document.createElement('div');

        divRepo.innerHTML = `
        <p>Vos commentaires sont les bienvenus à l’adresse: <a target="_blank" href="mailto:data@letemps.ch">data@letemps.ch</a></p>
        <h4>Réutilisation</h4>
        <p>Ce jeu est en licence libre, ce qui signifie que le code source, les dessins et les sons originaux (hors extraits radiophoniques) peuvent être réutilisés.
        <a target="_blank" href="https://github.com/IMI-initiative/quatre-apparts-et-un-confinement">En savoir plus</a></p>
        <h4>Organisation et soutien</h4>
        <p><a target="_blank" href="https://www.media-initiative.ch">Initiative pour l’innovation dans les médias (IMI)</a><br>
        <a target="_blank" href="https://www.letemps.ch">Le Temps</a><br>
        <a target="_blank" href="https://www.epfl.ch/schools/cdh/fr/">Collège des humanités (CDH), EPFL</a>
        <a target="_blank" href="https://wp.unil.ch/gamelab/">UNIL Gamelab</a></p>
        `;

        divRepo.classList.add('repo');
        this.secondCardDiv = this.add.dom(0, 0, divRepo);
        this.secondCardDiv.setAlpha(0);
        this.secondCardDiv.setOrigin(0.5, 0.5);

        // Thanks
        let divThanks = document.createElement('div');
        divThanks.innerHTML = `
        <p>Merci à la <a target="_blank" href="https://www.rts.ch/">RTS</a> ainsi qu’à <a target="_blank" href="https://www.srf.ch/play/tv/sendung/zwei-am-morge-tv?id=79fe1336-b513-4342-b389-001bf89b8ea2">SRF Zwei am Morge</a> pour l’utilisation d’extraits de leurs émissions.</p>
        <h4>Un grand merci à nos soutiens et testeurs</h4>
        <p>Lesli__e, Vincent, Sashiro, Sarah, Philippe, Dr. Game, Antoine Débois, et toutes les autres personnes qui nous ont aidé par leurs retours à construire cette expérience.</p>
        <p>Remerciements particuliers à Mounir Krichane (IMI) et Gaël Hürlimann (</i>Le Temps</i>).</p>
        `;
        divThanks.classList.add('thanks');
        this.thirdCardDiv = this.add.dom(0, 0, divThanks); // previously: y = -2600
        this.thirdCardDiv.setAlpha(0);
        this.thirdCardDiv.setOrigin(0.5, 0.5);

        divTeam.addEventListener('click', () => this.nextCard(), this);
        divRepo.addEventListener('click', () => this.nextCard(), this);
        divThanks.addEventListener('click', () => this.nextCard(), this);

        document.querySelectorAll('a').forEach((a, idx) => {
            a.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        });

        this.firstScreenContainer = this.add.container();
        this.firstScreenContainer.add(this.cat_anim);
        this.firstScreenContainer.add(this.divTeam);
        this.firstScreenContainer.add(this.thank_you);


        this.nextCardArrow.sprite.on('pointerdown',
          () => {
            this.nextCard();
            this.nextCardArrow.animate();
          }, this);

    }

    nextCard() {
        let target_a, target_b;
        if(this.cardIdx === EndCards.FIRST_SCREEN) {
            target_a = this.firstScreenContainer;
            target_b = this.secondCardDiv;
        } else {
            target_a = this.secondCardDiv;
            target_b = this.thirdCardDiv;
        }
        if(this.cardIdx < 2) {
            let timeline = this.tweens.createTimeline();
            let fadeDuration = 500;
            timeline.add({
                targets: target_a,
                alpha: 0,
                duration: fadeDuration
            });
            timeline.add({
                  targets: target_b,
                  alpha: 1,
                  duration: fadeDuration
              });

            timeline.play();

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
        this.firstScreenContainer.destroy();
        this.secondCardDiv.destroy();
        this.thirdCardDiv.destroy();
    }

}
