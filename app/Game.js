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
        this.cellsWithMines = [];
        this.currentCell = null;
    }

    initializeGame() {
        this.renderBoard();
        this.addMines();   
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
    addMines= (mines = this.numberOfMines) => { 
        while (mines>0){       
            let column = Math.round(Math.random()*(this.numberOfColumns-1));
            let row = Math.round(Math.random()*(this.numberOfRows-1));
            let currentCell = this.cells.filter(cell=> (cell.x===row && cell.y===column && !(cell.isMine)));
            if (currentCell.length>0){
                this.cellsWithMines.push(currentCell[0]);
                currentCell[0].addMine();
                mines--;
            }
        } 
    }
    endCurrentGame = () => {
        if (this.currentCell.isMine){
            console.log(this.cellsWithMines);
            
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
    handleRevealCell() {
        this.currentCell = this.getCell();
        this.currentCell.revealCell();
        console.log(this.currentCell);
        
        (this.currentCell.isMine) ? this.endCurrentGame() : this.updateCell();
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
        this.cells.forEach(cell => cell.createElement())
        document.querySelectorAll(".cell").forEach(cell => cell.addEventListener('click', () => this.handleRevealCell()));
        document.querySelectorAll(".cell").forEach(cell => cell.addEventListener('contextmenu', () => this.handleFlagCell()))
    }
}
window.onload = function () {
    const game = new Game();
    game.initializeGame();
};