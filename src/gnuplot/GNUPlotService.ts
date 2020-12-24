import {Serie} from "../jeedom/SerieService";
import {Logger} from "../common/logger/logger";
import * as tmp from "tmp";


let exec = require('child_process').exec;

export class GNUPlotService {
    private logger:Logger;

    constructor() {
        this.logger = new Logger('GNUPlotService');
    }

    generatePNGChart(serie: Serie, csvFile: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const output = tmp.fileSync();
            let gnuPlotFile = `src/gnuplot/${serie}.gnuplot`;
            let command = `gnuplot \
            -e "input='${csvFile}'" \
            -e "output='${output.name}'" \
            -e "lineWidth=1" \
            -p ${gnuPlotFile}`;
            this.logger.info(`Génère la courbe "${serie}" dans le fichier PNG ${output.name}`);
            this.logger.debug(command);
            let child = exec(command);
            child.stdout.on('data', (data) => {
                console.log('stdout: ' + data);
            });
            child.stderr.on('data', (data) => {
                console.error('stdout: ' + data);
            });
            child.on('close', (code) => {
                resolve(output.name);
            });
        });
    }
}