import * as socketIOClient from "socket.io-client";
import store from "../entrypoints/home";
// import { Store } from "redux";
import { setAdminStatus } from "../actions/user";
import { setScoutingTargets } from "../actions/scouting";

import { message } from "antd";

export const socketEvents = {
  isAdmin: "isAdmin",
  assignScout: "assignScout"
};

export const emitableEvents = {
  registerUser: "registerUser",
  getUsers: "getUsers",
  adminFormSubmited: "adminFormSubmited"
};

export interface IScoutingTarget {
  team: string;
  alliance: "red" | "blue";
  seed: "s1" | "s2" | "s3";
}

export type ScoutingTargets = Array<IScoutingTarget>;

interface IAssignScoutPacket {
  teams: ScoutingTargets;
  matchNumber: number;
}

export class SocketController {
  socket: SocketIOClient.Socket;
  constructor(address: string) {
    this.socket = socketIOClient(address);
    this.socket.on(socketEvents.isAdmin, (isAdmin: boolean) => {
      console.log(`The admin status is ${isAdmin}`);
      if (isAdmin) {
        store.dispatch(setAdminStatus(true));
      }
    });
    this.socket.on(socketEvents.assignScout, (data: IAssignScoutPacket) => {
      console.log(`You are scouting ${data.teams}`);
      console.log(`With match number ${data.matchNumber}`);
      console.log(data.teams);

      store.dispatch(setScoutingTargets(data.teams, data.matchNumber));
      message.info("The scouting form is now active!");
    });
  }

  emit = (event: string, data: any, func?: (...args: any[]) => void): void => {
    console.log(`Emiting: ${event}`);

    this.socket.emit(event, data, func);
  };
}
