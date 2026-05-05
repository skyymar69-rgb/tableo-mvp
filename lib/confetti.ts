import confetti from "canvas-confetti";

export function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#F89544", "#E879A0", "#F7C6A0", "#ffffff"],
  });
}

export function fireOrderConfetti() {
  confetti({
    particleCount: 60,
    spread: 50,
    origin: { y: 0.7 },
    colors: ["#F89544", "#E879A0"],
    scalar: 0.8,
  });
}

export function fireMilestoneConfetti() {
  const end = Date.now() + 1500;
  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#F89544", "#E879A0"] });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#F89544", "#E879A0"] });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
