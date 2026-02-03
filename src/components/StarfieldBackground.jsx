import React, { useEffect, useRef, useState } from 'react';

const StarfieldBackground = () => {
    const canvasRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Smooth, gentle mouse tracking
            setMousePos(prev => ({
                x: prev.x + ((e.clientX / window.innerWidth - 0.5) * 2 - prev.x) * 0.02,
                y: prev.y + ((e.clientY / window.innerHeight - 0.5) * 2 - prev.y) * 0.02
            }));
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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

        // ============ CALM UNIVERSE CONFIGURATION ============

        // Stars - more but slower
        const stars = [];
        const starCount = 500;
        const maxDepth = 2000;

        // Gentle nebula clouds
        const nebulaClouds = [];
        const nebulaCount = 8;

        // Distant galaxies (static, slow rotation)
        const galaxies = [];
        const galaxyCount = 3;

        // ==== STAR CLASS - Very slow, gentle movement ====
        class Star {
            constructor() {
                this.reset();
                // Soft star colors - mostly white/blue with subtle variation
                const colorTypes = [
                    { r: 220, g: 230, b: 255 }, // Soft blue-white
                    { r: 255, g: 255, b: 255 }, // Pure white
                    { r: 255, g: 250, b: 240 }, // Warm white
                    { r: 200, g: 220, b: 255 }, // Cool blue
                    { r: 255, g: 240, b: 230 }  // Soft warm
                ];
                this.color = colorTypes[Math.floor(Math.random() * colorTypes.length)];
            }

            reset() {
                this.x = (Math.random() - 0.5) * canvas.width * 3;
                this.y = (Math.random() - 0.5) * canvas.height * 3;
                this.z = Math.random() * maxDepth;
                this.pz = this.z;
                this.baseSize = Math.random() * 1.2 + 0.3;
                this.twinkleSpeed = Math.random() * 0.005 + 0.002; // Very slow twinkle
                this.twinkleOffset = Math.random() * Math.PI * 2;
            }

            update(speed) {
                this.pz = this.z;
                this.z -= speed; // Very slow movement

                if (this.z <= 0) {
                    this.reset();
                    this.z = maxDepth;
                    this.pz = this.z;
                }
            }

            draw(time, parallaxX, parallaxY) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                // Apply gentle parallax based on depth
                const depthFactor = 1 - this.z / maxDepth;
                const px = parallaxX * depthFactor * 30;
                const py = parallaxY * depthFactor * 30;

                const sx = (this.x / this.z) * 300 + centerX + px;
                const sy = (this.y / this.z) * 300 + centerY + py;

                if (sx < -10 || sx > canvas.width + 10 || sy < -10 || sy > canvas.height + 10) {
                    return;
                }

                const size = depthFactor * 2.5 + this.baseSize;

                // Very gentle twinkling
                const twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.15 + 0.85;
                const brightness = depthFactor * twinkle * 0.9;

                // Soft glow effect
                const glowRadius = size * 3;
                const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowRadius);
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${brightness})`);
                gradient.addColorStop(0.3, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${brightness * 0.4})`);
                gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(sx, sy, glowRadius, 0, Math.PI * 2);
                ctx.fill();

                // Star core
                ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
                ctx.beginPath();
                ctx.arc(sx, sy, size * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // ==== NEBULA CLASS - Soft, gentle clouds ====
        class NebulaCloud {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 400 + 250;
                this.speedX = (Math.random() - 0.5) * 0.05; // Very slow drift
                this.speedY = (Math.random() - 0.5) * 0.05;
                this.opacity = Math.random() * 0.06 + 0.02; // Very subtle
                this.rotationSpeed = (Math.random() - 0.5) * 0.0002;
                this.rotation = Math.random() * Math.PI * 2;

                // Soft, calming nebula colors
                const colors = [
                    { r: 100, g: 120, b: 180 },  // Soft blue
                    { r: 130, g: 100, b: 160 },  // Soft purple
                    { r: 80, g: 100, b: 140 },   // Deep blue
                    { r: 100, g: 80, b: 130 },   // Muted violet
                    { r: 70, g: 90, b: 120 }     // Steel blue
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                // Wrap around
                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.x > canvas.width + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = canvas.height + this.size;
                if (this.y > canvas.height + this.size) this.y = -this.size;
            }

            draw(parallaxX, parallaxY) {
                const px = parallaxX * 10;
                const py = parallaxY * 10;

                ctx.save();
                ctx.translate(this.x + px, this.y + py);
                ctx.rotate(this.rotation);

                // Triple layer for soft ethereal effect
                for (let layer = 0; layer < 3; layer++) {
                    const layerSize = this.size * (1 - layer * 0.2);
                    const layerOpacity = this.opacity * (1 - layer * 0.3);

                    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, layerSize);
                    gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${layerOpacity})`);
                    gradient.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${layerOpacity * 0.4})`);
                    gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(0, 0, layerSize, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        // ==== GALAXY CLASS - Distant spiral galaxies ====
        class Galaxy {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 60 + 40;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.0001; // Almost imperceptible rotation
                this.opacity = Math.random() * 0.15 + 0.05;
                this.tilt = Math.random() * 0.8 + 0.2; // Oval tilt
            }

            draw(parallaxX, parallaxY) {
                const px = parallaxX * 5;
                const py = parallaxY * 5;

                ctx.save();
                ctx.translate(this.x + px, this.y + py);
                ctx.rotate(this.rotation);
                ctx.scale(1, this.tilt);

                // Galaxy core
                const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.3);
                coreGradient.addColorStop(0, `rgba(255, 250, 240, ${this.opacity * 2})`);
                coreGradient.addColorStop(1, `rgba(200, 180, 150, 0)`);
                ctx.fillStyle = coreGradient;
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
                ctx.fill();

                // Spiral arms (simplified)
                const armGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
                armGradient.addColorStop(0, `rgba(180, 200, 255, ${this.opacity * 0.5})`);
                armGradient.addColorStop(0.5, `rgba(150, 170, 220, ${this.opacity * 0.3})`);
                armGradient.addColorStop(1, 'rgba(150, 170, 220, 0)');
                ctx.fillStyle = armGradient;
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();

                // Very slow rotation
                this.rotation += this.rotationSpeed;
            }
        }

        // ==== INITIALIZE ====
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }

        for (let i = 0; i < nebulaCount; i++) {
            nebulaClouds.push(new NebulaCloud());
        }

        for (let i = 0; i < galaxyCount; i++) {
            galaxies.push(new Galaxy());
        }

        const baseSpeed = 0.3; // Very slow star movement

        // ==== ANIMATION LOOP ====
        const animate = (time) => {
            // Deep, calming space gradient
            const bgGradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.8
            );
            bgGradient.addColorStop(0, '#0d1520');   // Dark center
            bgGradient.addColorStop(0.3, '#0a1118'); // Deep navy
            bgGradient.addColorStop(0.6, '#080d14'); // Darker
            bgGradient.addColorStop(1, '#050810');   // Almost black

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const parallaxX = mousePos.x;
            const parallaxY = mousePos.y;

            // Draw nebula clouds (background layer)
            nebulaClouds.forEach(cloud => {
                cloud.update();
                cloud.draw(parallaxX, parallaxY);
            });

            // Draw distant galaxies
            galaxies.forEach(galaxy => {
                galaxy.draw(parallaxX, parallaxY);
            });

            // Update and draw stars
            stars.forEach(star => {
                star.update(baseSpeed);
                star.draw(time, parallaxX, parallaxY);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate(0);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mousePos]);

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
