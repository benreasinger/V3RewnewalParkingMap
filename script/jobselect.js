function handleJobSelection() {
    const jobSelect = document.getElementById("selectScreen");
    const selectedJob = jobSelect.value;
  
    if (!selectedJob) {
      alert("Please select a job before proceeding.");
      return;
    }
    switch (selectedJob) {
      case "Shopper":
        window.location.href = "pages/shopping.html";
        break;
      case "ParkingManagement":
        window.location.href = "pages/createVehicle.html";
        break;
      case "Wrapper":
        window.location.href = "pages/reindeer.html";
        break;
      case "Administrator":
        window.location.href = "pages/login-page/login-page.html";
        break;
      default:
        alert("Invalid job selection.");
    }
  }
  function goBack(){
    window.history.back();
  }
  