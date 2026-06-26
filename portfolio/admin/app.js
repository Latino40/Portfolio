const API_URL = 'http://localhost:5000/api';
const DEFAULT_DATA = {
  profile: {
    greeting: "Hello, I'm",
    name: 'Sseruyange Marvin',
    titles: ['Software Engineering Student', 'Frontend Developer', 'Problem Solver'],
    description: 'Aspiring software engineer, passionate about coding and problem-solving.',
    image: '../assets/image/lo.jpeg'
  },
  about: {
    subtitle: 'Software Engineering Student at Victoria University',
    paragraphs: [
      'Passionate first-year software engineering student dedicated to mastering the art of coding.',
      'Proficient in languages like Java, HTML, CSS, PHP, and JavaScript.'
    ],
    cards: {
      education: { title: 'Education', text: 'BSc Software Engineering\nVictoria University' },
      experience: { title: 'Experience', text: 'Frontend Projects\nWeb Applications' },
      achievements: { title: 'Achievements', text: 'Multiple Web Dev Projects\nProblem Solving' }
    }
  },
  skills: {
    programming: [{ name: 'HTML', percent: 90 }, { name: 'CSS', percent: 85 }, { name: 'JavaScript', percent: 70 }, { name: 'Java', percent: 75 }, { name: 'Python', percent: 50 }, { name: 'PHP', percent: 65 }],
    frameworks: [{ name: 'React', percent: 65 }, { name: 'Node.js', percent: 30 }],
    tools: ['Git', 'GitHub', 'VS Code', 'Figma'],
    soft: ['Teamwork', 'Communication', 'Problem Solving', 'Leadership']
  },
  projects: [
    { title: 'Secure Online Voting System', description: 'A voting platform that uses blockchain technology.', image: '../assets/image/1.jpg', tags: ['HTML', 'CSS', 'JavaScript', 'PHP'], github: 'https://github.com', demo: '#', category: 'academic' },
    { title: 'Smart Inventory Tracker', description: 'A system that monitors stock levels in real-time.', image: '../assets/image/2.jpg', tags: ['JavaScript', 'Node.js', 'MongoDB'], github: 'https://github.com', demo: '#', category: 'web' },
    { title: 'AI Customer Service Chatbot', description: 'An automated chat system for customer inquiries.', image: '../assets/image/3.jpg', tags: ['Python', 'AI', 'Flask'], github: 'https://github.com', demo: '#', category: 'ai' }
  ],
  timeline: [
    { year: 2024, title: 'Started Software Engineering', text: 'Began my journey at Victoria University.' },
    { year: 2025, title: 'Built First Web Applications', text: 'Developed full-stack projects.' },
    { year: 2026, title: 'Seeking Internship Opportunities', text: 'Actively looking for an internship.' }
  ],
  testimonials: [
    { name: 'Jane Mwangi', role: 'Lecturer, Victoria University', text: 'Marvin is one of the most dedicated students.', rating: 5 },
    { name: 'David Kato', role: 'Team Lead, DevStudio', text: 'Working with Marvin was a great experience.', rating: 5 },
    { name: 'Sarah Nakato', role: 'Senior Developer, TechHub', text: 'Marvin ability to learn quickly sets him apart.', rating: 5 }
  ],
  social: {
    github: 'https://github.com', linkedin: 'https://linkedin.com', instagram: 'https://instagram.com',
    whatsapp: 'https://wa.link/k17nbw', tiktok: 'https://tiktok.com', x: 'https://x.com'
  },
  contact: { email: 'sseruyangemarvin772@gmail.com', phone: '+256 XXX XXX XXX', location: 'Kampala, Uganda' },
  stats: { projects: 6, technologies: 12, repos: 15, hours: 500 },
  cv: null,
  cv_url: '',
  updatedAt: null
};

let data = {};
let saveTimer = null;

function getToken() { return localStorage.getItem('token'); }

