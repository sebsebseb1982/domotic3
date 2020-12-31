import {Configuration} from "../../configuration/configuration";
import * as SendmailTransport from "nodemailer/lib/sendmail-transport";
import * as Mail from "nodemailer/lib/mailer";
import {Attachment} from "../../../node_modules/@types/nodemailer/lib/mailer";
import * as _ from "lodash";
import {MyNotification} from "./Notification";

let nodemailer = require('nodemailer');

export class MailService {
    configuration: Configuration;
    mailTransport: Mail;
    service: string;

    constructor(service: string) {
        this.configuration = new Configuration();
        this.service = service;
        this.mailTransport = nodemailer.createTransport(this.configuration.mail.smtp);
    }

    send(notification: MyNotification, mailAddressesToNotify?: string[]) {
        let mailOptions: SendmailTransport.Options = {
            from: 'Maison <noreply@maison.fr>',
            to: mailAddressesToNotify ? mailAddressesToNotify : this.configuration.mail.to,
            subject: `[${this.service}] ${notification.title}`,
            html: `<span>${notification.description}</span>`,
            sendmail: true,
            attachments: this.getAttachmentsFromFilesPath(notification.attachments)
        };

        this.mailTransport.sendMail(mailOptions);
    }

    private getAttachmentsFromFilesPath(filePaths: string[]): Attachment[] {
        return _.map(filePaths, (aFilePath) => {
            return {
                filename: aFilePath,
                path: aFilePath
            };
        });
    }
}