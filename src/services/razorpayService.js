import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const loadRazorpayButton = (containerId) => {
    // Remove any existing script
    const existingScript = document.querySelector('script[data-payment_button_id]');
    if (existingScript) {
        existingScript.remove();
    }

    // Create and append the Razorpay payment button script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', 'pl_S5KX1tjut1BoNu');
    script.async = true;

    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = ''; // Clear container
        const form = document.createElement('form');
        form.appendChild(script);
        container.appendChild(form);
    }
};

export const checkMembershipStatus = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const data = userDoc.data();
            return data.membership?.status === 'active';
        }
        return false;
    } catch (error) {
        console.error('Error checking membership:', error);
        return false;
    }
};

// Function to manually mark user as premium (call this after payment confirmation)
export const activateMembership = async (userId, paymentDetails = {}) => {
    try {
        await setDoc(doc(db, 'users', userId), {
            membership: {
                status: 'active',
                paymentId: paymentDetails.paymentId || 'razorpay_payment',
                amount: 999,
                currency: 'INR',
                purchasedAt: new Date().toISOString(),
                expiresAt: null, // Lifetime membership
            },
            updatedAt: new Date().toISOString()
        }, { merge: true });

        return true;
    } catch (error) {
        console.error('Error activating membership:', error);
        return false;
    }
};
