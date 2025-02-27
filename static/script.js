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

// TODO FIX! makes multiple instances!
function openPathDialog() {
  let div = document.getElementById("pathPopUp");
  div.innerHTML = "";

  let textBox = document.createElement("paragraph");
  textBox.innerHTML = "enter the full path to the stations.ini file";
  div.appendChild(textBox);

  let form = document.createElement("form");
  form.setAttribute("id", "pathForm");
  form.setAttribute("method", "post");
  form.setAttribute("action", "javascript:setPath()");

  var path = document.createElement("input");
  path.setAttribute("type", "text");
  path.setAttribute("name", "filepath");
  // TODO set placeholder value to actual value
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
  var formData = new FormData(document.getElementById("pathForm"));
  console.log("data from form is ");
  console.log(formData.entries("filepath"));
  console.log("path is being sent to backend, result tbd");

  // only one value
  let data = "";
  for (let keyValue of formData.entries()) {
    data = keyValue[1];
  }

  sendPath(data).then((result) => buildPathResponse(result));
}

function buildPathResponse(result) {
  let div = document.getElementById("pathPopUp");
  // gives feedback about path status to user
  div.innerHTML = "";
  let par = document.createElement("paragraph");
  par.innerHTML = result;
  div.appendChild(par);
}

function sendPath(formData) {
  console.log("sending this data to backend");
  console.log(formData);
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        //
        if (request.status == 200) {
          resolve("set path to " + request.responseText);
        } else {
          resolve("could not find stations.ini at this location");
        }
      }
    };
    request.open("POST", backendUrl + "setPath");
    request.setRequestHeader("Content-type", "application/json");
    request.send('{"path":"' + formData + '"}');
  });
}

function createTableFormRow() {
  // TODO make functon so code is cleaner
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
