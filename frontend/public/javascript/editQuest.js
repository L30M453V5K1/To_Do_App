// export function editQuest(questId) {
//     // Fetch the quest data from the server using its ID
//     fetch(`http://localhost:8080/api/index/${questId}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch quest with ID: ${questId}`);
//             }
//             return response.json();
//         })
//         .then(quest => {
//             // Prefill the modal with the current task values
//             document.getElementById('editQuestDescription').value = quest.description;
//             document.getElementById('editQuestImportant').checked = quest.important;
//             document.getElementById('editQuestCompleted').checked = quest.completed;

//             // Prefill days checkboxes for recurring tasks
//             const daysCheckboxes = document.querySelectorAll('#editQuestDaysCheckboxGroup .form-check-input');
//             daysCheckboxes.forEach((checkbox) => {
//                 checkbox.checked = quest.repeatDays && quest.repeatDays.split(',').includes(checkbox.value);
//             });

//             // Prefill the repeat time field
//             document.getElementById('newQuestTime').value = quest.repeatTime || '';

//             // Show the edit modal
//             const editQuestModal = new bootstrap.Modal(document.getElementById('editQuestModal'));
//             editQuestModal.show();

//             // Handle "Apply" button click for editing the task
//             const applyButton = document.getElementById('applyEditQuest');
//             applyButton.onclick = function () {
//                 // Retrieve updated values from the modal form
//                 const newDescription = document.getElementById('editQuestDescription').value.trim();
//                 const isImportant = document.getElementById('editQuestImportant').checked;
//                 const isCompleted = document.getElementById('editQuestCompleted').checked;

//                 // Get selected days (checkboxes)
//                 const selectedDays = Array.from(
//                     document.querySelectorAll('#editQuestDaysCheckboxGroup .form-check-input:checked')
//                 ).map((checkbox) => checkbox.value);

//                 // Get repeat time
//                 const updatedTime = document.getElementById('newQuestTime').value || null; // Set to null if empty

//                 // Validation: Ensure description is not empty
//                 if (!newDescription) {
//                     alert('Description cannot be empty.');
//                     return;
//                 }

//                 // Prepare the updated quest object
//                 const updatedQuest = {
//                     id: quest.id, // Existing quest ID for updating
//                     description: newDescription,
//                     important: isImportant,
//                     completed: isCompleted,
//                     repeatable: selectedDays.length > 0 || updatedTime !== null, // Set as repeatable if days or time are provided
//                     repeatDays: selectedDays.length > 0 ? selectedDays.join(',') : null, // Join selected days as a comma-separated string or null
//                     repeatTime: updatedTime, // Repeat time, null if not provided
//                 };

//                 // Send the updated task to the backend
//                 fetch(`http://localhost:8080/api/index/${quest.id}`, {
//                     method: 'PUT',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(updatedQuest),
//                 })
//                     .then(response => {
//                         if (!response.ok) {
//                             throw new Error(`Failed to update quest with ID: ${quest.id}`);
//                         }
//                         return response.json(); // Parse the JSON response
//                     })
//                     .then(data => {
//                         console.log('Updated quest data from server:', data);
//                         location.reload(); // Reload the page to show updated tasks
//                     })
//                     .catch(error => {
//                         console.error('Error updating quest:', error);
//                     });
//             };
//         })
//         .catch(error => {
//             console.error('Error fetching quest data:', error);
//         });
// }
