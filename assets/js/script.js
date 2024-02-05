/* jshint esversion: 6 */
let chancesRemaining;
const initialChances = 3;
const nextWordButton = document.getElementById('next-word-button');
const changeButton = document.getElementById('change-category-button');
const backToWelcomeButton = document.getElementById('back-to-welcome-button');
const currentCategory = localStorage.getItem('category');
const hintElement = document.getElementById('hint-text');
const selectedWord = localStorage.getItem('selectedWord');
const hint = localStorage.getItem('hint');
const wordContainer = document.getElementById('word');
const gameBoardContainer = document.getElementById('game-board');
const gameBoardButtons = document.querySelectorAll('#game-board button');
const chancesElement = document.getElementById('chances-text');
const wordsByCategory = {
    colors: ['RED', 'BLUE', 'YELLOW', 'GREEN', 'PINK'],
    shapes: ['CIRCLE', 'SQUARE', 'TRIANGLE', 'STAR', 'HEART'],
    fruits: ['APPLE', 'BANANA', 'ORANGE', 'STRAWBERRY', 'WATERMELON'],
    vegetables: ['CARROT', 'BROCCOLI', 'TOMATO', 'CUCUMBER', 'SPINACH'],
    numbers: ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'],
    weather: ['SUNNY', 'RAINY', 'CLOUDY', 'WINDY', 'SNOWY'],
};
const hintsByCategory = {
    colors: {
        RED: 'Color of the apple fruit',
        BLUE: 'Sky color',
        YELLOW: 'Color of the sun',
        GREEN: 'Color of grass',
        PINK: 'Color of cherry blossoms',
    },
    shapes: {
        CIRCLE: 'Round shape',
        SQUARE: 'Four equal sides',
        TRIANGLE: 'Three sides',
        STAR: 'Shiny and bright in the sky',
        HEART: 'Symbol of love',
    },
    fruits: {
        APPLE: 'Common fruit in many varieties',
        BANANA: 'Yellow, peelable fruit',
        ORANGE: 'Citrus fruit with a tough peel',
        STRAWBERRY: 'Small red, juicy fruit',
        WATERMELON: 'Large, green fruit with red interior',
    },
    vegetables: {
        CARROT: 'Orange root vegetable',
        BROCCOLI: 'Green vegetable with compact clusters',
        TOMATO: 'Red, juicy vegetable often mistaken for a fruit',
        CUCUMBER: 'Long, green, and refreshing vegetable',
        SPINACH: 'Leafy green vegetable rich in iron',
    },
    numbers: {
        ONE: 'The loneliest number',
        TWO: 'A pair or a couple',
        THREE: 'The number of sides in a triangle',
        FOUR: 'A square has this many sides',
        FIVE: 'A high-five involves this many fingers',
    },
    weather: {
        SUNNY: 'Clear sky with abundant sunlight',
        RAINY: 'Wet weather with precipitation',
        CLOUDY: 'Sky covered with clouds',
        WINDY: 'Strong air movement',
        SNOWY: 'Falling snowflakes covering the ground',
    },
};

const audio = document.getElementById('myAudio');
const toggleButton = document.getElementById('toggleButton');
const playPauseIcon = document.getElementById('playPauseIcon');

