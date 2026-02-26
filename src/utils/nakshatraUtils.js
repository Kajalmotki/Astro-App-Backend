import { Origin, Horoscope } from 'circular-natal-horoscope-js/dist/index.js';

export const NAKSHATRA_DATA = [
    {
        name: "Ashwini", symbol: "Horse's Head", deity: "Ashwini Kumaras (Physicians of Gods)", animal: "Male Horse", nature: "Kshipra (Swift)", rulingPlanet: "Ketu", element: "Earth / Vata",
        description: "Ashwini signifies swift action, healing, and pioneering energy. It brings a youthful, adventurous spirit and a desire for rapid progress.",
        favorable: "Healing, starting medical treatments, travel, buying/selling vehicles, beginning new studies, physical exercise, and quick actions.",
        unfavorable: "Marriage, demanding patience, slow-paced activities, or settling down.",
        strengths: "Energetic, independent, courageous, quick-witted, loves travel and exploration.",
        shadow: "Impulsive, arrogant, lacks patience, prone to leaving projects unfinished.",
        career: "Medicine, healing arts, transportation, sports, military, entrepreneurship, and anything involving speed.",
        padas: [
            { id: 1, navamsa: "Aries", desc: "Driven, independent, and highly energetic. Can be overly aggressive." },
            { id: 2, navamsa: "Taurus", desc: "Focuses on material stability, resources, and practical implementation." },
            { id: 3, navamsa: "Gemini", desc: "Communicative, intellectual, and adaptable. Good at networking." },
            { id: 4, navamsa: "Cancer", desc: "Emotional, caring, and intuitive. Seeks comfort and security." }
        ]
    },
    {
        name: "Bharani", symbol: "Yoni (Female Reproductive Organ)", deity: "Yama (God of Death & Justice)", animal: "Male Elephant", nature: "Ugra (Fierce)", rulingPlanet: "Venus", element: "Earth / Pitta",
        description: "Bharani deals with the extremes of life—birth and death, creation and destruction. It tests one's ability to endure and transform.",
        favorable: "Creative activities, romantic pursuits, dealing with agriculture, resolving disputes, and ending old things to start anew.",
        unfavorable: "Travel, gentle/peaceful activities, starting completely new ventures without closing old ones.",
        strengths: "Creative, strong-willed, dutiful, truthful, and capable of extreme transformation.",
        shadow: "Stubborn, judgmental, unforgiving, and prone to extremes in emotion.",
        career: "Obstetrics, gynecology, agriculture, creative arts, law, entertainment, and professions dealing with transformation or death.",
        padas: [
            { id: 1, navamsa: "Leo", desc: "Creative, proud, and dramatic. Focuses on self-expression." },
            { id: 2, navamsa: "Virgo", desc: "Analytical, critical, and service-oriented. Needs organization." },
            { id: 3, navamsa: "Libra", desc: "Social, diplomatic, and beauty-conscious. Seeks balance." },
            { id: 4, navamsa: "Scorpio", desc: "Intense, transformative, and secretive. Highly focused." }
        ]
    },
    {
        name: "Krittika", symbol: "Razor / Knife", deity: "Agni (God of Fire)", animal: "Female Sheep", nature: "Mishra (Mixed)", rulingPlanet: "Sun", element: "Earth / Kapha",
        description: "Krittika is the cutting edge, representing purification through fire. It cuts away negativity and illuminates the truth.",
        favorable: "Purification rituals, starting new projects, leadership roles, culinary activities, and cutting ties with the past.",
        unfavorable: "Relaxation, diplomatic negotiations, and activities requiring immense patience.",
        strengths: "Determined, ambitious, sharp-minded, protective, and a strong leader.",
        shadow: "Harsh, critical, stubborn, and struggles with expressing softer emotions.",
        career: "Military, politics, cooking/culinary arts, surgery, engineering, and leadership roles.",
        padas: [
            { id: 1, navamsa: "Sagittarius", desc: "Optimistic, philosophical, and adventurous. Expands horizons." },
            { id: 2, navamsa: "Capricorn", desc: "Practical, disciplined, and goal-oriented. Works hard for success." },
            { id: 3, navamsa: "Aquarius", desc: "Innovative, humanitarian, and networking. Thinks outside the box." },
            { id: 4, navamsa: "Pisces", desc: "Compassionate, spiritual, and intuitive. Connects with the collective." }
        ]
    },
    {
        name: "Rohini", symbol: "Ox Cart / Temple / Banyan Tree", deity: "Brahma (The Creator)", animal: "Male Serpent", nature: "Dhruva (Fixed)", rulingPlanet: "Moon", element: "Earth / Kapha",
        description: "Rohini is the star of growth, beauty, and material prosperity. It is highly creative and deeply connected to nature and the arts.",
        favorable: "Planting, agriculture, marriage, romantic pursuits, creative arts, buying property/clothes, and financial investments.",
        unfavorable: "Destructive activities, fast-paced actions, and arguments.",
        strengths: "Charming, charismatic, creative, stable, nurturing, and attracts wealth.",
        shadow: "Possessive, jealous, excessively materialistic, and stubborn.",
        career: "Agriculture, real estate, arts, fashion, beauty industry, luxury goods, and environmentalism.",
        padas: [
            { id: 1, navamsa: "Aries", desc: "Passionate, initiating, and courageous. Loves starting new physical or creative projects." },
            { id: 2, navamsa: "Taurus", desc: "Extremely stable, loves luxury, deeply grounded, and highly focused on resource accumulation. The most 'Rohini' of the Padas." },
            { id: 3, navamsa: "Gemini", desc: "Intellectual, communicative, and versatile. Blends creativity with mental agility." },
            { id: 4, navamsa: "Cancer", desc: "Highly emotional, nurturing, and protective. Deeply connected to home and family roots." }
        ]
    },
    {
        name: "Mrigashira", symbol: "Deer's Head", deity: "Soma (Moon God)", animal: "Female Serpent", nature: "Mridu (Tender)", rulingPlanet: "Mars", element: "Earth / Pitta",
        description: "Mrigashira is the searching star. It represents a constant quest for knowledge, experience, and sometimes spiritual enlightenment.",
        favorable: "Travel, exploration, research, socializing, artistic pursuits, healing, and romantic connections.",
        unfavorable: "Routine tasks, making long-term commitments, and harsh actions.",
        strengths: "Curious, intelligent, adaptable, gentle, artistic, and a good communicator.",
        shadow: "Restless, fickle, suspicious, prone to over-thinking, and easily bored.",
        career: "Research, travel industry, writing, communication, exploring, and holistic healing.",
        padas: [
            { id: 1, navamsa: "Leo", desc: "Confident, seeking self-expression and leadership through knowledge." },
            { id: 2, navamsa: "Virgo", desc: "Analytical, methodical researcher, highly detail-oriented." },
            { id: 3, navamsa: "Libra", desc: "Social, seeks balance and beauty, loves exploring relationships." },
            { id: 4, navamsa: "Scorpio", desc: "Intense researcher, interested in the occult, uncovers hidden truths." }
        ]
    },
    {
        name: "Ardra", symbol: "Teardrop / Diamond", deity: "Rudra (God of Storms / Destruction)", animal: "Female Dog", nature: "Daruna (Harsh)", rulingPlanet: "Rahu", element: "Water / Vata",
        description: "Ardra is the star of sorrow and storms. It brings sudden changes, emotional upheavals, leading to purification and deep transformation.",
        favorable: "Discarding old habits/things, confronting difficult truths, research into profound subjects, and activities requiring intense focus.",
        unfavorable: "Starting new journeys, marriage, or undertaking generally auspicious activities.",
        strengths: "Deeply emotional, fiercely independent, transformative, resilient, and analytical.",
        shadow: "Prone to anger, depression, destructive tendencies, and feelings of isolation.",
        career: "Psychology, research, technology, storm chasing/weather analysis, crisis management, and jobs requiring dismantling the old.",
        padas: [
            { id: 1, navamsa: "Sagittarius", desc: "Philosophically transforms, seeking higher truth through the storm." },
            { id: 2, navamsa: "Capricorn", desc: "Practical transformation, restructuring material reality." },
            { id: 3, navamsa: "Aquarius", desc: "Intellectual shifts, radical ideas, changing societal norms." },
            { id: 4, navamsa: "Pisces", desc: "Deepest emotional clearing, spiritual liberation through letting go." }
        ]
    },
    {
        name: "Punarvasu", symbol: "Quiver of Arrows", deity: "Aditi (Mother of Gods)", animal: "Female Cat", nature: "Chara (Movable)", rulingPlanet: "Jupiter", element: "Water / Vata",
        description: "Punarvasu means 'return of the light'. It signals a return to safety, hope, and prosperity after a difficult period. It represents infinite potential.",
        favorable: "Traveling, treatments, making investments, spiritual practices, beginning new projects, and returning home.",
        unfavorable: "Engaging in conflict, legal disputes, lending money.",
        strengths: "Optimistic, friendly, spiritual, nurturing, resilient, and philanthropic.",
        shadow: "Overly simplistic, lacks foresight in practical matters, and can be naive.",
        career: "Teaching, writing, travel, philosophy, childcare, healing, and construction/architecture.",
        padas: [
            { id: 1, navamsa: "Aries", desc: "Initiates new spiritual journeys, enthusiastic and pioneering." },
            { id: 2, navamsa: "Taurus", desc: "Grounds spiritual knowledge into practical, material comfort." },
            { id: 3, navamsa: "Gemini", desc: "Communicates philosophical ideas, highly intellectual." },
            { id: 4, navamsa: "Cancer", desc: "Deeply nurturing, finding ultimate safety in the emotional realm." }
        ]
    },
    {
        name: "Pushya", symbol: "Cow's Udder / Lotus", deity: "Brihaspati (Jupiter/Guru)", animal: "Goat", nature: "Kshipra (Swift)", rulingPlanet: "Saturn", element: "Water / Pitta",
        description: "Pushya is considered the most auspicious of all Nakshatras. It brings nourishment, wealth, and deep spiritual inclinations. You possess a giving nature and natural wisdom.",
        favorable: "Beginning education, learning astrology, spiritual retreats, spending time with family, cooking, gardening.",
        unfavorable: "Marriage ceremonies, harsh actions, arguments, borrowing money, highly competitive activities.",
        strengths: "Highly dependable, generous, spiritually inclined, protective of loved ones, resilient in adversity, and possesses a natural aptitude for giving sound advice.",
        shadow: "Can be overly stubborn, rigidly traditional, prone to self-doubt, and sometimes gives so much to others that they neglect their own personal boundaries.",
        career: "Teaching, counseling, religious/spiritual roles, politics, real estate, agriculture, and caregiving professions.",
        padas: [
            { id: 1, navamsa: "Leo", desc: "Focuses on achievement, wealth, and family. Grants leadership qualities and a strong desire to protect and provide for lineage." },
            { id: 2, navamsa: "Virgo", desc: "The most hardworking and practical quarter. Emphasizes service, healing professions, and achieving success through meticulous discipline." },
            { id: 3, navamsa: "Libra", desc: "Focuses on harmony, relationships, and home life. Highly sociable, seeking balance, comfort, and peace in all domestic affairs." },
            { id: 4, navamsa: "Scorpio", desc: "The most mystical and emotional quarter. Prone to deep spiritual insights, occult studies, and transformation through caring for others." }
        ]
    },
    {
        name: "Ashlesha", symbol: "Coiled Serpent", deity: "Nagas (Serpent Deities)", animal: "Male Cat", nature: "Tikshna (Sharp)", rulingPlanet: "Mercury", element: "Water / Kapha",
        description: "Ashlesha is the star of the serpent. It involves clinging, embracing, and deep mystical power, often associated with kundalini energy and poisons/medicines.",
        favorable: "Handling poisons/chemicals, cunning actions, research into the occult, and activities requiring deception.",
        unfavorable: "Starting auspicious events, borrowing money, and anything requiring absolute transparency.",
        strengths: "Intensely intuitive, hypnotic, protective of its own, deeply analytical, and spiritually aware.",
        shadow: "Manipulative, deceptive, vengeful, suspicious, and prone to extreme emotional attachment.",
        career: "Medicine/pharmacology (handling poisons), psychology, occult sciences, politics, business strategy, espionage.",
        padas: [
            { id: 1, navamsa: "Sagittarius", desc: "Explores the philosophy of the occult, seeks higher meaning in the mysterious." },
            { id: 2, navamsa: "Capricorn", desc: "Utilizes hidden knowledge for practical power and ambition." },
            { id: 3, navamsa: "Aquarius", desc: "Networks and uses psychological insight to understand group dynamics." },
            { id: 4, navamsa: "Pisces", desc: "Deepest emotional and spiritual intuition, can dissolve boundaries." }
        ]
    },
    {
        name: "Magha", symbol: "Royal Throne", deity: "Pitris (Ancestors)", animal: "Male Rat", nature: "Ugra (Fierce)", rulingPlanet: "Ketu", element: "Fire / Kapha",
        description: "Magha represents royalty, ancestors, and prestige. It is connected to past lives, lineage, and a strong desire for respect and authority.",
        favorable: "Honoring ancestors, ceremonies requiring pomp, taking on leadership roles, and studying history/genealogy.",
        unfavorable: "Lending money, menial tasks, serving others, and anything lacking dignity.",
        strengths: "Generous, proud, honorable, respects tradition, capable of leadership, and deeply connected to roots.",
        shadow: "Arrogant, demands respect, intolerant of disrespect, fiercely ambitious, and can be overly attached to status.",
        career: "Politics, leadership, management, historians, archaeologists, acting, and any high-status profession.",
        padas: [
            { id: 1, navamsa: "Aries", desc: "Fierce, independent, pioneer leadership, highly protective of legacy." },
            { id: 2, navamsa: "Taurus", desc: "Secures lineage through material wealth, seeks stable authority." },
            { id: 3, navamsa: "Gemini", desc: "Communicates the knowledge of the ancestors, intellectual leadership." },
            { id: 4, navamsa: "Cancer", desc: "Deeply emotional connection to family roots, nurturing leader." }
        ]
    },
    {
        name: "Purva Phalguni", symbol: "Front Legs of a Bed / Hammock", deity: "Bhaga (God of Bliss/Wealth)", animal: "Female Rat", nature: "Ugra (Fierce)", rulingPlanet: "Venus", element: "Fire / Pitta",
        description: "Purva Phalguni is the star of rest, relaxation, and enjoyment. It signifies the fruits of past karma enjoyed in the present—pleasure, romance, and socializing.",
        favorable: "Marriage, romance, relaxation, artistic pursuits, socializing, and sensual pleasures.",
        unfavorable: "Hard labor, starting new intellectual studies, dealing with conflict.",
        strengths: "Charismatic, creative, passionate, relaxed, enjoys life, and attracts wealth.",
        shadow: "Lazy, indulgent, vain, easily distracted by sensual pleasures, and struggles with discipline.",
        career: "Entertainment, hospitality, wedding planning, arts, music, interior design, and beauty industries.",
        padas: [
            { id: 1, navamsa: "Leo", desc: "Takes pride in enjoyment, loves dramatic expression and luxury." },
            { id: 2, navamsa: "Virgo", desc: "Practical enjoyment, seeks perfection in artistry or relationships." },
            { id: 3, navamsa: "Libra", desc: "Highly social, focuses on balance and harmony in partnerships." },
            { id: 4, navamsa: "Scorpio", desc: "Intense passion, enjoys deep, transformative, and hidden pleasures." }
        ]
    },
    {
        name: "Uttara Phalguni", symbol: "Back Legs of a Bed", deity: "Aryaman (God of Patronage/Unions)", animal: "Male Bull", nature: "Dhruva (Fixed)", rulingPlanet: "Sun", element: "Fire / Pitta",
        description: "Uttara Phalguni represents the solid foundation built after enjoying life. It focuses on duty, honor, patronage, and forming lasting partnerships.",
        favorable: "Marriage, legal agreements, starting a business, acts of charity, and taking on responsibility.",
        unfavorable: "Breaking promises, illegal activities, and quick/frivolous actions.",
        strengths: "Responsible, honorable, dutiful, dependable friend/partner, and a strong patron.",
        shadow: "Overly critical, demanding, workaholic, and struggles with relinquishing control.",
        career: "Social work, counseling, philanthropy, human resources, administrative roles, and event planning.",
        padas: [
            { id: 1, navamsa: "Sagittarius", desc: "Philosophical foundation, seeks higher truth in commitments." },
            { id: 2, navamsa: "Capricorn", desc: "Highly practical and structured, focuses on material stability." },
            { id: 3, navamsa: "Aquarius", desc: "Builds networks and societal structures, humanitarian focus." },
            { id: 4, navamsa: "Pisces", desc: "Compassionate service, spiritualization of worldly duties." }
        ]
    },
    {
        name: "Hasta", symbol: "Hand / Fist", deity: "Savitur (Sun God)", animal: "Female Buffalo", nature: "Kshipra (Swift)", rulingPlanet: "Moon", element: "Fire / Vata",
        description: "Hasta means 'the hand'. It represents skill, craftsmanship, grasping, and manipulating. It gives the ability to hold onto what one creates.",
        favorable: "Handicrafts, learning new skills, healing, magic, trade, and activities requiring dexterity.",
        unfavorable: "Long-term planning, relaxation, and activities requiring brute strength rather than finesse.",
        strengths: "Skillful, intelligent, adaptable, humorous, healing, and great with their hands.",
        shadow: "Manipulative, over-anxious, grasping, trickery, and struggles with letting go.",
        career: "Craftsmanship, massage therapy, surgery, astrology, illusion/magic, writing, and accounting.",
        padas: [
            { id: 1, navamsa: "Aries", desc: "Quick-handed, entrepreneurial, initiates projects with speed." },
            { id: 2, navamsa: "Taurus", desc: "Skilled in creating material beauty, arts, and crafts." },
            { id: 3, navamsa: "Gemini", desc: "Highly communicative, skilled in writing, negotiation, and wit." },
            { id: 4, navamsa: "Cancer", desc: "Healing hands, nurturing, skilled in domestic arts or counseling." }
        ]
    },
    {
        name: "Chitra", symbol: "Pearl / Bright Jewel", deity: "Vishvakarma (Celestial Architect)", animal: "Female Tiger", nature: "Mridu (Tender)", rulingPlanet: "Mars", element: "Fire / Pitta",
        description: "Chitra means 'the bright one'. It is the star of aesthetics, structure, and form, representing the magical ability to create beauty out of thin air.",
        favorable: "Architecture, interior design, creative arts, buying clothes/jewelry, and spiritual practices.",
        unfavorable: "Confrontation, dealing with aggressive people, and investigating things.",
        strengths: "Creative, artistic, elegant, charismatic, excellent spatial awareness, and deeply spiritual.",
        shadow: "Superficial, egotistical, overly concerned with appearances, and perfectionist to a fault.",
        career: "Architecture, design, fashion, jewelry, arts, photography, engineering, and visual media.",
        padas: [
            { id: 1, navamsa: "Leo", desc: "Takes immense pride in creation, seeks recognition for aesthetics." },
            { id: 2, navamsa: "Virgo", desc: "Meticulous design, perfectionist architect, fine detail work." },
            { id: 3, navamsa: "Libra", desc: "Focuses on balancing beauty and relationships, highly social." },
            { id: 4, navamsa: "Scorpio", desc: "Creates transformative art, attracted to the mysterious and profound." }
        ]
    },
    {
        name: "Swati", symbol: "Sword / Priest / Sprout", deity: "Vayu (Wind God)", animal: "Male Buffalo", nature: "Chara (Movable)", rulingPlanet: "Rahu", element: "Fire / Kapha",
        description: "Swati represents the wind—it goes where it pleases. It implies independence, flexibility, and a delicate, wandering nature.",
        favorable: "Travel, buying/selling, education, social events, financial transactions, and planting seeds.",
        unfavorable: "Confrontation, making rigid long-term plans, and dealing with aggressive situations.",
        strengths: "Independent, adaptable, polite, communicative, business-minded, and a good survivor.",
        shadow: "Restless, fickle, indecisive, prone to debt, and struggles with commitment.",
        career: "Trade, commerce, travel industry, aviation, diplomacy, software/technology, and independent business.",
        padas: [
            { id: 1, navamsa: "Sagittarius", desc: "Wanders philosophically, seeking broad knowledge and truth." },
            { id: 2, navamsa: "Capricorn", desc: "Practical independence, focuses on building a secure business structure." },
            { id: 3, navamsa: "Aquarius", desc: "Networks widely, spreads information, independent thinker." },
            { id: 4, navamsa: "Pisces", desc: "Spiritual wanderer, compassionate, flexible, and deeply intuitive." }
        ]
    },
    {
        name: "Vishakha", symbol: "Decorated Archway / Potter's Wheel", deity: "Indragni (Gods of Lightning & Fire)", animal: "Male Tiger", nature: "Mishra (Mixed)", rulingPlanet: "Jupiter", element: "Earth / Kapha",
        description: "Vishakha is the star of purpose. It represents a single-minded focus on a goal, often achieved through patience, determination, and sometimes rivalry.",
        favorable: "Goal-setting, executing difficult tasks, leadership roles, resolving disputes forcefully, and achieving success after struggle.",
        unfavorable: "Diplomacy, relaxation, marriage, and activities requiring gentle persuasion.",
        strengths: "Determined, ambitious, focused, capable, achieves goals against odds.",
        shadow: "Envious, overly competitive, frustrated, ruthless in pursuit of goals, and struggles to enjoy success.",
        career: "Politics, leadership, military, sports, researchers, dictators, and any field requiring extreme focus.",
        padas: [
            { id: 1, navamsa: "Aries", desc: "Fierce focus on self-interest, highly ambitious and pioneering." },
            { id: 2, navamsa: "Taurus", desc: "Focuses on accumulating wealth and sensual stability." },
            { id: 3, navamsa: "Gemini", desc: "Intellectual focus, ambitious in communication and ideas." },
            { id: 4, navamsa: "Cancer", desc: "Emotional focus, fiercely protective of home and family roots." }
        ]
    },
    {
        name: "Anuradha", symbol: "Lotus / Triumphal Archway", deity: "Mitra (God of Friendship)", animal: "Female Deer", nature: "Mridu (Tender)", rulingPlanet: "Saturn", element: "Earth / Pitta",
        description: "Anuradha translates to 'following Radha' (devotion). It is the star of success, friendship, and spiritual devotion, blooming despite difficult circumstances like a lotus in mud.",
        favorable: "Networking, group activities, travel, research, occult studies, and spiritual pursuits.",
        unfavorable: "Confrontation, ending relationships, and harsh actions.",
        strengths: "Friendly, devoted, successful, capable of deep research, spiritual, and travels widely.",
        shadow: "Prone to jealousy, controlling, rigid, and melancholy.",
        career: "Diplomacy, human resources, travel, occult sciences, event planning, and group organizations.",
        padas: [
            { id: 1, navamsa: "Leo", desc: "Confident devotion, a proud leader within social groups." },
            { id: 2, navamsa: "Virgo", desc: "Practical friendship, serves groups through meticulous organization." },
            { id: 3, navamsa: "Libra", desc: "Highly balanced in partnerships, excellent at diplomatic networking." },
            { id: 4, navamsa: "Scorpio", desc: "Intense, transformative devotion, deeply connected to the occult." }
        ]
    },
    {
        name: "Jyeshtha", symbol: "Circular Talisman / Umbrella", deity: "Indra (King of Gods)", animal: "Male Deer", nature: "Tikshna (Sharp)", rulingPlanet: "Mercury", element: "Earth / Vata",
        description: "Jyeshtha is the 'eldest' or most senior. It deals with authority, taking on burdens, experiencing betrayals, and ultimately achieving profound wisdom and power.",
        favorable: "Taking charge, harsh actions, confronting enemies, dealing with authority, and profound research.",
        unfavorable: "Borrowing money, relaxing, marriage, and frivolous activities.",
        strengths: "Protective, authoritative, capable, intelligent, resilient, and insightful.",
        shadow: "Arrogant, deceitful, prone to anger, lonely at the top, and plagued by insecurities.",
        career: "Management, military, politics, law enforcement, journalism, and secret services.",
        padas: [
            { id: 1, navamsa: "Sagittarius", desc: "Authoritative in philosophy or religion, seeks righteous leadership." },
            { id: 2, navamsa: "Capricorn", desc: "Practical authority, masters the material world through discipline." },
            { id: 3, navamsa: "Aquarius", desc: "Leads groups and networks, intellectual authority in society." },
            { id: 4, navamsa: "Pisces", desc: "Spiritual maturity, intuitive leadership, sacrifices self for others." }
        ]
    },
    {
        name: "Mula", symbol: "Tied Bunch of Roots", deity: "Nirriti (Goddess of Destruction)", animal: "Male Dog", nature: "Tikshna (Sharp)", rulingPlanet: "Ketu", element: "Air / Vata",
        description: "Mula represents 'the root'. It signifies getting to the bottom of things, destroying the old to plant the new, and undergoing immense spiritual transformation.",
        favorable: "Research, tearing down old structures, dealing with roots/herbs, ending relationships, and intense spiritual practice.",
        unfavorable: "Marriage, lending/borrowing money, travel, and beginning auspicious projects.",
        strengths: "Inquisitive, deeply philosophical, resilient, seeks fundamental truths, and spiritually powerful.",
        shadow: "Self-destructive, cruel, manipulative, cynical, and struggles with material reality.",
        career: "Research, investigative journalism, pharmacology, surgery, healing (roots), and metaphysics.",
        padas: [
            { id: 1, navamsa: "Aries", desc: "Aggressively seeks truths, pioneering in destruction and rebirth." },
            { id: 2, navamsa: "Taurus", desc: "Stabilizes after destruction, roots deeply into material or sensual reality." },
            { id: 3, navamsa: "Gemini", desc: "Communicates profound truths, intellectual investigation of roots." },
            { id: 4, navamsa: "Cancer", desc: "Emotional unrooting, deep psychological probing, highly intuitive." }
        ]
    },
    {
        name: "Purva Ashadha", symbol: "Winnowing Basket / Elephant Tusk", deity: "Apas (Water Goddess)", animal: "Male Monkey", nature: "Ugra (Fierce)", rulingPlanet: "Venus", element: "Air / Pitta",
        description: "Purva Ashadha means 'the early invincible one'. It grants the power to conquer and represents absolute conviction, enthusiasm, and a strong connection to water.",
        favorable: "Debates, confronting challenges, courage, dealing with water, artistic pursuits, and traveling.",
        unfavorable: "Diplomacy, relaxation, admitting defeat, and routine tasks.",
        strengths: "Invincible spirit, confident, enthusiastic, artistic, independent, and philosophical.",
        shadow: "Stubborn, argumentative, overconfident, dictatorial, and struggles with compromise.",
        career: "Politics, debate/law, naval professions, motivational speaking, travel industry, and the arts.",
        padas: [
            { id: 1, navamsa: "Leo", desc: "Proud and invincible, strong desire for creative leadership." },
            { id: 2, navamsa: "Virgo", desc: "Invincible through practical logic and meticulous planning." },
            { id: 3, navamsa: "Libra", desc: "Conquers through social charm, partnerships, and balanced negotiation." },
            { id: 4, navamsa: "Scorpio", desc: "Intense, transformative power, unconquerable emotional depth." }
        ]
    },
    {
        name: "Uttara Ashadha", symbol: "Elephant Tusk / Small Cot", deity: "Vishwadevas (Universal Gods)", animal: "Male Mongoose", nature: "Dhruva (Fixed)", rulingPlanet: "Sun", element: "Air / Kapha",
        description: "Uttara Ashadha is the 'latter invincible one'. It represents permanent victory achieved through discipline, commitment, righteous action, and universal alliances.",
        favorable: "Beginning new projects, signing contracts, marriage, political activities, spiritual initiations, and forming alliances.",
        unfavorable: "Illegal activities, unethical behavior, breaking promises, and quick/reckless actions.",
        strengths: "Righteous, disciplined, leader, honorable, widely respected, and achieves lasting success.",
        shadow: "Overly rigid, serious, self-righteous, lacks flexibility, and can become isolated by duty.",
        career: "Politics, government roles, leadership, judges, priests, counselors, and executives.",
        padas: [
            { id: 1, navamsa: "Sagittarius", desc: "Righteous philosopher, invincible through truth and wide vision." },
            { id: 2, navamsa: "Capricorn", desc: "Ultimate practical authority, disciplined execution of duty." },
            { id: 3, navamsa: "Aquarius", desc: "Leads societal change, forms broad humanitarian alliances." },
            { id: 4, navamsa: "Pisces", desc: "Spiritual victory, compassionate leadership, sacrifices for the whole." }
        ]
    },
    {
        name: "Shravana", symbol: "Ear / Three Footprints", deity: "Vishnu (The Preserver)", animal: "Female Monkey", nature: "Chara (Movable)", rulingPlanet: "Moon", element: "Air / Kapha",
        description: "Shravana means 'to hear'. It is the star of listening, learning, preservation, and transmitting wisdom. It connects the mind with the divine word (Aum).",
        favorable: "Learning, reading, traveling, spiritual practices, counseling, making investments, and communication.",
        unfavorable: "Aggressive actions, ignoring advice, lawsuits, and starting long-term projects impulsively.",
        strengths: "Excellent listener, learned, wise, compassionate, communicative, and spiritually profound.",
        shadow: "Gossip, overly sensitive, restless, easily influenced by others' words, and struggles with ego.",
        career: "Teaching, counseling, linguistics, music/audio, astrology, religious professions, and academia.",
        padas: [
            { id: 1, navamsa: "Aries", desc: "Initiates learning, enthusiastic listener, acts quickly on knowledge." },
            { id: 2, navamsa: "Taurus", desc: "Stabilizes knowledge, preserves traditional wealth and art." },
            { id: 3, navamsa: "Gemini", desc: "Highly communicative, translates information, excellent networker." },
            { id: 4, navamsa: "Cancer", desc: "Emotional listening, deeply intuitive, offers profound counseling." }
        ]
    },
    {
        name: "Dhanishta", symbol: "Drum / Flute", deity: "Ashta Vasus (Gods of Material Wealth)", animal: "Female Lion", nature: "Chara (Movable)", rulingPlanet: "Mars", element: "Ether / Pitta",
        description: "Dhanishta is the star of symphony and wealth. It means 'the most prosperous'. It brings fame, organization, musical ability, and immense material abundance.",
        favorable: "Music, group activities, buying property, ceremonies, travel, and financial planning.",
        unfavorable: "Relaxation, quiet/solitary activities, settling disputes, and giving up.",
        strengths: "Charismatic, organized, wealthy, musical, brave, resilient, and a natural leader.",
        shadow: "Materialistic, aggressive, impatient, insensitive to others' feelings, and egotistical.",
        career: "Music, real estate, event management, military, doctors, finance, and group leadership.",
        padas: [
            { id: 1, navamsa: "Leo", desc: "Takes center stage, dramatic, highly ambitious for wealth and fame." },
            { id: 2, navamsa: "Virgo", desc: "Organizes wealth, practical discipline, excellent in details." },
            { id: 3, navamsa: "Libra", desc: "Balances group dynamics, social, seeks harmony in abundance." },
            { id: 4, navamsa: "Scorpio", desc: "Intense, transformative power, understands hidden aspects of wealth." }
        ]
    },
    {
        name: "Shatabhisha", symbol: "Empty Circle / 100 Physicians", deity: "Varuna (God of Cosmic Waters)", animal: "Female Horse", nature: "Chara (Movable)", rulingPlanet: "Rahu", element: "Ether / Vata",
        description: "Shatabhisha represents healing, secrecy, and the boundaries of the universe. It translates to '100 physicians', giving profound healing abilities and a secretive nature.",
        favorable: "Healing/medical treatments, astrology, researching advanced subjects, sea travel, and meditation.",
        unfavorable: "Marriage, socializing, revealing secrets, and starting mundane tasks.",
        strengths: "Independent, deeply intellectual, healing, perceptive, truth-seeking, and mystical.",
        shadow: "Secretive, isolated, stubborn, pessimistic, depressed, and harsh in speech.",
        career: "Medicine/healing, astrology, astronomy, aviation, psychology, and dealing with secrets/espionage.",
        padas: [
            { id: 1, navamsa: "Sagittarius", desc: "Philosophical healer, seeks truth across vast cosmic distances." },
            { id: 2, navamsa: "Capricorn", desc: "Practical application of esoteric knowledge, structured healing." },
            { id: 3, navamsa: "Aquarius", desc: "Innovative networking, futuristic ideas, social reform." },
            { id: 4, navamsa: "Pisces", desc: "Deepest spiritual healing, dissolves boundaries, profound intuition." }
        ]
    },
    {
        name: "Purva Bhadrapada", symbol: "Front Legs of a Funeral Cot / Sword", deity: "Aja Ekapada (One-Footed Goat/Storm God)", animal: "Male Lion", nature: "Ugra (Fierce)", rulingPlanet: "Jupiter", element: "Ether / Vata",
        description: "Purva Bhadrapada is a star of intense transformation through fire and penance. It involves tearing down old paradigms, purification, and experiencing the dark side of life.",
        favorable: "Ending things, harsh actions, spiritual austerities, research into death/occult, and dealing with enemies.",
        unfavorable: "Marriage, travel, starting a business, or any peaceful/auspicious activity.",
        strengths: "Intelligent, passionate, spiritually devoted, disciplined in austerities, and visionary.",
        shadow: "Cruel, self-destructive, cynical, fearful, anxious, and drawn to darkness/macabre.",
        career: "Astrology, mortuary work, asceticism, radical politics, psychology, and dealing with endings.",
        padas: [
            { id: 1, navamsa: "Aries", desc: "Aggressively burns away impurities, pioneering spiritual warrior." },
            { id: 2, navamsa: "Taurus", desc: "Grounds the transformative energy, finds stability amidst chaos." },
            { id: 3, navamsa: "Gemini", desc: "Communicates radical ideas, intellectually breaks down old structures." },
            { id: 4, navamsa: "Cancer", desc: "Emotional purification, deep psychological sensitivity, fearsome protectiveness." }
        ]
    },
    {
        name: "Uttara Bhadrapada", symbol: "Back Legs of a Funeral Cot / Snake in Water", deity: "Ahir Budhyana (Serpent of the Depths)", animal: "Female Cow", nature: "Dhruva (Fixed)", rulingPlanet: "Saturn", element: "Ether / Pitta",
        description: "Uttara Bhadrapada represents the deep, still waters of consciousness. It signifies ultimate wisdom, spiritual depth, compassion, and the tranquility that follows a storm.",
        favorable: "Meditation, yoga, marriage, construction, long-term investments, and philanthropy.",
        unfavorable: "Quick actions, arguments, litigation, and resolving minor disputes.",
        strengths: "Wise, compassionate, generous, patient, spiritually profoundly deep, and a great counselor.",
        shadow: "Lazy, emotionally withdrawn, slow to act, prone to escapism, and isolated.",
        career: "Counseling, philosophy, yoga/meditation, charity, caregiving, researchers, and writers.",
        padas: [
            { id: 1, navamsa: "Sagittarius", desc: "Broad spiritual vision, wise philosopher, seeks ultimate truth." },
            { id: 2, navamsa: "Capricorn", desc: "Practical wisdom, disciplines the spiritual path, builds lasting foundations." },
            { id: 3, navamsa: "Aquarius", desc: "Humanitarian focus, connects with networks, radical compassion." },
            { id: 4, navamsa: "Pisces", desc: "The ultimate spiritual dissolution, complete merging with the divine." }
        ]
    },
    {
        name: "Revati", symbol: "Fish / Drum", deity: "Pushan (Nurturer/Protector of Flocks)", animal: "Female Elephant", nature: "Mridu (Tender)", rulingPlanet: "Mercury", element: "Ether / Kapha",
        description: "Revati means 'the wealthy one'. It is the final star, representing the end of the journey, ultimate nourishment, safe travel, and final spiritual liberation.",
        favorable: "Starting a journey, marriage, buying clothes, spiritual initiation, resolving disputes, and artistic work.",
        unfavorable: "Harsh actions, warfare, overcoming obstacles forcefully, and menial labor.",
        strengths: "Compassionate, wealthy, deeply spiritual, protective of the weak, creative, and intuitive.",
        shadow: "Overly sensitive, impractical, lacking boundaries, easily victimized, and suffers from childhood trauma.",
        career: "Orphanages, animal care, travel industry, creative arts, counseling, and spiritual guides.",
        padas: [
            { id: 1, navamsa: "Sagittarius", desc: "Optimistic end to the journey, seeks spiritual philosophy." },
            { id: 2, navamsa: "Capricorn", desc: "Practical nourishment, structures resources for the journey's end." },
            { id: 3, navamsa: "Aquarius", desc: "Humanitarian networks, cares for the collective flock." },
            { id: 4, navamsa: "Pisces", desc: "Ultimate dissolution, total spiritual surrender, unbounded compassion." }
        ]
    }
];


