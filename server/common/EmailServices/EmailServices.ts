import express from 'express';
const router = express.Router();
import nodemailer from 'nodemailer';
import {log, mailUrl} from '../QueryHelpers.ts';
const transporter = nodemailer.createTransport(mailUrl);

router.post('/sendfromcontact', async (req, res) => {
    const body = req.body;
    const { kuldoEmail, kuldoNev, kuldoTelefon, targy, uzenet } = body;

    if (!kuldoEmail || !kuldoNev || !kuldoTelefon || !targy || !uzenet) {
        res.status(400).send({ err: "Nincs küldő e-mail címe / neve / telefonszáma, tárgy vagy üzenet! Kérjük ellenőrizze a mezőket!" })
    }

    transporter.sendMail(
        {
            from: `${kuldoNev} <${kuldoEmail}>`, // sender address
            to: process.env.foEmail, // list of receivers
            subject: `${targy}`, // Subject line
            html: `<b>Kedves ${process.env.foNev}!</b><br><br>
            Az én nevem: ${kuldoNev}.<br>
            Telefonszámom: ${kuldoTelefon}.<br>
            Üzenetem tárgya: ${kuldoTelefon}.<br>
            ${uzenet}<br><br>
            Tisztelettel:<br>
            ${kuldoNev}<br>` // html body
        },
        (err) => {
            if (!err) {
                res.status(200).send({ msg: 'E-mail sikeresen elküldve!' });
            } else {
                log("E-mail küldése sikertelen: ", err);
                res.status(500).send({ err: err, msg: 'E-mail küldése sikertelen!' });
            }
        }
    );
});

export default router;