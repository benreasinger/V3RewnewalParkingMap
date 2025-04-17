<<<<<<< HEAD
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbs6UgbaxuxKZyG3v464lkeEtMJQbZ6-4",
    authDomain: "renewalparking.firebaseapp.com",
    databaseURL: "https://renewalparking-default-rtdb.firebaseio.com",
    projectId: "renewalparking",
    storageBucket: "renewalparking.appspot.com",
    messagingSenderId: "398724226058",
    appId: "1:398724226058:web:cfb4d70283c546944d13f3",
    measurementId: "G-SGV7YXDJ8X"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  console.log("Firebase initialized successfully!");
  
  // Global variables
  let totalSlots = 160;
  let parkingSlots = [];
  let lastRemovedSlot = null;
  
  // Initialize parking slots
  function initializeParkingSlots() {
    parkingSlots = Array.from({ length: totalSlots }, (_, i) => ({
      "parking-number": (i + 1).toString(),
      "car-number": "",
      "language": "N/A",
      "status": "N/A"
    }));
    updateDatabase();
  }
  
  // Update Firebase
  function updateDatabase() {
    firebase.database().ref('parkingSlots').set(parkingSlots)
      .then(() => console.log("Database updated successfully."))
      .catch(error => console.error("Error updating database:", error));
  }
  
  // Render the parking map
  function renderParkingMap() {
    const parkingMap = document.getElementById("parkingMap");
    parkingMap.innerHTML = "";
  
    parkingSlots.filter(slot => slot["car-number"]).forEach(slot => {
      const slotDiv = document.createElement("div");
      slotDiv.className = `parking-slot ${slot.status ? `status-${slot.status.toLowerCase().replace(/ /g, '-')}` : ''}`;
      slotDiv.innerHTML = `
        <strong>Spot ${slot["parking-number"]}</strong><br>
        Status: ${slot.status}<br>
        Car #: ${slot["car-number"]}<br>
        Language: ${slot.language}
      `;
  
      // Add Remove Button (for All Parked Vehicles page)
      if (window.location.pathname.includes("reindeer.html")) {
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove Car";
        removeButton.onclick = () => removeCar(slot["parking-number"]);
        slotDiv.appendChild(removeButton);
      }
  
      // Add Change Status Button (for Shopping page)
      if (window.location.pathname.includes("shopping.html")) {
        const statusButton = document.createElement("button");
        statusButton.textContent = "Change Status";
        statusButton.onclick = () => changeStatus(slot["parking-number"]);
        slotDiv.appendChild(statusButton);
      }
  
      parkingMap.appendChild(slotDiv);
    });
  }
  
  // Create a new vehicle
  function createVehicle() {
    const carNumber = document.getElementById("newCarNumber").value.trim();
    const language = document.getElementById("newCarLanguage").value;
    const parkingNumber = parseInt(document.getElementById("parkingNumberInput").value);
  
    if (!carNumber || isNaN(parkingNumber) || parkingNumber < 1 || parkingNumber > totalSlots) {
      alert("Please enter valid car details.");
      return;
    }
  
    // Check if car number already exists in the parking lot
    const isDuplicate = parkingSlots.some(slot => slot["car-number"] === carNumber);
    if (isDuplicate) {
      alert(`Error: The car number ${carNumber} is already parked in another spot.`);
      return; 
    }
  
    const slot = parkingSlots.find(slot => slot["parking-number"] === parkingNumber.toString());
  
    if (slot && !slot["car-number"]) {
      slot["car-number"] = carNumber;
      slot.language = language;
      slot.status = "In-Car";
      updateDatabase();
      renderParkingMap();
      closeModal();
    } else {
      alert("Parking spot is already occupied or invalid.");
    }
  }
  
  // Track removed cars
let removedCars = [];

// Reference to Firebase removed cars data
const removedCarsRef = firebase.database().ref('removedCars');

// Fetch removed cars on page load
function fetchRemovedCars() {
    removedCarsRef.on('value', snapshot => {
        removedCars = snapshot.val() || [];
        renderRemovedCars();
    });
}

