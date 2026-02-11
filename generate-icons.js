// Simple script to create placeholder PWA icons using Canvas
// Run with: node generate-icons.js

const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background gradient (approximated with solid color for simplicity)
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, size, size);

    // Add golden circle
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;

    // Outer golden circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#d4af37';
    ctx.fill();

    // Inner circle (cosmic ring)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.7, 0, 2 * Math.PI);
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = size * 0.02;
    ctx.stroke();

    // Add stars around the circle
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        const starX = centerX + Math.cos(angle) * radius * 0.85;
        const starY = centerY + Math.sin(angle) * radius * 0.85;

        ctx.beginPath();
        ctx.arc(starX, starY, size * 0.015, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Add center symbol
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = size * 0.015;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
    ctx.stroke();

    // Add text
    ctx.fillStyle = '#1a1a2e';
    ctx.font = `bold ${size * 0.12}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AR', centerX, centerY);

    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Created ${filename}`);
}

// Generate both icon sizes
try {
    createIcon(192, 'public/icon-192.png');
    createIcon(512, 'public/icon-512.png');
    console.log('\n✓ All icons generated successfully!');
    console.log('Icons saved to public/ directory');
} catch (error) {
    console.error('Error generating icons:', error.message);
    console.log('\nNote: This script requires the "canvas" package.');
    console.log('If not installed, you can:');
    console.log('1. Open generate-icons.html in your browser and download manually');
    console.log('2. Or use any image editor to create 192x192 and 512x512 PNG icons');
}
