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
If you're interested in translating our game into your language of choice, check out our detailed [wiki](https://github.com/IMI-initiative/quatre-apparts-et-un-confinement/wiki/Translations) page on the subject!   
  
  