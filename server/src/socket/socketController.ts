import { Application } from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import { logger } from '../utils/logger';

export const socketEvents = {
    registerUser: 'registerUser',
    getUsers: 'getUsers',
    adminFormSubmited: 'adminFormSubmited'
};

export const emitableEvents = {
    isAdmin: 'isAdmin',
    sendUsers: 'sendUsers',
    assignScout: 'assignScout'
};

interface IIDtoUserMap {
    [key: string]: string;
}

export interface IAdminFormState {
    'r-s1-team': string;
    'r-s1-scout': string;
    'r-s2-team': string;
    'r-s2-scout': string;
    'r-s3-team': string;
    'r-s3-scout': string;
    'b-s1-team': string;
    'b-s1-scout': string;
    'b-s2-team': string;
    'b-s2-scout': string;
    'b-s3-team': string;
    'b-s3-scout': string;
    matchNumber: string;
    [key: string]: string;
}

interface IScoutingTargets {
    [target: string]: Array<string>;
}

export default class SocketController {
    app: Application;
    io: socketIO.Server;
    httpServer: http.Server;
    registeredUsers: Array<string>;
    idToUserMap: IIDtoUserMap;
    userToIdMap: IIDtoUserMap;

    constructor(app: Application) {
        this.app = app;
        this.registeredUsers = [];
        this.idToUserMap = {};
        this.userToIdMap = {};

        this.httpServer = http.createServer(this.app);
        this.io = socketIO(this.httpServer);
        this.io.on('connection', socket => {
            logger.log('info', `User ${socket.id} connected`);
            socket.on('disconnect', () => {
                const name = this.idToUserMap[socket.id];
                this.registeredUsers = this.registeredUsers.filter(
                    e => e !== name
                );
                delete this.idToUserMap[socket.id];
                delete this.userToIdMap[name];
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
                        this.userToIdMap[name] = socket.id;
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
            // Sends the client a list of connected users as a callback
            socket.on(
                socketEvents.getUsers,
                (_data: undefined, dataCallback) => {
                    dataCallback(this.registeredUsers);
                }
            );
            socket.on(
                socketEvents.adminFormSubmited,
                (formValues: IAdminFormState) => {
                    let key: keyof IAdminFormState;
                    const teamsForUser: IScoutingTargets = {};
                    for (key in formValues) {
                        if (key.includes('scout')) {
                            const scout = formValues[key];
                            const teamKey: keyof IAdminFormState = key.replace(
                                'scout',
                                'team'
                            );
                            const team = formValues[teamKey];
                            logger.info(`${scout} is scouting ${team}`);

                            if (teamsForUser[scout]) {
                                teamsForUser[scout].push(team);
                            } else {
                                teamsForUser[scout] = [team];
                            }
                        }
                    }
                    console.log(teamsForUser);

                    for (key in teamsForUser) {
                        this.io
                            .to(this.userToIdMap[key])
                            .emit(emitableEvents.assignScout, {
                                teams: teamsForUser[key],
                                matchNumber: formValues.matchNumber
                            });
                    }
                    // const s1Scout = formValues['r-s1-scout'];
                    // scoutToTeam[s1Scout] = formValues['r-s1-team'];
                }
            );
        });
        this.httpServer.listen(4000, function() {
            console.log('test listen');
        });
    }
}
