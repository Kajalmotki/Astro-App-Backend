# PWA (Progressive Web App) Setup for AstroRevo

## Overview
AstroRevo is now configured as a Progressive Web App (PWA), allowing users to install it on their mobile devices and use it like a native app.

## What's Been Implemented

### 1. **Web App Manifest** (`public/manifest.json`)
- Defines app metadata (name, colors, icons)
- Sets display mode to "standalone" for native-like experience
- Configures dark theme colors matching AstroRevo branding

### 2. **Service Worker** (`public/service-worker.js`)
- Enables offline functionality
- Caches essential resources for faster loading
- Required for PWA installation

### 3. **Install Prompt Component** (`src/components/InstallPrompt.jsx`)
- Custom installation prompt with premium AstroRevo styling
- Shows after 3 seconds on first visit
- Can be dismissed and won't show again for 24 hours
- Automatically detects if app is already installed

### 4. **PWA Meta Tags** (`index.html`)
- Theme color for browser chrome
- Apple-specific meta tags for iOS devices
- Manifest link

## How It Works

### For Users:
1. **Visit the website** on a mobile browser (Chrome, Safari, Edge, etc.)
2. **Wait 3 seconds** - A custom install prompt will appear
3. **Click "Install App"** - The browser's native install dialog will show
4. **Confirm installation** - App icon appears on home screen
5. **Launch like a native app** - Opens in standalone mode without browser UI

### Browser Requirements:
- **Chrome/Edge (Android)**: Full support, shows install banner automatically
- **Safari (iOS)**: Requires manual "Add to Home Screen" from share menu
- **Firefox**: Limited PWA support
- **Desktop Chrome/Edge**: Also supports installation

## Installation Criteria

The browser will only offer installation when:
✅ Web app manifest is present
✅ Service worker is registered
✅ Site is served over HTTPS (or localhost for development)
✅ App has valid icons

## Testing PWA Installation

### On Mobile (Chrome/Android):
1. Open `http://your-ip:5173` on your phone
2. Wait for the custom prompt or look for browser's install banner
3. Tap "Install" and confirm

### On Mobile (Safari/iOS):
1. Open the site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm

### On Desktop (Chrome):
1. Open the site in Chrome
2. Look for the install icon in the address bar (⊕)
3. Click and confirm installation

## App Icons

**TODO**: Replace placeholder icons with actual AstroRevo branded icons.

Required icon sizes:
- `public/icon-192.png` - 192x192px (minimum for PWA)
- `public/icon-512.png` - 512x512px (recommended for splash screens)

Icon design should:
- Use AstroRevo's cosmic/mystical aesthetic
- Feature deep purple and gold gradient
- Include zodiac or celestial symbols
- Be square with transparent or dark background

## Offline Functionality

The service worker caches:
- Main HTML file
- CSS and JavaScript bundles
- Essential assets

Users can:
- Load the app without internet connection
- View cached content
- See offline indicator if needed

## Customization

### Change Install Prompt Timing:
Edit `src/components/InstallPrompt.jsx`, line 23:
```javascript
setTimeout(() => {
  setShowPrompt(true);
}, 3000); // Change delay in milliseconds
```

### Change Dismissal Duration:
Edit `src/components/InstallPrompt.jsx`, line 68:
```javascript
if (hoursSinceDismissed < 24) { // Change hours
```

### Update App Colors:
Edit `public/manifest.json`:
```json
"background_color": "#0a0a0f",  // App background
"theme_color": "#1a1a2e",       // Browser chrome color
```

## Production Deployment

When deploying to production:
1. ✅ Ensure HTTPS is enabled
2. ✅ Generate proper app icons (192x192, 512x512)
3. ✅ Test installation on multiple devices
4. ✅ Update service worker cache version when deploying updates
5. ✅ Consider adding push notification support

## Updating the Service Worker

When you make changes to your app, update the cache version in `public/service-worker.js`:

```javascript
const CACHE_NAME = 'astrorevo-v2'; // Increment version
```

This ensures users get the latest version of your app.

## Browser DevTools Testing

### Chrome DevTools:
1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Manifest" - Should show all manifest details
4. Check "Service Workers" - Should show registered worker
5. Use "Lighthouse" tab - Run PWA audit

## Features Enabled

✅ Install to home screen
✅ Standalone app mode (no browser UI)
✅ Offline functionality
✅ Fast loading with caching
✅ Custom install prompt
✅ iOS support
✅ Android support
✅ Desktop support

## Next Steps (Optional Enhancements)

- [ ] Add push notifications
- [ ] Implement background sync
- [ ] Add app shortcuts (quick actions)
- [ ] Create app screenshots for manifest
- [ ] Add update notification when new version available
- [ ] Implement advanced caching strategies
- [ ] Add offline fallback page

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [Chrome: Install Criteria](https://web.dev/install-criteria/)
