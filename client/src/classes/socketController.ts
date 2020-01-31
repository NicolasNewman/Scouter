import * as socketIOClient from "socket.io-client";
import store from "../entrypoints/home";
// import { Store } from "redux";
import { setAdminStatus } from "../actions/user";
import { setScoutingTargets } from "../actions/scouting";
import { setScoutStatus } from "../actions/admin";

import { message } from "antd";

export const socketEvents = {
  isAdmin: "isAdmin",
  assignScout: "assignScout",
  scoutFinished: "scoutFinished"
};

export const emitableEvents = {
  registerUser: "registerUser",
  getUsers: "getUsers",
  adminFormSubmited: "adminFormSubmited",
  scoutingFormSubmited: "scoutingFormSubmited",
  getRemainingTime: "getRemainingTime"
};

export interface IScoutingTarget {
  team: string;
  alliance: "red" | "blue";
  seed: "s1" | "s2" | "s3";
}

export type ScoutingTargets = Array<IScoutingTarget>;

export type ScoutIdentifier =
  | "r-s1-scout"
  | "r-s2-scout"
  | "r-s3-scout"
  | "b-s1-scout"
  | "b-s2-scout"
  | "b-s3-scout";

interface IAssignScoutPacket {
  teams: ScoutingTargets;
  matchNumber: number;
}

export class SocketController {
  socket: SocketIOClient.Socket;
  constructor(address: string) {
    this.socket = socketIOClient(address);
    /**
     * Received once the server has verified wheather or not this user is an admin
     */
    this.socket.on(socketEvents.isAdmin, (isAdmin: boolean) => {
      console.log(`The admin status is ${isAdmin}`);
      if (isAdmin) {
        store.dispatch(setAdminStatus(true));
      }
    });
    /**
     * Received once the server has pre-configured the database for a game and has sent each scout their targets
     */
    this.socket.on(socketEvents.assignScout, (data: IAssignScoutPacket) => {
      console.log(`You are scouting ${data.teams}`);
      console.log(`With match number ${data.matchNumber}`);
      console.log(data.teams);

      store.dispatch(setScoutingTargets(data.teams, data.matchNumber));
      message.info("The scouting form is now active!");
    });

    /**
     * Used to notify the admin once a scout has finished
     */
    this.socket.on(
      socketEvents.scoutFinished,
      (identifier: ScoutIdentifier) => {
        console.log(
          `Received socket event scoutFinished with data: ${identifier}`
        );

        store.dispatch(setScoutStatus(identifier, true));
      }
    );
  }

  emit = (event: string, data: any, func?: (...args: any[]) => void): void => {
    console.log(`Emiting: ${event}`);

    this.socket.emit(event, data, func);
  };
}
