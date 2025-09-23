const express = require("express");
const store = require("../lib/store");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const users = store.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználók lekérésekor" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Érvénytelen felhasználó ID" });
    }

    const user = store.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználó lekérésekor" });
  }
});

router.post("/", (req, res) => {
  try {
    const newUser = req.body;
    const validation = store.validateRegistration(newUser);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const newID = store.getNextID(store.getAllUsers());
    const userToCreate = {
      id: newID,
      fullName: newUser.fullName,
      userName: newUser.userName,
      email: newUser.email,
      password: newUser.password,
    };

    const currentUsers = store.getAllUsers();
    store.writeUsers([...currentUsers, userToCreate]);

    const { password, ...userWithoutPassword } = userToCreate;
    res.status(201).json({
      message: "Felhasználó sikeresen létrehozva",
      user: userWithoutPassword,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Szerver hiba a felhasználó létrehozásakor" });
  }
});

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email és jelszó megadása kötelező" });
    }

    const user = store.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Hibás jelszó" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: "Sikeres bejelentkezés",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a bejelentkezéskor" });
  }
});

router.put("/:id", (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Érvénytelen felhasználó ID" });
    }

    const updatedData = req.body;
    const users = store.getAllUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "Felhasználó nem található" });
    }

    if (updatedData.email && updatedData.email !== users[userIndex].email) {
      if (store.alreadyRegistered(updatedData.email)) {
        return res
          .status(400)
          .json({ error: "Ez az email cím már regisztrálva van" });
      }
    }

    const validation = store.validateUpdate({
      fullName: updatedData.fullName || users[userIndex].fullName,
      userName: updatedData.userName || users[userIndex].userName,
    });

    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const updatedUser = { ...users[userIndex], ...updatedData };
    users[userIndex] = updatedUser;
    store.writeUsers(users);

    const { password, ...userWithoutPassword } = updatedUser;
    res.json({
      message: "Felhasználó sikeresen frissítve",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználó frissítésekor" });
  }
});

router.put("/:id/password", (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Érvénytelen felhasználó ID" });
    }

    const { oldPassword, newPassword, newPasswordAgain } = req.body;
    const users = store.getAllUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "Felhasználó nem található" });
    }

    if (users[userIndex].password !== oldPassword) {
      return res.status(401).json({ error: "Régi jelszó nem megfelelő" });
    }

    const validation = store.validatePasswordChange({
      oldPassword,
      password: newPassword,
      passwordAgain: newPasswordAgain,
    });

    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    users[userIndex].password = newPassword;
    store.writeUsers(users);

    res.json({ message: "Jelszó sikeresen frissítve" });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a jelszó frissítésekor" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Érvénytelen felhasználó ID" });
    }

    const user = store.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található" });
    }

    const updatedUsers = store.getAllUsers().filter((u) => u.id !== userId);
    store.writeUsers(updatedUsers);

    res.json({
      message: `${user.fullName} nevű felhasználó sikeresen törölve`,
    });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a felhasználó törlésekor" });
  }
});

router.delete("/", (req, res) => {
  try {
    store.writeUsers([]);
    res.json({ message: "Összes felhasználó sikeresen törölve" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Szerver hiba az összes felhasználó törlésekor" });
  }
});

module.exports = router;
