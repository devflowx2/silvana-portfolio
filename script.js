/* ==========================================================
   PORTFOLIO SCRIPT — vanilla JS, no dependencies
========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initNavbar();
  initScrollProgress();
  initCustomCursor();
  initParticles();
  initTypedCode();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initTilt();
});

/* ---------- Footer year ---------- */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Navbar: scroll state + mobile toggle ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle) {
    toggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
    });
    navbar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navbar.classList.remove('open'));
    });
  }
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ---------- Custom cursor ---------- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  const animateRing = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  const interactiveEls = document.querySelectorAll('a, button, .project-card');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

/* ---------- Hero particle network background ---------- */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');
  let particles = [];
  let width, height;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    const count = Math.min(70, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79, 240, 216, 0.55)';
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(139, 107, 255, ${0.14 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ---------- Typed code animation in hero editor ---------- */
function initTypedCode() {
  const el = document.getElementById('typedCode');
  if (!el) return;

  const codeLines = [
    { text: 'const developer = {', cls: '' },
    { text: '  name: "Silvana Ali",', cls: '' },
    { text: '  role: "Front-End Developer",', cls: '' },
    { text: '  stack: ["HTML", "CSS", "JavaScript"],', cls: '' },
    { text: '  passion: "clean UI + smooth motion",', cls: '' },
    { text: '  available: true', cls: '' },
    { text: '};', cls: '' },
    { text: '', cls: '' },
    { text: 'export default developer;', cls: '' }
  ];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    el.textContent = codeLines.map(l => l.text).join('\n');
    return;
  }

  let lineIndex = 0, charIndex = 0;
  let output = '';

  function typeNext() {
    if (lineIndex >= codeLines.length) {
      setTimeout(() => {
        lineIndex = 0; charIndex = 0; output = '';
        el.textContent = '';
        typeNext();
      }, 2600);
      return;
    }

    const line = codeLines[lineIndex].text;

    if (charIndex <= line.length) {
      el.textContent = output + line.slice(0, charIndex);
      charIndex++;
      setTimeout(typeNext, 18 + Math.random() * 26);
    } else {
      output += line + '\n';
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNext, 90);
    }
  }

  typeNext();
}

/* ---------- Scroll reveal (fade/slide in) ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(t => observer.observe(t));
}

/* ---------- Animated skill progress bars ---------- */
function initSkillBars() {
  const skills = document.querySelectorAll('.skill');
  if (!skills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const skill = entry.target;
      const fill = skill.querySelector('.skill-fill');
      const percentEl = skill.querySelector('.skill-percent');
      const target = parseInt(fill.dataset.fill, 10);

      fill.style.width = target + '%';
      animateNumber(percentEl, 0, target, 1200, (v) => `${v}%`);

      observer.unobserve(skill);
    });
  }, { threshold: 0.4 });

  skills.forEach(s => observer.observe(s));
}

/* ---------- Animated counters (about stat, github stats) ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      animateNumber(el, 0, target, 1500, (v) => `${v}${target >= 100 ? '+' : ''}`);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateNumber(el, from, to, duration, format) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(from + (to - from) * eased);
    el.textContent = format ? format(value) : value;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---------- 3D tilt effect on project cards ---------- */
function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length || window.matchMedia('(hover: none)').matches) return;

  cards.forEach(card => {
    let rect;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}