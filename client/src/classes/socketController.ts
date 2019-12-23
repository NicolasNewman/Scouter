import * as socketIOClient from "socket.io-client";
import store from "../entrypoints/home";
import { Store } from "redux";
import { setAdminStatus } from "../actions/user";

export const socketEvents = {
  isAdmin: "isAdmin",
  sendUsers: "sendUsers"
};

export const emitableEvents = {
  registerUser: "registerUser",
  getUsers: "getUsers"
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
  }

  emit = (event: string, data: any, func?: (...args: any[]) => void): void => {
    console.log(`Emiting: ${event}`);

    this.socket.emit(event, data, func);
  };
}
