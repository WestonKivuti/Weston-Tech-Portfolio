'use strict';

/* ---------- Project data: add new projects here ---------- */
const projects = [
  {
    name: 'Parking System Project',
    category: 'Java',           // Web | C/C++ | Java | JavaScript | Other
    featured: true,
    description: 'A modern parking system that records vehicles as they enter and exit parking and automatically calculates the cost of their stay.',
    technologies: ['Java', 'HTML', 'CSS'],  // Add more here, e.g. the database
    repo: 'https://github.com/WestonKivuti/Parking-System-Project',
    demo: '',                   // Only set when a real deployment exists
    screenshot: 'assets/images/parking.jpg',
    screenshotAlt: 'Illustration of cars in a parking lot',
    caseStudy: { problem: '', approach: '', technology: '', challenges: '', solution: '', result: '', lessons: '' }
  }
];

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) k === 'class' ? (e.className = v) : e.setAttribute(k, v);
  kids.flat().forEach(c => e.append(c));
  return e;
};

/* ---------- Theme ---------- */
function initTheme() {
  const btn = $('#theme-btn'), root = document.documentElement;
  const sync = () => btn.setAttribute('aria-label', `Switch to ${root.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
  sync();
  btn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* storage unavailable */ }
    sync();
  });
}

/* ---------- Navigation ---------- */
function initNav() {
  const menu = $('#menu-btn'), links = $('#nav-links');
  const setOpen = open => { links.classList.toggle('open', open); menu.setAttribute('aria-expanded', open); menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
  menu.addEventListener('click', () => setOpen(!links.classList.contains('open')));
  links.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  const navLinks = $$('a', links);
  const spy = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));
}

/* ---------- One page at a time ---------- */
function initPages() {
  const sections = $$('main > section[id]');
  const navLinks = $$('#nav-links a');
  let current = null;

  const show = id => {
    sections.forEach(s => { s.hidden = s.id !== id; });
    $$('.reveal', document.getElementById(id)).forEach(n => n.classList.add('in'));
    navLinks.forEach(a => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    scrollTo({ top: 0, behavior: 'instant' });
  };

  const route = () => {
    const id = location.hash.slice(1);
    if (sections.some(s => s.id === id)) { current = id; show(id); }
    else if (!current) { current = 'home'; show('home'); }
  };

  addEventListener('hashchange', route);
  route();
}

/* ---------- Scroll effects ---------- */
function initScroll() {
  const bar = $('#progress'), top = $('#to-top');
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    top.hidden = scrollY < 500;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0 }));
  update();

  const io = new IntersectionObserver((entries, o) => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); o.unobserve(en.target); }
  }), { threshold: 0.1 });
  $$('.reveal').forEach(n => io.observe(n));
}

/* ---------- Skills data: add a new language or tool here ---------- */
const skills = {
  'Programming Languages': ['C', 'C++', 'Java', 'JavaScript'],
  'Web Technologies': ['HTML5', 'CSS3', 'JavaScript'],
  'Development Tools': ['Git', 'GitHub', 'VS Code'],
  'Areas of Interest': ['Artificial Intelligence', 'Cloud Computing', 'Software Engineering', 'Web Development'],
  'Currently Learning': ['Software engineering practices', 'Artificial Intelligence', 'Cloud Computing']
};

/* ---------- Projects ---------- */
function projectCard(p) {
  const labels = { problem: 'Problem', approach: 'Approach', technology: 'Technology', challenges: 'Challenges', solution: 'Solution', result: 'Result', lessons: 'Lessons Learned' };
  const study = el('dl');
  for (const [k, label] of Object.entries(labels)) study.append(el('dt', {}, label), el('dd', {}, p.caseStudy[k] || 'To be added.'));
  const tech = p.technologies.length
    ? el('ul', { class: 'tags' }, p.technologies.map(t => el('li', {}, t)))
    : el('p', { class: 'muted' }, 'Technologies: Add project technologies');
  const links = el('div', { class: 'btns' }, el('a', { class: 'btn primary', href: p.repo, target: '_blank', rel: 'noopener noreferrer' }, 'View on GitHub'));
  if (p.demo) links.append(el('a', { class: 'btn', href: p.demo, target: '_blank', rel: 'noopener noreferrer' }, 'Live Demo'));
  return el('article', { class: 'card project' + (p.featured ? ' featured' : ''), 'data-category': p.category },
    p.featured ? el('span', { class: 'badge' }, 'Featured project') : '',
    media(p),
    el('h3', {}, p.name), el('p', {}, p.description), tech, links,
    el('details', {}, el('summary', {}, 'Case study'), study));
}

function initProjects() {
  const grid = $('#project-grid'), bar = $('#filters');
  const cats = [...new Set(projects.map(p => p.category))];
  const render = cat => grid.replaceChildren(...projects.filter(p => cat === 'All' || p.category === cat).map(projectCard));
  render('All');
  if (cats.length < 2) return;           // filters only appear when there is something to filter
  bar.hidden = false;
  ['All', ...cats].forEach(c => {
    const b = el('button', { type: 'button', 'aria-pressed': c === 'All' }, c);
    b.addEventListener('click', () => {
      $$('button', bar).forEach(x => x.setAttribute('aria-pressed', x === b));
      render(c);
    });
    bar.append(b);
  });
}

/* ---------- Contact form---------- */
function initForm() {
  const FORM_ENDPOINT = 'https://formspree.io/f/xljbdawg';
  const form = $('#contact-form'), status = $('#form-status');
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    message: v => v.trim().length >= 10 || 'Write at least 10 characters.'
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    let firstBad = null;
    for (const [k, rule] of Object.entries(rules)) {
      const f = form.elements[k], res = rule(f.value);
      $('#' + k + '-err').textContent = res === true ? '' : res;
      f.setAttribute('aria-invalid', res !== true);
      if (res !== true && !firstBad) firstBad = f;
    }
    if (firstBad) { firstBad.focus(); status.textContent = ''; return; }
    if (FORM_ENDPOINT.includes('YOUR_FORM_ID')) {
      status.textContent = 'This form is not connected yet. Please email munyiweston@gmail.com directly.';
      return;
    }
    status.textContent = 'Sending...';
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      status.textContent = 'Thank you! Your message has been sent.';
    } catch (err) {
      status.textContent = 'Sorry, something went wrong. Please email munyiweston@gmail.com directly.';
    }
  });
}

/* ---------- CV download ---------- */
const CV_READY = false;   // change to true once assets/Weston-CV.pdf is added

function initCV() {
  const btn = $('#cv-btn'), note = $('#cv-note');
  btn.addEventListener('click', e => {
    if (CV_READY) return;
    e.preventDefault();
    note.textContent = 'My CV has not been added yet. Please come back later. Thank you for your patience.';
  });
}

function initSkills() {
  $('#skills-grid').replaceChildren(...Object.entries(skills).map(([title, items]) =>
    el('div', { class: 'card' }, el('h3', {}, title), el('ul', { class: 'tags' }, items.map(i => el('li', {}, i))))));
}

function media(p) {
  const box = el('div', { class: 'media' });
  const pill = el('span', { class: 'pill' });
  pill.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>View Project';
  box.append(
    p.screenshot ? el('img', { src: p.screenshot, alt: p.screenshotAlt || p.name, loading: 'lazy' }) : el('span', { class: 'ph', 'aria-hidden': 'true' }, p.category),
    el('a', { class: 'view', href: p.repo, target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'View ' + p.name + ' on GitHub' }, pill)
  );
  return box;
}

/* ---------- init ---------- */
initTheme();
initNav();
initPages();
initSkills();
initProjects();
initScroll();
initForm();
initCV();
$('#year').textContent = new Date().getFullYear();
