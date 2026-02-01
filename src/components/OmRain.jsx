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
        const particleCount = 800; // Dense enough for vertical lines
        const lineCount = 12; // Number of vertical "paths" or lines

        class Particle {
            constructor() {
                this.init();
            }

            init() {
                // Determine which vertical line this particle belongs to
                this.lineIndex = Math.floor(Math.random() * lineCount);
                const lineSpacing = canvas.width / (lineCount + 1);

                // Start from the bottom (footer area) with slight horizontal jitter within the line
                this.x = (this.lineIndex + 1) * lineSpacing + (Math.random() - 0.5) * 30;
                this.y = canvas.height + Math.random() * 200;

                // Speed is upward (-vy)
                this.vx = (Math.random() - 0.5) * 0.2; // Very stable vertical movement
                this.vy = -(0.5 + Math.random() * 1.5); // Upward speed

                this.size = 6 + Math.random() * 8;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.life = 1;
                this.decay = 0.0005 + Math.random() * 0.001; // Slower decay for long travel
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Simple sine wave for a gentle "drift" while going up
                this.x += Math.sin(this.y * 0.01) * 0.3;

                if (this.y < -50) {
                    this.init();
                }
            }

            draw() {
                // Shining effect
                ctx.shadowBlur = 4;
                ctx.shadowColor = '#32CD32'; // Lime Green glow
                // Dark Bottle Green
                ctx.fillStyle = `rgba(0, 106, 78, ${this.opacity + 0.2})`;
                ctx.font = `${this.size}px serif`;
                ctx.fillText('ॐ', this.x, this.y);
                ctx.shadowBlur = 0;
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

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
                opacity: 0.6
            }}
        />
    );
};

export default OmRain;
