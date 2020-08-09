import { app, Menu, shell, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import * as ElectronLog from 'electron-log';

export default class MenuBuilder {
    mainWindow: BrowserWindow;
    log: ElectronLog.ElectronLog;

    constructor(mainWindow: BrowserWindow, log: ElectronLog.ElectronLog) {
        this.mainWindow = mainWindow;
        this.log = log;
    }

    buildMenu() {
        if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
            this.setupDevelopmentEnvironment();
        }

        const template = process.platform === 'darwin' ? this.buildDarwinTemplate() : this.buildDefaultTemplate();

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        return menu;
    }

    setupDevelopmentEnvironment() {
        this.mainWindow.webContents.toggleDevTools();
        this.mainWindow.webContents.on('context-menu', (e, props) => {
            const { x, y } = props;

            Menu.buildFromTemplate([
                {
                    label: 'Inspect element',
                    click: () => {
                        this.mainWindow.webContents.inspectElement(x, y);
                    }
                }
            ]).popup({ window: this.mainWindow });
        });
    }

    buildDarwinTemplate(): MenuItemConstructorOptions[] {
        const subMenuAbout = {
            label: 'Electron',
            submenu: [
                {
                    label: 'About ElectronReact',
                    selector: 'orderFrontStandardAboutPanel:'
                },
                { type: 'separator' },
                { label: 'Services', submenu: [] },
                { type: 'separator' },
                {
                    label: 'Hide ElectronReact',
                    accelerator: 'Command+H',
                    selector: 'hide:'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    selector: 'hideOtherApplications:'
                },
                { label: 'Show All', selector: 'unhideAllApplications:' },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        };
        const subMenuEdit = {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
                {
                    label: 'Redo',
                    accelerator: 'Shift+Command+Z',
                    selector: 'redo:'
                },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
                {
                    label: 'Paste',
                    accelerator: 'Command+V',
                    selector: 'paste:'
                },
                {
                    label: 'Select All',
                    accelerator: 'Command+A',
                    selector: 'selectAll:'
                }
            ]
        };
        const subMenuViewDev = {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: () => {
                        this.mainWindow.webContents.reload();
                    }
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'Alt+Command+I',
                    click: () => {
                        this.mainWindow.webContents.toggleDevTools();
                    }
                }
            ]
        };
        const subMenuViewProd = {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'Alt+Command+I',
                    click: () => {
                        this.mainWindow.webContents.toggleDevTools();
                    }
                }
            ]
        };
        const subMenuWindow = {
            label: 'Window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:'
                },
                {
                    label: 'Close',
                    accelerator: 'Command+W',
                    selector: 'performClose:'
                },
                { type: 'separator' },
                { label: 'Bring All to Front', selector: 'arrangeInFront:' }
            ]
        };
        const subMenuHelp = {
            label: 'Help',
            submenu: [
                {
                    label: 'Learn More',
                    click() {
                        shell.openExternal('http://electron.atom.io');
                    }
                },
                {
                    label: 'Documentation',
                    click() {
                        shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
                    }
                },
                {
                    label: 'Community Discussions',
                    click() {
                        shell.openExternal('https://discuss.atom.io/c/electron');
                    }
                },
                {
                    label: 'Search Issues',
                    click() {
                        shell.openExternal('https://github.com/atom/electron/issues');
                    }
                },
                {
                    label: 'Enable Developer Tools',
                    click: () => {}
                }
            ]
        };

        const subMenuView = process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;

        return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp] as MenuItemConstructorOptions[];
    }

    buildDefaultTemplate(): MenuItemConstructorOptions[] {
        const templateDefault: MenuItemConstructorOptions[] = [
            {
                label: '&File',
                submenu: [
                    {
                        label: '&Quit',
                        accelerator: 'Ctrl+Q',
                        click: () => {
                            this.mainWindow.close();
                        }
                    }
                ]
            },
            {
                label: '&Help',
                submenu: [
                    {
                        label: 'Guide',
                        click() {
                            shell.openExternal('https://github.com/NicolasNewman/Scouter/wiki');
                        }
                    },
                    // {
                    //     label: 'Community Discussions',
                    //     click() {
                    //         shell.openExternal(
                    //             'https://discuss.atom.io/c/electron'
                    //         );
                    //     }
                    // },
                    {
                        label: 'Report Bug',
                        click() {
                            shell.openExternal('https://github.com/NicolasNewman/Scouter/issues');
                        }
                    }
                ]
            },
            {
                label: '&Dev',
                submenu: [
                    {
                        label: 'Toggle Debuging Tools',
                        click: () => {
                            this.mainWindow.webContents.toggleDevTools();
                        }
                    },
                    {
                        label: 'Open Resource Folder',
                        click: () => {
                            shell.openItem(process.resourcesPath);
                        }
                    },
                    {
                        label: 'Open Log Folder',
                        click: () => {
                            shell.openItem(this.log.transports.file.findLogPath());
                        }
                    }
                ]
            }
        ];
        console.log(templateDefault);

        return templateDefault;
    }
}
