const handleUpdate = async () => {};

const getProfileHandler = async () => {
  const user = await loadUser();

  document.querySelector("#currentFullName").textContent = user.fullName;
  document.querySelector("#currentUserName").textContent = user.userName;
  document.querySelector("#currentEmail").textContent = user.email;
  document.querySelector("#currentId").textContent = user.id;

  console.log(user);
};
