import * as tmp from "tmp";
import * as fs from "fs";
import {Logger} from "../common/logger/logger";

export class TemporaryFileService {
    private logger: Logger;

    constructor() {
        this.logger = new Logger('Fichier temporaire');
    }

    getTemporaryFile(content: string): string {
        const tmpobj = tmp.fileSync();
        this.logger.info(`Fichier temporaire créé ${tmpobj.name} (file descriptor : ${tmpobj.fd})`);
        fs.writeFileSync(tmpobj.name, content);
        return tmpobj.name;
    }
}