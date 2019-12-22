import { Application } from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';

export default class SocketController {
    app: Application;
    io: socketIO.Server;
    httpServer: http.Server;

    constructor(app: Application) {
        this.app = app;

        this.httpServer = http.createServer(this.app);
        this.io = socketIO(this.httpServer);
        this.io.on('connection', function(socket) {
            console.log('A user connected!');
            socket.on('disconnect', function() {
                console.log('A user disconnected!');
            });
            socket.on('adminAuth', function(pass: string) {
                if (pass === process.env.PASSWORD) {
                    socket.emit('adminRes', true);
                } else {
                    socket.emit('adminRes', false);
                }
            });
        });
        this.httpServer.listen(4000, function() {
            console.log('test listen');
        });
    }
}
