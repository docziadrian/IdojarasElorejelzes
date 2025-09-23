const isUserLoggedIn = () => {
  return !!localStorage.getItem("userData");
};

const saveUser = (userData) => {
  localStorage.setItem("userData", JSON.stringify(userData));
};

const loadUser = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

window.logout = () => {
  localStorage.removeItem("userData");
  window.location.reload();
};

const updateUserProfile = async (userId, userData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const changeUserPassword = async (userId, passwordData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}/password`,
      passwordData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
