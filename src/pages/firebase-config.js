import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBJY0LjxhMOeVNMa7C0QJ7au9tkBjDdtIo",
    authDomain: "echo-e3e6c.firebaseapp.com",
    projectId: "echo-e3e6c",
    storageBucket: "echo-e3e6c.firebasestorage.app",
    messagingSenderId: "856781900457",
    appId: "1:856781900457:web:bca98edb05245991f577b8",
    measurementId: "G-JLSHKVY4FD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore();

// Firebase utility functions
export const setFirestoreUser = async (userId, userData) => {
    const userRef = doc(db, "users", userId);
    return await setDoc(userRef, userData);
};

export const updateFirestoreUser = async (userId, userData) => {
    const userRef = doc(db, "users", userId);
    return await updateDoc(userRef, userData);
};

export const setRegistration = async (registrationData) => {
    const registrationID = window.crypto.randomUUID();
    const registrationRef = doc(db, "registration", registrationID);
    return await setDoc(registrationRef, registrationData);
}

export const getFirestoreUser = async (userId) => {
    const userRef = doc(db, "users", userId);

    try {
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            return userData;
        }
    } catch (e) {
        console.log(e);
    }
};

export const fetchSpotifyToken = async () => {
    const client_id = "1017f35acbf44abfa9c2e9466d5fc059";
    const client_secret = "17480ca082ca45d1a363ed737589b8ff";
    const authString = btoa(`${client_id}:${client_secret}`);

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ grant_type: 'client_credentials' }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("spotifyAuthorization", data.access_token)
        } else {
            console.error('Error fetching token:', response.statusText);
            // return null;
        }
    } catch (error) {
        console.error('Error fetching token:', error);
        // return null;
    }
};

export const getSpotifyToken = () => {
    return localStorage.getItem("spotifyAuthorization")
}
