// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAmUZ1kWf8dR5XUFOlViGQjrp6siK2H2Zg",
  authDomain: "renewalparkingwrap.firebaseapp.com",
  databaseURL: "https://renewalparkingwrap-default-rtdb.firebaseio.com",
  projectId: "renewalparkingwrap",
  storageBucket: "renewalparkingwrap.firebasestorage.app",
  messagingSenderId: "265029019359",
  appId: "1:265029019359:web:6a7ba410eefa6470d22b6a",
  measurementId: "G-JX7H3SC1N4"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Modal functions
function openWrapModal() {
  document.getElementById("WrapModal").style.display = "block";
}
function closeWrapModal() {
  document.getElementById("WrapModal").style.display = "none";
}

// Create new wrap card
function createWrapCard() {
  const carNumber = document.getElementById("newCarNumber").value.trim();
  const childCount = document.getElementById("newChildCount").value.trim();
  const bagCount = document.getElementById("newBagCount").value.trim();

  if (!carNumber || !childCount || !bagCount) {
    alert("Please fill out all fields.");
    return;
  }

  const newBag = {
    carNumber,
    childCount,
    bagCount,
    wrappedChildren: 0,
    createdAt: Date.now()
  };

  database.ref("bags").push(newBag);
  closeWrapModal();
  clearModalInputs();
}

// Clear modal inputs
function clearModalInputs() {
  document.getElementById("newCarNumber").value = "";
  document.getElementById("newChildCount").value = "";
  document.getElementById("newBagCount").value = "";
}

// Render bags
function renderBags(snapshot) {
  const bagsDiv = document.getElementById("bags");
  bagsDiv.innerHTML = "";

  snapshot.forEach(childSnap => {
    const bag = childSnap.val();
    const key = childSnap.key;

    const card = document.createElement("div");
    card.classList.add("bag-card");

    card.innerHTML = `
      <h3>Ticket #${bag.carNumber}</h3>
      <p>Children: ${bag.childCount}</p>
      <p>Bags: ${bag.bagCount}</p>
      <p>Wrapped: ${bag.wrappedChildren}/${bag.childCount}</p>
      <button onclick="markChildWrapped('${key}', ${bag.wrappedChildren}, ${bag.childCount})">Mark Child Wrapped</button>
    `;

    bagsDiv.appendChild(card);
  });
}

// Update wrapped children
function markChildWrapped(bagId, current, total) {
  if (current < total) {
    database.ref("bags/" + bagId).update({
      wrappedChildren: current + 1
    });
  } else {
    alert("All children are already marked as wrapped!");
  }
}

// Live sync
database.ref("bags").on("value", snapshot => {
  renderBags(snapshot);
});
