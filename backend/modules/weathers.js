const express = require("express");
const store = require("../lib/store");
const router = express.Router();

// Összes weathers lekérése
router.get("/", (req, res) => {
  const weathers = store.getAllWeathers();
  res.json(weathers);
});

// Új weather létrehozása
router.post("/", (req, res) => {
  const newWeather = req.body;
  console.log(newWeather);
  const {
    sendTitle,
    sendDescription,
    sendDate,
    sendImgPath,
    sendMin,
    sendMax,
  } = newWeather;

  // Validálja, hogy létezik-e már az adott dátumra, megvannak -e minden adatok

  // Egyéni azonosító generálása
  const newID = store.getNextID(store.getAllWeathers());
  newWeather.id = newID;

  const putThis = {
    id: newID,
    sendTitle,
    sendDescription,
    sendImgPath,
    sendDate,
    sendMin,
    sendMax,
  };

  store.writeWeathers([...store.getAllWeathers(), putThis]);

  res.status(201).send(`Új weather létrehozva: ${JSON.stringify(putThis)}`);
});
module.exports = router;
