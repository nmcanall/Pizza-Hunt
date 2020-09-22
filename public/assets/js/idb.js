let db;

// Establish a connection to IndexedDB called pizza_hunt and set it to version 1
const request = indexedDB.open("pizza_hunt", 1);

// This event will emit if the db version changes
request.onupgradeneeded = function(event) {
    // Save a reference to the db
    const db = event.target.result;
    // Create a autoincrement key for the object store to increase when the table changes or version changes
    db.createObjectStore("new_pizza", {autoIncrement: true});
}

request.onsuccess = function(event) {
    // When db and object store are created successfully, save a reference to the db in a global variable
    db = event.target.result;

    // Check if app is online, if yes, run uploadPizza to send all data to server
    if(navigator.onLine) {
        uploadPizza();
    }
}

request.onerror = function(event) {
    console.log(event.target.errorCode);
}

// This function will be used if we attempt to submit a new pizza without connection
function saveRecord(record) {

    // Create a new transaction for the db
    const transaction = db.transaction(["new_pizza"], "readwrite");

    // Acces new_pizza object store
    const pizzaObjectStore = transaction.objectStore("new_pizza");

    // Add record to offline store
    pizzaObjectStore.add(record);
}

// Helper function to be used when connection is established
function uploadPizza() {
    // Open a transaction on the db
    const transaction = db.transaction(["new_pizza"], "readwrite");
    const pizzaObjectStore = transaction.objectStore("new_pizza");
    
    // Get all records from store
    const getAll = pizzaObjectStore.getAll();
    getAll.onsuccess = function() {
        // If there was data, send it to API server
        if(getAll.result.length > 0) {
            fetch("/api/pizzas", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if(serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // Open another IDB transaction
                    const transaction = db.transaction(["new_pizza"], "readwrite");
                    const pizzaObjectStore = transaction.objectStore("new_pizza");
                    // Clear the items in the store so we don't duplicate next time
                    pizzaObjectStore.clear();

                    alert("All saved pizzas have been submitted");
                })
                .catch(err => console.log(err));
        }
    }
}

// Event listener for when the application comes back online
window.addEventListener("online", uploadPizza);