// jobselect.js
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
function goBack() {
    window.history.back();
}

// login-page.js
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
let loginattemps = 0;

loginButton?.addEventListener("click", (e) => {
    e.preventDefault();
    const password = loginForm.password.value;
    if (password === "3478") {
        loginErrorMsg.style.opacity = 0;
        window.location.replace("../admin-page.html");
        loginattemps = 0;
    } else if (loginattemps < 1) {
        loginErrorMsg.style.opacity = 1;
        loginattemps++;
        loginErrorMsg.style.opacity = 0;
    } else {
        loginErrorMsg.style.opacity = 1;
        setTimeout(() => { loginErrorMsg.style.opacity = 0; }, 2000);
    }
});

// Firebase Configuration (shared)
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
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
console.log("Firebase initialized successfully!");

// Core Variables
let totalSlots = 160;
let parkingSlots = [];
let lastRemovedSlot = null;


function initializeParkingSlots() {
    parkingSlots = Array.from({ length: totalSlots }, (_, i) => ({
        "parking-number": (i + 1).toString(),
        "car-number": "",
        "language": "N/A",
        "status": "N/A"
    }));
    updateDatabase();
}

function updateDatabase() {
    firebase.database().ref('parkingSlots').set(parkingSlots)
        .then(() => console.log("Database updated successfully."))
        .catch(error => console.error("Error updating database:", error));
}

function toggleFab() {
    document.querySelector(".fab-container")?.classList.toggle("open");
}

function createVehicle() {
    const carNumber = document.getElementById("newCarNumber").value.trim();
    const language = document.getElementById("newCarLanguage").value;
    const parkingNumber = parseInt(document.getElementById("parkingNumberInput").value);

    if (!carNumber || isNaN(parkingNumber) || parkingNumber < 1 || parkingNumber > totalSlots) {
        alert("Please enter valid car details.");
        return;
    }

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
        slot.parkedAt = Date.now();

        updateDatabase();
        renderParkingMap();
        closeModal();
    } else {
        alert("Parking spot is already occupied or invalid.");
    }
}

if (window.location.pathname.includes("parkingmap.html")) {
    console.log("only admin priv");
    function renderParkingMap() {
      const parkingMap = document.getElementById("parkingMap");
      parkingMap.innerHTML = ""; // Clear existing map
  
      const isDisplayOnly = window.location.pathname.includes('display-only.html'); 
  
      parkingSlots.forEach(slot => {
        const slotDiv = document.createElement("div");
        slotDiv.className = `parking-slot ${slot["car-number"] ? "occupied" : "available"} ${slot.status ? `status-${slot.status.toLowerCase().replace(/ /g, '-')}` : ''}`;
        slotDiv.id = `slot-${slot["parking-number"]}`;
  
        const parkedTime = slot.parkedAt ? calculateParkedTime(slot.parkedAt) : "Just parked";
        slotDiv.innerHTML = `
            <strong>Spot ${slot["parking-number"]}</strong><br>
            Status: ${slot.status}<br>
            Car #: ${slot["car-number"]}<br>
            Language: ${slot.language}<br>
            Parked: ${parkedTime}
        `;
  
          const addButton = document.createElement("button");
          addButton.textContent = "Add Car";
          addButton.onclick = () => openModal('addCar', slot["parking-number"]);
          addButton.disabled = !!slot["car-number"];
  
          const removeButton = document.createElement("button");
          removeButton.textContent = "Remove Car";
          removeButton.onclick = () => removeCar(slot["parking-number"]);
          removeButton.disabled = !slot["car-number"];
  
          const statusButton = document.createElement("button");
          statusButton.textContent = "Change Status";
          statusButton.onclick = () => changeStatus(slot["parking-number"]);
          statusButton.disabled = !slot["car-number"];
  
          if (slot["car-number"]) {
            slotDiv.appendChild(removeButton);
            slotDiv.appendChild(statusButton);
          } else {
            slotDiv.appendChild(addButton);
          }
  
        parkingMap.appendChild(slotDiv);
      });
    }}

