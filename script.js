const form = document.querySelector("#cityForm");
const submitButton = document.querySelector("#submitButton");
const cityDropdown = document.querySelector("#cities");
const weatherContainer = document.querySelector(".search-result");
const previousResults = document.querySelector(".previous-results");

// Listener formluarza
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const cityName = cityDropdown.options[cityDropdown.selectedIndex].value;

  if (cityName === "none") {
    alert("Invalid Input!");
  } else {
    fetch(`https://danepubliczne.imgw.pl/api/data/synop/station/${cityName}`)
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
          addToStorage(res);
          weatherContainer.innerHTML = fillData(res);
          fillPrevious();
        } else {
          alert("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

// Tworzy divy i wypełnia danymi z API
function fillData(data) {
    return `<div class="search-result-container">
                    <p>${data.stacja}</p>
                    <p>${data.data_pomiaru}</p>
                    <p>${data.temperatura}</p>
                    <p>${data.cisnienie}</p>
                    <p>${data.suma_opadu}</p>
                </div>`;
}

function fillPrevious() {
  previousResults.innerHTML = "";

  JSON.parse(localStorage.getItem("storage")).forEach((element) => {
    const paragraphElement = document.createElement("h5");
    paragraphElement.textContent = element.stacja;

    previousResults.appendChild(paragraphElement);
  });
  previousResults.innerHTML = tags;
}

// Zapisuje do stora
function addToStorage(data) {
  const storedData = JSON.parse(localStorage.getItem("storage")) || [];
  const newStoredData = JSON.stringify([data, ...storedData]);

  localStorage.setItem("storage", newStoredData);
}
