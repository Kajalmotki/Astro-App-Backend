import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Map, Activity, Heart, Star, Compass, Lock, ChevronRight, ChevronDown, Globe, Sun, Moon, MessageCircle, Crown, Zap, Target } from 'lucide-react';
import BirthDetailsForm from '../components/BirthDetailsForm';
import AstroChart from '../components/AstroChart';
import { getLocalVedicChart } from '../services/vedicAstroApi';
import ChakraYogaPage from '../components/pages/ChakraYogaPage';
import MembershipModal from '../components/MembershipModal';
import BCAAnalysis from '../components/BCAAnalysis';
import { useAuth } from '../components/AuthModal';
import { checkMembershipStatus } from '../services/razorpayService';
import MobilePremiumDashboard from '../components/mobile/MobilePremiumDashboard';
import { useLanguage } from '../contexts/LanguageContext';
import './MobileReports.css';

// Vedic Day-Planet Ruling System
const DAILY_PLANET_DATA = [
    {
        day: 'Sunday', planet: 'Sun', sanskrit: 'Surya', emoji: '☀️',
        color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(255, 215, 0, 0.05))',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        focusTitle: 'Radiate Your Inner Light',
        guidance: 'Today is ruled by the Sun — the source of vitality and self-confidence. Step into your power. Spend time in sunlight, practice gratitude, and take bold decisions. Your aura is at its strongest today.',
        mantra: 'Om Suryaya Namaha',
        avoid: 'Avoid self-doubt, staying indoors all day, or suppressing your true opinions.',
        tip: 'Wear warm tones (orange, gold) to amplify solar energy.',
        deity: {
            name: 'Surya Dev', deityEmoji: '🙏🏻', tagline: 'The King of Planets — Source of All Life',
            principles: [
                { num: 1, title: 'Know Your Worth', desc: 'The Sun never dims itself for others. Recognize your true value today — stop underpricing yourself and your skills.' },
                { num: 2, title: 'Rise Early, Rise Strong', desc: 'Surya Dev rises without fail every single day. Build unshakeable discipline — wake early, show up, do the work.' },
                { num: 3, title: 'Be the Light', desc: 'The Sun illuminates without asking permission. Lead by example today — inspire others through your actions, not words.' },
                { num: 4, title: 'Honor Your Father', desc: 'Surya represents the father figure. Respect, connect with, and seek blessings from your father or father figure today.' },
                { num: 5, title: 'Radiate Confidence', desc: 'Stand tall like the midday Sun. Speak clearly, hold eye contact, and own your presence in every interaction.' },
                { num: 6, title: 'Give Generously', desc: 'The Sun gives light, warmth, and life freely to all. Practice generosity today without expecting anything in return.' },
                { num: 7, title: 'Self-Governance', desc: 'A king rules himself before ruling others. Master your habits, emotions, and impulses today. Self-control is true power.' },
                { num: 8, title: 'Burn Away Laziness', desc: 'Surya\'s fire destroys inertia. Attack procrastination head-on today — finish that pending task you\'ve been avoiding.' },
                { num: 9, title: 'Seek Truth Always', desc: 'The Sun reveals everything in its light. Be honest, transparent, and authentic today — truth is your greatest weapon.' }
            ]
        },
        havan: [
            { icon: '🔥', title: 'Surya Havan', desc: 'Perform a small fire offering with ghee and red sandalwood (lal chandan) at sunrise. Chant "Om Suryaya Swaha" 12 times. This strengthens leadership, health, and removes Pitru dosha.', time: 'Sunrise (6-7 AM)', items: 'Ghee, red sandalwood, camphor, havan kund' },
            { icon: '🪔', title: 'Aditya Hridayam Paath', desc: 'Recite the Aditya Hridayam Stotram facing east. This powerful Sun hymn was taught by sage Agastya to Lord Rama — it removes all obstacles and grants victory.', time: 'Morning (7-8 AM)', items: 'Aditya Hridayam text, red cloth, water' },
            { icon: '🙏', title: 'Surya Arghya', desc: 'Stand facing the rising sun and pour water from a copper vessel while chanting Om Suryaya Namaha 7 times. This simple daily ritual pleases the Sun and boosts vitality.', time: 'Sunrise', items: 'Copper vessel, water, red flowers' },
            { icon: '🌺', title: 'Red Flower Puja', desc: 'Offer red hibiscus or marigold flowers to a Surya Yantra or Sun image with kumkum. This small puja enhances confidence, cures eye problems, and brings government favor.', time: 'Morning', items: 'Red flowers, kumkum, jaggery' }
        ],
        wellness: [
            { icon: '🌅', title: 'Sun Gazing', desc: 'Watch the sunrise for 5-10 minutes. Early morning sun exposure boosts Vitamin D, regulates circadian rhythm, and energizes the Ajna chakra.' },
            { icon: '💛', title: 'Heart-Warming Foods', desc: 'Eat saffron milk, turmeric rice, or golden milk today. These warm, golden-hued foods strengthen the heart and boost immunity as per Ayurveda.' },
            { icon: '🧘', title: 'Surya Namaskar', desc: 'Perform 12 rounds of Sun Salutations. This energizes every organ, improves blood circulation, and aligns your body with solar energy.' },
            { icon: '🪞', title: 'Confidence Ritual', desc: 'Stand tall, look into a mirror, and affirm your strengths. The Sun governs self-esteem — today is the best day to rebuild it.' },
            { icon: '🍯', title: 'Golden Milk Before Bed', desc: 'Warm milk with turmeric, black pepper & a spoon of ghee. This calms the nervous system, supports digestion, and nourishes bones.' },
            { icon: '🌻', title: 'Vitamin D Walk', desc: 'Take a 20-minute walk between 7-9 AM barefoot on grass. Earthing combined with sunlight charges your solar plexus chakra and strengthens bones.' },
            { icon: '🍊', title: 'Citrus & Warm Spices', desc: 'Eat oranges, papaya, and add cinnamon or cardamom to meals. These solar foods stimulate metabolism, clear toxins, and boost digestive fire (Agni).' },
            { icon: '🔆', title: 'Eye Care Ritual', desc: 'The Sun governs eyesight. Splash cold water on closed eyes 10 times, then palm your eyes for 2 minutes. This reduces strain and improves vision.' },
            { icon: '👑', title: 'Leadership Practice', desc: 'Take initiative in one area today — lead a meeting, make a decision, or start a project. The Sun rewards those who step up and take charge.' }
        ]
    },
    {
        day: 'Monday', planet: 'Moon', sanskrit: 'Chandra', emoji: '🌙',
        color: '#e2e8f0', gradient: 'linear-gradient(135deg, rgba(226, 232, 240, 0.1), rgba(148, 163, 184, 0.05))',
        borderColor: 'rgba(226, 232, 240, 0.3)',
        focusTitle: 'Nurture Your Emotional Self',
        guidance: 'The Moon governs emotions, intuition, and the mind. Today is ideal for rest, self-care, and connecting with loved ones. Listen to your inner voice — your intuition is heightened.',
        mantra: 'Om Chandraya Namaha',
        avoid: 'Avoid overworking, emotional suppression, or making impulsive decisions.',
        tip: 'Drink more water and milk. Wear white or silver.',
        deity: {
            name: 'Lord Shiva', deityEmoji: '🙏🏻', tagline: 'The Adi Yogi — Destroyer of Illusion',
            principles: [
                { num: 1, title: 'Practice Detachment', desc: 'Shiva lives in a cremation ground wearing ashes — unaffected by material. Detach from outcomes today and find peace in the process.' },
                { num: 2, title: 'Embrace Simplicity', desc: 'The Lord of the Universe wears animal skin and rudraksha. True richness is simplicity. Cut excess from your life today.' },
                { num: 3, title: 'Destroy Negativity', desc: 'Shiva is the destroyer of evil. Identify one toxic pattern, relationship, or habit today and begin eliminating it fearlessly.' },
                { num: 4, title: 'Stillness is Power', desc: 'Shiva meditates for eons. Sit in complete silence for at least 10 minutes today. In stillness, you find your deepest answers.' },
                { num: 5, title: 'Protect the Vulnerable', desc: 'Shiva drank poison to save the world. Stand up for someone weaker today — be a shield for those who cannot protect themselves.' },
                { num: 6, title: 'Channel Your Anger', desc: 'Shiva\'s Tandava is controlled fury. Don\'t suppress anger — channel it into creative destruction of obstacles in your path.' },
                { num: 7, title: 'Equal Vision', desc: 'Shiva sees no difference between a king and a beggar. Treat everyone with equal respect today regardless of status.' },
                { num: 8, title: 'Honor the Feminine', desc: 'Shiva is Ardhanarishvara — half Shakti. Respect women, honor your emotions, and balance your masculine-feminine energies.' },
                { num: 9, title: 'Be Unmoved by Praise or Blame', desc: 'Like Shiva in meditation, remain centered today. Don\'t inflate with compliments or deflate with criticism.' }
            ]
        },
        havan: [
            { icon: '🔥', title: 'Chandra Havan', desc: 'Light a small havan with ghee, white sandalwood, and rice grains. Chant "Om Chandraya Swaha" 11 times. This calms the mind, heals depression, and balances hormones.', time: 'Evening (6-7 PM)', items: 'Ghee, white sandalwood, rice, camphor' },
            { icon: '🪔', title: 'Shiva Abhishek', desc: 'Pour milk and water on a Shivling while chanting Om Namah Shivaya 108 times. The Moon is Lord Shiva\'s ornament — this puja brings mental peace and emotional stability.', time: 'Morning or Evening', items: 'Milk, water, bilva leaves, white flowers' },
            { icon: '🕯️', title: 'Ghee Lamp Meditation', desc: 'Light a pure ghee diya and sit quietly watching the flame for 10 minutes. This Trataka meditation strengthens the Moon, calms the mind, and enhances intuition.', time: 'After sunset', items: 'Ghee diya, cotton wick, quiet space' },
            { icon: '💎', title: 'Moon Stone Charging', desc: 'If you have a Moonstone or pearl, wash it with raw milk and keep it under moonlight overnight. Wear it on Monday for emotional balance and enhanced creativity.', time: 'Night', items: 'Moonstone/pearl, raw milk, white cloth' }
        ],
        wellness: [
            { icon: '💧', title: 'Water Therapy', desc: 'Drink 2 glasses of warm water upon waking. The Moon rules fluids — proper hydration today prevents bloating, headaches, and emotional fog.' },
            { icon: '🥛', title: 'Cooling & Calming Foods', desc: 'Eat rice, coconut water, cucumber, curd, and kheer. These lunar foods cool the body, soothe the mind, and balance Pitta dosha.' },
            { icon: '🛁', title: 'Warm Relaxing Bath', desc: 'Take a long warm bath with rock salt or rose petals. This ritual calms the nervous system and releases emotional blockages stored in the body.' },
            { icon: '🌊', title: 'Emotional Journaling', desc: 'Write down your feelings without judgment. The Moon amplifies emotions — channeling them onto paper prevents anxiety and brings clarity.' },
            { icon: '😴', title: 'Early Sleep Routine', desc: 'Go to bed by 10 PM. The Moon heals through rest. Lack of sleep on Mondays can lead to mood swings and irritability all week.' },
            { icon: '🫶', title: 'Connect With Mother', desc: 'Call or spend time with your mother today. The Moon represents maternal energy — this connection heals deep emotional wounds and brings inner peace.' },
            { icon: '🧊', title: 'Cold Water Face Splash', desc: 'Splash cold water on your face 7 times in the morning. This lunar ritual activates parasympathetic nerves, clears puffiness, and sharpens intuition.' },
            { icon: '🎵', title: 'Calming Music Therapy', desc: 'Listen to Raag Yaman or soft flute music for 15 minutes. The Moon responds to melodious sounds — this reduces cortisol and soothes the nervous system.' },
            { icon: '🌕', title: 'Moonlight Meditation', desc: 'Sit under the moonlight for 10 minutes with closed eyes. Absorbing lunar energy balances hormones, stabilizes emotions, and deepens spiritual awareness.' }
        ]
    },
    {
        day: 'Tuesday', planet: 'Mars', sanskrit: 'Mangal', emoji: '🔴',
        color: '#ef4444', gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(185, 28, 28, 0.05))',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        focusTitle: 'Channel Your Warrior Energy',
        guidance: 'Mars fuels courage, physical strength, and determination. Push through challenges today — hit the gym, tackle difficult tasks, or stand your ground in important matters. Your energy reserves are high.',
        mantra: 'Om Mangalaya Namaha',
        avoid: 'Avoid aggression, unnecessary confrontation, and reckless decisions.',
        tip: 'Wear red. Engage in physical exercise or sports.',
        deity: {
            name: 'Hanuman Ji', deityEmoji: '🙏🏻', tagline: 'The Supreme Devotee — Embodiment of Courage',
            principles: [
                { num: 1, title: 'Unwavering Devotion', desc: 'Hanuman\'s only focus is Ram. Pick your mission and commit fully today — no half-measures, no distractions, total dedication.' },
                { num: 2, title: 'Fearlessness', desc: 'Hanuman leapt across the ocean without hesitation. Face your biggest fear today — take that bold step you\'ve been avoiding.' },
                { num: 3, title: 'Selfless Service', desc: 'Hanuman never asks for reward. Serve someone today without any expectation — carry their burden, solve their problem, just help.' },
                { num: 4, title: 'Control Your Ego', desc: 'Despite immense power, Hanuman remains humble. No matter how much you achieve, stay grounded. Arrogance invites downfall.' },
                { num: 5, title: 'Physical Strength', desc: 'Hanuman is the strongest being. Honor your body today — train hard, eat clean, push your physical limits. Your body is your temple.' },
                { num: 6, title: 'Celibacy of Mind', desc: 'Brahmacharya isn\'t just physical — it\'s mental focus. Avoid scattered attention today. Channel ALL your energy into one powerful goal.' },
                { num: 7, title: 'Burn Lanka', desc: 'When the enemy tried to humiliate Hanuman, he burned their entire kingdom. Don\'t tolerate injustice — stand your ground and fight evil.' },
                { num: 8, title: 'Carry the Mountain', desc: 'When one herb was needed, Hanuman brought the whole mountain. Over-deliver today. Give more than expected in everything you do.' },
                { num: 9, title: 'Remember Your Power', desc: 'Hanuman forgot his own strength until reminded. You are more powerful than you think. It\'s time to unleash your true potential.' }
            ]
        },
        havan: [
            { icon: '🔥', title: 'Agnihotra Havan', desc: 'Perform the ancient Agnihotra fire ritual exactly at sunrise and sunset. Offer rice and ghee into a copper pyramid-shaped havan kund chanting the Agnihotra mantras. This purifies the atmosphere, heals diseases, and neutralizes negative Mars energy.', time: 'Exact sunrise & sunset', items: 'Copper pyramid kund, dried cow dung, ghee, rice' },
            { icon: '🪔', title: 'Hanuman Puja', desc: 'Visit a Hanuman temple or worship at home. Offer sindoor, red flowers, and jaggery. Recite Hanuman Chalisa once. Lord Hanuman controls Mars — this puja removes Mangal Dosha and grants courage.', time: 'Morning or Evening', items: 'Sindoor, red flowers, jaggery, Hanuman Chalisa' },
            { icon: '⚔️', title: 'Mangal Graha Shanti', desc: 'Light a ghee lamp with a red cotton wick. Offer red lentils (masoor dal) and red sandalwood paste to a Mars yantra or image. Chant "Om Mangalaya Namaha" 21 times.', time: 'Morning (8-9 AM)', items: 'Red wick diya, masoor dal, red sandalwood, ghee' },
            { icon: '🌶️', title: 'Bhoomi Puja', desc: 'Sprinkle turmeric water on the earth and plant a red flower or neem sapling. Mars is the son of Earth (Bhoomi) — this puja grounds aggressive energy and brings property-related blessings.', time: 'Morning', items: 'Turmeric water, red flower plant, soil' }
        ],
        wellness: [
            { icon: '🏋️', title: 'Intense Workout', desc: 'Mars day is ideal for high-intensity training — weight lifting, sprints, or martial arts. Your muscle recovery and stamina are at peak today.' },
            { icon: '🥩', title: 'Protein-Rich Diet', desc: 'Load up on lentils (masoor dal), chickpeas, eggs, paneer, or lean meat. Mars governs muscles and blood — protein fuels your warrior body.' },
            { icon: '🩸', title: 'Iron & Blood Health', desc: 'Eat beetroot, pomegranate, spinach, and jaggery. Mars rules blood — these foods boost hemoglobin and prevent anemia and fatigue.' },
            { icon: '🔥', title: 'Warrior Breathwork', desc: 'Practice Bhastrika (bellows breath) for 5 minutes. This Martian pranayama ignites your digestive fire, clears lethargy, and sharpens focus.' },
            { icon: '🚫', title: 'Anger Management', desc: 'Channel aggression into productive action — clean, organize, or do intense physical work. Never suppress Mars energy; redirect it constructively.' },
            { icon: '🏃', title: 'Outdoor Sprint Session', desc: 'Run 5-6 short sprints (50-100 meters) outdoors. Mars thrives on explosive energy — sprinting builds fast-twitch muscles and burns stubborn fat.' },
            { icon: '🌶️', title: 'Spicy & Warming Foods', desc: 'Add ginger, garlic, black pepper, and red chili to meals. Mars loves heat — spicy foods boost metabolism, clear sinuses, and improve circulation.' },
            { icon: '⚔️', title: 'Face a Fear Today', desc: 'Mars blesses courage. Pick one thing you\'ve been avoiding — a tough conversation, a challenge, a decision — and face it head-on today.' },
            { icon: '🧲', title: 'Red Coral Therapy', desc: 'If you own red coral (Moonga), wear or hold it while meditating for 5 minutes. This amplifies Mars energy, boosts confidence, and protects vitality.' }
        ]
    },
    {
        day: 'Wednesday', planet: 'Mercury', sanskrit: 'Budha', emoji: '💚',
        color: '#22c55e', gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(21, 128, 61, 0.05))',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        focusTitle: 'Rest the Heart, Sharpen the Mind',
        guidance: 'Mercury rules intellect, communication, and the nervous system. Today, give your heart good rest — avoid emotional stress and focus on mental clarity. Write, read, learn, or have meaningful conversations.',
        mantra: 'Om Budhaya Namaha',
        avoid: 'Avoid overthinking, gossip, and signing important documents hastily.',
        tip: 'Wear green. Practice deep breathing to calm the nervous system.',
        deity: {
            name: 'Lord Ganesha', deityEmoji: '🙏🏻', tagline: 'Vighnaharta — Remover of All Obstacles',
            principles: [
                { num: 1, title: 'Remove Obstacles First', desc: 'Before starting anything new, identify and remove blockers. Ganesha clears the path — what\'s blocking YOUR progress today?' },
                { num: 2, title: 'Wisdom Before Action', desc: 'Ganesha\'s big head symbolizes thinking before doing. Don\'t rush into decisions today — pause, analyze, then act with clarity.' },
                { num: 3, title: 'Listen More, Speak Less', desc: 'Ganesha has large ears and a small mouth. Listen twice as much as you speak today. The best insights come from deep listening.' },
                { num: 4, title: 'Digest Everything', desc: 'Ganesha\'s big belly digests all experiences — good and bad. Accept today\'s outcomes gracefully. Every experience teaches something.' },
                { num: 5, title: 'Adaptability', desc: 'Ganesha rides a tiny mouse despite being large — he adapts. Be flexible today. Adjust your approach when the situation demands it.' },
                { num: 6, title: 'Respect Your Parents', desc: 'Ganesha circled his parents saying "You are my world." Honor your parents today — they are your first gods and greatest blessing.' },
                { num: 7, title: 'New Beginnings', desc: 'Every new venture begins with Ganesha. Today is perfect for starting something new — a project, habit, or relationship.' },
                { num: 8, title: 'Write Your Story', desc: 'Ganesha wrote the Mahabharata. Document your ideas, plans, and learnings today. Writing crystallizes thought into reality.' },
                { num: 9, title: 'Sweet Moderation', desc: 'Ganesha loves modak but doesn\'t overindulge. Enjoy life\'s pleasures in moderation today. Balance is the key to lasting happiness.' }
            ]
        },
        havan: [
            { icon: '🔥', title: 'Budha Graha Havan', desc: 'Offer whole green moong dal and ghee into fire while chanting "Om Budhaya Swaha" 9 times. Mercury\'s havan sharpens intellect, heals speech problems, and improves business acumen.', time: 'Morning (8-10 AM)', items: 'Green moong dal, ghee, camphor, havan kund' },
            { icon: '🪔', title: 'Vishnu Puja (Small)', desc: 'Offer tulsi leaves and green flowers to Lord Vishnu. Mercury is Vishnu\'s planet — chanting Vishnu Sahasranama or even 5 names brings mental clarity and removes confusion.', time: 'Morning', items: 'Tulsi leaves, green flowers, green cloth' },
            { icon: '💿', title: 'Emerald Stone Puja', desc: 'If you have an emerald (Panna) or green tourmaline, wash it with Ganga jal and place it on a green cloth. Chant Om Budhaya Namaha 9 times. This activates Mercury\'s intellectual blessings.', time: 'Morning', items: 'Green stone, Ganga jal, green cloth' },
            { icon: '🕉️', title: 'Saraswati Vandana', desc: 'Recite "Ya Kundendu Tushar Haar Dhavala" (Saraswati Vandana) 3 times. Offer white flowers to books or workspace. This Mercury-aligned puja enhances learning, memory, and exam success.', time: 'Before study/work', items: 'White flowers, books, incense' }
        ],
        wellness: [
            { icon: '💚', title: 'Heart Rest Day', desc: 'Take it easy on your heart today. Avoid heavy cardio and emotional confrontations. Practice slow walking, gentle stretching, and deep diaphragmatic breathing.' },
            { icon: '🥬', title: 'Leafy Greens & Brain Food', desc: 'Eat spinach, broccoli, moong dal, walnuts, and almonds. Mercury governs the nervous system — these foods nourish neurons and improve memory.' },
            { icon: '🫁', title: 'Nadi Shodhana Pranayama', desc: 'Alternate nostril breathing for 10 minutes. This balances the left and right brain hemispheres, calms anxiety, and strengthens the heart.' },
            { icon: '📵', title: 'Digital Detox Hour', desc: 'Switch off your phone for 1 hour. Mercury rules communication overload — silence the noise to restore mental clarity and reduce nervous tension.' },
            { icon: '📝', title: 'Creative Writing', desc: 'Journal, write poetry, or pen a letter. Mercury is the planet of expression — writing today unlocks creativity and processes hidden emotions.' },
            { icon: '🌿', title: 'Herbal Nerve Tonic', desc: 'Drink Brahmi or Ashwagandha tea. These Ayurvedic herbs strengthen the nervous system, reduce cortisol, and promote restful heart function.' },
            { icon: '🧩', title: 'Brain Training', desc: 'Solve puzzles, play chess, or learn a new word. Mercury sharpens intellect — mental exercises today increase cognitive speed and analytical thinking.' },
            { icon: '🤝', title: 'Meaningful Conversation', desc: 'Have a deep, honest conversation with someone you trust. Mercury governs communication — genuine dialogue today heals misunderstandings and builds bonds.' },
            { icon: '💐', title: 'Green Surroundings', desc: 'Spend 15 minutes near plants or in a garden. Green is Mercury\'s color — nature exposure today reduces anxiety, lowers blood pressure, and refreshes the mind.' }
        ]
    },
    {
        day: 'Thursday', planet: 'Jupiter', sanskrit: 'Guru', emoji: '🟡',
        color: '#eab308', gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(161, 98, 7, 0.05))',
        borderColor: 'rgba(234, 179, 8, 0.3)',
        focusTitle: 'Expand Your Wisdom',
        guidance: 'Jupiter — the great teacher — blesses this day with wisdom and abundance. Seek knowledge, mentor others, and practice generosity. Spiritual practices are especially powerful today.',
        mantra: 'Om Gurave Namaha',
        avoid: 'Avoid arrogance, excessive spending, or ignoring the advice of elders.',
        tip: 'Wear yellow. Visit a temple or engage in charitable acts.',
        deity: {
            name: 'Lord Vishnu', deityEmoji: '🙏🏻', tagline: 'The Preserver — Sustainer of the Universe',
            principles: [
                { num: 1, title: 'Uphold Dharma', desc: 'Vishnu incarnates whenever dharma declines. Stand for what is right today even if you stand alone. Your integrity defines your destiny.' },
                { num: 2, title: 'Protector Presence', desc: 'Be the protector in your family and community. Have a calm, reassuring presence that makes others feel safe and supported around you.' },
                { num: 3, title: 'Calm Amidst Chaos', desc: 'Vishnu rests on the cosmic ocean, unaffected by storms. Stay calm and relaxed today regardless of chaos around you. Inner peace is your power.' },
                { num: 4, title: 'Build Good Systems', desc: 'Vishnu preserves through order. Create reliable systems in your work and life — routines, processes, and structures that sustain long-term success.' },
                { num: 5, title: 'High Quality Only', desc: 'Vishnu\'s abode Vaikuntha is of supreme quality. Accept nothing mediocre today — in food, work, relationships, and self-care. Demand excellence.' },
                { num: 6, title: 'Excellence in Everything', desc: 'Do everything in the best way possible today. Whether cooking, working, or speaking — put your finest effort into every single action.' },
                { num: 7, title: 'Maintain Integrity', desc: 'Don\'t expect favors or shortcuts. Earn everything through honest effort. Vishnu respects those who walk the straight path with their head held high.' },
                { num: 8, title: 'Earn Your Own Name', desc: 'Don\'t ride on someone else\'s reputation. Build your own legacy through your actions, skills, and character. Your name should speak for itself.' },
                { num: 9, title: 'Do Karma Without Expectations', desc: 'Do your duty without expecting appreciation or being affected by others\' reactions. Like Vishnu, act selflessly and let the results take care of themselves.' }
            ]
        },
        havan: [
            { icon: '🔥', title: 'Guru Graha Havan', desc: 'Offer chana dal, turmeric, and ghee into sacred fire chanting "Om Brihaspataye Swaha" 7 times. Jupiter\'s havan bestows wisdom, wealth, removes debt, and blesses with progeny.', time: 'Morning (7-9 AM)', items: 'Chana dal, turmeric, ghee, camphor' },
            { icon: '🪔', title: 'Vishnu Puja (Full)', desc: 'Offer yellow flowers, banana, and turmeric to Lord Vishnu. Light a ghee diya and recite Vishnu Stotram. Jupiter is the Guru of Devas — Vishnu puja on Thursday brings prosperity and removes financial obstacles.', time: 'Morning', items: 'Yellow flowers, banana, turmeric, ghee diya' },
            { icon: '💿', title: 'Brihaspati Stotra', desc: 'Recite the Brihaspati Stotra or chant "Om Gram Greem Graum Sah Gurave Namaha" 108 times with a turmeric mala. This strengthens Jupiter and attracts teachers, mentors, and blessings.', time: 'Morning', items: 'Turmeric mala, yellow cloth, incense' },
            { icon: '🍌', title: 'Banana & Jaggery Offering', desc: 'Offer 7 bananas and jaggery to a Peepal tree or Brahmins. This traditional Thursday ritual strengthens Jupiter, removes Guru Chandal dosha, and brings marital harmony.', time: 'Before noon', items: '7 bananas, jaggery, yellow cloth' }
        ],
        wellness: [
            { icon: '🧹', title: 'Gut Cleansing Detox', desc: 'Start the day with warm lemon-honey water. Jupiter rules the liver and gut — today is the ideal day for a gentle digestive reset and toxin flush.' },
            { icon: '🥣', title: 'Sattvic Light Meals', desc: 'Eat khichdi, fresh fruits, and steamed vegetables. Avoid heavy, oily, or processed foods. A light sattvic diet lets Jupiter\'s energy purify your system.' },
            { icon: '🫚', title: 'Liver Flush Drink', desc: 'Blend turmeric, ginger, lemon & warm water. Drink on an empty stomach. This traditional Ayurvedic formula cleanses the liver and boosts bile production.' },
            { icon: '🦠', title: 'Probiotic Power', desc: 'Eat homemade curd, buttermilk, or fermented foods like kanji/kimchi. Jupiter governs gut bacteria — probiotics today strengthen immunity and digestion.' },
            { icon: '⏰', title: 'Intermittent Fasting', desc: 'Try a 14-16 hour fasting window (dinner to lunch). Jupiter blesses discipline — fasting today enhances mental clarity, autophagy, and spiritual receptivity.' },
            { icon: '🙏', title: 'Gratitude Practice', desc: 'List 10 things you\'re grateful for. Jupiter is the planet of abundance — expressing gratitude today multiplies blessings and activates positive karma.' },
            { icon: '🍌', title: 'Banana & Chana Offering', desc: 'Eat a banana and soaked chana (chickpeas) in the morning. These are traditional Jupiter foods that strengthen the digestive system and please Guru energy.' },
            { icon: '📚', title: 'Learn Something New', desc: 'Read a book, watch a lecture, or study a subject. Jupiter is the planet of knowledge — learning today expands your consciousness and attracts wisdom.' },
            { icon: '🧘‍♂️', title: 'Guru Meditation', desc: 'Sit quietly and visualize golden light filling your stomach area (Manipura chakra). This Jupiter meditation heals digestive issues and attracts abundance.' }
        ]
    },
    {
        day: 'Friday', planet: 'Venus', sanskrit: 'Shukra', emoji: '💖',
        color: '#ec4899', gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(190, 24, 93, 0.05))',
        borderColor: 'rgba(236, 72, 153, 0.3)',
        focusTitle: 'Embrace Beauty & Harmony',
        guidance: 'Venus brings love, creativity, and aesthetic pleasure. Today is perfect for romance, art, music, and indulging in life\'s finer things. Strengthen your relationships and express affection.',
        mantra: 'Om Shukraya Namaha',
        avoid: 'Avoid laziness, excessive indulgence, or neglecting responsibilities for pleasure.',
        tip: 'Wear pastel or pink colors. Enjoy music, art, or a nice meal.',
        deity: {
            name: 'Lakshmi Maa', deityEmoji: '🙏🏻', tagline: 'The Goddess of Wealth, Beauty & Prosperity',
            principles: [
                { num: 1, title: 'Watch Your Words', desc: 'Speak abundance into existence. Say "I have enough" instead of complaining about lack. Lakshmi flows toward gratitude and positive speech.' },
                { num: 2, title: 'Cleanliness', desc: 'Clear clutter from your home, workspace, and mind. Lakshmi never enters a dirty space. Clean surroundings attract wealth and positive energy.' },
                { num: 3, title: 'Beautification', desc: 'Beautify your house, your body, and your thoughts. Lakshmi is the goddess of beauty — make everything around you aesthetically pleasing today.' },
                { num: 4, title: 'Enjoy What You Have', desc: 'Chal chal charitra — celebrate and enjoy what you already possess today. Gratitude for present blessings opens doors for future abundance.' },
                { num: 5, title: 'Self-Love', desc: 'Love yourself deeply and completely. Take care of your body, honor your boundaries, and treat yourself with the respect you deserve.' },
                { num: 6, title: 'Compassion', desc: 'Feel the pain of others. Lakshmi dwells in compassionate hearts. Show genuine empathy and kindness — help those who are struggling silently.' },
                { num: 7, title: 'Invest in Quality', desc: 'Put your heart and soul in what you do. Don\'t buy cheap stuff — invest in good quality and valuable things. Lakshmi respects those who value quality.' },
                { num: 8, title: 'Multiplicity', desc: 'Put effort into activities where multiplication happens — investments, skills, relationships that compound. Lakshmi blesses those who think in abundance.' },
                { num: 9, title: 'Karma & Money Flow', desc: 'Introspect and see where you are stopping money — hoarding, fear, or guilt around wealth. Remove these blocks to let Lakshmi\'s energy flow freely.' }
            ]
        },
        havan: [
            { icon: '🔥', title: 'Shukra Graha Havan', desc: 'Offer white rice, sugar, and ghee into fire chanting "Om Shukraya Swaha" 9 times. Venus havan attracts love, heals relationship issues, enhances beauty, and brings material comforts.', time: 'Morning (8-10 AM)', items: 'White rice, sugar, ghee, white flowers' },
            { icon: '🪔', title: 'Lakshmi Puja', desc: 'Light a ghee diya and offer white or pink lotus, rice, and sweets to Goddess Lakshmi. Recite "Om Shreem Mahalakshmiyei Namaha" 108 times. This Friday puja brings wealth, beauty, and marital bliss.', time: 'Evening (6-7 PM)', items: 'Ghee diya, lotus/pink flowers, rice, sweets' },
            { icon: '🌹', title: 'Rose Water Aarti', desc: 'Perform aarti with a rose-scented diya. Sprinkle rose water in your home. Venus adores roses — this ritual attracts love, harmony, and removes Vastu dosha from your living space.', time: 'Evening', items: 'Rose water, rose petals, camphor, diya' },
            { icon: '🕉️', title: 'Santoshi Mata Vrat', desc: 'If seeking family harmony, observe a simple Santoshi Mata vrat. Eat only one meal without sour foods. This Friday vrat is legendary for fulfilling wishes and resolving family disputes.', time: 'All day', items: 'Jaggery, roasted chana, yellow flowers' }
        ],
        wellness: [
            { icon: '🧹', title: 'Deep Home Cleaning', desc: 'Clean and declutter your living space today. Venus governs aesthetics — a clean environment attracts positive energy, love, and prosperity into your life.' },
            { icon: '🌸', title: 'Floral Bath Ritual', desc: 'Add rose petals, jasmine, or mogra flowers to your bath water. This Venus ritual purifies the aura, uplifts mood, and enhances natural beauty.' },
            { icon: '🧴', title: 'Skincare & Self-Care', desc: 'Apply a natural face pack (multani mitti, rose water, honey). Venus rules skin and beauty — Friday is the best day for skin rejuvenation treatments.' },
            { icon: '🪔', title: 'Aromatherapy Session', desc: 'Light rose, sandalwood, or lavender incense. Venus responds to fragrance — pleasant scents in your space attract harmony and calm the senses.' },
            { icon: '👗', title: 'Wardrobe Refresh', desc: 'Organize your closet, iron clothes, and plan outfits. Venus favors elegance — taking care of your appearance today magnetizes opportunities and love.' },
            { icon: '🍰', title: 'Sweet Offering', desc: 'Make or eat something sweet — kheer, halwa, or fresh fruit. Offering sweets to others today pleases Venus and sweetens your relationships.' },
            { icon: '💅', title: 'Nail & Hair Care', desc: 'Trim nails, oil your hair with coconut oil, or get a haircut. Venus rules beauty & grooming — pampering yourself today enhances your magnetic aura.' },
            { icon: '🎨', title: 'Creative Expression', desc: 'Paint, draw, sing, or play music. Venus is the planet of art — expressing creativity today opens the Svadhisthana (sacral) chakra and attracts joy.' },
            { icon: '💝', title: 'Express Love Openly', desc: 'Tell someone you love them, write a love note, or surprise a partner. Venus amplifies romantic energy — expressing love today deepens bonds exponentially.' }
        ]
    },
    {
        day: 'Saturday', planet: 'Saturn', sanskrit: 'Shani', emoji: '🪐',
        color: '#8b5cf6', gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(91, 33, 182, 0.05))',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        focusTitle: 'Embrace Discipline & Patience',
        guidance: 'Saturn teaches through discipline, hard work, and endurance. Today, focus on long-term goals, clear pending duties, and practice patience. Reflect on your karmic journey and correct past mistakes.',
        mantra: 'Om Shanaischaraya Namaha',
        avoid: 'Avoid shortcuts, dishonesty, and disrespecting workers or service people.',
        tip: 'Wear dark blue or black. Help the less fortunate.',
        deity: {
            name: 'Shani Dev', deityEmoji: '🙏🏻', tagline: 'The Lord of Justice — Teacher Through Karma',
            principles: [
                { num: 1, title: 'Face Your Karma', desc: 'Shani delivers the results of your actions. Accept responsibility for everything in your life today — no blaming others, no excuses.' },
                { num: 2, title: 'Patience is Everything', desc: 'Saturn\'s lessons come slowly but surely. Trust the timing of your life. What\'s meant for you will not pass you — be patient.' },
                { num: 3, title: 'Respect the Workers', desc: 'Shani represents laborers and the common man. Treat every worker, helper, and service person with deep respect and dignity today.' },
                { num: 4, title: 'Discipline Over Motivation', desc: 'Motivation fades, discipline endures. Build iron-clad habits today. Shani rewards those who show up consistently, not just when they feel like it.' },
                { num: 5, title: 'Accept Suffering Gracefully', desc: 'Shani teaches through hardship. Don\'t run from pain today — sit with it, learn from it, and let it forge you into a stronger version of yourself.' },
                { num: 6, title: 'No Shortcuts Ever', desc: 'The path of Saturn is the long way around. There are no shortcuts to lasting success. Do the hard work that others avoid.' },
                { num: 7, title: 'Serve Without Recognition', desc: 'Clean something, help someone, donate quietly. Shani watches silent service. The karma of anonymous good deeds is the most powerful.' },
                { num: 8, title: 'Simplify Your Life', desc: 'Saturn despises excess. Cut down on unnecessary spending, talking, and commitments today. Live lean, live focused, live purposefully.' },
                { num: 9, title: 'Justice For All', desc: 'Be fair and just in all dealings today. Don\'t cheat, don\'t manipulate, don\'t take advantage. Shani\'s court is the most unforgiving one.' }
            ]
        },
        havan: [
            { icon: '🔥', title: 'Shani Graha Havan', desc: 'Offer black sesame (til), mustard oil, and iron nails into fire chanting "Om Shanaischaraya Swaha" 7 times. This powerful havan removes Sade Sati effects, legal troubles, and chronic diseases.', time: 'Evening (5-6 PM)', items: 'Black sesame, mustard oil, iron nails, camphor' },
            { icon: '🪔', title: 'Shani Dev Puja', desc: 'Pour mustard oil on a Shani idol or iron nail. Offer black flowers and black urad dal. Light a sesame oil lamp. This Saturday puja protects from accidents, delays, and karmic debts.', time: 'Evening', items: 'Mustard oil, black flowers, urad dal, iron' },
            { icon: '💿', title: 'Shani Stotra Paath', desc: 'Recite Shani Stotra or Dasharatha Shani Stotra. King Dasharatha composed this when Saturn troubled his kingdom — it\'s considered the most potent Saturn remedy in all of Jyotish.', time: 'Evening', items: 'Shani Stotra text, blue/black cloth, diya' },
            { icon: '🛢️', title: 'Til Tel Daan', desc: 'Donate mustard oil, black sesame, black cloth, or iron items to the needy. Saturn is the planet of karma — charity on Saturday directly reduces suffering and karmic burden.', time: 'Before sunset', items: 'Mustard oil, black sesame, black cloth' }
        ],
        wellness: [
            { icon: '🦴', title: 'Bone & Joint Care', desc: 'Do gentle joint rotations and stretching. Saturn governs bones, teeth, and joints — neglecting them today increases stiffness and long-term pain.' },
            { icon: '🫒', title: 'Oil Massage (Abhyanga)', desc: 'Massage your body with warm sesame or mustard oil before bathing. This Saturn remedy lubricates joints, improves circulation, and removes toxins.' },
            { icon: '🍚', title: 'Light & Simple Meals', desc: 'Eat dal-chawal, khichdi, or simple home-cooked food. Avoid outside food. Saturn rewards simplicity — overeating today creates lethargy and guilt.' },
            { icon: '⚫', title: 'Black Sesame & Til', desc: 'Add black sesame seeds to your meals or eat til laddoo. Saturn is pleased by black foods — these strengthen bones, improve hair, and boost iron levels.' },
            { icon: '🧹', title: 'Organize & Discipline', desc: 'Clean your workspace, organize files, and plan next week. Saturn rewards structure — chaos on Saturday creates obstacles in the days ahead.' },
            { icon: '🤲', title: 'Serve the Needy', desc: 'Feed a stray animal, help an elder, or donate blankets. Saturn is the planet of karma — selfless service today dissolves karmic debts and brings protection.' },
            { icon: '🪨', title: 'Grounding Walk', desc: 'Walk barefoot on earth or grass for 10 minutes. Saturn is the earth element — grounding today relieves joint pain, reduces anxiety, and stabilizes scattered energy.' },
            { icon: '🦷', title: 'Dental Care Ritual', desc: 'Oil pull with sesame oil for 5 minutes, then brush thoroughly. Saturn rules teeth and gums — neglecting oral health on Saturday invites decay and pain.' },
            { icon: '⏳', title: 'Patience Meditation', desc: 'Sit still for 10 minutes doing nothing — no phone, no music, just silence. Saturn teaches patience. This practice builds willpower and reduces impulsive behavior.' }
        ]
    }
];

