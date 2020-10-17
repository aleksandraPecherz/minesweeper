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
            rows: 16,
            columns: 30,
            mines: 99,
        },
    };

    constructor() {
        this.numberOfRows = 0;
        this.numberOfColumns = 0;
        this.numberOfMines = 0;
        this.cells = [];
        this.allCells = [];
        this.currentCell = null;
    }

    initializeGame() {
        this.renderBoard();
        this.actionsOnCells();
    }

    renderBoard(row = this.level.easy.rows,
        column = this.level.easy.columns,
        mine = this.level.easy.mines) {
        this.numberOfRows = row;
        this.numberOfColumns = column;
        this.numberOfMines = mine;
        for (let i = 0; i < this.numberOfRows; i++) {
            for (let j = 0; j < this.numberOfColumns; j++) {
                this.cells.push(new Cell(i, j))
            }
        }
    }

    getCell() {
        let rowNumber;
        let columnNumber;
        const element = event.target.localName !== "img" ? event.target : event.target.parentElement;
        rowNumber = parseInt(element.getAttribute('data-x'), 10);
        columnNumber = parseInt(element.getAttribute('data-y'), 10);
        return this.cells[rowNumber + columnNumber * this.numberOfRows];
    }
    updateCell() {
        if (this.currentCell.isReveal) {
            event.target.classList.remove('border--concave');
            event.target.classList.add('border--revealCell');
        }
        if (this.currentCell.isFlagged && !(event.target.hasChildNodes())) {
            let image = document.createElement("img")
            image.setAttribute('src', './assets/flag.svg');
            event.target.appendChild(image);
        }
    }
    revealCurrentCell() {
        this.currentCell = this.getCell();
        this.currentCell.revealCell();
        this.updateCell();
    }
    flagCurrentCell() {
        this.currentCell = this.getCell();
        this.currentCell.toggleFlag();
        if (!(this.currentCell.isReveal)) {
            if (event.target.localName === "img") event.target.remove();
            else this.updateCell();
        }
    }
    actionsOnCells() {
        this.cells.forEach(cell => cell.createElement())
        document.querySelectorAll(".cell").forEach(cell => cell.addEventListener('click', () => this.revealCurrentCell()));
        document.querySelectorAll(".cell").forEach(cell => cell.addEventListener('contextmenu', () => this.flagCurrentCell()))
    }
}
window.onload = function () {
    const game = new Game();

    game.initializeGame();
};