import {IRoutable} from "../../common/routes";
import * as core from "express-serve-static-core";
import {Request, Response} from "express";
import {Serie, SerieService} from "../../jeedom/SerieService";


export class SeriesRoutes implements IRoutable {

    private serieService: SerieService;

    constructor() {
        this.serieService = new SerieService();
    }

    routes(router: core.Router): void {
        router.get(
            '/series/:serie',
            (req: Request, res: Response) => {
                this.serieService.getHexStringForSerie(<Serie>req.params.serie).then((hexString) => {
                    res.send(hexString);
                });
            }
        );
    }
}