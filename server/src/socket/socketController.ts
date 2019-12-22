import { Application } from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';

export const socketEvents = {
    registerUser: 'registerUser'
};

export const emitableEvents = {
    isAdmin: 'isAdmin'
};

export default class SocketController {
    app: Application;
    io: socketIO.Server;
    httpServer: http.Server;
    registeredUsers: Array<string>;

    constructor(app: Application) {
        this.app = app;
        this.registeredUsers = [];

        this.httpServer = http.createServer(this.app);
        this.io = socketIO(this.httpServer);
        this.io.on('connection', socket => {
            socket.on('disconnect', function() {
                //TODO remove user
                console.log('A user disconnected!');
            });
            socket.on(
                socketEvents.registerUser,
                (name: string, nameTakenCallback) => {
                    const nameTaken = this.registeredUsers.includes(name);

                    if (nameTaken) {
                        nameTakenCallback(true);
                    } else {
                        this.registeredUsers.push(name);
                        if (name === process.env.PASSWORD) {
                            socket.emit(emitableEvents.isAdmin, true);
                            nameTakenCallback(false);
                        } else {
                            socket.emit(emitableEvents.isAdmin, false);
                            nameTakenCallback(false);
                        }
                    }
                }
            );
        });
        this.httpServer.listen(4000, function() {
            console.log('test listen');
        });
    }
}
