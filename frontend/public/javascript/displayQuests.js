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
let isDescending = getSortingPreference();

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

                // Add repeat information (if available)
                if (quest.repeatable) {
                    const repeatInfo = document.createElement("div");
                    repeatInfo.className = "fs-6 text-secondary mt-1";

                    const repeatDays = quest.repeatDays ? quest.repeatDays.split(',').join(', ') : 'No specific days';
                    const repeatTime = quest.repeatTime || 'No specific time';

                    repeatInfo.innerHTML = `Repeats on: <strong>${repeatDays}</strong> at <strong>${repeatTime}</strong>`;
                    questDesc.appendChild(repeatInfo);
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
                editQuestButton.innerHTML = "Edit Quest";

                // Edit button functionality
                editQuestButton.addEventListener('click', function () {
                    // Prefill the modal with the current task values
                    document.getElementById('editQuestDescription').value = quest.description;
                    document.getElementById('editQuestImportant').checked = quest.important;
                    document.getElementById('editQuestCompleted').checked = quest.completed;

                    // Prefill days checkboxes for recurring tasks
                    const daysCheckboxes = document.querySelectorAll('#editQuestDaysCheckboxGroup .form-check-input');
                    daysCheckboxes.forEach((checkbox) => {
                        checkbox.checked = quest.repeatDays && quest.repeatDays.split(',').includes(checkbox.value);
                    });

                    // Prefill the repeat time field
                    document.getElementById('newQuestTime').value = quest.repeatTime || '';

                    // Show the edit modal
                    const editQuestModal = new bootstrap.Modal(document.getElementById('editQuestModal'));
                    editQuestModal.show();

                    const applyButton = document.getElementById('applyEditQuest');
                    applyButton.onclick = function () {
                        const newDescription = document.getElementById('editQuestDescription').value.trim();
                        const isImportant = document.getElementById('editQuestImportant').checked;
                        const isCompleted = document.getElementById('editQuestCompleted').checked;

                        // Get selected days (checkboxes)
                        const selectedDays = Array.from(
                            document.querySelectorAll('#editQuestDaysCheckboxGroup .form-check-input:checked')
                        ).map((checkbox) => checkbox.value);

                        // Get repeat time
                        const updatedTime = document.getElementById('newQuestTime').value || null; // Set to null if empty

                        // Validation: Ensure description is not empty
                        if (!newDescription) {
                            alert('Description cannot be empty.');
                            return;
                        }

                        // Prepare the updated quest object
                        const updatedQuest = {
                            id: quest.id, // Existing quest ID for updating
                            description: newDescription,
                            important: isImportant,
                            completed: isCompleted,
                            repeatable: selectedDays.length > 0 || updatedTime !== null, // Set as repeatable if days or time are provided
                            repeatDays: selectedDays.length > 0 ? selectedDays.join(',') : null, // Join selected days as a comma-separated string or null
                            repeatTime: updatedTime, // Repeat time, null if not provided
                        };

                        // Send the updated task to the backend
                        fetch(`http://localhost:8080/api/index/${quest.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedQuest),
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Failed to update quest with ID: ${quest.id}`);
                                }
                                return response.json(); // Parse the JSON response
                            })
                            .then(data => {
                                console.log('Updated quest data from server:', data);
                                location.reload(); // Reload the page to show updated tasks
                            })
                            .catch(error => {
                                console.error('Error updating quest:', error);
                            });
                    };
                });

                const deleteQuestButton = document.createElement("button");
                deleteQuestButton.className = "btn btn-outline-secondary delete-btn";
                const redCross = document.createElement("img");
                redCross.src = "/images/9c6cd7076c9be69e66174619f8f63e3d.png";
                redCross.className = "red-cross";
                deleteQuestButton.appendChild(redCross);

                deleteQuestButton.addEventListener('click', function () {
                    deleteQuest(quest.id, questContainer);
                });

                editDeleteContainer.appendChild(editQuestButton);
                editDeleteContainer.appendChild(deleteQuestButton);

                questContainer.appendChild(questDesc);
                questContainer.appendChild(editDeleteContainer);

                questContainerMain.appendChild(questContainer);
            });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

document.addEventListener("DOMContentLoaded", () => {

    // Get references to modal and form elements
const newQuestButton = document.getElementById('new-quest-btn');
const applyNewQuestButton = document.getElementById('applyNewQuest');
const newQuestModal = new bootstrap.Modal(document.getElementById('newQuestModal'));

// Event listener to show the modal when the "New Quest" button is clicked
newQuestButton.addEventListener('click', function () {
    newQuestModal.show(); // Open the modal
});

// Event listener for the "Create" button in the modal
applyNewQuestButton.addEventListener('click', function () {
    // Get the values from the modal form       
});

    getQuests(false);
});
