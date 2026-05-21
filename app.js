/* ─────────────────────────────────────
   AI-GEN — app.js  (V2)
   Nav scroll, particle canvas, reveal, part tabs
───────────────────────────────────── */

// ── Nav scroll state ──
const nav = document.getElementById('topnav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Smooth scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Part tab switching ──
const navH  = 60;
const barH  = 48;
const offset = navH + barH + 1;

document.querySelectorAll('.ptab').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.target;
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const section = document.getElementById(id);
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Active tab on scroll ──
const partSections = Array.from(document.querySelectorAll('.part-section[id]'));
const ptabs = Array.from(document.querySelectorAll('.ptab'));

function updateActiveTab() {
  const scrollY = window.scrollY + offset + 10;
  let active = 'hero'; // default: 홈 tab active when above part1
  for (const sec of partSections) {
    if (sec.offsetTop <= scrollY) active = sec.id;
  }
  ptabs.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === active);
  });
  // scroll active tab into view within the bar
  const activeBtn = ptabs.find(b => b.dataset.target === active);
  if (activeBtn) {
    activeBtn.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }
}

window.addEventListener('scroll', updateActiveTab, { passive: true });
updateActiveTab();

// ── Reveal on scroll ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
      let delay = 0;
      siblings.forEach(el => {
        if (el === entry.target || el.getBoundingClientRect().top < window.innerHeight + 50) {
          setTimeout(() => el.classList.add('visible'), delay);
          delay += 80;
        }
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

window.addEventListener('load', () => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });
});

// ── Particle Canvas ──
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = ['rgba(0,200,255,', 'rgba(123,94,167,', 'rgba(255,255,255,'];

  function createParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.1,
      dAlpha: (Math.random() - 0.5) * 0.003,
      color,
    };
  }

  const COUNT = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 12000));
  for (let i = 0; i < COUNT; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,200,255,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.dAlpha;
      if (p.alpha <= 0.05 || p.alpha >= 0.65) p.dAlpha *= -1;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

// ── Mobile: reduce particle count on small screens ──
(function() {
  if (window.innerWidth < 480) {
    // Canvas particle system already initialized above with MIN(120, area/12000)
    // On 375×812 = ~25 particles which is fine
  }
})();

// ── Mobile: active tab scroll into view on tap ──
// (merged into the main ptab click handler above via scrollIntoView in updateActiveTab)

// ── Mobile: touch-friendly smooth scroll for CTA ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('touchstart', () => {}, { passive: true });
});
