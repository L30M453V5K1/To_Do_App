document.getElementById('applyNewQuest').addEventListener('click', function () {
    const questDescription = document.querySelector('input[aria-label="new-quest"]').value;
    const isImportant = document.getElementById('important-check').checked;
    const imageInput = document.getElementById('image-upload');
    const imageFile = imageInput.files[0];

    if (questDescription.trim() === '') {
        alert('The input field is empty. Please enter a quest description.');
        return;
    }

    const newQuest = {
        description: questDescription,
        important: isImportant,
    };

    if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'ml_default');

        fetch('https://api.cloudinary.com/v1_1/dq5oo2ceo/image/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.secure_url) {
                newQuest.imageUrl = data.secure_url;
            } else {
                throw new Error('Image upload failed');
            }
        })
        .catch(error => console.error('Error uploading image:', error))
        .finally(() => {
            sendQuestToBackend(newQuest, imageInput); // Pass imageInput to clear it later
        });
    } else {
        sendQuestToBackend(newQuest, imageInput);
    }
});

function sendQuestToBackend(quest, imageInput) {
    fetch('http://localhost:8080/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quest),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Quest created:', data);
        location.reload();
    })
    .catch(error => console.error('There was a problem with the POST request:', error))
    .finally(() => {
        document.querySelector('input[aria-label="new-quest"]').value = '';
        document.getElementById('important-check').checked = false;
        imageInput.value = ''; // Clear the image input
    });
}