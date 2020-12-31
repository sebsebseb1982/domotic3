import {GNUPlotService} from "../gnuplot/GNUPlotService";
import * as _ from "lodash";
import * as png from "png-js";
import {Logger} from "../common/logger/logger";
import {Virtual} from "./virtual";
import {CSVService} from "./CSVService";
import {TemporaryFileService} from "./TemporaryFileService";
import {TemperaturesService} from "./TemperaturesService";

export type Serie = 'downstairs' | 'upstairs' | 'outside';

export class SerieService {
    private gnuplotService: GNUPlotService;
    private temperaturesService: TemperaturesService;
    private csvService: CSVService;
    private temporaryFileService: TemporaryFileService;
    private logger: Logger;

    constructor() {
        this.logger = new Logger('SerieService');
        this.gnuplotService = new GNUPlotService();
        this.temperaturesService = new TemperaturesService();
        this.temporaryFileService = new TemporaryFileService();
        this.csvService = new CSVService();
    }

    getHexStringForSerie(serie: Serie): Promise<string> {
        return new Promise<string>((resolve, reject) => {

            let virtual: Virtual = {
                id: null,
                name: serie
            };

            switch (serie) {
                case "downstairs":
                    virtual.id = 314;
                    break;
                case "upstairs":
                    virtual.id = 315;
                    break;
                case "outside":
                    virtual.id = 320;
                    break;
            }

            this.temperaturesService.getVirtualLast24HoursValues()
                .then((temperatures) => {
                    let csvFromValues = this.csvService.getCSVFromValues(temperatures);
                    let temporaryFile = this.temporaryFileService.getTemporaryFile(csvFromValues);

                    this.gnuplotService.generatePNGChart(serie, temporaryFile)
                        .then((pngFile) => {
                            png.decode(pngFile, (pixels: Uint8Array) => {
                                let retour: number[] = _.times(pixels.length / (4 * 8), _.constant(0));
                                _.chunk(pixels, 4 * 8)
                                    .forEach((eightPixelsRGBA, index) => {
                                        for (let pixelIndex = 0; pixelIndex < 8; pixelIndex++) {
                                            if (eightPixelsRGBA[pixelIndex * 4] != 255 || eightPixelsRGBA[(pixelIndex * 4) + 1] != 255 || eightPixelsRGBA[(pixelIndex * 4) + 2] != 255) {
                                                retour[index] = retour[index] + Math.pow(2, 7 - pixelIndex);
                                            }
                                        }
                                    });

                                let hexString = '';

                                retour.forEach((value) => {
                                    hexString += value.toString(16).padStart(2, '0');
                                });

                                this.logger.info(`Pixels présents dans ${pngFile} : ${pixels.length / 4}`);
                                this.logger.info(`Nombre de caractères dans le retour : ${hexString.length}`);

                                resolve(hexString);
                            });
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}