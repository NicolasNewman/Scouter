import * as socketIOClient from "socket.io-client";
import store from "../entrypoints/home";
// import { Store } from "redux";
import { setAdminStatus } from "../actions/user";
import { setScoutingTargets } from "../actions/scouting";

export const socketEvents = {
  isAdmin: "isAdmin",
  assignScout: "assignScout"
};

export const emitableEvents = {
  registerUser: "registerUser",
  getUsers: "getUsers",
  adminFormSubmited: "adminFormSubmited"
};

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
    this.socket.on(socketEvents.assignScout, (target: Array<string>) => {
      console.log(`You are scouting ${target}`);
      store.dispatch(setScoutingTargets(target));
    });
  }

  emit = (event: string, data: any, func?: (...args: any[]) => void): void => {
    console.log(`Emiting: ${event}`);

    this.socket.emit(event, data, func);
  };
}
