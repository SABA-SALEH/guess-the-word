let chancesRemaining;
const initialChances = 3;

function redirectToCategoryPage() {
    const currentCategory = localStorage.getItem('category');
    localStorage.setItem(`${currentCategory}_wordIndex`, 0);
    window.location.href = 'category.html';
}


function redirectToWelcomePage() {
    const currentCategory = localStorage.getItem('category');
    localStorage.setItem(`${currentCategory}_wordIndex`, 0);
    window.location.href = 'index.html';
}

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

function getWord(category) {
    const wordsByCategory = {
        colors: ['RED', 'BLUE', 'YELLOW', 'GREEN', 'PINK'],
        shapes: ['CIRCLE', 'SQUARE', 'TRIANGLE', 'STAR', 'HEART'],
        fruits: ['APPLE', 'BANANA', 'ORANGE', 'STRAWBERRY', 'WATERMELON'],
        vegetables: ['CARROT', 'BROCCOLI', 'TOMATO', 'CUCUMBER', 'SPINACH'],
        numbers: ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'],
        weather: ['SUNNY', 'RAINY', 'CLOUDY', 'WINDY', 'SNOWY'],
    };

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

function getHintForWord(category, word) {
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
        transportation: {
            CAR: 'Personal motor vehicle',
            BUS: 'Large public transport vehicle',
            TRAIN: 'Railway transport',
            BOAT: 'Watercraft for travel on water',
            AIRPLANE: 'Aircraft for air travel',
        },
       
    };
    

    return hintsByCategory[category][word] || 'No hint available';
}

function initializeGuessGame() {
    const selectedWord = localStorage.getItem('selectedWord');
    const hint = localStorage.getItem('hint');
    chancesRemaining = parseInt(localStorage.getItem('chancesRemaining')) || 3;


    displayHint(hint);
    setupUI(selectedWord);
    displayChances(); 
}

function displayHint(hint) {
   
    const hintElement = document.getElementById('hint-text');
    if (hintElement) {
        hintElement.textContent = hint;
    }
}

function setupUI(selectedWord) {
    displayWord(selectedWord);
    console.log('Setting up the game interface...');
    setupGameBoard();
    displayChances();
}

function displayWord(selectedWord) {
    const wordContainer = document.getElementById('word');

    if (wordContainer) {
        const wordArray = selectedWord.split('');
        const wordDashes = wordArray.map(letter => (letter === ' ' ? ' ' : '_')).join(' ');

        wordContainer.textContent = wordDashes;
    }
}

function setupGameBoard() {
    const gameBoardContainer = document.getElementById('game-board');
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

function handleLetterClick(selectedLetter) {
    const gameBoardButtons = document.querySelectorAll('#game-board button');

    gameBoardButtons.forEach(button => {
        if (button.textContent === selectedLetter) {
            button.disabled = true;
            button.classList.add('disabled');
        }
    });
    const selectedWord = localStorage.getItem('selectedWord');
    updateWordDisplay(selectedWord, selectedLetter);
}

function updateWordDisplay(selectedWord, selectedLetter) {
    const wordContainer = document.getElementById('word');
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

        if (!displayWord.includes('_')) {
           
            const gameBoardButtons = document.querySelectorAll('#game-board button');
            gameBoardButtons.forEach(button => {
                button.disabled = true;
            });
           
            //https://sweetalert2.github.io/
            Swal.fire({
                icon: 'success',
                title: 'Fantastic!',
                text: 'You did it! You guessed the word! Great job, little word detective!',
                timer: 6000,
                showConfirmButton: false
            });
        }
        

        if (!isLetterCorrect) {
             //https://sweetalert2.github.io/
            Swal.fire({
                icon: 'warning',
                title: 'Oops, Not Quite Right!',
                text: 'That letter doesn’t fit, but no worries! Try another one. You’re doing great!',
                timer: 6000, 
                showConfirmButton: false 
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

function displayChances() {
    const chancesElement = document.getElementById('chances-text');
    if (chancesElement) {
        chancesElement.innerHTML = `<i class="fa-solid fa-heart custom-heart"></i> ${chancesRemaining}`;
    }
}

const changeButton = document.getElementById('change-category-button');
    if (changeButton) {
        changeButton.addEventListener('click', function () {
            redirectToCategoryPage();
        });
    }

    const backToWelcomeButton = document.getElementById('back-to-welcome-button');
    if (backToWelcomeButton) {
        backToWelcomeButton.addEventListener('click', function () {
            redirectToWelcomePage();
        });
    }
      
    function areMoreWordsAvailable(category) {
        const wordsByCategory = {
            colors: ['RED', 'BLUE', 'YELLOW', 'GREEN', 'PINK'],
            shapes: ['CIRCLE', 'SQUARE', 'TRIANGLE', 'STAR', 'HEART'],
            fruits: ['APPLE', 'BANANA', 'ORANGE', 'STRAWBERRY', 'WATERMELON'],
            vegetables: ['CARROT', 'BROCCOLI', 'TOMATO', 'CUCUMBER', 'SPINACH'],
            numbers: ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'],
            weather: ['SUNNY', 'RAINY', 'CLOUDY', 'WINDY', 'SNOWY'],
            transportation: ['CAR', 'BUS', 'TRAIN', 'BOAT', 'AIRPLANE'],
        };
    
        if (wordsByCategory.hasOwnProperty(category)) {
            const wordIndex = parseInt(localStorage.getItem(`${category}_wordIndex`) || 0);
            return wordIndex < wordsByCategory[category].length;
        }
    }
    
    const nextWordButton = document.getElementById('next-word-button');
    if (nextWordButton) {
        nextWordButton.addEventListener('click', function () {
            const currentCategory = localStorage.getItem('category');
            
            if (areMoreWordsAvailable(currentCategory)) {
                startGuessGame(currentCategory);
            } else {
                //https://sweetalert2.github.io/
                Swal.fire({
                    icon: 'info',
                    title: 'Wow,No More Words',
                    text: `Fantastic job! You've guessed all the words in ${currentCategory} category. Explore another category for more exciting challenges!`,
                    confirmButtonText: 'OK',
                });
            }
        });
    }

   
    

document.addEventListener('DOMContentLoaded', initializeGuessGame);
