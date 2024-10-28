import { editQuest } from './editQuest.js';
import { deleteQuest } from './deleteQuest.js';

// Function to get the sorting preference from localStorage
function getSortingPreference() {
    const sortOrder = localStorage.getItem('questSortOrder');
    return sortOrder === 'desc'; // Return true if descending, false if ascending
}

// Function to set the sorting preference in localStorage
function setSortingPreference(isDescending) {
    localStorage.setItem('questSortOrder', isDescending ? 'desc' : 'asc');
}

// Variable to store the current sort order
let isDescending = getSortingPreference(); // Initialize with the saved preference

// Function to fetch quests from the server
function getQuests() {
    // Determine the sorting order based on the isDescending flag
    const sortParam = isDescending ? 'desc' : 'asc';

    fetch(`http://localhost:8080/api/index?sort=${sortParam}`) // Pass sort parameter in query string
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON response
        })
        .then(quests => {
            console.log('Fetched quests:', quests); // Log the quests to the console

            // Get main container
            const questContainerMain = document.getElementById("quest-container");

            // Clear the container before rendering
            questContainerMain.innerHTML = '';

            let totalColumnsInCurrentRow = 0;
            let currentRow;

            quests.forEach(quest => {
                // Create quest column
                const questColumn = document.createElement("div");
                questColumn.className = "col-sm-12 col-md-6 col-lg-3";

                // Create quest container
                const questContainer = document.createElement("div");
                questContainer.className = "container-fluid quest-container";
                questContainer.setAttribute("data-id", quest.id); // Store quest ID in the container for easy access

                const questDesc = document.createElement("div");
                questDesc.className = "quest-desc fs-6";
                questDesc.innerHTML = `${quest.id}. ${quest.description}`;

                const editDeleteContainer = document.createElement("div");
                editDeleteContainer.className = "d-flex justify-content-end";

                // Create edit button
                const editQuestButton = document.createElement("button");
                editQuestButton.className = "btn btn-outline-warning edit-btn";
                editQuestButton.innerHTML = "Edit Quest";

                // Attach edit functionality from editQuest.js
                editQuestButton.addEventListener('click', function () {
                    // Prompt the user for a new description
                    const newDescription = prompt("Enter the new description for the quest:", quest.description);

                    // If a valid description is provided, call editQuest with id and new description
                    if (newDescription && newDescription.trim() !== "") {
                        editQuest(quest.id, newDescription.trim()); // Pass the new description along with the id
                    }
                });

                // Create delete button
                const deleteQuestButton = document.createElement("button");
                deleteQuestButton.className = "delete-btn";
                const redCross = document.createElement("img");
                redCross.src = "/images/9c6cd7076c9be69e66174619f8f63e3d.png";
                redCross.className = "red-cross";
                deleteQuestButton.appendChild(redCross);

                // Attach delete functionality
                deleteQuestButton.addEventListener('click', function () {
                    deleteQuest(quest.id, questContainer);
                });

                // Append buttons to the editDeleteContainer
                editDeleteContainer.appendChild(editQuestButton);
                editDeleteContainer.appendChild(deleteQuestButton);

                // Append ID, description, and buttons to the quest container
                questContainer.appendChild(questDesc);
                questContainer.appendChild(editDeleteContainer);

                // Append the quest container to the quest column
                questColumn.appendChild(questContainer);

                // Logic for rows and columns (bootstrap 12-column system)
                const columnsAdded = 3; // Bootstrap large screens: 3 columns for each quest

                if (!currentRow || totalColumnsInCurrentRow + columnsAdded > 12) {
                    // Create a new row if needed
                    const newRow = document.createElement("div");
                    newRow.className = "row justify-content-evenly";
                    questContainerMain.appendChild(newRow);
                    currentRow = newRow;
                    totalColumnsInCurrentRow = 0;
                }

                // Append the quest column to the current row
                currentRow.appendChild(questColumn);

                // Update the total number of columns in the current row
                totalColumnsInCurrentRow += columnsAdded;
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to toggle sorting order and refresh quests
function toggleSort() {
    isDescending = !isDescending; // Toggle the sorting order
    setSortingPreference(isDescending); // Save the new preference
    getQuests(); // Fetch quests with the updated sorting order
}

// Add event listeners to sorting buttons
document.getElementById("sort-ascending").addEventListener('click', () => {
    isDescending = false;
    setSortingPreference(isDescending); // Save the preference
    getQuests();
});

document.getElementById("sort-descending").addEventListener('click', () => {
    isDescending = true;
    setSortingPreference(isDescending); // Save the preference
    getQuests();
});

// Load quests when the page is ready
document.addEventListener("DOMContentLoaded", getQuests);
