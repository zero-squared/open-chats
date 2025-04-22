import { Server } from 'socket.io';

let io;

export function initializeSockets(webServer, sessionMiddleware) {
    io = new Server(webServer);

    io.engine.use(sessionMiddleware);

    io.on("connection", (socket) => {
        const session = socket.request.session;

        console.log(session);
    });
}

export function sendMessage(username, message) {
    io.emit('newMessage', {
        username,
        message
    });
}