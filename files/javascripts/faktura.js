euroRate = 26.5;

function buildRow(faktura) {
  const vystaveno = getDate(faktura, "Vystaveno");

  let zaznam = `${getText(faktura, "Doklad")},`;
  zaznam += `'${vystaveno}',`;
  zaznam += `'${getDate(faktura, "Splatno")}',`;
  let eshop = "k";
  document.getElementsByName("eshop").forEach((radio) => {
    if (radio.checked) eshop = radio.value;
  });
  zaznam += `'` + eshop + `${getText(faktura, "Doklad")}',`;
  zaznam += `'E','P',`;
  zaznam += `'v${getText(faktura, "VarSymbol")}',`;
  zaznam += `'` + eshop + `${getText(faktura, "Doklad")}',`;
  zaznam += "'PZ','prodej zbo" + String.fromCharCode(167, 161) + " - e-shop'," + `1,`;
  euroRate = getNumber(faktura, "Kurs");
  zaznam += addCurrencyTextPart(faktura);
  zaznam += `'${vystaveno}',`;
  zaznam += `'U',`;
  zaznam += `'${vystaveno}',`;

  zaznam += `${appendPrices(faktura)}`;
  zaznam += "\r\n";

  return zaznam;
}

function addCurrencyTextPart(faktura) {
  var celkem = getNumber(faktura, "Celkem");
  if (celkem === null) return String.fromCharCode(39, 75, 159, 39) + `,1,`;
  else return `'EUR'` + `,${euroRate},` + `${celkem},`;
}

function appendPrices(faktura) {
  let prices = computePrices(faktura);
  let result = `${prices.basePrices.get(21)},${prices.baseTaxes.get(21)},`;
  result += `${prices.basePrices.get(15)},${prices.baseTaxes.get(15)},${prices.basePrices.get(10)},`;
  result += `${prices.baseTaxes.get(10)},${prices.total().toFixed(2).replace(/\.0+$/, "")}`;
  return result;
}

function computePrices(faktura) {
  // CENA21 DAN21 CENA15 DAN15 CENA10 DAN10 PRICEFULL
  let seznamPolozek = faktura.querySelector("SeznamPolozek");
  if (seznamPolozek != null) {
    let polozky = seznamPolozek.querySelectorAll("Polozka");
    var allPrices = [...polozky].map(computeForElement);
    return Price.getFullPrice(allPrices);
  } else {
    return Price.getFullPrice([new Price(0, 0, 0, 0)]);
  }

  function computeForElement(polozka) {
    let sazba = getNumber(polozka, "SazbaDPH");
    let pocet = getNumber(polozka, "PocetMJ");
    let cena = getNumber(polozka, "Cena");
    if (cena === null) cena = getValuty(polozka);
    return new Price(getText(polozka, "Popis"), pocet, cena, sazba);
  }
}

class CustomMap extends Map {
  get(key) {
    if (super.get(key) == 0) return "";
    else return super.get(key);
  }
}

class Price {
  constructor(name, quantity, price, rate) {
    this.name = name;
    this.taxedPrice = this.calculatePrice(quantity, price, rate);
    this.taxTotal = this.calculateTax(quantity, price, rate);
    this.taxRate = rate;
  }

  static getFullPrice(prices) {
    return {
      basePrices: new CustomMap([
        [10, sumPrices(prices, 10)],
        [15, sumPrices(prices, 15)],
        [21, sumPrices(prices, 21)],
      ]),
      baseTaxes: new CustomMap([
        [10, sumTaxes(prices, 10)],
        [15, sumTaxes(prices, 15)],
        [21, sumTaxes(prices, 21)],
      ]),
      total() {
        return [...this.basePrices.values()].reduce((x, y) => x + parseFloat(y), 0) + [...this.baseTaxes.values()].reduce((x, y) => x + parseFloat(y), 0);
      },
    };
  }
  calculatePrice(quantity, price, rate) {
    return Math.round(((quantity * price) / (100 + rate)) * 100 * 100) / 100;
  }
  calculateTax(quantity, price, rate) {
    return Math.round(((quantity * price) / (100 + rate)) * rate * 100) / 100;
  }
}

