var PreweatherData = [];

const createWeatherCard = (weather) => {
  return `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${weather.sendImgPath}" class="card-img-top" alt="Időjárás ikon" style="height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${weather.sendTitle}</h5>
          <p class="card-text flex-grow-1">${weather.sendDescription}</p>
          <div class="mt-auto">
            <div class="row text-center">
              <div class="col-6">
                <small class="text-muted">Minimum</small>
                <div class="fw-bold text-primary">${weather.sendMin}°C</div>
              </div>
              <div class="col-6">
                <small class="text-muted">Maximum</small>
                <div class="fw-bold text-danger">${weather.sendMax}°C</div>
              </div>
            </div>
            <hr>
        <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${weather.sendDate}</small>
          <div class="btn-group">
            <button class="btn btn-outline-secondary btn-sm" onclick="openEditWeather(${weather.id})" title="Szerkesztés">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteWeather(${weather.id})" title="Törlés">
              <i class="bi bi-trash"></i>
            </button>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.addDataToSection = (weather) => {
  const dataSection = document.querySelector("#dataSection");
  if (dataSection) {
    dataSection.innerHTML += createWeatherCard(weather);
  }
};

const getWeathers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weathers`);
    weatherData = response.data;

    const dataSection = document.querySelector("#dataSection");
    dataSection.innerHTML = "";

    weatherData.forEach((weather) => {
      addDataToSection(weather);
    });
  } catch (error) {
    showToastMessage("error", "Hiba történt az időjárás adatok lekérésekor");
  }
};

window.getWeathers = async () => {
  await getWeathers();
};

let editingWeatherId = null;

window.openEditWeather = (id) => {
  const item = weatherData.find((w) => w.id === id);
  if (!item) return;
  editingWeatherId = id;
  document.getElementById("editTitle").value = item.sendTitle || "";
  document.getElementById("editDescription").value = item.sendDescription || "";
  document.getElementById("editDate").value = item.sendDate || "";
  document.getElementById("editImgPath").value = item.sendImgPath || "";
  document.getElementById("editMin").value = item.sendMin;
  document.getElementById("editMax").value = item.sendMax;
  const modal = new bootstrap.Modal(
    document.getElementById("editWeatherModal")
  );
  modal.show();
};

window.saveEditWeather = async () => {
  if (!editingWeatherId) return;
  const payload = {
    sendTitle: document.getElementById("editTitle").value.trim(),
    sendDescription: document.getElementById("editDescription").value.trim(),
    sendDate: document.getElementById("editDate").value,
    sendImgPath: document.getElementById("editImgPath").value.trim(),
    sendMin: document.getElementById("editMin").value,
    sendMax: document.getElementById("editMax").value,
  };
  try {
    const res = await axios.put(
      `${API_BASE_URL}/weathers/${editingWeatherId}`,
      payload
    );
    showToastMessage("success", "Időjárás adat frissítve");
    if (res.data?.warning) {
      showToastMessage("warning", res.data.warning);
    }
    const modalEl = document.getElementById("editWeatherModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal && modal.hide();
    editingWeatherId = null;
    await getWeathers();
  } catch (error) {
    const msg = error.response?.data?.error || "Hiba történt a frissítés során";
    showToastMessage("error", msg);
  }
};

document.addEventListener("change", async (e) => {
  if (e.target && e.target.id === "selectedDate") {
    await applyFilters();
  }
});

const applyFilters = async () => {
  const date = document.getElementById("selectedDate").value;
  if (!weatherData.length) {
    await getWeathers();
  }
  let filtered = [...weatherData];
  if (date) {
    filtered = filtered.filter((w) => w.sendDate === date);
  }
  const dataSection = document.querySelector("#dataSection");
  if (dataSection) {
    dataSection.innerHTML = "";
  }

  filtered.forEach((w) => addDataToSection(w));
};

window.deleteWeather = async (weatherId) => {
  if (!confirm("Biztosan törölni szeretnéd ezt az időjárás adatot?")) {
    return;
  }

  try {
    await axios.delete(`${API_BASE_URL}/weathers/${weatherId}`);
    showToastMessage("success", "Időjárás adat sikeresen törölve!");
    getWeathers();
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Hiba történt a törlés során";
    showToastMessage("error", errorMessage);
  }
};

window.handleViewChange = (view) => {
  const dataSection = document.querySelector("#dataSection");
  const linearSection = document.querySelector("#linearSection");
  const calendarSection = document.querySelector("#calendarSection");

  const dataViewBtn = document.querySelector("#dataViewBtn");
  const linearViewBtn = document.querySelector("#linearViewBtn");
  const calendarViewBtn = document.querySelector("#calendarViewBtn");

  dataSection.classList.add("visually-hidden");
  linearSection.classList.add("visually-hidden");
  calendarSection.classList.add("visually-hidden");

  dataViewBtn.classList.remove("active");
  linearViewBtn.classList.remove("active");
  calendarViewBtn.classList.remove("active");

  switch (view) {
    case "data":
      dataSection.classList.remove("visually-hidden");
      dataViewBtn.classList.add("active");
      break;
    case "linear":
      linearSection.classList.remove("visually-hidden");
      linearViewBtn.classList.add("active");
      linearView();
      break;
    case "calendar":
      calendarSection.classList.remove("visually-hidden");
      calendarViewBtn.classList.add("active");
      calendarView();
      break;
  }
};

window.calendarView = () => {
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "hu",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek",
    },
  });

  weatherData.forEach((weather) => {
    calendar.addEvent({
      title: weather.sendTitle,
      start: weather.sendDate,
      end: weather.sendDate,
      backgroundColor: getWeatherColor(weather.sendTitle),
      borderColor: getWeatherColor(weather.sendTitle),
    });
  });

  calendar.render();
};

