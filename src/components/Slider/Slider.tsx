import { Img } from '@impact-market/ui';
import { NextButton, Pagination, PrevButton } from "./SliderButtons";
import { getImage } from '../../utils/images';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react'

type PropType = {
    options?: EmblaOptionsType
    slides: any
}

const Slider = styled.div`
    overflow: hidden;
    
    .embla__container {
        display: flex;

        .embla__slide {
            align-items: center;
            display: flex;
            flex: 0 0 100%;
            justify-content: center;
            position: relative;
        }
    }
`;

const EmblaCarousel = (props: PropType) => {
    const { slides } = props

    const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(0)

    const scrollPrev = useCallback(() => embla.scrollPrev(), [embla]);
    const scrollNext = useCallback(() => embla.scrollNext(), [embla]);

    const onSelect = useCallback(() => {
        if (!embla) return;
        setPrevBtnEnabled(embla.canScrollPrev());
        setNextBtnEnabled(embla.canScrollNext());
        setSelectedSlide(embla.selectedScrollSnap());
    }, [embla, selectedSlide]);

    useEffect(() => {
        if (!embla) return;
        onSelect();
        embla.on("select", onSelect);
    }, [embla, onSelect]);

    return (
        <Slider className="embla">
            <div className="embla__viewport" ref={viewportRef}>
                <div className="embla__container">
                    {slides.map((slide: string, key: number) => (
                        <div className="embla__slide" key={key}>
                            <Img 
                                alt=""
                                maxH="100%"
                                maxW="100%"
                                url={getImage({filePath: slide, fit: 'cover', height: 0, width: 0})}
                            />
                        </div>
                    ))}
                </div>
            </div>
                
            {/* Show arrows / pagination if there's more than one image */}
            {slides?.length > 1 &&
                <div className="navigation">
                    <>
                        <PrevButton enabled={prevBtnEnabled} onClick={scrollPrev} />
                        <NextButton enabled={nextBtnEnabled} onClick={scrollNext} />
                    </>
                    <Pagination
                        currentSlide={selectedSlide + 1}
                        slidesLength={embla?.scrollSnapList()?.length}
                    />
                </div>
            }            
        </Slider>
    );
};

export default EmblaCarousel;
