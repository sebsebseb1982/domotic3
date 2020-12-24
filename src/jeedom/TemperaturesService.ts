import {IConfiguration} from "../configuration/configurationType";
import {Configuration} from "../configuration/configuration";
import {Logger} from "../common/logger/logger";
import {Temperature} from "./virtual";
import * as mysql from "mysql";
import _ = require("lodash");
import {dbConnection} from "./DataBaseConnection";

export class TemperaturesService {
    private logger: Logger;

    constructor() {
        this.logger = new Logger('TemperaturesService');
    }

    getVirtualLast24HoursValues(): Promise<Temperature[]> {
        return new Promise<Temperature[]>((resolve, reject) => {
            /*let query = `
                  select *
                  from history
                  where cmd_id=${virtual.id}
                  union
                  select *
                  from historyArch
                  where cmd_id=${virtual.id} and datetime > DATE_SUB(CURDATE(), INTERVAL 1 DAY)
                  order by datetime
              `;*/

            let query = `
                select datetime, CONCAT('{', GROUP_CONCAT('"', cmd_id, '":', value SEPARATOR ','), '}') as temperatures
                from history
                where cmd_id in (314, 315, 320)
                group by datetime
                union
                select datetime, CONCAT('{', GROUP_CONCAT('"', cmd_id, '":', value SEPARATOR ','), '}') as temperatures
                from historyArch
                where cmd_id in (314, 315, 320)
                and datetime > DATE_SUB(CURDATE(), INTERVAL 1 DAY)
                group by datetime
            `;
            let temperatures: Temperature[] = [];
            dbConnection.query(
                query,
                (error, results, fields) => {
                    if (error) throw error;
                    _.forEach(results, (result) => {
                        temperatures.push({
                            datetime: result.datetime,
                            upstairs: this.extractVirtualValue(result.temperatures, 315),
                            downstairs: this.extractVirtualValue(result.temperatures, 314),
                            outside: this.extractVirtualValue(result.temperatures, 320)
                        });
                    });
                    resolve(temperatures);
                }
            );
        });
    }

    extractVirtualValue(json: string, virtualID: number): number {
        return JSON.parse(json)[virtualID];
    }
}