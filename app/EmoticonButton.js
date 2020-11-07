export class EmoticonButton {
    constructor() {
        this.onlyOnClick = false;
    }
    emoticon = document.querySelector(".headerButton use");
    changeEmoticon(result) {
        console.log(this.emoticon);
        this.emoticon.setAttribute('href', `./assets/sprite.svg#${result}`);
    }
}