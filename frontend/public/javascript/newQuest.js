document.getElementById('applyNewQuest').addEventListener('click', function () {
    // Retrieve values from the modal
    const questDescription = document.getElementById('newQuestDescription').value.trim();
    const isImportant = document.getElementById('newQuestImportant').checked;

    // Get selected days for recurrence
    const selectedDays = Array.from(
        document.querySelectorAll('#newQuestDaysCheckboxGroup .form-check-input:checked')
    ).map((checkbox) => checkbox.value);

    // Get repeat time
    const repeatTime = document.getElementById('newQuestTime').value;

    // Validate input
    if (!questDescription) {
        alert('Please enter a quest description.');
        return;
    }

    // Create the quest object
    const newQuest = {
        description: questDescription,
        important: isImportant,
        repeatable: selectedDays.length > 0 || !!repeatTime,
        repeatDays: selectedDays.join(',') || null, // Store as a comma-separated string
        repeatTime: repeatTime || null, // Null if no time is selected
    };

    // Send the quest to the backend
    sendQuestToBackend(newQuest);
});

// Function to send the quest to the backend
function sendQuestToBackend(quest) {
    fetch('http://localhost:8080/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quest),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to create quest.');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Quest created:', data);
            location.reload(); // Refresh to display the new quest
        })
        .catch((error) => console.error('Error creating quest:', error))
        .finally(() => {
            // Reset the form and hide the modal
            document.getElementById('newQuestForm').reset();
            const newQuestModal = bootstrap.Modal.getInstance(
                document.getElementById('newQuestModal')
            );
            newQuestModal.hide();
        });
}
