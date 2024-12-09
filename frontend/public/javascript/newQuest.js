document.getElementById('new-quest-btn').addEventListener('click', function () {
    // Get the value from the input field
    const questDescription = document.querySelector('input[aria-label="new-quest"]').value;
    const isImportant = document.getElementById('important-check').checked; // Check if the task is marked as important
    const imageInput = document.getElementById('image-upload'); // Get the image input element
    const imageFile = imageInput.files[0];  // Get the selected image file

    // Check if the input is empty
    if (questDescription.trim() === '') {
        alert('The input field is empty. Please enter a quest description.');
        return;
    }

    // Create the quest object to send in the request
    const newQuest = {
        description: questDescription,
        important: isImportant,  // Send the important flag to the backend
    };

    if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'ml_default');  // Replace with your Cloudinary upload preset

        // Upload image to Cloudinary API       tuka go menajs voa 
        fetch('https://api.cloudinary.com/v1_1/dq5oo2ceo/image/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.secure_url) {
                console.log('Image uploaded to Cloudinary:', data.secure_url);
                // Add the image URL to the quest object
                newQuest.imageUrl = data.secure_url;
            } else {
                throw new Error('Image upload failed');
            }
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            // Proceed with the quest without the image
        })
        .finally(() => {
            // Always send the quest after image upload attempt (success or failure)
            sendQuestToBackend(newQuest);
        });
    } else {
        // If no image is selected, send the quest without an image
        sendQuestToBackend(newQuest);
    }
});

function sendQuestToBackend(quest) {
    // Send a POST request to the backend
    fetch('http://localhost:8080/api/index', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quest),  // Convert the quest object to a JSON string
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

    // Clear the input fields after submission
    document.querySelector('input[aria-label="new-quest"]').value = '';
    document.getElementById('important-check').checked = false;  // Reset the important checkbox
    imageInput.value = '';  // Clear the image input
}
