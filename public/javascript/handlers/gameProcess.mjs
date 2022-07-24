import {setProgress} from "../views/user.mjs";
import {socket} from "../game.mjs";
import {addClass, removeClass} from "../helpers/domHelper.mjs";

let text;
let gameTimerValue;
let letterIndex;

const timerElement = document.getElementById('timer');

export const startGame = (timerValue, gameTimer, textId) => {
    gameTimerValue = gameTimer;
    removeClass(timerElement, 'display-none');
    addClass(document.getElementById('ready-btn'), 'display-none');
    addClass(document.getElementById('quit-room-btn'), 'display-none');

    getText(textId).then(res => {
        document.getElementById('text-container').innerHTML =
            '<span style="text-decoration: underline dotted lightgreen;">' + res.text[0] + '</span >' + res.text.slice(1);
        text = res.text;
    });
    letterIndex = 0;
    countdown(timerValue, showText, timerElement);
}

const gameTimerElement = document.getElementById('game-timer-seconds');

export let timer;

const countdown = (timerValue, func, timerElement) => {
    timerElement.innerText = timerValue;
    timerValue--;
    if (timerValue < 0) {
        clearTimeout(timer);
        func();
    } else {
        timer = setTimeout(countdown, 1000, timerValue, func, timerElement);
    }
}

const showText = () => {
    addClass(timerElement, 'display-none');
    removeClass(document.getElementById('text-container'), 'display-none');
    document.addEventListener('keydown', onKeyDown);
    removeClass(document.getElementById('game-timer'), 'display-none');
    countdown(gameTimerValue, onTimeUp, gameTimerElement);
}

const onTimeUp = () => {
    clearTimeout(timer);
    document.removeEventListener('keydown', onKeyDown);
    socket.emit('time-is-up');
}


const getText = async (textId) => {
    const res = await fetch(`/game/texts/${textId}`)
    if (res && res.ok) {
        return await res.json();
    }
}

export const onKeyDown = ev => {
    if (text[letterIndex] === ev.key) {
        document.getElementById('text-container').innerHTML =
            '<span style="background-color: lightgreen;">' + text.slice(0, letterIndex + 1) + '</span >'
            + '<span style="text-decoration: underline dotted lightgreen;">' + text.slice(letterIndex + 1, letterIndex + 2) + '</span >'
            + text.slice(letterIndex + 2);
        letterIndex++;
        const progress = letterIndex * 100 / text.length;
        const lettersLeft = text.length - letterIndex;
        changeProgressBar(progress, lettersLeft)
    }
}


const username = sessionStorage.getItem('username');

const changeProgressBar = (progress, lettersLeft) => {
    setProgress({username, progress});
    socket.emit('change-user-progress', username, progress, lettersLeft);
}