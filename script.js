window.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const chatWindow = document.getElementById("chat-window");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  chatContainer.style.display = "none";
  chatToggle.style.display = "flex";

  chatToggle.addEventListener("click", () => {
    if (chatContainer.style.display === "flex") {
      chatContainer.style.display = "none";
      chatToggle.style.display = "flex";
    } else {
      chatContainer.style.display = "flex";
      chatToggle.style.display = "none";
      userInput.focus();
    }
  });

  // EmailJS setup
  const EMAILJS_SERVICE_ID = "service_j792hfh";
  const EMAILJS_TEMPLATE_ID = "template_rglszxa";
  const EMAILJS_PUBLIC_KEY = "3xzHlGmEjHmgV45am";

  emailjs.init(EMAILJS_PUBLIC_KEY);

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

  // Helper to add a bot message with text only
  function botMessage(msg) {
    userInput.style.display = "block";
    sendBtn.style.display = "inline-block";

    const el = document.createElement("div");
    el.classList.add("message", "bot");
    el.innerText = msg;
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Helper to add a user message bubble
  function userMessage(msg) {
    const el = document.createElement("div");
    el.classList.add("message", "user");
    el.innerText = msg;
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Helper to add a bot message with buttons
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
      btn.style.backgroundColor = "#EBDFA3";
      btn.style.color = "#333";

      btn.addEventListener("click", () => {
        btnContainer.remove();
        el.innerText = msg; // remove buttons but keep text
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

  let currentAddons = [];
  let addonIndex = 0;

  function askAddonQuestion() {
    const addon = currentAddons[addonIndex];
    botMessageWithButtons(addon.question, ["Yes", "No"]);
  }

  function nextStep(input) {
    input = input.trim();
    if (!input) return;

    // Step 0: Ask event type with buttons
    if (step === 0) {
      userMessage(input);
      eventType = input;

      if (!eventAddons[eventType]) {
        botMessageWithButtons("Please choose one of these event types:", ["Wedding", "Private Party", "Restaurant / Bar"]);
        return;
      }
      currentAddons = eventAddons[eventType];
      addonIndex = 0;
      step = 1;
      askAddonQuestion();
    }
    // Step 1: Add-on questions (Yes/No)
    else if (step === 1) {
      userMessage(input);
      const addon = currentAddons[addonIndex];
      answers[addon.var] = input;

      if (addon.sizeQuestion && input.toLowerCase() === "yes") {
        step = 2;
        botMessageWithButtons("How many guests will attend?", ["Up to 50 persons", "50-200 persons"]);
        return;
      }

      addonIndex++;
      if (addonIndex < currentAddons.length) {
        askAddonQuestion();
      } else {
        step = 3;
        botMessage("What date is your event?");
      }
    }
    // Step 2: Guest size question (buttons)
    else if (step === 2) {
      userMessage(input);
      answers.soundSystemSize = input;
      addonIndex++;
      step = 1;
      if (addonIndex < currentAddons.length) {
        askAddonQuestion();
      } else {
        step = 3;
        botMessage("What date is your event?");
      }
    }
    // Step 3: Event date (text input)
    else if (step === 3) {
      userMessage(input);
      answers.eventDate = input;
      step = 4;
      botMessage("What time should we start?");
    }
    // Step 4: Event time (text input)
    else if (step === 4) {
      userMessage(input);
      answers.eventTime = input;
      step = 5;
      botMessage("Where will the event take place?");
    }
    // Step 5: Event location (text input)
    else if (step === 5) {
      userMessage(input);
      answers.eventLocation = input;
      step = 6;
      botMessageWithButtons("Does everything look correct? (Yes / No)", ["Yes", "No"]);
    }
    // Step 6: Confirmation yes/no
    else if (step === 6) {
      userMessage(input);
      if (input.toLowerCase() === "yes") {
        step = 7;
        botMessage("Great! Please provide your full name.");
      } else {
        botMessage("Okay, booking cancelled. You can restart anytime by refreshing the page.");
        step = 0;
      }
    }
    // Step 7: Name
    else if (step === 7) {
      userMessage(input);
      answers.name = input;
      step = 8;
      botMessage("What is your email address?");
    }
    // Step 8: Email
    else if (step === 8) {
      userMessage(input);
      answers.email = input;
      step = 9;
      botMessage("What is your phone number?");
    }
    // Step 9: Phone and send email
    else if (step === 9) {
      userMessage(input);
      answers.phone = input;
      sendEmail();
    }
  }

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
    botMessage(summary + "\n\nDoes everything look correct? (Yes/No)");
    step = 6;
  }

  function sendEmail() {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      botMessage("✅ Test Mode: Booking request would be sent now.\n\nThis is not a confirmed booking.");
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
        botMessage("✅ Your booking request has been sent! We’ll contact you soon.");
        step = 0;
      })
      .catch((error) => {
        botMessage("⚠️ Sorry, there was an error sending your request. Please try again later.");
        step = 0;
      });
  }

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

  // Start conversation with buttons for event type
  botMessageWithButtons("Hi! What type of event are you planning?", ["Wedding", "Private Party", "Restaurant / Bar"]);
});
