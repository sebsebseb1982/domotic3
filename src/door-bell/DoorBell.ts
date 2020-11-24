import {IConfiguration} from "../configuration/configurationType";
import {Configuration} from "../configuration/configuration";
import {Logger} from "../common/logger/logger";
import {VirtualService} from "../jeedom/VirtualService";

const Gpio = require('onoff').Gpio;
const button = new Gpio(3, 'in', 'both');
// const test = new Gpio(24, 'out');

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
            this.logger.info(`Appui sur la sonnette`);
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



// set BCM 4 pin as 'output'
const ledOut = new Gpio( '24', 'out' );

// current LED state
let isLedOn = false;

// run a infinite interval
setInterval( () => {
    ledOut.writeSync( isLedOn ? 0 : 1 ); // provide 1 or 0
    isLedOn = !isLedOn; // toggle state
}, 3000 ); // 3s

new DoorBell().startPolling();