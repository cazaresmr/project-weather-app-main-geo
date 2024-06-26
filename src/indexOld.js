import { apiKey } from "./config.js";

const fetchWeatherData = async (location) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("Unable to fetch weather data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const processData = (data) => {
  return {
    temperature: data.main.temp,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    main: data.weather[0].main,
  };
};

const displayWeatherData = (data) => {
  const processedData = processData(data);

  document.getElementById(
    "temperature"
  ).textContent = `Temperature: ${processedData.temperature} °C`;
  document.getElementById(
    "description"
  ).textContent = `Description: ${processedData.description}`;
  document.getElementById(
    "humidity"
  ).textContent = `Humidity: ${processedData.humidity}%`;
  document.getElementById(
    "wind-speed"
  ).textContent = `Wind Speed: ${processedData.windSpeed} m/s`;

  updateBackground(processedData.main);
};

const updateBackground = (weatherMain) => {
  let backgroundUrl = "";

  switch (weatherMain.toLowerCase()) {
    case "clear":
      backgroundUrl = "images/clear.jpg";
      break;
    case "clouds":
      backgroundUrl = "images/clouds.jpg";
      break;
    case "rain":
      backgroundUrl = "images/rain.jpg";
      break;
    case "snow":
      backgroundUrl = "images/snow.jpg";
      break;
    case "thunderstorm":
      backgroundUrl = "images/thunderstorm.jpg";
      break;
    default:
      backgroundUrl = "";
      break;
  }

  document.body.style.backgroundImage = `url(${backgroundUrl})`;
};

const form = document.getElementById("location-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const locationInput = document.getElementById("location-input");
  const location = locationInput.value;
  const weatherData = await fetchWeatherData(location);
  displayWeatherData(weatherData);
  locationInput.value = "";
});

let isCelsius = true;
document.getElementById("toggle-temp").addEventListener("click", () => {
  const tempElement = document.getElementById("temperature");
  let currentTemp = parseFloat(tempElement.textContent.split(" ")[1]);

  if (isCelsius) {
    currentTemp = (currentTemp * 9) / 5 + 32;
    tempElement.textContent = `Temperature: ${currentTemp.toFixed(2)} °F`;
  } else {
    currentTemp = ((currentTemp - 32) * 5) / 9;
    tempElement.textContent = `Temperature: ${currentTemp.toFixed(2)} °C`;
  }
  isCelsius = !isCelsius;
});
