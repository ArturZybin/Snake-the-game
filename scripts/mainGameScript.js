'use strict'
import {
    snakeProperties,
    setNewSnakeProperties,
    fieldProperties,
    setNewFieldProperties
} from './snakeFieldProperties.js';

import {
    createClearField,
    createBarriers,
    changeScore,
    setScore,
    updateLeaderboard
} from './interfaceManager.js';

import {
    startPointsGeneration,
    endPointsGeneration
} from './foodManager.js';

import {
    createStartingSnake,
    changeMovingDirection,
    getNextHeadCell,
    eatNextCell,
    moveSnake,
    addBodyPart,
    startSnakeDragging
} from './snakeScripts.js';

export {
    startGame
}

document.addEventListener('settingsClosed', setNewFieldProperties);
document.addEventListener('settingsClosed', setNewSnakeProperties);
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('settingsButton').addEventListener('click', pauseGame);

document.getElementById('cage').addEventListener('mousedown', startSnakeDragging)

let gameIntervalId;



function startGame() {
    document.getElementById('cagedSnake').hidden = 'true';

    startButton.hidden = 'true';
    scoreWindow.removeAttribute('hidden');

    setNewSnakeProperties();
    setNewFieldProperties();

    setScore(40);

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
        showMessage('win');
        endGame();
        return;
    }
    if (isLosing()) {
        showMessage('lose');
        endGame();
        return;
    }

    if (snakeProperties.newPartsQueueLength) {
        addBodyPart();
        changeScore(10);
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
    updateLeaderboard();

    document.getElementById('cagedSnake').removeAttribute('hidden');

    document.removeEventListener('keydown', changeMovingDirection);
    disableScreenArrows();

    clearInterval(gameIntervalId);
    gameIntervalId = null;

    endPointsGeneration();

    snakeProperties.snakePartsList = [];
    snakeProperties.movingDirection = 'right';
    snakeProperties.nextMovingDirection = 'right';

    scoreWindow.hidden = 'true';
    startButton.removeAttribute('hidden')
}


// CSS-class for the message must start with the text value
function showMessage(text) {
    let mainContainerLocker = document.getElementById('mainContainerLocker');
    let mainContainer = document.getElementById('mainContainer');
    mainContainerLocker.removeAttribute('hidden');
    mainContainer.classList.add('blured');

    text = text.toLowerCase();

    let message = document.getElementById('message');
    message.textContent = text;
    message.removeAttribute('hidden');
    message.classList.add('animate-message');
    message.classList.add(`${text}-message`);

    setTimeout(() => {
        message.hidden = 'true';
        message.classList.remove('animate-message');
        message.classList.remove(`${text}-message`);

        mainContainer.classList.remove('blured');
        mainContainerLocker.hidden = 'true';
    }, 1000)
}