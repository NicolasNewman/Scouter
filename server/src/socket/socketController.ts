import { Application } from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import { logger } from '../utils/logger';
import Game from '../models/gameModel';
import Timer from '../utils/Timer';
import { gameProperties } from '../types/gameTypes';

export const socketEvents = {
    registerUser: 'registerUser',
    getUsers: 'getUsers',
    adminFormSubmited: 'adminFormSubmited',
    scoutingFormSubmited: 'scoutingFormSubmited',
    getRemainingTime: 'getRemainingTime'
};

export const emitableEvents = {
    isAdmin: 'isAdmin',
    sendUsers: 'sendUsers',
    assignScout: 'assignScout',
    scoutFinished: 'scoutFinished'
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
    [target: string]: [
        {
            team: string;
            alliance: 'red' | 'blue';
            seed: 's1' | 's2' | 's3';
        }
    ];
}

export default class SocketController {
    app: Application;
    io: socketIO.Server;
    httpServer: http.Server;
    registeredUsers: Array<string>;
    idToUserMap: IIDtoUserMap;
    userToIdMap: IIDtoUserMap;
    adminPassword: string;
    timer: Timer;

    constructor(app: Application) {
        this.app = app;
        this.registeredUsers = [];
        this.idToUserMap = {};
        this.userToIdMap = {};
        this.adminPassword = '';

        this.timer = new Timer();
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
                            this.adminPassword = process.env.PASSWORD;
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
            socket.on(socketEvents.scoutingFormSubmited, identifier => {
                console.log(`Identifier is: ${identifier}`);
                console.log(
                    `sending to ${this.adminPassword} with id ${
                        this.userToIdMap[this.adminPassword]
                    }`
                );

                const id = this.userToIdMap[this.adminPassword];
                this.io.to(id).emit(emitableEvents.scoutFinished, identifier);
            });
            /**
             * Sends the client the remaining time left in a game and the phase the game is in
             */
            socket.on(socketEvents.getRemainingTime, (_data, timeCallback) => {
                const remainingTime = this.timer.getEllapsedCountdownInSec(
                    gameProperties.matchDuration
                );
                const timeLeft = this.timer.getEllapsedTimeInSec();
                let phase;
                if (timeLeft <= gameProperties.autoDuration) {
                    phase = 'AUTO';
                } else if (
                    timeLeft <= gameProperties.teleopDuration ||
                    timeLeft <= gameProperties.endgame.start
                ) {
                    phase = 'TELEOP';
                } else {
                    phase = 'ENDGAME';
                }
                timeCallback(remainingTime, phase);
            });
            /**
             * Received once the admin has submitted their data and the scouting session is ready to begin
             */
            socket.on(
                socketEvents.adminFormSubmited,
                (formValues: IAdminFormState, callback) => {
                    // Make sure the match doesn't already exist
                    Game.findOne({
                        matchNumber: formValues.matchNumber
                    })
                        .then(game => {
                            if (game) {
                                callback(
                                    true,
                                    `A game with match number ${formValues.matchNumber} already exists. If overwriting, please remove the old one`
                                );
                            } else {
                                let key: keyof IAdminFormState;
                                // Will hold a map of usernames to the teams they are scouting
                                const teamsForUser: IScoutingTargets = {};
                                for (key in formValues) {
                                    if (key.includes('scout')) {
                                        const scout = formValues[key];
                                        const teamKey: keyof IAdminFormState = key.replace(
                                            'scout',
                                            'team'
                                        );
                                        const team = formValues[teamKey];
                                        const splitFields = key.split('-', 3);
                                        const alliance =
                                            splitFields[0] === 'r'
                                                ? 'red'
                                                : 'blue';
                                        const seed =
                                            splitFields[1] !== 's1' &&
                                            splitFields[1] !== 's2' &&
                                            splitFields[1] !== 's3'
                                                ? 's1'
                                                : splitFields[1];

                                        logger.info(
                                            `${scout} is scouting the team ${team} which is seed ${seed} on the ${alliance} alliance`
                                        );

                                        if (teamsForUser[scout]) {
                                            teamsForUser[scout].push({
                                                team,
                                                alliance,
                                                seed
                                            });
                                        } else {
                                            teamsForUser[scout] = [
                                                { team, alliance, seed }
                                            ];
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
                                this.timer.start();
                                Game.create({
                                    matchNumber: formValues.matchNumber
                                }).then(_game => {
                                    callback(false);
                                });
                            }
                        })
                        .catch(err => {
                            logger.error(err);
                        });
                }
            );
        });
        this.httpServer.listen(4000, function() {
            console.log('test listen');
        });
    }
}
