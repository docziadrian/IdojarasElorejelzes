const express = require("express");
const store = require("../lib/store");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const weathers = store.getAllWeathers();
    res.json(weathers);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Szerver hiba az időjárás adatok lekérésekor" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const weatherId = parseInt(req.params.id);
    if (isNaN(weatherId)) {
      return res.status(400).json({ error: "Érvénytelen időjárás ID" });
    }

    const weather = store.getWeatherById(weatherId);
    if (!weather) {
      return res.status(404).json({ error: "Időjárás adat nem található" });
    }

    res.json(weather);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Szerver hiba az időjárás adat lekérésekor" });
  }
});

router.post("/", (req, res) => {
  try {
    const newWeather = req.body;
    const validation = store.validateWeather(newWeather);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const existsForDate = store
      .getAllWeathers()
      .some((w) => w.sendDate === newWeather.sendDate);
    if (existsForDate) {
      return res
        .status(400)
        .json({ error: "Erre a dátumra már létezik időjárási adat" });
    }

    const newID = store.getNextID(store.getAllWeathers());
    const weatherToCreate = {
      id: newID,
      sendTitle: newWeather.sendTitle,
      sendDescription: newWeather.sendDescription,
      sendImgPath: newWeather.sendImgPath,
      sendDate: newWeather.sendDate,
      sendMin: parseInt(newWeather.sendMin),
      sendMax: parseInt(newWeather.sendMax),
    };

    const currentWeathers = store.getAllWeathers();
    store.writeWeathers([...currentWeathers, weatherToCreate]);

    res.status(201).json({
      message: "Időjárás adat sikeresen létrehozva",
      weather: weatherToCreate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Szerver hiba az időjárás adat létrehozásakor" });
  }
});

router.put("/:id", (req, res) => {
  try {
    const weatherId = parseInt(req.params.id);
    if (isNaN(weatherId)) {
      return res.status(400).json({ error: "Érvénytelen időjárás ID" });
    }

    const updatedData = req.body;
    const weathers = store.getAllWeathers();
    const weatherIndex = weathers.findIndex((w) => w.id === weatherId);

    if (weatherIndex === -1) {
      return res.status(404).json({ error: "Időjárás adat nem található" });
    }

    const weatherToUpdate = { ...weathers[weatherIndex], ...updatedData };

    if (updatedData.sendMin !== undefined) {
      weatherToUpdate.sendMin = parseInt(updatedData.sendMin);
    }
    if (updatedData.sendMax !== undefined) {
      weatherToUpdate.sendMax = parseInt(updatedData.sendMax);
    }

    const targetDate = weatherToUpdate.sendDate;
    const duplicateForDate = weathers.some(
      (w) => w.sendDate === targetDate && w.id !== weatherId
    );
    if (duplicateForDate) {
      return res
        .status(400)
        .json({ error: "Erre a dátumra már létezik időjárási adat" });
    }

    const validation = store.validateWeather(weatherToUpdate);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    weathers[weatherIndex] = weatherToUpdate;
    store.writeWeathers(weathers);

    res.json({
      message: "Időjárás adat sikeresen frissítve",
      weather: weatherToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Szerver hiba az időjárás adat frissítésekor" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const weatherId = parseInt(req.params.id);
    if (isNaN(weatherId)) {
      return res.status(400).json({ error: "Érvénytelen időjárás ID" });
    }

    const weather = store.getWeatherById(weatherId);
    if (!weather) {
      return res.status(404).json({ error: "Időjárás adat nem található" });
    }

    const updatedWeathers = store
      .getAllWeathers()
      .filter((w) => w.id !== weatherId);
    store.writeWeathers(updatedWeathers);

    res.json({
      message: `${weather.sendTitle} című időjárás adat sikeresen törölve`,
    });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba az időjárás adat törlésekor" });
  }
});

module.exports = router;
