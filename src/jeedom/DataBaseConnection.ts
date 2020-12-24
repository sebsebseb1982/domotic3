import {IConfiguration} from "../configuration/configurationType";
import {Configuration} from "../configuration/configuration";
import {Logger} from "../common/logger/logger";
import * as mysql from "mysql";

export class DataBaseConnection {
    private configuration: IConfiguration;
    private logger: Logger;
    public connection;

    private static _instance: DataBaseConnection;

    private constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger('DataBaseService');
        this.connection = mysql.createConnection({
            host: this.configuration.jeedom.hostname,
            user: this.configuration.jeedom.db.user,
            password: this.configuration.jeedom.db.password,
            database: this.configuration.jeedom.db.name
        });
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
}

export const dbConnection = DataBaseConnection.Instance.connection;