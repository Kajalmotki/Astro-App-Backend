/**
 * AstroRevo 21-Day Personalised Yoga Plan Engine
 *
 * Generates a unique 21-day yoga programme from the user's chakra/planet remedy data.
 * Phase 1 (Days 1-7)  — AWAKENING: Focuses on the 2 weakest planets (most healing)
 * Phase 2 (Days 8-14) — INTEGRATION: Cycles all planets for comprehensive balancing
 * Phase 3 (15-21)     — TRANSFORMATION: Advanced practices + culminating meditation
 */

// Sanskrit day names for the 21-day arc
const SANSKRIT_DAYS = [
    'Pratham', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dvadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    'Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi'
];

const PHASE_NAMES = {
    1: { name: 'Awakening', subtitle: 'Rooting the Prana', emoji: '🌱', days: [1, 7] },
    2: { name: 'Integration', subtitle: 'Balancing the Elements', emoji: '🌊', days: [8, 14] },
    3: { name: 'Transformation', subtitle: 'Rising to Light', emoji: '✨', days: [15, 21] }
};

// Advanced practices for the transformation phase
const ADVANCED_PRACTICES = [
    {
        asana: 'Surya Namaskar (12 rounds)',
        pranayama: 'Nadi Shodhana — 21 rounds',
        meditation: 'Trataka (candle gazing) — 10 min',
        mantra: 'OM × 108',
        duration: '45 min',
        theme: 'Full Solar Activation'
    },
    {
        asana: 'Padmasana — 20 min seated',
        pranayama: 'Bhramari — 15 rounds',
        meditation: 'So Hum breath meditation — 15 min',
        mantra: 'SO HUM',
        duration: '40 min',
        theme: 'Pure Awareness'
    },
    {
        asana: 'Sirshasana + Sarvangasana sequence',
        pranayama: 'Kevala Kumbhaka (natural breath pause)',
        meditation: 'Nirguna meditation — 20 min',
        mantra: 'AUM',
        duration: '50 min',
        theme: 'Sahasrara Crown Opening'
    },
    {
        asana: 'Full Chakra Flow sequence (Root to Crown)',
        pranayama: 'Surya Bhedana + Chandra Bhedana alternating',
        meditation: 'Chakra visualization — root to crown journey',
        mantra: 'LAM VAM RAM YAM HAM OM AUM',
        duration: '60 min',
        theme: 'Complete Chakra Balancing'
    },
    {
        asana: 'Yin Yoga: 5 min holds in Malasana, Baddha Konasana, Eka Pada Rajakapotasana',
        pranayama: 'Sheetali — 21 rounds (cooling)',
        meditation: 'Yoga Nidra body scan — 20 min',
        mantra: 'KSHAM (forgiveness mantra)',
        duration: '55 min',
        theme: 'Deep Integration'
    },
    {
        asana: 'Chakrasana (Wheel Pose) + backbend sequence',
        pranayama: 'Bhastrika — 3 rounds of 40 pumps',
        meditation: 'Trataka on yantra image — 10 min',
        mantra: 'HRIM SHRIM KLIM',
        duration: '45 min',
        theme: 'Energy Activation'
    },
    {
        asana: 'Meditation walk (walking Yoga Nidra) — 15 min + Shavasana — 20 min',
        pranayama: 'Natural effortless breath — do not control',
        meditation: 'Open awareness — witness consciousness',
        mantra: 'Silence',
        duration: '45 min',
        theme: 'Completion & Integration'
    }
];

/**
 * Builds a single day's yoga practice from a planet remedy
 */
const buildDayFromRemedy = (remedy, dayNum, phaseNum) => {
    const { weeklyPlanAsanas, pranayama, mudra, meditation } = buildExtracts(remedy);

    return {
        day: dayNum,
        sanskritName: SANSKRIT_DAYS[dayNum - 1],
        phase: phaseNum,
        phaseName: PHASE_NAMES[phaseNum].name,
        phaseEmoji: PHASE_NAMES[phaseNum].emoji,
        planet: remedy.planet,
        chakra: remedy.chakra,
        color: remedy.color,
        bijaMantra: remedy.bijaMantra,
        theme: remedy.theme,
        strengthPercent: remedy.strengthPercent,
        isWeak: remedy.isWeak,
        asana: weeklyPlanAsanas,
        pranayama: pranayama,
        mudra: mudra,
        meditation: meditation,
        duration: remedy.isWeak ? '25 min' : '15 min',
        completed: false
    };
};

