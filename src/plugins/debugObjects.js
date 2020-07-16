/**
* @author       Paul Ronga – mostly based on Richard Davey’s plugin template
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var DebugObjects = function (scene)
{
  // here we could check localStorage
  this.active = true;
  console.log('%c Debug plugin active ', 'background: #222; color: #bada55');
  
  // old style
  const checkboxContainer = document.createElement('div');
  checkboxContainer.style.position = 'fixed';
  checkboxContainer.style.top = 0;
  checkboxContainer.style.right = 0;
  
  let checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.id = "debugObjectsCheckbox";
  checkbox.checked = 'checked';
  
  var label = document.createElement('label');
  label.htmlFor = "debugObjectsCheckbox";
  label.appendChild(document.createTextNode('Debug objects'));
  
  document.body.appendChild(checkboxContainer);
  checkboxContainer.appendChild(checkbox);
  checkboxContainer.appendChild(label);
  debugPlugin = this;
  checkbox.onclick = function(){
    debugPlugin.active = !debugPlugin.active;
    console.log('%c Debug plugin active: ' + debugPlugin.active, 'background: #222; color: #bada55');
  };
  
  //  The Scene that owns this plugin
  this.scene = scene;
  this.systems = scene.sys;
  
  this.graphic = null;
  
  if (!scene.sys.settings.isBooted)
  {
    scene.sys.events.once('boot', this.boot, this);
  }
};

//  Static function called by the PluginFile Loader.
DebugObjects.register = function (PluginManager)
{
  //  Register this plugin with the PluginManager, so it can be added to Scenes.
  
  //  The first argument is the name this plugin will be known as in the PluginManager. It should not conflict with already registered plugins.
  //  The second argument is a reference to the plugin object, which will be instantiated by the PluginManager when the Scene boots.
  //  The third argument is the local mapping. This will make the plugin available under `this.sys.base` and also `this.base` from a Scene if
  //  it has an entry in the InjectionMap.
  PluginManager.register('DebugObjects', DebugObjects, 'base');
};

DebugObjects.prototype = {
  
  //  Called when the Plugin is booted by the PluginManager.
  //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
  boot: function ()
  {
    var eventEmitter = this.systems.events;
    
    //  Listening to the following events is entirely optional, although we would recommend cleanly shutting down and destroying at least.
    //  If you don't need any of these events then remove the listeners and the relevant methods too.
    
    eventEmitter.on('start', this.start, this);
    eventEmitter.on('shutdown', this.shutdown, this);
    eventEmitter.on('destroy', this.destroy, this);
  },
  
  //  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
  start: function ()
  {
    let debugPlugin = this;
    
    // allow drag
    this.scene.input.on('dragstart', function (pointer, gameObject) {
      if(debugPlugin.active){
        var name = '[unnamed texture key]';
        if(gameObject.texture && gameObject.texture.key){
          name = gameObject.texture.key;
        }
        console.log('Moving sprite “' + gameObject.texture.key + '”');
        gameObject.setTint(0xff0000);
      }
    });
    
    this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      if(debugPlugin.active){
        gameObject.x = dragX;
        gameObject.y = dragY;
      }
    });
    
    this.scene.input.on('dragend', function (pointer, gameObject) {
      if(debugPlugin.active){
        gameObject.clearTint();
        console.log('Game object position: (' + Math.round(gameObject.x) +", " + Math.round(gameObject.y), ')');
      }
    });
    
    // dont do it after each update
    var debugObjects = this;
    setInterval(function(){
      debugObjects.drawDebug();
    }, 800);
  },
  
  
  drawDebug: function(){
    //  cf https://github.com/samme/phaser-plugin-debug-draw/blob/master/src/main.js
    const { cameras, displayList } = this.systems;
    if (!displayList.length) return;
    
    let theScene = this.scene;
    let debugPlugin = this;
    
    displayList.getChildren().map(function(item){
      if(item.x){
        item.setInteractive();
        item.on('pointerover', function () {
          if(debugPlugin.active){
            this.setTint(0x00ff00);
          }
        });
        item.on('pointerout', function () {
          if(debugPlugin.active){
            this.clearTint();
          }
        });
        try{
          theScene.input.setDraggable(item);
        }
        catch(e){
          // most objects cant become draggable
        }
      }
    });
  },
  
  //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
  shutdown: function ()
  {
  },
  
  //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
  destroy: function ()
  {
    this.shutdown();
    
    this.scene = undefined;
  }
  
};

DebugObjects.prototype.constructor = DebugObjects;

//  Make sure you export the plugin for webpack to expose

module.exports = DebugObjects;
