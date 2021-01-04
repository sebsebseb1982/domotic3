import {WebUILibraries} from "./web-ui-libraries";
import * as request from 'request';
import * as _ from "lodash";
import {Configuration} from "../configuration/configuration";
import {Logger} from "../common/logger/logger";

export class Alarm {
    webUILibraries: WebUILibraries;
    configuration: Configuration;
    logger: Logger;
    timeout: number = 1 * 1000 /*ms*/;
    service: string;

    constructor() {
        this.service = 'Alarme';
        this.webUILibraries = new WebUILibraries();
        this.configuration = new Configuration();
        this.logger = new Logger(this.service);
    }

    isArmed(): Promise<boolean> {
        return this.executeCallback((): Promise<boolean> => {
            return new Promise<boolean>((resolve, reject) => {
                let uri = `http://${this.configuration.alarm.hostname}:80/statuslive.html`;
                this.logger.debug(`Ouverture de ${uri}`);
                request.get(
                    {
                        uri: uri,
                        timeout: this.timeout
                    },
                    (error, response: request.Response, html) => {
                        if (error) {
                            this.logger.error(`Erreur lors de la lecture du statut de l'alarme (${uri})`, error);
                            resolve(true);
                        } else {
                            resolve(_.includes(html, 'new Array(2,0);'))
                        }
                    }
                );
            });
        });
    }

    arm(): Promise<void> {
        this.logger.info('Armement alarme');
        let promise = this.execute('r');
        return promise;
    }

    disarm(): Promise<void> {
        this.logger.info('Désarmement alarme');
        return this.execute('d');
    }

    private execute(command: string): Promise<void> {
        return this.executeCallback(() => {
            return new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    let uri = `http://${this.configuration.alarm.hostname}:80/statuslive.html?area=00&value=${command}`;
                    this.logger.debug(`Ouverture de ${uri}`);
                    request.get(
                        {
                            uri: uri,
                            timeout: this.timeout
                        },
                        (error, response: request.Response, html) => {
                            if (error || response.statusCode != 200) {
                                reject(response.statusCode);
                                this.logger.error(`Erreur lors de l'éxécutuion d'une commande (${uri})`, error);
                            } else {
                                resolve();
                            }
                        }
                    );
                }, 2000);
            })
        });
    }

    private generateSES(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let uri = `http://${this.configuration.alarm.hostname}:80/login_page.html`;
            this.logger.info(`Login`);
            this.logger.debug(`Ouverture de ${uri}`);
            request.get(
                {
                    uri: uri,
                    timeout: this.timeout
                },
                (error, response: request.Response, html) => {
                    if (error) {
                        reject(null);
                        this.logger.error(`Erreur lors du login (${uri})`, error);
                    } else {
                        let myRegexp = /loginaff\("([A-Z0-9]*)"/g;
                        let match = myRegexp.exec(html);
                        if (match) {
                            let ses = match[1];
                            this.logger.info(`Génération d'un jeton SES (${ses})`);
                            resolve(ses);
                        } else {
                            reject(null);
                            this.logger.error(`Impossible de générer un jeton SES à partir de la page de login (${uri}) de l'alarme`, html);
                        }
                    }
                }
            );
        });
    }

    private executeCallback(callback: () => Promise<any>): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            this.logout().then(() => {
                this.login().then(() => {
                    this.waitForWEBUI().then(() => {
                        callback().then((valueReturned) => {
                            this.logout().then(() => {
                                resolve(valueReturned);
                            });
                        });
                    });
                });
            });
        });
    }

    private login(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.generateSES().then((ses) => {
                let credentials = this.webUILibraries.getCredentials(
                    this.configuration.alarm.user,
                    this.configuration.alarm.password,
                    ses
                );

                this.logger.info(`Encodage du user/password (u=${credentials.u}, p=${credentials.p})`);

                let uri = `http://${this.configuration.alarm.hostname}:80/default.html?u=${credentials.u}&p=${credentials.p}`;
                this.logger.info(`Authentification`);
                this.logger.debug(`Ouverture de ${uri}`);
                request.get(
                    {
                        uri: uri,
                        timeout: this.timeout
                    },
                    (error, response: request.Response, html) => {
                        if (error) {
                            reject();
                            this.logger.error(`Erreur lors de l'authentification (${uri})`, error);
                        } else {
                            resolve();
                        }
                    }
                );
            });
        })
    }

    private logout(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let uri = `http://${this.configuration.alarm.hostname}:80/logout.html`;
            this.logger.info(`Logout`);
            this.logger.debug(`Ouverture de ${uri}`);
            request.get(
                {
                    uri: uri,
                    timeout: this.timeout
                },
                (error, response: request.Response, html) => {
                    if (error) {
                        reject();
                        this.logger.error(`Erreur lors du logout (${uri})`, error);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    private waitForWEBUI(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let interval = setInterval(() => {
                let uri = `http://${this.configuration.alarm.hostname}:80/waitlive.html`;
                this.logger.debug(`Authentification en cours ...`);
                request.get(
                    {
                        uri: uri,
                        timeout: this.timeout
                    },
                    (error, response: request.Response, html) => {
                        if (_.includes(html, 'prg=4')) {
                            clearInterval(interval);
                            resolve();
                        }
                    }
                );
            }, 3000);
        });
    }
}

new Alarm().isArmed().then((isArmed) => {
    console.log(isArmed);
})