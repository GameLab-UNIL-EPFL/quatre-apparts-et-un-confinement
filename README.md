# “Quatre Apparts et un Confinement” (Four Condos and a Containment)

Free Open-Source Web-based mobile interactive story based around people's different experiences of being quarantined in Switzerland.

## Team

**Game Design** Saara Jones @astonedf<br>
**Graphic Design** Mathias Hängärtner @matang<br>
**Development** Andrew Dobis @dobios<br>
**Project Managers** Yannick Rochat @yrochat, Paul Ronga @palrogg<br>
**Producers** Mounir Krichane (IMI), Gaël Hürlimann (*Le Temps*)

## Licences summary

| File type | License |
|-|-|
| Code | GPLv3 |
| Sprites | CC-BY 4.0 |
| Sound Effects | CC-BY 4.0 |
| Sound Excerpts | See below |

The Swiss public broadcasting services RTS and SRF kindly provided us some radio excerpts. Following use their material and are NOT available under a creative commons license:
* april_radio.mp3
* april2_radio.mp3
* june_radio.mp3
* june2_radio.mp3
* march_music.mp3
* march_radio.mp3
* march2_radio.mp3


---

### Development

* `npm install`

* `npm run dev` (and not `npm run start`, used for continuous delivery)

### Build

* update homepage in package.json

* `npm run build`  

### Deploy

The repository was organized for fast deployments on Heroku. `npm run start` calls `node ./server_for_heroku.js`.

---