function getValuty(polozka) {
  return +(Math.round(getNumber(polozka, "Valuty") * euroRate + "e+2") + "e-2");
}

function sumTaxes(prices, rate) {
  return roundNumber(prices.filter((x) => x.taxRate == rate).reduce((x, y) => x + y.taxTotal, 0));
}

function sumPrices(prices, rate) {
  return roundNumber(prices.filter((x) => x.taxRate == rate).reduce((x, y) => x + y.taxedPrice, 0));
}

function roundNumber(number) {
  return parseFloat(number).toFixed(2).replace(/\.0+$/, "");
}

function getDate(node, key) {
  return formatDate(new Date(node.querySelector(key).textContent));
}

function getText(node, key) {
  return node.querySelector(key).textContent;
}

function getNumber(node, key) {
  var value = node.querySelector(key);
  if (value) return parseFloat(value.textContent);
  else return null;
}

function formatDate(d) {
  var month = d.getMonth();
  var day = d.getDate().toString();
  var year = d.getFullYear();
  year = year.toString().substr(-2);
  month = (month + 1).toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  if (day.length === 1) {
    day = "0" + day;
  }
  return day + "." + month + "." + year;
}

(function (window) {
  function triggerCallback(e, callback) {
    if (!callback || typeof callback !== "function") {
      return;
    }
    var files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    callback.call(null, files);
  }
  function makeDroppable(ele, callback) {
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("multiple", false);
    input.style.display = "none";
    input.addEventListener("change", function (e) {
      readFile(input);
    });
    ele.appendChild(input);

    ele.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.stopPropagation();
      ele.classList.add("dragover");
    });

    ele.addEventListener("dragleave", function (e) {
      e.preventDefault();
      e.stopPropagation();
      ele.classList.remove("dragover");
    });

    ele.addEventListener("drop", function (e) {
      e.preventDefault();
      e.stopPropagation();
      ele.classList.remove("dragover");
      triggerCallback(e, callback);
    });

    ele.addEventListener("click", function () {
      input.value = null;
      input.click();
    });
  }
  window.makeDroppable = makeDroppable;
})(this);

(function (window) {
  makeDroppable(window.document.querySelector(".demo-droppable"), function (files) {
    console.log(files);
    readData(files[0]);
  });
})(this);

function readFile(fileInput) {
  const file = fileInput.files[0];
  readData(file);
}

function getToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  return yyyy + mm + dd;
}

function download(filename, text) {
  output = encodeURIComponent(text).replace(/%C2/g, "");
  var element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=CP852," + output);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function readData(file) {
  const reader = new FileReader();
  reader.onloadend = function () {
    const data = reader.result;
    const xmlDocument = new DOMParser().parseFromString(data, "application/xml");
    let result = [...xmlDocument.querySelectorAll("FaktVyd")].map(buildRow);
    let resultFile = ``;
    result.forEach(function (zaznam) {
      resultFile += `${zaznam}`;
      document.getElementById("demo").insertAdjacentHTML("afterend", zaznam);
      document.getElementById("demo").insertAdjacentHTML("afterend", "<br/>");
    });
    download(getToday() + "ESHOP.TXT", resultFile);
  };
  reader.readAsText(file);
}

var text = "Faktura1.2";
var canvas = document.createElement("canvas");
var fontSize = 30;
canvas.setAttribute("height", fontSize);
canvas.setAttribute("width", (text.length * fontSize) / 2 - 5);
var context = canvas.getContext("2d");
context.fillStyle = "#e5f3f7";
context.font = fontSize + "px sans-serif";
context.fillText(text, 0, fontSize);

document.querySelector("#background").style = "background-image : url(" + canvas.toDataURL("image/png") + ")";
