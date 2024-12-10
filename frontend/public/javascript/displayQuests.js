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

                editQuestButton.addEventListener('click', function () {
                    // Pre-fill modal fields
                    document.getElementById('editQuestDescription').value = quest.description;
                    document.getElementById('editQuestImportant').checked = quest.important;
                    document.getElementById('editQuestCompleted').checked = quest.completed;

                    const editQuestModal = new bootstrap.Modal(document.getElementById('editQuestModal'));
                    editQuestModal.show();

                    // Re-define the Apply button's `onclick` to handle this specific quest
                    const applyButton = document.getElementById('applyEditQuest');
                    applyButton.onclick = function () {
                        const newDescription = document.getElementById('editQuestDescription').value.trim();
                        const isImportant = document.getElementById('editQuestImportant').checked;
                        const isCompleted = document.getElementById('editQuestCompleted').checked;
                        const fileInput = document.getElementById('editQuestFile');
                        const file = fileInput.files[0];
                        const removeAttachment = document.getElementById('removeAttachment').checked;
                    
                        if (newDescription === '') {
                            alert('Description cannot be empty.');
                            return;
                        }
                    
                        const updatedQuest = {
                            id: quest.id,
                            description: newDescription,
                            important: isImportant,
                            completed: isCompleted,
                        };
                    
                        // Handle file upload or attachment removal
                        if (removeAttachment) {
                            updatedQuest.imageUrl = ''; // Set imageUrl to an empty string to remove it
                            sendEditRequest(updatedQuest);
                        } else if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('upload_preset', 'ml_default'); // Replace with your Cloudinary preset
                    
                            fetch('https://api.cloudinary.com/v1_1/dq5oo2ceo/image/upload', {
                                method: 'POST',
                                body: formData,
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.secure_url) {
                                        updatedQuest.imageUrl = data.secure_url; // Add Cloudinary URL to quest object
                                    } else {
                                        throw new Error('Image upload failed');
                                    }
                                })
                                .catch(error => console.error('Error uploading image:', error))
                                .finally(() => sendEditRequest(updatedQuest));
                        } else {
                            sendEditRequest(updatedQuest); // No changes to the attachment
                        }
                    };
                    
                    function sendEditRequest(updatedQuest) {
                        fetch(`http://localhost:8080/api/index/${updatedQuest.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedQuest),
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to update quest');
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log('Quest updated:', data);
                                location.reload(); // Refresh the page to reflect changes
                            })
                            .catch(error => console.error('Failed to update quest:', error));
                    }
                    
                });

                const deleteQuestButton = document.createElement("button");
                deleteQuestButton.className = "delete-btn";
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

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    getQuests(false);
});
