export class Counter {
    constructor() {
        this.numberOfMines = null;
    }
    startCounter(number) {
        this.numberOfMines = number;
        this.init()
    }
    init() {
        document.querySelector(".mineCounter").innerHTML = this.numberOfMines;
    }
    updateNumberOfMines(cell) {
        if (cell.isFlagged) this.numberOfMines--
        else if (!cell.isReveal) {
            this.numberOfMines++
        }
        this.init();
    }
}