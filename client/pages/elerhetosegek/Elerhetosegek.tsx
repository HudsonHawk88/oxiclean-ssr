import React, {
    type SyntheticEvent, useCallback,
    useEffect,
    useState
} from 'react';
import ContentWrapper from "../../components/ContentWrapper.tsx";
import * as Services from "./services.ts";
import {handleInputChange} from "../../common/InputHandlers.ts";
import type {formDataObj} from "../../interfaces/elerhetosegek";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

const defaultFormDataObj = {
    ok: '',
    nev: '',
    email: '',
    telefon: '',
    uzenet: '',
    privacyPolicy: false
};

function Elerhetosegek(props: {
    notify: (type: string, msg: string | undefined) => void,
    reCaptchaKey: string }
): React.ReactElement {


    // const [elerhetosegek, setElerhetosegek] = useState<unknown>([]);
    const [formData, setFormData] = useState<formDataObj>(defaultFormDataObj);
    const { notify } = props;

    console.log(notify);
    const { executeRecaptcha } = useGoogleReCaptcha();
    // const reCaptchaKey = typeof window !== 'undefined' ? import.meta.env.VITE_reachaptchaApiKey : undefined;

    const getElerhetosegek = () => {
        Services.listElerhetosegek((err, res) => {
            if (!err) {
                console.log("RES: ", res);
                // setElerhetosegek(res.data);
            }
        });
    };
    

    useEffect(() => {
        getElerhetosegek();
    }, []);

    const sendMail = useCallback( async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!executeRecaptcha) {
            console.error('Execute recaptcha not yet available');
            return;
        }
        const kuldObj = Object.assign({}, formData);

        const token: string = await executeRecaptcha('submit');
        console.log(token);

        Services.checkRechaptcha(token, (err, res) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (!err && res.data && res.data.success) {
                Services.sendEmail(kuldObj, (err, res) => {
                    if (!err) {
                        notify('success', res.msg);
                        setFormData(defaultFormDataObj);
                    }
                });
            }
        });
    }, [notify, executeRecaptcha, formData]);

    const renderElerhetosegek = () => {
        // const mainUrl = import.meta.env.SSR ? import.meta.env.VITE_mainUrl : undefined;

        return (
            <div className="contact-page">
                <div className="contact-header">
                    <h1>Kapcsolat</h1>
                    <p>Kérdése van? Írjon nekünk bizalommal!</p>
                </div>

                <div className="contact-container">
                    <div className="contact-info-section">
                        <div className="info-cards">
                            <div className="info-card">
                                <div className="icon">📍</div>
                                <div className="info-text">
                                    <h3>Címünk</h3>
                                    <p>8900 Zalaegerszeg, Ola út 4-10.</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="icon">📞</div>
                                <div className="info-text">
                                    <h3>Telefon</h3>
                                    <p>+36 30 923 6736</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="icon">✉️</div>
                                <div className="info-text">
                                    <h3>Email</h3>
                                    <p>info@oxiclean.hu</p>
                                </div>
                            </div>
                        </div>

                        <div className="map-container">
                            <iframe
                                title="Google Maps"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2728.8508291402372!2d16.82977037715641!3d46.84662637113023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476928396a7f01cf%3A0xf4c531bced456fc6!2sZalaegerszeg%2C%20Ola%20u.%204-10%2C%208900!5e0!3m2!1shu!2shu!4v1776517327051!5m2!1shu!2shu"
                                width="100%"
                                height="300"
                                style={{border: 0}}
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>

                    <div className="contact-form-section">
                        <form className="contact-form" onSubmit={sendMail}>
                            <div className="form-group">
                                <label htmlFor="name">Név</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="nev"
                                    value={formData.nev}
                                    onChange={(e) =>
                                        handleInputChange(e, formData, setFormData)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email cím</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleInputChange(e, formData, setFormData)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Telefon</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="telefon"
                                    value={formData.telefon}
                                    pattern={"^[0-9]*$"}
                                    onChange={(e) =>
                                        handleInputChange(e, formData, setFormData)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="reason">Megkeresés oka</label>
                                <input
                                    type="text"
                                    id="reason"
                                    name="ok"
                                    value={formData.ok}
                                    onChange={(e) =>
                                        handleInputChange(e, formData, setFormData)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Üzenet</label>
                                <textarea
                                    id="message"
                                    name="uzenet"
                                    rows={4}
                                    value={formData.uzenet}
                                    onChange={(e) =>
                                        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                                        // @ts-expect-error
                                        handleInputChange(e, formData, setFormData)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <input
                                    type="checkbox"
                                    id="privacyPolicy"
                                    name="privacyPolicy"
                                    checked={formData.privacyPolicy}
                                    onChange={(e) =>
                                        handleInputChange(e, formData, setFormData)
                                    }
                                    required
                                />
                                <label htmlFor="privacyPolicy">
                                    Elolvastam és elfogadom az <a href="/static/docs/adatkezelesi.pdf" target="_blank">Adatkezelési Tájékoztatót</a>.
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={!formData.privacyPolicy}
                            >
                                Küldés
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    return <ContentWrapper>{renderElerhetosegek()}</ContentWrapper>;
}

export default Elerhetosegek;