const API_URL = 'http://localhost:5000/api';

/* ───── DYNAMIC DATA LOADER ───── */
/* Data sources: backend API → portfolio-data.json (fallback) → defaults. */
async function loadDynamicData() {
  /* 1. Backend API */
  try {
    const resp = await fetch(API_URL + '/portfolio');
    if (resp.ok) {
      const data = await resp.json();
      renderSiteData(data);
      return;
    }
  } catch {}

  /* 2. portfolio-data.json — fallback */
  try {
    const resp = await fetch('./portfolio-data.json');
    if (resp.ok) {
      renderSiteData(await resp.json());
      return;
    }
  } catch {}

  /* 3. Fallback defaults */
  renderSkills(getDefaultSkills());
  renderProjects(getDefaultProjects());
  renderTimeline(getDefaultTimeline());
  renderTestimonials(getDefaultTestimonials());
}

function renderSiteData(d) {
  if (!d) return;

  if (d.profile) {
    if (d.profile.name) {
      document.querySelector('.hero-name').innerHTML = `Sseruyange <span class="highlight">${d.profile.name.split(' ').slice(1).join(' ') || d.profile.name}</span>`;
    }
    if (d.profile.greeting) {
      const el = document.querySelector('.hero-greeting');
      if (el) el.textContent = d.profile.greeting;
    }
    if (d.profile.titles && Array.isArray(d.profile.titles) && d.profile.titles.length) {
      window.__adminTitles = d.profile.titles;
    }
    if (d.profile.description) {
      const el = document.querySelector('.hero-desc');
      if (el) el.textContent = d.profile.description;
    }
    if (d.profile.image) {
      document.querySelectorAll('.hero-img-wrapper img, .about-image img').forEach(img => { img.src = d.profile.image; });
    }
  }

  if (d.about) {
    if (d.about.subtitle) {
      const el = document.querySelector('.about-text h3');
      if (el) el.innerHTML = d.about.subtitle.replace(/Victoria University/, '<span class="highlight">Victoria University</span>');
    }
    const paras = document.querySelectorAll('.about-text > p');
    if (d.about.paragraphs) {
      d.about.paragraphs.forEach((txt, i) => { if (paras[i]) paras[i].textContent = txt; });
    }
    if (d.about.cards) {
      const cards = document.querySelectorAll('.about-card');
      const keys = ['education', 'experience', 'achievements'];
      keys.forEach((key, i) => {
        if (cards[i] && d.about.cards[key]) {
          cards[i].querySelector('h4').textContent = d.about.cards[key].title || cards[i].querySelector('h4').textContent;
          cards[i].querySelector('p').textContent = d.about.cards[key].text || cards[i].querySelector('p').textContent;
        }
      });
    }
  }

  if (d.skills) renderSkills(d.skills);
  if (d.timeline) renderTimeline(d.timeline);
  if (d.testimonials) renderTestimonials(d.testimonials);

  if (d.social) {
    const socialLinks = document.querySelectorAll('.hero-socials a, .contact-socials a, .footer-socials a');
    const socialMap = { github: 0, linkedin: 1, instagram: 2, whatsapp: 3, tiktok: 4, x: 5 };
    Object.keys(socialMap).forEach(key => {
      if (d.social[key] && socialLinks[socialMap[key]]) {
        socialLinks[socialMap[key]].href = d.social[key];
        socialLinks[socialMap[key] + 6] && (socialLinks[socialMap[key] + 6].href = d.social[key]);
        socialLinks[socialMap[key] + 12] && (socialLinks[socialMap[key] + 12].href = d.social[key]);
      }
    });
  }

  if (d.contact) {
    const contactItems = document.querySelectorAll('.contact-item p');
    if (d.contact.location && contactItems[0]) contactItems[0].textContent = d.contact.location;
    if (d.contact.email && contactItems[1]) contactItems[1].textContent = d.contact.email;
    if (d.contact.phone && contactItems[2]) contactItems[2].textContent = d.contact.phone;
    if (d.contact.email) {
      const fallback = document.getElementById('contact-fallback-email');
      if (fallback) fallback.textContent = d.contact.email;
    }
  }

  if (d.stats) {
    const counters = document.querySelectorAll('.stat-number');
    const statKeys = ['projects', 'technologies', 'repos', 'hours'];
    statKeys.forEach((key, i) => {
      if (d.stats[key] !== undefined && counters[i]) counters[i].dataset.target = d.stats[key];
    });
    animateCounters();
  }

  if (d.projects && d.projects.length) renderProjects(d.projects);

  const cvBtn = document.getElementById('cv-download-btn');
  if (cvBtn && d.cv_url) {
    cvBtn.href = d.cv_url;
    cvBtn.download = d.cv && d.cv.name ? d.cv.name : 'Marvin_CV.pdf';
    cvBtn.style.display = 'inline-flex';
  }

  if (d.contact && d.contact.email) {
    window.__contactEmail = d.contact.email;
  }
}

