import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {IRoutable} from "../../common/routes";
import {VirtualService} from "../../jeedom/VirtualService";

export class GateRoutes implements IRoutable {

    private virtualService: VirtualService;

    constructor() {
        this.virtualService = new VirtualService();
    }

    public routes(router: core.Router): void {
        router
            .post(
                '/gate',
                (req: Request, res: Response) => {

                    this.virtualService.updateVirtual(
                        {
                            id: 338,
                            name: 'portail'
                        },
                        1
                    );
                    res.status(200).send({});
                }
            );
    }
}