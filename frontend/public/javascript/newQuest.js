document.getElementById('new-quest-btn').addEventListener('click', function () {
    // Get the value from the input field
    const questDescription = document.querySelector('input[aria-label="new-quest"]').value;

    // Check if the input is empty
    if (questDescription.trim() === '') {
        alert('The input field is empty. Please enter a quest description.');
        return;
    }

    // Create the quest object to send in the request
    const newQuest = {
        description: questDescription
    };

    // Send a POST request to the backend
    fetch('http://localhost:8080/api/index', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Indicate that we are sending JSON data
        },
        body: JSON.stringify(newQuest),  // Convert the quest object to a JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // Parse the JSON response
    })
    .then(data => {
        console.log('Quest created:', data);  // Log the newly created quest
        // Refresh the page to trigger the GET request and display the updated quest list
        location.reload();
    })
    .catch(error => {
        console.error('There was a problem with the POST request:', error);
    });

    // Clear the input field after submission
    document.querySelector('input[aria-label="new-quest"]').value = '';
});