// Remove a car and save it in Firebase
function removeCar(parkingNumber) {
    const slot = parkingSlots.find(slot => slot["parking-number"] === parkingNumber);
    if (slot && slot["car-number"]) {
        lastRemovedSlot = { ...slot };
        
        // Save removed car details
        removedCars.push({ 
            "parking-number": slot["parking-number"], 
            "car-number": slot["car-number"], 
            "language": slot.language, 
            "status": slot.status, 
            "removedAt": new Date().toLocaleString()
        });

        // Clear slot
        slot["car-number"] = "";
        slot.language = "N/A";
        slot.status = "N/A";

        // Update Firebase
        firebase.database().ref('removedCars').set(removedCars);
        updateDatabase();
        renderParkingMap();
    }
}

// Remove a car and save all relevant data in Firebase
function removeCar(parkingNumber) {
  const slot = parkingSlots.find(slot => slot["parking-number"] === parkingNumber);
  if (slot && slot["car-number"]) {
      lastRemovedSlot = { ...slot };

      // Save the full car details before removing
      const removedCarDetails = {
          "parking-number": slot["parking-number"],
          "car-number": slot["car-number"],
          "language": slot.language,
          "status": slot.status,
          "removedAt": new Date().toLocaleString()  // Timestamp of removal
      };

      // Push the removed car details into Firebase
      firebase.database().ref('removedCars').push(removedCarDetails);

      // Clear the slot
      slot["car-number"] = "";
      slot.language = "N/A";
      slot.status = "N/A";

      // Update Firebase and the UI
      updateDatabase();
      renderParkingMap();

      // Optionally, fetch and update removed cars list immediately
      fetchRemovedCars(); // Call fetch to update removed cars list
  }
}




// Reset removed cars list
function resetRemovedCars() {
    firebase.database().ref('removedCars').set([])
        .then(() => {
            removedCars = [];
            renderRemovedCars();
        });
}

// Initialize removed cars page
if (window.location.pathname.includes("removed-cars.html")) {
    fetchRemovedCars();
}

  
  // Change the status of a parking slot
  function changeStatus(parkingNumber) {
    const slot = parkingSlots.find(slot => slot["parking-number"] === parkingNumber);
    if (slot && slot["car-number"]) {
      const statuses = ["In-Car", "Fetch-to-shop", "Shopping", "Wrapping", "Waiting for Reindeer"];
      const currentStatusIndex = statuses.indexOf(slot.status);
      slot.status = statuses[(currentStatusIndex + 1) % statuses.length];
      updateDatabase();
      renderParkingMap();
    }
  }
  
  // Open modal
  function openModal() {
    document.getElementById("vehicleModal").style.display = "block";
  }
  
  // Close modal
  function closeModal() {
    document.getElementById("vehicleModal").style.display = "none";
  }
  
  // Undo remove vehicle
  function undoRemove() {
    if (lastRemovedSlot) {
      const slot = parkingSlots.find(s => s["parking-number"] === lastRemovedSlot["parking-number"]);
      
      if (slot) {
        // Restore car details from last removed slot
        slot["car-number"] = lastRemovedSlot["car-number"];
        slot.language = lastRemovedSlot.language;
        slot.status = lastRemovedSlot.status;
  
        // Clear lastRemovedSlot after restoration
        lastRemovedSlot = null;
  
        // Update the database and re-render the map
        updateDatabase();
        renderParkingMap();
      }
    }
  }
  function goBack(){
    window.history.back();
  }
  
  // Initialize
  function init() {
    const parkingSlotsRef = firebase.database().ref('parkingSlots');
  
    parkingSlotsRef.once('value')
      .then(snapshot => {
        parkingSlots = snapshot.exists() ? snapshot.val() : initializeParkingSlots();
        renderParkingMap();
      });
  
    parkingSlotsRef.on('value', snapshot => {
      parkingSlots = snapshot.val() || [];
      renderParkingMap();
    });
  }
  
  init();
