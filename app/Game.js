import {
    Cell
} from './Cell.js'
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

    constructor() {
        this.numberOfRows = 0;
        this.numberOfColumns = 0;
        this.numberOfMines = 0;
        this.cells = [];
        this.allCells = [];
        this.cellsWithMines = [];
        this.currentCell = null;
        this.cellsToReveal = [];
    }

    initializeGame() {
        this.setLevel();
        this.renderBoard();
        this.allCells = this.cells.flat();
        this.allCells.forEach(cell => cell.createElement());
        this.addMines();
        this.getAllCellsToReveal();
        this.addValuesToCells();
        this.actionsOnCells();
    }
    setLevel(row = this.level.normal.rows,
        column = this.level.normal.columns,
        mine = this.level.normal.mines) {
        this.numberOfRows = row;
        this.numberOfColumns = column;
        this.numberOfMines = mine;
    }
    getAllCellsToReveal() {
        this.allCells.forEach(
            cell => {
                if (!cell.isMine) {
                    this.cellsToReveal.push(cell)
                }
            })
    }
    renderBoard = () => {
        for (let row = 0; row < this.numberOfRows; row++) {
            this.cells[row] = [];
            for (let column = 0; column < this.numberOfColumns; column++) {
                this.cells[row].push(new Cell(column, row))
            }
        }
    }
    AddValueToCell(x, y) {
        console.log(x + "  +  " + y);
        let cellToCheck = this.cells[y][x];
        if (!(cellToCheck.isMine)) {
            cellToCheck.value += 1
        }
    }
    mainConditions(cell, x, y, value, action = "addValue") {
        if ((cell.x > 0 && value === "left") ||
            (cell.x < this.numberOfColumns - 1 && value === "right") ||
            (cell.y > 0 && value === "top") ||
            (cell.y < this.numberOfRows - 1 && value === "bottom")) {
            if (action === "addValue") this.AddValueToCell(x, y)
            else {
                if (!this.cells[y][x].isReveal)
                    this.releaveNeighbor(x, y)
            }
        }
    }
    sideConditions(cell, x, y, value, action = "addValue") {
        if ((cell.x > 0 && cell.y > 0 && value === "left-top") ||
            (cell.x > 0 && cell.y < this.numberOfRows - 1 && value === "left-bottom") ||
            (cell.x < this.numberOfColumns - 1 && cell.y > 0 && value === "right-top") ||
            (cell.x < this.numberOfColumns - 1 && cell.y < this.numberOfRows - 1 && value === "right-bottom"))
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
        //this.allCells.forEach(cell => cell.addValue())
    }
    addMines = (mines = this.numberOfMines) => {
        while (mines > 0) {
            let column = Math.round(Math.random() * (this.numberOfColumns - 1));
            let row = Math.round(Math.random() * (this.numberOfRows - 1));
            console.log(column + " + " +
                row);
            if (!(this.cells[row][column].isMine)) {
                this.cellsWithMines.push(this.cells[row][column]);
                this.cells[row][column].addMine();
                this.cells[row][column].value = -1
                mines--;
            }
        }
    }

    endCurrentGame = () => {
        if (this.currentCell.isMine) {
            this.cellsWithMines.forEach(cell => {
                let image = document.createElement("img")
                image.setAttribute('src', './assets/bomb.svg');
                let bomb = document.querySelector(cell.selector).appendChild(image);
                bomb.classList.add("bomb")
            })
        }
    }
    getCell() {
        let rowNumber;
        let columnNumber;
        const element = (event.target.localName === "img" || event.target.localName === "p") ? event.target.parentElement : event.target;
        rowNumber = parseInt(element.getAttribute('data-x'), 10);
        columnNumber = parseInt(element.getAttribute('data-y'), 10);

        return this.cells[columnNumber][rowNumber];
    }
    updateCell(cell) {
        console.log(cell);

        if (cell.isReveal) {
            document.querySelector(cell.selector).classList.remove('border--concave');
            document.querySelector(cell.selector).classList.add('border--revealCell');
        }
        if (this.currentCell.isFlagged && !(event.target.hasChildNodes())) {
            let image = document.createElement("img")
            image.setAttribute('src', './assets/flag.svg');
            event.target.appendChild(image);
        }
    }
    revealCurrentCell(cell) {
        cell.revealCell()
        document.querySelector(cell.selector).classList.remove('border--concave');
        document.querySelector(cell.selector).classList.add('border--revealCell');
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
            setTimeout(() => {
                this.neibghorCells(cell, "revealCell")
            }, 1)
        }
        this.revealCurrentCell(cell)
    }

    handleRevealCell() {
        this.currentCell = this.getCell();
        if (this.currentCell.isMine) this.endCurrentGame()
        else {
            this.checkNeighborCells(this.currentCell);
            // console.log(this.cellsToReveal);
            //this.cellsToReveal.forEach(cell => {
            //    cell.revealCell();
            //    this.updateCell(cell);
            //})

        }
    }
    handleFlagCell() {
        this.currentCell = this.getCell();
        this.currentCell.toggleFlag();
        if (!(this.currentCell.isReveal)) {
            if (event.target.localName === "img") event.target.remove();
            else this.updateCell();
        }
    }
    actionsOnCells() {
        document.querySelectorAll(".cell").forEach(cell => cell.addEventListener('click', () => this.handleRevealCell()));
        document.querySelectorAll(".cell").forEach(cell => cell.addEventListener('contextmenu', () => this.handleFlagCell()))
    }
}
window.onload = function () {
    const game = new Game();
    game.initializeGame();
};