function renderParkingMap() {
    const parkingMap = document.getElementById("parkingMap");
    if (!parkingMap) return;

    parkingMap.innerHTML = "";
    parkingSlots.filter(slot => slot["car-number"]).forEach(slot => {
        const slotDiv = document.createElement("div");
        slotDiv.className = `parking-slot ${slot.status ? `status-${slot.status.toLowerCase().replace(/ /g, '-')}` : ''}`;

        const parkedTime = slot.parkedAt ? calculateParkedTime(slot.parkedAt) : "Just parked";
        slotDiv.innerHTML = `
            <strong>Spot ${slot["parking-number"]}</strong><br>
            Status: ${slot.status}<br>
            Car #: ${slot["car-number"]}<br>
            Language: ${slot.language}<br>
            Parked: ${parkedTime}
        `;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove Car";
        removeButton.onclick = () => removeCar(slot["parking-number"]);

        const statusButton = document.createElement("button");
        statusButton.textContent = "Change Status";
        statusButton.onclick = () => changeStatus(slot["parking-number"]);

        slotDiv.appendChild(removeButton);
        slotDiv.appendChild(statusButton);

        parkingMap.appendChild(slotDiv);
    });
}
function openModal() {
    document.getElementById("vehicleModal").style.display = "block";
  }

  function closeModal() {
    document.getElementById("vehicleModal").style.display = "none";
  }

function calculateParkedTime(parkedAt) {
    const now = Date.now();
    const elapsed = now - parkedAt;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

function renderParkingMap() {
    const parkingMap = document.getElementById("parkingMap");
    if (!parkingMap) return;

    parkingMap.innerHTML = "";

    // Only show buttons on these pages
    const removeButt = window.location.pathname.endsWith("/reindeer.html") || window.location.pathname.endsWith("/reindeer.html");
    const statusButt =  window.location.pathname.endsWith("/shopping.html");
    parkingSlots.filter(slot => slot["car-number"]).forEach(slot => {
        const slotDiv = document.createElement("div");
        slotDiv.className = `parking-slot ${slot.status ? `status-${slot.status.toLowerCase().replace(/ /g, '-')}` : ''}`;

        const parkedTime = slot.parkedAt ? calculateParkedTime(slot.parkedAt) : "Just parked";

        slotDiv.innerHTML = `
            <strong>Spot ${slot["parking-number"]}</strong><br>
            Status: ${slot.status}<br>
            Car #: ${slot["car-number"]}<br>
            Language: ${slot.language}<br>
            Parked: ${parkedTime}
        `;

        if (removeButt) {
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove Car";
            removeButton.onclick = () => removeCar(slot["parking-number"]);

            slotDiv.appendChild(removeButton);        }
        if(statusButt){
            const statusButton = document.createElement("button");
            statusButton.textContent = "Change Status";
            statusButton.onclick = () => changeStatus(slot["parking-number"]);
            slotDiv.appendChild(statusButton);

        }

        parkingMap.appendChild(slotDiv);
    });
}

function createVehicle() {
    const carNumber = document.getElementById("newCarNumber")?.value.trim();
    const language = document.getElementById("newCarLanguage")?.value;
    const parkingNumber = parseInt(document.getElementById("parkingNumberInput")?.value);

    if (!carNumber || isNaN(parkingNumber) || parkingNumber < 1 || parkingNumber > totalSlots) {
        alert("Please enter valid car details.");
        return;
    }

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
        slot.parkedAt = Date.now();

        updateDatabase();
        renderParkingMap();
        closeModal();
    } else {
        alert("Parking spot is already occupied or invalid.");
    }
}

function removeCar(parkingNumber) {
    const slot = parkingSlots.find(slot => slot["parking-number"] === parkingNumber);
    if (slot && slot["car-number"]) {
        lastRemovedSlot = { ...slot }; // Store a copy for undo

        // Save to "removedCars" in Firebase
        const parkedDuration = calculateParkedTime(slot.parkedAt); // use your existing function

        const removedCarDetails = {
            "parking-number": slot["parking-number"],
            "car-number": slot["car-number"],
            "language": slot.language,
            "status": slot.status,
            "parkedTime": parkedDuration, // NEW FIELD!
            "removedAt": new Date().toLocaleString()
        };
        

        firebase.database().ref('removedCars').push(removedCarDetails);

        // Clear the slot in the main map
        slot["car-number"] = "";
        slot.language = "N/A";
        slot.status = "N/A";

        document.getElementById("undoButton")?.removeAttribute("disabled");

        updateDatabase();
        renderParkingMap();
    }
}


