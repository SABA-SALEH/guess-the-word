function redirectToHomePage() {
    
    window.location.href = 'home.html';
}


function startGuessGame(category) {
    const selectedWord = getRandomWord(category);
    const hint = getHintForWord(category, selectedWord);

    localStorage.setItem('selectedWord', selectedWord);
    localStorage.setItem('hint', hint);

    window.location.href = 'guess-game.html';
}


function getRandomWord(category) {
    const wordsByCategory = {
        colors: ['RED', 'BLUE', 'YELLOW', 'GREEN', 'PINK'],
        shapes: ['CIRCLE', 'SQUARE', 'TRIANGLE', 'STAR', 'HEART'],
        fruits: ['APPLE', 'BANANA', 'ORANGE', 'STRAWBERRY', 'WATERMELON'],
        vegetables: ['CARROT', 'BROCCOLI', 'TOMATO', 'CUCUMBER', 'SPINACH'],
        numbers: ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'],
        weather: ['SUNNY', 'RAINY', 'CLOUDY', 'WINDY', 'SNOWY'],
        transportation: ['CAR', 'BUS', 'TRAIN', 'BOAT', 'AIRPLANE'],
       
    };

    if (category && wordsByCategory.hasOwnProperty(category)) {
        const words = wordsByCategory[category];

        if (words && words.length > 0) {
            const randomIndex = Math.floor(Math.random() * words.length);
            return words[randomIndex];
        } else {
            console.error('Category has no words.');
        }
    } else {
        console.error('Invalid category specified.');
    }

    return null;
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

    displayHint(hint);
    setupLives();
    setupUI(selectedWord);
}


function displayHint(hint) {
   
    const hintElement = document.getElementById('hint-text');
    if (hintElement) {
        hintElement.textContent = hint;
    }
}

function setupLives() {
    console.log('Setting up initial lives...');
}

function setupUI(selectedWord) {
    displayWord(selectedWord);
    console.log('Setting up the game interface...');
}

function displayWord(selectedWord) {
    const wordContainer = document.getElementById('word');

    if (wordContainer) {
        const wordArray = selectedWord.split('');
        const wordDashes = wordArray.map(letter => (letter === ' ' ? ' ' : '_')).join(' ');

        wordContainer.textContent = wordDashes;
    }
}

document.addEventListener('DOMContentLoaded', initializeGuessGame);
