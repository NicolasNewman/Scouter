import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import log from 'electron-log';

export type ExecutorError = {
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

    constructor(cmd: string, options: SpawnOptions) {
        log.info(`Loaded command [${cmd}] into memory`);
        this.cmd = cmd;
        this.options = options;
    }

    executeAndWait(): Promise<null> {
        return new Promise((res, rej) => {
            // let errorChain: Error[] = [];
            log.info('========== STARTING COMMAND EXECUTION ==========');
            const process = spawn(this.cmd, this.options);
            process.stdout.on('data', data => {
                console.log('STDOUT - DATA');
                console.log(`\t${data.toString()}`);
                // scriptLogger.info(data.toString());
            });
            process.stderr.on('data', data => {
                console.log('STDERR - DATA');
                console.log(`\t${data.toString()}`);
                // scriptLogger.error(data.toString());
                // errorChain = [new Error(data.ToString()), ...errorChain];
            });

            process.stdout.on('close', code => {
                console.log('STDOUT - CLOSE');
                console.log(`\t${code.toString()}`);
                // log.info('========== ENDING COMMAND EXECUTION ==========');
                // if (errorChain.length > 0) {
                //     rej(errorChain[0]);
                // }
                // res();
                res();
            });
        });
    }

    execute(): ChildProcessWithoutNullStreams {
        log.info('========== STARTING COMMAND EXECUTION ==========');
        const process = spawn(this.cmd, this.options);
        process.stdout.on('data', data => {
            scriptLogger.info(data.toString());
        });
        process.stderr.on('data', data => {
            scriptLogger.error(data.toString());
        });

        process.stdout.on('close', code => {
            log.info('========== ENDING COMMAND EXECUTION ==========');
        });

        return process;
    }
}
