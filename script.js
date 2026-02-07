const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const message = document.getElementById('message');
const success = document.getElementById('success');
const content = document.getElementById('content');
const finalScreen = document.getElementById('finalScreen');
const bgMusic = document.getElementById('bgMusic');

let fireworksCanvas;
let fireworksCtx;
let fireworksRunning = false;

const phrases = [
  'Really?',
  'You sure?',
  'Haha nice try!',
  'No escape!',
  'Still no? Really?',
  'You’re testing my patience 😤',
  'Try again!'
];

let idx = 0;

function moveNoButton() {
  const pad = 12;
  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const maxX = window.innerWidth - w - pad;
  const maxY = window.innerHeight - h - pad;
  const x = Math.max(pad, Math.random() * maxX);
  const y = Math.max(pad, Math.random() * maxY);
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function cycleMessage() {
  noBtn.textContent = phrases[idx % phrases.length];
  idx += 1;
}

noBtn.addEventListener('mouseenter', () => {
  cycleMessage();
  moveNoButton();
});

noBtn.addEventListener(
  'touchstart',
  (e) => {
    e.preventDefault();
    moveNoButton();
    cycleMessage();
  },
  { passive: false }
);

noBtn.addEventListener('mousedown', (e) => {
  e.preventDefault();
  cycleMessage();
  moveNoButton();
});

yesBtn.addEventListener('click', () => {
  clearScreenAndFireworks();
  if (bgMusic) {
    bgMusic.play().catch(() => {});
  }
});

function spawnConfetti(count) {
  const hearts = ['💖', '💗', '💘', '💝', '💕', '❤️'];
  for (let i = 0; i < count; i += 1) {
    const span = document.createElement('span');
    span.className = 'confetti';
    span.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    span.style.left = `${Math.random() * 100}vw`;
    span.style.animationDelay = `${Math.random() * 0.6}s`;
    span.style.fontSize = `${14 + Math.random() * 18}px`;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 3200);
  }
}

window.addEventListener('resize', moveNoButton);

function clearScreenAndFireworks() {
  if (content) {
    content.style.display = 'none';
  }
  noBtn.style.display = 'none';

  if (!fireworksCanvas) {
    fireworksCanvas = document.createElement('canvas');
    fireworksCanvas.id = 'fireworks';
    document.body.appendChild(fireworksCanvas);
    fireworksCtx = fireworksCanvas.getContext('2d');
  }

  resizeFireworks();
  fireworksCanvas.style.display = 'block';
  fireworksRunning = true;
  runFireworks();

  if (finalScreen) {
    finalScreen.style.display = 'flex';
  }
}

function resizeFireworks() {
  if (!fireworksCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  fireworksCanvas.width = window.innerWidth * dpr;
  fireworksCanvas.height = window.innerHeight * dpr;
  fireworksCanvas.style.width = `${window.innerWidth}px`;
  fireworksCanvas.style.height = `${window.innerHeight}px`;
  fireworksCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', () => {
  moveNoButton();
  resizeFireworks();
});

// Music starts on Yes click only.

const fireworks = [];

function randomColor() {
  const colors = ['#ff3b5c', '#ff9ab0', '#ffd166', '#8be9fd', '#a78bfa', '#7ee081'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createFirework() {
  const x = Math.random() * window.innerWidth;
  const y = (0.2 + Math.random() * 0.5) * window.innerHeight;
  const count = 30 + Math.floor(Math.random() * 25);
  const color = randomColor();
  const particles = [];

  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      radius: 2 + Math.random() * 2,
      color
    });
  }

  fireworks.push({ particles });
}

function updateFireworks() {
  for (let i = fireworks.length - 1; i >= 0; i -= 1) {
    const fw = fireworks[i];
    fw.particles.forEach((p) => {
      p.vy += 0.04;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.012;
    });
    fw.particles = fw.particles.filter((p) => p.alpha > 0);
    if (fw.particles.length === 0) {
      fireworks.splice(i, 1);
    }
  }
}

function drawFireworks() {
  fireworksCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  fireworks.forEach((fw) => {
    fw.particles.forEach((p) => {
      fireworksCtx.globalAlpha = Math.max(p.alpha, 0);
      fireworksCtx.fillStyle = p.color;
      fireworksCtx.beginPath();
      fireworksCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      fireworksCtx.fill();
    });
  });
  fireworksCtx.globalAlpha = 1;
}

function runFireworks() {
  if (!fireworksRunning) return;
  if (Math.random() < 0.2) {
    createFirework();
  }
  updateFireworks();
  drawFireworks();
  requestAnimationFrame(runFireworks);
}
