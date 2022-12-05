/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// cose da visualizzare nell'html


var childVessel = [];
var parentVessel = []

var requestChildren = $.ajax({
  async: false,
  url: '/plugins/vessels-children-parents/childVessel',
  success: function (data) {

    console.log("Full delta " + JSON.stringify(data))
    //console.log("Mapping: " + JSON.stringify(data["updates"][0]["values"]))
    
    data["updates"][0]["values"].forEach(element => {
      //console.log(element["path"] + " added")
      childVessel.push({ "path": element["path"], "value": element["value"] })
      
    });
    //childVessel[JSON.stringify(data.valueOf()[0]["path"]).replaceAll('"' ,"")] = JSON.stringify(data.valueOf()[0]["value"]).replaceAll('"' ,"")
    //console.log("ChildVessel: " + JSON.stringify(childVessel))
  }
})

var requestParents = $.ajax({
  async: false,
  url: '/plugins/vessels-children-parents/parentVessel',
  success: function (data) {
    console.log("Full parent delta " + JSON.stringify(data))
    data["updates"][0]["values"].forEach(element => {
      parentVessel.push({ "path": element["path"], "value": element["value"] })
    });
  }
})

var body = document.getElementsByTagName('body')[0];
var childUUID = childVessel.at(childVessel.length-1)["value"]["uuid"]
var parentUUID = parentVessel.at(parentVessel.length-1)["value"]["uuid"]

//how to i create a table in js?
function tableCreate(vessel) {
  var tbl = document.createElement("table");
  tbl.style.width = '80%';
  tbl.style.alignSelf = 'center'
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
  vessel.forEach(el => {
    var tr = document.createElement('tr');
    for (var j = 0; j < 2; j++) {
      if (j == 1) {
        break
      } else {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(el['path'] == "" ? 'UUID' : el["path"]))
        j == 1 ? td.setAttribute('rowSpan', '2') : null;
        tr.appendChild(td)
      }
    }
    for (var i = 0; i < 2; i++) {
      if (i == 1) {
        break
      } else {
        var td2 = document.createElement('td');
        td2.appendChild(document.createTextNode(el['value']))
        i == 1 ? td2.setAttribute('rowSpan', '2') : null;
        tr.appendChild(td2)
      }
    }
    tbdy.appendChild(tr);
  })
  tbl.appendChild(tbdy);
  body.appendChild(tbl)
}



var childTitle = document.createElement('h1')
childTitle.textContent = childUUID
body.appendChild(childTitle)
tableCreate(childVessel); 

var parentTitle = document.createElement('h1')
parentTitle.textContent = parentUUID
body.appendChild(parentTitle)
tableCreate(parentVessel);

/* const table = document.getElementById("childTable")
const parentsTable = document.getElementById("parentsTable")

var titles = document.createElement("TR");
titles.setAttribute("id", "titles");
titles.innerHTML = '<th> Paths </th> <th> Values </th>'
table.appendChild(titles);
parentsTable.appendChild(titles)


childVessel.forEach(el => {
  //console.log(JSON.stringify(el))
  var tableElement = document.createElement("TR")
  tableElement.innerHTML = '<td> ' + el["path"] + ' </td> <td> ' + el["value"] + ' </td>'
  table.append(tableElement)
})

parentVessel.forEach(el => {
  //console.log(JSON.stringify(el))
  var tableElement = document.createElement("TR")
  tableElement.innerHTML = '<td> ' + el["path"] + ' </td> <td> ' + el["value"] + ' </td>'
  parentsTable.append(tableElement)
}) */




