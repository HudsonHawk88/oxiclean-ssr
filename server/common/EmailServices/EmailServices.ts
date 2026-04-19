import express from 'express';
import nodemailer from 'nodemailer';
import {log, mailUrl} from '../QueryHelpers.ts';
const router = express.Router();
const transporter = nodemailer.createTransport(mailUrl);

router.post('/sendfromcontact', (req, res) => {
    const { nev, email, telefon, ok, uzenet } = req.body;

    if (!nev || !email || !telefon || !uzenet || !ok) {
        res.status(400).send({ err: "Nincs a név / e-mail cím / telefonszáma / tárgy / üzenet kitöltve! Kérjük ellenőrizze a mezőket!" })
    }

    transporter.sendMail(
        {
            envelope: {
              from: email, to: process.env.foEmail
            },
            from: `${nev} <${email}>`, // sender address
            replyTo: email,
            to: process.env.foEmail, // list of receivers
            subject: `${ok}`, // Subject line
            html: `<b>Kedves ${process.env.foNev}!</b><br><br>
            Az én nevem: ${nev}.<br>
            Telefonszámom: ${telefon}.<br><br>

            ${uzenet}<br><br>
            Tisztelettel:<br>
            ${nev}<br>` // html body
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