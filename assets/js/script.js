/* jshint esversion: 6 */
let chancesRemaining;
let audio; 
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

const toggleButton = document.getElementById('toggleButton');
const playPauseIcon = document.getElementById('playPauseIcon');

/**
 * Redirects the user to the category page while resetting the word index in local storage.
 */
function redirectToCategoryPage() {
    localStorage.setItem(`${currentCategory}_wordIndex`, 0);
    window.location.href = 'category.html';
}

/**
 * Redirects the user to the welcome page while resetting the word index in local storage.
 */
function redirectToWelcomePage() {
    localStorage.setItem(`${currentCategory}_wordIndex`, 0);
    window.location.href = 'index.html';
}

/**
 * Initiates the guessing game by setting up initial game data in local storage, including the selected word, hint, and remaining chances, and redirects to the game page.
 * @param {string} category The category of words for the guessing game.
 */
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

/**
 * Retrieves a word from the specified category, updating the word index in local storage.
 * @param {string} category The category of words from which to retrieve a word.
 * @returns {string|null} The selected word from the category, or null if no words are available or the category is invalid.
 */
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

/**
 * Retrieves a hint for the given word in the specified category.
 * @param {string} category The category of the word.
 * @param {string} word The word for which to retrieve a hint.
 * @returns {string} A hint for the word in the specified category, or 'No hint available' if no hint is found.
 */
function getHintForWord(category, word) {
    return hintsByCategory[category][word] || 'No hint available';
}

/**
 * Displays the provided hint on the game page.
 * @param {string} hint The hint to be displayed.
 */
function displayHint(hint) {
    if (hintElement) {
        hintElement.textContent = hint;
    }
}

/**
 *  Initializes the game by retrieving initial data from local storage and setting up the user interface.
 */
function initializeGuessGame() {
    chancesRemaining = parseInt(localStorage.getItem('chancesRemaining')) || 3;
    if (nextWordButton) {
        nextWordButton.disabled = true;
    }

    displayHint(hint);
    setupUI(selectedWord);
    displayChances();
}

/**
 * Sets up the game interface by displaying the selected word and initializing the game board.
 * @param {string} selectedWord The word chosen for the game.
 */
function setupUI(selectedWord) {
    displayWord(selectedWord);
    console.log('Setting up the game interface...');
    setupGameBoard();
    displayChances();
}

/**
 * Displays the selected word on the game page with dashes representing each letter.
 * @param {string} selectedWord The word to be displayed with dashes for each letter.
 */
function displayWord(selectedWord) {
    if (wordContainer) {
        const wordArray = selectedWord.split('');
        const wordDashes = wordArray.map(letter => (letter === ' ' ? ' ' : '-')).join(' ');

        wordContainer.textContent = wordDashes;
    }
}

/**
 * Sets up the game board by creating letter buttons for user interaction.
 */
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

/**
 * Handles the click event for a letter button, updating the display and game board accordingly.
 * @param {string} selectedLetter The letter chosen by the player.
 */
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

/**
 * Updates the displayed word based on the correctness of the guessed letter.
 * @param {string} selectedWord The word chosen for the game.
 * @param {string} selectedLetter The letter guessed by the player.
 */
function updateWordDisplay(selectedWord, selectedLetter) {
    if (wordContainer) {
        const wordArray = selectedWord.split('');
        let updatedWord = wordContainer.textContent.split(' ');
        let isLetterCorrect = false;

        // Loop through each letter in the selected word
        for (let i = 0; i < wordArray.length; i++) {
            if (wordArray[i] === selectedLetter) {
                updatedWord[i] = selectedLetter;
                isLetterCorrect = true;
            }
        }

        const displayWord = updatedWord.join(' ');
        wordContainer.textContent = displayWord;

        // If there are no more dashes in the displayed word (all letters guessed)
        if (!displayWord.includes('-')) {
            const gameBoardButtons = document.querySelectorAll('#game-board button');
            gameBoardButtons.forEach(button => {
                button.disabled = true;
            });

            // Enable the next word button
            if (nextWordButton) {
                nextWordButton.disabled = false;
            }

            // Display a success message using SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Fantastic!',
                text: 'You did it! You guessed the word! Great job, little word detective! Move on to the next word and let the adventure continue!',
                timer: 5000,
                showCloseButton: true,
                showConfirmButton: false,
            });
        }

        // If the guessed letter is incorrect
        if (!isLetterCorrect) {
            // Display a warning message using SweetAlert2
            Swal.fire({
                icon: 'warning',
                title: 'Oops, Not Quite Right!',
                text: 'That letter doesn’t fit, but no worries! Try another one. You’re doing great!',
                timer: 5000,
                showCloseButton: true,
                showConfirmButton: false,
            });

            // Decrease the remaining chances and update the display
            chancesRemaining--;
            displayChances();

            // If no chances remaining
            if (chancesRemaining === 0) {
                const secretWord = localStorage.getItem('selectedWord');
                // Display an error message using SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Oops, You Lose!',
                    text: `Don't worry, you'll get it next time! The word was: ${secretWord}. Keep trying and have fun!`,
                    confirmButtonColor: '#02BCB7',
                    confirmButtonText: 'Start Again'
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.setItem(`${localStorage.getItem('category')}_wordIndex`, 0);
                        startGuessGame(localStorage.getItem('category'));
                    }
                });
            }
        }
    }
}

