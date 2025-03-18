// Store items in an array
let items = JSON.parse(localStorage.getItem('items')) || [];

// Function to add a new item
document.getElementById('addItemForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const location = document.getElementById('itemLocation').value;

    const newItem = {
        id: items.length + 1,
        name,
        description,
        location
    };

    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));

    alert('Item added successfully!');
    document.getElementById('addItemForm').reset();
});

// Function to display all items
function displayItems() {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';

    if (items.length === 0) {
        itemsList.innerHTML = '<p>No items found.</p>';
        return;
    }

    items.forEach(item => {
        itemsList.innerHTML += `
            <div>
                <strong>ID:</strong> ${item.id} <br>
                <strong>Name:</strong> ${item.name} <br>
                <strong>Description:</strong> ${item.description} <br>
                <strong>Location:</strong> ${item.location}
                <hr>
            </div>
        `;
    });
}

// Function to search an item by name
function searchItem() {
    const searchName = document.getElementById('searchItem').value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchName));

    if (filteredItems.length === 0) {
        searchResults.innerHTML = '<p>No matching items found.</p>';
        return;
    }

    filteredItems.forEach(item => {
        searchResults.innerHTML += `
            <div>
                <strong>ID:</strong> ${item.id} <br>
                <strong>Name:</strong> ${item.name} <br>
                <strong>Description:</strong> ${item.description} <br>
                <strong>Location:</strong> ${item.location}
                <hr>
            </div>
        `;
    });
}

// Function to delete an item by ID
function deleteItem() {
    const id = parseInt(document.getElementById('deleteItemId').value);
    items = items.filter(item => item.id !== id);

    items = items.map((item, index) => ({ ...item, id: index + 1 }));
    localStorage.setItem('items', JSON.stringify(items));

    alert(`Item with ID ${id} deleted successfully.`);
    displayItems();
}

// Function to update an item by ID
function updateItem() {
    const id = parseInt(document.getElementById('updateItemId').value);
    const newName = document.getElementById('updateItemName').value;
    const newDescription = document.getElementById('updateItemDescription').value;
    const newLocation = document.getElementById('updateItemLocation').value;

    const itemIndex = items.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        items[itemIndex].name = newName;
        items[itemIndex].description = newDescription;
        items[itemIndex].location = newLocation;
        localStorage.setItem('items', JSON.stringify(items));

        alert(`Item with ID ${id} updated successfully.`);
        displayItems();
    } else {
        alert(`Item with ID ${id} not found.`);
    }
}

// Display all items on page load
document.addEventListener('DOMContentLoaded', displayItems);
