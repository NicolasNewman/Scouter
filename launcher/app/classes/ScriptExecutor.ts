import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import log from 'electron-log';
import { platform } from 'os';

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
    private logger: (text: string, level: 'MESSAGE' | 'WARNING' | 'ERROR') => void;

    constructor(
        cmd: string,
        options: SpawnOptions,
        logger: (text: string, level: 'MESSAGE' | 'WARNING' | 'ERROR') => void = (text: any, level: any) => {}
    ) {
        log.info(`Loaded command [${cmd}] into memory`);
        this.cmd = cmd;
        this.options = options;
        this.logger = logger;
    }

    private cleanOutput = (output: string) => {
        if (platform() === 'win32') {
            const isPathDirective = output.startsWith('C:\\');
            if (isPathDirective) {
                const inputIndex = output.indexOf('>');
                return output.substring(inputIndex + 1, output.length);
            }
        }
        return output;
    };

    private printOutput = (output: string, level: 'MESSAGE' | 'WARNING' | 'ERROR') => {
        const outputLines = output.split('\n').filter(line => line.length > 1);
        console.log('=== LINES: ===');
        outputLines.forEach(line => {
            const cleanedLine = this.cleanOutput(line);
            this.logger(cleanedLine, level);
        });
    };

    executeAndWait(): Promise<null> {
        return new Promise((res, rej) => {
            // let errorChain: Error[] = [];
            log.info('========== STARTING COMMAND EXECUTION ==========');
            const process = spawn(this.cmd, this.options);
            process.stdout.on('data', data => {
                console.log(`\t${data.toString()}`);
                this.printOutput(data.toString(), 'MESSAGE');
                scriptLogger.info(data.toString());
            });
            process.stderr.on('data', data => {
                console.log(`\t${data.toString()}`);
                this.printOutput(data.toString(), 'ERROR');
                scriptLogger.error(data.toString());

                // errorChain = [new Error(data.ToString()), ...errorChain];
            });

            process.stdout.on('close', code => {
                console.log(`\t${code.toString()}`);
                scriptLogger.error(code.toString());
                this.printOutput('Done', 'MESSAGE');
                log.info('========== ENDING COMMAND EXECUTION ==========');
                // this.printOutput(code.toString(), 'WARNING');
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
            console.log(`\t${data.toString()}`);
            this.printOutput(data.toString(), 'MESSAGE');
            scriptLogger.info(data.toString());
        });
        process.stderr.on('data', data => {
            console.log(`\t${data.toString()}`);
            this.printOutput(data.toString(), 'ERROR');
            scriptLogger.error(data.toString());
        });

        process.stdout.on('close', code => {
            console.log(`\t${code.toString()}`);
            scriptLogger.error(code.toString());
            this.printOutput('Done', 'MESSAGE');
            log.info('========== ENDING COMMAND EXECUTION ==========');
        });

        return process;
    }
}
