import {IRoutable} from "../../common/routes";
import * as core from "express-serve-static-core";
import {Request, Response} from "express";
import {Serie, SerieService} from "../../jeedom/SerieService";
import {Logger} from "../../common/logger/logger";


export class SeriesRoutes implements IRoutable {

    private serieService: SerieService;
    private logger: Logger;

    constructor() {
        this.serieService = new SerieService();
        this.logger = new Logger('SeriesRoutes');
    }

    routes(router: core.Router): void {
        router.get(
            '/series/:serie',
            (req: Request, res: Response) => {
                let serie = <Serie>req.params.serie;
                this.serieService.getHexStringForSerie(serie)
                    .then((hexString) => {
                        res.send(hexString);
                    })
                    .catch((error) => {
                        this.logger.error(`Impossible de récupérer la série ${serie}`, error);
                        res.sendStatus(500);
                    });
            }
        );
    }
}