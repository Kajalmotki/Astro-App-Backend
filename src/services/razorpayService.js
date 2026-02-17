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

export const IS_TEST_MODE = import.meta.env.VITE_PAYMENT_TEST_MODE === 'true';

export const processDonation = (amount) => {
    return new Promise((resolve, reject) => {
        if (IS_TEST_MODE) {
            console.log('Skipping actual payment in Test Mode');
            resolve({ razorpay_payment_id: 'test_donation_' + Date.now() });
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: amount * 100, // Razorpay works in paise
            currency: "INR",
            name: "AstroRevo",
            description: "Donation for Website Development",
            image: "https://firebasestorage.googleapis.com/v0/b/astrorevo-ff.appspot.com/o/logo.png?alt=media", // Using a fallback or user might have one
            handler: function (response) {
                resolve(response);
            },
            prefill: {
                name: "",
                email: "",
                contact: ""
            },
            theme: {
                color: "#2E8B57"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
            reject(response.error);
        });
        rzp.open();
    });
};

export const processPayment = (amount, description = "AstroRevo Premium Purchase") => {
    return new Promise((resolve, reject) => {
        if (IS_TEST_MODE) {
            console.log('Skipping actual payment in Test Mode');
            resolve({ razorpay_payment_id: 'test_pay_' + Date.now() });
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: amount * 100,
            currency: "INR",
            name: "AstroRevo",
            description: description,
            image: "https://firebasestorage.googleapis.com/v0/b/astrorevo-ff.appspot.com/o/logo.png?alt=media",
            handler: function (response) {
                resolve(response);
            },
            prefill: {
                name: "",
                email: "",
                contact: ""
            },
            theme: {
                color: "#6a0dad"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
            reject(response.error);
        });
        rzp.open();
    });
};

// Alias for backward compatibility if needed, or update calls
export const processCreditPurchase = processPayment;
