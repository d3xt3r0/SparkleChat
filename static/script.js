client_id = makeid()
var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);


ws.onmessage = function(event) {
    var message = document.createElement('div');
    message.className = 'text-start';
    const response_data = JSON.parse(event.data)
    
    if (response_data.code == 203){
        message.innerHTML = `<strong>Server: </strong> ${response_data.message}`;
    }
    else{
        message.innerHTML = `<strong>Stranger: </strong> ${response_data.message}`;
    }

    
    chatWindow.appendChild(message);
};


// Function to send message
function sendMessage() {
    var chatInput = document.getElementById('chatInput');
    if (chatInput.value.trim() !== '') {
        var chatWindow = document.getElementById('chatWindow');
        var message = document.createElement('div');
        message.className = 'text-end';
        message.innerHTML = `<strong>You:</strong> ${chatInput.value}`;
        chatWindow.appendChild(message);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        ws.send(chatInput.value)
        chatInput.value = '';

    }
}

function makeid() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 5) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
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