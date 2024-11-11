// Select UI elements
let balanceData = document.getElementById("balance");
let formTitle = document.getElementById("formTitle");
let transactionForm = document.getElementById("transactionForm");
let descriptionData = document.getElementById("description");
let amountData =  document.getElementById("amount");
let submitButton = document.querySelector("button");
let cancelEditButton = document.getElementById("cancelEditButton");
let transactionList = document.getElementById("transactionList");

// Initialize an array to store transactions
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editTransactionId = null;

// Event Listeners
transactionForm.addEventListener("submit", submitExpense);

// Add or update a transaction
function submitExpense(event){
    event.preventDefault();

    let description = descriptionData.value;
    let amount = + amountData.value;

    if(description.trim() == "" || amount == 0){
        alert("Please add a valid description and amount");
        return;
    }

    // Edit existing transaction
    if (editTransactionId !== null) {
        const transaction = transactions.find((t) => t.id === editTransactionId);
        transaction.description = description;
        transaction.amount = amount;
        submitButton.textContent = "Add Transaction";
        formTitle.textContent = "Add New Transaction";
        editTransactionId = null; // Reset edit mode
        cancelEditButton.style.display = "none";
    }

    // Add new transaction
    else{
        let transaction = {
            id : Date.now(),
            description : description,
            amount : amount
        }
        transactions.push(transaction);
    }

    saveToLocalStorage();
    renderData();
    updateBalance();

    // Clear input fields
    descriptionData.value = "";
    amountData.value = "";
}

// Save transactions to localStorage
function saveToLocalStorage(){
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Render the transactions to the DOM
function renderData(){
    transactionList.innerHTML = "";
    transactions.forEach((transaction) => {
        let list = document.createElement("li");
        list.classList.add(transaction.amount > 0 ? "income" : "expense");
        list.innerHTML = (`
            ${transaction.description} <span>${transaction.amount > 0 ? "+" : "-"} $ ${Math.abs(transaction.amount)} </span>
            <button class="delete-btn" onclick="deleteData(${transaction.id})">Delete</button>
            <button class="edit-btn" onclick="editData(${transaction.id})">Edit</button>
        `);
        transactionList.appendChild(list);
    });
}

// Update balance, income, and expense totals
function updateBalance(){
    let amounts = transactions.map((transaction) => transaction.amount);
    let totalBalance = amounts.reduce((prev, curr) => prev + curr, 0).toFixed(2);
    balanceData.innerText = totalBalance;
}

// Delete a transaction by ID with a confirmation prompt
function deleteData(id){
    let confirmation = confirm("Are you sure you want to delete this transaction?");

    if(confirmation){
        transactions = transactions.filter((transaction) => transaction.id !== id);
        saveToLocalStorage();
        renderData();
        updateBalance();
    }
}

// Edit a transaction
function editData(id){
    const transaction = transactions.find((tran) => tran.id === id);
    descriptionData.value = transaction.description;
    amountData.value = transaction.amount;

    // Change the button text and form title to indicate edit mode
    submitButton.textContent = "Edit Transaction";
    formTitle.textContent = "Edit Transaction";
    editTransactionId = id;
    cancelEditButton.style.display = "inline";
}

// Event Listeners
cancelEditButton.addEventListener("click", cancelEdit);

function cancelEdit() {
    descriptionData.value = "";
    amountData.value = "";
  
    submitButton.textContent = "Add Transaction";
    formTitle.textContent = "Add New Transaction";
    editTransactionId = null; // Reset the edit mode
  
    cancelEditButton.style.display = "none";
}

// Initialize
function init() {
    renderData();
    updateBalance();
}
  
init();


