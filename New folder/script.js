// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const addInventoryBtn = document.getElementById('addInventoryItem');
const addRepairBtn = document.getElementById('addRepair');
const modal = document.getElementById('addItemModal');
const closeBtn = document.querySelector('.close-btn');
const addItemForm = document.getElementById('addItemForm');
const inventorySearch = document.getElementById('inventorySearch');
const inventoryList = document.querySelector('.inventory-list');
const repairList = document.querySelector('.repair-list');

// State Management
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
let activeRepairs = 0;
let totalSales = 0;

// Navigation
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetSection = button.dataset.section;
        
        // Update active button
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show target section
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetSection) {
                section.classList.add('active');
            }
        });
    });
});

// Modal Controls
function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    addItemForm.reset();
}

addInventoryBtn.addEventListener('click', openModal);
addRepairBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Form Submission
addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const item = {
        id: Date.now(),
        name: document.getElementById('itemName').value,
        type: document.getElementById('itemType').value,
        condition: document.getElementById('itemCondition').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        date: new Date().toISOString()
    };
    
    inventory.push(item);
    saveInventory();
    renderInventory();
    updateStats();
    closeModal();
});

// Inventory Management
function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function renderInventory() {
    inventoryList.innerHTML = '';
    
    inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>Type: ${item.type}</p>
                <p>Condition: ${item.condition}</p>
                <p>Price: $${item.price}</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        inventoryList.appendChild(itemElement);
    });
}

// Search Functionality
inventorySearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredInventory = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm) ||
        item.condition.toLowerCase().includes(searchTerm)
    );
    renderFilteredInventory(filteredInventory);
});

function renderFilteredInventory(filteredItems) {
    inventoryList.innerHTML = '';
    filteredItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>Type: ${item.type}</p>
                <p>Condition: ${item.condition}</p>
                <p>Price: $${item.price}</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        inventoryList.appendChild(itemElement);
    });
}

// Item Management
function editItem(id) {
    const item = inventory.find(item => item.id === id);
    if (item) {
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemType').value = item.type;
        document.getElementById('itemCondition').value = item.condition;
        document.getElementById('itemPrice').value = item.price;
        
        // Remove the old item
        inventory = inventory.filter(item => item.id !== id);
        
        openModal();
    }
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        inventory = inventory.filter(item => item.id !== id);
        saveInventory();
        renderInventory();
        updateStats();
    }
}

// Stats Update
function updateStats() {
    activeRepairs = repairs.filter(repair => repair.status === 'active').length;
    totalSales = inventory.reduce((sum, item) => sum + item.price, 0);
    
    document.querySelector('.stat-number:nth-child(1)').textContent = activeRepairs;
    document.querySelector('.stat-number:nth-child(2)').textContent = inventory.length;
    document.querySelector('.stat-number:nth-child(3)').textContent = `$${totalSales}`;
}

// Checklist Functionality
const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const label = checkbox.nextElementSibling;
        if (checkbox.checked) {
            label.style.textDecoration = 'line-through';
            label.style.color = 'var(--success-color)';
        } else {
            label.style.textDecoration = 'none';
            label.style.color = 'var(--text-color)';
        }
    });
});

// Initialize
renderInventory();
updateStats(); 