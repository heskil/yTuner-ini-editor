let backendUrl = "http://localhost:8000/";
//let backendUrl = "http://192.168.2.118:8000/";

function getValues(message) {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        let values = request.response;
        console.log(message);
        resolve(values);
      }
    };
    request.open("GET", backendUrl + "/getValues");
    request.send();
  });
}

function openPathDialog() {
  let div = document.getElementById("pathPopUp");

  let textBox = document.createElement("paragraph");
  textBox.innerHTML = "enter the full path to the stations.ini file";
  div.appendChild(textBox);

  let form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "javascript:setPath()");

  var path = document.createElement("input");
  path.setAttribute("type", "text");
  path.setAttribute("name", "filepath");
  path.setAttribute("placeholder", "/home/Documents/stations.ini");

  var submit = document.createElement("input");
  submit.setAttribute("type", "submit");
  submit.setAttribute("value", "Submit");

  form.appendChild(path);
  form.appendChild(submit);
  div.appendChild(form);
}

function setPath() {
  // TODO send new path to backend, wait if valid, update with error if not
  let div = document.getElementById("pathPopUp");
  console.log("path is being sent to backend, result tbd");
  // if all went right just throw response back to user
  div.innerHTML = "";
  let par = document.createElement("paragraph");
  par.innerHTML = "set path to " + "/placeholder/path/stations.ini";
  div.appendChild(par);
  // if error: make new element that says sth went wrong
}

async function handleRefresh() {
  var a = await refresh();
  console.log("result a incoming");
  var b = a.then(getValues());
}

function buildTable(message, values) {
  let table = document.getElementById("bigTable");
  let json = "";
  console.log("top of build table");
  console.log("passed value was");
  console.log(values);

  json = JSON.parse(values);

  console.log("json");
  console.log(json);
  console.log("keys:");
  console.log(Object.keys(json));

  let keys = Object.keys(json);
  /*for (let cat in keys) {
    let row = table.insertRow();
    let category = row.insertCell(0);
    category.innerHTML = keys[cat];

    let listInCat = json[cat];
    console.log("list of vals in cat");
    console.log(listInCat);
    for (let channelPair in listInCat) {
      let row = table.insertRow();
      let channel = row.insertCell(0);
      let url = row.insertCell(1);
      channel.innerHTML = channelPair[0];
      url.innerHTML = channelPair[1];
    }
  } */
  keys.forEach(function (key) {
    let row = table.insertRow();
    let category = row.insertCell(0);
    row.insertCell(1);
    category.innerHTML = key;
    category.className = "category";

    for (let line of json[key]) {
      let row = table.insertRow();
      let channel = row.insertCell(0);
      let url = row.insertCell(1);
      channel.innerHTML = line[0];
      url.innerHTML = line[1];
    }
    //console.log("Key : " + key + ", Value : " + values[key]);
  });
}

/* function insertRow() {
  let table = document.getElementById("bigTable");
  let row = table.insertRow();
  let channel = row.insertCell(0);
  let url = row.insertCell(1);
  channel.innerHTML = "bigBlueSwing";
  url.innerHTML = "http://bigblueswing.com";
} */

function refresh(message) {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        console.log(message);
        resolve();
      }
    };
    request.open("GET", backendUrl + "/refresh");
    request.send();
  });
}

// refreshing and updating values in frontend
refresh("refreshed from file")
  .then(() => getValues("got values from data structure"))
  .then((result) => buildTable("adjusted table values", result));
