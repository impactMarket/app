import React, { useContext, useEffect, useState } from 'react';

const OnlineStatusContext = React.createContext(true);

export const OnlineStatusProvider = (props: {
    children: React.ReactNode | JSX.Element;
}) => {
    const [onlineStatus, setOnlineStatus] = useState(true);

    useEffect(() => {
        window.addEventListener('offline', () => {
            setOnlineStatus(false);
        });
        window.addEventListener('online', () => {
            setOnlineStatus(true);
        });

        return () => {
            window.removeEventListener('offline', () => {
                setOnlineStatus(false);
            });
            window.removeEventListener('online', () => {
                setOnlineStatus(true);
            });
        };
    }, []);

    return (
        <OnlineStatusContext.Provider value={onlineStatus}>
            {props.children}
        </OnlineStatusContext.Provider>
    );
};

export const useOnlineStatus = () => {
    const store = useContext(OnlineStatusContext);

    return store;
};
