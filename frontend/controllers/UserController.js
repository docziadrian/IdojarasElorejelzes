const isUserLoggedIn = () => {
  if (!localStorage.getItem("email")) {
    return false;
  }

  return true;
};

const saveUser = (data) => {
  const { fullName, userName, email } = data;
  localStorage.setItem("fullName", fullName);
  localStorage.setItem("userName", userName);
  localStorage.setItem("email", email);
};

const loadUser = () => {
  if (!localStorage.getItem("email")) {
    return null;
  }
  const user = {
    fullName: localStorage.getItem("fullName"),
    userName: localStorage.getItem("userName"),
    email: localStorage.getItem("email"),
  };

  return user;
};

const logout = () => {
  localStorage.removeItem("fullName");
  localStorage.removeItem("userName");
  localStorage.removeItem("email");

  document.location.reload();
};
