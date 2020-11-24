import {
    IConfiguration,
    IConfigurationJeedom
} from "./configurationType";

export class Configuration implements IConfiguration {
    jeedom: IConfigurationJeedom;

    constructor() {
        this.jeedom = {
            hostname: '192.168.1.222',
            port: 80,
            apiKey: 'WCGLCkhVbhIZ21AtJcRcOnJw0Va97tOv'
        }
    }

}
