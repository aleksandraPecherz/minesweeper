export class Timer {
    constructor() {
        this.numberOfSeconds = 1;
        this.isStarted = false;
        this.interval = null;
        this.maximumNumberOfSeconds = 999;
    }
    restartTimer() {
        this.numberOfSeconds = 0;
    }
    startTimer() {
        this.interval = setInterval(() => this.updateTime(), 1000)
        this.isStarted = true;
    }
    init() {
        document.querySelector(".timeCounter").innerHTML = this.numberOfSeconds;
    }
    updateTime() {
        this.init()
        this.numberOfSeconds = this.numberOfSeconds + 1;
        if (this.numberOfSeconds === this.maximumNumberOfSeconds) this.stopTimer()
    }
    stopTimer() {
        if (this.numberOfSeconds === this.maximumNumberOfSeconds) {
            clearInterval(this.interval)
            alert("Maximum time is reached")
        } else {
            clearInterval(this.interval)
        }

    }
}