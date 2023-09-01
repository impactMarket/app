import { initializeApp } from 'firebase/app';
import config from 'config';

const firebaseConfig = {
    apiKey: config.fbApiKey,
    appId: config.fbAppId,
    authDomain: config.fbAuthDomain,
    measurementId: config.fbMeasurementId,
    messagingSenderId: config.fbMessagingSenderId,
    projectId: config.fbProjectId,
    storageBucket: config.fbStorageBucket
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
