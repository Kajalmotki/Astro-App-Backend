import React, { useEffect, useRef } from 'react';

const OmRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const particles = [];
        const particleCount = 60; // Increased for better visibility
        const columnCount = 10; // Number of vertical columns

        class Particle {
            constructor() {
                this.init();
            }

            init() {
                // Determine which column this particle belongs to
                this.columnIndex = Math.floor(Math.random() * columnCount);
                const columnSpacing = canvas.width / (columnCount + 1);

                // Start from the bottom
                this.x = (this.columnIndex + 1) * columnSpacing + (Math.random() - 0.5) * 40;
                this.y = canvas.height + (Math.random() * 100);

                // Slower, smoother upward speed
                this.vx = (Math.random() - 0.5) * 0.05; // Very minimal horizontal drift
                this.vy = -(0.3 + Math.random() * 0.4); // Gentle upward speed (NEGATIVE = UP)

                this.size = 10 + Math.random() * 8; // Small size (10px to 18px)
                this.opacity = Math.random() * 0.4 + 0.4; // Brighter opacity
                // No rotation
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Gentle horizontal sway
                this.x += Math.sin(this.y * 0.008) * 0.2;

                // Reset when particle goes above screen
                if (this.y < -50) {
                    this.init();
                }
            }

            draw() {
                ctx.save();

                // Move to particle position (no rotation)
                ctx.translate(this.x, this.y);

                // Enhanced glow for better visibility
                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgba(200, 220, 255, ${this.opacity * 0.8})`;
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.font = `bold ${this.size}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('ॐ', 0, 0);

                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            // Slightly transparent clear for subtle trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.7
            }}
        />
    );
};

export default OmRain;
