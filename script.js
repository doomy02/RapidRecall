const homePage = document.getElementById("home-page");
const quizApp = document.getElementById("quiz-app");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const startQuizBtn = document.getElementById("start-quiz-btn");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Home page form elements
const questionForm = document.getElementById("question-form");
const questionInput = document.getElementById("question-input");
const answer1Input = document.getElementById("answer1-input");
const answer2Input = document.getElementById("answer2-input");
const answer3Input = document.getElementById("answer3-input");
const answer4Input = document.getElementById("answer4-input");
const correctAnswerSelect = document.getElementById("correct-answer");

questionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Get question and answers from the form
    const questionText = questionInput.value;
    const answers = [
        { text: answer1Input.value, correct: correctAnswerSelect.value == "0" },
        { text: answer2Input.value, correct: correctAnswerSelect.value == "1" },
        { text: answer3Input.value, correct: correctAnswerSelect.value == "2" },
        { text: answer4Input.value, correct: correctAnswerSelect.value == "3" }
    ];

    // Add question to the questions array
    questions.push({ question: questionText, answers: answers });
    
    // Clear form
    questionInput.value = "";
    answer1Input.value = "";
    answer2Input.value = "";
    answer3Input.value = "";
    answer4Input.value = "";
    correctAnswerSelect.value = "0";
});

startQuizBtn.addEventListener("click", () => {
    if (questions.length > 0) {
        homePage.style.display = "none";
        quizApp.style.display = "block";
        startQuiz();
    } else {
        alert("Please add at least one question!");
    }
});

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();

    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);

        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }

        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        } else {
            button.disabled = true;
        }
    });

    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play again!";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();
