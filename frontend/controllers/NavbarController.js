const mainSection = document.querySelector("#appMain");
const navbarMenu = document.querySelector("#navLinks");

document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = isUserLoggedIn();

  console.log(loggedIn);

  const notLoggedInMenu = `
    <li onclick="render('landing')" class="nav-item">
      <a class="nav-link" aria-current="page">Főoldal</a>
    </li>
    <li onclick="render('registration')" class="nav-item">
      <a class="nav-link">Regisztráció</a>
    </li>
    <li onclick="render('login')" class="nav-item">
      <a class="nav-link">Bejelentkezés</a>
    </li>`;

  const loggedInMenu = `
    <li onclick="render('landing')" class="nav-item">
      <a class="nav-link" aria-current="page">Főoldal</a>
    </li>
     <li onclick="render('felvetel')" class="nav-item">
      <a class="nav-link" aria-current="page">Felvétel</a>
    </li>
    <li onclick="logout()" class="nav-item">
      <a class="nav-link" aria-current="page">Kijelentkezés</a>
    </li>
    `;

  if (!loggedIn) {
    navbarMenu.innerHTML = notLoggedInMenu;
  } else {
    navbarMenu.innerHTML = loggedInMenu;
  }

  render("landing");
});

let render = async (view) => {
  mainSection.innerHTML = await (await fetch(`views/${view}.html`)).text();

  switch (view) {
    case "landing":
      await renderLoading();
      break;
    case "felvetel":
      break;
    case "main":
      setDate();
      await getSteps();
      renderSteps();
      break;
    case "statistics":
      await getChartData();
      initChart();
      break;
  }
};
