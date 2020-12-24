import {IConfiguration} from "../configuration/configurationType";
import {Configuration} from "../configuration/configuration";
import {Logger} from "../common/logger/logger";
import {Temperature} from "./virtual";
import * as mysql from "mysql";
import _ = require("lodash");

export class DataBaseService {
    private configuration: IConfiguration;
    private logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger('Base de donnée Jeedom');
    }

    getVirtualLast24HoursValues(): Temperature[] {

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
        var connection = mysql.createConnection({
            host: this.configuration.jeedom.hostname,
            user: this.configuration.jeedom.db.user,
            password: this.configuration.jeedom.db.password,
            database: this.configuration.jeedom.db.name
        });

        connection.connect();

        let query = `
            select datetime, CONCAT('{', GROUP_CONCAT('"', cmd_id, '":', value SEPARATOR ','), '}')
            from history
            where cmd_id in (314, 315, 320)
            group by datetime
        `;
        let temperatures: Temperature[] = [];
        connection.query(
            query,
            (error, results, fields) => {
                if (error) throw error;
                _.forEach(results, (result) => {
                    temperatures.push({
                        datetime: result[0],
                        upstairs: this.extractVirtualValue(result[1],315),
                        downstairs: this.extractVirtualValue(result[1],314),
                        outside: this.extractVirtualValue(result[1],320)
                    });
                });
            }
        );

        connection.end();
        return temperatures;
    }

    extractVirtualValue(json: string, virtualID: number): number {
        return JSON.parse(json)[virtualID];
    }
}