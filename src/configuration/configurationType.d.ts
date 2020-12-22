export interface IConfigurationJeedom {
    hostname:string;
    port:number;
    apiKey: string;
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

export interface IConfiguration {
    jeedom: IConfigurationJeedom;
    api: IConfigurationAPI;
}
