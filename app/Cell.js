export class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = 0;
        this.isMine = false;
        this.isReveal = false;
        this.isFlagged = false;
        this.selector = `[data-x="${this.x}"][data-y="${this.y}"]`;
        this.element = null;
    }
    board = document.querySelector('.gameBoard');
    createElement() {
        const element = document.createElement('div');
        element.classList.add('cell');
        element.classList.add('border');
        element.classList.add('border--concave')
        element.dataset.x = `${this.x}`
        element.dataset.y = `${this.y}`
        this.board.appendChild(element);
    }
    toggleFlag() {
        if (!(this.isReveal)) this.isFlagged = !(this.isFlagged);
    }

    revealCell() {
        this.isReveal = true;

    }

    addMine() {}
}