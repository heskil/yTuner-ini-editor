let backendUrl = "http://localhost:8000/";

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
