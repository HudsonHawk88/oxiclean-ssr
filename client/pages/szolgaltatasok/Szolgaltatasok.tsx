import React, {useState} from 'react';
import ContentWrapper from "../../components/ContentWrapper.tsx";
import type {szolgaltatasok} from "../../interfaces/szolgaltatasok";
import {services} from "../../values/DummyValues.ts";

function Szolgaltatasok(): React.ReactElement {

    const [szolgaltatasok, ] = useState<szolgaltatasok>(services);

    console.log(szolgaltatasok);

    return (
        <ContentWrapper>
            <section className="services-page">
                <div className="services-intro">
                    <h1>Szakértő tisztítás, megbízható eredmény</h1>
                    <p>
                        Az OxiClean-nél nem csupán takarítunk, hanem óvjuk értékeit.
                        Modern eszközeinkkel és sokéves tapasztalatunkkal garantáljuk,
                        hogy ingatlana újra régi fényében ragyogjon.
                    </p>
                </div>

                <div className="detailed-services-grid">
                    {services.map((service) => (
                        <div key={service.id} className="detailed-service-item">
                            <div className="service-image-placeholder">
                                {service.imageUrl}
                            </div>
                            <div className="service-content">
                                <h2>{service.title}</h2>
                                <p>{service.desc}</p>
                                <ul>
                                    {service.benefits.map((benefit, index) => (
                                        <li key={index}>{benefit}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </ContentWrapper>
    );
}

export default Szolgaltatasok;