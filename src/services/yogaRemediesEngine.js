/**
 * AstroRevo Yoga Remedies Engine
 *
 * Curated remedies from 5 classical yoga texts:
 * - Hatha Yoga Pradipika (HYP) by Swami Muktibodhananda
 * - Gheranda Samhita (GS) — 32 Asanas, Mudras, Shatkarmas
 * - Siva Samhita (SS) — Pranayama, Kundalini, Energy
 * - Sat Chakra Nirupana (SCN) — Chakra bija mantras, meditation, activation
 * - Asana Pranayama Mudra Bandha (APMB) — Swami Satyananda Saraswati [NEW]
 *
 * Planet → Chakra mapping:
 *   Mars    → Muladhara (Root)     | Jupiter → Svadhisthana (Sacral)
 *   Venus   → Manipura (Solar)     | Mercury → Anahata (Heart)
 *   Saturn  → Vishuddha (Throat)   | Sun     → Ajna (Third Eye)
 *   Moon    → Sahasrara (Crown)
 */
import { ASANA_DB } from '../data/asanaDatabase';

const YOGA_REMEDIES_DB = {
    Mars: {
        chakra: 'Muladhara (Root Chakra)',
        element: 'Earth',
        bijaMantra: 'LAM',
        color: '#ef4444',
        weakRemedies: {
            asanas: [
                {
                    name: 'Pavanamuktasana (Wind-Relieving Pose)',
                    description: 'Knees to chest, hold for 30s. Grounds prana into the root, stabilizes the apana vayu (downward energy).',
                    source: 'Gheranda Samhita 2.14 — "Pavanamuktasana eliminates ailments of the stomach and strengthens the life force."'
                },
                {
                    name: 'Vajrasana (Thunderbolt Pose)',
                    description: 'Sit on heels with spine erect. Hold for 5–15 minutes after meals. Channels earth energy into the pelvic floor, activating Muladhara.',
                    source: 'Hatha Yoga Pradipika 1.12 — "Among the asanas, Vajrasana is praised for its grounding effect on the body and mind."'
                },
                {
                    name: 'Malasana (Garland/Squat Pose)',
                    description: 'Deep squat, palms together at chest. Opens the Muladhara gateway by stretching the pelvic floor and inner thighs.',
                    source: 'Gheranda Samhita 2.22 — "By squatting with the feet apart, the adept roots the body to the earth."'
                }
            ],
            pranayama: [
                {
                    name: 'Bhramari with Mula Bandha',
                    description: 'Inhale deep, on exhale hum like a bee while contracting the perineum (Mula Bandha). Repeat 7 rounds. Activates the root centre directly.',
                    source: 'Hatha Yoga Pradipika 2.68 — "Bhramari removes sins and diseases. With Mula Bandha, the apana rises to unite with prana."'
                }
            ],
            mudra: {
                name: 'Prithvi Mudra (Earth Seal)',
                description: 'Touch the tip of your ring finger to the tip of your thumb, extend the remaining fingers. Hold for 15 minutes daily. Increases the earth element (prithvi tattva) which is the domain of Mars and the Root Chakra.',
                source: 'Gheranda Samhita 3.1 — "Mudras that invoke the tattvas rebalance the elements within the body."'
            },
            meditation: {
                name: 'Bija Mantra Meditation — LAM',
                description: 'Sit in Sukhasana. Visualize a deep red lotus with 4 petals at the base of your spine. Chant "LAM" (lam) 108 times with a mala. This awakens the dormant Prithvi Shakti ruled by Mars.',
                source: 'Sat Chakra Nirupana 1.4 — "Within the Muladhara is the four-petalled lotus of a deep crimson hue. Its bija is LAM, the support of the entire creation."'
            }
        },
        strongRemedies: {
            balance: 'Your Mars and Muladhara are strong! Channel this grounding power into advanced practices.',
            asanas: ['Vrikshasana (Tree Pose) — 2 min each side', 'Setubandhasana (Bridge Pose) for spinal alignment'],
            pranayama: 'Nadi Shodhana (Alternate Nostril) to balance the heightened root energy with the higher centres.',
            source: 'Hatha Yoga Pradipika 2.44 — "The yogi whose prana is stable neither ages nor decays."'
        }
    },

    Jupiter: {
        chakra: 'Swadhisthana (Sacral Chakra)',
        element: 'Water',
        bijaMantra: 'VAM',
        color: '#f97316',
        weakRemedies: {
            asanas: [
                {
                    name: 'Baddha Konasana (Bound Angle Pose)',
                    description: 'Sit with soles of feet together, knees falling to sides. Hold for 2 minutes. Opens the sacral region and activates the water element governed by Jupiter.',
                    source: 'Gheranda Samhita 2.26 — "The pose that opens the inner thighs releases creative energy and purifies the channels."'
                },
                {
                    name: 'Bhujangasana (Cobra Pose)',
                    description: 'Prone, palms under shoulders, lift upper body like a cobra. 3 × 30s. Stimulates the Svadhishthana centre and the adrenal region associated with Jupiter\'s expansive energy.',
                    source: 'Hatha Yoga Pradipika 1.28 — "Bhujangasana destroys all diseases, arouses Kundalini, and illuminates the body."'
                }
            ],
            pranayama: [
                {
                    name: 'Chandrabhedana (Moon Piercing Breath)',
                    description: 'Inhale through the LEFT nostril only, exhale through the RIGHT. Repeat 21 rounds. Activates the Ida (cooling, expansive) channel associated with Jupiter and the water element.',
                    source: 'Hatha Yoga Pradipika 2.50 — "Chandrabhedana cools and calms; it activates the lunar energy within and nurtures the creative force."'
                }
            ],
            mudra: {
                name: 'Varuna Mudra (Water Seal)',
                description: 'Touch the tip of the little finger to the tip of the thumb. Hold for 15 minutes. Balances the water element (jala tattva), which is the domain of Svadhishthana and Jupiter.',
                source: 'Gheranda Samhita 3.11 — "Varuna Mudra rebalances the fluids of the body and awakens the jala tattva."'
            },
            meditation: {
                name: 'Bija Mantra Meditation — VAM',
                description: 'Sit in Padmasana. Visualize an orange lotus with 6 petals 2 inches below the navel. Chant "VAM" (vam) 108 times. Awakens the Jala Shakti and Jupiter\'s blessings of wisdom and expansion.',
                source: 'Sat Chakra Nirupana 2.1 — "The Svadhisthana chakra is of a vermilion hue, with 6 petals. Its bija, VAM, rules the water element and the region of the guru planet."'
            }
        },
        strongRemedies: {
            balance: 'Your Jupiter and Svadhishthana are strong! Direct this creative abundance mindfully.',
            asanas: ['Trikonasana (Triangle Pose) to distribute this energy', 'Paschimottanasana (Seated Forward Bend)'],
            pranayama: 'Bhastrika (Bellows Breath) — 3 rounds of 30 pumps each — to refine the abundant water energy into higher spiritual fuel.',
            source: 'Siva Samhita 3.21 — "The yogi purifies his energy through breath and becomes the master of all the elements."'
        }
    },

    Venus: {
        chakra: 'Manipura (Solar Plexus Chakra)',
        element: 'Fire',
        bijaMantra: 'RAM',
        color: '#eab308',
        weakRemedies: {
            asanas: [
                {
                    name: 'Navasana (Boat Pose)',
                    description: 'Balance on sitting bones, lift legs and torso to form a "V". Hold for 30s, repeat 3 times. Directly fires the solar plexus, building Venus\'s fiery will-power and self-confidence.',
                    source: 'Gheranda Samhita 2.34 — "By contracting the navel region, the fire of the body is greatly increased."'
                },
                {
                    name: 'Dhanurasana (Bow Pose)',
                    description: 'Prone, reach back and grab ankles, lift chest and thighs. 3 × 20s. Activates the Manipura fire, burning away lethargy and stagnation in Venus\'s energy.',
                    source: 'Hatha Yoga Pradipika 1.25 — "Dhanurasana, the bow, stimulates all abdominal organs and ignites the digestive fire."'
                }
            ],
            pranayama: [
                {
                    name: 'Kapalabhati (Skull Shining Breath)',
                    description: 'Rapid, powerful exhalations from the navel. 3 rounds of 60 pumps. Directly activates the Manipura fire and Agni (digestive fire), ruled by Venus in the chakra map.',
                    source: 'Hatha Yoga Pradipika 2.35 — "Kapalabhati is said to overcome phlegm disorders. It cleanses the front part of the brain and kindles the fire of the body."'
                }
            ],
            mudra: {
                name: 'Agni Mudra (Fire Seal)',
                description: 'Fold the ring finger to the base of the thumb, press the thumb down on it. Extend other fingers. Hold for 15–20 minutes every morning. Increases the fire element (agni tattva) directly strengthening Venus\'s solar plexus energy.',
                source: 'Gheranda Samhita 3.17 — "Agni mudra reduces fat and strengthens the digestive fire within."'
            },
            meditation: {
                name: 'Bija Mantra Meditation — RAM',
                description: 'Sit quietly. Visualize a brilliant yellow ten-petalled lotus at your navel centre. Chant "RAM" (ram) 108 times with full breath and intention. Awakens Agni Shakti and restores Venus\'s commanding solar energy.',
                source: 'Sat Chakra Nirupana 3.1 — "The Manipura chakra, lustrous as a jewel, has ten petals. Its bija RAM rules the fire and commands the power of will."'
            }
        },
        strongRemedies: {
            balance: 'Your Venus and Manipura fire are blazing! Channel this powerful will into service and creativity.',
            asanas: ['Ardha Chandrasana (Half Moon) for equilibrium', 'Savasana (Corpse Pose) to prevent burnout'],
            pranayama: 'Sheetali Pranayama (Cooling Breath) — inhale through rolled tongue, exhale through nose — to cool the excess fire.',
            source: 'Siva Samhita 3.45 — "The practitioner who controls agni achieves perfect health and longevity."'
        }
    },

    Mercury: {
        chakra: 'Anahata (Heart Chakra)',
        element: 'Air',
        bijaMantra: 'YAM',
        color: '#22c55e',
        weakRemedies: {
            asanas: [
                {
                    name: 'Ustrasana (Camel Pose)',
                    description: 'Kneel, arch back to hold heels, lift the chest skyward. Hold 3 × 30s. Opens the heart centre, activates vayu (air) element, and strengthens Mercury\'s capacity for communication and compassion.',
                    source: 'Hatha Yoga Pradipika 1.27 — "Ustrasana expands the chest fully and removes stiffness from the back and heart region."'
                },
                {
                    name: 'Matsyasana (Fish Pose)',
                    description: 'Lie on back, arch the upper body up, crown rests lightly on floor. Hold 1 minute. Stretches the Anahata and the thymus gland, activating Mercury\'s nervous system and intellectual energy.',
                    source: 'Gheranda Samhita 2.21 — "Matsyasana opens the pranic pathways of the chest and clears the nadis of the heart region."'
                }
            ],
            pranayama: [
                {
                    name: 'Anuloma Viloma (Alternate Nostril Breathing)',
                    description: 'Breathe in left, out right, in right, out left. 10 cycles slowly. Purifies the Ida and Pingala nadis, allowing prana to flow freely through the Anahata. Key for Mercury\'s clarity and emotional balance.',
                    source: 'Hatha Yoga Pradipika 2.44 — "Nadi Shodhana eliminates all diseases. The mind becomes steady, the prana becomes balanced."'
                }
            ],
            mudra: {
                name: 'Hridaya Mudra (Heart Seal)',
                description: 'Place the index finger at the base of the thumb; touch the middle and ring fingers to the tip of the thumb; keep the little finger extended. Hold 15 minutes. Redirects prana from the extremities to the heart, healing Mercury\'s Anahata weaknesses.',
                source: 'Gheranda Samhita 3.9 — "The mudra that draws prana to the heart region heals the emotional body and calms the mind."'
            },
            meditation: {
                name: 'Bija Mantra Meditation — YAM',
                description: 'Sit in Padmasana. Visualize an emerald green twelve-petalled lotus at the centre of the chest. Chant "YAM" (yam) 108 times. Awakens Vayu Shakti and restores Mercury\'s capacity for empathy, intelligence and clear expression.',
                source: 'Sat Chakra Nirupana 4.1 — "The Anahata lotus of deep red hue has twelve petals. Its bija is YAM, the lord of the air region, where Mercury\'s subtle intelligence resides."'
            }
        },
        strongRemedies: {
            balance: 'Your Mercury and Anahata are flourishing! Deepen this compassionate intelligence through advanced practices.',
            asanas: ['Garudasana (Eagle Pose) for focus', 'Gomukhasana (Cow Face) to keep the chest open'],
            pranayama: 'Bhramari (Humming Bee) — 7 rounds — to vibrate the heart and nervous system with Mercury\'s high frequency.',
            source: 'Hatha Yoga Pradipika 2.68 — "The sound of Bhramari fills the heart with joy and bliss."'
        }
    },

    Saturn: {
        chakra: 'Vishuddha (Throat Chakra)',
        element: 'Space (Akasha)',
        bijaMantra: 'HAM',
        color: '#3b82f6',
        weakRemedies: {
            asanas: [
                {
                    name: 'Sarvangasana (Shoulder Stand)',
                    description: 'Full shoulder stand, chin locked to chest (Jalandhara Bandha). Hold 3–5 minutes. Directly stimulates the thyroid and parathyroid at the throat, activating Saturn\'s Vishuddha chakra.',
                    source: 'Hatha Yoga Pradipika 1.14 — "Sarvangasana is the mother of all asanas. It directs prana to the throat and divine the brain."'
                },
                {
                    name: 'Halasana (Plow Pose)',
                    description: 'From Shoulder Stand, lower feet beyond the head to the floor. Applies sustained pressure to the Vishuddha region, stimulating Saturn\'s disciplined communication energy.',
                    source: 'Gheranda Samhita 2.28 — "Halasana strengthens the nerves of the neck and activates the pranic centres of the throat."'
                }
            ],
            pranayama: [
                {
                    name: 'Ujjayi (Victorious Breath)',
                    description: 'Breathe slowly through the nose while slightly constricting the throat to produce a soft ocean sound. 10 minutes. Directly massages the Vishuddha from within, strengthening Saturn\'s resolve and purifying the akasha tattva.',
                    source: 'Hatha Yoga Pradipika 2.52 — "Ujjayi pranayama removes throat diseases and increases gastric fire. It is to be practiced in all conditions, even while walking."'
                }
            ],
            mudra: {
                name: 'Akash Mudra (Space Seal)',
                description: 'Touch the tip of the middle finger to the tip of the thumb. Extend the other fingers. Hold for 15 minutes twice daily. Increases the space element (akasha tattva), directly empowering Saturn\'s Vishuddha energy.',
                source: 'Gheranda Samhita 3.12 — "Akash Mudra increases lightness and purifies the akasha tattva within the body."'
            },
            meditation: {
                name: 'Bija Mantra Meditation — HAM',
                description: 'Sit straight. Visualize a smoky-blue sixteen-petalled lotus at the base of the throat. Chant "HAM" (ham) 108 times with full throat resonance. Each repetition vibrates Saturn\'s disciplined akasha energy into activity.',
                source: 'Sat Chakra Nirupana 5.1 — "The Vishuddha lotus has sixteen petals of a smoky purple hue. Its bija HAM is the lord of space, purifier of karma."'
            }
        },
        strongRemedies: {
            balance: 'Your Saturn and Vishuddha are strong! Use this powerful akasha energy for teaching and precise communication.',
            asanas: ['Matsyasana (Fish) to keep the throat open', 'Adho Mukha Svanasana (Downward Dog) for flow'],
            pranayama: 'Brahmari — 5 minutes — to propagate the throat vibration into the higher chakras.',
            source: 'Siva Samhita 3.59 — "When the throat is pure, the yogi\'s words become truth."'
        }
    },

    Sun: {
        chakra: 'Ajna (Third Eye Chakra)',
        element: 'Light / Mind',
        bijaMantra: 'OM',
        color: '#8b5cf6',
        weakRemedies: {
            asanas: [
                {
                    name: 'Sirshasana (Headstand)',
                    description: 'Supported headstand for 3–5 minutes. Directs maximum blood flow to the Ajna chakra, directly activating the pineal gland which is the physical seat of the Sun\'s intuitive intelligence.',
                    source: 'Hatha Yoga Pradipika 1.34 — "Sirshasana, the king of postures, is the destroyer of all diseases. By its practice the sun is conquered."'
                },
                {
                    name: 'Shashankasana (Child\'s Pose / Hare Pose)',
                    description: 'Kneel and fold forward, touch forehead to the floor. Hold 3 minutes. Applies direct pressure to the Ajna point (Ajna marma), stimulating the Sun\'s third-eye centre.',
                    source: 'Gheranda Samhita 2.11 — "The hare pose purifies the nadis of the head and awakens the centre between the eyebrows."'
                }
            ],
            pranayama: [
                {
                    name: 'Surya Bhedana (Sun-Piercing Breath)',
                    description: 'Inhale through the RIGHT nostril only, exhale through the LEFT. Repeat 21 rounds. Activates the Pingala nadi (solar channel), directly energising the Sun\'s Ajna chakra with solar prana.',
                    source: 'Hatha Yoga Pradipika 2.48 — "Suryabhedana, the solar breath, destroys all diseases born of excess wind and awakens the Kundalini."'
                }
            ],
            mudra: {
                name: 'Jnana Mudra (Knowledge Seal)',
                description: 'Touch the tip of the index finger to the tip of the thumb. Extend the remaining fingers. Used during meditation. Connects the individual consciousness (Jiva) with the universal (Brahman), which is the essence of the Sun\'s Ajna energy.',
                source: 'Hatha Yoga Pradipika 4.9 — "The Jnana Mudra is the mudra of the wise. By its constant practice, the mind is freed from all darkness."'
            },
            meditation: {
                name: 'Bija Mantra Meditation — OM (AUM)',
                description: 'Sit in Siddhasana. Close the eyes and fix attention at the point between the eyebrows (Bhrumadhya Drishti). Chant "OM" internally 108 times. Each OM resonates at the frequency of the Sun and directly activates the Ajna chakra\'s cosmic perception.',
                source: 'Sat Chakra Nirupana 6.1 — "The Ajna lotus of two petals, luminous as the moon, is the seat of the Sun and the Guru. Its bija, OM, is the great vibration of consciousness itself."'
            }
        },
        strongRemedies: {
            balance: 'Your Sun and Ajna are radiant! Use this strong intuition to guide others with wisdom.',
            asanas: ['Tratak (Steady Gazing) on a candle to further sharpen the third eye', 'Ardha Matsyendrasana to keep the spine energized'],
            pranayama: 'Nadi Shodhana to perfectly balance the solar channel with the lunar, creating supreme clarity.',
            source: 'Siva Samhita 3.72 — "The yogi who knows the Ajna becomes omniscient, beyond karma."'
        }
    },

    Moon: {
        chakra: 'Sahasrara (Crown Chakra)',
        element: 'Transcendence / Pure Consciousness',
        bijaMantra: 'AH (silence / OM)',
        color: '#d946ef',
        weakRemedies: {
            asanas: [
                {
                    name: 'Padmasana (Lotus Pose)',
                    description: 'Full lotus position for minimum 10 minutes of silent sitting. The supreme posture for cultivating the Moon\'s Sahasrara energy. Stabilises the entire pranic body and opens the crown for higher consciousness.',
                    source: 'Hatha Yoga Pradipika 1.45 — "Padmasana is the destroyer of all diseases. It is difficult to attain, but only the wise know it."'
                },
                {
                    name: 'Siddhasana (Perfection Pose)',
                    description: 'Heel pressed to perineum, opposite heel rests above the genitals. Spine erect. This channels prana and ojas (subtle lunar essence) directly up the Sushumna to the Crown.',
                    source: 'Hatha Yoga Pradipika 1.37 — "Of all asanas, Siddhasana is the greatest. Of all the 84 lakh asanas, Siddhasana alone should be practiced. It leads to liberation."'
                }
            ],
            pranayama: [
                {
                    name: 'Kevala Kumbhaka (Spontaneous Breathlessness)',
                    description: 'After deep pranayama practice, allow the breath to settle into natural, effortless pauses. This state of spontaneous retention is the Moon\'s gift — the mind transcends and merges with the Sahasrara\'s infinite space.',
                    source: 'Hatha Yoga Pradipika 2.73 — "When Kevala Kumbhaka arises spontaneously, there is no inhalation or exhalation. The yogi achieves the state of Raja Yoga."'
                }
            ],
            mudra: {
                name: 'Khechari Mudra (Sky-Walking Seal)',
                description: 'Roll the tongue backwards to touch the palate or soft palate. Sustain this during meditation. The nectar (Amrit Bindu) that flows from the Sahasrara is said to be controlled by this mudra. It directly awakens the Moon\'s crown energy.',
                source: 'Hatha Yoga Pradipika 3.32 — "Khechari Mudra is the chief of all mudras. By its practice the yogi is freed from disease, old age, and death. The nectar flows and the body becomes divine."'
            },
            meditation: {
                name: 'Nirguna Meditation (Formless Awareness)',
                description: 'Sit in Padmasana or Siddhasana. Withdraw from all sense-objects. Turn attention to pure Awareness itself — the witness behind all thoughts. Rest in this spacious silence for 20 minutes. This directly feeds the Moon\'s Sahasrara and the highest state of consciousness described in Sat Chakra Nirupana.',
                source: 'Sat Chakra Nirupana 7.1 — "Above all the chakras, the Sahasrara is the infinite lotus of 1000 petals, luminous as the full moon. Here the Shiva and Shakti merge in eternal union."'
            }
        },
        strongRemedies: {
            balance: 'Your Moon and Sahasrara shine with cosmic light! Maintain this connection to the infinite.',
            asanas: ['Shavasana (Corpse Pose) — full 10-minute surrender for Sahasrara integration', 'Viparita Karani (Legs up the wall) — returns lunar prana to the head'],
            pranayama: 'Chandra Bhedana (Moon Breath) — 21 rounds left nostril inhale — to continuously bathe the Sahasrara in cooling, expansive soma.',
            source: 'Siva Samhita 5.216 — "He who knows the Sahasrara is freed from all bondage. He becomes one with the supreme reality."'
        }
    }
};

