import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthModal';
import BirthDetailsForm from './BirthDetailsForm';
import { saveBirthDataToFirestore } from '../services/aiService';

const UserOnboarding = () => {
    const { user } = useAuth();
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserStatus = async () => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        // Check if all required fields exist
                        if (!data.birthdate || !data.birthtime || !data.birthplace) {
                            setNeedsOnboarding(true);
                        } else {
                            setNeedsOnboarding(false);
                            console.log('User data loaded:', data);
                        }
                    } else {
                        // New user, definitely needs onboarding
                        setNeedsOnboarding(true);
                    }
                } catch (error) {
                    console.error('Error checking user status:', error);
                }
            } else {
                setNeedsOnboarding(false);
            }
            setLoading(false);
        };

        checkUserStatus();
    }, [user]);

    const handleOnboardingSubmit = async (data) => {
        try {
            // Transform BirthDetailsForm data to the requested Firestore format
            const birthData = {
                name: data.name,  // Add the name field
                date: `${data.day}/${data.month}/${data.year}`,
                time: `${data.hour}:${data.min}:${data.sec}`,
                place: data.place
            };

            await saveBirthDataToFirestore(user.uid, birthData);
            setNeedsOnboarding(false);
            console.log('Onboarding complete');
        } catch (error) {
            console.error('Error saving onboarding data:', error);
        }
    };

    if (loading || !needsOnboarding) return null;

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-container glass-card animate-float">
                <div className="onboarding-header">
                    <h2 className="gold-text">Complete Your Profile</h2>
                    <p>We need your birth details to generate your precise AstroRevo Chart.</p>
                </div>
                <BirthDetailsForm onSubmit={handleOnboardingSubmit} />
                <button
                    className="skip-btn"
                    onClick={() => setNeedsOnboarding(false)}
                    style={{ marginTop: '10px', opacity: 0.6, fontSize: '0.8rem' }}
                >
                    I'll do this later
                </button>
            </div>
        </div>
    );
};

export default UserOnboarding;
