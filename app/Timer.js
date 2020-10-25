export class Timer {
    constructor() {
        this.timeFromBeginning = 0;
        this.isStarted = false;
        this.interval = null;
    }
    startTimer() {
        this.interval = setInterval(() => this.updateTime(), 1000)
        this.isStarted = true;
    }
    init() {
        document.querySelector(".timeCounter").innerHTML = this.timeFromBeginning;
    }
    updateTime() {
        console.log(this.timeFromBeginning);
        this.init()
        this.timeFromBeginning++;
    }
}