import {IConfiguration} from "../configuration/configurationType";
import {Configuration} from "../configuration/configuration";
import {Logger} from "../common/logger/logger";
import {VirtualService} from "../jeedom/VirtualService";

const Gpio = require('onoff').Gpio;
const button = new Gpio(4, 'in', 'rising', {debounceTimeout: 10});

export class DoorBell {

    configuration: IConfiguration;
    logger: Logger;
    virtualService: VirtualService;


    constructor() {
        this.logger = new Logger('Sonnette');
        this.configuration = new Configuration();
        this.virtualService = new VirtualService();
    }

    startPolling(): void {
        button.watch((err, value) => {
            if (err) {
                this.logger.error(`Erreur lors de l'attente d'un appui sur la sonnette`, err.message);
            }

            this.virtualService.updateVirtual(
                {
                    id: 310,
                    name: 'Sonnette'
                },
                true
            );
        });
    }
}

new DoorBell().startPolling();