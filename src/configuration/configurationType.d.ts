import * as SMTPTransport from "nodemailer/lib/smtp-transport";

export interface IConfigurationJeedom {
    hostname:string;
    port:number;
    apiKey: string;
    db:IConfigurationJeedomDB;
}
export interface IConfigurationJeedomDB {
    user:string;
    password:string;
    name:string;
}
export interface IConfigurationAPI {
    root: string;
    port: number;
    users: IUserConfiguration[];
}

export interface IUserConfiguration {
    name: string;
    token: string;
}
export interface IConfigurationPushover {
    user: string;
    token: string;
}
export interface IConfigurationMail {
    to: string;
    smtp: SMTPTransport.Options;
}
export interface IConfigurationAlarm {
    hostname: string;
    user: string;
    password: string;
}
export interface IConfiguration {
    jeedom: IConfigurationJeedom;
    api: IConfigurationAPI;
    pushover:IConfigurationPushover;
    mail: IConfigurationMail;
    alarm:IConfigurationAlarm;
}
