const validateFrontendLogin = (data) => {
  const { email, password } = data;

  if (!email || !password) {
    showToastMessage("error", "Minden mező kitöltése kötelező!");
    return false;
  }

  return true;
};

handleLogin = async () => {
  const formData = {
    email: document.getElementById("loginEmail").value.trim(),
    password: document.getElementById("loginPassword").value.trim(),
  };

  if (!validateFrontendLogin(formData)) {
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, formData);

    saveUser(response.data.user);
    showToastMessage("success", "Sikeres bejelentkezés!");
    clearLoginForm();
    window.location.reload();
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Hiba történt a bejelentkezés során";
    showToastMessage("error", errorMessage);
  }
};

clearLoginForm = () => {
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
};
