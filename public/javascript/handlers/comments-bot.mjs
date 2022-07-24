import {addClass, removeClass} from "../helpers/domHelper.mjs";

export const showBot = () =>{
    removeClass(document.getElementById('comments-container'), 'display-none');
}

export const newBotMessage = (message) => {
    document.getElementById('comments').innerText = message;
}

export const hideBot = () => {
    addClass(document.getElementById('comments-container'), 'display-none');
}