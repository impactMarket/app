import React, { useContext, useState } from 'react';
import type { Signer } from '@ethersproject/abstract-signer';

type SignerStateType = {
    address: string | null;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    setSigner: React.Dispatch<React.SetStateAction<Signer>>;
    signer: Signer | null;
};
const intialSignerStateData: SignerStateType = {
    address: null,
    setAddress: () => {},
    setSigner: () => {},
    signer: null
};

export const SignerContext = React.createContext<SignerStateType>(
    intialSignerStateData
);

export const SignerProvider = (props: {
    children: React.ReactNode | JSX.Element;
}) => {
    const [address, setAddress] = useState<string | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);

    return (
        <SignerContext.Provider
            value={{
                address,
                setAddress,
                setSigner,
                signer
            }}
        >
            {props.children}
        </SignerContext.Provider>
    );
};

export const useSigner = () => {
    const { address, signer } = useContext(SignerContext);

    return { address, signer };
};
