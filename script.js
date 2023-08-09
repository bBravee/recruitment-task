const form = document.querySelector(".city-form");
const cityDropdown = document.querySelector(".form-select");
const weatherContainer = document.querySelector(".search-result");
const previousResults = document.querySelector(".previous-results");
const errorPopup = document.querySelector("#errorPopup");

form.addEventListener("submit", formSubmitHandler);

function formSubmitHandler(event) {
  event.preventDefault();

  const cityName = cityDropdown.options[cityDropdown.selectedIndex].value;

  fetch(`https://danepubliczne.imgw.pl/api/data/synop/station/${cityName}`)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      checkAndAddData(res, cityName);
    })
    .catch((error) => {
      console.log(error);
      createErrorPopup("Coś poszło nie tak.");
    });
}

function checkAndAddData(data, cityName) {
  if (cityName !== "") {
    if (
      data.stacja &&
      data.data_pomiaru &&
      data.temperatura &&
      data.cisnienie &&
      data.suma_opadu
    ) {
      addToStorage(data);
      fillSearchData(data);
      fillPreviousSearchData();
    } else {
      createErrorPopup("Brak danych do wyświetlenia.");
    }
  } else {
    createErrorPopup("Wybierz miasto!");
  }
}

function addToStorage(data) {
  const storedData = JSON.parse(localStorage.getItem("storage")) || [];
  const newStoredData = JSON.stringify([data, ...storedData]);

  localStorage.setItem("storage", newStoredData);
}

function fillSearchData(data) {
  weatherContainer.innerHTML = "";
  const divElement = document.createElement("div");
  divElement.classList.add("container", "search-result-container");
  divElement.innerHTML = `
              <h2>${data.stacja}</h2>
              <h4>${data.data_pomiaru}</h4>
              <h3>${data.temperatura}°C</h3>
              <div class="row search-result-row">
                <div class="col search-result-col">
                  <p>Ciśnienie</p>
                  <h3>${data.cisnienie}hPa</h3>
                </div>
                <div class="col search-result-col">
                  <p>Suma opadu</p>
                  <h3>${data.suma_opadu}mm</h3>
                </div>
              </div>
              `;
  weatherContainer.appendChild(divElement);
}

function fillPreviousSearchData() {
  previousResults.innerHTML = "";
  const storedData = JSON.parse(localStorage.getItem("storage")) || [];

  const headerElement = document.createElement("h2");
  headerElement.textContent = "Poprzednio wyszukiwane:";

  if (storedData.length >= 2) {
    previousResults.appendChild(headerElement);
  }

  const scrollableElement = document.createElement("div");
  scrollableElement.classList.add("scrollable-wrapper", "container");

  for (i = 1; i < storedData.length; i++) {
    const divElement = document.createElement("div");
    divElement.classList.add("previous-results-item", "row");
    divElement.innerHTML = `
                <div class="col col-lg-2 col-12 previous-results-col">
                  <h2>${storedData[i].stacja}</h2>
                </div>
                <div class="col col-lg-2 col-12 previous-results-col">
                  <p>Data pomiaru</p>
                  <h4>${storedData[i].data_pomiaru}°C</h4>
                </div>
                <div class="col col-lg-2 col-12 previous-results-col">
                  <p>Temperatura</p>
                  <h4>${storedData[i].temperatura}°C</h4>
                </div>
                <div class="col col-lg-2 col-12 previous-results-col">
                  <p>Suma opadów</p>
                  <h4>${storedData[i].suma_opadu}mm</h4></div>
                <div class="col col-lg-2 col-12 previous-results-col">
                  <p>Ciśnienie</p>
                  <h4>${storedData[i].cisnienie}hPa</h4>
                </div>
                `;
    scrollableElement.appendChild(divElement);
  }
  previousResults.appendChild(scrollableElement);
}

function createErrorPopup(message) {
  errorPopup.textContent = message;
  errorPopup.style.opacity = "1";

  setTimeout(() => (errorPopup.style.opacity = "0"), 2500);
}


