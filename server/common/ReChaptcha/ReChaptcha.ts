import express from 'express';
import fetch from 'isomorphic-fetch';
const router = express.Router();

// RECAPTCHA START

router.post('/', async (req, res) => {
    const { gtoken } = req.headers;
    const secret = process.env.recaptchasecret;
    const url = `https://www.google.com/recaptcha/api/siteverify`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // A paramétereket URL-kódolt formátumban kell küldeni
            body: `secret=${secret}&response=${gtoken}`
        });

        const data = await response.json();

        // Sikeres hitelesítés esetén a 'success' true lesz
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (data.success) {
            res.status(200).send({ success: true });
            return data;
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            console.error('Hiba az ellenőrzés során:', data['error-codes']);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            res.status(500).send({ err: data['error-codes'], success: false });
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
        throw error;
    }
})

// RECAPTCHA END

export default router;