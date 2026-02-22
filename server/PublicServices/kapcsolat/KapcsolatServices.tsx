import { pool, isTableExists, getJSONfromLongtext } from '../../common/QueryHelpers.ts';
import express from 'express';
const router = express.Router();
const kapcsolatok = pool;

// KAPCSOLAT START

router.get('/', async (req, res) => {
    const id = req.headers.id;
    if (id) {
        const sql = `SELECT * FROM kapcsolatok WHERE id='${id}';`;
        kapcsolatok.query(sql, (err: unknown, result: Array <never>) => {
            if (!err) {
                const eredmeny = getJSONfromLongtext(result[0])
                res.status(200).send(eredmeny);
            } else {
                res.status(500).send({
                    err: err,
                    msg: 'Valami hiba van az elérésben! Értesítse a rendszergazdát!'
                });
            }
        });
    } else {
        const vanTabla = await isTableExists('kapcsolatok');
        const sql = `SELECT * FROM kapcsolatok;`;
        if (vanTabla) {
            kapcsolatok.query(sql, (err: unknown, result: Array <never>) => {
                if (!err) {
                    const newResult: unknown[] = [];
                    result.forEach((r) => {
                        const newR = getJSONfromLongtext(r);
                        newResult.push(newR);
                    })
                    res.status(200).send(newResult);
                } else {
                    res.status(500).send({
                        err: err,
                        msg: 'Valami hiba van az elérésben! Értesítse a rendszergazdát!'
                    });
                }
            });
        } else {
            res.status(500).send({
                err: 'Nem létezik még a tábla! Kérem vigyen fel tételt!',
                msg: 'Nem létezik még a tábla! Kérem vigyen fel tételt!'
            })
        }

    }
});

router.get('/nyitvatartasok', async (_req, res) => {
    const sql = `SELECT nyitvatartas FROM kapcsolatok;`;

    kapcsolatok.query(sql, (err: unknown, result: Array <never>) => {
        if (!err) {
            const eredmeny = getJSONfromLongtext(result[0]);
            res.status(200).send(eredmeny);
        } else {
            res.status(500).send({ err: "Hiba történt a nyitvatartás lekérdezésekor!" })
        }
    })

})

// KAPCSOLATOK END

export default router;