=======
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbs6UgbaxuxKZyG3v464lkeEtMJQbZ6-4",
    authDomain: "renewalparking.firebaseapp.com",
    databaseURL: "https://renewalparking-default-rtdb.firebaseio.com",
    projectId: "renewalparking",
    storageBucket: "renewalparking.appspot.com",
    messagingSenderId: "398724226058",
    appId: "1:398724226058:web:cfb4d70283c546944d13f3",
    measurementId: "G-SGV7YXDJ8X"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  console.log("Firebase initialized successfully!");
  
  // Global variables
  let totalSlots = 160;
  let parkingSlots = [];
  let lastRemovedSlot = null;
  
  // Initialize parking slots
  function initializeParkingSlots() {
    parkingSlots = Array.from({ length: totalSlots }, (_, i) => ({
      "parking-number": (i + 1).toString(),
      "car-number": "",
      "language": "N/A",
      "status": "N/A"
    }));
    updateDatabase();
  }
  
  // Update Firebase
  function updateDatabase() {
    firebase.database().ref('parkingSlots').set(parkingSlots)
      .then(() => console.log("Database updated successfully."))
      .catch(error => console.error("Error updating database:", error));
  }
  
  // Render the parking map
  function renderParkingMap() {
    const parkingMap = document.getElementById("parkingMap");
    parkingMap.innerHTML = "";
  
    parkingSlots.filter(slot => slot["car-number"]).forEach(slot => {
      const slotDiv = document.createElement("div");
      slotDiv.className = `parking-slot ${slot.status ? `status-${slot.status.toLowerCase().replace(/ /g, '-')}` : ''}`;
      slotDiv.innerHTML = `
        <strong>Spot ${slot["parking-number"]}</strong><br>
        Status: ${slot.status}<br>
        Car #: ${slot["car-number"]}<br>
        Language: ${slot.language}
      `;
  
      // Add Remove Button (for All Parked Vehicles page)
      if (window.location.pathname.includes("reindeer.html")) {
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove Car";
        removeButton.onclick = () => removeCar(slot["parking-number"]);
        slotDiv.appendChild(removeButton);
      }
  
      // Add Change Status Button (for Shopping page)
      if (window.location.pathname.includes("shopping.html")) {
        const statusButton = document.createElement("button");
        statusButton.textContent = "Change Status";
        statusButton.onclick = () => changeStatus(slot["parking-number"]);
        slotDiv.appendChild(statusButton);
      }
  
      parkingMap.appendChild(slotDiv);
    });
  }
  
  // Create a new vehicle
  function createVehicle() {
    const carNumber = document.getElementById("newCarNumber").value.trim();
    const language = document.getElementById("newCarLanguage").value;
    const parkingNumber = parseInt(document.getElementById("parkingNumberInput").value);
  
    if (!carNumber || isNaN(parkingNumber) || parkingNumber < 1 || parkingNumber > totalSlots) {
      alert("Please enter valid car details.");
      return;
    }
  
    // Check if car number already exists in the parking lot
    const isDuplicate = parkingSlots.some(slot => slot["car-number"] === carNumber);
    if (isDuplicate) {
      alert(`Error: The car number ${carNumber} is already parked in another spot.`);
      return; 
    }
  
    const slot = parkingSlots.find(slot => slot["parking-number"] === parkingNumber.toString());
  
    if (slot && !slot["car-number"]) {
      slot["car-number"] = carNumber;
      slot.language = language;
      slot.status = "In-Car";
      updateDatabase();
      renderParkingMap();
      closeModal();
    } else {
      alert("Parking spot is already occupied or invalid.");
    }
  }
  
  // Track removed cars
let removedCars = [];

// Reference to Firebase removed cars data
const removedCarsRef = firebase.database().ref('removedCars');

// Fetch removed cars on page load
function fetchRemovedCars() {
    removedCarsRef.on('value', snapshot => {
        removedCars = snapshot.val() || [];
        renderRemovedCars();
    });
}

