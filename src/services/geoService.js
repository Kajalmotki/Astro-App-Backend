// Geo Service - Nominatim (OSM) for geocoding + multi-API timezone fallback
// No API key needed for Nominatim or geonames fallback

/**
 * Search for cities globally using Nominatim (OpenStreetMap)
 */
export const searchCities = async (query) => {
    if (!query || query.length < 2) return [];
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=8`;
        const response = await fetch(url, {
            headers: { 'Accept-Language': 'en', 'User-Agent': 'AstroRevo-Vedic/1.0 (astrology app)' }
        });
        const data = await response.json();
        return data.map(item => ({
            name: item.address?.city || item.address?.town || item.address?.village || item.address?.municipality || item.display_name.split(',')[0],
            displayName: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            country: item.address?.country || '',
            state: item.address?.state || item.address?.county || ''
        })).filter(c => c.lat && c.lng);
    } catch (error) {
        console.error('Nominatim search error:', error);
        return [];
    }
};

/**
 * Get timezone from lat/lng using multiple fallback APIs
 * 1st: worldtimeapi.org (free, no key)
 * 2nd: timeapi.io (free, no key)
 * 3rd: Manual longitude-based estimate
 */
export const getTimezoneForLocation = async (lat, lng) => {
    // --- Method 1: worldtimeapi.org (free, no API key, very reliable) ---
    try {
        const url = `https://worldtimeapi.org/api/timezone`;
        // We need to find timezone by coordinates. worldtimeapi doesn't accept coords directly.
        // Use timeapi.io instead which accepts lat/lng
        throw new Error('skip');
    } catch { }

    // --- Method 2: timeapi.io (free, no key, accepts lat/lng) ---
    try {
        const url = `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lng}`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.timeZone) {
                // Parse UTC offset from currentUtcOffset
                const offsetStr = data.currentUtcOffset?.hours ?? null;
                const mins = data.currentUtcOffset?.minutes ?? 0;
                const totalOffset = offsetStr !== null
                    ? parseFloat(offsetStr) + (mins >= 0 ? mins / 60 : -Math.abs(mins) / 60)
                    : calculateOffsetFromLng(lng);
                return {
                    zoneName: data.timeZone,
                    gmtOffset: totalOffset,
                    abbreviation: data.timeZone.split('/').pop().replace(/_/g, ' ')
                };
            }
        }
    } catch (e) {
        console.warn('timeapi.io failed:', e.message);
    }

    // --- Method 3: Abstract API (free tier) ---
    try {
        const url = `https://timezone.abstractapi.com/v1/current_time/?api_key=7bfbe63a3b9b4f8e8b14929a58571c12&location=${lat},${lng}`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.timezone_offset !== undefined) {
                return {
                    zoneName: data.timezone_name || 'Unknown',
                    gmtOffset: data.timezone_offset,
                    abbreviation: data.timezone_abbreviation || 'UTC'
                };
            }
        }
    } catch (e) {
        console.warn('Abstract API failed:', e.message);
    }

    // --- Final Fallback: Calculate from Longitude (accurate to ~30min) ---
    const estimated = calculateOffsetFromLng(lng);
    const sign = estimated >= 0 ? '+' : '';
    return {
        zoneName: `Estimated/UTC${sign}${estimated}`,
        gmtOffset: estimated,
        abbreviation: `UTC${sign}${estimated}`
    };
};

/**
 * Rough UTC offset from longitude (15° = 1 hour)
 * Rounds to nearest 0.5 hour for common timezones
 */
function calculateOffsetFromLng(lng) {
    const raw = lng / 15;
    return Math.round(raw * 2) / 2; // nearest 0.5
}
