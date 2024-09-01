// Function to send message
function sendMessage() {
    var chatInput = document.getElementById('chatInput');
    if (chatInput.value.trim() !== '') {
        var chatWindow = document.getElementById('chatWindow');
        var message = document.createElement('div');
        message.className = 'text-end';
        message.innerHTML = `<strong>You:</strong> ${chatInput.value}`;
        chatWindow.appendChild(message);
        chatInput.value = '';
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}

// Send message on button click
document.getElementById('sendBtn').addEventListener('click', sendMessage);

// Send message on pressing Enter key
document.getElementById('chatInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action (e.g., form submission)
        sendMessage();
    }
});

// Placeholder for skip button functionality
document.getElementById('skipBtn').addEventListener('click', function() {
    alert('Skipping to the next chat!');
    // Logic for skipping to the next chat can be implemented here
});