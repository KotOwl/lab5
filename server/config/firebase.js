import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

let db;

try {
    if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID
        });
        db = admin.firestore();
        console.log('Firebase initialized (Project ID:', process.env.FIREBASE_PROJECT_ID, ')');
    } else {
        console.warn('FIREBASE_PROJECT_ID not set. Using mock database.');
    }
} catch (error) {
    console.error('Firebase initialization error:', error.message);
    console.warn('Falling back to mock database.');
}

export { db };
