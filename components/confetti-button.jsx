"use client";

import confetti from "canvas-confetti";

const shootConfetti = (origin) => {
  const count = 200;
  const defaults = {
    origin: origin,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};

const shootFireworks = () => {
  const duration = 1 * 1000;
  const end = Date.now() + duration;

  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

const confettiEffects = {
  default: shootConfetti,
  fireworks: shootFireworks
};

export function ConfettiButton({
  children,
  variant = "default",
  className = "",
  onClick,
  ...props
}) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    const origin = { x, y };

    const effect = confettiEffects[variant] || confettiEffects.default;
    effect(origin);
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  );
}