//Redirects the user to the category page while resetting the word index in local storage.
function redirectToCategoryPage() {
    localStorage.setItem(`${currentCategory}_wordIndex`, 0);
    window.location.href = 'category.html';
}
//Redirects the user to the welcome page while resetting the word index in local storage.
function redirectToWelcomePage() {
    localStorage.setItem(`${currentCategory}_wordIndex`, 0);
    window.location.href = 'index.html';
}
//Initiates the guessing game by setting up initial game data in local storage and redirecting to the game page.
function startGuessGame(category) {
    const selectedWord = getWord(category);
    const hint = getHintForWord(category, selectedWord);

    localStorage.setItem('category', category);
    localStorage.setItem('selectedWord', selectedWord);
    localStorage.setItem('hint', hint);
    localStorage.setItem('chancesRemaining', initialChances);

    chancesRemaining = initialChances;
    window.location.href = 'guess-game.html';
}
// Retrieves a word from the specified category, updating the word index in local storage.
function getWord(category) {
    if (category && wordsByCategory.hasOwnProperty(category)) {
        const words = wordsByCategory[category];

        if (words && words.length > 0) {
            let wordIndex = parseInt(localStorage.getItem(`${category}_wordIndex`) || 0);
        
            if (wordIndex < words.length) {

                const selectedWord = words[wordIndex];
                localStorage.setItem(`${category}_wordIndex`, wordIndex + 1);
        
                return selectedWord;
            } else {
                console.log('No more words in the category.');
                return null;
            }
        } else {
            console.error('Category has no words.');
        }

    return null;
}
}
//Retrieves a hint for the given word in the specified category.
function getHintForWord(category, word) {
    
    return hintsByCategory[category][word] || 'No hint available';
}
//Displays the provided hint in the hint element on the game page.
function displayHint(hint) {
   
    if (hintElement) {
        hintElement.textContent = hint;
    }
}
// Initializes the game by retrieving initial data from local storage and setting up the user interface.
function initializeGuessGame() {
    chancesRemaining = parseInt(localStorage.getItem('chancesRemaining')) || 3;
    if (nextWordButton) {
        nextWordButton.disabled = true;
    }

    displayHint(hint);
    setupUI(selectedWord);
    displayChances(); 
}
//Sets up the game interface by displaying the selected word and initializing the game board.
function setupUI(selectedWord) {
    displayWord(selectedWord);
    console.log('Setting up the game interface...');
    setupGameBoard();
    displayChances();
}
//Displays the selected word on the game page with dashes for each letter.
function displayWord(selectedWord) {
    
    if (wordContainer) {
        const wordArray = selectedWord.split('');
        const wordDashes = wordArray.map(letter => (letter === ' ' ? ' ' : '-')).join(' ');

        wordContainer.textContent = wordDashes;
    }
}
// Sets up the game board by creating letter buttons for user interaction.
function setupGameBoard() {
    if (gameBoardContainer) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const alphabetArray = alphabet.split('');

        alphabetArray.forEach(letter => {
            const letterButton = document.createElement('button');
            letterButton.textContent = letter;
            letterButton.addEventListener('click', () => {
                handleLetterClick(letter);
            });
            gameBoardContainer.appendChild(letterButton);
        });
    }
}
// Handles the click event for a letter button, updating the display and game board accordingly.
function handleLetterClick(selectedLetter) {
    const gameBoardButtons = document.querySelectorAll('#game-board button');
    gameBoardButtons.forEach(button => {
        if (button.textContent === selectedLetter) {
            button.disabled = true;
            button.classList.add('disabled');
        }
    });
    updateWordDisplay(selectedWord, selectedLetter);
}
//Updates the displayed word based on the correctness of the guessed letter.
function updateWordDisplay(selectedWord, selectedLetter) {  
    if (wordContainer) {
        const wordArray = selectedWord.split('');
        let updatedWord = wordContainer.textContent.split(' ');

        let isLetterCorrect = false;

        for (let i = 0; i < wordArray.length; i++) {
            if (wordArray[i] === selectedLetter) {
                updatedWord[i] = selectedLetter;
                isLetterCorrect = true;
            }
        }
        const displayWord = updatedWord.join(' ');
        wordContainer.textContent = displayWord;

        if (!displayWord.includes('-')) {
           
            const gameBoardButtons = document.querySelectorAll('#game-board button');
            gameBoardButtons.forEach(button => {
                button.disabled = true;
            });

            if (nextWordButton) {
                nextWordButton.disabled = false;
            }
           
            //https://sweetalert2.github.io/
            Swal.fire({
                icon: 'success',
                title: 'Fantastic!',
                text: 'You did it! You guessed the word! Great job, little word detective! Move on to the next word and let the adventure continue!',
                timer: 5000,
                showCloseButton: true,
                showConfirmButton: false,
            });
        }
        
        if (!isLetterCorrect) {
             //https://sweetalert2.github.io/
             Swal.fire({
                icon: 'warning',
                title: 'Oops, Not Quite Right!',
                text: 'That letter doesn’t fit, but no worries! Try another one. You’re doing great!',
                timer: 5000,
                showCloseButton: true,
                showConfirmButton: false, 
            });
            
            chancesRemaining--;
            displayChances();

            if (chancesRemaining === 0) {
                
                const secretWord = localStorage.getItem('selectedWord');
            //https://sweetalert2.github.io/
                Swal.fire({
                    icon: 'error',
                    title: 'Oops, You Lose!',
                    text: `Don't worry, you'll get it next time! The word was: ${secretWord}. Keep trying and have fun!`,
                    confirmButtonText: 'OK'
                }).then(() => {
                   
                   window.location.href = 'index.html';
                });
            }
        }
    }
 
}
//Displays the remaining chances (hearts) on the game page.
function displayChances() {
    if (chancesElement) {
        chancesElement.innerHTML = `<i class="fa-solid fa-heart custom-heart"></i> ${chancesRemaining}`;
    }
}
//Checks if there are more words available in the specified category for the user to guess.
function areMoreWordsAvailable(category) {

    if (wordsByCategory.hasOwnProperty(category)) {
        const wordIndex = parseInt(localStorage.getItem(`${category}_wordIndex`) || 0);
        return wordIndex < wordsByCategory[category].length;
    }
}
//Prepares the game by adding event listeners to buttons and setting up the audio toggle functionality.
function prepGame() {

    if (changeButton) {
        changeButton.addEventListener('click', function () {
            redirectToCategoryPage();
        });
    }

    
    if (backToWelcomeButton) {
        backToWelcomeButton.addEventListener('click', function () {
            redirectToWelcomePage();
        });
    }
      

    if (nextWordButton) {
        nextWordButton.addEventListener('click', function () {
            const currentCategory = localStorage.getItem('category');
            
            if (areMoreWordsAvailable(currentCategory)) {
                startGuessGame(currentCategory);
                
            } else {
                //https://sweetalert2.github.io/
                Swal.fire({
                    icon: 'success',
                    title: 'Wow, No More Words',
                    text: `Fantastic job! You've guessed all the words in ${currentCategory} category. Explore another category for more exciting challenges!`,
                    showCancelButton: true,
                    confirmButtonColor: '#02BCB7', 
                    cancelButtonColor: '#FF5025', 
                    confirmButtonText: 'Change Category',
                    cancelButtonText: 'Back to Home',
                }).then((result) => {
                    if (result.isConfirmed) {
                        redirectToCategoryPage();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        redirectToWelcomePage();
                    }
                });
                
               
            }
        });
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', function () {
            if (audio.paused) {
                audio.play();
                playPauseIcon.className = 'fas fa-pause'; 
            } else {
                audio.pause();
                playPauseIcon.className = 'fas fa-play'; 
            }
        });
    }

}

prepGame()
 //Calls the initializeGuessGame function when the DOM content is fully loaded.   
document.addEventListener('DOMContentLoaded', initializeGuessGame);

