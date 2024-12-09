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
function getQuests(importantFilter, searchQuery = '') {
    const sortParam = isDescending ? 'desc' : 'asc';

    fetch(`http://localhost:8080/api/index?sort=${sortParam}&importantFilter=${importantFilter}&search=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(quests => {
            const questContainerMain = document.getElementById("quest-container");
            questContainerMain.innerHTML = ''; // Clear existing tasks

            quests.forEach((quest, index) => {
                const displayId = isDescending ? quests.length - index : index + 1;

                // Create quest container
                const questContainer = document.createElement("div");
                questContainer.className = "quest-container";

                const questDesc = document.createElement("div");
                questDesc.className = "quest-desc fs-6";
                questDesc.innerHTML = `${displayId}. ${quest.description}`;

                if (quest.important) {
                    const importantBadge = document.createElement("span");
                    importantBadge.className = "badge bg-warning text-dark ms-2";
                    importantBadge.innerText = "Important";
                    questDesc.appendChild(importantBadge);
                }

                if (quest.imageUrl) {
                    const questImage = document.createElement("img");
                    questImage.className = "quest-image img-fluid";
                    questImage.src = quest.imageUrl;
                    questImage.alt = "Quest Image";
                    questContainer.appendChild(questImage);
                }

                if (quest.completed) {
                    const completedBadge = document.createElement("span");
                    completedBadge.className = "badge bg-success text-dark ms-2";
                    completedBadge.innerText = "Completed";
                    questDesc.appendChild(completedBadge);
                }

                const editDeleteContainer = document.createElement("div");
                editDeleteContainer.className = "d-flex justify-content-end";

                const editQuestButton = document.createElement("button");
                editQuestButton.className = "btn btn-outline-warning edit-btn";
                editQuestButton.innerHTML = "Edit";

                const deleteQuestButton = document.createElement("button");
                deleteQuestButton.className = "delete-btn";
                const redCross = document.createElement("img");
                redCross.src = "/images/9c6cd7076c9be69e66174619f8f63e3d.png";
                redCross.className = "red-cross";
                deleteQuestButton.appendChild(redCross);

                // Attach event listeners
                editQuestButton.addEventListener('click', function () {
                    // Pre-fill modal fields
                    document.getElementById('editQuestDescription').value = quest.description;
                    document.getElementById('editQuestImportant').checked = quest.important;
                    document.getElementById('editQuestCompleted').checked = quest.completed;

                    const editQuestModal = new bootstrap.Modal(document.getElementById('editQuestModal'));
                    editQuestModal.show();
                });

                deleteQuestButton.addEventListener('click', function () {
                    deleteQuest(quest.id, questContainer);
                });

                editDeleteContainer.appendChild(editQuestButton);
                editDeleteContainer.appendChild(deleteQuestButton);

                // Append elements to quest container
                questContainer.appendChild(questDesc);
                questContainer.appendChild(editDeleteContainer);

                // Append quest container to main container
                questContainerMain.appendChild(questContainer);
            });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}


// Function to toggle sorting order and refresh quests
function toggleSort() {
    isDescending = !isDescending; // Toggle the sorting order
    setSortingPreference(isDescending); // Save the new preference
    getQuests(false); // Fetch quests with the updated sorting order (show all tasks)
}

// Add event listeners to sorting buttons
document.getElementById("sort-ascending").addEventListener('click', () => {
    isDescending = false;
    setSortingPreference(isDescending); // Save the preference
    getQuests(false); // Fetch all tasks
});

document.getElementById("sort-descending").addEventListener('click', () => {
    isDescending = true;
    setSortingPreference(isDescending); // Save the preference
    getQuests(false); // Fetch all tasks
});

// Add event listeners to filter buttons
document.getElementById("filter-all").addEventListener("click", () => {
    getQuests(false);
});

document.getElementById("filter-important").addEventListener("click", () => {
    getQuests(true); // Fetch only important tasks
});

document.getElementById("search-quest-btn").addEventListener('click', function() {
    const searchQuery = document.getElementById('search-input').value.trim();
    getQuests(false, searchQuery); // Fetch quests with the search query
});

// Load quests when the page is ready
document.addEventListener("DOMContentLoaded", () => {
    getQuests(false); // Fetch all tasks on page load
});

document.getElementById("show-all-btn").addEventListener("click", () => {
    getQuests(false); // Fetch only important tasks
});