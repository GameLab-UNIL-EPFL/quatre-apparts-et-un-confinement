import Phaser from "phaser";
import { Scenes } from "../core/player.js";
import { DialogueController } from "../core/dialogueController.js";
import { Card } from "./cards/card.js";
import { Background } from "./objects/background.js";
import { CardObject } from "./objects/cardObject.js";

const DamienOutsideCards = {
    IDLE: 0,
    MESSAGE: 1
};

export class DamienOutsideScene extends Phaser.Scene {
    constructor() {
        super({ key: Scenes.DAMIEN_OUTSIDE });

        this.dialogue = new DialogueController(this, "damienDialogApril");

        this.outside_idle_card = new Card(
            this,
            [
                new Background(
                    this,
                    'sprites/StoreScene/damien-outside/ext-magasin01_01-bkg.jpg',
                    'damien_outside_bg'
                ),
                new CardObject(
                    this,
                    { name: 'damien_outside_damien', url: 'sprites/StoreScene/damien-outside/ext-magasin01_02-damien.png' },
                    new Phaser.Math.Vector2(-106, 172),
                    () => this.nextCard(),
                    null,
                    -1,
                    { 
                        name: 'damien_outside_phone_h',
                        url: 'sprites/StoreScene/damien-outside/ext-magasin01_05-telephone-spritesheet.png',
                        size: { frameWidth: 300, frameHeight: 140 },
                        pos: new Phaser.Math.Vector2(75, 120)
                    }
                )
            ]
        );

        this.outside_message_card = new Card(
            this,
            [
                new Background(
                    this,
                    'sprites/StoreScene/damien-outside/ext-magasin01_03-bkgtelephone.png',
                    'damien_outside_bg_message'
                ),
                new CardObject(
                    this,
                    { name: 'damien_outside_phone_frame', url: 'sprites/StoreScene/damien-outside/ext-magasin01_04-telephone.png' },
                    new Phaser.Math.Vector2(-1, 293)
                )
            ]
        );

        this.cards = [
            this.outside_idle_card,
            this.outside_message_card
        ];

        this.current_card = this.outside_idle_card;
        this.cardIdx = DamienOutsideCards.IDLE;
    }

    preload() {
        this.dialogue.preload();
        this.dialogue.preloadMessages();

        this.cards.forEach(card => card.preload());
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(1000);

        if(this.current_card.isLoaded()) {
            this.current_card.create();
        }

        //Show the dialogue
        this.dialogue.display("Natel");
    }

    notifyDialogueEnd() {
    }

    nextCard() {
        this.current_card.destroy();

        if(this.cardIdx === DamienOutsideCards.IDLE) {
            this.cardIdx = DamienOutsideCards.MESSAGE;
            this.current_card = this.outside_message_card;
            this.current_card.create();

            //Start the message conversation
            this.message = this.sound.add("newMessage");
            this.message.play();

            this.dialogue.createMessageBG();
            this.dialogue.displayMessage("sorti", true);
            
        } else {
            this.nextScene();
        }
    }

    nextScene() {
        this.cameras.main.fadeOut(3000, 0, 0, 0,
            () => this.scene.start(Scenes.STATS)
        );     
    }
    
    destroy() {
        this.cards.forEach(card => card.destroy());
    }
}
