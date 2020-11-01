export class Menu {
    constructor() {
        this.isEndOfGame = false;
        this.isNewGame = false;
        this.isWin = false;
    }
    element = document.querySelector(".modal");
    elementContent = document.querySelector(".modalText");
    showMenu() {
        this.element.classList.remove('hide');
        this.element.style.zIndex = "0";
    }
    endGame() {
        this.showMenu()
        this.isEndOfGame = true;
    }
    hideMenu() {
        this.element.classList.add('hide');
        this.element.style.zIndex = "-1";
    }
    startAgain() {
        this.isEndOfGame = false;
        this.isNewGame = true;
        this.hideMenu();
    }
    setWin() {
        this.isWin = true;
    }
    setLoss() {
        this.isWin = false;
    }
    changeMenuContent() {
        if (this.isWin) this.elementContent.innerHTML = "You win!"
        else this.elementContent.innerHTML = "You loss"
    }
}