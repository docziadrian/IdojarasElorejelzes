const setError = (err, type) => {
  const alertPlaceholder = document.getElementById("myAlert");

  alertPlaceholder.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show shadow-lg" role="alert">
      ${err}
    </div>
  `;

  setTimeout(() => {
    const alertEl = alertPlaceholder.querySelector(".alert");
    if (alertEl) {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl);
      bsAlert.close();
    }
  }, 3000);
};

// TODO: endpoint tesztek, a lekeresnel jovobeli datum, footerbe az adatok, legyen kulon futtathato dev es prod modban is az app,
