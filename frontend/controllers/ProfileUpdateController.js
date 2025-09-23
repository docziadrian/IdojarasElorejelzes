const getProfileHandler = async () => {
  try {
    const user = loadUser();
    if (!user) {
      showToastMessage("error", "Felhasználó adatok nem találhatók");
      return;
    }

    document.querySelector("#currentFullName").textContent = user.fullName;
    document.querySelector("#currentUserName").textContent = user.userName;
    document.querySelector("#currentEmail").textContent = user.email;
    document.querySelector("#currentId").textContent = user.id;

    document.getElementById("updateFullName").value = user.fullName;
    document.getElementById("updateUserName").value = user.userName;
    document.getElementById("updateEmail").value = user.email;
  } catch (error) {
    showToastMessage("error", "Hiba történt a profil adatok betöltésekor");
  }
};

const handleProfileUpdate = async () => {
  const user = loadUser();
  if (!user) {
    showToastMessage("error", "Felhasználó adatok nem találhatók");
    return;
  }

  const updateData = {
    fullName: document.getElementById("updateFullName").value.trim(),
    userName: document.getElementById("updateUserName").value.trim(),
    email: document.getElementById("updateEmail").value.trim(),
  };

  if (!updateData.fullName || !updateData.userName || !updateData.email) {
    showToastMessage("error", "Minden mező kitöltése kötelező!");
    return;
  }

  try {
    const response = await updateUserProfile(user.id, updateData);
    saveUser(response.user);
    showToastMessage("success", "Profil sikeresen frissítve!");
    getProfileHandler();
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Hiba történt a profil frissítésekor";
    showToastMessage("error", errorMessage);
  }
};

const handlePasswordChange = async () => {
  const user = loadUser();
  if (!user) {
    showToastMessage("error", "Felhasználó adatok nem találhatók");
    return;
  }

  const passwordData = {
    oldPassword: document.getElementById("oldPassword").value,
    newPassword: document.getElementById("newPassword").value,
    newPasswordAgain: document.getElementById("newPasswordAgain").value,
  };

  if (
    !passwordData.oldPassword ||
    !passwordData.newPassword ||
    !passwordData.newPasswordAgain
  ) {
    showToastMessage("error", "Minden mező kitöltése kötelező!");
    return;
  }

  if (passwordData.newPassword !== passwordData.newPasswordAgain) {
    showToastMessage("error", "Az új jelszavak nem egyeznek!");
    return;
  }

  try {
    await changeUserPassword(user.id, passwordData);
    showToastMessage("success", "Jelszó sikeresen megváltoztatva!");
    clearPasswordForm();
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Hiba történt a jelszó megváltoztatásakor";
    showToastMessage("error", errorMessage);
  }
};

const clearPasswordForm = () => {
  document.getElementById("oldPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("newPasswordAgain").value = "";
};
