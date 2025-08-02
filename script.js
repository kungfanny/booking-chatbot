// ========================
// Popup toggle functionality
// ========================
const chatToggle = document.getElementById("chat-toggle");
const chatContainer = document.getElementById("chat-container");

chatToggle.addEventListener("click", () => {
   chatContainer.style.display = "flex";
   chatToggle.style.display = "none";
});

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
chatContainer.style.position = "relative";
chatContainer.appendChild(closeBtn);

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
// Add-ons per event type
// ========================
const eventAddons = {
   "Wedding": [
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

// ========================
// Message Functions
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

function botButtons(options) {
   let wrapper = document.createElement("div");
   wrapper.classList.add("message", "bot");

   options.forEach(option => {
       let btn = document.createElement("button");
       btn.innerText = option;
       btn.style.margin = "3px";
       btn.style.padding = "5px 10px";
       btn.style.borderRadius = "5px";
       btn.style.border = "1px solid #ccc";
       btn.style.background = "#f1f1f1";
       btn.style.cursor = "pointer";

       btn.addEventListener("click", () => {
           userMessage(option);
           wrapper.remove();
           nextStep(option);
       });

       wrapper.appendChild(btn);
   });

   chatWindow.appendChild(wrapper);
   chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ========================
// Conversation Flow
// ========================
let currentAddons = [];
let addonIndex = 0;

function nextStep(input) {
   if (step === 0) {
       eventType = input;
       if (!eventAddons[eventType]) {
           botMessage("Please choose an event type:");
           botButtons(["Wedding", "Private Party", "Restaurant / Bar"]);
           return;
       }
       currentAddons = eventAddons[eventType];
       addonIndex = 0;
       step++;
       botMessage(currentAddons[addonIndex].question);
       botButtons(["Yes", "No"]);
   }
   else if (step === 1) {
       answers[currentAddons[addonIndex].var] = input;

       if (currentAddons[addonIndex].sizeQuestion && input.toLowerCase() === "yes") {
           step = 2;
           botMessage("How many guests will attend?");
           return;
       }

       addonIndex++;
       if (addonIndex < currentAddons.length) {
           botMessage(currentAddons[addonIndex].question);
           botButtons(["Yes", "No"]);
       } else {
           step = 3;
           botMessage("What date is your event?");
       }
   }
   else if (step === 2) {
       answers.soundSystemSize = input;
       addonIndex++;
       step = 1;
       if (addonIndex < currentAddons.length) {
           botMessage(currentAddons[addonIndex].question);
           botButtons(["Yes", "No"]);
       } else {
           step = 3;
           botMessage("What date is your event?");
       }
   }
   else if (step === 3) {
       answers.eventDate = input;
       step++;
       botMessage("What time should we start?");
   }
   else if (step === 4) {
       answers.eventTime = input;
       step++;
       botMessage("Where will the event take place?");
   }
   else if (step === 5) {
       answers.eventLocation = input;
       step++;
       showSummary();
   }
   else if (step === 6) {
       if (input.toLowerCase() === "yes") {
           step++;
           botMessage("Great! Please provide your full name.");
       } else {
           botMessage("Okay, booking cancelled.");
           step = 0;
       }
   }
   else if (step === 7) {
       answers.name = input;
       step++;
       botMessage("What is your email address?");
   }
   else if (step === 8) {
       answers.email = input;
       step++;
       botMessage("What is your phone number?");
   }
   else if (step === 9) {
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
   botMessage(summary + "\n\nDoes everything look correct?");
   botButtons(["Yes", "No"]);
   step = 6;
}

// ========================
// Send Email
// ========================
function sendEmail() {
   emailjs.init(EMAILJS_PUBLIC_KEY);
   emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
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
   }).then(() => {
       botMessage("✅ Your booking request has been sent!");
       step = 0;
   }).catch((error) => {
       botMessage("⚠️ Error sending your request.");
       console.error(error);
       step = 0;
   });
}

// ========================
// Manual input send
// ========================
sendBtn.addEventListener("click", () => {
   const input = userInput.value.trim();
   if (!input) return;
   userInput.value = "";
   userMessage(input);
   nextStep(input);
});

// Start conversation
botMessage("Hi! What type of event are you planning?");
botButtons(["Wedding", "Private Party", "Restaurant / Bar"]);