/* ───── LOADING SCREEN & INIT ───── */
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => { if (loader) loader.style.display = 'none'; }, 500);
  }
}

async function initSite() {
  /* Safety net: hide loader after 3s no matter what */
  const timer = setTimeout(hideLoader, 3000);
  await loadDynamicData();
  clearTimeout(timer);
  hideLoader();
}

initSite();

/* ───── THEME TOGGLE ───── */
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

/* ───── MOBILE MENU ───── */
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const menuIcon = menuToggle.querySelector('i');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuIcon.className = navLinks.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuIcon.className = 'fas fa-bars';
  });
});

/* ───── ACTIVE NAV LINK ───── */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      current = section.getAttribute('id');
    }
  });
  navLinkEls.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

/* ───── SCROLL REVEAL ───── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ───── SCROLL TO TOP ───── */
const scrollBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ───── TYPING EFFECT ───── */
const typingText = document.querySelector('.typing-text');
const phrases = window.__adminTitles || ['Software Engineering Student', 'Frontend Developer', 'Problem Solver'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  if (isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentPhrase.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 500;
  }

  setTimeout(typeEffect, speed);
}

document.addEventListener('DOMContentLoaded', typeEffect);

/* ───── ANIMATED SKILL BARS ───── */
function animateSkillBars() {
  document.querySelectorAll('.skill-item').forEach(item => {
    const progress = item.querySelector('.skill-progress');
    const percent = item.querySelector('.skill-percent');
    const target = parseInt(item.dataset.progress);
    progress.style.width = target + '%';

    let current = 0;
    const interval = setInterval(() => {
      current++;
      percent.textContent = current + '%';
      if (current >= target) clearInterval(interval);
    }, 20);
  });
}

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkillBars();
      skillsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

function observeSkills() {
  const el = document.querySelector('#skills .skills-grid');
  if (el) skillsObserver.observe(el);
}

/* ───── ANIMATED COUNTERS ───── */
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = parseInt(counter.dataset.target);
    let current = 0;
    const increment = Math.ceil(target / 60);
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      counter.textContent = current;
    }, 25);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);

/* ───── DYNAMIC PROJECTS ───── */
function getDefaultProjects() {
  return [
    { title: 'Secure Online Voting System', description: 'A voting platform that uses blockchain technology to ensure secure and transparent elections, allowing people to vote safely from anywhere.', image: './assets/image/1.jpg', tags: ['HTML', 'CSS', 'JavaScript', 'PHP'], github: 'https://github.com', demo: '#', category: 'academic' },
    { title: 'Smart Inventory Tracker', description: 'A system that uses technology to monitor stock levels in real-time, helping businesses manage their inventory efficiently.', image: './assets/image/2.jpg', tags: ['JavaScript', 'Node.js', 'MongoDB'], github: 'https://github.com', demo: '#', category: 'web' },
    { title: 'AI Customer Service Chatbot', description: 'An automated chat system that provides quick answers to customer inquiries and assists with common issues, improving support efficiency.', image: './assets/image/3.jpg', tags: ['Python', 'AI', 'Flask'], github: 'https://github.com', demo: '#', category: 'ai' }
  ];
}
function renderProjects(projects) {
  const filtersContainer = document.getElementById('project-filters');
  const grid = document.getElementById('projects-grid');
  if (!filtersContainer || !grid) return;

  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];

  filtersContainer.innerHTML = '<button class="filter-btn active" data-filter="all">All</button>' +
    categories.map(c => `<button class="filter-btn" data-filter="${escapeHtml(c)}">${escapeHtml(c.charAt(0).toUpperCase() + c.slice(1))}</button>`).join('');

  grid.innerHTML = projects.map((proj, i) => `
    <div class="project-card reveal" data-category="${escapeHtml(proj.category || '')}">
      <div class="project-img">
        <img src="${escapeHtml(proj.image || '../assets/image/1.jpg')}" alt="${escapeHtml(proj.title)}" loading="lazy">
        <div class="project-overlay">
          <a href="${escapeHtml(proj.github || '#')}" target="_blank" class="project-btn"><i class="fab fa-github"></i></a>
          <a href="${escapeHtml(proj.demo || '#')}" target="_blank" class="project-btn"><i class="fas fa-external-link-alt"></i></a>
        </div>
      </div>
      <div class="project-info">
        <h3>${escapeHtml(proj.title)}</h3>
        <p>${escapeHtml(proj.description)}</p>
        <div class="project-tags">
          ${(proj.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${escapeHtml(proj.github || '#')}" target="_blank" class="btn btn-sm"><i class="fab fa-github"></i> GitHub</a>
          <a href="${escapeHtml(proj.demo || '#')}" target="_blank" class="btn btn-sm btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>
        </div>
      </div>
    </div>
  `).join('');

  /* Re-observe reveal elements */
  document.querySelectorAll('.project-card.reveal').forEach(el => revealObserver.observe(el));

  /* Filter click handlers */
  filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      grid.querySelectorAll('.project-card').forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
      });
    });
  });
}

