export function editQuest(questId, newDescription) {
    // Prepare the updated quest object
    const updatedQuest = {
        description: newDescription
    };

    // Send PUT request to backend with the new description
    fetch(`http://localhost:8080/api/index/${questId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedQuest)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update quest.');
        }
        return response.json();
    })
    .then(data => {
        console.log("Quest updated:", data);  // Log the updated quest

        // Optionally refresh the page to reflect the updated quest list
        location.reload();
    })
    .catch(error => {
        console.error('There was an error updating the quest:', error);
    });
}
