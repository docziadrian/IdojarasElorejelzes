const validateFrontendLogin = (data) => {
  const { email, password } = data;
  if (!email || !password) {
    showToastMessage("error", "Minden mező kitöltése kötelező!");
    return false;
  }

  return true;
};

const handleLogin = async () => {
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  validateFrontendLogin({
    email: loginEmail.value,
    password: loginPassword.value,
  });

  loginEmail.value = loginEmail.value.trim();
  loginPassword.value = loginPassword.value.trim();

  try {
    const { response } = await axios
      .post("http://localhost:3000/users/login", {
        email: loginEmail.value,
        password: loginPassword.value,
      })
      .then((res) => {
        saveUser(res.data.data);
        document.location.reload();
      });

    showToastMessage("success", "Sikeres bejelentkezés!");
    saveUser(response.data);
    // Ne legyen átirányítás, csak töröljük a mezőket
  } catch (error) {
    showToastMessage("error", error.response.data.error);
  }
};
