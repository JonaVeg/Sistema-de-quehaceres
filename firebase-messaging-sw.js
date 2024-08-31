importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

// Inicializa Firebase en el service worker
firebase.initializeApp({
    apiKey: "AIzaSyDOhPxir8yd3Dto8bmxTRLILzfdWdnjqig",
    authDomain: "basededatos-92907.firebaseapp.com",
    projectId: "basededatos-92907",
    storageBucket: "basededatos-92907.appspot.com",
    messagingSenderId: "66836963789",
    appId: "1:66836963789:web:714d0a03c8309c6248a484"
});

const messaging = firebase.messaging();

// Manejar mensajes en segundo plano
messaging.onBackgroundMessage(function(payload) {
    console.log('Mensaje recibido en segundo plano:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