export const getLahiriAyanamsha = (date) => {
    const tJ2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
    const daysSinceJ2000 = (date.getTime() - tJ2000) / (1000 * 60 * 60 * 24);
    return 23.8564 + (daysSinceJ2000 * 0.000038246);
};

export const getCurrentTransitNakshatra = () => {
    try {
        const now = new Date();

        const lat = 23.0225; // Default reference (Ahmedabad) or we could require user input later
        const lng = 72.5714;


        const origin = new Origin({
            year: now.getUTCFullYear(),
            month: now.getUTCMonth(),
            date: now.getUTCDate(),
            hour: now.getUTCHours(),
            minute: now.getUTCMinutes(),
            latitude: lat,
            longitude: lng,
            timeZone: 0
        });

        // "placidus" needed by lib, we calculate tropical and subtract Lahiri for true Indian Vedic sidereal
        const horoscope = new Horoscope({
            origin,
            houseSystem: "placidus",
            zodiac: "tropical",
            aspectPoints: ["bodies"],
            aspectWithPoints: ["bodies"],
            aspectTypes: ["major"],
            customOrbs: {},
            language: "en"
        });

        const ayanamsha = getLahiriAyanamsha(now);
        const tropicalMoon = horoscope.CelestialBodies.moon.ChartPosition.Ecliptic.DecimalDegrees;
        let moonLong = tropicalMoon - ayanamsha;
        if (moonLong < 0) moonLong += 360;

        const NAKSHATRA_ARC = 13.33333333;
        const PADA_ARC = 3.33333333;

        const nakshatraIndex = Math.floor(moonLong / NAKSHATRA_ARC);
        const remainderDeg = moonLong % NAKSHATRA_ARC;
        const padaNumber = Math.floor(remainderDeg / PADA_ARC) + 1;

        let completionPercent = (remainderDeg / NAKSHATRA_ARC) * 100;
        completionPercent = Math.min(100, Math.max(0, completionPercent));

        const data = NAKSHATRA_DATA[nakshatraIndex];

        return {
            index: nakshatraIndex,
            name: data.name,
            pada: padaNumber,
            percentComplete: Math.round(completionPercent),
            details: data
        };

    } catch (err) {
        console.error("Failed to calculate live transit nakshatra:", err);
        return null;
    }
};
