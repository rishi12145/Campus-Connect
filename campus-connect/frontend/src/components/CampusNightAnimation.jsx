import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

export const CampusNightAnimation = () => {
  const canvasRef = useRef(null);
  const [showCelebrationBtn, setShowCelebrationBtn] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', handleResize);

    // 1. STARS
    let stars = [];
    const numStars = Math.min(180, Math.floor((width * height) / 8000));

    function initStars() {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.75, // top 75% of sky
          radius: Math.random() * 1.5 + 0.4,
          baseAlpha: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.04 + 0.01,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.85 ? '#B7F34A' : Math.random() > 0.7 ? '#FF9F43' : '#FFFFFF'
        });
      }
    }
    initStars();

    // 2. SHOOTING STARS / COMETS
    let comets = [];
    function spawnComet() {
      if (comets.length < 2 && Math.random() < 0.015) {
        comets.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 120 + 80,
          speed: Math.random() * 10 + 12,
          angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1), // ~45 degrees
          opacity: 1,
          fadeSpeed: Math.random() * 0.015 + 0.012
        });
      }
    }

    // 3. CURSOR PARTICLES
    let cursorParticles = [];
    const handleMouseMove = (e) => {
      // Spawn 2-3 stardust particles per movement
      for (let i = 0; i < 2; i++) {
        cursorParticles.push({
          x: e.clientX + (Math.random() * 8 - 4),
          y: e.clientY + (Math.random() * 8 - 4),
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          radius: Math.random() * 2 + 1,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
          color: Math.random() > 0.5 ? '#B7F34A' : '#FF9F43'
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 4. CRACKER / FIREWORK PARTICLES
    let crackerParticles = [];
    const spawnFirework = (x, y, count = 35) => {
      const colors = ['#B7F34A', '#FF9F43', '#00D2D3', '#FF6B6B', '#F368E0', '#FFFA65'];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        crackerParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2.5 + 1.2,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          color: chosenColor,
          gravity: 0.08
        });
      }
    };

    const handleCanvasClick = (e) => {
      spawnFirework(e.clientX, e.clientY, 40);
    };
    window.addEventListener('click', handleCanvasClick);

    // MAIN RENDER LOOP
    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // A. DRAW GLOWING CRESCENT MOON IN TOP RIGHT
      const moonX = width - 110;
      const moonY = 85;
      const moonRadius = 26;

      // Lunar Outer Glow
      const glowGrad = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 90);
      glowGrad.addColorStop(0, 'rgba(240, 248, 220, 0.18)');
      glowGrad.addColorStop(0.5, 'rgba(183, 243, 74, 0.06)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 90, 0, Math.PI * 2);
      ctx.fill();

      // Crescent Moon
      ctx.save();
      ctx.fillStyle = '#FFF8E7';
      ctx.shadowColor = '#B7F34A';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      // Mask to form crescent
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(moonX + 11, moonY - 7, moonRadius + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // B. DRAW TWINKLING STARS
      for (const s of stars) {
        s.phase += s.twinkleSpeed;
        const currentAlpha = Math.max(0.1, s.baseAlpha + Math.sin(s.phase) * 0.35);

        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // 4-point twinkle sparkle on brighter stars
        if (s.radius > 1.4 && currentAlpha > 0.65) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.radius * 2.5, s.y);
          ctx.lineTo(s.x + s.radius * 2.5, s.y);
          ctx.moveTo(s.x, s.y - s.radius * 2.5);
          ctx.lineTo(s.x, s.y + s.radius * 2.5);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // C. DRAW COMETS / SHOOTING STARS
      spawnComet();
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed;
        c.opacity -= c.fadeSpeed;

        if (c.opacity <= 0 || c.x > width || c.y > height) {
          comets.splice(i, 1);
          continue;
        }

        const tailX = c.x - Math.cos(c.angle) * c.length;
        const tailY = c.y - Math.sin(c.angle) * c.length;

        const cometGrad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
        cometGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        cometGrad.addColorStop(0.7, `rgba(183, 243, 74, ${c.opacity * 0.7})`);
        cometGrad.addColorStop(1, `rgba(255, 255, 255, ${c.opacity})`);

        ctx.strokeStyle = cometGrad;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();

        // Glowing head
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // D. DRAW CRACKERS / FIREWORKS
      for (let i = crackerParticles.length - 1; i >= 0; i--) {
        const p = crackerParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          crackerParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // E. DRAW CURSOR STARDUST
      for (let i = cursorParticles.length - 1; i >= 0; i--) {
        const cp = cursorParticles[i];
        cp.x += cp.vx;
        cp.y += cp.vy;
        cp.alpha -= cp.decay;

        if (cp.alpha <= 0) {
          cursorParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = cp.alpha;
        ctx.fillStyle = cp.color;
        ctx.shadowColor = cp.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, cp.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  const triggerCrackers = (e) => {
    e.stopPropagation();
    confetti({
      particleCount: 90,
      spread: 85,
      origin: { y: 0.7 },
      colors: ['#B7F34A', '#FF9F43', '#00D2D3', '#FF6B6B', '#FDCB6E']
    });
  };

  return (
    <>
      {/* Background Interactive Night Sky Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ opacity: 0.95 }}
      />

      {/* Floating Interactive Crackers Launch Pill in bottom-right corner */}
      <div className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center gap-2">
        <button
          onClick={triggerCrackers}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181818]/90 hover:bg-[#252525] border border-[#B7F34A]/40 text-[#B7F34A] text-[11px] font-bold shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          title="Click to launch Diu campus celebration crackers!"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Launch Crackers 🎆</span>
        </button>
      </div>
    </>
  );
};

