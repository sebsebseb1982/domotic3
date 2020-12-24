import {IConfiguration} from "../configuration/configurationType";
import {Configuration} from "../configuration/configuration";
import {Logger} from "../common/logger/logger";
import {Temperature} from "./virtual";
import * as mysql from "mysql";
import _ = require("lodash");

export class DataBaseService {
    private configuration: IConfiguration;
    private logger: Logger;
    private connection;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger('Base de donnée Jeedom');
        this.connection = mysql.createConnection({
            host: this.configuration.jeedom.hostname,
            user: this.configuration.jeedom.db.user,
            password: this.configuration.jeedom.db.password,
            database: this.configuration.jeedom.db.name
        });
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

            this.connection.connect();

            let query = `
                select datetime, CONCAT('{', GROUP_CONCAT('"', cmd_id, '":', value SEPARATOR ','), '}') as temperatures
                from history
                where cmd_id in (314, 315, 320)
                group by datetime
            `;
            let temperatures: Temperature[] = [];
            this.connection.query(
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

            this.connection.end();
        });
    }

    extractVirtualValue(json: string, virtualID: number): number {
        return JSON.parse(json)[virtualID];
    }
}