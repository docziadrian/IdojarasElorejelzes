const API_BASE_URL = "http://localhost:3000";

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
      "A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább egy nagybetűt, egy kisbetűt, egy számot és egy speciális karaktert."
    );
    return false;
  }

  if (password !== passwordAgain) {
    showToastMessage("error", "A jelszavak nem egyeznek!");
    return false;
  }

  return true;
};

window.handleRegistration = async () => {
  const formData = {
    fullName: document.getElementById("registeringFullName").value.trim(),
    username: document.getElementById("registeringUsername").value.trim(),
    email: document.getElementById("registeringEmail").value.trim(),
    password: document.getElementById("registeringPassword").value.trim(),
    passwordAgain: document
      .getElementById("registeringPasswordAgain")
      .value.trim(),
  };

  if (!validateFrontendRegistration(formData)) {
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/users`, {
      fullName: formData.fullName,
      userName: formData.username,
      email: formData.email,
      password: formData.password,
      passwordAgain: formData.passwordAgain,
    });

    showToastMessage("success", "Sikeres regisztráció!");
    clearRegistrationForm();
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Hiba történt a regisztráció során";
    showToastMessage("error", errorMessage);
  }
};

window.clearRegistrationForm = () => {
  document.getElementById("registeringFullName").value = "";
  document.getElementById("registeringUsername").value = "";
  document.getElementById("registeringEmail").value = "";
  document.getElementById("registeringPassword").value = "";
  document.getElementById("registeringPasswordAgain").value = "";
};
