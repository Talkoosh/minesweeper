'use strict';

var gEasy = {
    size: 4,
    mines: 2
};

var gMedium = {
    size: 8,
    mines: 12
};

var gHard = {
    size: 12,
    mines: 30
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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
    setMines(board);
    return board;
}

function renderBoard() {
    var strHTML = '';

    for (var i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gLevel.size; j++) {
            strHTML += `<td oncontextmenu="return false;" 
            onmousedown="cellClicked(event, ${i}, ${j})"
             class="cell cell-${i}-${j}" ><span></span></td>`
        }
        strHTML += '</tr>';
    }

    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}

function setDifficulty(difficulty) {
    switch(difficulty){
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