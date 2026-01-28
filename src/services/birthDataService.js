import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Fetches user's saved birth data from Firestore
 * @param {string} userId - The user's Firebase UID
 * @returns {Object|null} Birth data object or null if not found
 */
export const fetchUserBirthData = async (userId) => {
    try {
        if (!userId) return null;

        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const data = userDoc.data();

            // Check if birth data exists
            if (data.birthdate && data.birthtime && data.birthplace) {
                return {
                    name: data.name || data.username || '',
                    place: data.birthplace,
                    date: data.birthdate,
                    time: data.birthtime,
                    // Parse date and time for compatibility
                    ...parseDateAndTime(data.birthdate, data.birthtime)
                };
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching user birth data:', error);
        return null;
    }
};

/**
 * Helper to parse date and time strings into component parts
 */
const parseDateAndTime = (dateStr, timeStr) => {
    const result = {};

    // Parse date (format: DD/MM/YYYY)
    if (dateStr) {
        const dateParts = dateStr.split('/');
        if (dateParts.length === 3) {
            result.day = dateParts[0];
            result.month = dateParts[1];
            result.year = dateParts[2];
        }
    }

    // Parse time (format: HH:MM:SS or HH:MM)
    if (timeStr) {
        const timeParts = timeStr.split(':');
        if (timeParts.length >= 2) {
            result.hour = timeParts[0];
            result.min = timeParts[1];
            result.sec = timeParts[2] || '00';
        }
    }

    return result;
};
