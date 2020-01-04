import { lookup } from 'dns';
import log from 'electron-log';
import * as path from 'path';
import * as fs from 'fs';
/**
 * Checks if a device is connected to the internet by pinging Google
 * @param cb - the callback function to be called once the request is complete
 */
const isOnline = (cb: (isConnected: boolean) => void): void => {
    log.info('Checking connection status...');
    lookup('google.com', err => {
        log.info(
            `Finished checking connection status. Returned code: ${
                err ? err.code : 'NOE'
            }`
        );
        if (err && err.code === 'ENOTFOUND') {
            cb(false);
        } else {
            cb(true);
        }
    });
};

const writeEnv = (
    dbPort: number,
    dbName: string,
    password: string
): Promise<{ error: boolean; errorMsg: string }> => {
    return new Promise((res, rej) => {
        const envPath = path.join(process.resourcesPath, 'server/.env');
        const data = `DB_HOSTNAME=localhost\nDB_PORT=${dbPort}\nDB_NAME=${dbName}\nPASSWORD=${password}
        `;
        fs.writeFile(envPath, data, err => {
            if (err) {
                rej({ error: true, errorMsg: err.message });
            } else {
                res({ error: false, errorMsg: '' });
            }
        });
    });
};

export { isOnline, writeEnv };
