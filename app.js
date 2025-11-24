import { kelvinToCelsius } from "./src/utils/kelvinToCelsius.js";

// ELEMENT TARGETS
const cityName = document.getElementById("cityName");
const dateInfo = document.getElementById("dateInfo");
const currentTemp = document.getElementById("currentTemp");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDesc = document.getElementById("weatherDesc");
const feelsLike = document.getElementById("feelsLike");
const maxTemp = document.getElementById("maxTemp");
const minTemp = document.getElementById("minTemp");

const humidityValue = document.getElementById("humidityValue");
const windValue = document.getElementById("windValue");
const pressureValue = document.getElementById("pressureValue");
const rainValue = document.getElementById("rainValue");

const hourlyBox = document.getElementById("hourlyBox");
const dailyBox = document.getElementById("dailyBox");

const aqiValue = document.getElementById("aqiValue");
const aqiText = document.getElementById("aqiText");

const sunriseTime = document.getElementById("sunriseTime");
const sunsetTime = document.getElementById("sunsetTime");

// API KEY
const apiKey = "e6566ed4a2f60388715b2dbe6c78a5c5";

// ============================
//  SEARCH EVENT
// ============================

document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Masukkan nama kota!");

  loadWeather(city);
});

// ============================
//  MAIN WEATHER API CALL
// ============================

async function loadWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      alert("Kota tidak ditemukan!");
      return;
    }

    // FORMAT TANGGAL
    const today = new Date();
    const hari = today.toLocaleDateString("id-ID", { weekday: "long" });
    const tanggal = today.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    // UPDATE UI
    cityName.textContent = data.name;
    dateInfo.textContent = `${hari}, ${tanggal}`;

    const tempC = kelvinToCelsius(data.main.temp);
    currentTemp.textContent = tempC;
    feelsLike.textContent = `Terasa seperti ${kelvinToCelsius(data.main.feels_like)}°C`;

    weatherDesc.textContent = data.weather[0].description;

    // WEATHER ICON
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    // MIN/MAX
    maxTemp.textContent = `${kelvinToCelsius(data.main.temp_max)}°C`;
    minTemp.textContent = `${kelvinToCelsius(data.main.temp_min)}°C`;

    // MINI STATS
    humidityValue.textContent = data.main.humidity + "%";
    windValue.textContent = (data.wind.speed * 3.6).toFixed(1) + " km/j";
    pressureValue.textContent = data.main.pressure + " hPa";
    rainValue.textContent = (data.rain ? data.rain["1h"] : 0) + " mm";

    // DUMMY SECTIONS
    loadHourlyDummy();
    loadDailyDummy();
    loadAQIDummy();
    loadSunDummy();
    loadTempChart();

  } catch (err) {
    console.error(err);
    alert("Gagal memuat data!");
  }
}

// ============================
//  HOURLY FORECAST (DUMMY)
// ============================

function loadHourlyDummy() {
  hourlyBox.innerHTML = "";

  const hours = ["15:00", "16:00", "17:00", "18:00", "19:00"];
  const temps = [30, 31, 29, 28, 27];
  const icons = [
    "01d", "01d", "02d", "03d", "09d"
  ];

  for (let i = 0; i < 5; i++) {
    hourlyBox.innerHTML += `
      <div class="hour-card">
        <p>${hours[i]}</p>
        <img src="https://openweathermap.org/img/wn/${icons[i]}@2x.png">
        <p>${temps[i]}°C</p>
      </div>
    `;
  }
}

// ============================
//  DAILY FORECAST (DUMMY)
// ============================

function loadDailyDummy() {
  dailyBox.innerHTML = "";

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const icons = ["01d", "03d", "10d", "09d", "02d"];
  const max = [32, 30, 28, 27, 29];
  const min = [25, 24, 23, 22, 24];

  for (let i = 0; i < 5; i++) {
    dailyBox.innerHTML += `
      <div class="day-card">
        <div>${days[i]}</div>
        <img src="https://openweathermap.org/img/wn/${icons[i]}.png">
        <div>
          <span style="color:#ffb85c">${max[i]}°</span> /
          <span style="opacity:.7">${min[i]}°</span>
        </div>
      </div>
    `;
  }
}

// ============================
//  AQI DUMMY
// ============================

function loadAQIDummy() {
  const aqi = Math.floor(Math.random() * 60) + 20;

  aqiValue.textContent = aqi;

  if (aqi < 50) {
    aqiText.textContent = "Baik";
    aqiText.style.color = "#4cd964";
  } else if (aqi < 100) {
    aqiText.textContent = "Sedang";
    aqiText.style.color = "#f4c542";
  } else {
    aqiText.textContent = "Buruk";
    aqiText.style.color = "#ff4d4d";
  }
}

// ============================
//  SUNRISE / SUNSET DUMMY
// ============================

function loadSunDummy() {
  sunriseTime.textContent = "05:45";
  sunsetTime.textContent = "18:30";
}

// ============================
//  CHART SUHU 24 JAM (DUMMY)
// ============================

function loadTempChart() {
  const ctx = document.getElementById("tempChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
      datasets: [{
        label: "Temperature",
        data: [23, 24, 27, 30, 31, 29, 27, 25],
        borderColor: "#2f63d5",
        borderWidth: 3,
        tension: 0.4
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#ccc" } },
        y: { ticks: { color: "#ccc" } }
      }
    }
  });
}

// ============================
//  TOGGLE TABS (HOURLY / DAILY)
// ============================

document.getElementById("tabHourly").addEventListener("click", () => {
  hourlyBox.style.display = "flex";
  dailyBox.style.display = "none";
  setActiveTab("tabHourly");
});

document.getElementById("tabDaily").addEventListener("click", () => {
  hourlyBox.style.display = "none";
  dailyBox.style.display = "block";
  setActiveTab("tabDaily");
});

function setActiveTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}
