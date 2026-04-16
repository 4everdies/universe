const scroller = document.getElementById("scroller");
const audio = document.getElementById("audio");
const hint = document.getElementById("hint");
const speedMultiplier = 1.0;
const timeOffset = 4.5;
const lerpFactor = 0.05;
let active = false;
let realDuration = 0;
let currentY = window.innerHeight;
audio.addEventListener("loadedmetadata", () => {
  realDuration = audio.duration;
});
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function animate() {
  if (!active) return;
  const baseDuration = realDuration || 169;
  const adjustedDuration = baseDuration / speedMultiplier;
  const currentTime = audio.currentTime + timeOffset;
  const progress = Math.min(currentTime / adjustedDuration, 1);
  const textHeight = scroller.scrollHeight;
  const windowHeight = window.innerHeight;
  const targetY = windowHeight + progress * (-textHeight - windowHeight);
  currentY = lerp(currentY, targetY, lerpFactor);
  scroller.style.transform = `translateY(${currentY}px)`;
  if (progress < 1 || audio.loop) {
    requestAnimationFrame(animate);
  }
}

function start() {
  if (active) return;
  active = true;
  hint.style.opacity = "0";
  audio.play().catch(() => {});
  requestAnimationFrame(animate);
}
window.addEventListener("load", () => {
  audio
    .play()
    .then(() => {
      active = true;
      hint.style.opacity = "0";
      requestAnimationFrame(animate);
    })
    .catch(() => {
      document.body.addEventListener("click", start, { once: true });
    });
});
