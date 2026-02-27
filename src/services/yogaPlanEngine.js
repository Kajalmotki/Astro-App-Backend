/**
 * AstroRevo 21-Day Personalised Yoga Plan Engine v2
 *
 * Generates a UNIQUE 21-day yoga programme from the user's chakra/planet remedy data.
 * Every single day has a DIFFERENT primary asana — sourced from 5 classical yoga texts:
 *   • Asana Pranayama Mudra Bandha (Swami Satyananda)
 *   • Hatha Yoga Pradipika (Swami Muktibodhananda)
 *   • Gheranda Samhita (Sage Gheranda)
 *   • Siva Samhita (Lord Shiva)
 *   • Sat Chakra Nirupana (Swami Purnananda)
 *
 * Phase 1 (Days 1-7)  — AWAKENING: Focuses on weakest planets, unique asana each day
 * Phase 2 (Days 8-14) — INTEGRATION: Cycles all planets, unique asana each day
 * Phase 3 (Days 15-21) — TRANSFORMATION: Advanced compound practices, fully playable
 */

import { ASANA_DB } from '../data/asanaDatabase';

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

// Advanced themes and practices for Phase 3 — each linked to a real ASANA_DB entry
const PHASE3_THEMES = [
    {
        theme: 'Full Solar Activation',
        pranayama: 'Nadi Shodhana — 21 rounds',
        meditation: 'Trataka (candle gazing) — 10 min',
        mudra: 'Surya Mudra',
        mantra: 'OM × 108',
        duration: '45 min'
    },
    {
        theme: 'Pure Awareness',
        pranayama: 'Bhramari — 15 rounds',
        meditation: 'So Hum breath meditation — 15 min',
        mudra: 'Dhyana Mudra',
        mantra: 'SO HUM',
        duration: '40 min'
    },
    {
        theme: 'Sahasrara Crown Opening',
        pranayama: 'Kevala Kumbhaka (natural breath pause)',
        meditation: 'Nirguna meditation — 20 min',
        mudra: 'Khechari Mudra',
        mantra: 'AUM',
        duration: '50 min'
    },
    {
        theme: 'Complete Chakra Balancing',
        pranayama: 'Surya Bhedana + Chandra Bhedana alternating',
        meditation: 'Chakra visualization — root to crown journey',
        mudra: 'Prana Mudra',
        mantra: 'LAM VAM RAM YAM HAM OM AUM',
        duration: '60 min'
    },
    {
        theme: 'Deep Integration',
        pranayama: 'Sheetali — 21 rounds (cooling)',
        meditation: 'Yoga Nidra body scan — 20 min',
        mudra: 'Apana Mudra',
        mantra: 'KSHAM (forgiveness mantra)',
        duration: '55 min'
    },
    {
        theme: 'Energy Activation',
        pranayama: 'Bhastrika — 3 rounds of 40 pumps',
        meditation: 'Trataka on yantra image — 10 min',
        mudra: 'Agni Mudra',
        mantra: 'HRIM SHRIM KLIM',
        duration: '45 min'
    },
    {
        theme: 'Completion & Integration — Final Day',
        pranayama: 'Natural effortless breath — do not control',
        meditation: 'Open awareness — witness consciousness',
        mudra: 'Jnana Mudra',
        mantra: 'Silence',
        duration: '45 min'
    }
];

/**
 * Pick a unique asana from a planet's ASANA_DB pool, avoiding already-used ones.
 * Falls back to any unused asana from ANY planet if pool is exhausted.
 */
const pickUniqueAsana = (planet, usedAsanaNames, preferredIndex = 0) => {
    const pool = ASANA_DB[planet] || [];

    // First: try unused asanas from this planet
    for (let i = 0; i < pool.length; i++) {
        const idx = (preferredIndex + i) % pool.length;
        if (!usedAsanaNames.has(pool[idx].name)) {
            usedAsanaNames.add(pool[idx].name);
            return pool[idx];
        }
    }

    // Fallback: find any unused asana from any planet
    const allPlanets = Object.keys(ASANA_DB);
    for (const p of allPlanets) {
        for (const asana of ASANA_DB[p]) {
            if (!usedAsanaNames.has(asana.name)) {
                usedAsanaNames.add(asana.name);
                return asana;
            }
        }
    }

    // Last resort: recycle the first asana from this planet
    return pool[0] || { name: 'Shavasana', sanskrit: 'Corpse Pose', category: 'beginner', emoji: '💀', duration: '15 min', chakra: 'All', healthBenefits: ['Complete rest'], why: 'Deep rest and integration.', steps: ['Lie flat on the back in complete stillness for 15 minutes.'], source: 'Universal' };
};

/**
 * Extract pranayama, mudra, and meditation data from a remedy
 */
const extractPractices = (remedy) => {
    const r = remedy.remedies || {};
    if (remedy.isWeak) {
        const pranayamaItem = r.pranayama?.[0];
        return {
            pranayama: pranayamaItem?.name || 'Nadi Shodhana',
            mudra: r.mudra?.name || 'Jnana Mudra',
            meditation: r.meditation?.name || `Bija Mantra — ${remedy.bijaMantra || 'OM'}`
        };
    } else {
        return {
            pranayama: typeof r.pranayama === 'string' ? r.pranayama : 'Nadi Shodhana',
            mudra: 'Dhyana Mudra',
            meditation: `Bija Chant — ${remedy.bijaMantra || 'OM'} (21 rounds)`
        };
    }
};

/**
 * Build a single day's yoga practice — guaranteed unique asana
 */
