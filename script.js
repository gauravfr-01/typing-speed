const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Never underestimate the power of a good book.",
    "The sun always shines brightest.",
    "Love what you do.",
    "Practice makes perfect when learning new skills.",
    "The ocean's waves crash gently on the sandy shore.",
    "Learning to code can open up many new opportunities.",
    "Always remember to stay curious and keep exploring.",
    "The stars twinkle brightly in the night sky.",
    "Kindness is a language that everyone understands."
];

const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const resultsPanel = document.getElementById('results-panel');
const wpmDisplay = document.getElementById('wpm-display');
const accuracyDisplay = document.getElementById('accuracy-display');

let currentText = '';
let typedText = '';
let timer = 0;
let timerInterval = null;
let isStarted = false;
let isFinished = false;
let correctChars = 0;
let incorrectChars = 0;

document.addEventListener('DOMContentLoaded', () => {
    resetGame();
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
    typingInput.addEventListener('input', handleInputChange);
});

function startGame() {
    if (isStarted && !isFinished) return;

    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    currentText = sampleTexts[randomIndex];

    typedText = '';
    timer = 0;
    correctChars = 0;
    incorrectChars = 0;
    isStarted = true;
    isFinished = false;

    clearInterval(timerInterval);
    timerInterval = null;

    typingInput.value = '';
    typingInput.disabled = false;
    typingInput.focus();
    typingInput.placeholder = "Start typing here...";
    typingInput.classList.add('typing-input-active');

    timerDisplay.textContent = `Time: ${timer}s`;
    resultsPanel.classList.add('hidden');

    renderText();

    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Time: ${timer}s`;
    }, 1000);
}

function resetGame() {
    clearInterval(timerInterval);
    timerInterval = null;

    currentText = sampleTexts[0];
    typedText = '';
    timer = 0;
    correctChars = 0;
    incorrectChars = 0;
    isStarted = false;
    isFinished = false;

    typingInput.value = '';
    typingInput.disabled = true;
    typingInput.placeholder = "Click Start to begin!";
    typingInput.classList.remove('typing-input-active');

    timerDisplay.textContent = `Time: ${timer}s`;
    resultsPanel.classList.add('hidden');
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '0%';

    renderText();
}

function handleInputChange(event) {
    if (!isStarted || isFinished) {
        typingInput.disabled = true;
        return;
    }

    typedText = event.target.value;

    correctChars = 0;
    incorrectChars = 0;

    for (let i = 0; i < currentText.length; i++) {
        if (i >= typedText.length) {
        } else if (typedText[i] === currentText[i]) {
            correctChars++;
        } else {
            incorrectChars++;
        }
    }

    if (typedText.length > currentText.length) {
        incorrectChars += (typedText.length - currentText.length);
    }

    renderText();

    if (typedText.length >= currentText.length && typedText.substring(0, currentText.length) === currentText) {
        finishGame();
    }
}

function finishGame() {
    isFinished = true;
    clearInterval(timerInterval);
    typingInput.disabled = true;

    calculateResults();
    resultsPanel.classList.remove('hidden');
    resultsPanel.classList.add('animate-fade-in');
}

function calculateResults() {
    const elapsedTimeInMinutes = timer / 60;

    const calculatedWPM = elapsedTimeInMinutes > 0 ? Math.round((correctChars / 5) / elapsedTimeInMinutes) : 0;
    wpmDisplay.textContent = calculatedWPM;

    const totalTyped = typedText.length;
    const calculatedAccuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0;
    accuracyDisplay.textContent = `${calculatedAccuracy}%`;
}

function renderText() {
    const chars = currentText.split('');
    let textHtml = '';

    for (let i = 0; i < chars.length; i++) {
        let char = chars[i];
        let charClass = '';

        if (i < typedText.length) {
            if (typedText[i] === char) {
                charClass = 'text-green-600';
            } else {
                charClass = 'text-red-600';
            }
        }
        textHtml += `<span class="${charClass}">${char}</span>`;
    }

    textDisplay.innerHTML = textHtml;
}
