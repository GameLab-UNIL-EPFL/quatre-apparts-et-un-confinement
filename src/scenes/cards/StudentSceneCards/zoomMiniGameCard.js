import { Card } from "../card";
import { Background } from "../../objects/background";
import { CardObject } from "../../objects/cardObject";
import { Scenes } from "../../../core/player";

const N_NOTIFICATION = {
    DAMIEN: 10,
    INDEP: 20
};
const N_DISTRACTIONS = {
    DAMIEN: 19,
    INDEP: 28
};

const N_MSG = {
    MARCH: (N_NOTIFICATION.DAMIEN) + N_DISTRACTIONS.DAMIEN,
    INIT: (N_NOTIFICATION.DAMIEN),
    INDEP: N_NOTIFICATION.INDEP + N_DISTRACTIONS.INDEP
};

const NOTIF_SPREAD = 350;

const BEG_Y_ZONE = {
    DAMIEN: 500,
    INDEP: 300
};

const INIT_FOCUS = {
    MARCH: 5,
    INIT: 10,
    INDEP: 3
};

const SPAWN_DELAY = {
    MARCH: 1000,
    INIT: 2000,
    INDEP: 300,
};

const NUM_SPAWNS = {
    MARCH: 50,
    INIT: 15,
    INDEP: 500
};

const FOCUS_BAR_COLOR = {
    FULL: 0x2EC62E,
    MID: 0xEFA81B,
    LOW: 0xE53D3D
};

const END_ZOOM_CALL_ID = {
    INIT: "endHomework",
    ZOOM: "endZoom",
    INDEP: ""
};

const LOSER_ID = {
    INIT: "loseHomework",
    ZOOM: "loseZoom",
    INDEP: ""
};

const MessageType = {
    Cours: 1,
    Distraction: 0
};

/**
 * @brief Models a "Card" inside of a scene.
 * This card spefically handles the mechanics linked to the zoom minigame
 */
