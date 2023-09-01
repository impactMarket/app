importScripts(
    'https://www.gstatic.com/firebasejs/10.2.0/firebase-app-compat.js'
);
importScripts(
    'https://www.gstatic.com/firebasejs/10.2.0/firebase-messaging-compat.js'
);

const firebaseConfig = {
    apiKey: 'AIzaSyA6L7d-v2oRyZO0INgBff1DBa5_A_JOT7k',
    appId: '1:496462583210:web:31c00b21d5a37f75f6c7d3',
    authDomain: 'webapp-98c3f.firebaseapp.com',
    measurementId: 'G-SR8KREX1X3',
    messagingSenderId: '496462583210',
    projectId: 'webapp-98c3f',
    storageBucket: 'webapp-98c3f.appspot.com'
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './img/app-icon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
