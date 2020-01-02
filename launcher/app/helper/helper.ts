import { lookup } from 'dns';
import log from 'electron-log';

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

export { isOnline };
