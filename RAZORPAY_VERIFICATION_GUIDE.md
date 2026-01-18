# Razorpay Payment Verification Guide

## Current Implementation

The app currently:
1. ✅ Shows membership modal after signup
2. ✅ Displays Razorpay payment button
3. ✅ Checks membership status from Firestore
4. ⚠️ **Needs webhook setup for automatic verification**

## Payment Verification Methods

### Method 1: Razorpay Webhooks (Recommended - Automatic)

#### Step 1: Create a Webhook Endpoint

You need a backend server to receive webhook notifications from Razorpay. Here are your options:

**Option A: Firebase Cloud Functions (Recommended)**

Create a Cloud Function to handle Razorpay webhooks:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();

exports.razorpayWebhook = functions.https.onRequest(async (req, res) => {
    const webhookSecret = 'YOUR_RAZORPAY_WEBHOOK_SECRET';
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify webhook signature
    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');
    
    if (signature !== expectedSignature) {
        return res.status(400).send('Invalid signature');
    }
    
    const event = req.body.event;
    const payment = req.body.payload.payment.entity;
    
    // Handle successful payment
    if (event === 'payment.captured') {
        const userId = payment.notes.userId; // You need to pass this in payment button
        
        await admin.firestore().collection('users').doc(userId).set({
            membership: {
                status: 'active',
                paymentId: payment.id,
                amount: payment.amount / 100,
                currency: payment.currency,
                purchasedAt: new Date().toISOString(),
                expiresAt: null, // Lifetime or calculate expiry
            },
            updatedAt: new Date().toISOString()
        }, { merge: true });
        
        console.log(`Membership activated for user: ${userId}`);
    }
    
    res.status(200).send('OK');
});
```

**Option B: Simple Node.js Server**

```javascript
// server.js
const express = require('express');
const crypto = require('crypto');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

admin.initializeApp({
    credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

app.post('/razorpay-webhook', async (req, res) => {
    const webhookSecret = 'YOUR_RAZORPAY_WEBHOOK_SECRET';
    const signature = req.headers['x-razorpay-signature'];
    
    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');
    
    if (signature !== expectedSignature) {
        return res.status(400).send('Invalid signature');
    }
    
    const event = req.body.event;
    const payment = req.body.payload.payment.entity;
    
    if (event === 'payment.captured') {
        const userId = payment.notes.userId;
        
        await admin.firestore().collection('users').doc(userId).set({
            membership: {
                status: 'active',
                paymentId: payment.id,
                amount: payment.amount / 100,
                currency: payment.currency,
                purchasedAt: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString()
        }, { merge: true });
    }
    
    res.status(200).send('OK');
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));
```

#### Step 2: Configure Razorpay Dashboard

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add your webhook URL:
   - Firebase: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/razorpayWebhook`
   - Server: `https://your-domain.com/razorpay-webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy the webhook secret and add to your code

#### Step 3: Pass User ID in Payment Button

You need to modify the payment button to include user ID. Update your Razorpay payment button settings in the dashboard to include custom notes/metadata.

---

### Method 2: Manual Verification (Simple - For Testing)

For now, you can manually verify payments:

1. User pays via Razorpay button
2. You check Razorpay Dashboard for successful payments
3. You manually activate membership using Firebase Console or a simple admin panel

---

### Method 3: Client-Side Callback (Less Secure)

You can add a callback URL in your Razorpay payment button settings that redirects users after payment, then verify on your backend.

---

## Current Membership Check Implementation

The app already checks membership status:

```javascript
// In MembershipModal.jsx
const status = await checkMembershipStatus(user.uid);
```

This function reads from Firestore:
```javascript
// In razorpayService.js
export const checkMembershipStatus = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
        return userDoc.data().membership?.status === 'active';
    }
    return false;
};
```

## Firestore Security Rules

Add these rules to protect membership data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Users can update their profile but NOT membership status
      allow update: if request.auth != null 
                    && request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['membership']);
      
      // Only server (via webhook) can update membership
      allow write: if false; // Prevent direct writes, use Cloud Functions
    }
  }
}
```

## Recommended Setup for Production

1. **Deploy Firebase Cloud Function** for webhook handling
2. **Configure Razorpay webhook** to point to your function
3. **Add user ID to payment button** metadata
4. **Test with Razorpay test mode** before going live
5. **Monitor webhook logs** in Firebase Console

## For Quick Testing (Development Only)

You can manually activate membership for testing:

```javascript
// In browser console (logged in as user)
import { activateMembership } from './services/razorpayService';
await activateMembership(user.uid, { paymentId: 'test_payment_123' });
```

Or use Firebase Console:
1. Go to Firestore Database
2. Find your user document
3. Add field: `membership.status = "active"`
4. Refresh your app

---

## Next Steps

1. Choose verification method (webhooks recommended)
2. Set up backend endpoint
3. Configure Razorpay dashboard
4. Test with test payments
5. Go live!

Would you like me to help you set up Firebase Cloud Functions for automatic verification?
