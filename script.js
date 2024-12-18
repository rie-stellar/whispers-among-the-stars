const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const floatingMessages = document.getElementById("floatingMessages");

// Function to create floating circles with messages
function createFloatingMessage(message) {
  const star = document.createElement("div");
  star.classList.add("star");
  star.style.top = `${Math.random() * 90 + 5}%`;
  star.style.left = `${Math.random() * 90 + 5}%`;

  // Random color selection for neon glow
  const glowColors = [
    { background: "rgba(255, 0, 0, 1)", boxShadow: "0 0 15px 5px rgba(255, 0, 0, 0.8), 0 0 25px 10px rgba(255, 0, 0, 0.6)", textShadow: "0 0 5px rgba(255, 0, 0, 0.9)" }, // Red
    { background: "rgba(0, 255, 0, 1)", boxShadow: "0 0 15px 5px rgba(0, 255, 0, 0.8), 0 0 25px 10px rgba(0, 255, 0, 0.6)", textShadow: "0 0 5px rgba(0, 255, 0, 0.9)" }, // Green
    { background: "rgba(0, 0, 255, 1)", boxShadow: "0 0 15px 5px rgba(0, 0, 255, 0.8), 0 0 25px 10px rgba(0, 0, 255, 0.6)", textShadow: "0 0 5px rgba(0, 0, 255, 0.9)" }, // Blue
    { background: "rgba(255, 255, 0, 1)", boxShadow: "0 0 15px 5px rgba(255, 255, 0, 0.8), 0 0 25px 10px rgba(255, 255, 0, 0.6)", textShadow: "0 0 5px rgba(255, 255, 0, 0.9)" }, // Yellow
    { background: "rgba(0, 255, 255, 1)", boxShadow: "0 0 15px 5px rgba(0, 255, 255, 0.8), 0 0 25px 10px rgba(0, 255, 255, 0.6)", textShadow: "0 0 5px rgba(0, 255, 255, 0.9)" } // Cyan
  ];

  const randomColor = glowColors[Math.floor(Math.random() * glowColors.length)];
  star.style.backgroundColor = randomColor.background;
  star.style.boxShadow = randomColor.boxShadow;
  star.style.textShadow = randomColor.textShadow;

  // Add message tooltip
  const tooltip = document.createElement("div");
  tooltip.classList.add("message-display");
  tooltip.textContent = message;
  star.appendChild(tooltip);

  // Create a container for the delete button (placed outside the star)
  const deleteContainer = document.createElement("div");
  deleteContainer.classList.add("delete-container");

  // Create the delete button inside the container
  const deleteButton = document.createElement("div");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "✖";  // Delete icon (you can customize this)
  deleteContainer.appendChild(deleteButton);

  // Append the delete container below the star
  star.appendChild(deleteContainer);

  // Event listener to show message beside the floating circle when star is clicked
  star.addEventListener("click", (e) => {
    // Only show the bubble if the click is not on the delete button
    if (e.target !== deleteButton && !deleteContainer.contains(e.target)) {
      showMessageBubble(message, star);
    }
  });

  // Event listener to delete the message when delete button is clicked
  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();  // Prevent the star's click event from firing
    removeMessage(message, star);  // Remove message from the page and local storage
  });

  floatingMessages.appendChild(star);
}

// Function to handle sending messages
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    createFloatingMessage(message);
    saveMessage(message);
    messageInput.value = "";
  }
}

// Function to save messages to localStorage
function saveMessage(message) {
  let messages = JSON.parse(localStorage.getItem("messages")) || [];
  messages.push(message);
  localStorage.setItem("messages", JSON.stringify(messages));
}

// Function to load messages from localStorage on page load
function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  messages.forEach((message) => {
    createFloatingMessage(message);
  });
}

// Function to show message beside the floating circle
function showMessageBubble(message, starElement) {
  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");
  bubble.textContent = message;

  // Get the position of the star element
  const rect = starElement.getBoundingClientRect();
  
  // Position the bubble next to the star, with a slight offset for better appearance
  bubble.style.top = `${rect.top + window.scrollY - 30}px`; // Adjust position slightly upwards
  bubble.style.left = `${rect.left + window.scrollX + rect.width + 10}px`; // Position next to star

  document.body.appendChild(bubble);

  // Remove bubble after 3 seconds
  setTimeout(() => {
    bubble.remove();
  }, 3000);
}

// Function to remove the message (star) and update localStorage
function removeMessage(message, starElement) {
  // Remove from localStorage
  let messages = JSON.parse(localStorage.getItem("messages")) || [];
  messages = messages.filter((storedMessage) => storedMessage !== message);  // Remove the deleted message
  localStorage.setItem("messages", JSON.stringify(messages));

  // Remove the star element (message) from the page
  starElement.remove();
}

// Event listeners for sending messages
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// Load saved messages when the page loads
window.addEventListener("load", loadMessages);
