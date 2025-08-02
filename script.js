// ========================
// Position & Style Control
// ========================
document.addEventListener("DOMContentLoaded", function () {
  const chatContainer = document.getElementById("chat-container");
  const chatToggle = document.getElementById("chat-toggle");

  // Style for chat container
  if (chatContainer) {
    chatContainer.style.position = "fixed";
    chatContainer.style.bottom = "20px";
    chatContainer.style.right = "20px";
    chatContainer.style.width = "350px";
    chatContainer.style.height = "500px";
    chatContainer.style.maxHeight = "80vh";
    chatContainer.style.borderRadius = "10px";
    chatContainer.style.zIndex = "999999";
    chatContainer.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    chatContainer.style.background = "#fff";
    chatContainer.style.overflow = "hidden";
    chatContainer.style.flexDirection = "column";
  }

  // Style for toggle button
  if (chatToggle) {
    chatToggle.style.position = "fixed";
    chatToggle.style.bottom = "20px";
    chatToggle.style.right = "20px";
    chatToggle.style.width = "50px";
    chatToggle.style.height = "50px";
    chatToggle.style.borderRadius = "50%";
    chatToggle.style.background = "#007bff";
    chatToggle.style.color = "#fff";
    chatToggle.style.display = "flex";
    chatToggle.style.alignItems = "center";
    chatToggle.style.justifyContent = "center";
    chatToggle.style.cursor = "pointer";
    chatToggle.style.zIndex = "1000000";
    chatToggle.style.fontSize = "22px";
  }
});

// ========================
// Popup toggle functionality
// ========================
const chatToggle = document.getElementById("chat-toggle");
const chatContainer = document.getElementById("chat-container");

chatToggle.addEventListener("click", () => {
  chatContainer.style.display = "flex";
  chatToggle.style.display = "none";
});

// Create and add close button inside chat
const closeBtn = document.createElement("button");
closeBtn.innerText = "×";
closeBtn.style.position = "absolute";
closeBtn.style.top = "5px";
closeBtn.style.right = "10px";
closeBtn.style.background = "transparent";
closeBtn.style.border = "none";
closeBtn.style.fontSize = "24px";
closeBtn.style.cursor = "pointer";

closeBtn.addEventListener("click", () => {
  chatContainer.style.display = "none";
  chatToggle.style.display = "flex";
});

chatContainer.style.position = "relative"; // for close button position
chatContainer.appendChild(closeBtn);

// Start with chat hidden
chatContainer.style.display = "none";
chatToggle.style.display = "flex";

// ========================
// EmailJS Setup
// ========================
const EMAILJS_SERVICE_ID = "service_j792hfh";
const EMAILJS_TEMPLATE_ID = "template_rglszxa";
const EMAILJS_PUBLIC_KEY = "3xzHlGmEjHmgV45am";

// ========================
// Chatbot Variables
// ========================
let chatWindow = document.getElementById("chat-window");
let userInput = document.getElementById("user-input");
let sendBtn = document.getElementById("send-btn");

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

// ========================
// Event Add-ons per type
// ========================
const eventAddons = {
  Wedding: [
    {
      question: "Do you want us to provide a sound system?",
      var: "soundSystem",
      sizeQuestion: true,
    },
    { question: "Do you want lighting?", var: "lighting" },
    { question: "Do you need an extra microphone?", var: "extraMic" },
    { question: "Would you like an acoustic set?", var: "acousticSet" },
    { question: "Would you like ceremony songs?", var: "ceremonySongs" },
    {
      question: "Would you like us to play your first dance live?",
      var: "firstDance",
    },
    {
      question: "Do you want a dedicated sound technician?",
      var: "soundTechnician",
    },
  ],
  "Private Party": [
    {
      question: "Do you want us to provide a sound system?",
      var: "soundSystem",
      sizeQuestion: true,
    },
    { question: "Do you want lighting?", var: "lighting" },
    { question: "Do you need an extra microphone?", var: "extraMic" },
    {
      question: "Do you want a dedicated sound technician?",
      var: "soundTechnician",
    },
  ],
  "Restaurant / Bar": [
    {
      question: "Do you want us to provide a sound system?",
      var: "soundSystem",
      sizeQuestion: true,
    },
    { question: "Do you want lighting?", var: "lighting" },
    {
      question: "Do you want a dedicated sound technician?",
      var: "soundTechnician",
    },
  ],
};

