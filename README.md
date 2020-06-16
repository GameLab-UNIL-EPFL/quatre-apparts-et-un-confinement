# Covidou

Free Open-Source Web-based mobile game.

### Development

* `npm install`

* `npm start`

### Build

* update homepage in package.json

* `npm run build`  

### Testing the game  
If you want to try out the game, you need to use a development server running on your local machine:  
* `npm run-script dev`  

**************************************

## Documentation  
The game is implemented in `node.js` using the [Phaser3](https://phaser.io/phaser3) framework.   

### Scene structure  
The entire game is structured using a modified version of Phaser's [Scenes](https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html). The main difference is that in Covidou we use custom `Card` instances to structure the whole game.   
- __Card__ : A card represents a shot in a given scene. Where a scene can be an entire sequence (like a day in one of our character's life),
 a card is rather a still (or animated) frame in said scene. Cards can either be static (in which case they are simply an instance of the `Card` class) or they can be animated (in which case they are a subclass of the `Card` class).  
 - __CardObject__ : Cards are composed of multiple `CardObject` instances, which are given to the card via the `children` field of the constructor. _Card objects_ are what we will be animating in our scene. This can be done in the `create` method of our card class using Phaser [tweens](https://photonstorm.github.io/phaser3-docs/Phaser.Tweens.Tween.html).  
 - __BackGround__ : An other element of our scene is the `background`, which is simply a wrapper for an image that takes up the entire screen and ontop of which we can place `CardObject` instances.  

### Dialogue  
All of the dialogue in our game is handled by our custom `DialogueController`. This uses the dialogue tree defined in a JSON file and converts it to displayable text.   
