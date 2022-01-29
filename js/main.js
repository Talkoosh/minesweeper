'use strict';

const MINE = '💣';
const FLAG = '🚩';
const NEUTRAL_FACE = '🙂';
const WIN_FACE = '😎';
const LOSE_FACE = '🤯';
const LIFE = '❤️';

var gIsFirstClick = true;
var gTimerInterval;

var gGame;

var gBoard;


var gLevel = gEasy;

function init() {
    gBoard = createBoard();
    renderBoard();
    gGame = setGameStart();
    resetTimer();
    setButtonToNeutral();
    renderLives();
    renderBestTime();
    renderSafeClicks();
    gIsFirstClick = true;
}

function setGameStart() {
    var lives, safeClicks;
    if (gLevel.level === 'easy') safeClicks = lives = 1;
    else if (gLevel.level === 'medium') safeClicks = lives = 2;
    else if (gLevel.level === 'hard') safeClicks = lives = 3;
    return {
        isOn: true,
        flagCount: 0,
        cellsShownCount: 0,
        timer: 0,
        lives: lives,
        safeClicks: safeClicks
    };
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

function setMines(board, row, col) {
    for (var i = 0; i < gLevel.mines; i++) {
        var pos;
        do {
            pos = getRandomPos(board);
        } while (board[pos.i][pos.j].isMine || isNeighbourCell(row, col, pos));

        board[pos.i][pos.j].isMine = true;
        setMinesNegsCount(board, pos.i, pos.j);
    }
}

function isNeighbourCell(row, col, pos) {
    if (pos.i === row && pos.j === col) return true;
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (pos.i === i && pos.j === j) return true;
        }
    }
    return false;
}

function cellClicked(event, i, j) {
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;

    var cellContent;

    if (event.which === 1) {
        if (gBoard[i][j].isMarked) return;
        if (gIsFirstClick) {
            timerStart();
            setMines(gBoard, i, j);
            gIsFirstClick = false;
        }
        if (gBoard[i][j].isMine) {
            mineClicked(i, j);
            return;
        }
        //upadte model
        gBoard[i][j].isShown = true;
        if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) revealNeighbors(i, j);
        gGame.cellsShownCount++;
        //update DOM
        cellContent = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount;
        if (cellContent === 0) cellContent = '';
        renderCellContent(cellContent, i, j);
        revealCell(i, j);
    }

    else if (event.which === 3) {
        //update model
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
        if (gBoard[i][j].isMarked) gGame.flagCount++;
        else gGame.flagCount--;
        //update DOM
        cellContent = (gBoard[i][j].isMarked) ? FLAG : '';
        renderCellContent(cellContent, i, j);
    }
    checkWin();
}

function mineClicked(i, j) {
    gGame.lives--;
    renderLives();
    if (gGame.lives === 0) gameOver(false);
    else {
        var elCell = document.querySelector(`.cell-${i}-${j}`);
        elCell.classList.add('hidden-mine');
        setTimeout(function () { elCell.classList.remove('hidden-mine') }, 1500);
    }
}

function runTimer(startTime) {
    var currTime = Date.now();
    gGame.timer = Math.floor((currTime - startTime) / 1000);

    var elTimer = document.querySelector('.interface .timer span');
    elTimer.innerText = gGame.timer;
}

function timerStart() {
    var startTime = Date.now();
    gTimerInterval = setInterval(function () { runTimer(startTime) }, 1000);
}

function gameOver(isWin) {
    gGame.isOn = false;
    clearInterval(gTimerInterval);
    var elRestartBtn = document.querySelector('.restart-button');
    elRestartBtn.innerText = (isWin) ? WIN_FACE : LOSE_FACE

    if (!isWin) revealMines();
    else updateBestTime();
}

function checkWin() {
    var mineAmount = gLevel.mines;

    if (gGame.flagCount === mineAmount &&
        gGame.cellsShownCount === (gLevel.size ** 2) - mineAmount) {
        gameOver(true);
    }
}

function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.innerText = MINE;
                elCell.classList.add('revealed');
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
            if (gBoard[i][j].isMarked) continue;

            if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true;
                gGame.cellsShownCount++;
                revealNeighbors(i, j);
            }

            //model
            if (!gBoard[i][j].isShown) {
                gGame.cellsShownCount++;
                gBoard[i][j].isShown = true;
            }


            //DOM
            var cellContent = (gBoard[i][j].minesAroundCount === 0) ? '' : gBoard[i][j].minesAroundCount;
            renderCellContent(cellContent, i, j);
            revealCell(i, j);
        }
    }
}

function safeClick() {
    if(!gGame.isOn) return;
    if(gGame.cellsShownCount === (gLevel.size ** 2) - gLevel.mines) return;
    if(gGame.safeClicks === 0) return; 
    gGame.safeClicks--;
    do {
        var pos = getRandomPos(gBoard);
    } while (gBoard[pos.i][pos.j].isMine || gBoard[pos.i][pos.j].isShown)

    var elSafeClick = document.querySelector(`.cell-${pos.i}-${pos.j}`);
    elSafeClick.classList.add('safe-click');
    setTimeout(function(){elSafeClick.classList.remove('safe-click')}, 1500)

    renderSafeClicks();
}

function renderSafeClicks(){
    var elSafeClicksCount = document.querySelector('.safe-button span');
    elSafeClicksCount.innerText = gGame.safeClicks;
}