// ========================================
// CONFIGURAÇÕES DO JOGO
// ========================================

const GAME_CONFIG = {
    tempoInicial: 15,
    tempoMinimo: 5,
    acertosParaSubirNivel: 3,
    pontosBase: 10
};


// ========================================
// ESTADO DO JOGO
// ========================================

let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

let streak = 0;
let maxStreak = 0;

let level = 1;
let questionNumber = 0;

let currentAnswer = 0;

let timer = null;
let timeLeft = GAME_CONFIG.tempoInicial;

let acceptingAnswer = false;


// ========================================
// ELEMENTOS HTML
// ========================================

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");

const answerForm = document.getElementById("answer-form");
const answerInput = document.getElementById("answer");

const questionElement = document.getElementById("question");
const feedbackElement = document.getElementById("feedback");

const scoreElement = document.getElementById("score");
const streakElement = document.getElementById("streak");
const levelElement = document.getElementById("level");

const timerElement = document.getElementById("timer");
const timerProgress = document.getElementById("timer-progress");

const questionNumberElement = document.getElementById("question-number");

const correctElement = document.getElementById("correct");
const wrongElement = document.getElementById("wrong");

const difficultyText = document.getElementById("difficulty-text");

const finalScoreElement = document.getElementById("final-score");
const finalCorrectElement = document.getElementById("final-correct");
const finalStreakElement = document.getElementById("final-streak");
const finalLevelElement = document.getElementById("final-level");
const resultMessage = document.getElementById("result-message");


// ========================================
// INICIAR JOGO
// ========================================

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);

function startGame() {

    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;

    streak = 0;
    maxStreak = 0;

    level = 1;
    questionNumber = 0;

    clearInterval(timer);

    updateInterface();

    showScreen(gameScreen);

    generateQuestion();
}


// ========================================
// TROCAR TELA
// ========================================

function showScreen(screen) {

    document.querySelectorAll(".screen").forEach((item) => {
        item.classList.remove("active");
    });

    screen.classList.add("active");
}


// ========================================
// GERAR QUESTÃO
// ========================================

function generateQuestion() {

    clearInterval(timer);

    acceptingAnswer = true;

    questionNumber++;

    feedbackElement.textContent = "";
    feedbackElement.className = "feedback";

    answerInput.value = "";
    answerInput.disabled = false;

    answerInput.focus();

    const question = createMathQuestion(level);

    currentAnswer = question.answer;

    questionElement.textContent = question.text;

    difficultyText.textContent =
        `Nível ${level} - ${getDifficultyName(level)}`;

    startTimer();

    updateInterface();
}


// ========================================
// CRIAR CONTA
// ========================================

function createMathQuestion(currentLevel) {

    /*
        Conforme o nível aumenta:

        Nível 1:
        - Adição
        - Subtração simples

        Nível 2:
        - Adição e subtração maiores
        - Multiplicação

        Nível 3:
        - Multiplicação
        - Divisão

        Nível 4:
        - Operações maiores

        Nível 5+:
        - Desafios mistos
    */

    let operation;

    if (currentLevel === 1) {

        operation = randomItem([
            "addition",
            "subtraction"
        ]);

    } else if (currentLevel === 2) {

        operation = randomItem([
            "addition",
            "subtraction",
            "multiplication"
        ]);

    } else if (currentLevel === 3) {

        operation = randomItem([
            "multiplication",
            "division",
            "addition",
            "subtraction"
        ]);

    } else {

        operation = randomItem([
            "addition",
            "subtraction",
            "multiplication",
            "division"
        ]);
    }


    // -------------------------------
    // ADIÇÃO
    // -------------------------------

    if (operation === "addition") {

        const max = 20 + currentLevel * 20;

        const a = randomInt(1, max);
        const b = randomInt(1, max);

        return {
            text: `${a} + ${b} = ?`,
            answer: a + b
        };
    }


    // -------------------------------
    // SUBTRAÇÃO
    // -------------------------------

    if (operation === "subtraction") {

        const max = 20 + currentLevel * 25;

        let a = randomInt(1, max);
        let b = randomInt(1, max);

        // Evita resultado negativo nos níveis iniciais
        if (b > a) {
            [a, b] = [b, a];
        }

        return {
            text: `${a} − ${b} = ?`,
            answer: a - b
        };
    }


    // -------------------------------
    // MULTIPLICAÇÃO
    // -------------------------------

    if (operation === "multiplication") {

        let maxA;
        let maxB;

        if (currentLevel <= 2) {

            maxA = 10;
            maxB = 10;

        } else if (currentLevel <= 4) {

            maxA = 15;
            maxB = 12;

        } else {

            maxA = 25;
            maxB = 15;
        }

        const a = randomInt(2, maxA);
        const b = randomInt(2, maxB);

        return {
            text: `${a} × ${b} = ?`,
            answer: a * b
        };
    }


    // -------------------------------
    // DIVISÃO
    // -------------------------------

    if (operation === "division") {

        const divisor = randomInt(
            2,
            Math.min(12, 5 + currentLevel)
        );

        const result = randomInt(
            2,
            10 + currentLevel * 3
        );

        const dividend = divisor * result;

        return {
            text: `${dividend} ÷ ${divisor} = ?`,
            answer: result
        };
    }
}


// ========================================
// TIMER
// ========================================

function startTimer() {

    timeLeft = calculateTime();

    updateTimer();

    timer = setInterval(() => {

        timeLeft--;

        updateTimer();

        if (timeLeft <= 0) {

            clearInterval(timer);

            timeExpired();
        }

    }, 1000);
}


