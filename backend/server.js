const express = require("express");
const usersRouter = require("./modules/users");
const weathersRouter = require("./modules/weathers");
const store = require("./lib/store");
const cors = require("cors");
const config = require("./config");

const app = express();
const PORT = config.port;

// Production middleware (helmet, compression)
if (config.enableHelmet) {
  const helmet = require("helmet");
  app.use(helmet());
}

if (config.enableCompression) {
  const compression = require("compression");
  app.use(compression());
}

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

store.initStore();

app.get("/", (req, res) => {
  res.json({
    message: "Időjárás Előrejelzés API szerver fut és elérhető",
    version: "1.0.0",
    environment: config.environment,
    endpoints: {
      users: "/users",
      weathers: "/weathers",
    },
  });
});

app.use("/users", usersRouter);
app.use("/weathers", weathersRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Az oldal nem található" });
});

app.use((error, req, res, next) => {
  if (config.logLevel === "debug") {
    console.error("Szerver hiba:", error);
  }
  res.status(500).json({ error: "Belső szerver hiba" });
});

app.listen(PORT, () => {
  console.log(
    `Szerver sikeresen elindult a ${PORT} porton (${config.environment} módban).`
  );
});
