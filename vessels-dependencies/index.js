module.exports = function (app) {
  var plugin = {}
  var unsubscribes = []

  plugin.id = 'vesselDependencies'
  plugin.name = 'Vessel Dependencies'
  plugin.description =
    'Plugin that create an hierarchy relationship between the vessel and other vessels'

  plugin.schema = {
    type: 'object',
    properties: {
      parents: {
        type: 'array',
        title: 'parents vessels uuid',
        items: {
          type: 'string'
        },
        uniqueItems: true,
        default: []
      },
      children: {
        type: 'array',
        title: 'children vessels uuid',
        items: {
          type: 'string'
        },
        uniqueItems: true,
        default: []
      }
    }
  }

  plugin.start = function (options) {
    app.debug('Plugin started')

    // Binding the arrays
    if (options) {
      plugin.parents = options.parents
      plugin.children = options.children
      app.debug('Parents and children associated!')
    } else {
      ;(plugin.parents = []), (plugin.children = [])
      app.debug('Neither parents or children associated!')
    }

    // Sending the relationships to the server
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
      ]
    })
    app.debug('parents and children binded')
  }

  plugin.stop = function () {
    // here i will put the logic for the plugin stop
    app.debug('Plugin stopped')

    //unsubscribing from updates
    plugin.stop = function () {
      unsubscribes.forEach((f) => f())
      unsubscribes = []
    }
  }
  return plugin
}
