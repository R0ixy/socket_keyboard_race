import {socket} from "../game.mjs";
import {changeReadyStatus, setProgress} from "../views/user.mjs";
import {onKeyDown, startGame, timer} from "./gameProcess.mjs";
import {onGameEnd} from "./afterGame.mjs";
import {newBotMessage, showBot} from "./comments-bot.mjs";

const username = sessionStorage.getItem('username');

const ReadyButton = document.getElementById('ready-btn');
ReadyButton.addEventListener('click', () => {
    if (ReadyButton.innerText === 'READY') {
        socket.emit('user-ready', username);
        changeReadyStatus({username, ready: true});
        ReadyButton.innerText = 'NOT READY';
    } else {
        socket.emit('user-not-ready', username);
        changeReadyStatus({username, ready: false});
        ReadyButton.innerText = 'READY';
    }
});

socket.on('user-ready', username => {
    changeReadyStatus({username, ready: true});
});

socket.on('user-not-ready', username => {
    changeReadyStatus({username, ready: false});
});

socket.on('all-users-ready', (timerValue, gameTimer, textId) => {
    startGame(timerValue, gameTimer, textId);
    showBot();
});

socket.on('user-progress', (username, progress) => {
    setProgress({username, progress});
});

socket.on('game-over', winners =>{
    clearTimeout(timer);
    document.removeEventListener('keydown', onKeyDown);
    newBotMessage(winners);
    onGameEnd();
});

socket.on('new-message', message => {
    newBotMessage(message);
});