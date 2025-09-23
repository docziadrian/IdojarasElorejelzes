const storedDatas = [];

const addDataToSection = (
  title,
  description,
  date,
  imgPath,
  minHom,
  maxHom
) => {
  const dataSection = document.querySelector("#dataSection");
  dataSection.innerHTML += `<div class="col mx-auto w-full align-self-center">
          <h5>${date}</h5>
          <div class="card" style="width: 18rem">
            <img src=${imgPath} class="card-img-top" alt="Időjárás fotográfia" />
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text">
                ${description}
              </p>
              
            </div>
          </div>
        </div>`;
};

const getWeathers = async () => {
  const { response } = await axios
    .get("http://localhost:3000/weathers")
    .then((res) => {
      const array = res.data;
      for (const weather of array) {
        addDataToSection(
          weather.sendTitle,
          weather.sendDescription,
          weather.sendDate,
          weather.sendImgPath,
          weather.sendMin,
          weather.sendMax
        );
        storedDatas.push(weather);
      }
    });
};

const handleViewChange = (view) => {
  if (view === "data") {
    document.querySelector("#dataSection").classList.remove("visually-hidden");
    document.querySelector("#linearSection").classList.add("visually-hidden");
    document.querySelector("#calendarSection").classList.add("visually-hidden");
  }

  if (view === "linear") {
    document.querySelector("#dataSection").classList.add("visually-hidden");
    document.querySelector("#calendarSection").classList.add("visually-hidden");
    document
      .querySelector("#linearSection")
      .classList.remove("visually-hidden");
    linearView();
  }

  if (view === "calendar") {
    document.querySelector("#dataSection").classList.add("visually-hidden");
    document.querySelector("#linearSection").classList.add("visually-hidden");
    document
      .querySelector("#calendarSection")
      .classList.remove("visually-hidden");
    calendarView();
  }
};

const calendarView = () => {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
  });
  for (const element of storedDatas) {
    calendar.addEvent({
      title: element.sendTitle,
      start: element.sendDate,
      end: element.sendDate,
    });
  }

  calendar.render();
};

const linearView = () => {
  const convertToDataPoints = [];

  for (const element of storedDatas) {
    const label = element.sendDate;
    const y = [Number(element.sendMin), Number(element.sendMax)];
    const name = element.sendTitle;

    convertToDataPoints.push({ label: label, y: y, name: name });
  }

  var chart = new CanvasJS.Chart("chartContainer", {
    title: {
      text: "Heti időjárásjelentés",
    },
    axisY: {
      suffix: " °C",
      maximum: 40,
      gridThickness: 0,
    },
    toolTip: {
      shared: true,
      content:
        "{name} </br> <strong>Temperature: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C",
    },
    data: [
      {
        type: "rangeSplineArea",
        fillOpacity: 0.1,
        color: "#91AAB1",
        indexLabelFormatter: formatter,
        dataPoints: convertToDataPoints,
      },
    ],
  });
  chart.render();

  var images = [];

  addImages(chart);

  function addImages(chart) {
    for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
      var dpsName = chart.data[0].dataPoints[i].name;
      if (dpsName == "Napos idő lesz") {
        images.push(
          $("<img>").attr(
            "src",
            "https://cdn-icons-png.flaticon.com/512/4814/4814268.png"
          )
        );
      } else if (dpsName == "Felhős idő lesz") {
        images.push(
          $("<img>").attr(
            "src",
            "https://cdn-icons-png.flaticon.com/512/414/414927.png"
          )
        );
      } else if (dpsName == "Esős idő lesz") {
        images.push(
          $("<img>").attr(
            "src",
            "https://cdn-icons-png.flaticon.com/512/3351/3351979.png"
          )
        );
      } else if (dpsName == "Nagyon esős idő lesz") {
        images.push(
          $("<img>").attr(
            "src",
            "https://cdn-icons-png.flaticon.com/512/4834/4834677.png"
          )
        );
      } else if (dpsName == "Havazni fog") {
        images.push(
          $("<img>").attr(
            "src",
            "https://cdn-icons-png.flaticon.com/512/2315/2315309.png"
          )
        );
      }

      images[i]
        .attr("class", dpsName)
        .appendTo($("#chartContainer>.canvasjs-chart-container"));
      positionImage(images[i], i);
    }
  }

  function positionImage(image, index) {
    var imageCenter = chart.axisX[0].convertValueToPixel(
      chart.data[0].dataPoints[index].x
    );
    var imageTop = chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);

    image.width("40px").css({
      left: imageCenter - 20 + "px",
      position: "absolute",
      top: imageTop + "px",
      position: "absolute",
    });
  }

  $(window).resize(function () {
    var cloudyCounter = 0,
      rainyCounter = 0,
      sunnyCounter = 0;
    var imageCenter = 0;
    for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
      imageCenter =
        chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
      if (chart.data[0].dataPoints[i].name == "cloudy") {
        $(".cloudy").eq(cloudyCounter++).css({ left: imageCenter });
      } else if (chart.data[0].dataPoints[i].name == "rainy") {
        $(".rainy").eq(rainyCounter++).css({ left: imageCenter });
      } else if (chart.data[0].dataPoints[i].name == "sunny") {
        $(".sunny").eq(sunnyCounter++).css({ left: imageCenter });
      }
    }
  });

  function formatter(e) {
    if (e.index === 0 && e.dataPoint.x === 0) {
      return " Min " + e.dataPoint.y[e.index] + "°";
    } else if (e.index == 1 && e.dataPoint.x === 0) {
      return " Max " + e.dataPoint.y[e.index] + "°";
    } else {
      return e.dataPoint.y[e.index] + "°";
    }
  }
};
