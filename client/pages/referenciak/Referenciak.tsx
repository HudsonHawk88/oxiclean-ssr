import React, { useState, type TouchEvent } from 'react';
import ContentWrapper from "../../components/ContentWrapper.tsx";
import { referenciak } from "../../values/DummyValues.ts";

function Referenciak(): React.ReactElement {
    const [currentRefId, setCurrentRefId] = useState<number | null>(null);
    const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

    // Swipe kezeléshez szükséges state
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const activeRef = referenciak.find(r => r.id === currentRefId);
    const activeImage = activeRef?.images[currentImgIndex];

    const openLightbox = (refId: number, imgIndex: number) => {
        setCurrentRefId(refId);
        setCurrentImgIndex(imgIndex);
    };

    const closeLightbox = () => {
        setCurrentRefId(null);
        setCurrentImgIndex(0);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (activeRef) {
            setCurrentImgIndex((prev) => (prev + 1) % activeRef.images.length);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (activeRef) {
            setCurrentImgIndex((prev) => (prev - 1 + activeRef.images.length) % activeRef.images.length);
        }
    };

    // Swipe események
    const handleTouchStart = (e: TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) nextImage();
        if (distance < -minSwipeDistance) prevImage();
    };

    return (
        <ContentWrapper>
            <div className="references-page">
                <div className="reference-list">
                    {referenciak.map((ref) => (
                        <section key={ref.id} className="reference-item">
                            <div className="reference-text">
                                <span className="company-badge">{ref.company}</span>
                                <h2>{ref.title}</h2>
                            </div>

                            <div className="reference-gallery">
                                {ref.images.slice(0, 5).map((img, index) => (
                                    <div
                                        key={img.id}
                                        className="img-card"
                                        onClick={() => openLightbox(ref.id, index)}
                                    >
                                        <img src={img.url} alt={img.alt} loading="lazy" />
                                        <div className="img-overlay">
                                            <span>Megtekintés</span>
                                        </div>
                                    </div>
                                ))}

                                {ref.images.length > 5 && (
                                    <div
                                        className="img-card more-card"
                                        style={{ backgroundImage: `url(${ref.images[5].url})` }}
                                        onClick={() => openLightbox(ref.id, 0)}
                                    >
                                        <div className="more-overlay">
                                            <span className="plus-count">+{ref.images.length - 5}</span>
                                            <span className="more-text">További képek</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>

                {activeImage && (
                    <div
                        className="lightbox-overlay"
                        onClick={closeLightbox}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <button className="nav-btn prev" onClick={prevImage}>&#10094;</button>

                        <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={closeLightbox}>&times;</button>
                            <img src={activeImage.url} alt={activeImage.alt} />
                            <div className="lightbox-info">
                                <p>{activeImage.alt}</p>
                                <span>{currentImgIndex + 1} / {activeRef?.images.length}</span>
                            </div>
                        </div>

                        <button className="nav-btn next" onClick={nextImage}>&#10095;</button>
                    </div>
                )}
            </div>
        </ContentWrapper>
    );
}

export default Referenciak;