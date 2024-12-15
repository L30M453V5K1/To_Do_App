document.getElementById('applyNewQuest').addEventListener('click', function () {
    const questDescription = document.getElementById('newQuestDescription').value.trim();
    const isImportant = document.getElementById('newQuestImportant').checked;
    const selectedDays = Array.from(document.getElementById('newQuestDays').selectedOptions).map(opt => opt.value);
    const repeatTime = document.getElementById('newQuestTime').value;

    if (!questDescription) {
        alert('Please enter a quest description.');
        return;
    }

    const newQuest = {
        description: questDescription,
        important: isImportant,
        daysOfRepeat: selectedDays,
        timeOfRepeat: repeatTime,
    };

    sendQuestToBackend(newQuest);
});

function sendQuestToBackend(quest) {
    fetch('http://localhost:8080/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quest),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create quest.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Quest created:', data);
            location.reload();
        })
        .catch(error => console.error('Error creating quest:', error))
        .finally(() => {
            document.getElementById('newQuestForm').reset(); // Clear form fields
        });
}
