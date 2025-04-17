let backendUrl = "http://localhost:8000/";
//let backendUrl = "http://192.168.2.118:8000/";
let categorycounter = 1;

function getValues(message) {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        let values = request.response;
        console.log(message);
        console.log(values);
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
  let emptyCat = lastRow.insertCell(0);
  emptyCat.setAttribute("id", "catAddCell");
  emptyCat.setAttribute("colspan", "2");
  let url = lastRow.insertCell(1);
  url.setAttribute("class", "invisiCell");
  let butt = document.createElement("input");
  butt.setAttribute("id", "catButt");
  butt.setAttribute("type", "button");
  butt.setAttribute("onclick", 'addCategory("","")');
  butt.setAttribute("value", "+");
  emptyCat.appendChild(butt);
  let label = document.createElement("label");
  label.setAttribute("for", "catButt");
  label.innerHTML = "+";
  label.setAttribute("id", "catButtLabel");
  emptyCat.appendChild(label);
}

function addRow(key, index) {
  let table = document.getElementById("bigTable");
  let row = table.insertRow(index);
  let category = row.insertCell(0);
  let safeKey = safeSpaces(key);
  category.setAttribute("contenteditable", "true");

  // TODO onPress or keydown highlight table cell

  let catName = document.createElement("div");
  catName.setAttribute("class", "lefty");
  //catName.setAttribute("id", safeKey);
  category.setAttribute("id", safeKey);

  console.log("setting save button attributes");
  console.log("id set to " + safeKey);

  //let contentEdit = document.getElementById(safeKey);
  //if (contentEdit == null) {
  //  contentEdit = "";
  //} else {
  //  contentEdit = contentEdit.innerHTML;
  // }
  //console.log("textContent is " + contentEdit.textContent);
  //console.log("its innerHTML is " + contentEdit.innerHTML);
  //console.log("its string is " + contentEdit.string);

  catName.innerHTML = key;
  category.className = "category";
  category.setAttribute("colspan", "2");
  category.appendChild(catName);
  category.appendChild(
    createButton("trash", "catButt", false, "deleteCategory('" + safeKey + "')")
  );
  category.appendChild(
    createButton("save", "catButt", true, "addCategory('" + safeKey + "')")
  );
}
/*"addCategory('" +
safeKey +
"," +
"document.getElementById(" +
safeKey +
").innerText" +
"')"*/

function createButton(label, type, isLeft, onClickFunction) {
  let butt = document.createElement("input");
  butt.setAttribute("class", type);
  butt.setAttribute("type", "button");
  butt.setAttribute("onclick", onClickFunction);
  butt.setAttribute("value", label);

  let trash = document.createElement("img");
  trash.setAttribute("class", type);
  trash.setAttribute("src", "../static/trash.svg");
  let buttDiv = document.createElement("div");
  if (isLeft) {
    buttDiv.setAttribute("class", "lefty");
  } else {
    buttDiv.setAttribute("class", "righty");
  }

  buttDiv.appendChild(trash);
  buttDiv.appendChild(butt);

  return buttDiv;
}

function addCategory(category, newCategory) {
  let placeholderKey = "newCategory" + categorycounter;

  while (document.getElementById(placeholderKey)) {
    console.log("trying placeholderkey " + placeholderKey);
    categorycounter = categorycounter + 1;
    placeholderKey = "newCategory" + categorycounter;
  }

  let cat = category;
  let newCat = document.getElementById(category);
  //console.log(
  //  "newCat in addCategory for category " + category + " is " + newCat
  //);

  if (cat == "") {
    cat = placeholderKey;
  }
  if (newCat == null) {
    console.log("newCat was null");
    newCat = "";
  } else if (newCat.innerText == cat) {
    console.log("newCat was " + newCat.innerText + ", same as old cat");
    newCat = "";
  } else {
    console.log("newCat is " + newCat.innerText);
    newCat = newCat.innerText;
  }

  sendAddCategory(cat, newCat)
    .then((result) => sendWrite(result))
    .then(() => {
      categorycounter = categorycounter + 1;
    })
    .then(() => {
      // refreshing and updating values in frontend
      refresh("refreshed from file")
        .then(() => getValues("got values from data structure"))
        .then((result) => buildTable("adjusted table values", result));
    });
}

function addChannelUrl() {
  // TODO safespaces
}

function helloWorld(string) {
  if (string != null) {
    console.log("component is triggering :) " + string);
  } else {
    console.log("component is triggering :)");
  }
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

function sendAddCategory(category, newCategory) {
  let cleanNewCat = newCategory.replace(/[\n\r\t]/gm, "");
  console.log("wanted to change category " + category + " to " + newCategory);
  console.log("cleaning returns " + cleanNewCat);

  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        resolve(request.status);
      }
    };
    request.open("POST", backendUrl + "addCategory");
    console.log("add cat request incoming");
    console.log(request);
    // TODO comment back in if apostrophe breaks again
    //category = safeSpaces(category);
    console.log("adding category " + category);
    let body = '{"category":"' + category + '"';
    if (newCategory != "") {
      body = body + ',"newCategory":"' + cleanNewCat + '"';
    }
    request.setRequestHeader("Content-type", "application/json");
    console.log("request body for add/edit cat is next");
    request.send(body + "}");
  });
}

function safeSpaces(string) {
  string = string.replace(/['"]/g, "\\$&");
  return string.replace(/\s/g, "");
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
    console.log("del cat request incoming");
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
