module.exports = function (app) {
  var plugin = {};
  var unsubscribes = [];

  plugin.id = "vessels-children-parents";
  plugin.name = "Vessel Child Parents Plugin";
  plugin.description = "Plugin that create a relationship between the vessel and other subvessels";

  var childVesselData;
  var parentVesselData

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

  plugin.start = function (options) {
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

    let localSubscriptionParents = {
      context: plugin.parents, // Get data for all contexts
      subscribe: [{
        path: '*', // Get all paths
        period: 60000 // Every 5000ms
      }]
    };

    let localSubscriptionChildren = {
      context: plugin.children, // Get data for all contexts
      subscribe: [{
        path: 'navigation', // Get all paths
        period: 60000 // Every 5000ms
      }]
    };

    app.subscriptionmanager.subscribe(
      localSubscriptionParents,
      unsubscribes,
      subscriptionError => {
        app.error('Error:' + subscriptionError);
      },
      delta => {
        parentVesselData = makeFullDelta()
        
        delta.updates.forEach(u => {
          app.debug(u.values)
          //app.debug(u.values.valueOf());
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
        childVesselData = makeFullDelta()
        delta.updates.forEach(key => {
            // Create the path sting from all path elements except the last
            app.debug(key.values)
        });
      }
    );



  };



  // Create an update form the full document
  function makeFullDelta() {

    // Set the context
    const context = "vessels." + app.selfId
    
    // Get the whole document
    let doc = app.getPath(context)

    // Initialize the result
    let delta = {
      "updates": [
        {
          "timestamp": new Date(),
          "values": [],
          "$source": "defaults"
        }
      ],
      "source": { "label" :"signalk-children-parents", "type": "signalk-children-parents-plugin"},
      "context": context
    }

    // Set an empty path
    let signakPath = [];

    // Set an empty dictionary for the root properties
    let rootProperties = {};

    // Recursive function for document visiting
    function eachRecursive(obj) {

      // For each key in the object
      for (let key in obj) {

        // Add the key to the path
        signakPath.push(key)

        // Check if the object is an object, if the key is not null,
        // and if the key is not "value"
        if (typeof obj[key] == "object" && obj[key] !== null && key !== "value") {

          // Invoke the same function recursively
          eachRecursive(obj[key]);

        } else {
          // Create the path sting from all path elements except the last
          let pathString = signakPath.slice(0, -1).join('.')

          // Check if the current key is "value"
          if (key === "value") {

            // Prepare a full path to get the value
            let fullPathString = context + "." + pathString + ".value"

            // Set the value object
            let value = {
              "path": pathString,
              "value": app.getPath(fullPathString)
            }

            // Add the value to the updates' values
            delta.updates[0].values.push(value)

          } else
            // Check if the path string is empty
            if (pathString === "") {
              // Add the document root property to the rootProperties dictionary
              rootProperties[key] = obj[key]
          }
        }

        // Remove the last path element
        signakPath.pop()
      }
    }

    // Invoke the recursive function
    eachRecursive(doc)

    // Set the value object for the root properties
    let value = {
      "path": "",
      "value": rootProperties
    }

    // Add the root properties to the delta
    delta.updates[0].values.push(value)

    // Return the delta
    return delta
  }

  /* Register the REST API */
  plugin.registerWithRouter = function(router) {

    // Return the logging speed
    router.get("/childVessel", (req, res) => {
      app.debug("get childVesselData")

      let result = childVesselData

      res.status(200)
      res.send(result)
    })

    // Return the logs
    router.get("/parentVessel", (req, res) => {
      app.debug("get parentVesselData")

      let result = parentVesselData

      res.status(200)
      res.send(result)
    })

  }


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

