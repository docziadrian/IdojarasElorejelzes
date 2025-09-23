let sendTitle = "Napos idő lesz";
let sendDescription = "Fényes napra virradunk";
let sendImgPath = "https://cdn-icons-png.flaticon.com/512/4814/4814268.png";
let sendMin = null;
let sendMax = null;
let sendDate = null;

let jelenlegiIdo = "Napos idő lesz";

const handleChange = () => {
  var activities = document.getElementById("ilyenIdoLesz");
  var minHom = document.querySelector("#minHom");
  var maxHom = document.querySelector("#maxHom");

  minHom.addEventListener("change", function () {
    sendMin = minHom.value;
    document.querySelector("#cardMin").textContent = "MIN:" + sendMin;
  });

  maxHom.addEventListener("change", function () {
    sendMax = maxHom.value;
    document.querySelector("#cardMax").textContent = "MAX:" + sendMax;
  });

  const idok = [
    "Napos idő lesz",
    "Felhős idő lesz",
    "Esős idő lesz",
    "Nagyon esős idő lesz",
    "Havazni fog",
  ];

  activities.addEventListener("change", function () {
    jelenlegiIdo = idok[0];

    switch (activities.value) {
      case "1":
        jelenlegiIdo = idok[1];
        sendTitle = jelenlegiIdo;
        sendDescription = "Felhőzni fog az ég.";
        sendImgPath = "https://cdn-icons-png.flaticon.com/512/414/414927.png";
        document.querySelector("#cardTitle").textContent = jelenlegiIdo;
        document.querySelector("#cardDescription").textContent =
          sendDescription;
        document.querySelector("#cardImgPath").src = sendImgPath;
        break;
      case "2":
        sendTitle = jelenlegiIdo;
        sendDescription = "Felhőzni fog az ég.";
        sendImgPath = "https://cdn-icons-png.flaticon.com/512/414/414927.png";
        document.querySelector("#cardTitle").textContent = jelenlegiIdo;
        document.querySelector("#cardDescription").textContent =
          sendDescription;
        document.querySelector("#cardImgPath").src = sendImgPath;
        break;
      case "3":
        jelenlegiIdo = idok[2];
        sendDescription = "Csepegni fog a víz.";
        sendImgPath = "https://cdn-icons-png.flaticon.com/512/3351/3351979.png";
        document.querySelector("#cardTitle").textContent = jelenlegiIdo;
        document.querySelector("#cardDescription").textContent =
          sendDescription;
        document.querySelector("#cardImgPath").src = sendImgPath;
        break;
      case "4":
        jelenlegiIdo = idok[3];
        sendDescription = "Mindenképp vigyél esernyőt";
        sendImgPath = "https://cdn-icons-png.flaticon.com/512/4834/4834677.png";
        document.querySelector("#cardTitle").textContent = jelenlegiIdo;
        document.querySelector("#cardDescription").textContent =
          sendDescription;
        document.querySelector("#cardImgPath").src = sendImgPath;
        break;
      case "5":
        jelenlegiIdo = idok[4];
        sendDescription = "Havazni fog.";
        sendImgPath = "https://cdn-icons-png.flaticon.com/512/2315/2315309.png";
        document.querySelector("#cardTitle").textContent = jelenlegiIdo;
        document.querySelector("#cardDescription").textContent =
          sendDescription;
        document.querySelector("#cardImgPath").src = sendImgPath;
        break;
      default:
        jelenlegiIdo = idok[0];
        sendTitle = jelenlegiIdo;
        sendDescription = "Fényes napra virradunk.";
        sendImgPath = "https://cdn-icons-png.flaticon.com/512/4814/4814268.png";
        document.querySelector("#cardTitle").textContent = jelenlegiIdo;
        document.querySelector("#cardDescription").textContent =
          sendDescription;
        document.querySelector("#cardImgPath").src = sendImgPath;
        break;
    }
  });
};

const handleDate = () => {
  const rawDate = document.getElementById("selectedDate");
  const selectedDate = (document.getElementById("selectedDate").valueAsDate =
    new Date());

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  rawDate.value = today;
  rawDate.min = today;
};

const handleFelvetel = async () => {
  if (!sendTitle || !sendDescription || !sendImgPath || !sendMin || !sendMax) {
    showToastMessage("error", "Minden mező kitöltése kitöltése kötelező!");
  }

  if (Number(sendMin) > Number(sendMax)) {
    showToastMessage("error", "Érvénytelen min. és max. hőmérséklet.");
  }

  sendDate = document.getElementById("selectedDate").value;

  sendTitle = jelenlegiIdo;

  const { response } = await axios
    .post("http://localhost:3000/weathers/", {
      sendTitle,
      sendDescription,
      sendImgPath,
      sendDate,
      sendMin,
      sendMax,
    })
    .then((res) => {
      console.log(res);
    });
};

const handleSubmit = () => {
  console.log(sendTitle);
  handleFelvetel();
};
