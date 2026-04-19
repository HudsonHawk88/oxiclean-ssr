import React from "react";
import ContentWrapper from "../../components/ContentWrapper.tsx";
import {services} from "../../values/DummyValues.ts";

const Home: () => React.ReactElement = () =>  {
    return (
        <ContentWrapper>
            <main>
                <section className="hero">
                    <h1>Tető-, Homlokzat-, Térkőtisztítás</h1>
                    <p>A szakértői csapatunkra bízhatja otthona friss és tiszta megjelenését. Mi garantáljuk a tökéletes eredményt!</p>
                </section>

                <section className="services-section">
                    <h2 className="section-title">Szolgáltatásaink</h2>
                    <div className="services-grid">
                        {services.map((s, index) => (
                            <div key={index} className="service-card">
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </ContentWrapper>
    );
}

export default Home;