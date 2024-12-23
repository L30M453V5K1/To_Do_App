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

            // Filter out completed tasks before rendering
            quests
                .filter(quest => !quest.completed) // Exclude completed tasks
                .forEach((quest, index) => {
                    const displayId = isDescending ? quests.length - index : index + 1;

                    // Create quest container
                    const questContainer = document.createElement("div");
                    questContainer.className = "quest-container";

                    const questDesc = document.createElement("div");
                    questDesc.className = "quest-desc fs-6";
                    questDesc.innerHTML = `${displayId}. ${quest.description}`;

                    // Add "Important" badge
                    if (quest.important) {
                        const importantBadge = document.createElement("span");
                        importantBadge.className = "badge bg-warning text-dark ms-2";
                        importantBadge.innerText = "Important";
                        questDesc.appendChild(importantBadge);
                    }

                    // Add repeat information for repeatable tasks
                    if (quest.repeatable) {
                        const repeatInfo = document.createElement("div");
                        repeatInfo.className = "fs-6 text-secondary mt-1";

                        const repeatDays = quest.repeatDays ? quest.repeatDays.split(',').join(', ') : 'No specific days';
                        const repeatTime = quest.repeatTime || 'No specific time';

                        repeatInfo.innerHTML = `Repeats on: <strong>${repeatDays}</strong> at <strong>${repeatTime}</strong>`;
                        questDesc.appendChild(repeatInfo);
                    }

                    // Add image (if available)
                    if (quest.imageUrl) {
                        const questImage = document.createElement("img");
                        questImage.className = "quest-image img-fluid";
                        questImage.src = quest.imageUrl;
                        questImage.alt = "Quest Image";
                        questContainer.appendChild(questImage);
                    }

                    // Add "Completed" badge
                    if (quest.completed) {
                        const completedBadge = document.createElement("span");
                        completedBadge.className = "badge bg-success text-dark ms-2";
                        completedBadge.innerText = "Completed";
                        questDesc.appendChild(completedBadge);
                    }

                    // Add checkbox for marking task as completed
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.className = "form-check-input me-3";
                    checkbox.checked = quest.completed;
                    checkbox.id = `checkbox-${quest.id}`;

                    const label = document.createElement("label");
                    label.htmlFor = `checkbox-${quest.id}`; // Associate the label with the checkbox
                    label.className = "form-check-label"; // Optional: Add a class for styling
                    label.innerText = "Mark as completed";


                    checkbox.addEventListener("change", function () {
                        if (checkbox.checked) {
                            markTaskCompleted(quest, questContainer);
                        }
                    });

                    // Add Edit/Delete buttons
                    const editDeleteContainer = document.createElement("div");
                    editDeleteContainer.className = "d-flex justify-content-end";

                    const editQuestButton = document.createElement("button");
                    editQuestButton.className = "btn btn-outline-warning edit-btn";
                    editQuestButton.innerHTML = "Edit Quest";

                    // Edit button functionality
                    editQuestButton.addEventListener('click', function () {
                        document.getElementById('editQuestDescription').value = quest.description;
                        document.getElementById('editQuestImportant').checked = quest.important;

                        // Disable recurrence fields for editing
                        const daysCheckboxes = document.querySelectorAll('#editQuestDaysCheckboxGroup .form-check-input');
                        daysCheckboxes.forEach((checkbox) => {
                            checkbox.disabled = true; // Disable recurrence checkboxes
                        });

                        const editQuestModal = new bootstrap.Modal(document.getElementById('editQuestModal'));
                        editQuestModal.show();

                        const applyButton = document.getElementById('applyEditQuest');
                        applyButton.onclick = function () {
                            const newDescription = document.getElementById('editQuestDescription').value.trim();
                            const isImportant = document.getElementById('editQuestImportant').checked;

                            if (!newDescription) {
                                alert('Description cannot be empty.');
                                return;
                            }

                            const updatedQuest = {
                                id: quest.id,
                                description: newDescription,
                                important: isImportant,
                                repeatable: quest.repeatable,
                                repeatDays: quest.repeatDays,
                                repeatTime: quest.repeatTime,
                            };

                            // Send updated quest to the backend
                            fetch(`http://localhost:8080/api/index/${quest.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updatedQuest),
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`Failed to update quest with ID: ${quest.id}`);
                                    }
                                    return response.json();
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

                    questContainer.appendChild(checkbox);
                    questContainer.appendChild(label);
                    questContainer.appendChild(questDesc);
                    questContainer.appendChild(editDeleteContainer);

                    questContainerMain.appendChild(questContainer);
                });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}


// Function to mark task as completed and save it to localStorage
function markTaskCompleted(task, taskContainer) {
    // Update the task as completed in the database
    const updatedTask = { ...task, completed: true };

    fetch(`http://localhost:8080/api/index/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to mark task as completed in the database`);
            }
            console.log(`Task ${task.id} marked as completed.`);
        })
        .catch(error => console.error('Error updating task:', error));

    // Remove task from the UI
    taskContainer.remove();

    // Save the task in localStorage with the next occurrence time
    const taskWithRecurrence = { ...task, nextOccurrence: getNextOccurrenceTime(task) };
    localStorage.setItem(`task-${task.id}`, JSON.stringify(taskWithRecurrence));

    // Schedule task reappearance
    scheduleTaskReappearance(taskWithRecurrence);
}


// Function to get the next occurrence time for the task
function getNextOccurrenceTime(task) {
    const now = new Date();
    const taskTime = new Date();

    const [hour, minute] = task.repeatTime.split(':');
    taskTime.setHours(hour);
    taskTime.setMinutes(minute);
    taskTime.setSeconds(0);

    const repeatDays = task.repeatDays.split(',');
    const repeatDayMap = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    };

    // Find the next repeat day
    let nextDay = repeatDays
        .map(day => repeatDayMap[day.toLowerCase()])
        .find(day => (day + 7 - now.getDay()) % 7 > 0);

    if (nextDay === undefined) {
        nextDay = repeatDayMap[repeatDays[0].toLowerCase()];
    }

    const daysUntilNext = (nextDay + 7 - now.getDay()) % 7;
    taskTime.setDate(now.getDate() + daysUntilNext);

    return taskTime.getTime(); // Return the timestamp for the next occurrence
}

function scheduleTaskReappearance(task) {
    const timeUntilNextOccurrence = task.nextOccurrence - Date.now();

    setTimeout(() => {
        const storedTask = JSON.parse(localStorage.getItem(`task-${task.id}`));
        if (storedTask) {
            // Re-add the task to the database
            fetch('http://localhost:8080/api/index', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(storedTask),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(`Recurring task ${data.id} reappeared.`);
                    localStorage.removeItem(`task-${task.id}`); // Clean up localStorage
                    getQuests(false); // Refresh tasks in the UI
                })
                .catch(error => console.error('Error recreating task:', error));
        }
    }, timeUntilNextOccurrence);
}

