import {Temperature} from "./virtual";
import * as _ from "lodash";
import * as moment from "moment";
import {Logger} from "../common/logger/logger";

export class CSVService {
    logger:Logger;
    constructor() {
        this.logger = new Logger('CSV Service');
    }

    getCSVFromValues(values: Temperature[]): string {
        let csv: string = '';
        _.forEach(
            values,
            (value) => {
                csv += `${moment(value.datetime).format('YYYY-MM-DD HH:mm:ss')},${value.upstairs?value.upstairs:''},${value.downstairs?value.downstairs:''},${value.outside?value.outside:''},\n`;
            }
        );
        this.logger.info(`${values.length} enregistrements transformés en CSV`);
        return csv;
    }
}