function calculateTime() {

    /*
        O jogo fica um pouco mais rápido
        conforme o nível aumenta.
    */

    const calculatedTime =
        GAME_CONFIG.tempoInicial - (level - 1);

    return Math.max(
        GAME_CONFIG.tempoMinimo,
        calculatedTime
    );
}


function updateTimer() {

    timerElement.textContent = timeLeft;

    const totalTime = calculateTime();

    const percentage =
        (timeLeft / totalTime) * 100;

    timerProgress.style.width =
        `${percentage}%`;


    // Muda a cor quando o tempo está acabando

    if (percentage <= 30) {

        timerProgress.style.background =
            "#ef4444";

        timerElement.style.color =
            "#f87171";

    } else if (percentage <= 60) {

        timerProgress.style.background =
            "#eab308";

        timerElement.style.color =
            "#facc15";

    } else {

        timerProgress.style.background =
            "#22c55e";

        timerElement.style.color =
            "#4ade80";
    }
}


// ========================================
// TEMPO ESGOTADO
// ========================================

function timeExpired() {

    if (!acceptingAnswer) {
        return;
    }

    acceptingAnswer = false;

    wrongAnswers++;

    streak = 0;

    answerInput.disabled = true;

    feedbackElement.textContent =
        `⏰ Tempo esgotado! A resposta era ${currentAnswer}.`;

    feedbackElement.className =
        "feedback wrong";

    updateInterface();

    setTimeout(() => {

        generateQuestion();

    }, 1800);
}


// ========================================
// RESPONDER
// ========================================

answerForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!acceptingAnswer) {
        return;
    }

    const userAnswer =
        Number(answerInput.value);

    if (
        answerInput.value.trim() === "" ||
        Number.isNaN(userAnswer)
    ) {
        return;
    }

    checkAnswer(userAnswer);
});


// ========================================
// VERIFICAR RESPOSTA
// ========================================

function checkAnswer(userAnswer) {

    acceptingAnswer = false;

    clearInterval(timer);

    answerInput.disabled = true;

    if (userAnswer === currentAnswer) {

        handleCorrectAnswer();

    } else {

        handleWrongAnswer(userAnswer);
    }
}


// ========================================
// RESPOSTA CORRETA
// ========================================

function handleCorrectAnswer() {

    correctAnswers++;

    streak++;

    if (streak > maxStreak) {
        maxStreak = streak;
    }


    /*
        A pontuação aumenta conforme
        o nível e a sequência.
    */

    const points =
        GAME_CONFIG.pontosBase +
        level * 5 +
        Math.min(streak * 2, 20);

    score += points;


    feedbackElement.textContent =
        `🎉 Correto! +${points} pontos`;

    feedbackElement.className =
        "feedback correct";


    /*
        A cada 3 acertos consecutivos,
        sobe um nível.
    */

    if (
        correctAnswers % GAME_CONFIG.acertosParaSubirNivel === 0
    ) {

        level++;

        feedbackElement.textContent +=
            ` 🚀 Você chegou ao nível ${level}!`;
    }

    updateInterface();


    setTimeout(() => {

        generateQuestion();

    }, 1500);
}


// ========================================
// RESPOSTA ERRADA
// ========================================

function handleWrongAnswer(userAnswer) {

    wrongAnswers++;

    streak = 0;

    /*
        Perde alguns pontos, mas nunca
        fica abaixo de zero.
    */

    score = Math.max(0, score - 5);

    feedbackElement.textContent =
        `❌ Quase! Você respondeu ${userAnswer}. A resposta correta era ${currentAnswer}.`;

    feedbackElement.className =
        "feedback wrong";

    updateInterface();


    setTimeout(() => {

        generateQuestion();

    }, 2000);
}


// ========================================
// ATUALIZAR INTERFACE
// ========================================

function updateInterface() {

    scoreElement.textContent = score;

    streakElement.textContent = streak;

    levelElement.textContent = level;

    correctElement.textContent = correctAnswers;

    wrongElement.textContent = wrongAnswers;

    questionNumberElement.textContent =
        questionNumber;
}


// ========================================
// FINALIZAR JOGO
// ========================================

function endGame() {

    clearInterval(timer);

    acceptingAnswer = false;

    finalScoreElement.textContent = score;

    finalCorrectElement.textContent =
        correctAnswers;

    finalStreakElement.textContent =
        maxStreak;

    finalLevelElement.textContent =
        level;


    if (score >= 200) {

        resultMessage.textContent =
            "🏆 Excelente! Você é um mestre da matemática!";

    } else if (score >= 100) {

        resultMessage.textContent =
            "🌟 Muito bem! Você está mandando muito bem!";

    } else if (score >= 50) {

        resultMessage.textContent =
            "👏 Bom trabalho! Continue praticando!";

    } else {

        resultMessage.textContent =
            "💪 Continue tentando! A prática leva à perfeição!";
    }

    showScreen(endScreen);
}


// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function randomInt(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


function randomItem(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}


function getDifficultyName(currentLevel) {

    if (currentLevel === 1) {
        return "Fácil";
    }

    if (currentLevel === 2) {
        return "Básico";
    }

    if (currentLevel === 3) {
        return "Intermediário";
    }

    if (currentLevel === 4) {
        return "Difícil";
    }

    if (currentLevel === 5) {
        return "Muito difícil";
    }

    return "Desafio!";
}

