const quizContainer = document.getElementById('quiz-container');

const datas = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: "Mars"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: "Pacific Ocean"
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"],
        answer: "Harper Lee"
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Fe", "Pb"],
        answer: "Au"
    }
];

// const loadQuestions = () => {
// datas.forEach((data, index) => {
//     const questionContainer = document.createElement('div'); // Create a container for each question
//     questionContainer.classList.add('question-container'); // Add a class for styling
//     const question = document.createElement('p'); // Create a paragraph for the question
//     question.textContent = `${index + 1}. ${data.question}`; // Set the question text
//     questionContainer.appendChild(question); // Append the question to the container

//     data.options.forEach(option => {
//         const optionLabel = document.createElement('label'); // Create a label for each option
//         const optionInput = document.createElement('input'); // Create a radio input for each option
//         optionInput.type = 'radio'; // Set the input type to radio
//         optionInput.name = `question${index + 1}`; // Group options by question
//         optionInput.value = option; // Set the value of the input
//         optionLabel.appendChild(optionInput); // Append the input to the label
//         optionLabel.appendChild(document.createTextNode(option)); // Append the option text to the label
//         questionContainer.appendChild(optionLabel); // Append the label to the question container
//         questionContainer.appendChild(document.createElement('br')); // Add a line break for better spacing
//     })
//     quizContainer.appendChild(questionContainer); // Append the question container to the main quiz container
// })
// }



// Global array to store user answers
const answers = []; // Changed to a global array outside the functions
let track = 0; // To keep track of the current question index

// Function to load and display the current question
const loadQuestions = () => {
    // 1. Generate the HTML for all questions (to easily access it)
    const contentArray = datas.map((data, index) => {
        // Use a consistent name for the radio group based on the question index
        const questionName = `question${index}`;
        return `<div class="question-container">
            <p>${index + 1}. ${data.question}</p>
            ${data.options.map(option => `
                <label>
                    <input type="radio" name="${questionName}" value="${option}" class="option-input" data-question-index="${index}">
                    ${option}
                </label><br>
            `).join('')}
        </div>`
    });

    // 2. Display only the current question's HTML
    quizContainer.innerHTML = contentArray[track];

    // 3. IMMEDIATELY check/restore the saved answer for the question we just loaded
    restoreAnswer();
}



// Function to save the user's answer when navigating away
const saveAnswer = () => {
    // Get all radio inputs currently displayed in the quizContainer
    const currentOptionInputs = quizContainer.querySelectorAll('input[type="radio"]');
    
    // Find the checked option for the current question
    let selectedAnswer = null;
    currentOptionInputs.forEach(input => {
        if (input.checked) {
            selectedAnswer = input.value;
        
        }
    });
    console.log(selectedAnswer);
    
    // Save the answer in the global 'answers' array at the current track index
    if (selectedAnswer !== null) {
        // Save the actual question index (track) and the selected answer text
        answers[track] = { questionIndex: track, answer: selectedAnswer };
    } else {
        return; // No answer selected, do not save anything
    }
}

// Function to restore the user's answer when navigating to a question
const restoreAnswer = () => {
    // Check if an answer exists for the current question index (track)
    if (answers[track] && answers[track].answer) {
        const savedAnswerValue = answers[track].answer;
        
        // Find all radio buttons currently on the screen
        const currentOptionInputs = quizContainer.querySelectorAll('input[type="radio"]');

        // Loop through inputs and check the one matching the saved value
        currentOptionInputs.forEach(input => {
            if (input.value === savedAnswerValue) {
                input.checked = true;
            } else {
                // Ensure other options are unchecked (though the browser handles this, it's safer)
                input.checked = false; 
            }
        });
    }
}

// Button references (keep as is)
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const submitButton = document.getElementById('submit-button');
const resetButton = document.getElementById('reset-button');

// buttons functionality
const nextQuestion = () => {
    // 1. SAVE the answer for the question we are leaving (the current 'track')
    saveAnswer(); 

    if (track < datas.length - 1) {
        track++;
        // 2. LOAD the next question, which will also RESTORE its saved answer
        loadQuestions();
    }
}

const prevQuestion = () => {
    // 1. SAVE the answer for the question we are leaving (the current 'track')
    saveAnswer(); 
    
    if (track > 0) {
        track--;
        // 2. LOAD the previous question, which will also RESTORE its saved answer
        loadQuestions();
    }
}

const resultDiv = document.querySelector('.result');
const submitQuiz = () => {
    // IMPORTANT: Save the answer for the current/last visible question before logging
    saveAnswer(); 
   
    // You would add your marking/displaying results logic here
    let score = 0;
    answers.forEach(answerObj =>{
        const questionData = datas[answerObj.questionIndex];
        if (questionData && questionData.answer === answerObj.answer) {
            score += 10; // Assuming each question is worth 10 points
        }
    })
    resultDiv.innerHTML = `<h3>Your score is: ${score} out of ${datas.length * 10}</h3>`;
    // alert(`Your score is: ${score} out of ${datas.length * 10}`);
}

const restartQuiz = () => {
    // Clear answers, reset track, and load the first question
    answers.length = 0; // Clears the array effectively
    track = 0;
    loadQuestions();
}

// Event listeners
nextButton.addEventListener('click', nextQuestion);
prevButton.addEventListener('click', prevQuestion);
submitButton.addEventListener('click', submitQuiz);
resetButton.addEventListener('click', restartQuiz);

// Initial load
loadQuestions();

// quizContainer.addEventListener('click', saveOptions);

