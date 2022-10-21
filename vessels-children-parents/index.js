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

    //let context = app.getPath('vessels');
    //app.debug(context);


    let localSubscriptionParents = {
      context: plugin.parents, // Get data for all contexts
      subscribe: [{
        path: '*', // Get all paths
        period: 10000 // Every 5000ms
      }]
    };

    let localSubscriptionChildren = {
      context: plugin.children, // Get data for all contexts
      subscribe: [{
        path: '*', // Get all paths
        period: 10000 // Every 5000ms
      }]
    };

    app.subscriptionmanager.subscribe(
      localSubscriptionParents,
      unsubscribes,
      subscriptionError => {
        app.error('Error:' + subscriptionError);
      },
      delta => {
        delta.updates.forEach(u => {
          app.debug(u.values.valueOf());
        });
      }
    );

    app.subscriptionmanager.subscribe(
      localSubscriptionChildren,
      unsubscribes,
      subscriptionError => {
        app.error('Error:' + subscriptionError);
      },
      delta => {
        delta.updates.forEach(u => {
          app.debug(u.values.valueOf());
        });
      }
    );

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
};

