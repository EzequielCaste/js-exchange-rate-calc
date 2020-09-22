const select1 = document.querySelector("#currency1");
const select2 = document.querySelector("#currency2");
const numberInput = document.querySelector("#amount");
const rateFx = document.querySelector("#rate");
const resultLabel = document.querySelector("#display");
const swap = document.querySelector("#swap");

let url = "https://api.exchangerate-api.com/v4/latest/";

fillCountryCodes(url + "USD");

function fillCountryCodes(url) {
  sessionStorage.clear();
  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      let dataArray = Object.entries(myJson.rates);
      fillSelectOptions(select1, dataArray);
      fillSelectOptions(select2, dataArray);
      select2.selectedIndex = 2;
      updateLocalStorage(dataArray);
      displayFxRate();
      displayResult();
    });
}
function updateLocalStorage(newData) {
  newData.forEach(item => {
    sessionStorage.setItem(item[0], item[1]);
  });
}

function fillSelectOptions(select, namesRates) {
  namesRates.forEach(item => {
    let opt = createNode("option");
    setInnerText(opt, item[0]);
    append(select, opt);
  });
}

function setInnerText(el, text) {
  return (el.innerText = text);
}
function createNode(element) {
  return document.createElement(element);
}
function append(parent, el) {
  return parent.appendChild(el);
}

select1.addEventListener("change", function() {
  getNewData(this.selectedOptions[0].innerText);
});
select2.addEventListener("change", function() {
  displayFxRate();
  displayResult();
});
numberInput.addEventListener("input", function() {
  displayFxRate();
  displayResult();
});
swap.addEventListener("click", function() {
  let pos1 = select1.selectedIndex;
  let pos2 = select2.selectedIndex;

  select1.selectedIndex = pos2;
  select2.selectedIndex = pos1;
  getNewData(select1.selectedOptions[0].innerText);
});

function getNewData(country) {
  sessionStorage.clear();
  fetch(url + country)
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      let data = Object.entries(myJson.rates);
      updateLocalStorage(data);
      displayFxRate();
      displayResult();
    });
}

function displayFxRate() {
  rateFx.innerText = `1 ${select1.selectedOptions[0].innerText} = ${
    sessionStorage[select2.value]
  } ${select2.selectedOptions[0].innerText}`;
}

function displayResult() {
  resultLabel.value = (
    numberInput.value * sessionStorage[select2.value]
  ).toFixed(2);
}
