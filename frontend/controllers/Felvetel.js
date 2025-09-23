var weatherData = {
  sendTitle: "Napos idő lesz",
  sendDescription: "Fényes napra virradunk",
  sendImgPath: "https://cdn-icons-png.flaticon.com/512/4814/4814268.png",
  sendMin: null,
  sendMax: null,
  sendDate: null,
};

var valWeatherData = {
  sendTitle: "Napos idő lesz",
  sendDescription: "Fényes napra virradunk",
  sendImgPath: "https://cdn-icons-png.flaticon.com/512/4814/4814268.png",
  sendMin: null,
  sendMax: null,
  sendDate: null,
};

let validWeatherData = {
  sendTitle: "Napos idő lesz",
  sendDescription: "Fényes napra virradunk",
  sendImgPath: "https://cdn-icons-png.flaticon.com/512/4814/4814268.png",
  sendMin: null,
  sendMax: null,
  sendDate: null,
};

const weatherTypes = [
  {
    id: "1",
    title: "Napos idő lesz",
    description: "Fényes napra virradunk",
    imgPath: "https://cdn-icons-png.flaticon.com/512/4814/4814268.png",
  },
  {
    id: "2",
    title: "Felhős idő lesz",
    description: "Felhőzni fog az ég",
    imgPath: "https://cdn-icons-png.flaticon.com/512/414/414927.png",
  },
  {
    id: "3",
    title: "Esős idő lesz",
    description: "Csepegni fog a víz",
    imgPath: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
  },
  {
    id: "4",
    title: "Nagyon esős idő lesz",
    description: "Mindenképp vigyél esernyőt",
    imgPath: "https://cdn-icons-png.flaticon.com/512/4834/4834677.png",
  },
  {
    id: "5",
    title: "Havazni fog",
    description: "Havazni fog",
    imgPath: "https://cdn-icons-png.flaticon.com/512/2315/2315309.png",
  },
];

window.handleChange = () => {
  const weatherSelect = document.getElementById("ilyenIdoLesz");
  const minTemp = document.querySelector("#minHom");
  const maxTemp = document.querySelector("#maxHom");

  minTemp.addEventListener("change", function () {
    valWeatherData.sendMin = minTemp.value;
    document.querySelector(
      "#cardMin"
    ).textContent = `MIN: ${valWeatherData.sendMin}°C`;
  });

  maxTemp.addEventListener("change", function () {
    valWeatherData.sendMax = maxTemp.value;
    document.querySelector(
      "#cardMax"
    ).textContent = `MAX: ${valWeatherData.sendMax}°C`;
  });

  weatherSelect.addEventListener("change", function () {
    const selectedWeather =
      weatherTypes.find((type) => type.id === weatherSelect.value) ||
      weatherTypes[0];

    valWeatherData.sendTitle = selectedWeather.title;
    valWeatherData.sendDescription = selectedWeather.description;
    valWeatherData.sendImgPath = selectedWeather.imgPath;

    document.querySelector("#cardTitle").textContent = valWeatherData.sendTitle;
    document.querySelector("#cardDescription").textContent =
      valWeatherData.sendDescription;
    document.querySelector("#cardImgPath").src = valWeatherData.sendImgPath;
  });

  console.log(valWeatherData);
};

window.handleDateFelvetel = () => {
  const dateInput = document.getElementById("selectedDate");
  const today = new Date().toISOString().split("T")[0];

  dateInput.value = today;
  dateInput.min = today;
};

const validateWeatherData = () => {
  if (
    !valWeatherData.sendTitle ||
    !valWeatherData.sendDescription ||
    !valWeatherData.sendImgPath ||
    !valWeatherData.sendMin ||
    !valWeatherData.sendMax ||
    !valWeatherData.sendDate
  ) {
    showToastMessage("error", "Minden mező kitöltése kötelező!");
    return false;
  }

  if (Number(valWeatherData.sendMin) > Number(valWeatherData.sendMax)) {
    showToastMessage(
      "error",
      "A minimum hőmérséklet nem lehet nagyobb a maximumnál!"
    );
    return false;
  }

  return true;
};

window.handleFelvetel = async () => {
  valWeatherData.sendDate = document.getElementById("selectedDate").value;

  if (!validateWeatherData()) {
    return;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/weathers`,
      valWeatherData
    );
    if (response.data?.warning) {
      showToastMessage("error", response.data.warning);
      return;
    }
    showToastMessage("success", "Időjárás adat sikeresen mentve!");
    clearForm();
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Hiba történt az adat mentése során";
    showToastMessage("error", errorMessage);
  }
};

window.clearForm = () => {
  document.getElementById("selectedDate").value = "";
  document.querySelector("#minHom").value = "";
  document.querySelector("#maxHom").value = "";
  document.querySelector("#ilyenIdoLesz").value = "1";

  valWeatherData = {
    sendTitle: "Napos idő lesz",
    sendDescription: "Fényes napra virradunk",
    sendImgPath: "https://cdn-icons-png.flaticon.com/512/4814/4814268.png",
    sendMin: null,
    sendMax: null,
    sendDate: null,
  };

  document.querySelector("#cardTitle").textContent = valWeatherData.sendTitle;
  document.querySelector("#cardDescription").textContent =
    valWeatherData.sendDescription;
  document.querySelector("#cardImgPath").src = valWeatherData.sendImgPath;
  document.querySelector("#cardMin").textContent = "MIN: --";
  document.querySelector("#cardMax").textContent = "MAX: --";
};

window.handleSubmit = () => {
  handleFelvetel();
};
