function vesselToGraph(vesselsData) {
  var elements = {}
  elements.nodes = []
  elements.edges = []

  Object.entries(vesselsData).forEach((vessel) => {
    var vesselID = vessel[1].uuid
    var vesselName = vessel[1].name

    var vesselChildren =
      vesselID == 'urn:mrn:signalk:uuid:parentvessel'
        ? ['urn:mrn:signalk:uuid:childvessel']
        : vessel[1].children['value'] ?? []
    var vesselParents =
      vesselID == 'urn:mrn:signalk:uuid:parentvessel'
        ? []
        : vessel[1].parents['value'] ?? []

    elements.nodes.push({
      data: { id: vesselID, name: vesselName, position: [150, 120] }
    })

    vesselChildren.forEach((child) => {
      console.log('creating edge from: ' + vesselID + ' to: ' + child)
      elements.edges.push({
        data: { source: vesselID, target: child, description: 'is parent of' }
      })
    })

    vesselParents.forEach((parent) => {
      console.log('creating edge from: ' + vesselID + ' to: ' + parent)
      elements.edges.push({
        data: { source: vesselID, target: parent, description: 'is child of' }
      })
    })
  })

  return elements
}

function generateGraphView(vesselsData) {
  var cy = cytoscape({
    container: document.getElementById('graphView'),

    elements: vesselToGraph(vesselsData),

    boxSelectionEnabled: false,
    autounselectify: true,

    style: cytoscape
      .stylesheet()
      .selector('node')
      .css({
        height: 80,
        width: 80,
        'background-fit': 'cover',
        'background-color': '#FFF',
        'border-color': '#000',
        'border-width': 1,
        'border-opacity': 1,
        content: 'data(name)'
      })
      .selector('edge')
      .css({
        width: 6,
        'target-arrow-shape': 'triangle',
        'line-color': '#ffaaaa',
        'target-arrow-color': '#ffaaaa',
        'curve-style': 'bezier',
        content: 'data(description)'
      }),

    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 10
    }
  }) // cy init
}
