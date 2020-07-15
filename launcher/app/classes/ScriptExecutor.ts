import { spawn } from 'child_process';
import log from 'electron-log';

type ExecutorError = {
    error: boolean;
    errorMsg: string;
};

type SpawnOptions = {
    cdw?: string;
    shell?: boolean;
    detached?: boolean;
};

// TODO DRY
const scriptLogger = log.create('script');
scriptLogger.transports.file.format = '[{level}]> {text}';

export default class ScriptExecutor {
    private cmd: string;
    private options: SpawnOptions;
    private stdoutCB: (data: string) => void;

    constructor(
        cmd: string,
        options: SpawnOptions,
        stdoutCB: (data: string) => void
    ) {
        log.info(`Loaded command [${cmd}] into memory`);
        this.cmd = cmd;
        this.options = options;
        this.stdoutCB = stdoutCB;
    }

    executeAndWait(): Promise<ExecutorError> {
        return new Promise((res, rej) => {
            log.info('========== STARTING COMMAND EXECUTION ==========');
            const process = spawn(this.cmd, this.options);
            process.stdout.on('data', this.stdoutCB);

            process.stdout.on('close', code => {
                scriptLogger.info('STDOUT closed');
                res({ error: false, errorMsg: '' });
            });
            process.stderr.on('data', data => {
                scriptLogger.error(`ERROR RECEIVED: ${data}`);
                rej({ error: true, errorMsg: data });
            });
        });
    }
}
