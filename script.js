let btn = document.querySelector('#btn');
let content = document.querySelector('#content');
let voiceGif = document.querySelector('#voice');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'En-BG'; // Changed to English for better compatibility

content.style.display = 'none';

function speak(text) {
    return new Promise((resolve, reject) => {
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.rate = 1.2;
        utterance.volume = 1;
        utterance.lang = "hi-BG"; // Changed to English for better compatibility

        utterance.onend = resolve;
        utterance.onerror = reject;

        window.speechSynthesis.speak(utterance);
    });
}

function getAnswer(question) {
    const qa = {
        "hello": "Hello! How can I assist you today?",
        "what is your name": "My name is Shifra, your virtual assistant.",
        "how are you": "I'm doing well, thank you for asking!",
        "what can you do": "I can answer questions, open websites, search the web, provide date and time information.",
        "who created you": "I was created by Pranjal.",
        "what is your purpose": "My purpose is to assist you with tasks and provide helpful information.",
        "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
        "what is the weather like today": "I currently do not have access to real-time weather data.",
        "what time is it": `The current time is ${new Date().toLocaleTimeString()}.`,
        "what is today's date": `Today's date is ${new Date().toLocaleDateString()}.`,
        "can you help me with coding": "Yes, I can assist you with coding by providing code examples, debugging tips, and explanations.",
        "how do you work": "I work by processing your queries and providing the best possible responses based on my programming.",
        "can you search the web": "Yes, I can perform web searches and provide information from various sources.",
        "what is your favorite color": "I don't have preferences like humans, but I imagine blue would be nice!",
        "who is your creator": "I was created by Pranjal to assist you in your tasks.",
        "can you set reminders": "Currently, I don't support setting reminders, but you can use calendar apps for that."
    };


    question = question.toLowerCase().trim();
    
    if (question.startsWith("open ")) {
        const site = question.split("open ")[1].trim();
        return openWebsite(site);
    } else if (question.startsWith("search for ")) {
        const query = question.split("search for ")[1].trim();
        return searchWeb(query);
    } else if (question.includes("time") || question.includes("date") || question.includes("year")) {
        return getDateTime(question);
    } else if (question.includes("calculator")) {
        return openCalculator();
    } else if (question.includes("coderstar") || question.includes("coder star")) {
        return openCoderStar();
    }
    
    return qa[question] || "I'm sorry, I don't have an answer for that question.";
}

function getDateTime(question) {
    const now = new Date();
    if (question.includes("time")) {
        return `The current time is ${now.toLocaleTimeString()}.`;
    } else if (question.includes("date")) {
        return `Today's date is ${now.toLocaleDateString()}.`;
    } else if (question.includes("year")) {
        return `The current year is ${now.getFullYear()}.`;
    } else {
        return `It's ${now.toLocaleString()}.`;
    }
}

function openWebsite(site) {
    const urls = {
        "youtube": "https://www.youtube.com",
        "google": "https://www.google.com",
        "facebook": "https://www.facebook.com",
        "twitter": "https://www.twitter.com",
        "instagram": "https://www.instagram.com",
        "vs code": "https://vscode.dev/",
        "visual studio code": "https://vscode.dev/",
        "chrome": "https://www.google.com",
        "firefox": "https://www.mozilla.org/firefox/new/",
        "notepad": "https://notepad.js.org/"
    };

    let url;
    if (urls[site]) {
        url = urls[site];
    } else if (site.includes('.')) {
        // If the site contains a dot, assume it's a full domain
        url = site.startsWith('http') ? site : `https://${site}`;
    } else {
        // For everything else, add .com and prepend https://
        url = `https://www.${site}.com`;
    }

    window.open(url, '_blank');
    return `Opening ${site}...`;
}

function openCalculator() {
    window.open('https://www.google.com/search?q=calculator', '_blank');
    return "Opening a web-based calculator...";
}



function searchWeb(query) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank');
    return `Searching for "${query}"...`;
}


btn.addEventListener('click', () => {
    content.style.display = 'block'; // Changed to 'block' for better compatibility
    content.textContent = "Listening...";
    voiceGif.style.display = 'inline';
    
    if (recognition) {
        recognition.start();
    } else {
        content.textContent = "Speech recognition not supported.";
        voiceGif.style.display = 'none';
    }
});

recognition.onresult = async (event) => {
    const question = event.results[0][0].transcript;
    content.textContent = `You said: ${question}`;
    
    let answer = getAnswer(question);
    content.textContent = answer;
    try {
        await speak(answer);
    } catch (error) {
        console.error('Speech synthesis error:', error);
    }

    voiceGif.style.display = 'none';
};

recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    content.style.display = 'block'; // Changed to 'block' for better compatibility
    content.textContent = "Error occurred in speech recognition.";
    voiceGif.style.display = 'none';
};

recognition.onend = () => {
    btn.disabled = false;
};

