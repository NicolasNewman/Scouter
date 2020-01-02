/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

import ResourceManager from './classes/ResourceManager';
import { isOnline } from './helper/helper';

export default class AppUpdater {
    constructor() {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

let mainWindow = null;

log.silly('========================================');
log.silly('||               Scouter              ||');
log.silly('========================================');
log.info(
    `The runtime environment is in ${process.env.NODE_ENV} on ${process.platform}`
);

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
}

if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
) {
    require('electron-debug')();
}

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(
        extensions.map(name =>
            installer.default(installer[name], forceDownload)
        )
    ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', async () => {
    if (
        process.env.NODE_ENV === 'development' ||
        process.env.DEBUG_PROD === 'true'
    ) {
        await installExtensions();
    }

    // Verify that the npm modules are installed
    if (
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'development'
    ) {
        log.info(`Resources located at ${process.resourcesPath}`);

        // Modify the process variables to match the parameter for the ResourceManager
        const platform = (() => {
            switch (process.platform) {
                case 'linux':
                    return 'UNIX';
                case 'darwin':
                    return 'UNIX';
                case 'win32':
                    return 'WIN';
                default:
                    return undefined;
            }
        })();
        log.info(`Modified platform is ${platform}`);

        // Unknown platform
        if (!platform) {
            log.error('The platform is unsupported! Killing process');
            dialog.showErrorBox(
                'Unsupported platform',
                'You are currently using an unsupported platform to run Scouter. Please switch to a macOS, Windows, or Linux device'
            );
        } else {
            // Make sure there is an internet connection for downloading the packages
            const manager = new ResourceManager(platform);
            const LOCATIONS = manager.getLocations();
            const SCRIPTS = manager.getScripts();

            const scriptsToRun = [];
            log.info('Checking if the modules are installed...');
            const clientPath = LOCATIONS.CLIENT.NODE_MODULES;
            log.info(`Checking ${clientPath}`);
            if (!manager.exists(clientPath)) {
                manager.mkdir(clientPath);
                if (manager.empty(clientPath)) {
                    scriptsToRun.push(SCRIPTS.installClientModules);
                    log.warn(
                        'The node_modules for the client is empty, flagging for install'
                    );
                }
            }

            const serverPath = LOCATIONS.SERVER.NODE_MODULES;
            log.info(`Checking ${serverPath}`);
            if (!manager.exists(serverPath)) {
                manager.mkdir(serverPath);
                if (manager.empty(serverPath)) {
                    scriptsToRun.push(SCRIPTS.installServerModules);
                    log.warn(
                        'The node_modules for the server is empty, flagging for install'
                    );
                }
            }
            log.info(
                `There are ${scriptsToRun.length} module folders that are empty`
            );

            // A module script needs to be run, which requires a connection to connect to NPM
            if (scriptsToRun.length !== 0) {
                isOnline(isConnected => {
                    if (!isConnected) {
                        log.error(
                            "There is no internet connection and the npm modules aren't installed, killing process"
                        );
                        dialog.showErrorBox(
                            'Could not connect to the internet',
                            'This device is currently not connected to the internet. A connection is needed for the first time startup or if the packages are modified'
                        );
                    } else {
                        mainWindow = new BrowserWindow({
                            show: false,
                            frame: false,
                            width: 400,
                            height: 550,
                            resizable: false
                        });

                        mainWindow.loadURL(`file://${__dirname}/app.html`);

                        // @TODO: Use 'ready-to-show' event
                        //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
                        mainWindow.webContents.on('did-finish-load', () => {
                            if (!mainWindow) {
                                throw new Error('"mainWindow" is not defined');
                            }
                            if (process.env.START_MINIMIZED) {
                                mainWindow.minimize();
                            } else {
                                mainWindow.show();
                                mainWindow.focus();
                            }
                        });

                        mainWindow.on('closed', () => {
                            mainWindow = null;
                        });

                        const menuBuilder = new MenuBuilder(mainWindow);
                        menuBuilder.buildMenu();

                        // Remove this if your app does not use auto updates
                        // eslint-disable-next-line
                        // new AppUpdater();
                    }
                });
            }
        }
        // dialog.showMessageBox();
    }
});
