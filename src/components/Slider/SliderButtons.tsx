import { CircledIcon } from '@impact-market/ui';
import React from "react";

export const DotButton = ({ selected, onClick }: any) => (
    <button
        className={`embla__dot ${selected ? "is-selected" : ""}`}
        onClick={onClick}
        type="button"
    />
);

export const PrevButton = ({ enabled, onClick }: any) => (
    <button  className="embla__prev embla__arrow" disabled={!enabled} onClick={onClick}>
        <CircledIcon
            icon="arrowLeft"
            small
        />
    </button>
);

export const NextButton = ({ enabled, onClick }: any) => (
    <button  className="embla__next embla__arrow" disabled={!enabled} onClick={onClick}> 
        <CircledIcon
            icon="arrowRight" 
            small    
        />
    </button>
);
