import * as path from 'path';
import * as fs from 'fs';
import log from 'electron-log';

interface ILocations {
    SCRIPTS: {
        UNIX: string;
        WIN: string;
    };
    SERVER: {
        NODE_MODULES: string;
    };
    CLIENT: {
        NODE_MODULES: string;
    };
}

export default class ResourceManager {
    private root: string;
    // private os: 'WIN' | 'UNIX';
    private extension: string;
    private LOCATIONS: ILocations;
    private SCRIPTS;

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
                NODE_MODULES: path.join(this.root, 'server/node_modules')
            },
            CLIENT: {
                NODE_MODULES: path.join(this.root, 'client/node_modules')
            }
        };
        this.SCRIPTS = {
            build: `build.${this.extension}`,
            run: `run.${this.extension}`,
            installClientModules: `install_client_modules.${this.extension}`,
            installServerModules: `install_server_modules.${this.extension}`
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
