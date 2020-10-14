class Game {

    config = {
        //information taken from wikipedia
        easy: {
            rows: 8,
            columns: 9,
            mines: 10
        },
        normal: {
            rows: 16,
            columns: 16,
            mines: 40
        },
        hard: {
            rows: 16,
            columns: 30,
            mines: 99
        }
    }
    constructor() {
        this.numberOfRows = 0;
        this.numberOfColumns = 0;
        this.numberOfMines = 0;
    }
    drawCells(rows = this.config.easy.rows, columns = this.config.easy.columns, mines = this.config.easy.mines) {
        this.numberOfRows = rows;
        this.numberOfColumns = columns;
        this.numberOfMines = mines;
        console.log(this.numberOfMines);

    }
    initializeGame() {
        this.drawCells()
    }
}
window.onload = function () {
    const game = new Game();
    game.initializeGame();
}