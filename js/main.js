// use weather api;
let city = document.querySelector(".name span");
let temperature = document.querySelector(".temperature span");
let humidity = document.querySelector(".humidity span");
let windSpeed = document.querySelector(".wind span");
let skyCondition = document.querySelector(".weather-condition");
let conditionImg = document.querySelector(".condition img");
let warnMsg = document.querySelector(".warn");
let circleLoading = document.querySelector(".circle");
let countryName = document.querySelector(".name small");
var cityName = "Minya";

// get api for weather by fetch;
async function weatherApi() {
  circleLoading.style.display = "block";
  let weatherRequest = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=ff41b5d76a8819a19070c48524d922d7`
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      temperature.innerHTML = Math.round(data.main.temp);
      skyCondition.innerHTML = data.weather[0].description;
      humidity.innerHTML = data.main.humidity;
      windSpeed.innerHTML = data.wind.speed;
      conditionImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
      // document.body.style.backgroundImage = `url(https://images.unsplash.com/1600×900/? ${data.name})`;
      if (data.name && data.cod == 200) {
        city.innerHTML = data.name;
        countryName.innerHTML = "(" + data.sys.country + ")";
        warnMsg.style.display = "none";
        circleLoading.style.display = "none";
        localStorage.setItem("weather-condition", cityName);
        console.log(data);
      }
    })
    .catch((err) => {
      city.innerHTML = "invalid place";
      warnMsg.style.display = "block";
      circleLoading.style.display = "none";
      console.log(new Error(err + " invalid place"));
    });
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

// save city name even after reload

window.addEventListener("load", () => {
  nameC = localStorage.getItem("weather-condition");
  console.log(nameC);
  cityName = nameC;
  weatherApi();
});
