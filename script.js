const form = document.querySelector("#cityForm");
const submitButton = document.querySelector("#submitButton");
const cityDropdown = document.querySelector("#cities");
const weatherContainer = document.querySelector(".search-result");
const previousResults = document.querySelector(".previous-results");
const errorPopup = document.querySelector(".error-popup");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const cityName = cityDropdown.options[cityDropdown.selectedIndex].value;

  if (cityName === "") {
    createErrorPopup("Wybierz miasto!");
  } else {
    fetch(`https://danepubliczne.imgw.pl/api/data/synops/stations/${cityName}`)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        if (
          res.stacja &&
          res.data_pomiaru &&
          res.temperatura &&
          res.cisnienie &&
          res.suma_opadu
        ) {
          errorPopup.style.visibility = "hidden";
          addToStorage(res);
          weatherContainer.innerHTML = fillSearchData(res);
          fillPreviousSearchData();
        } else {
          createErrorPopup("Brak danych do wyświetlenia.")
        }
      })
      .catch((error) => {
        console.log(error);
        createErrorPopup("Coś poszło nie tak.");
      });
  }
});

function fillSearchData(data) {
  return `<div class=" container search-result-container">
              <h2>${data.stacja}</h2>
              <h4>${data.data_pomiaru}</h4>
              <h3>${data.temperatura}°C</h3>
              <div class="row search-result-row">
                <div class="col search-result-col">
                  <p>Suma opadów</p>
                  <h3>${data.cisnienie}hPa</h3>
                </div>
                <div class="col search-result-col">
                  <p>Suma opadu</p>
                  <h3>${data.suma_opadu}mm</h3>
                </div>
              </div>
            </div>`;
}

function fillPreviousSearchData() {
  previousResults.innerHTML = "";
  const storedData = JSON.parse(localStorage.getItem("storage")) || [];

  const headerElement = document.createElement("h2");
  headerElement.textContent = "Poprzednio wyszukiwane:";
  previousResults.appendChild(headerElement);

  const scrollableElement = document.createElement("div");
  scrollableElement.classList.add("scrollable-wrapper", "container");

  storedData.forEach((element) => {
    const divElement = document.createElement("div");
    divElement.classList.add('previous-results-item', 'row')
    divElement.innerHTML = `
              <div class="col col-lg-2 col-12 previous-results-data-col">
                <h2>${element.stacja}</h2>
              </div>
              <div class="col col-lg-2 col-12 previous-results-data-col">
                <p>Data pomiaru</p>
                <h4>${element.data_pomiaru}°C</h4>
              </div>
              <div class="col col-lg-2 col-12 previous-results-data-col">
                <p>Temperatura</p>
                <h4>${element.temperatura}°C</h4>
              </div>
              <div class="col col-lg-2 col-12 previous-results-data-col">
                <p>Suma opadów</p>
                <h4>${element.suma_opadu}mm</h4></div>
              <div class="col col-lg-2 col-12 previous-results-data-col">
                <p>Ciśnienie</p>
                <h4>${element.cisnienie}hPa</h4>
              </div>
              `;
    scrollableElement.appendChild(divElement);
  });
  previousResults.appendChild(scrollableElement);
}

function createErrorPopup(message) {
  errorPopup.style.visibility = "visible";
  errorPopup.textContent = message;
}

function addToStorage(data) {
  const storedData = JSON.parse(localStorage.getItem("storage")) || [];
  const newStoredData = JSON.stringify([data, ...storedData]);

  localStorage.setItem("storage", newStoredData);
}
