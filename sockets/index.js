import { Server } from 'socket.io';

let io = null;

export function initializeSockets(webServer, sessionMiddleware) {
    io = new Server(webServer);

    io.engine.use(sessionMiddleware);

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }

    return io;
}