/* ───── SKILLS ───── */
function getDefaultSkills() {
  return {
    programming: [
      { name: 'HTML', percent: 95 }, { name: 'CSS', percent: 90 },
      { name: 'JavaScript', percent: 70 }, { name: 'Java', percent: 75 },
      { name: 'Python', percent: 70 }, { name: 'PHP', percent: 45 }
    ],
    frameworks: [{ name: 'React', percent: 55 }, { name: 'Node.js', percent: 30 }],
    tools: ['Git', 'GitHub', 'VS Code', 'Figma'],
    soft: ['Teamwork', 'Communication', 'Problem Solving', 'Leadership']
  };
}

function renderSkills(skills) {
  const progContainer = document.getElementById('skills-programming');
  const framContainer = document.getElementById('skills-frameworks');
  const toolsContainer = document.getElementById('skills-tools');
  const softContainer = document.getElementById('skills-soft');
  if (!progContainer) return;

  const renderSkillItems = (items) =>
    items.map(s => `
      <div class="skill-item" data-progress="${s.percent}">
        <div class="skill-info"><span>${escapeHtml(s.name)}</span><span class="skill-percent">0%</span></div>
        <div class="skill-bar"><div class="skill-progress"></div></div>
      </div>
    `).join('');

  if (skills.programming) progContainer.innerHTML = renderSkillItems(skills.programming);
  if (skills.frameworks) framContainer.innerHTML = renderSkillItems(skills.frameworks);
  if (skills.tools) toolsContainer.innerHTML = skills.tools.map(t => `<span class="tech-badge"><i class="fas fa-cog"></i> ${escapeHtml(t)}</span>`).join('');
  if (skills.soft) softContainer.innerHTML = skills.soft.map(s => `<span class="soft-badge">${escapeHtml(s)}</span>`).join('');

  document.querySelectorAll('#skills .skill-item').forEach(el => revealObserver.observe(el));
  observeSkills();
}

/* ───── TIMELINE ───── */
function getDefaultTimeline() {
  return [
    { year: 2024, title: 'Started Software Engineering', text: 'Began my journey at Victoria University, diving into the world of code, algorithms, and software design.' },
    { year: 2025, title: 'Built First Web Applications', text: 'Developed full-stack projects including voting systems and inventory trackers.' },
    { year: 2026, title: 'Seeking Internship Opportunities', text: 'Actively looking for an internship to apply my knowledge and grow as a developer.' }
  ];
}

