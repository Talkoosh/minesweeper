'use strict';

const MINE = '💣';
const FLAG = '🚩';
const NEUTRAL_FACE = '🙂';
const WIN_FACE = '😎';
const LOSE_FACE = '🤯';

var gIsFirstClick = true;
var gTimerInterval;

var gGame;

var gBoard;

var gLevel = {
    size: 4,
    mines: 2
}

function init() {
    //create and render board
    gBoard = createBoard();
    renderBoard();
    gGame = {
        isGameOn: true,
        flagCount: 0,
        cellsShownCount: 0,
        timer: 0
    };
    //reset timer and first click var
    clearInterval(gTimerInterval);
    gTimerInterval = null;
    var elTimer = document.querySelector('.interface .timer span');
    elTimer.innerText = 0;
    gIsFirstClick = true;
    //return reset button to neutral state
    var elRestartBtn = document.querySelector('.restart-button');
    elRestartBtn.innerText = NEUTRAL_FACE;
    gGame.isOn = true;
}

function setMinesNegsCount(board, row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            if (i === row && j === col) continue;
            board[i][j].minesAroundCount++;
        }
    }
}

function setMines(board) {
    for (var i = 0; i < gLevel.mines; i++) {
        var pos;
        do {
            pos = getRandomPos(board);
        } while (board[pos.i][pos.j].isMine);

        board[pos.i][pos.j].isMine = true;
        setMinesNegsCount(board, pos.i, pos.j);
    }

}

//TODO: helpig function (?)
function cellClicked(event, i, j) {
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    if (gIsFirstClick) {
        timerStart();
        gIsFirstClick = false;
    }
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    var cellContent;

    switch (event.which) {
        case 1:
            if (gBoard[i][j].isMarked) break;
            //upadte model
            if (gBoard[i][j].isMine) gameOver(false);
            gBoard[i][j].isShown = true;
            if (gBoard[i][j].minesAroundCount === 0) revealNeighbors(i, j);
            gGame.cellsShownCount++;
            //update DOM
            cellContent = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount;
            elCell.innerText = cellContent;
            break;

        case 3:
            //update model
            gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
            if (gBoard[i][j].isMarked) gGame.flagCount++;
            else gGame.flagCount--;
            //update DOM
            cellContent = (gBoard[i][j].isMarked) ? FLAG : '';
            elCell.innerText = cellContent;
    }

    checkWin();
}

function showTimer(startTime) {
    var currTime = Date.now();
    gGame.timer = Math.floor((currTime - startTime) / 1000);

    var elTimer = document.querySelector('.interface .timer span');
    elTimer.innerText = gGame.timer;
}

function timerStart() {
    var startTime = Date.now();
    gTimerInterval = setInterval(function () { showTimer(startTime) }, 1000);
}

function gameOver(isWin) {
    gGame.isOn = false;
    clearInterval(gTimerInterval);
    var elRestartBtn = document.querySelector('.restart-button');
    elRestartBtn.innerText = (isWin) ? WIN_FACE : LOSE_FACE

    if (!isWin) {
        revealMines();
    }
    else {

    }

}

function checkWin() {
    var mineAmount = gLevel.mines;

    if (gGame.flagCount === mineAmount &&
        gGame.cellsShownCount === (gLevel.size ** 2) - mineAmount) gameOver(true);
    console.log(gGame);
}

function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                var elMine = document.querySelector(`.cell-${i}-${j}`);
                elMine.innerText = MINE;
            }
        }
    }
}

function revealNeighbors(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === row && j === col) continue;
            //model
            if (!gBoard[i][j].isShown) gGame.cellsShownCount++;
            gBoard[i][j].isShown = true;
            //DOM
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            elCell.innerText = gBoard[i][j].minesAroundCount;

        }
    }
}
