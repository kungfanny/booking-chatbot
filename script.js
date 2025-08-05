window.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const chatWindow = document.getElementById("chat-window");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  // Start hidden
  chatContainer.classList.add("hidden");

  // Toggle chat window visibility
  toggleBtn.addEventListener("click", () => {
    chatContainer.classList.toggle("hidden");
    if (!chatContainer.classList.contains("hidden")) {
      userInput.focus();
    }
  });

  // Example simple flow with buttons on first question:
  let step = 0;
  let eventType = "";
  const eventAddons = {
    Wedding: [
      { question: "Do you want us to provide a sound system?", var: "soundSystem", sizeQuestion: true },
      { question: "Do you want lighting?", var: "lighting" },
    ],
    "Private Party": [
      { question: "Do you want us to provide a sound system?", var: "soundSystem", sizeQuestion: true },
      { question: "Do you want lighting?", var: "lighting" },
    ],
    "Restaurant / Bar": [
      { question: "Do you want us to provide a sound system?", var: "soundSystem", sizeQuestion: true },
      { question: "Do you want lighting?", var: "lighting" },
    ],
  };

  let currentAddons = [];
  let addonIndex = 0;
  let answers = {};

  function botMessage(msg) {
    const el = document.createElement("div");
    el.classList.add("message", "bot");
    el.innerText = msg;
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function userMessage(msg) {
    const el = document.createElement("div");
    el.classList.add("message", "user");
    el.innerText = msg;
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function botMessageWithButtons(msg, buttons) {
    userInput.style.display = "none";
    sendBtn.style.display = "none";

    const el = document.createElement("div");
    el.classList.add("message", "bot");
    el.innerText = msg;

    const btnContainer = document.createElement("div");
    btnContainer.style.marginTop = "8px";

    buttons.forEach((btnText) => {
      const btn = document.createElement("button");
      btn.textContent = btnText;

      btn.addEventListener("click", () => {
        userInput.style.display = "block";
        sendBtn.style.display = "inline-block";
        btnContainer.remove();
        el.innerText = msg; // Remove buttons

        userMessage(btnText);
        nextStep(btnText);
      });

      btnContainer.appendChild(btn);
    });

    el.appendChild(btnContainer);
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function nextStep(input) {
    input = input.trim();

    if (step === 0) {
      botMessageWithButtons("What type of event are you planning?", ["Wedding", "Private Party", "Restaurant / Bar"]);
      step++;
      return;
    }

    if (!input) return;

    if (step === 1) {
      // Save event type
      eventType = input;
      answers.eventType = input;
      currentAddons = eventAddons[eventType] || [];
      addonIndex = 0;

      userMessage(input);
      if (currentAddons.length > 0) {
        botMessage(currentAddons[addonIndex].question);
        step++;
      } else {
        botMessage("Thank you! We will contact you soon.");
        step = 5;
      }
      return;
    }

    if (step === 2) {
      // Ask Yes/No addon question buttons
      botMessageWithButtons(currentAddons[addonIndex].question, ["Yes", "No"]);
      step++;
      return;
    }

    if (step === 3) {
      // Save addon answer
      const addon = currentAddons[addonIndex];
      answers[addon.var] = input;
      userMessage(input);
      addonIndex++;

      if (addon.sizeQuestion && input.toLowerCase() === "yes") {
        botMessageWithButtons("How many guests will attend?", ["Up to 50 persons", "50-200 persons"]);
        step = 4;
        return;
      }

      if (addonIndex < currentAddons.length) {
        botMessage(currentAddons[addonIndex].question);
        step = 2;
      } else {
        botMessage("Thank you for your answers! We will contact you soon.");
        step = 5;
      }
      return;
    }

    if (step === 4) {
      answers.soundSystemSize = input;
      userMessage(input);
      addonIndex++;
      if (addonIndex < currentAddons.length) {
        botMessage(currentAddons[addonIndex].question);
        step = 2;
      } else {
        botMessage("Thank you for your answers! We will contact you soon.");
        step = 5;
      }
      return;
    }
  }

  // Start conversation with first question
  nextStep("");

  // Send button handler
  sendBtn.addEventListener("click", () => {
    const input = userInput.value.trim();
    if (!input) return;
    userInput.value = "";
    userMessage(input);
    nextStep(input);
  });

  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.click();
    }
  });
});