export class ZoomMiniGameCard extends Card {
    /**
     * @brief Constructs a group of objects in the scene
     * @param {Phaser.Scene} parent_scene, the Scene which this card belongs to
     * @param {Scenes} scene_key the name of the scene which this card belongs to
     */
    constructor(parent_scene, scene_key) {
        //Initialize children array
        const children = [
            new CardObject(
                parent_scene,
                {
                    name: scene_key === Scenes.DAMIEN_INIT ?
                        "homework_bg" :
                        scene_key === Scenes.INDEP_COMPUTER ?
                            "taxes_bg" :
                            "zoom_bg",
                    url: scene_key === Scenes.DAMIEN_INIT ?
                        "sprites/StudentScene/ZoomMiniGameCard/init_computer_bg.jpg" :
                        scene_key === Scenes.INDEP_COMPUTER ?
                            "sprites/IndepComputerScene/05_Mini-jeu/mini_game_bg.jpg" :
                            "sprites/StudentScene/ZoomMiniGameCard/zoom_bg.png"
                },
                new Phaser.Math.Vector2(0, -14),
                null,
                null,
                -1,
                null,
                -2
            ),
            new Background(
                parent_scene,
                scene_key === Scenes.INDEP_COMPUTER ?
                    "sprites/IndepComputerScene/05_Mini-jeu/computer_bg.png" :
                    "sprites/StudentScene/ZoomMiniGameCard/computer_screen.png",
                scene_key === Scenes.INDEP_COMPUTER ?
                    "computer_bg_patrick" : "computer_bg"
            ),
            new CardObject(
                parent_scene,
                {
                    name: scene_key === Scenes.INDEP_COMPUTER ?
                        "indep_line" : "line",
                    url: scene_key === Scenes.INDEP_COMPUTER ?
                        "sprites/IndepComputerScene/05_Mini-jeu/bar.png" :
                        "sprites/StudentScene/ZoomMiniGameCard/line.png"
                },
                scene_key === Scenes.INDEP_COMPUTER ?
                    new Phaser.Math.Vector2(-7, 294) :
                    new Phaser.Math.Vector2(-7, 509)
            ),
            new CardObject(
                parent_scene,
                { name: "bar_fill", url: "sprites/StudentScene/ZoomMiniGameCard/bar_fill.png" },
                new Phaser.Math.Vector2(12, -633)
            ),
            new CardObject(
                parent_scene,
                { name: "bar_bg", url: "sprites/StudentScene/ZoomMiniGameCard/bar_bg.png" },
                new Phaser.Math.Vector2(12, -633)
            )
        ];

        //Call base constructor
        super(parent_scene, children, null, true);

        this.messages_stack_1 = [];
        this.messages_stack_2 = [];
        this.whichStack = false;

        this.scene_key = scene_key;

        const n_notif = scene_key === Scenes.INDEP_COMPUTER ?
            N_NOTIFICATION.INDEP : N_NOTIFICATION.DAMIEN;

        const n_distr = scene_key === Scenes.INDEP_COMPUTER ?
            N_DISTRACTIONS.INDEP : N_DISTRACTIONS.DAMIEN;

        //Add all notifications to the card
        for(let i = 0; i < n_notif; ++i) {
            this.messages_stack_1.push({
                name: scene_key === Scenes.INDEP_COMPUTER ?
                    "notification_patrick_" + i :
                    "notification_" + i,
                url: scene_key === Scenes.INDEP_COMPUTER ?
                    "sprites/IndepComputerScene/05_Mini-jeu/notification_" + (i + 1) + ".png" :
                    "sprites/StudentScene/ZoomMiniGameCard/notif_" + i + ".png",
                pos: new Phaser.Math.Vector2(-600, -1000),
                sprite: null,
                type: MessageType.Cours,
                isDestroyed: false
            });
        }

        if(this.scene_key !== Scenes.DAMIEN_INIT) {
            //Add all distractions to the card
            for(let i = 0; i < n_distr; ++i) {
                this.messages_stack_1.push({
                    name: scene_key === Scenes.INDEP_COMPUTER ?
                        "distraction_patrick_" + i :
                        "distraction_" + i,
                    url: scene_key === Scenes.INDEP_COMPUTER ?
                        "sprites/IndepComputerScene/05_Mini-jeu/distraction_" + (i + 1) + ".png" :
                        "sprites/StudentScene/ZoomMiniGameCard/distraction_" + i + ".png",
                    pos: new Phaser.Math.Vector2(-600, -1000),
                    sprite: null,
                    type: MessageType.Distraction,
                    isDestroyed: false
                });
            }
        }

        //Shuffle the current stack
        this.shuffle(this.messages_stack_1);

        //Used to update the bar
        this.focus_bar_health = this.scene_key === Scenes.DAMIEN_INIT ?
            INIT_FOCUS.INIT :
            this.scene_key === Scenes.INDEP_COMPUTER ?
                INIT_FOCUS.INDEP :
                INIT_FOCUS.MARCH;

        this.init_focus = this.scene_key === Scenes.DAMIEN_INIT ?
            INIT_FOCUS.INIT :
            this.scene_key === Scenes.INDEP_COMPUTER ?
                INIT_FOCUS.INDEP :
                INIT_FOCUS.MARCH;

        this.spawn_delay = this.scene_key === Scenes.DAMIEN_INIT ?
            SPAWN_DELAY.INIT :
            this.scene_key === Scenes.INDEP_COMPUTER ?
                SPAWN_DELAY.INDEP :
                SPAWN_DELAY.MARCH;

        this.num_spaws = this.scene_key === Scenes.DAMIEN_INIT ?
            NUM_SPAWNS.INIT :
            this.scene_key === Scenes.INDEP_COMPUTER ?
                NUM_SPAWNS.INDEP :
                NUM_SPAWNS.MARCH;

        this.n_msg = this.scene_key === Scenes.DAMIEN_INIT ?
            N_MSG.INIT :
            this.scene_key === Scenes.INDEP_COMPUTER ?
                N_MSG.INDEP :
                N_MSG.MARCH;

        //Mutex to avoid multiple game ends
        this.lock = false;
        this.final_health = this.scene_key === Scenes.DAMIEN_INIT ?
            INIT_FOCUS.INIT :
            this.scene_key === Scenes.INDEP_COMPUTER ?
                INIT_FOCUS.INDEP :
                INIT_FOCUS.MARCH;

        this.anim_count = 0;
        this.sprites = [];
    }

