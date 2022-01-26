'use strict';

const MINE = '💣';
const FLAG = '🚩';

var gIsFirstClick = true;
var gTimerInterval;

var gGame = {
    isGameOn: true,
    flagCount: 0,
    cellsShownCount: 0
};

var gBoard;

var gLevel = {
    size: 4,
    mines: 2
}

function init() {
    gBoard = createBoard();
    renderBoard();
    gTimerInterval = 0;
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
        do{
            pos = getRandomPos(board);
        } while(board[pos.i][pos.j].isMine);

        board[pos.i][pos.j].isMine = true;
        setMinesNegsCount(board, pos.i, pos.j);
    }

}


//TODO: helpig function (?)
function cellClicked(event, i, j) {
    timerStart();
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    var elCellContent = document.querySelector(`.cell-${i}-${j} span`)
    var cellContent;

    switch (event.which) {
        case 1:
            if (gBoard[i][j].isMarked) break;
            //upadte model
            if (gBoard[i][j].isMine) gameOver(false);
            gBoard[i][j].isShown = true;
            gGame.cellsShownCount++;
            //update DOM
            cellContent = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount;
            elCellContent.innerText = cellContent;
            break;

        case 3:
            //update model
            gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
            if (gBoard[i][j].isMarked) gGame.flagCount++;
            else gGame.flagCount--;
            //update DOM
            cellContent = (gBoard[i][j].isMarked) ? FLAG : '';
            elCellContent.innerText = cellContent;
    }
    console.log(gGame);
    checkWin();
}

function showTimer(startTime) {
    var currTime = Date.now();
    var displayTime = Math.floor((currTime - startTime) / 1000);

    var elTimer = document.querySelector('.interface .timer span');
    elTimer.innerText = displayTime;
}

function timerStart() {
    if (gIsFirstClick) {
        var startTime = Date.now();
        gTimerInterval = setInterval(function () { showTimer(startTime) }, 1000);
    }
    gIsFirstClick = false;
}

function gameOver(isWin) {
    gGame.isOn = false;
    clearInterval(gTimerInterval);

    if (!isWin) {
        revealMines();
    }

}

function checkWin() {
    var mineAmount = gLevel.mines;
    //if played didn't flag all mines or didn't reveal all cells - don't stop game
    if (gGame.flagCount === mineAmount &&
        gGame.cellsShownCount === (gLevel.size ** 2) - mineAmount) gameOver(true);

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
