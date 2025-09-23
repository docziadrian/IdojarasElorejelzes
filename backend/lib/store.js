const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "..", "database", "users.json");
const WEATHER_FILE = path.join(__dirname, "..", "database", "weathers.json");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

let users = [];
let weathers = [];

function alreadyRegistered(email) {
  return users.some((user) => user.email === email);
}

function validateEmail(email) {
  return emailRegex.test(email);
}

function validateUsername(username) {
  return usernameRegex.test(username);
}

function validatePassword(password) {
  return passwordRegex.test(password);
}

function validateRegistration(newUser) {
  const { fullName, userName, email, password, passwordAgain } = newUser;
  if (!fullName || !userName || !email || !password || !passwordAgain) {
    return { valid: false, message: "Minden mező kitöltése kötelező!" };
  }
  if (!validateUsername(userName)) {
    return {
      valid: false,
      message:
        "A felhasználónév csak betűket, számokat és alulvonást tartalmazhat, és 3-20 karakter hosszú lehet.",
    };
  }
  if (!validateEmail(email)) {
    return { valid: false, message: "Érvénytelen email cím!" };
  }
  if (!validatePassword(password)) {
    return {
      valid: false,
      message:
        "A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább egy nagybetűt, egy kisbetűt, egy számot és egy speciális karaktert. A pont és a vessző nem számít speciális karakternek.",
    };
  }
  if (password !== passwordAgain) {
    return { valid: false, message: "A jelszavak nem egyeznek!" };
  }

  if (alreadyRegistered(email)) {
    return { valid: false, message: "Ez az email cím már regisztrálva van!" };
  }

  return { valid: true };
}

function validateUpdate(newUser) {
  const { fullName, userName } = newUser;
  if (!fullName || !userName) {
    return { valid: false, message: "Minden mező kitöltése kötelező!" };
  }
  if (!validateUsername(userName)) {
    return {
      valid: false,
      message:
        "A felhasználónév csak betűket, számokat és alulvonást tartalmazhat, és 3-20 karakter hosszú lehet.",
    };
  }

  return { valid: true };
}

function validatePasswordChange(newUser) {
  const { oldPassword, password, passwordAgain } = newUser;

  if (!oldPassword || !password || !passwordAgain) {
    return { valid: false, message: "Minden mező kitöltése kötelező!" };
  }

  if (oldPassword === password) {
    return {
      valid: false,
      message: "Az új jelszó nem egyezhet meg a régivel!",
    };
  }

  if (!validatePassword(password)) {
    return {
      valid: false,
      message:
        "A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább egy nagybetűt, egy kisbetűt, egy számot és egy speciális karaktert. A pont és a vessző nem számít speciális karakternek.",
    };
  }

  if (password !== passwordAgain) {
    return { valid: false, message: "A jelszavak nem egyeznek!" };
  }

  return { valid: true };
}

function validateWeather(weather) {
  const {
    sendTitle,
    sendDescription,
    sendDate,
    sendImgPath,
    sendMin,
    sendMax,
  } = weather;

  if (
    !sendTitle ||
    !sendDescription ||
    !sendDate ||
    !sendImgPath ||
    !sendMin ||
    !sendMax
  ) {
    return { valid: false, message: "Minden mező kitöltése kötelező!" };
  }

  if (sendTitle.length < 3 || sendTitle.length > 100) {
    return {
      valid: false,
      message: "A cím 3-100 karakter között kell legyen!",
    };
  }

  if (sendDescription.length < 10 || sendDescription.length > 500) {
    return {
      valid: false,
      message: "A leírás 10-500 karakter között kell legyen!",
    };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(sendDate)) {
    return {
      valid: false,
      message: "Érvénytelen dátum formátum! Használj YYYY-MM-DD formátumot.",
    };
  }

  const minTemp = parseInt(sendMin);
  const maxTemp = parseInt(sendMax);

  if (isNaN(minTemp) || isNaN(maxTemp)) {
    return {
      valid: false,
      message: "A hőmérséklet értékeknek számoknak kell lenniük!",
    };
  }

  if (minTemp < -50 || minTemp > 50) {
    return {
      valid: false,
      message: "A minimum hőmérséklet -50 és 50 között kell legyen!",
    };
  }

  if (maxTemp < -50 || maxTemp > 50) {
    return {
      valid: false,
      message: "A maximum hőmérséklet -50 és 50 között kell legyen!",
    };
  }

  if (minTemp > maxTemp) {
    return {
      valid: false,
      message: "A minimum hőmérséklet nem lehet nagyobb a maximumnál!",
    };
  }

  if (!sendImgPath.startsWith("http")) {
    return {
      valid: false,
      message: "Az kép URL-nek http-vel vagy https-szel kell kezdődnie!",
    };
  }

  const warning = getSeasonalWarning(
    sendDate,
    parseInt(sendMin),
    parseInt(sendMax)
  );
  if (warning) {
    return { valid: false, message: warning };
  }

  return { valid: true };
}

function getSeasonalWarning(dateStr, min, max) {
  const month = Number((dateStr || "").split("-")[1]);
  if (!month || isNaN(month)) return null;
  let minAllowed = -50;
  let maxAllowed = 50;
  if (month === 12 || month === 1 || month === 2) {
    minAllowed = -25;
    maxAllowed = 12;
  } else if (month >= 3 && month <= 5) {
    minAllowed = -10;
    maxAllowed = 28;
  } else if (month >= 6 && month <= 8) {
    minAllowed = 8;
    maxAllowed = 42;
  } else if (month >= 9 && month <= 11) {
    minAllowed = -5;
    maxAllowed = 25;
  }
  if (min < minAllowed || max > maxAllowed) {
    return "A megadott hőmérséklet eltér az adott évszakra jellemző tartománytól.";
  }
  return null;
}

function initStore() {
  users = readUsers();
  weathers = readWeathers();
}

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Hiba a felhasználók fájl olvasásakor:", error);
    return [];
  }
}

function readWeathers() {
  if (!fs.existsSync(WEATHER_FILE)) {
    fs.writeFileSync(WEATHER_FILE, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(WEATHER_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Hiba az időjárás fájl olvasásakor:", error);
    return [];
  }
}

function writeUsers(usersData) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));
    users = usersData;
  } catch (error) {
    console.error("Hiba a felhasználók fájl írásakor:", error);
    throw error;
  }
}

function writeWeathers(weathersData) {
  try {
    fs.writeFileSync(WEATHER_FILE, JSON.stringify(weathersData, null, 2));
    weathers = weathersData;
  } catch (error) {
    console.error("Hiba az időjárás fájl írásakor:", error);
    throw error;
  }
}

function getNextID(table) {
  let nextID = 1;
  if (table.length == 0) {
    return nextID;
  }
  let maxindex = 0;
  for (let i = 1; i < table.length; i++) {
    if (table[i].id > table[maxindex].id) {
      maxindex = i;
    }
  }
  return table[maxindex].id + 1;
}

module.exports = {
  initStore,
  readUsers,
  readWeathers,
  writeUsers,
  writeWeathers,
  getNextID,
  validateRegistration,
  validateEmail,
  validateUsername,
  validatePassword,
  validateUpdate,
  validatePasswordChange,
  validateWeather,
  alreadyRegistered,
  getAllUsers: () => users,
  getUserById: (id) => users.find((user) => user.id === id),
  getUserByEmail: (email) => users.find((user) => user.email === email),
  getAllWeathers: () => weathers,
  getWeatherById: (id) => weathers.find((weather) => weather.id === id),
};
