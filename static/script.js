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

  getPath().then((result) => {
    path.setAttribute("placeholder", result);

    var submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "Submit");

    form.appendChild(path);
    form.appendChild(submit);
    div.appendChild(form);
  });
}

function getPath() {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        resolve(request.responseText);
      }
    };
    request.open("GET", backendUrl + "getPath");
    request.send();
  });
}

function setPath() {
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

  sendPath(data)
    .then((result) => buildPathResponse(result))
    .then(refresh("refreshed from file"))
    .then(() => getValues("got values from data structure"))
    .then((result) => buildTable("adjusted table values", result));
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

function buildTable(message, values) {
  console.log(message);
  let table = document.getElementById("bigTable");
  table.innerHTML = "";
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
  // index for tracking place in table rows
  let index = 0;
  keys.forEach(function (key) {
    addRow(key, index);
    index = index + 1;
    for (let line of json[key]) {
      let row = table.insertRow(index);
      index = index + 1;
      row.setAttribute("class", "celly");
      let channel = row.insertCell(0);
      let url = row.insertCell(1);
      channel.innerHTML = line[0];
      channel.setAttribute("class", "celly");
      url.innerHTML = line[1];
      url.setAttribute("class", "celly");
    }
  });

  createLastRow(table);
}

function createLastRow() {
  let table = document.getElementById("bigTable");
  // adds last category row
  lastRow = table.insertRow();
  lastRow.setAttribute("id", "lastRowCatAdder");
  let channel = lastRow.insertCell(0);
  channel.setAttribute("id", "catAddCell");
  let url = lastRow.insertCell(1);
  url.setAttribute("class", "invisiCell");
  let butt = document.createElement("input");
  butt.setAttribute("id", "catButt");
  butt.setAttribute("type", "button");
  butt.setAttribute("onclick", "addCategory()");
  butt.setAttribute("value", "+");
  channel.appendChild(butt);
  let label = document.createElement("label");
  label.setAttribute("for", "catButt");
  label.innerHTML = "+";
  label.setAttribute("id", "catButtLabel");
  channel.appendChild(label);
}

function addRow(key, index) {
  let table = document.getElementById("bigTable");
  let row = table.insertRow(index);
  let category = row.insertCell(0);
  let butt = document.createElement("input");
  butt.setAttribute("class", "catButt");
  butt.setAttribute("type", "button");
  butt.setAttribute("onclick", "deleteCategory('" + key + "')");
  butt.setAttribute("value", "trash");

  let trash = document.createElement("img");
  trash.setAttribute("class", "trash");
  trash.setAttribute("src", "../static/trash.svg");

  row.insertCell(1);

  let catName = document.createElement("div");
  catName.setAttribute("class", "lefty");
  let buttDiv = document.createElement("div");
  buttDiv.setAttribute("class", "righty");
  buttDiv.appendChild(trash);
  buttDiv.appendChild(butt);
  catName.innerHTML = key;
  category.className = "category";
  category.appendChild(catName);
  category.appendChild(buttDiv);
}

function addCategory() {
  let table = document.getElementById("bigTable");
  // TODO set to new input field
  // TODO add cancel button
  lastRow = document.getElementById("lastRowCatAdder");
  let index = lastRow.rowIndex;
  let newRow = table.insertRow(index);
  let placeholderKey = "newCat";
  addRow(placeholderKey, index);
}

function helloWorld() {
  console.log("component is triggering :)");
}

function createChannelUrlMask(key) {
  // TODO implement (throw this into other function)
  var formData = new FormData(document.getElementById(key + "AddChannel"));
  console.log("data from form is ");
  console.log(formData.entries("filepath"));
  console.log("path is being sent to backend, result tbd");
}

function deleteCategory(category) {
  console.log("deleting category " + category);
  sendDeleteCategory(category)
    .then((result) => sendWrite(result))
    .then(() => {
      // refreshing and updating values in frontend
      refresh("refreshed from file")
        .then(() => getValues("got values from data structure"))
        .then((result) => buildTable("adjusted table values", result));
    });
}

function sendWrite() {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        resolve();
      }
    };
    request.open("POST", backendUrl + "writeFile");
    request.send();
  });
}

function sendDeleteCategory(category) {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        resolve(request.status);
      }
    };
    request.open("POST", backendUrl + "deleteCategory");
    console.log("request incoming");
    console.log(request);
    request.setRequestHeader("Content-type", "application/json");
    request.send('{"category":"' + category + '"}');
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
