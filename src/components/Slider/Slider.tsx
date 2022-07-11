import { DotButton, NextButton, PrevButton } from "./SliderButtons";
import { Img, colors } from '@impact-market/ui';
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
    position: relative;
    
    .embla__container {
        display: flex;

        .embla__slide {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 0 0 100%;
        }
    }    
    
    .navigation{
        .embla__arrow{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: 0;
            cursor: pointer;

            :disabled{
                cursor: unset;
                opacity: 0.3;
            }
        }
        .embla__prev{
            left: 1rem;
        }
        .embla__next{
            right: 1rem;
        }

        .embla__dots {
            display: flex;
            list-style: none;
            justify-content: center;
            padding:0.5rem;

            .embla__dot {
                background-color: transparent;
                cursor: pointer;
                position: relative;
                padding: 0;
                outline: 0;
                border: 0;
                width: 1.5rem;
                height: 1.5rem;
                margin-right: 0.5rem;
                margin-left: 0.5rem;
                display: flex;
                align-items: center;
            }

            .embla__dot:after {
                background-color: ${colors.p200};
                width: 100%;
                height: 0.2rem;
                content: "";
            }

            .embla__dot.is-selected:after {
                background-color: ${colors.p600};
                opacity: 1;
            }
        }  
    }
`;

const EmblaCarousel = (props: PropType) => {
    const { slides } = props

    const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);

    const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
    const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
    const scrollTo = useCallback((index) => embla && embla.scrollTo(index), [
        embla
    ]);

    const onSelect = useCallback(() => {
        if (!embla) return;
        setSelectedIndex(embla.selectedScrollSnap());
        setPrevBtnEnabled(embla.canScrollPrev());
        setNextBtnEnabled(embla.canScrollNext());
    }, [embla, setSelectedIndex]);

    useEffect(() => {
        if (!embla) return;
        onSelect();
        setScrollSnaps(embla.scrollSnapList());
        embla.on("select", onSelect);
    }, [embla, setScrollSnaps, onSelect]);

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
                
            {/* Show arrows / dots if there's more than one image */}
            {slides?.length > 1 &&
            <div className="navigation">
                <>
                    <PrevButton enabled={prevBtnEnabled} onClick={scrollPrev} />
                    <NextButton enabled={nextBtnEnabled} onClick={scrollNext} />
                </>
                <>
                    <div className="embla__dots">
                        {scrollSnaps.map((_, index) => (
                            <DotButton
                                key={index}
                                onClick={() => scrollTo(index)}
                                selected={index === selectedIndex}
                            />
                        ))}
                    </div>
                </>
            </div>
            }            
        </Slider>
    );
};

export default EmblaCarousel;
