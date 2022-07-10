import {makeAllUsersUnready, clearProgress} from "../views/user.mjs";
import {addClass, removeClass} from "../helpers/domHelper.mjs";

export const onGameEnd = () => {
    makeAllUsersUnready();
    clearProgress();
    const ReadyButton = document.getElementById('ready-btn')
    removeClass(ReadyButton, 'display-none');
    ReadyButton.innerText = 'READY';
    removeClass(document.getElementById('quit-room-btn'), 'display-none');
    addClass(document.getElementById('text-container'), 'display-none');
    addClass(document.getElementById('game-timer'), 'display-none');
    addClass(document.getElementById('timer'), 'display-none');
}