    /**
     * @brief loads in all of the images used in the scene
     */
    preload() {
        super.preload();

        console.log("Loading sound for month:", this.month);

        //Load sounds
        this.parent_scene.load.audio("music", "sounds/ZoomMiniGame/ZoomMusic.mp3");
        this.parent_scene.load.audio("wrong", "sounds/ZoomMiniGame/wrong.wav");
        this.parent_scene.load.audio("right", "sounds/ZoomMiniGame/right.wav");
        this.parent_scene.load.audio("lose", "sounds/ZoomMiniGame/Lose.wav");

        //Load all of the messages in
        this.messages_stack_1.forEach(msg => {
            this.parent_scene.load.image(msg.name, msg.url);
        });

        //Load in the pop animation
        this.parent_scene.load.spritesheet(
            'notif-pop',
            'sprites/StudentScene/ZoomMiniGameCard/notif_pop.png',
            { frameWidth: 460, frameHeight: 160 }
        );

        //Load in the click animation
        this.parent_scene.load.spritesheet(
            'pointer-click',
            'sprites/UI/pointer.png',
            { frameWidth: 340, frameHeight: 340 }
        );

        //Skip game arrow for debug
        this.parent_scene.load.image('arrow', "sprites/UI/arrow-static.png/arrow-static");
    }

    /**
     * @brief Only ends the card is both the dialogue and the game are done
     */
    notifyDialogueEnd() {
        if(this.isDone()) {
            super.notifyDialogueEnd();
        }
    }

    /**
     * @brief Shuffles a given array using the Fisher-Yates algorithm
     * @param {array<Any>} array the array that will be shuffles (in place)
     */
    shuffle(array) {
        let cur_idx = array.length, temp, rand_idx;

        //Shuffle as long as there are elements
        while(cur_idx !== 0) {
            //Pick a remaining element
            rand_idx = Math.floor(Math.random() * cur_idx);
            cur_idx--;

            //Swap the element with the current one
            temp = array[cur_idx];
            array[cur_idx] = array[rand_idx];
            array[rand_idx] = temp;
        }
    }

    resize_health() {
        //Resize the health bar
        this.children[3].sprite.displayWidth -= this.focus_bar_width / this.init_focus;
        this.children[3].sprite.tint = FOCUS_BAR_COLOR.MID;

        if(this.children[3].sprite.displayWidth < 300) {
            this.children[3].sprite.tint = FOCUS_BAR_COLOR.LOW;
        }
    }

