export class Logger {

    constructor(private service: string) {
    }

    info(message: string) {
        let formattedMessage = `[${this.service}][INFO] : ${message}`;
        console.log('\x1b[34m%s\x1b[0m', formattedMessage);
    }

    debug(message: string) {
        let formattedMessage = `[${this.service}][DEBUG]: ${message}`;
        console.log('\x1b[32m%s\x1b[0m', formattedMessage);
    }

    warn(message: string, warn: string) {
        let formattedMessage = `[${this.service}][WARN] : ${message}`;
        console.log('\x1b[33m%s\x1b[0m', formattedMessage);
    }

    error(message: string, err: string) {
        let formattedMessage = `[${this.service}][ERROR]: ${message}\n${err}`;
        console.log('\x1b[31m%s\x1b[0m', formattedMessage);
    }

    private getStackTrace() {
        let obj = {};
        Error.captureStackTrace(obj, this.getStackTrace);
        return (obj as any).stack;
    };
}