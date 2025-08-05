window.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const chatWindow = document.getElementById("chat-window");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const chatClose = document.getElementById("chat-close");

  // Start with chat hidden, toggle visible
  chatContainer.style.display = "none";
  chatToggle.style.display = "flex";

  // Toggle chat open/close with toggle button
  chatToggle.addEventListener("click", () => {
    chatContainer.style.display = "flex";
    chatToggle.style.display = "none";
    userInput.focus();
  });

  // Close (minimize) chat with close button
  chatClose.addEventListener("click", () => {
    chatContainer.style.display = "none";
    chatToggle.style.display = "flex";
  });

  // EmailJ