/**
 * Displays the remaining chances (hearts) on the game page.
 */
function displayChances() {
    if (chancesElement) {
        chancesElement.innerHTML = `<i class="fa-solid fa-heart custom-heart"></i> ${chancesRemaining}`;
    }
}

/**
 * Checks if there are more words available in the specified category for the user to guess.
 * @param {string} category The category of words to check for availability.
 * @returns {boolean} True if more words are available, false otherwise.
 */
function areMoreWordsAvailable(category) {
    if (wordsByCategory.hasOwnProperty(category)) {
        const wordIndex = parseInt(localStorage.getItem(`${category}_wordIndex`) || 0);
        return wordIndex < wordsByCategory[category].length;
    }
}

/**
 * Prepares the game by adding event listeners to buttons and setting up the audio toggle functionality.
 */
function prepGame() {
    audio = document.getElementById('myAudio');

    // Add event listener to change category button
    if (changeButton) {
        changeButton.addEventListener('click', function () {
            redirectToCategoryPage();
        });
    }

    // Add event listener to back to welcome button
    if (backToWelcomeButton) {
        backToWelcomeButton.addEventListener('click', function () {
            redirectToWelcomePage();
        });
    }

    // Add event listener to next word button
    if (nextWordButton) {
        // Click event listener
        nextWordButton.addEventListener('click', function () {
            handleNextWordButtonClick();
        });
        // Touch event listener
        nextWordButton.addEventListener('touchstart', function (event) {
            event.preventDefault(); // Prevent default touch behavior
            handleNextWordButtonClick();
        });
    }

    // Add event listener to toggle audio button
    if (toggleButton) {
        toggleButton.addEventListener('click', function () {
            toggleAudio();
        });

        // Load music state and playback position from localStorage when the page loads
        window.addEventListener('load', loadMusicState);
        // Save music state and playback position to localStorage when the page is unloaded
        window.addEventListener('beforeunload', saveMusicState);
    }

}

// Function to handle click event for next word button
function handleNextWordButtonClick() {
    const currentCategory = localStorage.getItem('category');
    localStorage.setItem('audioPlaybackPosition', audio.currentTime.toString());

    if (areMoreWordsAvailable(currentCategory)) {
        startGuessGame(currentCategory);
    } else {
        // Display a success message if no more words are available in the category
        Swal.fire({
            icon: 'success',
            title: 'Wow, No More Words',
            text: `Fantastic job! You've guessed all the words in ${currentCategory} category. Explore another category for more exciting challenges!`,
            confirmButtonColor: '#02BCB7',
            confirmButtonText: 'Change Category',
        }).then(() => {
            redirectToCategoryPage();
        });
    }
}

// Function to toggle audio play/pause
function toggleAudio() {
    if (audio.paused) {
        audio.play();
        playPauseIcon.className = 'fas fa-pause';
    } else {
        audio.pause();
        playPauseIcon.className = 'fas fa-play';
    }
}

// Function to load music state and playback position from localStorage
function loadMusicState() {
    const storedMusicState = localStorage.getItem('isMusicPlaying');
    if (storedMusicState === 'true') {
        const storedPlaybackPosition = parseFloat(localStorage.getItem('audioPlaybackPosition'));
        if (!isNaN(storedPlaybackPosition)) {
            audio.currentTime = storedPlaybackPosition;
        }
        if (audio.paused) {
            audio.play();
            playPauseIcon.className = 'fas fa-pause';
        }
    } else {
        if (!audio.paused) {
            audio.pause();
            playPauseIcon.className = 'fas fa-play';
        }
    }
}

// Function to save music state and playback position to localStorage
function saveMusicState() {
    localStorage.setItem('isMusicPlaying', !audio.paused);
    localStorage.setItem('audioPlaybackPosition', audio.currentTime.toString());
}

// Call the prepGame function when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', prepGame);

// Call the initializeGuessGame function when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', initializeGuessGame);