window.getWeatherColor = (title) => {
  const colors = {
    "Napos idő lesz": "#ffc107",
    "Felhős idő lesz": "#6c757d",
    "Esős idő lesz": "#0d6efd",
    "Nagyon esős idő lesz": "#0d6efd",
    "Havazni fog": "#ffffff",
  };
  return colors[title] || "#6c757d";
};

window.linearView = () => {
  const dataPoints = weatherData.map((weather) => ({
    label: weather.sendDate,
    y: [Number(weather.sendMin), Number(weather.sendMax)],
    name: weather.sendTitle,
  }));

  const chart = new CanvasJS.Chart("chartContainer", {
    title: {
      text: "Időjárásjelentés",
      fontFamily: "Arial",
    },
    axisY: {
      suffix: " °C",
      maximum: 40,
      minimum: -10,
      gridThickness: 1,
      gridColor: "#e0e0e0",
    },
    axisX: {
      title: "Dátum",
      titleFontSize: 14,
    },
    toolTip: {
      shared: true,
      content:
        "{name} <br/> <strong>Hőmérséklet:</strong> <br/> Min: {y[0]} °C, Max: {y[1]} °C",
    },
    data: [
      {
        type: "rangeSplineArea",
        fillOpacity: 0.3,
        color: "#0d6efd",
        indexLabelFormatter: formatter,
        dataPoints: dataPoints,
      },
    ],
  });

  chart.render();
  addWeatherIcons(chart);
};

window.addWeatherIcons = (chart) => {
  const images = [];

  chart.data[0].dataPoints.forEach((dataPoint, index) => {
    const weather = weatherData.find((w) => w.sendDate === dataPoint.label);
    if (weather) {
      const img = $("<img>")
        .attr("src", weather.sendImgPath)
        .attr("class", `weather-icon-${index}`)
        .css({
          width: "30px",
          height: "30px",
          position: "absolute",
        });

      img.appendTo($("#chartContainer>.canvasjs-chart-container"));
      positionWeatherIcon(img, chart, index);
    }
  });
};

window.positionWeatherIcon = (image, chart, index) => {
  const imageCenter = chart.axisX[0].convertValueToPixel(
    chart.data[0].dataPoints[index].x
  );
  const imageTop = chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);

  image.css({
    left: imageCenter - 15 + "px",
    top: imageTop + 10 + "px",
  });
};

window.formatter = (e) => {
  if (e.index === 0) {
    return "Min " + e.dataPoint.y[e.index] + "°";
  } else if (e.index === 1) {
    return "Max " + e.dataPoint.y[e.index] + "°";
  }
  return e.dataPoint.y[e.index] + "°";
};