async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  } else {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(API_URL + url, { ...options, headers });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

async function init() {
  await loadData();
  renderAll();
  updateOverview();
  bindAutoSave();
}

async function loadData() {
  try {
    const portfolio = await apiFetch('/portfolio');
    data = portfolio;
    Object.keys(DEFAULT_DATA).forEach(key => {
      if (!(key in data)) data[key] = JSON.parse(JSON.stringify(DEFAULT_DATA[key]));
    });
    if (DEFAULT_DATA.social) {
      Object.keys(DEFAULT_DATA.social).forEach(k => {
        if (!(k in (data.social || {}))) data.social[k] = DEFAULT_DATA.social[k];
      });
    }
  } catch (e) {
    console.error('Failed to load from API, using defaults:', e);
    data = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

async function saveData() {
  data.updatedAt = new Date().toISOString();
  try {
    await apiFetch('/portfolio', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    showSaved('Saved');
    updateLastSync();
  } catch (e) {
    console.error('Save failed:', e);
    showSaved('Save failed');
  }
}

function showSaved(msg) {
  const el = document.getElementById('save-indicator');
  el.innerHTML = '<i class="fas fa-check"></i> ' + (msg || 'Saved');
  el.classList.add('show');
  clearTimeout(el._hide);
  el._hide = setTimeout(() => el.classList.remove('show'), 2500);
}

function updateLastSync() {
  const el = document.getElementById('ov-last');
  if (el) el.textContent = new Date().toLocaleString();
}

function autoSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveData, 600);
}

function bindAutoSave() {
  document.querySelectorAll('#main-content input, #main-content textarea, #main-content select').forEach(el => {
    el.addEventListener('input', autoSave);
    el.addEventListener('change', autoSave);
  });
}

document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + link.dataset.section).classList.add('active');
    document.getElementById('page-title').textContent = link.textContent.trim();
    document.getElementById('sidebar').classList.remove('open');
    if (link.dataset.section !== 'dashboard-overview') renderAll();
    else updateOverview();
  });
});

document.getElementById('sidebar-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value;
  const errorEl = document.getElementById('login-error');
  const btn = e.target.querySelector('button');
  const originalText = btn.textContent;

  btn.textContent = 'Signing in...';
  btn.disabled = true;
  errorEl.textContent = '';

  try {
    const result = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: user, password: pass }),
    });
    localStorage.setItem('token', result.token);
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    init();
  } catch (e) {
    if (e.message && e.message.includes('Failed to fetch')) {
      errorEl.textContent = 'Cannot connect to server. Make sure the backend is running on port 5000.';
    } else if (e.message && e.message.includes('401')) {
      errorEl.textContent = 'Invalid username or password';
    } else {
      errorEl.textContent = 'Login failed: ' + (e.message || 'Unknown error');
    }
  }

  btn.textContent = originalText;
  btn.disabled = false;
});

document.getElementById('logout-btn').addEventListener('click', () => {
  saveData().then(() => {
    localStorage.removeItem('token');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    document.getElementById('login-error').textContent = '';
  });
});

window.updateAuthCredentials = async function() {
  const status = document.getElementById('settings-status');
  const currentPass = document.getElementById('settings-current-pass').value;
  const newPass = document.getElementById('settings-new-pass').value;
  const confirmPass = document.getElementById('settings-confirm-pass').value;

  if (!currentPass) {
    status.innerHTML = '<p style="color:var(--accent);font-size:0.85rem;">Current password is required.</p>';
    return;
  }

  if (newPass && newPass !== confirmPass) {
    status.innerHTML = '<p style="color:var(--accent);font-size:0.85rem;">New passwords do not match.</p>';
    return;
  }

  if (newPass && newPass.length < 6) {
    status.innerHTML = '<p style="color:var(--accent);font-size:0.85rem;">Password must be at least 6 characters.</p>';
    return;
  }

  try {
    await apiFetch('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword: currentPass,
        newPassword: newPass || currentPass,
      }),
    });
    status.innerHTML = '<p style="color:var(--primary);font-size:0.85rem;"><i class="fas fa-check-circle"></i> Credentials updated successfully!</p>';
    document.getElementById('settings-current-pass').value = '';
    document.getElementById('settings-new-pass').value = '';
    document.getElementById('settings-confirm-pass').value = '';
  } catch (e) {
    status.innerHTML = '<p style="color:var(--accent);font-size:0.85rem;">Failed: ' + (e.message || 'Current password may be incorrect') + '</p>';
  }
};

