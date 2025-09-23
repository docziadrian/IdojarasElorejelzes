window.renderLanding = () => {
  const container = document.querySelector("#appMain");
  if (!container) return;
  const loggedIn = isUserLoggedIn();
  if (loggedIn) return;

  container.innerHTML = `
  <div class="container-fluid">
    <div class="row g-4 justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0 hover-card">
          <div class="card-body text-center p-4">
            <div class="mb-3">
              <i class="bi bi-person-plus text-primary" style="font-size: 3rem"></i>
            </div>
            <h5 class="card-title">Regisztráció</h5>
            <p class="card-text">Hozzon létre egy új fiókot az alkalmazás használatához</p>
            <button onclick="render('Registration')" class="btn btn-primary">
              <i class="bi bi-person-check me-2"></i>
              Regisztráció
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0 hover-card">
          <div class="card-body text-center p-4">
            <div class="mb-3">
              <i class="bi bi-box-arrow-in-right text-success" style="font-size: 3rem"></i>
            </div>
            <h5 class="card-title">Bejelentkezés</h5>
            <p class="card-text">Lépjen be a mentett adatok megtekintéséhez</p>
            <button onclick="render('Login')" class="btn btn-success">
              <i class="bi bi-box-arrow-in-right me-2"></i>
              Bejelentkezés
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};
