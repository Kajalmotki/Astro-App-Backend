import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin SDK — singleton initialisation.
 * Reads credentials from environment variables so no JSON key file is needed
 * (safer for Vercel / serverless deployment).
 *
 * Required env vars:
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY   (the PEM string — newlines encoded as \n)
 */
let _db = null;

export function getAdminDb() {
    if (_db) return _db;

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        console.warn(
            '⚠ Firebase Admin env vars missing — Firestore-dependent routes will fail.',
        );
        return null;
    }

    // When reading from .env the literal \n sequences need to become real newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    if (getApps().length === 0) {
        initializeApp({
            credential: cert({ projectId, clientEmail, privateKey }),
        });
    }

    _db = getFirestore();
    return _db;
}