    /**
     * @brief handles the creation of a single message card
     * @param {Function} callback what will be done at the end of the minigame
     */
    createMessage(callback = () => {}) {
        if(!this.lock) {
            //Pick which stack we will be drawing from
            let stack = this.whichStack ? this.messages_stack_2 : this.messages_stack_1;
            let target_stack = this.whichStack ? this.messages_stack_1 : this.messages_stack_2;

            //Pick our element
            let elem = stack.pop();

            //Create the msg at a random location
            const sign = Math.round(Math.random()) === 1 ? 1 : -1;
            elem.pos.x = Math.round(Math.random() * NOTIF_SPREAD) * sign;

            const sprite = this.parent_scene.add.image(
                elem.pos.x,
                elem.pos.y,
                elem.name
            );

            this.sprites.push(sprite);

            elem.sprite = sprite;
            elem.isDestroyed = false;

            target_stack.push(elem);

            if(stack.length === 0) {
                this.whichStack = !this.whichStack;

                //Shuffle the new stack
                this.shuffle(target_stack);
            }

            const duration = this.scene_key === Scenes.INDEP_COMPUTER ? 3000 : 9000;
            const end_y = this.scene_key === Scenes.INDEP_COMPUTER ? 590 : 800;

            //Animate the msg
            this.parent_scene.tweens.add({
                targets: sprite,
                y: end_y,
                duration: duration,
                hideOnComplete: true,
                onComplete: () => {
                    if(!elem.isDestroyed) {

                        //Make sure that the player didn't miss a class notification
                        if(elem.type === MessageType.Cours) {
                            if(!this.lock) {
                                this.wrong.play();
                            }

                            this.resize_health();

                            //Check that the health bar doesn't drop below 0
                            if(--this.focus_bar_health <= 0) {
                                //End the minigame
                                if(typeof callback === "function") {
                                    callback(this, true);
                                }
                            }
                        }

                        //Check if the game is over
                        if(this.num_spaws-- <= 0) {
                            if(typeof callback === "function") {
                                callback(this, false);
                            }
                        }
                    }

                },
                onCompleteScope: this
            });

            //Activate interactivity
            sprite.setInteractive().on(
                'pointerdown',
                () => {
                    //Check the pointer's location
                    const beg_y = this.scene_key === Scenes.INDEP_COMPUTER ?
                        BEG_Y_ZONE.INDEP : BEG_Y_ZONE.DAMIEN;

                    if(sprite.y >= beg_y) {
                        sprite.destroy();
                        this.num_spaws--;

                        this.parent_scene.add.sprite(
                            sprite.x,
                            sprite.y,
                            "notif-pop"
                        ).play('pop');

                        if(elem.type === MessageType.Cours) {
                            this.right.play();
                        }

                        //Make sure that the player didn't miss a class notification
                        if(elem.type === MessageType.Distraction) {

                            //play sound
                            if(!this.lock) {
                                this.wrong.play();
                            }

                            this.resize_health();

                            //Check that the health bar doesn't drop below 0
                            if(--this.focus_bar_health <= 0) {
                                //End the minigame
                                if(typeof callback === "function") {
                                    callback(this, true);
                                    this.lose.play();
                                }
                            }

                        } else {
                            elem.isDestroyed = true;
                        }

                        if(this.num_spaws <= 0) {
                            if(typeof callback === "function") {
                                callback(this, false);
                            }
                        }
                    }
                },
                this
            );
        }
    }

    /**
     * @brief Ends the minigame by closing the dialogue box and passing the card
     */
    endMiniGame(card, lose=false) {
        if(!card.lock) {
            card.lose.play();
            card.sprites.forEach(sprite => sprite.destroy());

            card.lock = true;

            console.log("NUM_CARDS_LEFT:" + card.num_spaws);

            //Pick the correct text to display
            let lose_key;
            let win_key;
            if(card.scene_key === Scenes.INDEP_COMPUTER) {
                lose_key = "patrick_mini_lose";
                win_key = "patrick_mini_win";
            } else {
                lose_key = card.scene_key === Scenes.DAMIEN_INIT ? LOSER_ID.INIT : LOSER_ID.ZOOM;
                win_key = card.scene_key === Scenes.DAMIEN_INIT ? END_ZOOM_CALL_ID.INIT : END_ZOOM_CALL_ID.ZOOM;
            }

            //Open the dialogue
            card.parent_scene.dialogue.display(
                lose ? lose_key : win_key
            );

            //Save the card's health in case not all the notifications are gone
            card.final_health = card.focus_bar_health;

            //End the card
            card.endCard();

            card.parent_scene.tweens.add({
                targets:  card.music,
                volume:   0,
                duration: 800
            });
        }
    }

