const validateFrontendRegistration = (data) => {
  const { fullName, username, email, password, passwordAgain } = data;
  if (!fullName || !username || !email || !password || !passwordAgain) {
    showToastMessage("error", "Minden mező kitöltése kötelező!");
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (!usernameRegex.test(username)) {
    showToastMessage(
      "error",
      "A felhasználónév csak betűket, számokat és alulvonást tartalmazhat, és 3-20 karakter hosszú lehet."
    );
    return false;
  }

  if (!emailRegex.test(email)) {
    showToastMessage("error", "Érvénytelen email cím!");
    return false;
  }

  if (!passwordRegex.test(password)) {
    showToastMessage(
      "error",
      "A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább egy nagybetűt, egy kisbetűt, egy számot és egy speciális karaktert. A pont és a vessző nem számít speciális karakternek."
    );
    return false;
  }

  if (password !== passwordAgain) {
    showToastMessage("error", "A jelszavak nem egyeznek!");
    return false;
  }

  return true;
};

const handleRegistration = async () => {
  const registeringFullName = document.getElementById("registeringFullName");
  const registeringUsername = document.getElementById("registeringUsername");
  const registeringEmail = document.getElementById("registeringEmail");
  const registeringPassword = document.getElementById("registeringPassword");
  const registeringPasswordAgain = document.getElementById(
    "registeringPasswordAgain"
  );

  registeringFullName.value = registeringFullName.value.trim();
  registeringUsername.value = registeringUsername.value.trim();
  registeringEmail.value = registeringEmail.value.trim();
  registeringPassword.value = registeringPassword.value.trim();
  registeringPasswordAgain.value = registeringPasswordAgain.value.trim();

  validateFrontendRegistration({
    fullName: registeringFullName.value,
    username: registeringUsername.value,
    email: registeringEmail.value,
    password: registeringPassword.value,
    passwordAgain: registeringPasswordAgain.value,
  });

  try {
    const { response } = await axios.post("http://localhost:3000/users", {
      fullName: registeringFullName.value,
      userName: registeringUsername.value,
      email: registeringEmail.value,
      password: registeringPassword.value,
      passwordAgain: registeringPasswordAgain.value,
    });

    showToastMessage("success", "Sikeres regisztráció!");
    // Ne legyen átirányítás, csak töröljük a mezőket
  } catch (error) {
    console.log(error.response.data);
    showToastMessage("error", error.response.data.error);
  }
};
