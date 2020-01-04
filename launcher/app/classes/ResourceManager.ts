import * as path from 'path';
import * as fs from 'fs';
import log from 'electron-log';

interface ILocations {
    SCRIPTS: {
        UNIX: string;
        WIN: string;
    };
    SERVER: {
        ROOT: string;
        NODE_MODULES: string;
        ENV: string;
    };
    CLIENT: {
        ROOT: string;
        NODE_MODULES: string;
    };
}

interface IScripts {
    build: string;
    run: string;
    installClientModules: string;
    installServerModules: string;
}

export default class ResourceManager {
    private root: string;
    // private os: 'WIN' | 'UNIX';
    private extension: string;
    private LOCATIONS: ILocations;
    private SCRIPTS: IScripts;

    constructor(os: 'WIN' | 'UNIX') {
        // this.os = os;
        this.extension = os === 'WIN' ? 'bat' : 'sh';
        this.root = path.join(process.resourcesPath);
        this.LOCATIONS = {
            SCRIPTS: {
                UNIX: path.join(this.root, 'scripts/unix'),
                WIN: path.join(this.root, 'scripts/win')
            },
            SERVER: {
                ROOT: path.join(this.root, 'server'),
                NODE_MODULES: path.join(this.root, 'server/node_modules'),
                ENV: path.join(this.root, 'server/.env')
            },
            CLIENT: {
                ROOT: path.join(this.root, 'client'),
                NODE_MODULES: path.join(this.root, 'client/node_modules')
            }
        };
        this.SCRIPTS = {
            build: path.join(
                this.LOCATIONS.SCRIPTS[os],
                `build.${this.extension}`
            ),
            run: path.join(this.LOCATIONS.SCRIPTS[os], `run.${this.extension}`),
            installClientModules: path.join(
                this.LOCATIONS.SCRIPTS[os],
                `install_client_modules.${this.extension}`
            ),
            installServerModules: path.join(
                this.LOCATIONS.SCRIPTS[os],
                `install_server_modules.${this.extension}`
            )
        };
    }

    getLocations = () => {
        return this.LOCATIONS;
    };

    getScripts = () => {
        return this.SCRIPTS;
    };

    exists = (path: string): boolean => {
        return fs.existsSync(path);
    };

    empty = (directory: string): boolean => {
        const files = fs.readdirSync(directory);
        log.info(`The directory ${directory} has ${files.length} files`);
        return fs.readdirSync(directory).length === 0;
    };

    mkdir = (directory: string) => {
        fs.mkdirSync(directory);
    };
}
