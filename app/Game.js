import {
    Cell
} from './Cell.js'
import {
    Counter
} from './Counter.js'
import {
    Timer
} from './Timer.js'
import {
    Menu
} from './Menu.js'
class Game {
    level = {
        easy: {
            rows: 8,
            columns: 8,
            mines: 10,
        },
        normal: {
            rows: 16,
            columns: 16,
            mines: 40,
        },
        expert: {
            rows: 30,
            columns: 16,
            mines: 99,
        },
    };
    Counter = new Counter();
    Timer = new Timer();
    Menu = new Menu();
    constructor() {
        this.numberOfRows = 0;
        this.numberOfColumns = 0;
        this.numberOfMines = 0;
        this.numberOfRevealCells = 0;
        this.cells = [];
        this.allCells = [];
        this.cellsWithMines = [];
        this.currentCell = null;
        this.cellsToReveal = [];
        this.isFistGame = true;
    }

    initializeGame(row = this.level.easy.rows,
        column = this.level.easy.columns,
        mine = this.level.easy.mines) {
        this.numberOfRows = row;
        this.numberOfColumns = column;
        this.numberOfMines = mine;
        if (!this.isFistGame) this.restartData();
        this.Counter.startCounter(this.numberOfMines);
        this.startGame()
        console.log(this.numberOfRevealCells);

    }
    startGame() {
        this.setStylesOfBoard();
        this.renderBoard();
        this.addMines();
        this.getAllCellsToReveal();
        this.addValuesToCells();
        this.addButtonsEventListeners();
    }
    restartData() {
        this.cells = [];
        this.allCells = [];
        this.cellsWithMines = [];
        this.currentCell = null;
        this.cellsToReveal = [];
        this.Timer.restartTimer();
        this.numberOfRevealCells = 0;
    }
    newGame() {
        this.Menu.startAgain();
        this.initializeGame();
    }
    getAllCellsToReveal() {
        this.allCells.forEach(
            cell => {
                if (!cell.isMine) {
                    this.cellsToReveal.push(cell)
                }
            })
    }
    setStylesOfBoard() {
        const elem = document.querySelector(":root");
        elem.style.setProperty(
            '--cells-in-row',
            this.numberOfRows);
    }
    renderBoard = () => {
        let board = document.querySelector(".gameBoard");
        while (board.firstChild) {
            board.removeChild(board.lastChild);
        }
        for (let column = 0; column < this.numberOfColumns; column++) {
            this.cells[column] = [];
            for (let row = 0; row < this.numberOfRows; row++) {
                this.cells[column].push(new Cell(row, column))
            }
        }
        this.allCells = this.cells.flat();
        this.allCells.forEach(cell => cell.createElement());
    }
    AddValueToCell(x, y) {
        let cellToCheck = this.cells[y][x];
        if (!(cellToCheck.isMine)) {
            cellToCheck.value += 1
        }
    }
    mainConditions(cell, x, y, value, action = "addValue") {
        if ((cell.x > 0 && value === "left") ||
            (cell.x < this.numberOfRows - 1 && value === "right") ||
            (cell.y > 0 && value === "top") ||
            (cell.y < this.numberOfColumns - 1 && value === "bottom")) {
            if (action === "addValue") this.AddValueToCell(x, y)
            else {
                if (!this.cells[y][x].isReveal)
                    this.releaveNeighbor(x, y)
            }
        }
    }
    sideConditions(cell, x, y, value, action = "addValue") {
        if ((cell.x > 0 && cell.y > 0 && value === "left-top") ||
            (cell.x > 0 && cell.y < this.numberOfColumns - 1 && value === "left-bottom") ||
            (cell.x < this.numberOfRows - 1 && cell.y > 0 && value === "right-top") ||
            (cell.x < this.numberOfRows - 1 && cell.y < this.numberOfColumns - 1 && value === "right-bottom"))
            if (action === "addValue") this.AddValueToCell(x, y)
        else {
            if (!this.cells[y][x].isReveal)
                this.releaveNeighbor(x, y)
        }
    }
    neibghorCells(cell, action = "addValue") {
        this.mainConditions(cell, cell.x - 1, cell.y, "left", action)
        this.mainConditions(cell, cell.x + 1, cell.y, "right", action)
        this.mainConditions(cell, cell.x, cell.y - 1, "top", action)
        this.mainConditions(cell, cell.x, cell.y + 1, "bottom", action)
        this.sideConditions(cell, cell.x - 1, cell.y - 1, "left-top", action)
        this.sideConditions(cell, cell.x - 1, cell.y + 1, "left-bottom", action)
        this.sideConditions(cell, cell.x + 1, cell.y - 1, "right-top", action)
        this.sideConditions(cell, cell.x + 1, cell.y + 1, "right-bottom", action)
    }
    addValuesToCells = () => {
        this.cellsWithMines.forEach(cell => {
            this.neibghorCells(cell)
        })
    }
    addMines = (mines = this.numberOfMines) => {
        while (mines > 0) {
            let column = Math.round(Math.random() * (this.numberOfColumns - 1));
            let row = Math.round(Math.random() * (this.numberOfRows - 1));
            if (!(this.cells[column][row].isMine)) {
                this.cellsWithMines.push(this.cells[column][row]);
                this.cells[column][row].addMine();
                this.cells[column][row].value = -1
                mines--;
            }
        }
    }
    showMines() {
        this.cellsWithMines.forEach(cell => {
            if (!cell.isFlagged) {
                let image = document.createElement("img")
                image.setAttribute('src', './assets/bomb.svg');
                let bomb = document.querySelector(cell.selector).appendChild(image);
                bomb.classList.add("bomb")
            }
        })
    }
    checkGameResult() {
        const allCellsToReveal = this.numberOfColumns * this.numberOfRows - this.numberOfMines;
        if (this.numberOfRevealCells === allCellsToReveal) {
            this.Menu.setWin();
            this.endCurrentGame();
        } else if (this.currentCell.isMine) this.Menu.setLoss();
    }
    endCurrentGame = () => {
        this.Timer.stopTimer();
        this.Menu.endGame();
        this.showMines();
        this.Menu.changeMenuContent();
        this.isFistGame = false;

    }
    getCell() {
        let rowNumber;
        let columnNumber;
        const element = (event.target.localName === "img" || event.target.localName === "p") ? event.target.parentElement : event.target;
        rowNumber = parseInt(element.getAttribute('data-x'), 10);
        columnNumber = parseInt(element.getAttribute('data-y'), 10);

        return this.cells[columnNumber][rowNumber];
    }
    updateCellAfterFlag() {
        if (this.currentCell.isFlagged && !(event.target.hasChildNodes())) {
            let image = document.createElement("img")
            image.setAttribute('src', './assets/flag.svg');
            event.target.appendChild(image);
        }
    }
    revealCurrentCell(cell) {
        if (!cell.isReveal) {
            cell.revealCell()
                ++this.numberOfRevealCells;
            this.checkGameResult();
            document.querySelector(cell.selector).classList.remove('border--concave');
            document.querySelector(cell.selector).classList.add('border--revealCell');
        }
    }
    releaveNeighbor(x, y) {
        let cellToCheck = this.cells[y][x];
        this.revealCurrentCell(cellToCheck)
        if (cellToCheck.value === 0) {
            this.neibghorCells(cellToCheck, "revealCell")
        }

    }
    checkNeighborCells(cell) {
        if (cell.value === 0) {
            this.neibghorCells(cell, "revealCell")
        }
        this.revealCurrentCell(cell)
    }

