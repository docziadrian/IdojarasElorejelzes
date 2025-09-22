const renderLoading = async () => {
  const landingPage = document.querySelector("#landingPage");
  if (!landingPage) {
    return;
  }

  const loggedIn = await loadUser();

  const loggedInView = `
        <h1>Üdvözöllek ${loggedIn.fullName}</h1>
    `;

  const loggedOutView = `
        <h1>Nem vagy bejelentkezve.</h1>
    `;
  if (loggedIn.fullName) {
    landingPage.textContent = loggedInView;
  } else {
    landingPage.textContent = loggedOutView;
  }
};
