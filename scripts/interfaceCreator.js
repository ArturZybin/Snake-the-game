'use strict'

import {
    fieldProperties,
} from './snakeFieldProperties.js';

export {
    createClearField,
    createBarriers
};


createClearField();
document.getElementById('settingsButton').addEventListener('click', openSettings);
document.getElementById('closeSettingsButton').addEventListener('click', closeSettings);
document.addEventListener('keydown', triggerScreenArrowClick);
document.addEventListener('keyup', untriggerScreenArrowClick);


function createClearField() {
    let field = document.getElementById('field');
    field.innerHTML = '';
    createFieldCells(field);
}


function createFieldCells(field) {
    let fieldSize = 17;
    for (let i = 0; i < fieldSize; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < fieldSize; j++) {
            let cell = document.createElement('td');
            cell.classList.add('field-cell');
            row.append(cell);
        };
        row.classList.add('field-row');
        field.append(row);
    };
}


function createBarriers() {
    let field = document.getElementById('field');
    let fieldSize = field.rows.length;
    let barriersRows = [3, 9, 13];
    let barrierLength = 10;
    
    for (let i=0; i < barriersRows.length; i++) {
        
        if (i & 1) {
            for (let cell = 0; cell < barrierLength; cell++){
                createBarrierCell(field.rows[ barriersRows[i] ].cells[cell]);
            }
        } else {
            console.log(i)
            for (let cell = fieldSize-1; cell >= fieldSize - barrierLength; cell--) {
                createBarrierCell(field.rows[ barriersRows[i] ].cells[cell]);
            }
        }
        
    }
}

function createBarrierCell(cell) {
    let barrier = document.createElement('div');
    barrier.classList.add('barrier');
    cell.append(barrier);
}

function addNewLeader(newLeadername, newLeaderScore) {
    let leaderboard = document.getElementById('leaderboard');
    let leadersList = Array.from(leaderboard.querySelectorAll('.leader'));

    for (let currentLeader of leadersList) {
        let currentLeaderScore = currentLeader.querySelector('.leader-score').textContent;

        if (currentLeaderScore == '--||--' || parseInt(currentLeaderScore) < newLeaderScore) {
            currentLeader.querySelector('.leader-name').textContent = newLeadername;
            currentLeader.querySelector('.leader-score').textContent = newLeaderScore;
            break;
        }
    }
}


function openSettings() {
    let mainContainer = document.getElementById('mainContainer');
    let mainContainerLocker = document.getElementById('mainContainerLocker');
    let settingsContainer = document.getElementById('settingsContainer');

    mainContainer.classList.add('blured');
    mainContainerLocker.removeAttribute('hidden');
    settingsContainer.removeAttribute('hidden');

    document.addEventListener('keydown', closeSettingsByEscape)
}


function closeSettings() {
    document.dispatchEvent(new CustomEvent('settingsClosed'))

    let mainContainer = document.getElementById('mainContainer');
    let mainContainerLocker = document.getElementById('mainContainerLocker');
    let settingsContainer = document.getElementById('settingsContainer');

    mainContainer.classList.remove('blured');
    mainContainerLocker.hidden = 'true';
    settingsContainer.hidden = 'true';
    document.removeEventListener('keydown', closeSettingsByEscape);
}


function closeSettingsByEscape(event) {
    if (event.code != 'Escape') return;
    closeSettings();
}


function triggerScreenArrowClick(event) {
    // click may be generated by screen arrow
    if (!event.isTrusted) return;

    switch (event.code) {
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'ArrowUp':
            document.getElementById(event.code).classList.add('active-screen-arrow');
            break;
    }
}

function untriggerScreenArrowClick(event) {
    switch (event.code) {
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'ArrowUp':
            document.getElementById(event.code).classList.remove('active-screen-arrow');
            break;
    }
}