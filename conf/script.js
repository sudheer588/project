/* =========================
   GLOBAL VARIABLES
   ========================= */
let recognition = null;
let currentMode = "idle"; // idle | wake | emotion

/* =========================
   TEXT TO SPEECH
   ========================= */
function speakText(text, callback) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onend = () => {
    if (callback) callback();
  };

  window.speechSynthesis.speak(utterance);
}

/* =========================
   MIC BUTTON ENTRY POINT
   ========================= */
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported. Use Chrome or Edge.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  // Step 1: Wake mode
  currentMode = "wake";

  // Step 2: Say "Hi Luna" first and then start listening
  speakText("Hi ,how can i help you?", () => {
    startListening();
  });

  document.getElementById("voiceStatus").innerText = "Listening for your emotion...";
}

/* =========================
   START LISTENING FOR USER
   ========================= */
function startListening() {
  if (!recognition) return;

  recognition.start();

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript.toLowerCase().trim();
    recognition.stop();

    if (currentMode === "wake") {
      // User said something before Luna prompt
      currentMode = "emotion";
      startListening();
    } else if (currentMode === "emotion") {
      document.getElementById("emotionInput").value = text;
      checkEmotion();
    }
  };

  recognition.onerror = function () {
    recognition.stop();
    document.getElementById("voiceStatus").innerText = "Click the mic to try again.";
    currentMode = "idle";
  };
}

/* =========================
   EMOTION CHECK
   ========================= */
function checkEmotion() {
  const inputText = document.getElementById("emotionInput").value.toLowerCase();
  const message = document.getElementById("message");
  const tasks = document.getElementById("tasks");

  const emotions = {
    sad: {
      text: "It's okay to feel sad. You are not alone.",
      tasks: ["Listen to calm music", "Take deep breaths", "Rest"]
    },
    happy: {
      text: "Enjoy this happy moment.",
      tasks: ["Smile", "Share happiness", "Do something you love"]
    },
    angry: {
      text: "Pause and calm yourself.",
      tasks: ["Breathe deeply", "Step away", "Write your feelings"]
    },
    confident: {
      text: "Believe in yourself and all that you are.",
      tasks: ["Stand tall", "Recall your wins", "Encourage someone"]
    },
    anxious: {
      text: "You are safe. This feeling will pass.",
      tasks: ["Breathe slowly", "Sit comfortably", "Focus on the present"]
    },
    tired: {
      text: "Rest is important.",
      tasks: ["Close your eyes for 2 minutes", "Stretch lightly", "Drink water"]
    },
    bored: {
      text: "Spark something new.",
      tasks: ["Mingle with people", "Take a look around nature", "Try a new hobby"]
    }
  };

  tasks.innerHTML = "";

  let matched = null;
  for (let key in emotions) {
    if (inputText.includes(key)) {
      matched = key;
      break;
    }
  }

  let speechOutput = "";

  if (matched) {
    message.innerText = emotions[matched].text;
    speechOutput = emotions[matched].text + ". ";

    emotions[matched].tasks.forEach(task => {
      const li = document.createElement("li");
      li.innerText = task;
      tasks.appendChild(li);
      speechOutput += task + ". ";
    });
  } else {
    message.innerText = "Your feelings matter. Take care of yourself.";
    speechOutput = "Your feelings matter. Take care of yourself.";
  }

  // Speak result and reset mic
  speakText(speechOutput, () => {
    document.getElementById("voiceStatus").innerText = "Click the mic to start again.";
    currentMode = "idle";
  });
}