export function editQuest(questId, newDescription, isImportant, isComplered) {
    const updatedQuest = {
        description: newDescription,
        important: isImportant, // Include the "important" flag
        completed: isComplered
    };

    console.log('Sending PUT request with data:', updatedQuest);

    return fetch(`http://localhost:8080/api/index/${questId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuest),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to update quest with ID: ${questId}`);
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            console.log('Updated quest data from server:', data);
            return data;
        });
}
