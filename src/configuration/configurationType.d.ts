export interface IConfigurationJeedom {
    hostname:string;
    port:number;
    apiKey: string;
}

export interface IConfiguration {
    jeedom: IConfigurationJeedom;
}
