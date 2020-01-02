import { spawn } from 'child_process';
import log from 'electron-log';

type ExecutorError = {
    error: boolean;
    errorMsg: string;
};

export default class ScriptExecutor {
    private cmd: string;
    private stdoutCB: (data: string) => void;

    constructor(cmd: string, stdoutCB: (data: string) => void) {
        log.info(`Loaded command [${cmd}] into memory`);
        this.cmd = cmd;
        this.stdoutCB = stdoutCB;
    }

    executeAndWait(): Promise<ExecutorError> {
        return new Promise((res, rej) => {
            const process = spawn(this.cmd);
            process.stdout.on('data', this.stdoutCB);
            process.stdout.on('close', code => {
                log.info(
                    `The script [${this.cmd}] finished successfully with code ${code}`
                );
                res({ error: false, errorMsg: '' });
            });
            process.stderr.on('data', data => {
                log.info(`The script [${this.cmd}] exited with an error:`);
                log.info(data);
                rej({ error: true, errorMsg: data });
            });
        });
    }
}
