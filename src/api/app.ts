import * as express from "express";
import * as bodyParser from "body-parser";
import {Auth} from "../common/authentification/auth";
import {Configuration} from "../configuration/configuration";
import {GateRoutes} from "./routes/gate-routes";

class App {
    public app: express.Application;
    configuration: Configuration;

    constructor() {
        this.configuration = new Configuration();
        this.app = express();
        this.config();

        // Filters
        let router = express.Router();
        new Auth().filter(router);

        // Routes
        new GateRoutes().routes(router);

        this.app.use(this.configuration.api.root, router);
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}
export default new App().app;