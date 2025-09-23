const renderLoading = async () => {
  const landingPage = document.querySelector("#appMain");
  if (!landingPage) {
    setTimeout(async () => {
      await renderLoading();
    }, 1000);
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