const buildExtracts = (remedy) => {
    const r = remedy.remedies || {};
    if (remedy.isWeak) {
        const asana = r.asanas?.[0] || { name: 'Shavasana', description: 'Complete rest' };
        const pranayamaItem = r.pranayama?.[0] || { name: 'Nadi Shodhana', description: '10 rounds' };
        return {
            weeklyPlanAsanas: `${asana.name || 'Shavasana'}`,
            pranayama: pranayamaItem.name || 'Nadi Shodhana',
            mudra: r.mudra?.name || 'Jnana Mudra',
            meditation: r.meditation?.name || `Bija Mantra — ${remedy.bijaMantra || 'OM'}`
        };
    } else {
        const asanas = r.asanas || ['Shavasana'];
        return {
            weeklyPlanAsanas: asanas[0] || 'Shavasana',
            pranayama: r.pranayama || 'Nadi Shodhana',
            mudra: 'Dhyana Mudra',
            meditation: `Bija Chant — ${remedy.bijaMantra || 'OM'} (21 rounds)`
        };
    }
};

/**
 * Main function: Generate the full 21-day plan
 * @param {Array} remedies - Output from getYogaRemedies()
 * @returns {Object} { days: [...], phases: {...}, meta: {...} }
 */
export const generateYogaPlan = (remedies) => {
    if (!remedies || remedies.length === 0) return null;

    // Sort: weakest first (already sorted by getYogaRemedies)
    const sorted = [...remedies].sort((a, b) => a.strengthPercent - b.strengthPercent);
    const days = [];

    // ============ PHASE 1: AWAKENING (Days 1-7) ============
    // Focus the 2 weakest planets daily, cycling between them
    const weakPlanets = sorted.filter(r => r.isWeak);
    const phase1Pool = weakPlanets.length > 0 ? weakPlanets : sorted.slice(0, 2);

    for (let d = 1; d <= 7; d++) {
        const remedy = phase1Pool[(d - 1) % phase1Pool.length];
        // Day 4 and 7 use second asana variant if available
        const dayData = buildDayFromRemedy(remedy, d, 1);
        if ((d === 4 || d === 7) && remedy.isWeak && remedy.remedies.asanas?.length > 1) {
            dayData.asana = remedy.remedies.asanas[1].name;
        }
        // Day 7 is always a rest/consolidation day
        if (d === 7) {
            dayData.asana = 'Yoga Nidra (Deep Relaxation)';
            dayData.pranayama = 'Natural breath — no control';
            dayData.meditation = 'Witness consciousness — 15 min';
            dayData.duration = '20 min';
            dayData.theme = 'Rest & Consolidation';
        }
        days.push(dayData);
    }

    // ============ PHASE 2: INTEGRATION (Days 8-14) ============
    // Cycle through ALL planets, balancing the full spectrum
    for (let d = 8; d <= 14; d++) {
        const idx = (d - 8) % sorted.length;
        const remedy = sorted[idx];
        const dayData = buildDayFromRemedy(remedy, d, 2);
        // Day 14 is always a pranayama-heavy integration day
        if (d === 14) {
            dayData.asana = 'Padmasana (Lotus Pose) — 15 min';
            dayData.pranayama = 'Nadi Shodhana — 21 rounds';
            dayData.meditation = 'Chakra scan from root to crown';
            dayData.duration = '35 min';
            dayData.theme = 'Mid-Point Integration';
        }
        days.push(dayData);
    }

    // ============ PHASE 3: TRANSFORMATION (Days 15-21) ============
    // Advanced practices culminating in the final day
    for (let d = 15; d <= 21; d++) {
        const advIdx = d - 15;
        const adv = ADVANCED_PRACTICES[advIdx];
        // Use the weakest planet's color for this phase
        const planetRef = sorted[advIdx % sorted.length];
        days.push({
            day: d,
            sanskritName: SANSKRIT_DAYS[d - 1],
            phase: 3,
            phaseName: PHASE_NAMES[3].name,
            phaseEmoji: PHASE_NAMES[3].emoji,
            planet: d === 21 ? 'All' : planetRef.planet,
            chakra: d === 21 ? 'Sahasrara (Crown)' : planetRef.chakra,
            color: d === 21 ? '#ffd700' : planetRef.color,
            bijaMantra: d === 21 ? 'AUM' : planetRef.bijaMantra,
            theme: adv.theme,
            strengthPercent: 100,
            isWeak: false,
            asana: adv.asana,
            pranayama: adv.pranayama,
            mudra: 'Dhyana Mudra',
            meditation: adv.meditation,
            duration: adv.duration,
            completed: false
        });
    }

    const weakPlanetNames = weakPlanets.map(r => r.planet).join(', ') || 'all planets';
    return {
        days,
        phases: PHASE_NAMES,
        meta: {
            totalDays: 21,
            weakPlanets: weakPlanetNames,
            generatedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            completedDays: 0
        }
    };
};
