// Cache DOM elements for easy access and manipulation
const homePage = document.getElementById("home-page");
const quizApp = document.getElementById("quiz-app");
const questionElement = document.getElementById("question");
const questionContainer = document.querySelector(".question-container");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const startQuizBtn = document.getElementById("start-quiz-btn");
const saveQuestionsBtn = document.getElementById("save-questions-btn");
const uploadQuestionsBtn = document.getElementById("upload-questions-btn");
const uploadQuestionsInput = document.getElementById("upload-questions-input");

// Initialize an empty array to store questions
let questions = [];
let currentQuestionIndex = 0; // Index of the current question
let score = 0; // User's score

// Cache form elements used for adding questions
const questionForm = document.getElementById("question-form");
const questionInput = document.getElementById("question-input");
const answer1Input = document.getElementById("answer1-input");
const answer2Input = document.getElementById("answer2-input");
const answer3Input = document.getElementById("answer3-input");
const answer4Input = document.getElementById("answer4-input");
const correctAnswerSelect = document.getElementById("correct-answer");

// Modify to handle images in the form
questionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const questionText = questionInput.value;

    // Process question image
    const questionImageFile = document.getElementById("question-image-input").files[0];
    let questionImageURL = "";
    if (questionImageFile) {
        questionImageURL = URL.createObjectURL(questionImageFile);
    }

    const answers = [
        {
            text: answer1Input.value,
            image: document.getElementById("answer1-image-input").files[0] ? URL.createObjectURL(document.getElementById("answer1-image-input").files[0]) : "",
            correct: correctAnswerSelect.value == "0"
        },
        {
            text: answer2Input.value,
            image: document.getElementById("answer2-image-input").files[0] ? URL.createObjectURL(document.getElementById("answer2-image-input").files[0]) : "",
            correct: correctAnswerSelect.value == "1"
        },
        {
            text: answer3Input.value,
            image: document.getElementById("answer3-image-input").files[0] ? URL.createObjectURL(document.getElementById("answer3-image-input").files[0]) : "",
            correct: correctAnswerSelect.value == "2"
        },
        {
            text: answer4Input.value,
            image: document.getElementById("answer4-image-input").files[0] ? URL.createObjectURL(document.getElementById("answer4-image-input").files[0]) : "",
            correct: correctAnswerSelect.value == "3"
        }
    ];

    // Add the new question (including images) to the questions array
    questions.push({ question: questionText, image: questionImageURL, answers: answers });

    // Clear form fields
    questionInput.value = "";
    document.getElementById("question-image-input").value = "";
    answer1Input.value = "";
    document.getElementById("answer1-image-input").value = "";
    answer2Input.value = "";
    document.getElementById("answer2-image-input").value = "";
    answer3Input.value = "";
    document.getElementById("answer3-image-input").value = "";
    answer4Input.value = "";
    document.getElementById("answer4-image-input").value = "";
    correctAnswerSelect.value = "0";
});

// Start the quiz when the "Start Quiz" button is clicked
startQuizBtn.addEventListener("click", () => {
    if (questions.length > 0) {
        homePage.style.display = "none"; // Hide the home page
        quizApp.style.display = "block"; // Show the quiz application
        startQuiz();
    } else {
        alert("Please add at least one question!"); // Alert if no questions are added
    }
});

// Initialize quiz settings and display the first question
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

// Display question and answers including images
function showQuestion() {
    resetState();

    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    
    // Set the question text
    questionContainer.innerHTML = `<h2>${questionNo}. ${currentQuestion.question}</h2>`;

    // Display question image if available
    if (currentQuestion.image) {
        const questionImageElement = document.createElement("img");
        questionImageElement.src = currentQuestion.image;
        questionImageElement.alt = "Question Image";
        questionImageElement.style.maxWidth = "200px"; // Adjust size as needed
        questionContainer.appendChild(questionImageElement);
    }

    // Create buttons for each answer option
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.classList.add("answer-container");

        // Create a span element for the answer text
        const answerText = document.createElement("span");
        answerText.innerHTML = answer.text;
        button.appendChild(answerText);

        // Add answer image if available
        if (answer.image) {
            const answerImageElement = document.createElement("img");
            answerImageElement.src = answer.image;
            answerImageElement.alt = "Answer Image";
            answerImageElement.style.maxWidth = "100px"; // Adjust size as needed
            answerImageElement.style.marginLeft = "10px"; // Add spacing between text and image
            answerImageElement.style.display = "block";
            button.appendChild(answerImageElement);
        }

        // Attach event listener for selecting answers
        button.addEventListener("click", selectAnswer);

        // Attach data if the answer is correct
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }

        answerButtons.appendChild(button);
    });
}

// Reset the state of the question and answer buttons
function resetState() {
    nextButton.style.display = "none"; // Hide the "Next" button
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild); // Clear answer buttons
    }
}

// Handle the selection of an answer
function selectAnswer(e) {
    const selectedBtn = e.target.closest("button"); // Get the clicked button
    const isCorrect = selectedBtn.dataset.correct === "true";

    // Update button styling based on correctness
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    // Disable other answer buttons and highlight the correct one
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        } else {
            button.disabled = true;
        }
    });

    nextButton.style.display = "block"; // Show the "Next" button
}

// Display the final score and offer to play again
function showScore() {
    resetState();
    questionContainer.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play again!";
    nextButton.style.display = "block";
}

// Handle the "Next" button click to advance through questions or restart the quiz
function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

// Add event listener for the "Next" button
nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz(); // Restart the quiz after displaying the score
    }
});

// Save questions to a JSON file
saveQuestionsBtn.addEventListener("click", () => {
    if (questions.length > 0) {
        const questionsBlob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(questionsBlob);
        downloadLink.download = "questions.json";
        downloadLink.click();
    } else {
        alert("No questions to save!"); // Alert if there are no questions to save
    }
});

// Trigger the file input to upload questions
uploadQuestionsBtn.addEventListener("click", () => {
    uploadQuestionsInput.click();
});

// Load questions from a selected JSON file
uploadQuestionsInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const loadedQuestions = JSON.parse(e.target.result);
                if (Array.isArray(loadedQuestions) && loadedQuestions.length > 0) {
                    questions = loadedQuestions;
                    alert("Questions loaded successfully!"); // Confirm successful loading
                } else {
                    alert("Invalid file format!"); // Alert for invalid file format
                }
            } catch (error) {
                alert("Error reading file. Make sure it's a valid JSON file."); // Alert for errors
            }
        };
        reader.readAsText(file); // Read the file as text
    }
});

// Initialize the quiz on page load
startQuiz();
