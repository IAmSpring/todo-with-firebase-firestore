import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Holds the configuration properties for Firebase.
 */
const firebaseConfig = {
    apiKey: 'AIzaSyCWARVDIlZtl6RfB45QXw31hiQl1CdNciQ',
    authDomain: 'todo-e742e.firebaseapp.com',
    projectId: 'todo-e742e',
    storageBucket: 'todo-e742e.appspot.com',
    messagingSenderId: '1068897645060',
    appId: '1:1068897645060:web:d48ed2f67a08096857bb51',
};

/**
 * Initializes the Firebase app with the above configuration.
 * The returned `FirebaseApp` instance is then used to access all other Firebase services.
 */
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
