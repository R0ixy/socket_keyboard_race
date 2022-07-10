import {setProgress} from "../views/user.mjs";
import {socket} from "../game.mjs";

let text;

export const startGame = (timerValue, textId) => {
    timerElement.classList.remove('display-none');
    document.getElementById('ready-btn').classList.add('display-none');
    document.getElementById('quit-room-btn').classList.add('display-none');

    getText(textId).then(res => {
        document.getElementById('text-container').innerHTML =
            '<span style="text-decoration: underline dotted lightgreen;">' + res.text[0] + '</span >' + res.text.slice(1);
        text = res.text;
    });

    countdown(timerValue);
}


const timerElement = document.getElementById('timer');
let timer;

const countdown = timerValue => {
    timerElement.innerText = timerValue;
    timerValue--;
    if (timerValue < 0) {
        clearTimeout(timer);
        timerElement.classList.add('display-none');
        document.getElementById('text-container').classList.remove('display-none');
        document.addEventListener('keydown', onKeyDown);
    } else {
        timer = setTimeout(countdown, 1000, timerValue);
    }
}

const getText = async (textId) => {
    const res = await fetch(`/game/texts/${textId}`)
    if (res && res.ok) {
        return await res.json();
    }
}

let i = 0;
const onKeyDown = ev => {
    if (text[i] === ev.key) {
        document.getElementById('text-container').innerHTML =
            '<span style="background-color: lightgreen;">' + text.slice(0, i + 1) + '</span >'
            + '<span style="text-decoration: underline dotted lightgreen;">' + text.slice(i + 1, i + 2) + '</span >'
            + text.slice(i + 2);
        i++;
        const progress = i * 100 / text.length;
        changeProgressBar(progress)
    }
}


const username = sessionStorage.getItem('username');

const changeProgressBar = progress => {
    setProgress({username, progress});
    socket.emit('change-user-progress', username, progress);
}