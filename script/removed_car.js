<<<<<<< HEAD
// Firebase configuration (you can skip this if already initialized)
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

function goBack(){
    window.history.back();
  }
  
// HTML elements
const removedCarsList = document.getElementById("removedCarsList");
const totalRemovedCars = document.getElementById("totalRemovedCars");
const resetButton = document.getElementById("resetButton");

// Function to fetch removed cars and update the list dynamically
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
            // <p><strong>parkedTime: </strong> ${removedCar["parkedTime"]}</p>
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

    // Reset the displayed count
    updateRemovedCarCount();
}

// Fetch removed cars on page load and whenever the list updates
fetchRemovedCars();


=======
// Firebase configuration (you can skip this if already initialized)
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

function goBack(){
    window.history.back();
  }
  
// HTML elements
const removedCarsList = document.getElementById("removedCarsList");
const totalRemovedCars = document.getElementById("totalRemovedCars");
const resetButton = document.getElementById("resetButton");

// Function to fetch removed cars and update the list dynamically
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

    // Reset the displayed count
    updateRemovedCarCount();
}

// Fetch removed cars on page load and whenever the list updates
fetchRemovedCars();


>>>>>>> 9b29609b2d4bcc7e47462940e1311a6a7cce2607