    handleRevealCellAndStartTimer() {
        if (!this.Timer.isStarted) this.Timer.startTimer()
        this.currentCell = this.getCell();
        if (!this.currentCell.isFlagged) {
            if (this.currentCell.isMine) {
                this.checkGameResult();
                this.endCurrentGame();
            } else {
                this.checkNeighborCells(this.currentCell);
            }
        }
    }
    handleFlagCell() {

        this.currentCell = this.getCell();
        if (this.Counter.numberOfMines > 0 || this.currentCell.isFlagged) {
            this.currentCell.toggleFlag();
            this.Counter.updateNumberOfMines(this.currentCell);
            if (!(this.currentCell.isReveal)) {
                if (event.target.localName === "img") event.target.remove();
                else this.updateCellAfterFlag();
            }
        } else alert("Maximum number of flags are reached")
    }
    addButtonsEventListeners() {
        document.querySelectorAll(".cell").forEach(cell => cell.addEventListener('click', () => this.handleRevealCellAndStartTimer()));
        document.querySelectorAll(".cell").forEach(cell => cell.addEventListener('contextmenu', () => this.handleFlagCell()))

        document.querySelectorAll(".easy").forEach(cell => cell.addEventListener('click', () => {
            this.isFistGame = false;
            this.initializeGame(this.level.easy.rows,
                this.level.easy.columns,
                this.level.easy.mines)
        }))
        document.querySelectorAll(".normal").forEach(cell => cell.addEventListener('click', () => {
            this.isFistGame = false;
            this.initializeGame(this.level.normal.rows,
                this.level.normal.columns,
                this.level.normal.mines)
        }))
        document.querySelectorAll(".expert").forEach(cell => cell.addEventListener('click', () => {
            this.isFistGame = false;
            this.initializeGame(this.level.expert.rows,
                this.level.expert.columns,
                this.level.expert.mines)
        }))
        document.querySelector('.modalButton').addEventListener('click', () => this.newGame())
    }
}
window.onload = function () {
    const game = new Game();
    game.initializeGame();
};