    showTutorial() {
        const bg = new Phaser.Geom.Rectangle(-600, BEG_Y_ZONE.DAMIEN, 1200, 300);
        const hitzone = this.parent_scene.add.graphics({ fillStyle: { color: 0xfff8a1, alpha: 0.9 } });
        hitzone.fillRectShape(bg);

        //Animate the box
        this.parent_scene.tweens.add({
            targets: hitzone,
            alpha: 0.1,
            duration: 2000,
            ease: "Quadratic",
            yoyo: true,
            loop: -1
        });

        //Create the tutorial notification
        const tutorial_sprite = this.parent_scene.add.image(
            0,
            -1000,
            'notification_0'
        );

        tutorial_sprite.setDepth(1);

        //Animate it down the screen
        this.parent_scene.tweens.add({
            targets: tutorial_sprite,
            y: 600,
            duration: 7500,
            onComplete: () => {
                const pointer = this.parent_scene.add.sprite(
                    tutorial_sprite.x,
                    tutorial_sprite.y + 50,
                    'pointer-click'
                ).play('pointer-anim');

                pointer.setScale(0.5, 0.5),
                pointer.setDepth(5);

                const interaction = () => {

                    //Play pop animation
                    this.parent_scene.add.sprite(
                        tutorial_sprite.x,
                        tutorial_sprite.y,
                        "notif-pop"
                    ).play('pop');

                    //Play the SFX
                    this.right.play();

                    tutorial_sprite.destroy();
                    pointer.destroy();
                    hitzone.destroy();

                    //Create the timer event and start the game
                    this.msg_spawner = this.parent_scene.time.addEvent({
                        delay: this.spawn_delay,
                        repeat: this.num_spaws,
                        callback: this.createMessage,
                        callbackScope: this,
                        args: [this.endMiniGame]
                    });

                };

                tutorial_sprite.setInteractive().on('pointerdown', interaction, this);
                pointer.setInteractive().on('pointerdown', interaction, this);
            },
            onCompleteScope: this
        });
    }

    /**
     * @brief Sets all of the animations related to the objects in the card
     */
    create() {
        super.create();

        let arrow = this.parent_scene.add.image(this.parent_scene.cameras.main.width * 0.41666, -700, 'arrow').setInteractive().on(
            'pointerdown',
            () => {
                arrow.destroy();
                this.endMiniGame(this, true);
                this.music.stop(); // if fadeout doesnt complete
            },
            this
        );
        arrow.depth = 20;

        //starts the song at the beginning of the scene
        this.music = this.parent_scene.sound.add("music");
        this.wrong = this.parent_scene.sound.add("wrong");
        this.right = this.parent_scene.sound.add("right");
        this.lose = this.parent_scene.sound.add("lose");

        this.music.play({loop: true});

        //Save the bar's initial info
        this.focus_bar_width = this.children[3].sprite.width;
        this.children[3].sprite.tint = FOCUS_BAR_COLOR.FULL;

        //Move all of the UI stuff to the front
        this.children[2].sprite.setDepth(1);
        this.children[3].sprite.setDepth(1);
        this.children[4].sprite.setDepth(1);

        //Create pop animation
        this.parent_scene.anims.create({
            key: 'pop',
            frameRate: 15,
            frames: this.parent_scene.anims.generateFrameNames('notif-pop'),
            repeat: 0,
            hideOnComplete: true
        });

        //Create pop animation
        this.parent_scene.anims.create({
            key: 'pointer-anim',
            frameRate: 15,
            frames: this.parent_scene.anims.generateFrameNames('pointer-click'),
            repeat: -1
        });

        //Move background to the front
        this.children[1].sprite.setDepth(1);

        //Start with the tutorial
        if(this.scene_key === Scenes.DAMIEN_INIT) {
            this.showTutorial();
        } else {
            //Create the timer event and start the game
            this.msg_spawner = this.parent_scene.time.addEvent({
                delay: this.spawn_delay,
                repeat: this.num_spaws,
                callback: this.createMessage,
                callbackScope: this,
                args: [this.endMiniGame]
            });
        }
    }

    destroy() {
        super.destroy();

        this.sprites.forEach(sprite => sprite.destroy());
    }
}
