/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var body = document.getElementsByTagName('body')[0]

function displayObjectData(object) {
  var content = ''
  Object.entries(object).forEach((obj) => {
    var value = ''
    
    console.log(obj[1])
    if(!obj[1]['value']){
      value = ''
    } else if(typeof(obj[1]['value']) === 'object'){
      value = displayObjectData(obj[1]['value'])
    } else {
      value = obj[1]['value']
    }

    //obj[1]['value'] === undefined ? value = '' : value = obj[1]['value']
    content += obj[0] + ': ' + value + '\n'
  })
  return content
}

// function that creates a table
function tableCreate(vessel) {
  var tbl = document.createElement('table')
  tbl.style.width = '80%'
  tbl.style.alignSelf = 'center'
  tbl.setAttribute('border', '1')
  var tbdy = document.createElement('tbody')
  Object.entries(vessel).forEach((el) => {
    var tr = document.createElement('tr')
    for (var j = 0; j < 2; j++) {
      if (j == 1) {
        break
      } else {
        var td = document.createElement('td')
        td.appendChild(document.createTextNode(el[0] == '' ? 'UUID' : el[0]))
        j == 1 ? td.setAttribute('rowSpan', '2') : null
        tr.appendChild(td)
      }
    }
    for (var i = 0; i < 2; i++) {
      if (i == 1) {
        break
      } else {
        var td2 = document.createElement('td')
        var content = ''
        td2.appendChild(
          document.createTextNode(
            typeof el[1] === 'object' ? displayObjectData(el[1]) : el[1]
          )
        )
        i == 1 ? td2.setAttribute('rowSpan', '2') : null
        tr.appendChild(td2)
      }
    }
    tbdy.appendChild(tr)
  })
  tbl.appendChild(tbdy)
  body.appendChild(tbl)
}

// fetching the data from a signalk server
fetch('http://localhost:3001/signalk/v1/api/vessels')
  .then((response) => response.json())
  .catch((error) => {
    console.log(error)
  })
  .then((vesselsData) => {
    Object.entries(vesselsData).forEach((vessel) => {
      console.log(JSON.stringify(vessel))
      console.log(vessel[1].name)
      var title = document.createElement('h1')
      title.textContent = vessel[1].name
      body.appendChild(title)
      tableCreate(vessel[1])
    })
  })
