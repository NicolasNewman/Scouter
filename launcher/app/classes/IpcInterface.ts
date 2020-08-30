import { ipcRenderer } from 'electron';

export default class IpcInterface {
    static resizeWindow(width: number, height: number) {
        console.log('Call to resize window!');
        ipcRenderer.send('resize', width, height);
    }
}
