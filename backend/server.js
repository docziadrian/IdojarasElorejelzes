const express = require("express");
const usersRouter = require("./modules/users");
const weathersRouter = require("./modules/weathers");
const store = require("./lib/store");

var cors = require("cors");
const app = express();

// Middleware -k

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store inicializálása
store.initStore();

// Egyszerű GET kérés a gyökér útvonalra.
app.get("/", (req, res) => {
  res.send("Szerver fut és elérhető.");
});

// Felhasználói útvonalak kezelése
app.use("/users", usersRouter);
app.use("/weathers", weathersRouter);

// Console -ra íratás, hogy sikeresen elindult a szerver az x porton.
app.listen(3000, () => {
  console.log("Szerver sikeresen elindult a 3000 -s porton.");
});
