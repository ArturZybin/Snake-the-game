'use strict'
import {
    snakeProperties,
    setNewSnakeProperties,
    fieldProperties,
    setNewFieldProperties
} from './snakeFieldProperties.js';

import {
    createClearField,
    createBarriers
} from './interfaceCreator.js';

import {
    startPointsGeneration,
    endPointsGeneration
} from './pointsGenerator.js';

import {
    createStartingSnake,
    changeMovingDirection,
    getNextHeadCell,
    eatNextCell,
    moveSnake,
    addBodyPart
} from './snakeScripts.js';


document.addEventListener('settingsClosed', setNewFieldProperties);
document.addEventListener('settingsClosed', setNewSnakeProperties);
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('settingsButton').addEventListener('click', pauseGame);

let gameIntervalId;



function startGame() {
    startButton.classList.add('inactive-start-button');
    startButton.removeEventListener('click', startGame);

    setNewSnakeProperties();
    setNewFieldProperties();

    createClearField();
    if (fieldProperties.barriers) {
        createBarriers();
    }

    document.addEventListener('keydown', changeMovingDirection);
    setupScreenArrows();
    
    snakeProperties.currentColor = snakeProperties.color;
    snakeProperties.currentSpeed = snakeProperties.speed;

    createStartingSnake();
    gameIntervalId = setInterval(oneStepAlgorithm, snakeProperties.currentSpeed);
    startPointsGeneration();
}


function pauseGame() {
    if (!gameIntervalId) return;
    clearInterval(gameIntervalId);
    gameIntervalId = null;
    document.addEventListener('settingsClosed', resumeGame);
}

function resumeGame() {
    gameIntervalId = setInterval(oneStepAlgorithm, snakeProperties.currentSpeed);
    document.removeEventListener('settingsClosed', resumeGame);
}


function oneStepAlgorithm(intervalId) {
    snakeProperties.movingDirection = snakeProperties.nextMovingDirection;

    if (isWinning()) {
        showWinMessage();
        endGame();
        return;
    }
    if (isLosing()) {
        showLoseMessage();
        endGame();
        return;
    }

    if (snakeProperties.newPartsQueueLength) {
        addBodyPart();
        snakeProperties.newPartsQueueLength--;
    }

    eatNextCell();
    moveSnake();
}


function setupScreenArrows() {
    let arrowsList = Array.from(document.getElementsByClassName('arrow'));
    arrowsList.forEach(arrow => {
        // trigger keydown with event.code of appropriate keyboard arrow
        // to use the same function for changing direction
        let arrowEvent = new Event('keydown', {
            bubbles: true,
        });
        arrowEvent.code = arrow.id;
        arrow.onclick = () => document.dispatchEvent(arrowEvent);
    })
}


function disableScreenArrows() {
    let arrowsList = Array.from(document.getElementsByClassName('arrow'));
    arrowsList.forEach(arrow => {
        arrow.closest('div').onclick = null;
    })
}


function isWinning() {
    let field = document.getElementById('field');
    if (snakeProperties.snakePartsList.length == field.rows.length * field.rows[0].cells.length) {
        return true;
    }
}

function isLosing() {
    let snake = snakeProperties.snakePartsList;
    let nextHeadCell = getNextHeadCell();

    for (let snakePart of snake) {
        if (snakePart.closest('td') == nextHeadCell && snakePart != snake[0]) {
            return true;
        }
    }
    
    if (snake.length == 1) return true;

    if (!fieldProperties.passingThroughtWalls) {
        let fieldSize = document.getElementById('field').rows.length;

        if (!nextHeadCell) {
            return true;
        }
    }
    
    let barriers = document.getElementsByClassName('barrier');
    for (let barrier of barriers) {
        if (barrier.closest('td') == nextHeadCell) return true;
    }
}


function endGame() {
    document.removeEventListener('keydown', changeMovingDirection);
    disableScreenArrows();

    clearInterval(gameIntervalId);
    gameIntervalId = null;

    endPointsGeneration();

    snakeProperties.snakePartsList = [];
    snakeProperties.movingDirection = 'right';
    snakeProperties.nextMovingDirection = 'right';

    startButton.classList.remove('inactive-start-button');
    document.getElementById('startButton').addEventListener('click', startGame);
}


function showWinMessage() {
    alert('You win!');
}
function showLoseMessage() {
    alert('You lose!');
}