// ========================
// Chat Message Functions
// ========================
function botMessage(msg) {
  let el = document.createElement("div");
  el.classList.add("message", "bot");
  el.innerText = msg;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function userMessage(msg) {
  let el = document.createElement("div");
  el.classList.add("message", "user");
  el.innerText = msg;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ========================
// Conversation Flow
// ========================
let currentAddons = [];
let addonIndex = 0;

function nextStep(input) {
  if (step === 0) {
    userMessage(input);
    eventType = input;
    if (!eventAddons[eventType]) {
      botMessage("Please choose: Wedding / Private Party / Restaurant / Bar");
      return;
    }
    currentAddons = eventAddons[eventType];
    addonIndex = 0;
    step++;
    botMessage(currentAddons[addonIndex].question);
  } else if (step === 1) {
    userMessage(input);
    let addon = currentAddons[addonIndex];
    answers[addon.var] = input;

    if (addon.sizeQuestion && input.toLowerCase() === "yes") {
      step = 2;
      botMessage("How many guests will attend? (Up to 50 / 50–200)");
      return;
    }

    addonIndex++;
    if (addonIndex < currentAddons.length) {
      botMessage(currentAddons[addonIndex].question);
    } else {
      step = 3;
      botMessage("What date is your event?");
    }
  } else if (step === 2) {
    userMessage(input);
    answers.soundSystemSize = input;
    addonIndex++;
    step = 1;
    if (addonIndex < currentAddons.length) {
      botMessage(currentAddons[addonIndex].question);
    } else {
      step = 3;
      botMessage("What date is your event?");
    }
  } else if (step === 3) {
    userMessage(input);
    answers.eventDate = input;
    step++;
    botMessage("What time should we start?");
  } else if (step === 4) {
    userMessage(input);
    answers.eventTime = input;
    step++;
    botMessage("Where will the event take place?");
  } else if (step === 5) {
    userMessage(input);
    answers.eventLocation = input;
    step++;
    showSummary();
  } else if (step === 6) {
    userMessage(input);
    if (input.toLowerCase() === "yes") {
      step++;
      botMessage("Great! Please provide your full name.");
    } else {
      botMessage("Okay, booking cancelled. You can restart anytime.");
      step = 0;
    }
  } else if (step === 7) {
    userMessage(input);
    answers.name = input;
    step++;
    botMessage("What is your email address?");
  } else if (step === 8) {
    userMessage(input);
    answers.email = input;
    step++;
    botMessage("What is your phone number?");
  } else if (step === 9) {
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
  if (answers.acousticSet.toLowerCase() === "yes")
    summary += `• Acoustic Set\n`;
  if (answers.ceremonySongs.toLowerCase() === "yes")
    summary += `• Ceremony Songs\n`;
  if (answers.firstDance.toLowerCase() === "yes") summary += `• First Dance\n`;
  if (answers.soundTechnician.toLowerCase() === "yes")
    summary += `• Sound Technician\n`;
  summary += `\n📅 Date: ${answers.eventDate}\n🕒 Time: ${answers.eventTime}\n📍 Location: ${answers.eventLocation}`;
  botMessage(summary + "\n\nDoes everything look correct? (Yes/No)");
  step = 6;
}

// ========================
// Send Email
// ========================
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

  emailjs.init(EMAILJS_PUBLIC_KEY);
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

// ========================
// Input Handling
// ========================
sendBtn.addEventListener("click", () => {
  const input = userInput.value.trim();
  if (!input) return;
  userInput.value = "";
  nextStep(input);
});

// Start conversation
botMessage(
  "Hi! What type of event are you planning? (Wedding / Private Party / Restaurant / Bar)"
);
