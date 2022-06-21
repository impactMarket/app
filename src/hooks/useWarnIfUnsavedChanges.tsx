/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-throw-literal */
/* eslint-disable no-alert */
import { openModal } from '@impact-market/ui';
import { useBeforeUnload } from "react-use";
import { useEffect } from "react";
import { useLocalStorage } from '../hooks/useStorage';
import Router, { useRouter } from "next/router";

export const loadUnsavedChanges = (key: string, address: string) => {
    const [info] = useLocalStorage(key, undefined);

    if (!info || info?.address !== address) {
        return null;
    }

    return info;
};

export const useLeavePageConfirm = (unsavedChanges: boolean, message = "2 Are you sure want to leave this page?") => {
    // useBeforeUnload(unsavedChanges, message);
  
    // useEffect(() => {
    //     if (unsavedChanges) {
    //         const handler = () => {
    //             openModal('confirmBeforeExitAddCommunity');
    //             throw "Route Canceled";
    //         };
    
    //         Router.events.on("routeChangeStart", handler);
    
    //         return () => {
    //             Router.events.off("routeChangeStart", handler);
    //         };
    //     }
    // }, [unsavedChanges]);
};

export const useWarnIfUnsavedChanges = (unsavedChanges: boolean, callback: Function) => {
    const router = useRouter();

    // useEffect(() => {
    //     if (unsavedChanges) {
    //         const routeChangeStart = () => {
    //             // const ok = callback();

    //             // if (!ok) {
    //                 Router.events.emit("routeChangeError");
    //                 console.log("Abort route change. Please ignore this error.");
    //             // }
    //         }
            
    //         Router.events.on("routeChangeStart", routeChangeStart);

    //         return () => {
    //             Router.events.off("routeChangeStart", routeChangeStart);
    //         }
    //     }
    // }, [unsavedChanges]);

    // const router = useRouter();

    // useEffect(() => {
    //     router.beforePopState(() => {
    //         console.log("hello");
    //         if (unsavedChanges) {
    //             console.log("Abort route change. Please ignore this error.");

    //             return false;
    //         }
    
    //         return true;
    //     });
    //   }, [unsavedChanges]);

    // useEffect(() => {
    //     const warningText = 'You have unsaved changes - are you sure you wish to leave this page?';

    //     const handleWindowClose = (e: BeforeUnloadEvent) => {
    //         if (!unsavedChanges) return;
    //         e.preventDefault();
            
    //         return (e.returnValue = warningText);
    //     };

    //     const handleBrowseAway = () => {
    //         if (!unsavedChanges) return;
    //         // if (window.confirm(warningText)) return;
            
    //         openModal('confirmBeforeExitAddCommunity', { callback });

    //         // router.events.emit('routeChangeError');
    //         // console.log('routeChange aborted.');
    //     };

    //     window.addEventListener('beforeunload', handleWindowClose);
    //     router.events.on('routeChangeStart', handleBrowseAway);

    //     return () => {
    //         window.removeEventListener('beforeunload', handleWindowClose);
    //         router.events.off('routeChangeStart', handleBrowseAway);
    //     };
    // }, [unsavedChanges]);


};

// export default useWarnIfUnsavedChanges;
