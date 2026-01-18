import React from 'react';

const questions = [
    { id: 1, category: 'Love', icon: '❤️', text: 'When will I meet my soulmate?' },
    { id: 2, category: 'Marriage', icon: '💍', text: 'Is it the right time for marriage?' },
    { id: 3, category: 'Career', icon: '💼', text: 'When will I get my promotion?' },
    { id: 4, category: 'Money', icon: '💰', text: 'Financial stability predictions' },
    { id: 5, category: 'Health', icon: '🏥', text: 'Vitality and wellbeing insights' },
    { id: 6, category: 'Education', icon: '🎓', text: 'Higher studies and success' },
    { id: 7, category: 'Family', icon: '👨‍👩‍👧‍👦', text: 'Family harmony guidance' },
    { id: 8, category: 'Spirit', icon: '🧘', text: 'My soul’s true purpose' },
    { id: 9, category: 'Travel', icon: '✈️', text: 'Foreign settlement chances' },
    { id: 10, category: 'Property', icon: '🏠', text: 'Right time to buy property' },
    { id: 11, category: 'Business', icon: '🚀', text: 'New venture success chances' },
    { id: 12, category: 'Love', icon: '💞', text: 'Will my ex return?' },
    { id: 13, category: 'Career', icon: '🔄', text: 'Is a career change advisable?' },
    { id: 14, category: 'Legal', icon: '⚖️', text: 'Outcome of pending legal matters' },
    { id: 15, category: 'Karma', icon: '🌀', text: 'Past life influences on present' },
    { id: 16, category: 'Finance', icon: '💎', text: 'Investment and stock market' },
    { id: 17, category: 'Enemies', icon: '🛡️', text: 'Overcoming hidden enemies' },
    { id: 18, category: 'Parents', icon: '👴', text: 'Parents health and relationship' },
    { id: 19, category: 'Children', icon: '👶', text: 'Childbirth and progeny' },
    { id: 20, category: 'Lustre', icon: '✨', text: 'Improving personal charisma' },
    { id: 21, category: 'Moksha', icon: '📿', text: 'Spiritual liberation path' }
];

const TopQuestions = ({ onSelect }) => {
    return (
        <div className="questions-grid">
            {questions.map((q) => (
                <button
                    key={q.id}
                    className="question-card glass"
                    onClick={() => onSelect(q)}
                >
                    <span className="q-icon">{q.icon}</span>
                    <div className="q-content">
                        <span className="q-category">{q.category}</span>
                        <p className="q-text">{q.text}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default TopQuestions;
