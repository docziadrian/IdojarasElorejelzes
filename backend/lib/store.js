const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "..", "database", "users.json");
const WEATHER_FILE = path.join(__dirname, "..", "database", "weathers.json");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const users = readUsers();
const weathers = readWeathers();

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

function initStore() {
  readUsers();
  readWeathers();
}

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
}

function readWeathers() {
  if (!fs.existsSync(WEATHER_FILE)) {
    return [];
  }
  const data = fs.readFileSync(WEATHER_FILE);
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function writeWeathers(weathers) {
  fs.writeFileSync(WEATHER_FILE, JSON.stringify(weathers, null, 2));
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
  alreadyRegistered,
  getAllUsers: () => users,
  getUserById: (id) => users.find((user) => user.id === id),
  getUserByEmail: (email) => users.find((user) => user.email === email),
  getAllWeathers: () => weathers,
  getWeatherById: (id) => weathers.find((weather) => weather.id === id),
};
