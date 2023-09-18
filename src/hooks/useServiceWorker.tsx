import { getMessaging, isSupported, onMessage } from 'firebase/messaging';
import firebaseApp from 'src/utils/firebase/firebase';

export function registerFirebaseSW() {
    if (isSupported) {
        const messaging = getMessaging(firebaseApp);
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground push notification received:', payload);
            // Handle the received push notification while the app is in the foreground
            // You can display a notification or update the UI based on the payload
        });

        return () => {
            unsubscribe();
        };
    }
}

export async function unregisterFirebaseSW() {
    try {
        if (isSupported) {
            const registration = await navigator.serviceWorker.getRegistration(
                '/firebase-messaging-sw.js'
            );

            if (registration) {
                const success = await registration.unregister();

                if (success) {
                    console.log(
                        'Firebase service worker unregistered successfully.'
                    );
                } else {
                    console.warn(
                        'Failed to unregister Firebase service worker.'
                    );
                }
            }
        }
    } catch (error) {
        console.error('Error unregistering service worker:', error);
    }
}
