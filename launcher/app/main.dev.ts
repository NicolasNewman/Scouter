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
import ScriptExecutor from './classes/ScriptExecutor';

export default class AppUpdater {
    constructor() {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

let mainWindow = null;

log.silly('=========================================');
log.silly('||               Scouter               ||');
log.silly('=========================================');
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
    if (process.env.NODE_ENV === 'production') {
        log.info(`Resources located at ${process.resourcesPath}`);

        mainWindow = new BrowserWindow({
            show: false,
            frame: false,
            width: 400,
            height: 550,
            resizable: false
        });

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
                'You are currently using an unsupported platform to run Scouter. Please switch to a macOS, Windows, or Linux device.'
            );
        } else {
            const manager = new ResourceManager(platform);
            const LOCATIONS = manager.getLocations();
            const SCRIPTS = manager.getScripts();

            // Check each node_modules location and see if packages need to be installed
            const scriptsToRun: Array<{ script: string; cwd: string }> = [];
            log.info('Checking if the modules are installed...');
            const clientPath = LOCATIONS.CLIENT.NODE_MODULES;
            log.info(`Checking ${clientPath}`);
            if (!manager.exists(clientPath)) {
                manager.mkdir(clientPath);
                if (manager.empty(clientPath)) {
                    scriptsToRun.push({
                        script: SCRIPTS.installClientModules,
                        cwd: LOCATIONS.CLIENT.ROOT
                    });
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
                    scriptsToRun.push({
                        script: SCRIPTS.installServerModules,
                        cwd: LOCATIONS.SERVER.ROOT
                    });

                    log.warn(
                        'The node_modules for the server is empty, flagging for install'
                    );
                }
            }
            log.info(
                `There are ${scriptsToRun.length} module folders that are empty`
            );

            //TODO detect is node, npm, or yarn isn't installed!

            // A module script needs to be run
            if (scriptsToRun.length !== 0) {
                dialog.showMessageBox(
                    mainWindow,
                    {
                        type: 'info',
                        buttons: [],
                        message:
                            'Missing Node packages were detected, the npm installer will now launch. Please wait for any opened window(s) to close after pressing "Ok".'
                    },
                    res => {
                        // Make sure the user is connected to the internet
                        isOnline(async isConnected => {
                            if (!isConnected) {
                                log.error(
                                    "There is no internet connection and the npm packages aren't installed. Scouter will now exit."
                                );
                                dialog.showErrorBox(
                                    'Could not connect to the internet',
                                    'This device is currently not connected to the internet. A connection is needed for the first time startup.'
                                );
                            } else {
                                // Loop through scripts and install them
                                scriptsToRun.forEach(async script => {
                                    const executor = await new ScriptExecutor(
                                        script.script,
                                        { shell: true, detached: true },
                                        data => {
                                            log.info(
                                                `> ${data}`.replace('\n', '')
                                            );
                                        }
                                    );
                                    const res = await executor.executeAndWait();
                                    log.info(
                                        `Script [${
                                            script.script
                                        }] finished with error status ${
                                            res.error
                                        } ${
                                            res.error
                                                ? `: ${res.errorMsg} `
                                                : ''
                                        }`
                                    );
                                });

                                mainWindow.loadURL(
                                    `file://${__dirname}/app.html`
                                );

                                mainWindow.webContents.on(
                                    'did-finish-load',
                                    () => {
                                        if (!mainWindow) {
                                            throw new Error(
                                                '"mainWindow" is not defined'
                                            );
                                        }
                                        if (process.env.START_MINIMIZED) {
                                            mainWindow.minimize();
                                        } else {
                                            mainWindow.show();
                                            mainWindow.focus();
                                        }
                                    }
                                );

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

                // TODO replace fields in env file and start server

                mainWindow.on('closed', () => {
                    mainWindow = null;
                });

                const menuBuilder = new MenuBuilder(mainWindow);
                menuBuilder.buildMenu();

                // Remove this if your app does not use auto updates
                // eslint-disable-next-line
                // new AppUpdater();
            }
        }
        // dialog.showMessageBox();
    }
});
