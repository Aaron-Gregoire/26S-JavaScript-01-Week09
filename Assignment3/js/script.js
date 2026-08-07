const studentTag = document.getElementById("student-tag");
studentTag.textContent = "Aaron Gregoire - 200605201";

// the base url for the API
// docs: https://www.albion-online-data.com/api/
const baseURL = "https://west.albion-online-data.com/api/v2/stats/prices/";
const iconBaseURL = "https://render.albiononline.com/v1/item/";
const cities = "Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling";
let url;

const itemSelect = document.getElementById("item-select");
const customField = document.getElementById("custom-field");
const itemCustom = document.getElementById("item-custom");
const qualitySelect = document.getElementById("quality-select");
const checkBtn = document.getElementById("check-btn");
const statusEl = document.getElementById("status");
const resultSection = document.getElementById("result");
const itemIcon = document.getElementById("item-icon");
const itemName = document.getElementById("item-name");
const itemMeta = document.getElementById("item-meta");
const ledgerTable = document.getElementById("ledger-table");


//show orhide the custom item field depending on the dropdown
itemSelect.addEventListener("change", function () {
  customField.hidden = (itemSelect.value !== "custom");
});


checkBtn.addEventListener("click", function () {
  fetchPrices();
});

function fetchPrices() {
//figure out what item id to search for
  let itemId;
  if (itemSelect.value === "custom") {
    itemId = itemCustom.value.trim();
  } else {
    itemId = itemSelect.value;
  }

  if (itemId === "") {
    statusEl.textContent = "enter an item id first.";
    return;
  }

  let quality = qualitySelect.value;

  url = `${baseURL}${itemId}.json?locations=${cities}&qualities=${quality}`;
  console.log(url);

  statusEl.textContent = "fetching prices";
  resultSection.hidden = true;

 //request data from api then send the json to the display results function
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      displayResults(itemId, json);
    })
    .catch((error) => {
      console.log(error);
      statusEl.textContent = "something went wrong fetching the data";
    });
}

function displayResults(itemId, json) {
  //log results to the console
  console.log(json);

  if (json === null || json.length === 0) {
    statusEl.textContent = "no market data found for that item/quality.";
    return;
  }

  statusEl.textContent = "";

  //fill in item icon name and meta info
  itemIcon.src = `${iconBaseURL}${itemId}.png?size=64`;
  itemIcon.alt = itemId;
  itemName.textContent = itemId.replaceAll("_", " ");
  itemMeta.textContent = `${json.length} city price points returned`;

  // clear old results
  while (ledgerTable.firstChild) {
    ledgerTable.removeChild(ledgerTable.firstChild);
  }

  // find cheapest price to highlight the best deal
  // scale each bar relitive to the most expensive city
  let lowestPrice = 0;
  let highestPrice = 0;

  for (let i = 0; i < json.length; i++) {
    let price = json[i].sell_price_min;
    if (price > 0) {
      if (lowestPrice === 0 || price < lowestPrice) {
        lowestPrice = price;
      }
      if (price > highestPrice) {
        highestPrice = price;
      }
    }
  }

  //one row per city and append it to page
  for (let i = 0; i < json.length; i++) {
    let entry = json[i];
    let price = entry.sell_price_min;

    let row = document.createElement("div");
    row.className = "ledger-row";
    if (price > 0 && price === lowestPrice) {
      row.classList.add("best");
    }

    let cityLabel = document.createElement("span");
    cityLabel.className = "ledger-city";
    cityLabel.textContent = entry.city;

    let track = document.createElement("div");
    track.className = "ledger-bar-track";

    let fill = document.createElement("div");
    fill.className = "ledger-bar-fill";
    if (price > 0 && highestPrice > 0) {
      fill.style.width = (price / highestPrice) * 100 + "%";
    } else {
      fill.style.width = "0%";
    }
    track.appendChild(fill);

    let priceLabel = document.createElement("span");
    priceLabel.className = "ledger-price";
    priceLabel.textContent = price > 0 ? price.toLocaleString() : "no data";

    row.appendChild(cityLabel);
    row.appendChild(track);
    row.appendChild(priceLabel);
    ledgerTable.appendChild(row);
  }

  resultSection.hidden = false;
}

// adapted from the Albion Online Data Project API documentation
// https://www.albion-online-data.com/api/