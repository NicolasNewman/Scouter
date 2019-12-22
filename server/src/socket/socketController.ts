import { Application } from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import { logger } from '../utils/logger';

export const socketEvents = {
    registerUser: 'registerUser'
};

export const emitableEvents = {
    isAdmin: 'isAdmin'
};

interface IIDtoUserMap {
    [key: string]: string;
}

export default class SocketController {
    app: Application;
    io: socketIO.Server;
    httpServer: http.Server;
    registeredUsers: Array<string>;
    idToUserMap: IIDtoUserMap;

    constructor(app: Application) {
        this.app = app;
        this.registeredUsers = [];
        this.idToUserMap = {};

        this.httpServer = http.createServer(this.app);
        this.io = socketIO(this.httpServer);
        this.io.on('connection', socket => {
            logger.log('info', `User ${socket.id} connected`);
            socket.on('disconnect', () => {
                const name = this.idToUserMap[socket.id];
                this.registeredUsers = this.registeredUsers.filter(
                    e => e !== name
                );
                logger.log(
                    'info',
                    `User ${socket.id} disconnected. Removing ${name} form the user list`
                );
                console.log();
            });
            socket.on(
                socketEvents.registerUser,
                (name: string, nameTakenCallback) => {
                    const nameTaken = this.registeredUsers.includes(name);

                    if (nameTaken) {
                        nameTakenCallback(true);
                    } else {
                        this.registeredUsers.push(name);
                        this.idToUserMap[socket.id] = name;
                        logger.log(
                            'info',
                            `User ${socket.id} registered as ${name}`
                        );
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
