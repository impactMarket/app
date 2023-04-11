import { Icon, Img, colors } from '@impact-market/ui';
import { Pagination } from './SliderButtons';
import { getImage } from '../../utils/images';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import useEmblaCarousel from 'embla-carousel-react'


type PropType = {
    slides: number[];
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

const StyledArrows = styled.div`
    .embla__arrow{
        background-color: ${colors.n01};
        border-radius: 8px;
        border: 1px solid ${colors.g300};
        box-shadow: 0px 1px 2px rgb(16 24 40 / 5%);
        cursor: pointer;
        padding: 0.5rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        :disabled{
            cursor: unset;
            opacity: 0.3;
        }
    }
    .embla__next{
        right: 1rem;
    }
    .embla__prev{
        left: 1rem;
    }
`;

const EmblaCarousel = (props: PropType) => {
    const { slides } = props
    
    const [viewportRef, embla] = useEmblaCarousel({     
        align: "start",
        inViewThreshold: 0.7, 
        loop: false,
        skipSnaps: false,
    });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(0)

    const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
    const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

    const onSelect = useCallback(() => {
        if (!embla) return;
        setPrevBtnEnabled(embla.canScrollPrev())
        setNextBtnEnabled(embla.canScrollNext());
        setSelectedSlide(embla.selectedScrollSnap());
    }, [embla, selectedSlide]);

    useEffect(() => {
        if (!embla) return;
        onSelect();
        embla.on("select", onSelect);
        embla.on('reInit', onSelect);
    }, [embla, onSelect]);

    const PrevButton = ({ enabled, onClick }: any) => (
        <StyledArrows>
            <button className="embla__prev embla__arrow" disabled={!enabled} onClick={onClick}>
                <Icon
                    g700 
                    icon="arrowLeft"
                />
            </button>
        </StyledArrows>
    );
    
    const NextButton = ({ enabled, onClick }: any) => (
        <StyledArrows>
            <button className="embla__next embla__arrow" disabled={!enabled} onClick={onClick}> 
                <Icon
                    g700 
                    icon="arrowRight"  
                />
            </button>
        </StyledArrows>
    );

    return (
        <Slider className="embla">
            <div className="embla__viewport" ref={viewportRef}>
                <div className="embla__container">
                    {slides?.map((slide, key) => (
                        <div className="embla__slide" key={key}>
                            <Img 
                                alt=""
                                maxH="100%"
                                maxW="100%"
                                url={getImage({filePath: slide, fit: 'cover', height: 0, width: 0} as any)}
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
