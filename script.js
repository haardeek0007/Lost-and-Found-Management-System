// --- User authentication and item management ---
// Same simpleHash, users, currentUser, and item storage logic as before
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = localStorage.getItem("currentUser") || null;
let items = currentUser ? JSON.parse(localStorage.getItem("items_" + currentUser)) || [] : [];

const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");
const currentUserNameSpan = document.getElementById("currentUserName");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}
function saveItems() {
  if (currentUser) {
    localStorage.setItem("items_" + currentUser, JSON.stringify(items));
  }
}

function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
  loginMessage.textContent = "";
  registerMessage.textContent = "";
}
function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
  loginMessage.textContent = "";
  registerMessage.textContent = "";
}

function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value;

  if (!username || !password) {
    registerMessage.style.color = "#e74c3c";
    registerMessage.textContent = "Please enter both username and password.";
    return;
  }

  if (users.find(u => u.username === username)) {
    registerMessage.style.color = "#e74c3c";
    registerMessage.textContent = "Username already exists.";
    return;
  }

  users.push({
    username,
    passwordHash: simpleHash(password)
  });
  saveUsers();

  registerMessage.style.color = "#27ae60";
  registerMessage.textContent = "Registration successful! You can login now.";

  document.getElementById("registerUsername").value = "";
  document.getElementById("registerPassword").value = "";
}

function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!username || !password) {
    loginMessage.textContent = "Please enter both username and password.";
    return;
  }

  const user = users.find(u => u.username === username && u.passwordHash === simpleHash(password));
  if (!user) {
    loginMessage.textContent = "Invalid username or password.";
    return;
  }

  currentUser = username;
  localStorage.setItem("currentUser", currentUser);
  loginMessage.textContent = "";
  currentUserNameSpan.textContent = currentUser;

  document.getElementById("loginUsername").value = "";
  document.getElementById("loginPassword").value = "";

  items = JSON.parse(localStorage.getItem("items_" + currentUser)) || [];
  showApp();
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  items = [];
  showAuth();
}

function showApp() {
  authSection.style.display = "none";
  appSection.style.display = "block";
  currentUserNameSpan.textContent = currentUser;

  // Show welcome message and logout button
  document.getElementById("welcomeMessage").style.display = "block";
  document.getElementById("logoutButton").style.display = "inline-block";

  displayItems();
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  items = [];
  
  // Hide app, show auth
  showAuth();

  // Optionally hide welcome message and logout button
  document.getElementById("welcomeMessage").style.display = "none";
  document.getElementById("logoutButton").style.display = "none";
}


function showAuth() {
  authSection.style.display = "block";
  appSection.style.display = "none";
  showLogin();
}

// --- Items CRUD ---

function addItem() {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }
  const name = document.getElementById("itemName").value.trim();
  const description = document.getElementById("itemDescription").value.trim();
  const location = document.getElementById("itemLocation").value.trim();

  if (!name || !description || !location) {
    alert("Please fill out all fields.");
    return;
  }

  const newItem = {
    id: Date.now(),
    name,
    description,
    location
  };

  items.push(newItem);
  saveItems();
  displayItems();

  document.getElementById("itemName").value = '';
  document.getElementById("itemDescription").value = '';
  document.getElementById("itemLocation").value = '';
}

function displayItems() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = "<p>No items added yet.</p>";
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <strong>ID:</strong> ${item.id}<br>
      <strong>Name:</strong> ${item.name}<br>
      <strong>Description:</strong> ${item.description}<br>
      <strong>Location:</strong> ${item.location}
      <button class="edit-btn" onclick="openEditModal(${item.id})">Edit</button>
      <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
    `;
    list.appendChild(div);
  });
}

function deleteItem(id) {
  if (!currentUser) return;
  if (!confirm("Are you sure you want to delete this item?")) return;
  items = items.filter(item => item.id !== id);
  saveItems();
  displayItems();
}

// Edit modal logic
const modal = document.getElementById("editModal");
const editName = document.getElementById("editName");
const editDescription = document.getElementById("editDescription");
const editLocation = document.getElementById("editLocation");

let editingItemId = null;

function openEditModal(id) {
  editingItemId = id;
  const item = items.find(i => i.id === id);
  if (!item) return;

  editName.value = item.name;
  editDescription.value = item.description;
  editLocation.value = item.location;

  modal.style.display = "block";
}

function closeEditModal() {
  modal.style.display = "none";
  editingItemId = null;
}

function saveEdit() {
  if (editingItemId === null) return;

  const name = editName.value.trim();
  const description = editDescription.value.trim();
  const location = editLocation.value.trim();

  if (!name || !description || !location) {
    alert("Please fill out all fields.");
    return;
  }

  const index = items.findIndex(i => i.id === editingItemId);
  if (index !== -1) {
    items[index].name = name;
    items[index].description = description;
    items[index].location = location;
    saveItems();
    displayItems();
    closeEditModal();
  }
}

// Close modal if user clicks outside content
window.onclick = function(event) {
  if (event.target === modal) {
    closeEditModal();
  }
}

function searchItem() {
  if (!currentUser) return;

  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultDiv = document.getElementById("searchResult");
  resultDiv.innerHTML = '';

  if (!query) {
    resultDiv.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  const foundItems = items.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  );

  if (foundItems.length > 0) {
    foundItems.forEach(item => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <strong>ID:</strong> ${item.id}<br>
        <strong>Name:</strong> ${item.name}<br>
        <strong>Description:</strong> ${item.description}<br>
        <strong>Location:</strong> ${item.location}
        <button class="edit-btn" onclick="openEditModal(${item.id})">Edit</button>
        <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
      `;
      resultDiv.appendChild(div);
    });
  } else {
    resultDiv.innerHTML = "<p>No items found matching your search.</p>";
  }
}

// On page load
window.onload = function() {
  if (currentUser) {
    showApp();
  } else {
    showAuth();
  }
}