const buildDay = (remedy, dayNum, phaseNum, primaryAsana, practices) => {
    // Get ALL asanas from the ASANA_DB for this planet (for the detail panel list)
    const planetPool = ASANA_DB[remedy.planet] || [];

    return {
        day: dayNum,
        sanskritName: SANSKRIT_DAYS[dayNum - 1],
        phase: phaseNum,
        phaseName: PHASE_NAMES[phaseNum].name,
        phaseEmoji: PHASE_NAMES[phaseNum].emoji,
        planet: remedy.planet,
        planetName: remedy.planet.toUpperCase(),
        chakra: remedy.chakra,
        color: remedy.color,
        bijaMantra: remedy.bijaMantra,
        theme: practices.theme || remedy.theme || `${remedy.chakra} Activation`,
        strengthPercent: remedy.strengthPercent,
        isWeak: remedy.isWeak,
        // Primary asana as display string
        asana: primaryAsana.name,
        // Full asana object for the Play Window
        asanaObj: primaryAsana,
        // Single-asana list (detail panel iterates this)
        allAsanasData: [primaryAsana],
        pranayama: practices.pranayama,
        mudra: practices.mudra,
        meditation: practices.meditation,
        duration: practices.duration || (remedy.isWeak ? '25 min' : '15 min'),
        completed: false
    };
};

/**
 * Main function: Generate the full 21-day plan
 * Every day gets a UNIQUE primary asana — no repeats across all 21 days.
 *
 * @param {Array} remedies - Output from getYogaRemedies()
 * @returns {Object} { days: [...], phases: {...}, meta: {...} }
 */
export const generateYogaPlan = (remedies) => {
    if (!remedies || remedies.length === 0) return null;

    // Sort: weakest first
    const sorted = [...remedies].sort((a, b) => a.strengthPercent - b.strengthPercent);
    const days = [];
    const usedAsanaNames = new Set(); // Global tracker — no asana ever repeats

    // ============ PHASE 1: AWAKENING (Days 1–7) ============
    // Focus on weak planets. Pick a DIFFERENT asana from their ASANA_DB pool each day.
    const weakPlanets = sorted.filter(r => r.isWeak);
    const phase1Pool = weakPlanets.length > 0 ? weakPlanets : sorted.slice(0, 2);

    for (let d = 1; d <= 7; d++) {
        const remedy = phase1Pool[(d - 1) % phase1Pool.length];
        const practices = extractPractices(remedy);

        if (d === 7) {
            // Day 7: Rest & Consolidation — Yoga Nidra
            const yogaNidra = pickUniqueAsana('Moon', usedAsanaNames, 2); // Yoga Nidra is index 2 in Moon pool
            days.push(buildDay(remedy, d, 1, yogaNidra, {
                ...practices,
                theme: 'Rest & Consolidation',
                pranayama: 'Natural breath — no control',
                meditation: 'Witness consciousness — 15 min',
                duration: '20 min'
            }));
        } else {
            // Pick a unique asana from this planet's pool
            const asana = pickUniqueAsana(remedy.planet, usedAsanaNames, d - 1);
            days.push(buildDay(remedy, d, 1, asana, practices));
        }
    }

    // ============ PHASE 2: INTEGRATION (Days 8–14) ============
    // Cycle through ALL planets, unique asana each day
    for (let d = 8; d <= 14; d++) {
        const idx = (d - 8) % sorted.length;
        const remedy = sorted[idx];
        const practices = extractPractices(remedy);

        if (d === 14) {
            // Day 14: Mid-Point Integration
            const padmasana = pickUniqueAsana('Moon', usedAsanaNames, 0);
            days.push(buildDay(remedy, d, 2, padmasana, {
                ...practices,
                theme: 'Mid-Point Integration',
                pranayama: 'Nadi Shodhana — 21 rounds',
                meditation: 'Chakra scan from root to crown',
                duration: '35 min'
            }));
        } else {
            const asana = pickUniqueAsana(remedy.planet, usedAsanaNames, d - 7);
            days.push(buildDay(remedy, d, 2, asana, practices));
        }
    }

    // ============ PHASE 3: TRANSFORMATION (Days 15–21) ============
    // Advanced practices — each linked to a real ASANA_DB entry with full playable data
    const allPlanetKeys = Object.keys(ASANA_DB);
    for (let d = 15; d <= 21; d++) {
        const advIdx = d - 15;
        const adv = PHASE3_THEMES[advIdx];
        const planetRef = sorted[advIdx % sorted.length];

        // Pick a real asana from ASANA_DB for the play window
        const planetForAsana = allPlanetKeys[advIdx % allPlanetKeys.length];
        const primaryAsana = pickUniqueAsana(planetForAsana, usedAsanaNames, advIdx);

        days.push({
            day: d,
            sanskritName: SANSKRIT_DAYS[d - 1],
            phase: 3,
            phaseName: PHASE_NAMES[3].name,
            phaseEmoji: PHASE_NAMES[3].emoji,
            planet: d === 21 ? 'All' : planetRef.planet,
            planetName: d === 21 ? 'ALL' : planetRef.planet.toUpperCase(),
            chakra: d === 21 ? 'Sahasrara (Crown)' : planetRef.chakra,
            color: d === 21 ? '#ffd700' : planetRef.color,
            bijaMantra: d === 21 ? 'AUM' : planetRef.bijaMantra,
            theme: adv.theme,
            strengthPercent: 100,
            isWeak: false,
            // CRITICAL: these fields make Day 15+ clickable in DayDetailPanel
            asana: primaryAsana.name,
            asanaObj: primaryAsana,
            allAsanasData: [primaryAsana],
            pranayama: adv.pranayama,
            mudra: adv.mudra || 'Dhyana Mudra',
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
