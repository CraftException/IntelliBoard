// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// API for mail sending

// Import Nodemailer
import * as nodemailer from "nodemailer";

export module MailAPI {

    // Send a Mail
    export async function sendMail(to:string, token:string){
        const transporter = nodemailer.createTransport({
            host: "cmail01.mc-host24.de",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "intelliboard-pwrecovery@craftexception.de", // generated ethereal user
                pass: "&Newi236", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'intelliboard-pwrecovery@craftexception.de', // sender address
            to: to, // list of receivers
            subject: "Password recovery", // Subject line
            text: "Click on the following link, to reset your password: " + token, // plain text body
            html: "Click <a href=" + token + ">here</a>, to reset your password.", // html body
        });
        console.log("SEND Message")

    }

}