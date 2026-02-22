import React, {createRef, type FormEvent, type Ref, useEffect, useState} from 'react';
import ContentWrapper from "../../components/ContentWrapper.tsx";
import * as Services from "./services.ts";
import {RVForm as Form, RVInput as Input} from "@inftechsol/reactstrap-form-validation";
import {handleInputChange} from "../../common/InputHandlers.ts";
import type {emailObj, kapcsolatObj} from "../../interfaces/elerhetosegek";
import {Button, Label} from "reactstrap";
import ReCAPTCHA from 'react-google-recaptcha';

function Elerhetosegek(props: {
    addNotification: (type: string, msg: string | undefined) => void,
    reCaptchaKey: string }
): React.ReactElement {

    const recaptchaRef: Ref<ReCAPTCHA> | undefined = createRef();
    const defaultEmailObj = {
        ok: '',
        nev: '',
        email: '',
        telefon: '',
        uzenet: '',
        toEmail: ''
    };
    const [elerhetosegek, setElerhetosegek] = useState<unknown>([]);
    const [emailObj, setEmailObj] = useState<emailObj>(defaultEmailObj);
    const [elfogadAdatkezeles, setElfogadAdatkezeles] = useState(false);
    const { addNotification } = props;
    const reCaptchaKey = typeof window !== 'undefined' ? import.meta.env.VITE_reachaptchaApiKey : undefined;

    const getElerhetosegek = () => {
        Services.listElerhetosegek((err, res) => {
            if (!err) {
                console.log("RES: ", res);
                setElerhetosegek(res.data);
            }
        });
    };

    const init = () => {
        getElerhetosegek();
    };

    useEffect(() => {
        init();
    }, []);

    const sendMail = async (e: FormEvent<HTMLFormElement>, toEmail: string) => {
        e.preventDefault();
        const kuldObj = emailObj;
        kuldObj.toEmail = toEmail;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const token: string = await recaptchaRef.current.executeAsync();
        // const secret = process.env.reachaptchaSecretKey;

        /*const rechaptchaObj = {
            secret: secret,
            response: token
        };*/

        Services.checkRechaptcha(token, (_err, res) => {
            if ("success" in res && res.success) {
                Services.sendEmail(kuldObj, (err, res) => {
                    if (!err) {
                        addNotification('success', res.msg);
                        setEmailObj(defaultEmailObj);
                        setElfogadAdatkezeles(false);
                    }
                });
            }
        });
    };

    const renderElerhetosegek = () => {
        const elerhetosegekArray = JSON.parse(JSON.stringify(elerhetosegek));
        const mainUrl = import.meta.env.SSR ? import.meta.env.VITE_mainUrl : undefined;
        console.log("REC: ", reCaptchaKey);
        return (
            elerhetosegekArray &&
            elerhetosegekArray.length !== 0 &&
            elerhetosegekArray.map((item: kapcsolatObj, index: number) => {
                console.log(item);
                const kep = item.kep[0];
                return (
                    <div className="kapcsolati_adatok" key={index.toString()}>
                        <div className="kapcsolat_nev">
                            <strong>{`${item.nev}`}</strong>
                        </div>
                        <div className="kapcsolat_alapadatok">
                            <div className="kapcsolat_kep">
                                <div>
                                    <img src={kep.src} alt={kep.title} />
                                </div>
                                <div className="kapcsolat_elerhetosegek">
                                    <div>
                                        <strong>{`Cím: `}</strong>
                                        {item.cim}
                                    </div>
                                    <div>
                                        <strong>{`Telefon: `}</strong>
                                        {item.telefon}
                                    </div>
                                    <div>
                                        <strong>{`Email: `}</strong>
                                        {item.email}
                                    </div>
                                </div>
                                <div className="kapcsolat_terkep">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10915.5994816901!2d16.
                                        845653!3d46.845661!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x5bcc4784fd93d883!2s
                                        Myhome%20Immo%20Kft.!5e0!3m2!1shu!2shu!4v1640359411151!5m2!1shu!2shu"
                                        width="100%"
                                        height="450px"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <div className="kapcsolat_form">
                                <div className="kapcsolat_form_leiras">
                                    <h3>{item.kapcsolatcim}</h3>
                                    <br />
                                    {item.kapcsolatleiras}
                                </div>
                                <div className="col-md-12" />
                                <br />
                                <div className="kapcsolat_form_inputs">
                                    <Form onSubmit={(e) => sendMail(e, item.email)}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label>Megkeresés oka: </label>
                                                <Input
                                                    type="text"
                                                    name="ok"
                                                    id="ok"
                                                    value={emailObj.ok}
                                                    onChange={(e) =>
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-expect-error
                                                        handleInputChange(e, emailObj, setEmailObj)
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-12" />
                                            <br />
                                            <div className="col-md-12">
                                                <label>Név: </label>
                                                <Input
                                                    type="text"
                                                    name="nev"
                                                    id="nev"
                                                    value={emailObj.nev}
                                                    onChange={(e) =>
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-expect-error
                                                        handleInputChange(e, emailObj, setEmailObj)
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-12" />
                                            <br />
                                            <div className="col-md-12">
                                                <label>Email: </label>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    value={emailObj.email}
                                                    onChange={(e) =>
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-expect-error
                                                        handleInputChange(e, emailObj, setEmailObj)
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-12" />
                                            <br />
                                            <div className="col-md-12">
                                                <Label>Telefonszám: </Label>
                                                <Input
                                                    type="text"
                                                    name="telefon"
                                                    id="telefon"
                                                    value={emailObj.telefon}
                                                    onChange={(e) =>
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-expect-error
                                                        handleInputChange(e, emailObj, setEmailObj)
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-12" />
                                            <br />
                                            <div className="col-md-12">
                                                <Label>Üzenet: </Label>
                                                <Input
                                                    type="textarea"
                                                    name="uzenet"
                                                    id="uzenet"
                                                    rows={7}
                                                    value={emailObj.uzenet}
                                                    onChange={(e) =>
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-expect-error
                                                        handleInputChange(e, emailObj, setEmailObj)
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-12" />
                                            <br />
                                            <div className="col-md-12">
                                                <Label>
                                                    Az{' '}
                                                    <a href={mainUrl ? mainUrl + '/adatkezeles' : ''} target="_blank">
                                                        adatkezelési tájékoztatót
                                                    </a>{' '}
                                                    megismertem, és hozzájárulok az abban rögzített adatkezelési
                                                    célokból történő adatkezeléshez: *
                                                </Label>
                                                <Input
                                                    type="checkbox"
                                                    name="elfogadAdatkezeles"
                                                    id="elfogadAdatkezeles"
                                                    checked={elfogadAdatkezeles}
                                                    onChange={(e) =>
                                                        setElfogadAdatkezeles(e.target.checked)
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-12" />
                                            <br />

                                            <div className="col-md-12">
                                                <ReCAPTCHA
                                                    sitekey={reCaptchaKey}
                                                    size="invisible"
                                                    ref={recaptchaRef}
                                                    onChange={() => {
                                                        recaptchaRef?.current?.reset();
                                                    }}
                                                />
                                                <Button
                                                    color="success"
                                                    type="submit"
                                                    disabled={
                                                        !elfogadAdatkezeles ||
                                                        emailObj.nev === '' ||
                                                        emailObj.telefon === '' ||
                                                        emailObj.email === '' ||
                                                        emailObj.ok === '' ||
                                                        emailObj.uzenet === ''
                                                    }
                                                >
                                                    <i className="fas fa-paper-plane"></i>
                                                    &nbsp;&nbsp;Elküld
                                                </Button>
                                                <br />
                                                <br />
                                                <span className="recaptcha_text">
                                                    Ez az oldal védve van a Google reCAPTCHA-val és érvényesek rá a
                                                    Google <a href="https://policies.google.com/privacy">
                                                    Adatvédelmi irányelvei</a> és
                                                    az <a href="https://policies.google.com/terms">
                                                    Általános Szerződési feltételei</a>.
                                                </span>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })
        );
    };

    return <ContentWrapper>{renderElerhetosegek()}</ContentWrapper>;
}

export default Elerhetosegek;