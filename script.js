// EmailJS Setup
// ========================
const EMAILJS_SERVICE_ID = "service_j792hfh";
const EMAILJS_TEMPLATE_ID = "template_rglszxa";
const EMAILJS_PUBLIC_KEY = "3xzHlGmEjHmgV45am";

// ✅ Initialize EmailJS when the page loads
(function () {
  emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// ========================
// Chatbot Variables
// ========================
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

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
// Chat Message Functions with button support
// ========================
function botMessage(msg, buttons = []) {
  const el = document.createElement("div");
  el.classList.add("message", "bot");
  el.innerText = msg;
  chatWindow.appendChild(el);

  if (buttons.length > 0) {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    buttons.forEach((buttonText) => {
      const btn = document.createElement("button");
      btn.classList.add("option-btn");
      btn.innerText = buttonText;
      btn.addEventListener("click", () => {
        nextStep(buttonText);
        buttonsContainer.remove();
      });
      buttonsContainer.appendChild(btn);
    });

    chatWindow.appendChild(buttonsContainer);
  }

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function userMessage(msg) {
  const el = document.createElement("div");
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
  input = input.trim();

  if (step === 0) {
    userMessage(input);
    eventType = input;
    if (!eventAddons[eventType]) {
      botMessage("Please choose:", [
        "Wedding",
        "Private Party",
        "Restaurant / Bar",
      ]);
      return;
    }
    currentAddons = eventAddons[eventType];
    addonIndex = 0;
    step++;
    askAddonQuestion();
  } else if (step === 1) {
    userMessage(input);
    const addon = currentAddons[addonIndex];
    answers[addon.var] = input;

    if (addon.sizeQuestion && input.toLowerCase() === "yes") {
      step = 2;
      botMessage("How many guests will attend?", ["Up to 50", "50–200"]);
      return;
    }

    addonIndex++;
    if (addonIndex < currentAddons.length) {
      askAddonQuestion();
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
      askAddonQuestion();
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

function askAddonQuestion() {
  const addon = currentAddons[addonIndex];
  botMessage(addon.question, ["Yes", "No"]);
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
  botMessage(summary, ["Yes", "No"]);
  step = 6;
}

// ========================
// Send Email
// ========================
function sendEmail() {
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
// Start the chat
// ========================
botMessage("Hi 👋 What type of event would you like to book?", [
  "Wedding",
  "Private Party",
  "Restaurant / Bar",
]);

sendBtn.addEventListener("click", () => {
  const input = userInput.value.trim();
  if (input) {
    nextStep(input);
    userInput.value = "";
  }
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
