import { Application } from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import { logger } from '../utils/logger';
import Game from '../models/gameModel';
import Match from '../models/matchModel';
import Team from '../models/teamModel';
import Timer from '../utils/Timer';
import { gameProperties } from '../types/gameTypes';
// import { IMatch } from '../models/matchModel';

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
                                const gameObj = {
                                    matchNumber: formValues.matchNumber,
                                    red: {
                                        s1: undefined,
                                        s2: undefined,
                                        s3: undefined,
                                        teamEvents: []
                                    },
                                    blue: {
                                        s1: undefined,
                                        s2: undefined,
                                        s3: undefined,
                                        teamEvents: []
                                    }
                                };

                                Game.create(gameObj).then(async gameDoc => {
                                    let key: keyof IAdminFormState;
                                    // Will hold a map of usernames to the teams they are scouting
                                    // NOTE THAT THIS IS TECHNICALLY NO LONGER NEEDED as the re-work made it so there is 1 team per scout as opposed to multiple
                                    const teamsForUser: IScoutingTargets = {};

                                    // Loop through the different fields for the submitted admin form
                                    for (key in formValues) {
                                        // If the field is for a scout
                                        if (key.includes('scout')) {
                                            const scout = formValues[key];

                                            // Reverse the scout key to get the corrosponding team key ('r-s1-team' v. 'r-s1-scout')
                                            const teamKey: keyof IAdminFormState = key.replace(
                                                'scout',
                                                'team'
                                            );

                                            const teamNumber =
                                                formValues[teamKey];

                                            // Get the document for the team of this iteration
                                            const teamDoc = await Team.findOne({
                                                teamNumber
                                            });
                                            console.log(
                                                'Checking if team doc exists...'
                                            );

                                            if (teamDoc) {
                                                logger.info(
                                                    `Found team #${teamDoc?.teamNumber}`
                                                );

                                                // Keys are stored as alliance-seed-type and can be split to get specific information
                                                const splitFields = key.split(
                                                    '-',
                                                    3
                                                );

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
                                                    `${scout} is scouting the team ${teamNumber} which is seed ${seed} on the ${alliance} alliance`
                                                );

                                                const matchObj = {
                                                    matchNumber: parseInt(
                                                        formValues.matchNumber
                                                    ),
                                                    teamNumber: parseInt(
                                                        teamNumber
                                                    ),
                                                    alliance,
                                                    robotEvents: [],
                                                    robotState: []
                                                };
                                                const matchDoc = await Match.create(
                                                    matchObj
                                                );
                                                logger.info('Created match');
                                                logger.info(matchDoc);

                                                // Push the newly created match's ObjectID to the team's match list
                                                teamDoc.matches.push(
                                                    matchDoc._id
                                                );
                                                logger.info(
                                                    'Saving teamDoc...'
                                                );

                                                await teamDoc.save();
                                                logger.info(
                                                    `Saved match #${matchObj.matchNumber} to team ${teamDoc.teamNumber}`
                                                );

                                                // Update the game document's match for the corrosponding seed and alliance
                                                const loc = `${alliance}.${seed}`;
                                                logger.info(
                                                    `Updating the game with match id ${matchDoc._id} at location ${loc}`
                                                );
                                                console.log(gameDoc);
                                                const temp = await gameDoc.update(
                                                    {
                                                        $set: {
                                                            [loc]: matchDoc._id
                                                        }
                                                    }
                                                ); //TODO NOT WORKING - testing by logging temp
                                                console.log(temp);

                                                // push the team the user needs to scout to their object map
                                                if (teamsForUser[scout]) {
                                                    teamsForUser[scout].push({
                                                        team: teamNumber,
                                                        alliance,
                                                        seed
                                                    });
                                                } else {
                                                    teamsForUser[scout] = [
                                                        {
                                                            team: teamNumber,
                                                            alliance,
                                                            seed
                                                        }
                                                    ];
                                                }

                                                // Loop through each user's team map and send them their corrosponding info
                                                for (key in teamsForUser) {
                                                    this.io
                                                        .to(
                                                            this.userToIdMap[
                                                                key
                                                            ]
                                                        )
                                                        .emit(
                                                            emitableEvents.assignScout,
                                                            {
                                                                teams:
                                                                    teamsForUser[
                                                                        key
                                                                    ],
                                                                matchNumber:
                                                                    formValues.matchNumber
                                                            }
                                                        );
                                                }

                                                this.timer.start();
                                                callback(false);
                                            }
                                        }
                                    }
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
