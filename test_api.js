import { precalculateChartData } from './src/services/localAIApi.js';

try {
    const mathData = precalculateChartData({
        date: '01/04/1991',
        time: '09:45',
        lat: 23.0225,
        lng: 72.5714,
        gender: 'Male'
    });
    console.log(mathData);
} catch (e) {
    console.error("DEBUG CRASH:", e);
}
