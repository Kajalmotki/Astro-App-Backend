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

/**
 * Fetches all saved charts for a user
 * @param {string} userId
 * @returns {Promise<Array>} Array of chart objects
 */
export const fetchSavedCharts = async (userId) => {
    try {
        if (!userId) return [];
        // Implementation for subcollection 'savedCharts'
        const { collection, getDocs } = await import('firebase/firestore');
        const chartsRef = collection(db, 'users', userId, 'savedCharts');
        const snapshot = await getDocs(chartsRef);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            ...parseDateAndTime(doc.data().birthdate, doc.data().birthtime)
        }));
    } catch (error) {
        console.error('Error fetching saved charts:', error);
        return [];
    }
};

/**
 * Saves a new chart to the user's savedCharts subcollection
 * @param {string} userId
 * @param {Object} chartData
 * @returns {Promise<string>} The new chart ID
 */
export const saveNewChart = async (userId, chartData) => {
    try {
        if (!userId) throw new Error('No user ID');
        const { collection, addDoc } = await import('firebase/firestore');

        const chartToSave = {
            name: chartData.name,
            place: chartData.place,
            birthdate: chartData.date || `${chartData.day}/${chartData.month}/${chartData.year}`,
            birthtime: chartData.time || `${chartData.hour}:${chartData.min}:${chartData.sec}`,
            sex: chartData.sex || 'Unknown',
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'users', userId, 'savedCharts'), chartToSave);
        return docRef.id;
    } catch (error) {
        console.error('Error saving new chart:', error);
        throw error;
    }
};

/**
 * Deletes a saved chart
 * @param {string} userId 
 * @param {string} chartId 
 */
export const deleteSavedChart = async (userId, chartId) => {
    try {
        if (!userId || !chartId) return;
        const { doc, deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'users', userId, 'savedCharts', chartId));
    } catch (error) {
        console.error('Error deleting chart:', error);
        throw error;
    }
};
