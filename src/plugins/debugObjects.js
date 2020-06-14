/**
* @author       Paul Ronga – mostly based on Richard Davey’s plugin template
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var DebugObjects = function (scene)
{
    console.log('%c Debug plugin active ', 'background: #222; color: #bada55');

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

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('postupdate', this.postUpdate, this);

        eventEmitter.on('pause', this.pause, this);
        eventEmitter.on('resume', this.resume, this);

        eventEmitter.on('sleep', this.sleep, this);
        eventEmitter.on('wake', this.wake, this);

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    //  A test method.
    test: function (name)
    {
        console.log('DebugObjects says hello ' + name + '!');
    },

    //  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
    start: function ()
    {
      // allow drag
      this.scene.input.on('dragstart', function (pointer, gameObject) {
          var name = '[unnamed texture key]';
          if(gameObject.texture && gameObject.texture.key){
            name = gameObject.texture.key;
          }
         console.log('Moving sprite “' + gameObject.texture.key + '”');
         gameObject.setTint(0xff0000);
       });

       this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
           gameObject.x = dragX;
           gameObject.y = dragY;
       });

       this.scene.input.on('dragend', function (pointer, gameObject) {
           gameObject.clearTint();
           console.log('Game object position: (x:', gameObject.x, 'y:', gameObject.y, 'z:', gameObject.z, ')');
       });
       
       // dont do it after each update
       var debugObjects = this;
       setInterval(function(){
         debugObjects.drawDebug();
       }, 800)
    },

    //  Called every Scene step - phase 1
    preUpdate: function (time, delta)
    {
    },

    //  Called every Scene step - phase 2
    update: function (time, delta)
    {
    },

    //  Called every Scene step - phase 3
    postUpdate: function (time, delta)
    {
      
    },
    
    drawDebug: function(){
      //  cf https://github.com/samme/phaser-plugin-debug-draw/blob/master/src/main.js
     const { cameras, displayList } = this.systems;
     if (!displayList.length) return;
     
     var theScene = this.scene;
     displayList.getChildren().map(function(item){
       if(item.x){
         item.setInteractive();
         item.on('pointerover', function () {
           this.setTint(0x00ff00);
         });
         item.on('pointerout', function () {
           this.clearTint();
         });
         try{
           theScene.input.setDraggable(item);
         }
         catch(e){
           // most objects cant become draggable
         }
       }
     })
    },

    //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
    pause: function ()
    {
    },

    //  Called when a Scene is resumed from a paused state.
    resume: function ()
    {
    },

    //  Called when a Scene is put to sleep. A sleeping scene doesn't update or render, but isn't destroyed or shutdown. preUpdate events still fire.
    sleep: function ()
    {
    },

    //  Called when a Scene is woken from a sleeping state.
    wake: function ()
    {
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
