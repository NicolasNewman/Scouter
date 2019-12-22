import * as socketIOClient from "socket.io-client";
import store from "../entrypoints/home";
import { Store } from "redux";
import { setAdminStatus } from "../actions/user";

export const socketEvents = {
  adminResponse: "adminRes",
  adminAuthorize: "adminAuth"
};

export class SocketController {
  socket: SocketIOClient.Socket;
  constructor(address: string) {
    this.socket = socketIOClient(address);
    this.socket.on(socketEvents.adminResponse, (res: boolean) => {
      console.log(`The admin res is ${res}`);
      if (res) {
        store.dispatch(setAdminStatus(true));
      }
    });
  }

  emit = (event: string, data: any): void => {
    console.log(`Emiting: ${event}`);

    this.socket.emit(event, data);
  };
}
