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
    let butt = document.createElement("input");
    butt.setAttribute("class", "catButt");
    butt.setAttribute("type", "button");
    butt.setAttribute("onclick", "deleteCategory()");
    butt.setAttribute("value", "trash");
    // TODO change placeholder

    let trash = document.createElement("img");
    trash.setAttribute("class", "trash");
    trash.setAttribute("src", "../static/trash.svg");

    row.insertCell(1);
    //              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    //              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    //          <g id="SVGRepo_iconCarrier">
    //              <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
    //              stroke="#000000"
    //              stroke-width="2"
    //              stroke-linecap="round" stroke-linejoin="round">
    //              </path>
    //          </g>
    // </svg>

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

    for (let line of json[key]) {
      let row = table.insertRow();
      row.setAttribute("class", "celly");
      let channel = row.insertCell(0);
      let url = row.insertCell(1);
      channel.innerHTML = line[0];
      channel.setAttribute("class", "celly");
      url.innerHTML = line[1];
      url.setAttribute("class", "celly");
    }
    //console.log("Key : " + key + ", Value : " + values[key]);
  });
}

function deleteCategory() {
  // TODO trash category
  console.log("not implemented");
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
