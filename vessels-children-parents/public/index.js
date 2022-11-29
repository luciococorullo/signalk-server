/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// cose da visualizzare nell'html


var childVessel = [];
var parentVessel = []

var requestChildren = $.ajax({
  async: false,
  url: '/plugins/vessels-children-parents/childVessel',
  success: function (data) {

    //console.log("Full delta " + JSON.stringify(data))
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
    console.log("Full delta " + JSON.stringify(data))
    data["updates"][0]["values"].forEach(element => {
      parentVessel.push({ "path": element["path"], "value": element["value"] })
    });
  }
})



const ct1 = document.getElementById("childVessel").innerHTML = ' <h1> ' + childVessel.at(childVessel.length-1)["value"]["uuid"] +' </h1>' 
const ct2 = document.getElementById("parentVessel").innerHTML = ' <h1> ' + parentVessel.at(parentVessel.length-1)["value"]["uuid"] +' </h1>' 
const table = document.getElementById("childTable")
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
})




