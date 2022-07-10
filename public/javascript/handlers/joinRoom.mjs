export const joinRoom = (roomName, socket, username) => {
    socket.emit('user-join', roomName, username);
}

export const onQuitRoom = (socket, username) => {
    const users = document.querySelectorAll('.user');
    users.forEach(box => {
        box.remove();
    });
    socket.emit('user-quit-room', username);
    document.getElementById('rooms-page').classList.remove('display-none');
    document.getElementById('game-page').classList.add('display-none');
}