document.addEventListener("DOMContentLoaded", () => {
    // Get references to modal and form elements
    const newQuestButton = document.getElementById('new-quest-btn');
    const applyNewQuestButton = document.getElementById('applyNewQuest');
    const newQuestModal = new bootstrap.Modal(document.getElementById('newQuestModal'));
    const important = document.getElementById('filter-important');
    const filterAll = document.getElementById('filter-all');
    const showAllButton = document.getElementById('show-all-btn');
    const searchButton = document.getElementById('search-quest-btn');

    important.addEventListener('click', function () {
        getQuests(true);
    });

    filterAll.addEventListener('click', function () {
        getQuests(false);
    });

    showAllButton.addEventListener('click', function () {
        getQuests(false);
    });

    searchButton.addEventListener('click', function () {
        const input = document.getElementById('search-input'); 
        const inputValue = input.value.trim();

        if (inputValue) {
            getQuests(false, inputValue); 
        } else {
            console.log("Search input is empty.");
        }
    });

    // Event listener to show the modal when the "New Quest" button is clicked
    newQuestButton.addEventListener('click', function () {
        newQuestModal.show(); // Open the modal
    });

    // Event listener for the "Create" button in the modal
    applyNewQuestButton.addEventListener('click', function () {
        // Get the values from the modal form       
    });

    const sortAscendingButton = document.getElementById('sort-ascending');
    const sortDescendingButton = document.getElementById('sort-descending');

    // Event listener for sorting in ascending order
    sortAscendingButton.addEventListener('click', () => {
        isDescending = false; // Set sort order to ascending
        setSortingPreference(isDescending); // Save preference in localStorage
        getQuests(false); // Re-render quests with ascending order
    });

    // Event listener for sorting in descending order
    sortDescendingButton.addEventListener('click', () => {
        isDescending = true; // Set sort order to descending
        setSortingPreference(isDescending); // Save preference in localStorage
        getQuests(false); // Re-render quests with descending order
    });


    getQuests(false);

    // Auto-refresh tasks every minute to check for tasks that need to be displayed
    setInterval(() => {
        console.log("Auto-refreshing tasks...");
        getQuests(false);
    }, 60000); // 60,000 ms = 1 minute
});
