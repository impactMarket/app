import * as Sentry from '@sentry/browser';
import { getCookie } from 'cookies-next';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import config from '../../../config';
import firebaseApp from 'src/utils/firebase/firebase';

export const handleFirebaseServiceWorker = async (
    eip712_signature: string,
    eip712_message: string,
    message: string,
    signature: string
) => {
    const hasFirebaseSupport = await isSupported();

    if (hasFirebaseSupport) {
        const messaging = getMessaging(firebaseApp);
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
                vapidKey: config.fbVapidKey
            });

            if (currentToken) {
                // Send Firebase token to endpoint /user
                try {
                    await fetch(`${config.baseApiUrl}/users`, {
                        body: JSON.stringify({
                            appPNT: currentToken
                        }),
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${getCookie(
                                'AUTH_TOKEN'
                            )?.toString()}`,
                            'Content-Type': 'application/json',
                            eip712signature: eip712_signature,
                            eip712value: eip712_message,
                            message,
                            signature
                        },
                        method: 'PUT'
                    });
                } catch (e: any) {
                    console.log(e);
                    Sentry.captureException(e);
                }
            } else {
                console.log(
                    'No registration token available. Request permission to generate one.'
                );
            }
        } else {
            console.log('Notification permission not granted');
        }
    }
};
