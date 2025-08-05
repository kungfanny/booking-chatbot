window.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const chatWindow = document.getElementById("chat-window");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  // Start with chat hidden, toggle visible
  chatContainer.style.display = "none";
  chatToggle.style.display = "flex";

  // Toggle chat open/close
chatToggle.addEventListener("click", () => {
  if (chatContainer.style.display === "flex") {
    chatContainer.style.display = "none";    // Hide chat
    chatToggle.style.display = "flex";       // Keep toggle visible
  } else {
    chatContainer.style.display = "flex";    // Show chat
    chatToggle.style.display = "flex";       // Keep toggle visible
    userInput.focus();
  }
});


  // EmailJS setup
  const EMAILJS_SERVICE_ID = "service_j792hfh"; // Your actual service ID
  const EMAILJS_TEMPLATE_ID = "template_rglszxa"; // Your actual template ID
  const EMAILJS_PUBLIC_KEY = "3xzHlGmEjHmgV45am"; // Your actual public key

  emailjs.init(EMAILJS_PUBLIC_KEY);

  // Chatbot state variables
  let step = 0;
  let eventType = "";
  let answers = {
    soundSystem: "",
    soundSystemSize: "",
    lighting: "",
    extraMic: "",
    acousticSet: "",
    ceremonySongs: "",
    firstDance: "",
    soundTechnician: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    name: "",
    email: "",
    phone: "",
  };

  const eventAddons = {
    Wedding: [
      { question: "Do you want us to provide a sound system?", var: "soundSystem", sizeQuestion: true },
      { question: "Do you want lighting?", var: "lighting" },
      { question: "Do you need an extra microphone?", var: "extraMic" },
      { question: "Would you like an acoustic set?", var: "acousticSet" },
      { question: "Would you like ceremony songs?", var: "ceremonySongs" },
      { question: "Would you like us to play your first dance live?", var: "firstDance" },
      { question: "Do you want a dedicated sound technician?", var: "soundTechnician" },
    ],
    "Private Party": [
      { question: "Do you want us to provide a sound system?", var: "soundSystem", sizeQuestion: true },
      { question: "Do you want lighting?", var: "lighting" },
      { question: "Do you need an extra microphone?", var: "extraMic" },
      { question: "Do you want a dedicated sound technician?", var: "soundTechnician" },
    ],
    "Restaurant / Bar": [
      { question: "Do you want us to provide a sound system?", var: "soundSystem", sizeQuestion: true },
      { question: "Do you want lighting?", var: "lighting" },
      { question: "Do you want a dedicated sound technician?", var: "soundTechnician" },
    ],
  };

  // Helper: add bot message bubble
  function botMessage(msg) {
    userInput.style.display = "block";
    sendBtn.style.display = "inline-block";

    const el = document.createElement("div");
    el.classList.add("message", "bot");
    el.innerText = msg;
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Helper: add user message bubble
  function userMessage(msg) {
    const el = document.createElement("div");
    el.classList.add("message", "user");
    el.innerText = msg;
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Helper: add bot message bubble with buttons
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
      btn.style.marginRight = "8px";
      btn.style.padding = "6px 12px";
      btn.style.borderRadius = "5px";
      btn.style.border = "none";
      btn.style.cursor = "pointer";
      btn.style.fontWeight = "bold";
      btn.style.backgroundColor = "#EBDFA3"; // your brand color
      btn.style.color = "#333";

      btn.addEventListener("click", () => {
        btnContainer.remove();
        el.innerText = msg; // reset msg text (remove buttons)
        userInput.style.display = "block";
        sendBtn.style.display = "inline-block";

        nextStep(btnText);
      });

      btnContainer.appendChild(btn);
    });

    el.appendChild(btnContainer);
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Conversation variables
  let currentAddons = [];
  let addonIndex = 0;

  // Ask current addon question helper
  function askAddon() {
    botMessageWithButtons(currentAddons[addonIndex].question, ["Yes", "No"]);
  }

  // Flow control
  function nextStep(input) {
    input = input.trim();
    if (!input) return;

    if (step === 0) {
      userMessage(input);
      eventType = input;
      if (!eventAddons[eventType]) {
        botMessageWithButtons("Please choose your event type:", ["Wedding", "Private Party", "Restaurant / Bar"]);
        return;
      }
      currentAddons = eventAddons[eventType];
      addonIndex = 0;
      step = 1;
      askAddon();
    } 
    else if (step === 1) {
      userMessage(input);
      let addon = currentAddons[addonIndex];
      answers[addon.var] = input;

      if (addon.sizeQuestion && input.toLowerCase() === "yes") {
        step = 2;
        botMessageWithButtons("How many guests will attend?", ["Up to 50 persons", "50-200 persons"]);
        return;
      }

      addonIndex++;
      if (addonIndex < currentAddons.length) {
        askAddon();
      } else {
        step = 3;
        botMessage("What date is your event?");
      }
    }
    else if (step === 2) {
      userMessage(input);
      answers.soundSystemSize = input;
      addonIndex++;
      step = 1;

      if (addonIndex < currentAddons.length) {
        askAddon();
      } else {
        step = 3;
        botMessage("What date is your event?");
      }
    }
    else if (step === 3) {
      userMessage(input);
      answers.eventDate = input;
      step = 4;
      botMessage("What time should we start?");
    }
    else if (step === 4) {
      userMessage(input);
      answers.eventTime = input;
      step = 5;
      botMessage("Where will the event take place?");
    }
    else if (step === 5) {
      userMessage(input);
      answers.eventLocation = input;
      step = "summary";
      showSummary();
    }
    else if (step === "summary") {
      userMessage(input);
      if (input.toLowerCase() === "yes") {
        step = 7;
        botMessage("Great! Please provide your full name.");
      } else {
        botMessageWithButtons("Okay, let's try again. What type of event are you planning?", ["Wedding", "Private Party", "Restaurant / Bar"]);
        step = 0;
      }
    }
    else if (step === 7) {
      userMessage(input);
      answers.name = input;
      step = 8;
      botMessage("What is your email address?");
    }
    else if (step === 8) {
      userMessage(input);
      answers.email = input;
      step = 9;
      botMessage("What is your phone number?");
    }
    else if (step === 9) {
      userMessage(input);
      answers.phone = input;
      sendEmail();
    }
  }

  // Show booking summary
  function showSummary() {
    let summary = `Here’s your booking summary:\n\nEvent: ${eventType}\n`;
    if (answers.soundSystem.toLowerCase() === "yes")
      summary += `• Sound System (${answers.soundSystemSize})\n`;
    if (answers.lighting.toLowerCase() === "yes") summary += `• Lighting\n`;
    if (answers.extraMic.toLowerCase() === "yes") summary += `• Extra Mic\n`;
    if (answers.acousticSet.toLowerCase() === "yes") summary += `• Acoustic Set\n`;
    if (answers.ceremonySongs.toLowerCase() === "yes") summary += `• Ceremony Songs\n`;
    if (answers.firstDance.toLowerCase() === "yes") summary += `• First Dance\n`;
    if (answers.soundTechnician.toLowerCase() === "yes") summary += `• Sound Technician\n`;
    summary += `\n📅 Date: ${answers.eventDate}\n🕒 Time: ${answers.eventTime}\n📍 Location: ${answers.eventLocation}`;
    botMessageWithButtons(summary + "\n\nDoes everything look correct?", ["Yes", "No"]);
    step = "summary";
  }

  // Send booking email via EmailJS
  function sendEmail() {
    console.log("sendEmail() called with:", answers);

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      botMessage(
        "✅ Test Mode: Booking request would be sent now.\n\nThis is not a confirmed booking until we agree on pricing and details via email."
      );
      console.warn("EmailJS keys are missing. Running in Test Mode.");
      step = 0;
      return;
    }

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        event_type: eventType,
        sound_system: answers.soundSystem,
        sound_system_size: answers.soundSystemSize,
        lighting: answers.lighting,
        extra_mic: answers.extraMic,
        acoustic_set: answers.acousticSet,
        ceremony_songs: answers.ceremonySongs,
        first_dance: answers.firstDance,
        sound_technician: answers.soundTechnician,
        event_date: answers.eventDate,
        event_time: answers.eventTime,
        event_location: answers.eventLocation,
        customer_name: answers.name,
        customer_email: answers.email,
        customer_phone: answers.phone,
      })
      .then(() => {
        botMessage(
          "✅ Your booking request has been sent! We’ll contact you soon.\n\nThis is not a confirmed booking until we agree on pricing and details via email."
        );
        console.log("Email sent successfully!");
        step = 0;
      })
      .catch((error) => {
        botMessage(
          "⚠️ Sorry, there was an error sending your request. Please try again later."
        );
        console.error("EmailJS error:", error);
        step = 0;
      });
  }
  
  // Handle send button click and Enter key
  sendBtn.addEventListener("click", () => {
    const input = userInput.value.trim();
    if (!input) return;
    userInput.value = "";
    nextStep(input);
  });

  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.click();
    }
  });

  // Start the conversation with event type buttons
  botMessageWithButtons("Hi! What type of event are you planning?", ["Wedding", "Private Party", "Restaurant / Bar"]);
});
