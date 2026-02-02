import React, { useEffect, useRef } from 'react';

const StarfieldBackground = () => {
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

        // Star configuration
        const stars = [];
        const starCount = 200; // Reduced for performance
        const maxDepth = 1500;

        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = (Math.random() - 0.5) * canvas.width * 2;
                this.y = (Math.random() - 0.5) * canvas.height * 2;
                this.z = Math.random() * maxDepth;
                this.pz = this.z;
                this.baseSize = Math.random() * 1.5 + 0.5;
                this.twinkleSpeed = Math.random() * 0.02 + 0.01;
                this.twinkleOffset = Math.random() * Math.PI * 2;
            }

            update(speed) {
                this.pz = this.z;
                this.z -= speed;

                if (this.z <= 0) {
                    this.reset();
                    this.z = maxDepth;
                    this.pz = this.z;
                }
            }

            draw(time) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                // Project 3D to 2D
                const sx = (this.x / this.z) * 400 + centerX;
                const sy = (this.y / this.z) * 400 + centerY;

                // Previous position for trail
                const px = (this.x / this.pz) * 400 + centerX;
                const py = (this.y / this.pz) * 400 + centerY;

                // Check if on screen
                if (sx < 0 || sx > canvas.width || sy < 0 || sy > canvas.height) {
                    return;
                }

                // Size based on depth
                const size = (1 - this.z / maxDepth) * 3 + this.baseSize;

                // Twinkling effect
                const twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.3 + 0.7;

                // Brightness based on depth
                const brightness = (1 - this.z / maxDepth) * twinkle;

                // Draw star trail (simple line for performance)
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.strokeStyle = `rgba(200, 220, 255, ${brightness * 0.8})`;
                ctx.lineWidth = size * 0.5;
                ctx.stroke();

                // Draw star core (simple circle)
                ctx.beginPath();
                ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
                ctx.fill();
            }
        }

        // Initialize stars
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }

        const speed = 3; // Star movement speed

        const animate = (time) => {
            // Dark navy blue gradient background
            const bgGradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width * 0.8
            );
            bgGradient.addColorStop(0, '#0d1b2a');
            bgGradient.addColorStop(0.5, '#0a1628');
            bgGradient.addColorStop(1, '#050a12');

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw stars
            stars.forEach(star => {
                star.update(speed);
                star.draw(time);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate(0);

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
                zIndex: -2
            }}
        />
    );
};

export default StarfieldBackground;
