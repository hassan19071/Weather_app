// use weather api;
let city = document.querySelector(".name span");
let temperature = document.querySelector(".temperature span");
let humidity = document.querySelector(".humidity span");
let windSpeed = document.querySelector(".wind span");
let pressure = document.querySelector(".pressure span");
let visibility = document.querySelector(".visibility span");
let skyCondition = document.querySelector(".weather-condition");
let conditionImg = document.querySelector(".condition img");
let warnMsg = document.querySelector(".warn");
let circleLoading = document.querySelector(".circle");
let countryName = document.querySelector(".name strong");
let cityName = "Minya";
let today = document.querySelector(".date span");
let cityInForecast = document.querySelector(".forecast-container .title span");
let daysContainer = document.querySelector(".forecast-container .days");
let forecastDays = [];
let loadingForecast = document.querySelector(".forecast-container .loading");

// get api for weather by fetch;
async function weatherApi() {
  circleLoading.style.display = "block";
  let weatherRequest = await fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=aebbb4c0af804d9c81e9fa0f9915dd7f&days=7`,
    {
      method: "get",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "keep-alive": "timeout=5",
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      temperature.innerHTML = Math.round(data.data[0].temp);
      skyCondition.innerHTML = data.data[0].weather.description;
      humidity.innerHTML = data.data[0].rh;
      windSpeed.innerHTML = data.data[0].wind_spd.toFixed(2);
      pressure.innerHTML = data.data[0].pres.toFixed(0);
      visibility.innerHTML = data.data[0].vis.toFixed(0);
      today.innerHTML = data.data[0].datetime;
      conditionImg.src = `imgs/${data.data[0].weather.icon}.png`;
      cityInForecast.innerHTML = data.city_name;
      forecastDays = [...data.data];
      if (data.city_name) {
        city.innerHTML = data.city_name;
        countryName.innerHTML = data.country_code;
        warnMsg.style.display = "none";
        circleLoading.style.display = "none";
        localStorage.setItem("weather-condition", cityName);
        loadingForecast.style.display = "none";
      }
    })
    .catch((err) => {
      city.innerHTML = "invalid place";
      warnMsg.style.display = "block";
      circleLoading.style.display = "none";
      console.log(new Error(err + " invalid place"));
    });

  let filterDays = forecastDays.filter((day, ind) => {
    return ind !== 0;
  });
  daysContainer.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    let dayCon = document.createElement("div");
    let dateSpan = document.createElement("span");
    let date = document.createElement("span");
    let conditionForecast = document.createElement("div");
    let img = document.createElement("img");
    let status = document.createElement("span");
    let temp = document.createElement("span");
    let statusText = document.createTextNode(filterDays[i].weather.description);
    let tempText = document.createTextNode(parseInt(filterDays[i].temp) + "°C");
    let da = new Date(filterDays[i].datetime);
    let dayName = "";
    switch (da.getDay()) {
      case 0:
        dayName = "Sun";
        break;
      case 1:
        dayName = "Mon";
        break;
      case 2:
        dayName = "Tues";
        break;
      case 3:
        dayName = "Wed";
        break;
      case 4:
        dayName = "Thurs";
        break;
      case 5:
        dayName = "Fri";
        break;
      case 6:
        dayName = "Sat";
        break;
      default:
        break;
    }
    // add class;
    dayCon.classList.add("day");
    conditionForecast.classList.add("condition-forecast");
    date.innerHTML = dayName;
    dateSpan.appendChild(date);
    img.setAttribute("src", `imgs/${filterDays[i].weather.icon}.png`);
    img.setAttribute("alt", "weather condition");
    status.appendChild(statusText);
    conditionForecast.appendChild(img);
    conditionForecast.appendChild(status);
    temp.appendChild(tempText);
    dayCon.appendChild(dateSpan);
    dayCon.appendChild(conditionForecast);
    dayCon.appendChild(temp);
    daysContainer.appendChild(dayCon);
  }
}

let inputField = document.querySelector(".search-field");
let searchBtn = document.querySelector(".search-btn");

// when we click on search btn to get weather for any city we want;
searchBtn.addEventListener("click", () => {
  if (inputField.value.trim()) {
    cityName = inputField.value;
    localStorage.setItem("weather-info", cityName);
    weatherApi();
  }

  inputField.value = "";
});

// use enter key in keyboard to make search without go to click on btn;

inputField.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    searchBtn.click();
  }
});

// close and open forecast list
let showBtn = document.querySelector(".weather-app .show-more span");
let closeBtn = document.querySelector(".forecast-container .close");
let forecastContainer = document.querySelector(".forecast-container");

showBtn.addEventListener("click", () => {
  forecastContainer.classList.remove("close");
  document.body.classList.add("hidden");
});
closeBtn.addEventListener("click", () => {
  forecastContainer.classList.add("close");
  document.body.classList.remove("hidden");
});

// change mode
let inputChanger = document.querySelector(".mode input");

function changeMode() {
  let mode = "";
  if (inputChanger.checked) {
    document.body.classList.add("dark");
    mode = "dark";
  } else {
    document.body.classList.remove("dark");
    mode = "ligth";
  }
  localStorage.setItem("checked", mode);
}
inputChanger.addEventListener("change", changeMode);

// save changes even after reload;

window.addEventListener("load", () => {
  nameC = localStorage.getItem("weather-condition");
  cityName = nameC;
  if (localStorage.getItem("checked") === "dark") {
    inputChanger.checked = true;
  } else {
    inputChanger.checked = false;
  }
  changeMode();
  weatherApi();
  document.querySelector(".loading-page").style.display = "none";
});