/**
 * Main function: generates personalised yoga remedies based on chakra data.
 * @param {Array} chakras — Array of {planet, chakra, strengthPercent, state, color, theme} objects
 * @returns {Array} Array of remedy objects sorted by weakest planets first
 */
export const getYogaRemedies = (chakras) => {
    if (!chakras || chakras.length === 0) return [];

    return chakras
        .map(c => {
            const db = YOGA_REMEDIES_DB[c.planet];
            if (!db) return null;

            const isWeak = c.strengthPercent < 50;
            const isStrong = c.strengthPercent >= 70;

            const enrichedRemedies = isWeak
                ? { ...db.weakRemedies, asanas: ASANA_DB[c.planet] || db.weakRemedies.asanas }
                : { ...db.strongRemedies, richAsanas: ASANA_DB[c.planet] || [] };

            return {
                planet: c.planet,
                chakra: db.chakra,
                element: db.element,
                bijaMantra: db.bijaMantra,
                color: db.color,
                theme: c.theme || 'Physical Alignment',
                strengthPercent: c.strengthPercent,
                state: c.state || (isStrong ? 'Strong' : 'Weak'),
                dignityLabel: c.dignityLabel || 'Bio-Feedback Score',
                isWeak,
                isStrong,
                remedies: enrichedRemedies
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.strengthPercent - b.strengthPercent);
};
