function handleJobSelection() {
    const jobSelect = document.getElementById("selectScreen");
    const selectedJob = jobSelect.value;
  
    if (!selectedJob) {
      alert("Please select a job before proceeding.");
      return;
    }
    // Redirect based on the selected job
    switch (selectedJob) {
      case "Shopper":
        window.location.href = "../shopping.html";
        break;
      case "ParkingManagement":
        window.location.href = "../createVehicle.html";
        break;
      case "Wrapper":
        window.location.href = "../reindeer.html";
        break;
      case "Administrator":
        window.location.href = "../login-page/login-page.html";
        break;
      default:
        alert("Invalid job selection.");
    }
  }
  function goBack(){
    window.history.back();
  }
  