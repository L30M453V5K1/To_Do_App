export function deleteQuest(questId, questElement) {
    // Send DELETE request to backend
    fetch(`http://localhost:8080/api/index/${questId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete quest.');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);  // Log success message

        // Remove the quest container from the DOM
        questElement.remove();

        // Optionally reload the page to refresh the quest list
        location.reload();
    })
    .catch(error => {
        console.error('There was an error deleting the quest:', error);
    });
}