// Remove a car and save it in Firebase
function removeCar(parkingNumber) {
    const slot = parkingSlots.find(slot => slot["parking-number"] === parkingNumber);
    if (slot && slot["car-number"]) {
        lastRemovedSlot = { ...slot };
        
        // Save removed car details
        removedCars.push({ 
            "parking-number": slot["parking-number"], 
            "car-number": slot["car-number"], 
            "language": slot.language, 
            "status": slot.status, 
            "removedAt": new Date().toLocaleString()
        });

        // Clear slot
        slot["car-number"] = "";
        slot.language = "N/A";
        slot.status = "N/A";

        // Update Firebase
        firebase.database().ref('removedCars').set(removedCars);
        updateDatabase();
        renderParkingMap();
    }
}

// Remove a car and save all relevant data in Firebase
function removeCar(parkingNumber) {
  const slot = parkingSlots.find(slot => slot["parking-number"] === parkingNumber);
  if (slot && slot["car-number"]) {
      lastRemovedSlot = { ...slot };

      // Save the full car details before removing
      const removedCarDetails = {
          "parking-number": slot["parking-number"],
          "car-number": slot["car-number"],
          "language": slot.language,
          "status": slot.status,
          "removedAt": new Date().toLocaleString()  // Timestamp of removal
      };

      // Push the removed car details into Firebase
      firebase.database().ref('removedCars').push(removedCarDetails);

      // Clear the slot
      slot["car-number"] = "";
      slot.language = "N/A";
      slot.status = "N/A";

      // Update Firebase and the UI
      updateDatabase();
      renderParkingMap();

      // Optionally, fetch and update removed cars list immediately
      fetchRemovedCars(); // Call fetch to update removed cars list
  }
}




// Reset removed cars list
function resetRemovedCars() {
    firebase.database().ref('removedCars').set([])
        .then(() => {
            removedCars = [];
            renderRemovedCars();
        });
}

// Initialize removed cars page
if (window.location.pathname.includes("removed-cars.html")) {
    fetchRemovedCars();
}

  
  // Change the status of a parking slot
  function changeStatus(parkingNumber) {
    const slot = parkingSlots.find(slot => slot["parking-number"] === parkingNumber);
    if (slot && slot["car-number"]) {
      const statuses = ["In-Car", "Fetch-to-shop", "Shopping", "Wrapping", "Waiting for Reindeer"];
      const currentStatusIndex = statuses.indexOf(slot.status);
      slot.status = statuses[(currentStatusIndex + 1) % statuses.length];
      updateDatabase();
      renderParkingMap();
    }
  }
  
  // Open modal
  function openModal() {
    document.getElementById("vehicleModal").style.display = "block";
  }
  
  // Close modal
  function closeModal() {
    document.getElementById("vehicleModal").style.display = "none";
  }
  
  // Undo remove vehicle
  function undoRemove() {
    if (lastRemovedSlot) {
      const slot = parkingSlots.find(s => s["parking-number"] === lastRemovedSlot["parking-number"]);
      
      if (slot) {
        // Restore car details from last removed slot
        slot["car-number"] = lastRemovedSlot["car-number"];
        slot.language = lastRemovedSlot.language;
        slot.status = lastRemovedSlot.status;
  
        // Clear lastRemovedSlot after restoration
        lastRemovedSlot = null;
  
        // Update the database and re-render the map
        updateDatabase();
        renderParkingMap();
      }
    }
  }
  function goBack(){
    window.history.back();
  }
  
  // Initialize
  function init() {
    const parkingSlotsRef = firebase.database().ref('parkingSlots');
  
    parkingSlotsRef.once('value')
      .then(snapshot => {
        parkingSlots = snapshot.exists() ? snapshot.val() : initializeParkingSlots();
        renderParkingMap();
      });
  
    parkingSlotsRef.on('value', snapshot => {
      parkingSlots = snapshot.val() || [];
      renderParkingMap();
    });
  }
  
  init();
>>>>>>> 9b29609b2d4bcc7e47462940e1311a6a7cce2607
  