function renderAll() {
  renderProfileForm();
  renderAboutForm();
  renderSkills();
  renderStats();
  renderProjects();
  renderTimeline();
  renderTestimonials();
  renderSocialForm();
  renderContactForm();
  renderCV();
  updateOverview();
}

function renderProfileForm() {
  const p = data.profile;
  setVal('profile-greeting', p.greeting);
  setVal('profile-name', p.name);
  setVal('profile-titles', Array.isArray(p.titles) ? p.titles.join(',') : p.titles);
  setVal('profile-desc', p.description);
  const preview = document.getElementById('profile-pic-preview');
  preview.src = p.image || '../assets/image/lo.jpeg';
}

['profile-greeting', 'profile-name', 'profile-titles', 'profile-desc'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    const val = el.value;
    if (id === 'profile-greeting') data.profile.greeting = val;
    else if (id === 'profile-name') data.profile.name = val;
    else if (id === 'profile-titles') data.profile.titles = val.split(',').map(t => t.trim()).filter(Boolean);
    else if (id === 'profile-desc') data.profile.description = val;
    autoSave();
  });
});

document.getElementById('profile-pic-reset').addEventListener('click', () => {
  data.profile.image = DEFAULT_DATA.profile.image;
  document.getElementById('profile-pic-preview').src = data.profile.image;
  autoSave();
});

function renderAboutForm() {
  const a = data.about;
  setVal('about-subtitle', a.subtitle);
  setVal('about-p1', a.paragraphs[0] || '');
  setVal('about-p2', a.paragraphs[1] || '');
  setVal('about-ed-title', a.cards.education.title);
  setVal('about-ed-text', a.cards.education.text);
  setVal('about-ex-title', a.cards.experience.title);
  setVal('about-ex-text', a.cards.experience.text);
  setVal('about-ach-title', a.cards.achievements.title);
  setVal('about-ach-text', a.cards.achievements.text);
  bindAboutAutoSave();
}

function bindAboutAutoSave() {
  const map = {
    'about-subtitle': d => d.about.subtitle = getVal('about-subtitle'),
    'about-p1': d => d.about.paragraphs[0] = getVal('about-p1'),
    'about-p2': d => d.about.paragraphs[1] = getVal('about-p2'),
    'about-ed-title': d => d.about.cards.education.title = getVal('about-ed-title'),
    'about-ed-text': d => d.about.cards.education.text = getVal('about-ed-text'),
    'about-ex-title': d => d.about.cards.experience.title = getVal('about-ex-title'),
    'about-ex-text': d => d.about.cards.experience.text = getVal('about-ex-text'),
    'about-ach-title': d => d.about.cards.achievements.title = getVal('about-ach-title'),
    'about-ach-text': d => d.about.cards.achievements.text = getVal('about-ach-text')
  };
  Object.keys(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.removeEventListener('input', null);
      el.addEventListener('input', () => { map[id](data); autoSave(); });
    }
  });
}

function renderSkills() {
  renderSkillCategory('programming');
  renderSkillCategory('frameworks');
  renderTagList('skills-tools', data.skills.tools, (item, i) => { data.skills.tools.splice(i, 1); renderSkills(); autoSave(); });
  renderTagList('skills-soft', data.skills.soft, (item, i) => { data.skills.soft.splice(i, 1); renderSkills(); autoSave(); });
}

