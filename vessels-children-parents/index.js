module.exports = function (app) {
  var plugin = {};
  var unsubscribes = [];

  plugin.id = "vessels-children-parents";
  plugin.name = "Vessel Child Parents Plugin";
  plugin.description = "Plugin that create a relationship between the vessel and other subvessels";

  plugin.schema = {
    type: 'object',
    properties: {
      parents: {
        type: 'array',
        title: 'vessels parents uuid',
        items: {
          type: 'string'
        },
        uniqueItems: true,
        default: []
      },
      children: {
        type: 'array',
        title: 'vessels children uuid',
        items: {
          type: 'string'
        },
        uniqueItems: true,
        default: []
      }
    }
  };

  plugin.start = function (options, restartPlugin) {
    app.debug("Plugin started");
    //app.debug(plugin.parents);
    // here i will put my plugin logic
    let value = app.getSelfPath('uuid');
    app.debug(value); // Should output something like urn:mrn:signalk:uuid:a9d2c3b1-611b-4b00-8628-0b89d014ed60

    if(options){
      plugin.parents = options.parents
      plugin.children = options.children
      app.debug("Parents and children associated!");
    } else {
        plugin.parents = [],
        plugin.children = []
        app.debug("Neither parents or children associated!");
    }

    // allows the plugin deltas to the server
    app.handleMessage(plugin.id, {
      updates: [
        {
          values: [
            {
              path: 'parents',
              value: plugin.parents
            },
            {
              path: 'children',
              value: plugin.children
            }
          ]
        }
      ]});
    app.debug('parents and children sent');

  };

  plugin.stop = function (){
    // here i will put the logic for the plugin stop
    app.debug("Plugin stopped");

    //unsubscribing from updates
    plugin.stop = function () {
      unsubscribes.forEach(f => f());
      unsubscribes = [];
    };
  };


  return plugin;
}

