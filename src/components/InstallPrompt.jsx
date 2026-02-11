import React, { useState, useEffect } from 'react';
import './InstallPrompt.css';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Show the custom install prompt after a delay
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000); // Show after 3 seconds
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
            console.log('PWA was installed');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User response to the install prompt: ${outcome}`);

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Show again after 24 hours
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    };

    // Don't show if already installed or dismissed recently
    useEffect(() => {
        const dismissed = localStorage.getItem('installPromptDismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed);
            const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
            if (hoursSinceDismissed < 24) {
                setShowPrompt(false);
            }
        }
    }, []);

    if (isInstalled || !showPrompt || !deferredPrompt) {
        return null;
    }

    return (
        <div className="install-prompt-overlay">
            <div className="install-prompt">
                <button className="install-prompt-close" onClick={handleDismiss}>
                    ✕
                </button>

                <div className="install-prompt-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h3>Install AstroRevo</h3>
                <p>Get quick access to your cosmic insights. Install AstroRevo on your device for a native app experience.</p>

                <div className="install-prompt-benefits">
                    <div className="benefit">
                        <span className="benefit-icon">⚡</span>
                        <span>Instant access</span>
                    </div>
                    <div className="benefit">
                        <span className="benefit-icon">📱</span>
                        <span>Works offline</span>
                    </div>
                    <div className="benefit">
                        <span className="benefit-icon">🔔</span>
                        <span>Push notifications</span>
                    </div>
                </div>

                <button className="install-prompt-button" onClick={handleInstallClick}>
                    Install App
                </button>

                <button className="install-prompt-later" onClick={handleDismiss}>
                    Maybe Later
                </button>
            </div>
        </div>
    );
};

export default InstallPrompt;
