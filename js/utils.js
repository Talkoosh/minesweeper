'use strict';

var gEasy = {
    level: 'easy',
    size: 4,
    mines: 2,
};

var gMedium = {
    level: 'medium',
    size: 8,
    mines: 12,
};

var gHard = {
    level: 'hard',
    size: 12,
    mines: 30,
};

function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

function createBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = createCell();
        }
    }
    return board;
}

function renderBoard() {
    var strHTML = '';

    for (var i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gLevel.size; j++) {
            strHTML += `<td oncontextmenu="return false;" 
            onmousedown="cellClicked(event, ${i}, ${j})"
             class="cell cell-${i}-${j}" ></td>`
        }
        strHTML += '</tr>';
    }

    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}

function setDifficulty(difficulty) {
    switch (difficulty) {
        case 'easy':
            gLevel = gEasy;
            break;
        case 'medium':
            gLevel = gMedium;
            break;
        case 'hard':
            gLevel = gHard;
    }
    init();
}

function getRandomPos(board) {
    return {
        i: getRandomInt(0, board.length - 1),
        j: getRandomInt(0, board.length - 1)
    }
}

function resetTimer() {
    clearInterval(gTimerInterval);
    gTimerInterval = null;
    var elTimer = document.querySelector('.interface .timer span');
    elTimer.innerText = 0;

}

function setButtonToNeutral() {
    var elRestartBtn = document.querySelector('.restart-button');
    elRestartBtn.innerText = NEUTRAL_FACE;
}

function renderLivesCount() {
    var elLivesCount = document.querySelector('.lives span');
    elLivesCount.innerText = gGame.lives;
}

function renderCellContent(cellContent, i, j) {
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerText = cellContent;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function revealCell(i, j) {
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.classList.add('revealed');
}

function updateBestTime() {

    if (gLevel.level === 'easy') {
        if (!localStorage.bestTimeEasy || gGame.timer < localStorage.bestTimeEasy) {
            localStorage.setItem('bestTimeEasy', gGame.timer);
        }
    } else if (gLevel.level === 'medium') {
        if (!localStorage.bestTimeMedium || gGame.timer < localStorage.bestTimeMedium) {
            localStorage.setItem('bestTimeMedium', gGame.timer);
        }
    } else if (gLevel.level === 'hard') {
        if (!localStorage.bestTimeHard || gGame.timer < localStorage.bestTimeHard) {
            localStorage.setItem('bestTimeHard', gGame.timer);
        }
    }
    renderBestTime();
}

function renderBestTime() {
    var elBestTime = document.querySelector('.best-time span');
    switch (gLevel.level) {
        case 'easy':
            elBestTime.innerText = (!localStorage.bestTimeEasy) ? '---' : localStorage.bestTimeEasy;
            break;
        case 'medium':
            elBestTime.innerText = (!localStorage.bestTimeMedium) ? '---' : localStorage.bestTimeMedium;
            break;
        case 'hard':
            elBestTime.innerText = (!localStorage.bestTimeHard) ? '---' : localStorage.bestTimeHard;
            break;
        default:
            elBestTime.innerText = '---'
    }

}