module.exports = function (app) {

  var plugin = {};
  var unsubscribes = [];
  plugin.id = "my-signalk-plugin";
  plugin.name = "My first plugin";
  plugin.description = "Plugin that does stuff";

  // allows the plugin deltas to the server
  app.handleMessage(plugin.id, {
    updates: [
      {
        values: [
          {
            path: 'navigation.courseOverGroundTrue',
            value: Math.PI
          }
        ]
      }
    ]})


  plugin.start = function (options, restartPlugin) {
    app.debug("Plugin started");

    // here i will put my plugin logic
    let value = app.getSelfPath('uuid');
    app.debug(value); // Should output something like urn:mrn:signalk:uuid:a9d2c3b1-611b-4b00-8628-0b89d014ed60

    //subscribing to a stream of updates
    let localSubscription = {
      context: 'vessels.self',
      subscribe: [{
        path: '*',  // here you can specify the path that you want to subscribe to
        period: 50000
      }]
    };

    app.subscriptionmanager.subscribe(
      localSubscription,
      unsubscribes,
      subscriptionError => {
        app.error('Error:' + subscriptionError);
      },
      delta => {
        delta.updates.forEach(u => {
          app.debug(u.values);
        });
      }
    );

    //sending NMEA2000 data from the plugin
    // ??? idk if it works with NMEA0813 data
    app.emit('nmea2000JsonOut', {
      pgn: 130306,
      'Wind Speed': 20,
      'Wind Angle': 19,
      'Reference': "Apparent"
    });

    //gets all the available paths
    var availablePaths = app.streambundle.getAvailablePaths()
    app.debug(availablePaths);
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

  plugin.schema = {
    type: 'undefined',
    required: ['id','name'],
    properties: {
      id: {
        type: 'string',
        title: 'Plugin ID'
      },
      name: {
        type: 'string',
        title: 'Plugin name'
      },
      description: {
        type: 'string',
        title: 'Plugin Description'
      }
    }
  };

  return plugin;
}