function undoRemove() {
    if (lastRemovedSlot) {
        const slot = parkingSlots.find(s => s["parking-number"] === lastRemovedSlot["parking-number"]);
        if (slot) {
            // Restore data
            slot["car-number"] = lastRemovedSlot["car-number"];
            slot.language = lastRemovedSlot.language;
            slot.status = lastRemovedSlot.status;

            lastRemovedSlot = null;

            document.getElementById("undoButton")?.setAttribute("disabled", "true");

            updateDatabase();
            renderParkingMap();
        }
    }
}


function changeStatus(parkingNumber) {
    const statuses = ["In-Car", "Fetch-to-shop", "Shopping", "Wrapping", "Waiting for Reindeer"];
    const slot = parkingSlots.find(slot => slot["parking-number"] === parkingNumber);
    if (slot && slot["car-number"]) {
        const currentIndex = statuses.indexOf(slot.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        slot.status = nextStatus;

        updateDatabase();
        renderParkingMap();
    }
}


function init() {
    const parkingSlotsRef = firebase.database().ref('parkingSlots');

    parkingSlotsRef.once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                parkingSlots = snapshot.val().map((slot, index) => ({
                    "parking-number": (index + 1).toString(),
                    ...slot
                }));
            } else {
                initializeParkingSlots(); // If nothing in DB, create fresh
            }
            renderParkingMap();
        });

    // Live update
    parkingSlotsRef.on('value', snapshot => {
        parkingSlots = snapshot.val() || [];
        renderParkingMap();
    });
}
// HTML elements
const removedCarsList = document.getElementById("removedCarsList");
const totalRemovedCars = document.getElementById("totalRemovedCars");
const resetButton = document.getElementById("resetButton");

// Function to fetch removed cars and update the list dynamically
function fetchRemovedCars() {
    const removedCarsList = document.getElementById("removedCarsList");
    database.ref("removedCars").on("child_added", (snapshot) => {
        const removedCar = snapshot.val();
        console.log("Fetched removed car:", removedCar); // Debugging line
        const listItem = document.createElement("div");
        listItem.classList.add("removed-car-card");

        // Create and append details for the removed car
        listItem.innerHTML = `
            <h3>Removed Car</h3>
            <p><strong>Parking Number:</strong> ${removedCar["parking-number"]}</p>
            <p><strong>Car Number:</strong> ${removedCar["car-number"]}</p>
            <p><strong>Language:</strong> ${removedCar["language"]}</p>
            <p><strong>Status:</strong> ${removedCar["status"]}</p>
            <p><strong>parkedTime: </strong> ${removedCar["parkedTime"]}</p>
            <p><strong>Removed At:</strong> ${removedCar["removedAt"]}</p>
        `;

        // Append the list item to the UI
        removedCarsList.appendChild(listItem);

        // Update total count of removed cars
        updateRemovedCarCount();
    });
}


// Update the removed car count display
function updateRemovedCarCount() {
    const totalCarsElement = document.getElementById("removedCarCount");

    // Fetch the total count from Firebase and update the UI
    database.ref("removedCars").once("value", (snapshot) => {
        const totalCount = snapshot.numChildren();
        totalCarsElement.textContent = totalCount;
    });
}

// Reset the list of removed cars and count
function resetRemovedCars() {
    // Clear the list of removed cars from the UI
    const removedCarsList = document.getElementById("removedCarsList");
    removedCarsList.innerHTML = ""; // Clear the list

    // Reset the removed cars data in Firebase (optional, if you want to reset it in the database)
    database.ref("removedCars").remove();
    updateRemovedCarCount();
}

fetchRemovedCars();
init();
