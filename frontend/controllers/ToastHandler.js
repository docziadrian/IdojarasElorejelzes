const showToastMessage = (type, message) => {
  const alertPlaceholder = document.getElementById("myAlert");

  if (type === "error") {
    alertPlaceholder.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show shadow-lg" role="alert">
      ${message || "Hiba történt!"}
    </div>
  `;
  }

  if (type === "success") {
    alertPlaceholder.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show shadow-lg" role="alert">
      ${message || "Sikeres művelet!"}
    </div>
  `;
  }

  setTimeout(() => {
    const alertEl = alertPlaceholder.querySelector(".alert");
    if (alertEl) {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl);
      bsAlert.close();
    }
  }, 3000);
};