function renderSkillCategory(key) {
  const container = document.getElementById('skills-' + key);
  container.innerHTML = '';
  data.skills[key].forEach((skill, idx) => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <input type="text" value="${escapeHtml(skill.name)}" data-cat="${key}" data-idx="${idx}">
      <input type="range" min="0" max="100" value="${skill.percent}" data-cat="${key}" data-idx="${idx}">
      <span class="skill-val">${skill.percent}%</span>
      <button class="skill-del" data-cat="${key}" data-idx="${idx}"><i class="fas fa-times"></i></button>
    `;
    row.querySelector('input[type="range"]').addEventListener('input', function () {
      data.skills[key][idx].percent = parseInt(this.value);
      row.querySelector('.skill-val').textContent = this.value + '%';
      autoSave();
    });
    row.querySelector('input[type="text"]').addEventListener('input', function () {
      data.skills[key][idx].name = this.value;
      autoSave();
    });
    row.querySelector('.skill-del').addEventListener('click', () => {
      data.skills[key].splice(idx, 1);
      renderSkills();
      autoSave();
    });
    container.appendChild(row);
  });
}

function addSkill(category) {
  data.skills[category].push({ name: 'New Skill', percent: 50 });
  renderSkills();
  autoSave();
}

function renderTagList(containerId, items, onDelete) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach((item, idx) => {
    const tag = document.createElement('span');
    tag.className = 'tag-item';
    tag.innerHTML = `${escapeHtml(item)} <button class="tag-del" data-idx="${idx}"><i class="fas fa-times"></i></button>`;
    tag.querySelector('.tag-del').addEventListener('click', () => onDelete(item, idx));
    container.appendChild(tag);
  });
  const addDiv = document.createElement('span');
  addDiv.className = 'tag-add-input';
  addDiv.innerHTML = `<input type="text" placeholder="Add...">`;
  addDiv.querySelector('input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      items.push(e.target.value.trim());
      e.target.value = '';
      renderTagList(containerId, items, onDelete);
      autoSave();
    }
  });
  container.appendChild(addDiv);
}

function addTool() { addTagPrompt(data.skills.tools, renderSkills); }
function addSoftSkill() { addTagPrompt(data.skills.soft, renderSkills); }
function addTagPrompt(arr, renderFn) {
  const val = prompt('Enter name:');
  if (val && val.trim()) { arr.push(val.trim()); renderFn(); autoSave(); }
}

function renderStats() {
  const keys = ['projects', 'technologies', 'repos', 'hours'];
  keys.forEach(key => {
    const el = document.getElementById('stats-' + key);
    if (el) {
      el.value = data.stats[key] || 0;
      el.oninput = () => { data.stats[key] = parseInt(el.value, 10) || 0; autoSave(); };
    }
  });
}

function renderProjects() {
  const container = document.getElementById('projects-list');
  container.innerHTML = '';
  data.projects.forEach((proj, idx) => {
    const div = document.createElement('div');
    div.className = 'project-edit';
    div.innerHTML = `
      <div class="project-edit-header">
        <h4>${escapeHtml(proj.title || 'Untitled')}</h4>
        <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteProject(${idx})"><i class="fas fa-trash"></i></button>
      </div>
      <div class="form-grid">
        <div class="form-group"><label>Title</label><input type="text" value="${escapeHtml(proj.title)}" data-p="${idx}" data-f="title"></div>
        <div class="form-group"><label>Category</label><input type="text" value="${escapeHtml(proj.category)}" data-p="${idx}" data-f="category" placeholder="e.g. web, ai, academic"></div>
        <div class="form-group" style="grid-column:1/-1"><label>Description</label><textarea rows="2" data-p="${idx}" data-f="description">${escapeHtml(proj.description)}</textarea></div>
        <div class="form-group"><label>GitHub URL</label><input type="url" value="${escapeHtml(proj.github)}" data-p="${idx}" data-f="github"></div>
        <div class="form-group"><label>Demo URL</label><input type="url" value="${escapeHtml(proj.demo)}" data-p="${idx}" data-f="demo"></div>
        <div class="form-group"><label>Image</label>
          <div class="project-img-upload">
            <img class="project-img-preview" src="${escapeHtml(proj.image)}" data-preview="${idx}">
            <label class="admin-btn admin-btn-sm admin-btn-secondary" style="cursor:pointer;display:inline-flex">
              <i class="fas fa-image"></i> Choose
              <input type="file" accept="image/*" hidden data-img-input="${idx}">
            </label>
            <button class="admin-btn admin-btn-sm admin-btn-danger" data-img-reset="${idx}" style="display:${proj.image && proj.image.startsWith('http') ? 'none' : 'inline-flex'}"><i class="fas fa-undo"></i></button>
          </div>
        </div>
        <div class="form-group"><label>Tags (comma sep)</label><input type="text" value="${escapeHtml(proj.tags.join(', '))}" data-p="${idx}" data-f="tags"></div>
      </div>
    `;
    div.querySelectorAll('input:not([type=file]), textarea, select').forEach(el => {
      el.addEventListener('input', () => {
        const i = parseInt(el.dataset.p);
        const f = el.dataset.f;
        if (f === 'tags') data.projects[i].tags = el.value.split(',').map(t => t.trim()).filter(Boolean);
        else data.projects[i][f] = el.value;
        div.querySelector('h4').textContent = data.projects[i].title || 'Untitled';
        autoSave();
      });
    });
    const fileInput = div.querySelector('[data-img-input]');
    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) return alert('Image too large. Max 2MB.');
        const pIdx = parseInt(fileInput.dataset.imgInput);
        const formData = new FormData();
        formData.append('image', file);
        try {
          const result = await apiFetch('/upload/project', {
            method: 'POST',
            body: formData,
          });
          data.projects[pIdx].image = result.url;
          div.querySelector('[data-preview]').src = result.url;
          div.querySelector('[data-img-reset]').style.display = 'inline-flex';
          autoSave();
        } catch (err) {
          alert('Upload failed');
        }
        e.target.value = '';
      });
    }
    const resetBtn = div.querySelector('[data-img-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const pIdx = parseInt(resetBtn.dataset.imgReset);
        data.projects[pIdx].image = '../assets/image/1.jpg';
        div.querySelector('[data-preview]').src = data.projects[pIdx].image;
        resetBtn.style.display = 'none';
        autoSave();
      });
    }
    container.appendChild(div);
  });
}

function addProject() {
  data.projects.push({ title: 'New Project', description: 'Description...', image: '../assets/image/1.jpg', tags: ['HTML', 'CSS'], github: '#', demo: '#', category: 'web' });
  renderProjects();
  autoSave();
}

function deleteProject(idx) {
  if (confirm('Delete this project?')) { data.projects.splice(idx, 1); renderProjects(); autoSave(); }
}

function renderTimeline() {
  const container = document.getElementById('timeline-list');
  container.innerHTML = '';
  data.timeline.forEach((entry, idx) => {
    const div = document.createElement('div');
    div.className = 'timeline-edit';
    div.innerHTML = `
      <input type="number" value="${entry.year}" data-t="${idx}" data-f="year" placeholder="Year">
      <input type="text" value="${escapeHtml(entry.title)}" data-t="${idx}" data-f="title" placeholder="Title">
      <textarea rows="2" data-t="${idx}" data-f="text" placeholder="Description">${escapeHtml(entry.text)}</textarea>
      <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteTimeline(${idx})"><i class="fas fa-times"></i></button>
    `;
    div.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        const i = parseInt(el.dataset.t);
        data.timeline[i][el.dataset.f] = el.dataset.f === 'year' ? parseInt(el.value) || 2024 : el.value;
        autoSave();
      });
    });
    container.appendChild(div);
  });
}

function addTimeline() {
  data.timeline.push({ year: new Date().getFullYear(), title: 'New Entry', text: 'Description...' });
  renderTimeline();
  autoSave();
}

function deleteTimeline(idx) {
  data.timeline.splice(idx, 1); renderTimeline(); autoSave();
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-list');
  container.innerHTML = '';
  data.testimonials.forEach((t, idx) => {
    const div = document.createElement('div');
    div.className = 'testimonial-edit';
    div.innerHTML = `
      <input type="text" value="${escapeHtml(t.name)}" data-m="${idx}" data-f="name" placeholder="Name">
      <input type="text" value="${escapeHtml(t.role)}" data-m="${idx}" data-f="role" placeholder="Role">
      <textarea rows="2" data-m="${idx}" data-f="text" placeholder="Testimonial text">${escapeHtml(t.text)}</textarea>
      <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteTestimonial(${idx})"><i class="fas fa-times"></i></button>
    `;
    div.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        data.testimonials[parseInt(el.dataset.m)][el.dataset.f] = el.value;
        autoSave();
      });
    });
    container.appendChild(div);
  });
}

function addTestimonial() {
  data.testimonials.push({ name: 'New Person', role: 'Role', text: 'Testimonial text...', rating: 5 });
  renderTestimonials();
  autoSave();
}

function deleteTestimonial(idx) {
  data.testimonials.splice(idx, 1); renderTestimonials(); autoSave();
}

function renderSocialForm() {
  Object.keys(data.social).forEach(key => {
    const el = document.getElementById('social-' + key);
    if (el) {
      el.value = data.social[key] || '';
      el.oninput = () => { data.social[key] = el.value; autoSave(); };
    }
  });
}

function renderContactForm() {
  ['email', 'phone', 'location'].forEach(key => {
    const el = document.getElementById('contact-' + key);
    if (el) {
      el.value = data.contact[key] || '';
      el.oninput = () => { data.contact[key] = el.value; autoSave(); };
    }
  });
}

function renderCV() {
  const status = document.getElementById('cv-status');
  const hasCv = data.cv_url && data.cv && data.cv.name;
  if (hasCv) {
    const name = escapeHtml(data.cv.name);
    status.innerHTML = `<i class="fas fa-file-pdf" style="color:var(--primary)"></i> <span><strong>${name}</strong> — stored on Cloudinary</span>`;
  } else {
    status.innerHTML = `<i class="fas fa-file-pdf"></i> <span>No CV uploaded</span>`;
  }
}

document.getElementById('cv-reset').addEventListener('click', async () => {
  data.cv = null;
  data.cv_url = '';
  renderCV();
  autoSave();
});

function setupFileInputs() {
  document.getElementById('profile-pic-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert('Image too large. Max 2MB.');

    const preview = document.getElementById('profile-pic-preview');
    preview.style.opacity = '0.5';

    const formData = new FormData();
    formData.append('image', file);

    try {
      const result = await apiFetch('/upload/profile', {
        method: 'POST',
        body: formData,
      });
      data.profile.image = result.url;
      preview.src = result.url;
      preview.style.opacity = '1';
      autoSave();
    } catch (err) {
      preview.style.opacity = '1';
      alert('Upload failed');
    }
    e.target.value = '';
  });

  document.getElementById('cv-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('PDF too large. Max 5MB.');

    const status = document.getElementById('cv-status');
    status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Uploading CV...</span>';

    const formData = new FormData();
    formData.append('cv', file);

    try {
      const result = await apiFetch('/upload/cv', {
        method: 'POST',
        body: formData,
      });
      data.cv = { name: file.name, size: file.size };
      data.cv_url = result.url;
      renderCV();
      autoSave();
    } catch (err) {
      status.innerHTML = '<i class="fas fa-exclamation-triangle" style="color:var(--accent)"></i> <span>Upload failed</span>';
    }
    e.target.value = '';
  });
}

window.exportData = function() {
  saveData().then(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'portfolio-data.json'; a.click();
    URL.revokeObjectURL(url);
  });
};

document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-file').click());

document.getElementById('import-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (ev) => {
    try {
      const imported = JSON.parse(ev.target.result);
      Object.keys(DEFAULT_DATA).forEach(key => { if (key in imported) data[key] = imported[key]; });
      await saveData();
      renderAll();
      alert('Data imported successfully!');
    } catch { alert('Invalid JSON file.'); }
  };
  reader.readAsText(file);
  e.target.value = '';
});

window.resetAllData = function() {
  if (!confirm('Reset ALL data to defaults?')) return;
  if (!confirm('This cannot be undone. Continue?')) return;
  data = JSON.parse(JSON.stringify(DEFAULT_DATA));
  data.cv = null;
  data.cv_url = '';
  saveData();
  renderAll();
};

function updateOverview() {
  document.getElementById('ov-skills').textContent =
    data.skills.programming.length + data.skills.frameworks.length + data.skills.tools.length + data.skills.soft.length;
  document.getElementById('ov-projects').textContent = data.projects.length;
  document.getElementById('ov-testimonials').textContent = data.testimonials.length;

  const hasCv = data.cv_url && data.cv && data.cv.name;
  document.getElementById('ov-cv').textContent = hasCv ? 'Yes' : 'No';
  document.getElementById('ov-cv').style.color = hasCv ? '#00F5D4' : '#FF006E';

  const imgOk = data.profile.image && data.profile.image !== '';
  document.getElementById('ov-profile').textContent = imgOk ? 'Yes' : 'Incomplete';
  document.getElementById('ov-profile').style.color = imgOk ? '#00F5D4' : '#FF006E';
  document.getElementById('ov-last').textContent = data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '-';
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val !== undefined && val !== null ? val : '';
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { try { setupFileInputs(); } catch (e) { console.error('File inputs setup failed:', e); } });
} else {
  try { setupFileInputs(); } catch (e) { console.error('File inputs setup failed:', e); }
}
