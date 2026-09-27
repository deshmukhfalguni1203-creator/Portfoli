const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const backToTop = document.querySelector('.back-to-top');
const revealItems = document.querySelectorAll('.reveal');

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  });
});

const updateActiveLink = () => {
  const currentSection = sections.reduce((current, section) => {
    const distance = Math.abs(section.getBoundingClientRect().top - 120);
    return distance < current.distance ? { id: section.id, distance } : current;
  }, { id: 'home', distance: Number.POSITIVE_INFINITY });

  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${currentSection.id}`));
  backToTop.classList.toggle('visible', window.scrollY > 600);
};

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const fields = ['name', 'email', 'message'];

const setFieldError = (fieldName, message) => {
  const field = document.querySelector(`#${fieldName}`);
  const wrapper = field.closest('.form-field');
  wrapper.classList.toggle('invalid', Boolean(message));
  wrapper.querySelector('.error-message').textContent = message;
};

const validateForm = () => {
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const errors = { name: '', email: '', message: '' };

  if (name.length < 2) errors.name = 'Please enter your name.';
  if (!emailIsValid) errors.email = 'Please enter a valid email address.';
  if (message.length < 10) errors.message = 'Please write at least 10 characters.';
  fields.forEach((field) => setFieldError(field, errors[field]));
  return { valid: Object.values(errors).every((error) => !error), name, email, message };
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = validateForm();
  status.classList.remove('error');

  if (!result.valid) {
    status.textContent = 'Please review the highlighted fields.';
    status.classList.add('error');
    return;
  }

  const recipient = 'YOUR_EMAIL_HERE';
  const subject = encodeURIComponent(`Portfolio enquiry from ${result.name}`);
  const body = encodeURIComponent(`Name: ${result.name}\nEmail: ${result.email}\n\n${result.message}`);
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  status.textContent = 'Opening your email client...';
  form.reset();
});

fields.forEach((field) => {
  form.elements[field].addEventListener('input', () => {
    if (form.elements[field].value.trim()) setFieldError(field, '');
  });
});
