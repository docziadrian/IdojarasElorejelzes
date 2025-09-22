const express = require("express");
const store = require("../lib/store");
const router = express.Router();

// Összes felhasználók lekérése
router.get("/", (req, res) => {
  const users = store.getAllUsers();
  res.json(users);
});

// Egy adott felhasználó lekérése ID alapján
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  const user = store.getUserById(Number(userId));
  if (!user) {
    return res.status(404).send("Felhasználó nem található");
  }
  res.send(`${userId}. felhasználó: ${JSON.stringify(user)}`);
});

// Egy adott felhasználó törlése ID alapján
router.delete("/:id", (req, res) => {
  const userId = Number(req.params.id);
  console.log(typeof userId);
  const user = store.getUserById(userId);
  if (!user) {
    return res.status(404).send("Felhasználó nem található");
  }
  const updatedUsers = store.getAllUsers().filter((u) => u.id !== userId);
  store.writeUsers(updatedUsers);
  res.send(`${user.fullName} nevű felhasználó törölve.`);
});

// Új felhasználó létrehozása
router.post("/", (req, res) => {
  const newUser = req.body;
  const { fullName, userName, email, password, passwordAgain } = newUser;

  // Validálja, hogy létezik-e, megfelel -e a regexeknek, és hogy a jelszavak egyeznek -e
  const validation = store.validateRegistration(newUser);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  // Egyéni azonosító generálása
  const newID = store.getNextID(store.getAllUsers());
  newUser.id = newID;

  const putThis = {
    id: newID,
    fullName,
    userName,
    email,
    password,
  };

  store.writeUsers([...store.getAllUsers(), putThis]);

  res.status(201).send(`Új felhasználó létrehozva: ${JSON.stringify(putThis)}`);
});

// Felhasználó bejelentkezése email és jelszó alapján
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = store.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: "Felhasználó nem található" });
  }
  const isPasswordCorrect = user.password === password;
  if (!isPasswordCorrect) {
    return res.status(400).json({ error: "Hibás jelszó" });
  }
  res.json({ data: user });
});

// Felhasználó adatainak frissítése (kivéve jelszó) ID alapján
router.put("/:id", (req, res) => {
  const userId = Number(req.params.id);
  const updatedData = req.body;
  const users = store.getAllUsers();
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).send("Felhasználó nem található");
  }
  const isSameEmail = users[userIndex].email === updatedData.email;
  if (!isSameEmail && store.alreadyRegistered(updatedData.email)) {
    return res.status(400).send("Ez az email cím már regisztrálva van!");
  }
  const updatedUser = { ...users[userIndex], ...updatedData };
  const validation = store.validateUpdate({
    fullName: updatedUser.fullName,
    userName: updatedUser.userName,
  });
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  users[userIndex] = updatedUser;
  store.writeUsers(users);
  res.send(`Felhasználó frissítve: ${JSON.stringify(updatedUser)}`);
});

// Felhasználó jelszavának frissítése ID alapján
router.put("/:id/password", (req, res) => {
  const userId = Number(req.params.id);
  const updatedData = req.body;
  const users = store.getAllUsers();
  const { oldPassword, newPassword, newPasswordAgain } = req.body;
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).send("Felhasználó nem található");
  }
  const isOldPasswordCorrect = users[userIndex].password === oldPassword;
  if (!isOldPasswordCorrect) {
    return res.status(400).send("Régi jelszó nem megfelelő");
  }

  if (newPassword !== newPasswordAgain) {
    return res.status(400).send("Az új jelszavak nem egyeznek");
  }

  if (store.validatePassword(newPassword) === false) {
    return res
      .status(400)
      .send("Az új jelszó nem felel meg a követelményeknek");
  }

  const validation = store.validatePasswordChange({
    oldPassword: oldPassword,
    password: newPassword,
    passwordAgain: newPasswordAgain,
  });
  const newPasswordValid = newPassword;
  if (!validation) {
    return res.status(400).send("A jelszó nem felel meg a követelményeknek");
  }
  const updatedUser = {
    ...users[userIndex],
    password: updatedData.newPassword,
  };
  users[userIndex] = updatedUser;
  store.writeUsers(users);
  res.send(`Felhasználó jelszava frissítve: ${JSON.stringify(updatedUser)}`);
});

module.exports = router;