function renderTimeline(entries) {
  const container = document.getElementById('timeline-container');
  if (!container) return;
  container.innerHTML = entries.map(e => `
    <div class="timeline-item reveal">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <span class="timeline-year">${e.year}</span>
        <h3>${escapeHtml(e.title)}</h3>
        <p>${escapeHtml(e.text)}</p>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('.timeline-item.reveal').forEach(el => revealObserver.observe(el));
}

/* ───── TESTIMONIALS CAROUSEL ───── */
function getDefaultTestimonials() {
  return [
    { name: 'Jane Mwangi', role: 'Lecturer, Victoria University', text: 'Marvin is one of the most dedicated students I\'ve mentored. His passion for web development and problem-solving is truly inspiring.' },
    { name: 'David Kato', role: 'Team Lead, DevStudio', text: 'Working with Marvin on the voting system project was a great experience. He brings creativity and technical skill to every task.' },
    { name: 'Sarah Nakato', role: 'Senior Developer, TechHub', text: 'Marvin\'s ability to learn quickly and adapt to new technologies sets him apart.' }
  ];
}

let testimonialTimer = null;
let testimonialSlide = 0;

function renderTestimonials(list) {
  const track = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  if (!track) return;

  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  track.innerHTML = list.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
      <p>"${escapeHtml(t.text)}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${getInitials(t.name)}</div>
        <div><h4>${escapeHtml(t.name)}</h4><span>${escapeHtml(t.role)}</span></div>
      </div>
    </div>
  `).join('');

  dotsContainer.innerHTML = list.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('');

  const dots = dotsContainer.querySelectorAll('.dot');
  testimonialSlide = 0;

  function goToSlide(index) {
    if (index < 0) index = list.length - 1;
    if (index >= list.length) index = 0;
    testimonialSlide = index;
    track.style.transform = `translateX(-${testimonialSlide * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[testimonialSlide].classList.add('active');
  }

  if (prevBtn) {
    prevBtn.onclick = () => { goToSlide(testimonialSlide - 1); resetTimer(); };
  }
  if (nextBtn) {
    nextBtn.onclick = () => { goToSlide(testimonialSlide + 1); resetTimer(); };
  }
  dots.forEach(dot => {
    dot.onclick = () => { goToSlide(parseInt(dot.dataset.index)); resetTimer(); };
  });

  function resetTimer() {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(() => goToSlide(testimonialSlide + 1), 5000);
  }

  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => goToSlide(testimonialSlide + 1), 5000);

  const carousel = document.querySelector('.testimonials-carousel');
  if (carousel) {
    carousel.onmouseenter = () => clearInterval(testimonialTimer);
    carousel.onmouseleave = () => { testimonialTimer = setInterval(() => goToSlide(testimonialSlide + 1), 5000); };
  }
}

/* ───── CONTACT FORM ───── */
const contactForm = document.getElementById('contact-form');
const formNotification = document.getElementById('form-notification');

function getContactEmail() {
  return window.__contactEmail || 'sseruyangemarvin772@gmail.com';
}

function validateField(input) {
  const formGroup = input.closest('.form-group');
  const errorEl = formGroup.querySelector('.form-error');
  formGroup.classList.remove('error');

  if (input.hasAttribute('required') && !input.value.trim()) {
    formGroup.classList.add('error');
    errorEl.textContent = 'This field is required';
    return false;
  }

  if (input.type === 'email' && input.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      formGroup.classList.add('error');
      errorEl.textContent = 'Please enter a valid email';
      return false;
    }
  }

  return true;
}

contactForm.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.closest('.form-group').classList.contains('error')) {
      validateField(input);
    }
  });
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  let isValid = true;
  contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
    if (!validateField(input)) isValid = false;
  });

  if (!isValid) return;

  const name = contactForm.querySelector('[name="name"]').value.trim();
  const senderEmail = contactForm.querySelector('[name="email"]').value.trim();
  const subject = contactForm.querySelector('[name="subject"]').value.trim();
  const message = contactForm.querySelector('[name="message"]').value.trim();
  const btn = e.target.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  formNotification.style.display = 'none';

  try {
    const resp = await fetch('https://formsubmit.co/ajax/' + getContactEmail(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email: senderEmail, subject, message })
    });
    const result = await resp.json();

    if (result.success) {
      formNotification.className = 'form-notification success';
      formNotification.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
      contactForm.reset();
    } else {
      formNotification.className = 'form-notification error';
      formNotification.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to send. Try emailing directly: <strong>' + getContactEmail() + '</strong>';
    }
  } catch {
    formNotification.className = 'form-notification error';
    formNotification.innerHTML = '<i class="fas fa-exclamation-circle"></i> Network error. Try emailing directly: <strong>' + getContactEmail() + '</strong>';
  }

  formNotification.style.display = 'block';
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  setTimeout(() => { formNotification.style.display = 'none'; }, 10000);
});

/* ───── PARALLAX HERO ───── */
const hero = document.querySelector('.hero');
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
  }
});

/* ───── SMOOTH ANCHOR SCROLL (fallback for browsers) ───── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ───── OFFLINE DETECTION ───── */
const offlineBanner = document.getElementById('offline-banner');

function updateOnlineStatus() {
  if (navigator.onLine) {
    if (offlineBanner) offlineBanner.classList.remove('show');
  } else {
    if (offlineBanner) offlineBanner.classList.add('show');
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

/* ───── SERVICE WORKER ───── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* Service worker not supported or registration failed — site still works */
    });
  });
}