const MobileReports = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    // Check for navigation state to open specific sections automatically
    useEffect(() => {
        if (location.state?.openPremium) {
            setActiveSection('premium');
        }
        if (location.state?.openBCA) {
            setActiveSection('bca');
            // Wait a tiny bit for the accordion to animate open, then reveal the modal
            setTimeout(() => setIsBCAOpen(true), 150);
        }
    }, [location.state]);

    // State for Accordion
    const [activeSection, setActiveSection] = useState(null); // 'birth-chart', 'astrorevo-chart', 'premium', 'yoga', 'bca'

    // State for Cosmic Rhythm day selector
    const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay());

    // State for Birth Chart
    const [chartData, setChartData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [isChartGenerated, setIsChartGenerated] = useState(false);

    // State for Modals
    const [selectedChakra, setSelectedChakra] = useState(null);
    const [isMembershipOpen, setIsMembershipOpen] = useState(false);
    const [isBCAOpen, setIsBCAOpen] = useState(false);

    // State for Nakshatra Expansion
    const [isNakshatraExpanded, setIsNakshatraExpanded] = useState(false);
    const [liveNakshatra, setLiveNakshatra] = useState(null);

    // Fetch Live Nakshatra on mount via dynamic import to isolate dependency
    useEffect(() => {
        const fetchLiveNakshatra = async () => {
            try {
                // Determine nakshatra calculation dynamically
                const { getCurrentTransitNakshatra } = await import('../utils/nakshatraUtils.js');
                const transitData = getCurrentTransitNakshatra();
                if (transitData) {
                    setLiveNakshatra(transitData);
                }
            } catch (err) {
                console.error("Error loading Nakshatra data:", err);
            }
        };

        fetchLiveNakshatra();
    }, []);

    // Auth & Premium State
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            if (user) {
                const status = await checkMembershipStatus(user.uid);
                setIsPremium(status);
            }
        };
        checkStatus();
    }, [user, isMembershipOpen]); // Re-check when membership modal closes (e.g. after purchase)

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    // Chakra Data
    const chakras = [
        { name: 'Sahasrara', color: '#E9D8FD', rgb: '233, 216, 253', symbol: 'ॐ', description: 'Crown: Pure Consciousness', petals: 1000, yantra: 'circle' },
        { name: 'Ajna', color: '#B794F4', rgb: '183, 148, 244', symbol: 'ॐ', description: 'Third Eye: Intuition', petals: 2, yantra: 'circle' },
        { name: 'Vishuddha', color: '#63B3ED', rgb: '99, 179, 237', symbol: 'हं', description: 'Throat: Expression', petals: 16, yantra: 'circle' },
        { name: 'Anahata', color: '#68D391', rgb: '104, 211, 145', symbol: 'यं', description: 'Heart: Love & Balance', petals: 12, yantra: 'hexagram' },
        { name: 'Manipura', color: '#F6E05E', rgb: '246, 224, 94', symbol: 'रं', description: 'Solar Plexus: Power', petals: 10, yantra: 'triangle' },
        { name: 'Svadhisthana', color: '#F6AD55', rgb: '246, 173, 85', symbol: 'वं', description: 'Sacral: Creativity', petals: 6, yantra: 'crescent' },
        { name: 'Muladhara', color: '#FC8181', rgb: '252, 129, 129', symbol: 'लं', description: 'Root: Stability', petals: 4, yantra: 'square' }
    ];

    const handleChartSubmit = async (data) => {
        setUserData(data);
        setIsChartLoading(true);
        setIsChartGenerated(true);
        try {
            const result = await getLocalVedicChart(data);
            setChartData(result.data);
        } catch (error) {
            console.error("Chart generation failed", error);
        } finally {
            setIsChartLoading(false);
        }
    };

    return (
        <div className="mobile-reports-container">
            <header className="page-header">
                <h2>{t('Your Cosmic Reports')}</h2>
                <p>{t('Unlock destiny, health, and spiritual growth.')}</p>
            </header>

            <div className="reports-accordion">
                {/* 0. Today's Cosmic Rhythm Accordion */}
                {(() => {
                    const todayData = DAILY_PLANET_DATA[selectedDayIndex];
                    const todayIndex = new Date().getDay();
                    return (
                        <div className={`accordion-item ${activeSection === 'daily-planet' ? 'active' : ''}`}>
                            <div className="accordion-header" onClick={() => toggleSection('daily-planet')}>
                                <div className="header-icon-box" style={{ background: `rgba(${todayData.color === '#f59e0b' ? '245,158,11' : todayData.color === '#e2e8f0' ? '226,232,240' : todayData.color === '#ef4444' ? '239,68,68' : todayData.color === '#22c55e' ? '34,197,94' : todayData.color === '#eab308' ? '234,179,8' : todayData.color === '#ec4899' ? '236,72,153' : '139,92,246'}, 0.15)`, color: todayData.color, backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <Sun size={20} />
                                </div>
                                <div className="header-info">
                                    <h3>{t("Today's Cosmic Rhythm")}</h3>
                                    <span>{todayData.day} · {todayData.planet} ({todayData.sanskrit})</span>
                                </div>
                                {activeSection === 'daily-planet' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>
                            {activeSection === 'daily-planet' && (
                                <>
                                    <div className="daily-day-selector">
                                        {DAILY_PLANET_DATA.map((d, idx) => (
                                            <button
                                                key={d.day}
                                                className={`day-selector-btn ${idx === selectedDayIndex ? 'active' : ''} ${idx === todayIndex ? 'today' : ''}`}
                                                style={{ '--day-color': d.color }}
                                                onClick={() => setSelectedDayIndex(idx)}
                                            >
                                                <span className="day-emoji">{d.emoji}</span>
                                                <span className="day-short">{d.day.substring(0, 3)}</span>
                                                {idx === todayIndex && <span className="today-dot"></span>}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="accordion-content">
                                        <div className="daily-planet-card" style={{ background: todayData.gradient, border: `1px solid ${todayData.borderColor}` }}>
                                            <div className="daily-planet-header">
                                                <div className="daily-planet-emoji">{todayData.emoji}</div>
                                                <div>
                                                    <div className="daily-planet-name" style={{ color: todayData.color }}>{todayData.planet} · {todayData.sanskrit}</div>
                                                    <div className="daily-planet-focus">{todayData.focusTitle}</div>
                                                </div>
                                            </div>

                                            <p className="daily-planet-guidance">{todayData.guidance}</p>

                                            <div className="daily-planet-mantra" style={{ borderColor: todayData.borderColor }}>
                                                <div className="daily-planet-section-label" style={{ color: todayData.color }}>🙏 TODAY'S MANTRA</div>
                                                <div className="daily-planet-mantra-text">{todayData.mantra}</div>
                                            </div>

                                            <div className="daily-planet-tip" style={{ background: `${todayData.color}12`, borderLeft: `3px solid ${todayData.color}` }}>
                                                <div className="daily-planet-section-label" style={{ color: todayData.color }}>✨ TIP</div>
                                                <div className="daily-planet-tip-text">{todayData.tip}</div>
                                            </div>

                                            <div className="daily-planet-avoid">
                                                <div className="daily-planet-section-label" style={{ color: '#f87171' }}>⚠️ AVOID TODAY</div>
                                                <div className="daily-planet-avoid-text">{todayData.avoid}</div>
                                            </div>


                                            {/* Deity Devotion Section */}
                                            {todayData.deity && todayData.deity.principles.length > 0 && (
                                                <div className="daily-deity-section">
                                                    <div className="daily-planet-section-label" style={{ color: todayData.color, marginBottom: '12px', marginTop: '18px', fontSize: '0.65rem' }}>
                                                        {todayData.deity.deityEmoji} DEVOTION TO {todayData.deity.name.toUpperCase()}
                                                    </div>
                                                    <div className="daily-deity-tagline" style={{ color: todayData.color }}>
                                                        {todayData.deity.tagline}
                                                    </div>
                                                    <div className="daily-wellness-scroll">
                                                        {todayData.deity.principles.map((p, idx) => (
                                                            <div className="daily-deity-card" key={idx} style={{ borderColor: todayData.borderColor }}>
                                                                <div className="daily-deity-num" style={{ color: todayData.color }}>{p.num}</div>
                                                                <div className="daily-wellness-title" style={{ color: todayData.color }}>{p.title}</div>
                                                                <div className="daily-wellness-desc">{p.desc}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="daily-wellness-hint">← Swipe to see all {todayData.deity.principles.length} principles →</div>
                                                </div>
                                            )}

                                            {/* Havan & Pooja Scrollable Section */}
                                            {todayData.havan && todayData.havan.length > 0 && (
                                                <div className="daily-havan-section">
                                                    <div className="daily-planet-section-label" style={{ color: '#f97316', marginBottom: '12px', marginTop: '18px', fontSize: '0.65rem' }}>
                                                        🔥 HAVAN & POOJA RITUALS
                                                    </div>
                                                    <div className="daily-wellness-scroll">
                                                        {todayData.havan.map((item, idx) => (
                                                            <div className="daily-havan-card" key={idx} style={{ borderColor: todayData.borderColor }}>
                                                                <div className="daily-wellness-icon">{item.icon}</div>
                                                                <div className="daily-wellness-title" style={{ color: '#f97316' }}>{item.title}</div>
                                                                <div className="daily-wellness-desc">{item.desc}</div>
                                                                <div className="daily-havan-meta">
                                                                    <div className="daily-havan-time">🕐 {item.time}</div>
                                                                    <div className="daily-havan-items">📦 {item.items}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="daily-wellness-hint">← Swipe to see all {todayData.havan.length} rituals →</div>
                                                </div>
                                            )}

                                            {/* Wellness Advice Scrollable Section */}
                                            {todayData.wellness && todayData.wellness.length > 0 && (
                                                <div className="daily-wellness-section">
                                                    <div className="daily-planet-section-label" style={{ color: todayData.color, marginBottom: '12px', marginTop: '18px', fontSize: '0.65rem' }}>
                                                        🌿 TODAY'S WELLNESS ROUTINE
                                                    </div>
                                                    <div className="daily-wellness-scroll">
                                                        {todayData.wellness.map((item, idx) => (
                                                            <div className="daily-wellness-card" key={idx} style={{ borderColor: todayData.borderColor }}>
                                                                <div className="daily-wellness-icon">{item.icon}</div>
                                                                <div className="daily-wellness-title" style={{ color: todayData.color }}>{item.title}</div>
                                                                <div className="daily-wellness-desc">{item.desc}</div>
                                                                <div className="daily-wellness-badge" style={{ background: `${todayData.color}18`, color: todayData.color }}>
                                                                    {todayData.planet} Advice
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="daily-wellness-hint">← Swipe to see all {todayData.wellness.length} tips →</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })()}

                {/* 1. Birth Chart Accordion */}
                <div className={`accordion-item ${activeSection === 'birth-chart' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('birth-chart')}>
                        <div className="header-icon-box" style={{ background: 'rgba(255, 215, 0, 0.15)', color: '#FFD700', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Star size={20} />
                        </div>
                        <div className="header-info">
                            <h3>{t('Birth Chart')}</h3>
                            <span>{t('Quick Vedic Calculation')}</span>
                        </div>
                        {activeSection === 'birth-chart' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'birth-chart' && (
                        <div className="accordion-content">
                            <div className="chart-card glass-panel">
                                {!isChartGenerated ? (
                                    <div className="embedded-form-wrapper">
                                        <BirthDetailsForm
                                            onSubmit={handleChartSubmit}
                                            title=""
                                            submitLabel="Reveal My Chart"
                                        />
                                    </div>
                                ) : (
                                    <div className="embedded-chart-view">
                                        <div className="chart-header-mini">
                                            <h4>{userData?.name}'s Chart</h4>
                                            <button className="reset-btn" onClick={() => setIsChartGenerated(false)}>New</button>
                                        </div>
                                        <div className="chart-viz-wrapper">
                                            <AstroChart chartData={chartData} isLoading={isChartLoading} />
                                        </div>
                                        <div className="chart-summary-mini">
                                            <p>Your planetary blueprint is ready. Unlock the full report for deep analysis.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. The AstroRevo Chart Accordion */}
                <div className={`accordion-item ${activeSection === 'astrorevo-chart' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('astrorevo-chart')}>
                        <div className="header-icon-box" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Compass size={20} />
                        </div>
                        <div className="header-info">
                            <h3>{t('The AstroRevo Chart')}</h3>
                            <span>{t("Your Soul's Blueprint")}</span>
                        </div>
                        {activeSection === 'astrorevo-chart' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'astrorevo-chart' && (
                        <div className="accordion-content">
                            <div className="astrorevo-promo-card" onClick={() => navigate('/mobile/sample')}>
                                <div className="promo-bg-glow"></div>
                                <div className="promo-content">
                                    <div className="promo-badge">{t('RECOMMENDED')}</div>
                                    <h3>{t('Discover Your True Self')}</h3>
                                    <p>{t('A comprehensive map of your destiny, engraved in the stars at the moment of your birth. Discover hidden potentials and karmic paths.')}</p>
                                    <div className="sample-chart-container" style={{ marginTop: '16px' }}>
                                        <button className="sample-chart-preview-btn" onClick={(e) => { e.stopPropagation(); navigate('/mobile/sample'); }}>
                                            <div className="preview-icon">
                                                <span style={{ fontSize: '20px' }}>📊</span>
                                            </div>
                                            <div className="preview-text">
                                                <span className="preview-title">{t('View Sample Report')}</span>
                                                <span className="preview-subtitle">{t('See what your future holds')}</span>
                                            </div>
                                            <div className="preview-arrow">→</div>
                                        </button>

                                        <button className="razorpay-buy-btn" onClick={(e) => { e.stopPropagation(); setIsMembershipOpen(true); }}>
                                            <span className="buy-text">{t('Unlock Full Report')}</span>
                                            <span className="buy-price">₹99</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Nakshatra / Stars Accordion */}
                <div className={`accordion-item ${activeSection === 'nakshatra' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('nakshatra')}>
                        <div className="header-icon-box" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Star size={20} />
                        </div>
                        <div className="header-info">
                            <h3>{t('Nakshatra / Stars')}</h3>
                            <span>{t('Your Birth Star Insights')}</span>
                        </div>
                        {activeSection === 'nakshatra' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'nakshatra' && liveNakshatra && (
                        <div className="accordion-content">
                            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '6rem', opacity: 0.05, pointerEvents: 'none' }}>✨</div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.05))', border: '1px solid rgba(236, 72, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#f472b6', boxShadow: 'inset 0 0 10px rgba(236, 72, 153, 0.2)' }}>
                                            {liveNakshatra.name.substring(0, 1)}
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--vp-w90)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{liveNakshatra.name} NAKSHATRA</div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--vp-w50)', letterSpacing: '0.05em', marginTop: '4px' }}>The {liveNakshatra.details.nature} Star · {liveNakshatra.details.rulingPlanet} Ruled</div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: 'var(--vp-w60)', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: 'bold' }}>
                                            <span>TRANSIT PROGRESS</span>
                                            <span>{liveNakshatra.percentComplete}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: `${liveNakshatra.percentComplete}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899, #f472b6)', borderRadius: '10px', transition: 'width 1s ease-out' }}></div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>DEITY</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{liveNakshatra.details.deity}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>SYMBOL</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{liveNakshatra.details.symbol}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>ANIMAL</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{liveNakshatra.details.animal}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>NATURE</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{liveNakshatra.details.nature}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>ELEMENT / DOSHA</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{liveNakshatra.details.element}</div>
                                        </div>
                                    </div>

                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)', lineHeight: '1.5', marginBottom: '20px' }}>
                                        {liveNakshatra.details.description}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ background: 'rgba(52, 211, 153, 0.05)', padding: '12px', borderRadius: '12px', borderLeft: '3px solid rgba(52, 211, 153, 0.5)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: '0.6rem', color: '#34d399' }}>✓</span>
                                                </div>
                                                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#a7f3d0', letterSpacing: '0.1em', fontWeight: 'bold' }}>FAVORABLE FOR</span>
                                            </div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--vp-w80)', lineHeight: '1.4' }}>
                                                {liveNakshatra.details.favorable}
                                            </div>
                                        </div>
                                        <div style={{ background: 'rgba(248, 113, 113, 0.05)', padding: '12px', borderRadius: '12px', borderLeft: '3px solid rgba(248, 113, 113, 0.5)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(248, 113, 113, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: '0.5rem', color: '#f87171' }}>✕</span>
                                                </div>
                                                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#fecaca', letterSpacing: '0.1em', fontWeight: 'bold' }}>UNFAVORABLE FOR</span>
                                            </div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--vp-w80)', lineHeight: '1.4' }}>
                                                {liveNakshatra.details.unfavorable}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsNakshatraExpanded(!isNakshatraExpanded);
                                    }}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(236, 72, 153, 0.1)',
                                        border: '1px solid rgba(236, 72, 153, 0.3)',
                                        padding: '14px',
                                        borderRadius: '24px',
                                        color: '#fbcfe8',
                                        fontFamily: 'var(--font-ui)',
                                        letterSpacing: '0.1em',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        backdropFilter: 'blur(16px)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                    {isNakshatraExpanded ? '✦ CLOSE REPORT' : '✦ EXPLORE FULL NAKSHATRA REPORT'}
                                </button>

                                {isNakshatraExpanded && (
                                    <div style={{ marginTop: '8px', animation: 'fadeIn 0.4s ease', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
                                            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#f472b6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Star size={18} /> Deep Psychological Profile
                                            </h4>

                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#ec4899', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: 'bold' }}>KEY STRENGTHS</div>
                                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)', lineHeight: '1.5' }}>
                                                    {liveNakshatra.details.strengths}
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#ec4899', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: 'bold' }}>SHADOW TRAITS</div>
                                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)', lineHeight: '1.5' }}>
                                                    {liveNakshatra.details.shadow}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#ec4899', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: 'bold' }}>CAREER SYNERGIES</div>
                                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)', lineHeight: '1.5' }}>
                                                    {liveNakshatra.details.career}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(255, 255, 255, 0.02))', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: '24px', padding: '24px', textAlign: 'center' }}>
                                            <Crown size={24} color="#f472b6" style={{ margin: '0 auto 12px auto' }} />
                                            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--vp-w90)', marginBottom: '8px' }}>Padas (Quarters) Analysis</h4>
                                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--vp-w70)', lineHeight: '1.5', marginBottom: '16px' }}>
                                                Each Nakshatra is divided into 4 quarters. Unlock the premium report to discover exactly which Pada your moon resides in and its unique micro-influence on your destiny.
                                            </p>
                                            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {liveNakshatra.details.padas.map((pada, idx) => (
                                                    <div key={pada.id} style={{ background: pada.id === liveNakshatra.pada ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px', borderLeft: `3px solid ${pada.id === liveNakshatra.pada ? '#f472b6' : ['#fecaca', '#fde047', '#a7f3d0', '#bfdbfe'][idx]}` }}>
                                                        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: pada.id === liveNakshatra.pada ? '#f472b6' : ['#fecaca', '#fde047', '#a7f3d0', '#bfdbfe'][idx], fontWeight: 'bold', marginBottom: '4px' }}>
                                                            Pada {pada.id} ({pada.navamsa} Navamsa) {pada.id === liveNakshatra.pada && ' - CURRENT'}
                                                        </div>
                                                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--vp-w80)', lineHeight: '1.4' }}>
                                                            {pada.desc}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className={`accordion-item ${activeSection === 'premium' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('premium')}>
                        <div className="header-icon-box" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Lock size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Premium Access</h3>
                            <span>{isPremium ? 'Your Premium Dashboard' : 'Unlock Ultimate Clarity'}</span>
                        </div>
                        {activeSection === 'premium' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'premium' && (
                        <div className="accordion-content">
                            {isPremium ? (
                                <MobilePremiumDashboard user={user} />
                            ) : (
                                <div className="premium-promo-card" onClick={() => setIsMembershipOpen(true)}>
                                    <div className="premium-bg-glow"></div>
                                    <div className="premium-content">
                                        <div className="premium-badge">FULL VERSION</div>
                                        <h3>Included with AstroRevo Chart</h3>
                                        <p style={{ color: '#e0e7ff', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6', textAlign: 'left' }}>
                                            Get instant access to all premium features when you unlock your full <strong>AstroRevo Chart</strong>.
                                        </p>
                                        <ul style={{ color: '#e0e7ff', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', textAlign: 'left' }}>
                                            <li>50+ Pages of Detailed Analysis</li>
                                            <li>Vimshottari Dasha Predictions (5 Years)</li>
                                            <li>Gemstone & Rudraksha Recommendations</li>
                                            <li>Sadhesati & Mangal Dosha Remedies</li>
                                        </ul>
                                        <button className="premium-cta-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setIsMembershipOpen(true); }}>
                                            Unlock via AstroRevo Chart • ₹99
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 4. Yoga Remedies Accordion */}
                <div className={`accordion-item ${activeSection === 'yoga' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('yoga')}>
                        <div className="header-icon-box" style={{ background: 'rgba(67, 233, 123, 0.15)', color: '#43e97b', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Activity size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Yoga Remedies</h3>
                            <span>Balance your 7 Chakras</span>
                            <span className="premium-badge-text">Premium Access Recommended</span>
                        </div>
                        {activeSection === 'yoga' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'yoga' && (
                        <div className="accordion-content">
                            <div className="chakra-list">
                                {chakras.map((chakra, index) => (
                                    <div
                                        key={chakra.name}
                                        className="chakra-item-card"
                                        style={{ '--chakra-color': chakra.color }}
                                        onClick={() => setSelectedChakra(chakra)}
                                    >
                                        <div className="chakra-symbol-box" style={{ borderColor: chakra.color }}>
                                            <span className="chakra-symbol" style={{ color: chakra.color }}>{chakra.symbol}</span>
                                        </div>
                                        <div className="chakra-info">
                                            <h4>{chakra.name}</h4>
                                            <span>{chakra.description.split(':')[0]}</span>
                                        </div>
                                        <ChevronRight size={20} className="arrow-icon" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. 21-Day Yoga Plan Accordion */}
                <div className={`accordion-item ${activeSection === 'bca' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('bca')}>
                        <div className="header-icon-box" style={{ background: 'rgba(240, 147, 251, 0.15)', color: '#f093fb', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Compass size={20} />
                        </div>
                        <div className="header-info">
                            <h3>21-Day Yoga Plan</h3>
                            <span>Ayurvedic Health Insights</span>
                        </div>
                        {activeSection === 'bca' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'bca' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => setIsBCAOpen(true)}>
                                <div className="bca-icon-circle">
                                    <Activity size={24} color="#ffffff" />
                                </div>
                                <div className="bca-text">
                                    <h3>21-Day Yoga Plan</h3>
                                    <p>Discover how your physical form aligns with your energy centers. Get a personalized health & yoga plan.</p>
                                </div>
                                <button className="bca-btn">Start Analysis</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 6. Western Zodiac Natal Chart Accordion */}
                <div className={`accordion-item ${activeSection === 'western-chart' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('western-chart')}>
                        <div className="header-icon-box" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Globe size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Western Zodiac Natal Chart</h3>
                            <span>Tropical Astrology Insights</span>
                        </div>
                        {activeSection === 'western-chart' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'western-chart' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/western-chart')} style={{ background: 'linear-gradient(135deg, rgba(46, 16, 101, 0.3), rgba(15, 23, 42, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(168, 85, 247, 0.3)' }}>
                                    <Globe size={24} color="#ffffff" />
                                </div>
                                <div className="bca-text">
                                    <h3>Western Birth Chart</h3>
                                    <p>Explore your Sun, Moon, and Rising signs through the Western Tropical Zodiac system.</p>
                                </div>
                                <button className="bca-btn" style={{ background: '#a855f7' }}>View Western Chart</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 7. Planet Tracker Accordion */}
                <div className={`accordion-item ${activeSection === 'planet-tracker' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('planet-tracker')}>
                        <div className="header-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Globe size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Planet Tracker</h3>
                            <span>Master 9 Planetary Energies</span>
                            <span className="premium-badge-text">New Feature</span>
                        </div>
                        {activeSection === 'planet-tracker' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'planet-tracker' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/planet-trackers')} style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.3), rgba(15, 23, 42, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(255, 215, 0, 0.2)' }}>
                                    <Globe size={24} color="#FFD700" />
                                </div>
                                <div className="bca-text">
                                    <h3>Your Daily Karmic Journey</h3>
                                    <p>Track habits, build discipline, and balance your cosmic energies across all 9 planets.</p>
                                </div>
                                <button className="bca-btn" style={{ background: '#8b5cf6' }}>Open Tracker Hub</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 8. Life Tracker Accordion */}
                <div className={`accordion-item ${activeSection === 'life-tracker' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('life-tracker')}>
                        <div className="header-icon-box" style={{ background: 'rgba(20, 184, 166, 0.15)', color: '#14b8a6', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Target size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Life Tracker</h3>
                            <span>Plan · Track · Achieve</span>
                            <span className="premium-badge-text">New Feature</span>
                        </div>
                        {activeSection === 'life-tracker' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'life-tracker' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/life-tracker')} style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08), rgba(15, 23, 42, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(20, 184, 166, 0.2)' }}>
                                    <Target size={24} color="#5eead4" />
                                </div>
                                <div className="bca-text">
                                    <h3>Your Holistic Life Planner</h3>
                                    <p>Plan weddings, vacations & exams step-by-step. Track gym gains, body measurements & workout streaks. All in one cosmic dashboard.</p>
                                </div>
                                <button className="bca-btn" style={{ background: '#14b8a6' }}>Open Tracker</button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Spacer for bottom nav */}
            <div style={{ height: '70px' }}></div>

            {/* Modals */}
            <ChakraYogaPage
                isOpen={!!selectedChakra}
                onClose={() => setSelectedChakra(null)}
                chakra={selectedChakra}
            />

            <MembershipModal
                isOpen={isMembershipOpen}
                onClose={() => setIsMembershipOpen(false)}
                onSuccess={() => {
                    setIsMembershipOpen(false);
                    // Immediately grant access (for Guest Mode & instant feedback)
                    setIsPremium(true);
                    setActiveSection('premium');

                    // Verify with backend if user exists (to ensure persistence)
                    const checkStatus = async () => {
                        if (user) {
                            const status = await checkMembershipStatus(user.uid);
                            // Only update if verifiable status is returned
                            if (status) setIsPremium(true);
                        }
                    };
                    checkStatus();
                }}
            />



            <BCAAnalysis
                isOpen={isBCAOpen}
                onClose={() => setIsBCAOpen(false)}
            />
        </div>
    );
};

export default MobileReports;