## Documentation  
The game uses the [Phaser3](https://phaser.io/phaser3) game framework:
* [Phaser official documentation](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Group.html)
* [Rex’s “notes” about Phaser3](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/game/)

### Scene structure  
Inside Phaser [Scenes](https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html), the game uses custom `Card` instances.
- __Card__ : A card represents a shot in a given scene. Where a scene can be an entire sequence (like a day in one of our character's life),
 a card is rather a still (or animated) frame in said scene. Cards can either be static (in which case they are simply an instance of the `Card` class) or they can be animated (in which case they are a subclass of the `Card` class).  
 - __CardObject__ : Cards are composed of multiple `CardObject` instances, which are given to the card via the `children` field of the constructor. _Card objects_ are what we will be animating in our scene. This can be done in the `create` method of our card class using Phaser [tweens](https://photonstorm.github.io/phaser3-docs/Phaser.Tweens.Tween.html).  
 - __Background__ : An other element of our scene is the `background`, which is simply a wrapper for an image that takes up the entire screen and ontop of which we can place `CardObject` instances.  

### Dialogue  
All of the dialogue in our game is handled by our custom `DialogueController`. This uses the dialogue tree defined in a JSON file and converts it to displayable text.   
See [example.json](src/dialogue/en/example.json)  

### Database
If users agree to anonymously share their choices, they get saved in a SQLite database (see [server](server) folder).

### Local game state saves
Game states gets regularly saved in localStorage (see [player.js](src/core/player.js)). This allows players to resume an interrupted game.
  
-- 

## Translations  
If you're interested in participating in the translation of the game's text into your language of choice, now you can using our language control system.   

### What is translatable  
Most of the text in the game can be translated more-or-less easily. Here are the three categories of text in our game:  
| Type | Translatability |
|-|-|
| Dialog | Can be translated by adding JSONs with modified text |
| Core text | Can be translated by adding an entry into an object in code |
| Graphical text | Can't be translated without redrawing sprites |  
  
### How to translate  
First off, if the language doesn't exist in our system yet, it needs to be added to the [LANGUAGES](src/core/player.js) object, given a readable name in [languageToText()](src/core/player.js) and given a toggle position for the language selection in [toggleLanguage()](src/core/player.js).   
  
Once that is done, you can move on to translating the core text, which, for the time being, consists of the main menu and credits text. This can be done by adding an entry using the same shorthand that was used to define your language in the [LANGUAGES](src/core/player.js) object. This entry should be created as a duplicate of the 'fr' entry. Once that is done, you can start translating the necessary text in said entry. The objects are [MenuText](src/scenes/buildingScene.js) and [CREDITS_TEXT](src/scenes/endScene.js).
  
After that a new sub-folder must be added to the [dialog](src/dialogue) folder and must bare the same name as the shorthand that was used to define your language in the [LANGUAGES](src/core/player.js) object (i.e. English is 'en' and French is 'fr). This new folder must be created as a duplicate of the [fr](src/dialogue/fr) folder, since this is the base on which the game was built and optimized. You can now tranlate all of the names and text in the different json files. Note that you must only change the `"name"` and `"text"` fields of the json files, changing any other field will result in a runtime error.  
  
### Translation example  
Let's say that I want to translate the game in German, then I must proceed as follows:  
- Add German as a new language:  
```javascript  
    //In player.js
    export const LANGUAGES = {
        FR: 'fr',
        EN: 'en',
        DE: 'de' //This line is new
    };
    //...
    /**
     * Toggles the current language stored in the player
     */
    toggleLanguage() {
        switch(this.language) {
        case LANGUAGES.EN:
            this.language = LANGUAGES.FR;
            break;
        case LANGUAGES.FR:
            this.language = LANGUAGES.DE; //Changed EN to DE
            break;
        case LANGUAGES.DE:
            this.language = LANGUAGES.EN; //Always loop back to EN
        default:
            break;
        }
    }

    /**
     * Converts a language into a readable form
     */
    languageToText() {
        switch(this.language) {
        case LANGUAGES.EN:
            return "English";
        case LANGUAGES.FR:
            return "Français";
        case LANGUAGES.DE:    //this is new
            return "Deutsch"; //this is new
        default:
            return "";
        }
    }
```  
- Translate the core text into german, by adding new `'de'` fields to the core text objects:  
```javascript  
    //In buildingScene.js
    const MenuText = {
        'en': {
            Credits: "Credits",
            NewGame: "New Game",
            Continue: "Continue"
        },
        'fr': {
            Credits: "À Propos",
            NewGame: "Nouvelle Partie",
            Continue: "Continuer"
        },
        //Add DE here, note that the inner fields (i.e. Credits, NewGame and Continue)
        //Must always be exactly the same in every language
        'de': {
            Credits: "À Propos",  //This works in swiss-german
            NewGame: "Neues Spiel",
            Continue: "Fortsetzen"
        }
    };
    //...
    //In endScene.js
    const CREDITS_TEXT = {
        'en': {
            TEAM: `
            <h4>Programming</h4>Andrew Dobis
            <h4>Graphics</h4>Mathias Hängärtner
            <h4>Story, Sound desing</h4>Saara Jones
            <h4>Project Management</h4>Yannick Rochat, Paul Ronga
            `,
            REPO: `
            ...
            `,
            THANKS: `
            ...
            `
        },
        'fr': {
            TEAM: `
            <h4>Programmation</h4>Andrew Dobis
            <h4>Graphisme</h4>Mathias Hängärtner
            <h4>Récit, Conception sonore</h4>Saara Jones
            <h4>Gestion de projet</h4>Yannick Rochat, Paul Ronga
            `,
            REPO: `
            ...
            `,
            THANKS: `
            ...
            `
        },
        //Add a new de field here
        'de': {
            TEAM: `
            <h4>Programmierung</h4>Andrew Dobis
            <h4>Grafik</h4>Mathias Hängärtner
            <h4>Geschichte, Sound desing</h4>Saara Jones
            <h4>Projektmanagement</h4>Yannick Rochat, Paul Ronga
            `,
            REPO: `
            ... //There's stuff to be translated here too
            `,
            THANKS: `
            ... //And here
        }
    };

```  
- Finally translate the dialog to german by:  
    - Duplicating the `fr` folder and renaming it to `de`.  
    - Translating all of the `name` and `text` fields of every json file inside of `de`.  
       
Once all of this is done don't forget to test out the game locally by runnign `npm run-script dev` in the source folder and checking that the game never crashed during a play through in german, if it does it probably means that you changed a field that you weren't supposed to. If all of that works, you can hapily open a `PR` entitled "<_language_> Translation" and request a review from anyone in the organization.  
  
Congratulations you've just contributed to making this game accessible to more people!  
