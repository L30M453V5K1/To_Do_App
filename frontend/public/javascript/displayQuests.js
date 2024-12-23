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
            console.log(quests);
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

                // Create checkbox to mark task as completed
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "form-check-input me-3";
                checkbox.checked = quest.completed;

                // Add checkbox functionality
                checkbox.addEventListener("change", function () {
                    if (checkbox.checked) {
                        markTaskCompleted(quest, questContainer);
                    }
                });

                // Edit/Delete functionality (keep the edit section intact)
                const editDeleteContainer = document.createElement("div");
                editDeleteContainer.className = "d-flex justify-content-end";

                const editQuestButton = document.createElement("button");
                editQuestButton.className = "btn btn-outline-warning edit-btn";
                editQuestButton.innerHTML = "Edit Quest";

                // Edit button functionality
editQuestButton.addEventListener('click', function () {
    document.getElementById('editQuestDescription').value = quest.description;
    document.getElementById('editQuestImportant').checked = quest.important;
    document.getElementById('editQuestCompleted').checked = quest.completed;

    // Disabling the recurrence fields so they can't be edited
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
        const isCompleted = document.getElementById('editQuestCompleted').checked;

        if (!newDescription) {
            alert('Description cannot be empty.');
            return;
        }

        // Prepare the updated task object without updating the recurrence (keep original)
        const updatedQuest = {
            id: quest.id,
            description: newDescription,
            important: isImportant,
            completed: isCompleted,
            repeatable: quest.repeatable,  // Don't modify recurrence
            repeatDays: quest.repeatDays,  // Keep original recurrence days
            repeatTime: quest.repeatTime,  // Keep original recurrence time
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

                questContainer.appendChild(checkbox);
                questContainer.appendChild(questDesc);
                questContainer.appendChild(editDeleteContainer);

                questContainerMain.appendChild(questContainer);

                
            });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

// Function to mark task as completed and save it to localStorage
function markTaskCompleted(task, taskContainer) {
    const updatedTask = {
        ...task,
        completed: true,
    };

    // Remove the task from the database (delete it)
    fetch(`http://localhost:8080/api/index/${task.id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete task from the database');
            console.log(`Task with ID ${task.id} deleted from database.`);
        })
        .catch(error => console.error('Error deleting task:', error));

    // Save the task's recurrence info in localStorage with its next recurrence time
    const taskWithRecurrence = { ...task, nextOccurrence: getNextOccurrenceTime(task) };
    localStorage.setItem(`task-${task.id}`, JSON.stringify(taskWithRecurrence));

    taskContainer.remove(); // Remove task from the UI

    // Automatically recreate the task at the next recurrence
    setTimeout(() => {
        const taskFromStorage = JSON.parse(localStorage.getItem(`task-${task.id}`));
        if (taskFromStorage) {
            createRecurringTask(taskFromStorage); // Create the task in the database
        }
    }, taskWithRecurrence.nextOccurrence - Date.now());
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
        'sunday': 0,
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6
    };

    // Find the next scheduled occurrence day
    let nextOccurrenceDay = repeatDayMap[repeatDays[0].toLowerCase()];
    taskTime.setDate(now.getDate() + ((nextOccurrenceDay - now.getDay() + 7) % 7));

    return taskTime.getTime(); // Return the time in milliseconds
}

// Function to create a new recurring task in the database
function createRecurringTask(task) {
    fetch('http://localhost:8080/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Recurring task created:', data);
            // Fetch the task again and display it
            getQuests(false);
        })
        .catch(error => console.error('Error creating recurring task:', error));
}

function toggleSortingPreference() {
    isDescending = !isDescending; // Toggle the sort order
    setSortingPreference(isDescending); // Save the preference to localStorage
    getQuests(false); // Rerender the quests with the new sorting order
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
