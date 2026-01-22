import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                {/* Brand Section */}
                <div className="footer-brand">
                    <Link to="/" className="footer-logo gold-text">AstroRevo</Link>

                    <div className="mobile-apps">
                        <h3>AstroRevo Mobile Apps</h3>
                        <div className="app-badges">
                            <a href="#" className="app-badge">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
                            </a>
                            <a href="#" className="app-badge">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" />
                            </a>
                        </div>
                    </div>

                    <div className="social-links">
                        <h3>Follow us on</h3>
                        <div className="social-icons">
                            <a href="#" className="social-icon facebook">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V1.85c-.33-.04-1.46-.15-2.78-.15-2.75 0-4.72 1.67-4.72 4.85v2.8H7v4h3V22h4v-8.5z" />
                                </svg>
                            </a>
                            <a href="#" className="social-icon youtube">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M23.5 6.2c-.27-1.01-1.06-1.81-2.07-2.08C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.43.62c-1.01.27-1.8.1.07-2.08-.27C.5 6.2.5 12 .5 12s0 5.8.62 7.68c.27 1.01 1.06 1.81 2.07 2.08C5.03 22.38 12 22.38 12 22.38s7.6 0 9.43-.62c1.01-.27 1.81-1.07 2.08-2.08.62-1.88.62-7.68.62-7.68s0-5.8-.62-7.8zM9.75 15.02V8.98L15.2 12l-5.45 3.02z" />
                                </svg>
                            </a>
                            <a href="#" className="social-icon instagram">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" className="social-icon twitter">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                            <a href="#" className="social-icon linkedin">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Links Section */}
                <div className="footer-links">
                    <div className="footer-column">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/chat">Chat with Astrologer</Link></li>
                            <li><Link to="/consultation">Call Astrologer</Link></li>
                            <li><Link to="/kundli">Free Janam Kundli</Link></li>
                            <li><Link to="/horoscope">Daily Horoscope</Link></li>
                            <li><Link to="/panchang">Today's Panchang</Link></li>
                            <li><Link to="/matchmaking">Marriage Matching</Link></li>
                            <li><Link to="/knowledge">Vedic Knowledge</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Useful Links</h3>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/registration">Astrologer Registration</Link></li>
                            <li><Link to="/partner">Partner With Us</Link></li>
                            <li><Link to="/career">Careers</Link></li>
                            <li><Link to="/sitemap">Site Map</Link></li>
                            <li><Link to="/refund">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="copyright">
                    © {new Date().getFullYear()} AstroRevo Private Ltd. All rights reserved.
                </div>
                <div className="legal-links">
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/faq">FAQs</Link>
                    <Link to="/terms">Terms & Conditions</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
