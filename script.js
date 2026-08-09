// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Scroll-spy: highlight active nav link =====
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.site-nav a');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => spyObserver.observe(section));

// ===== Menu filter =====
const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-list .menu-card');
const menuEmpty = document.getElementById('menuEmpty');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let visibleCount = 0;

    menuCards.forEach((card) => {
      const price = Number(card.dataset.price);
      let show = true;

      if (filter === 'under20') show = price < 20;
      if (filter === 'over20') show = price >= 20;

      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    menuEmpty.hidden = visibleCount !== 0;
  });
});

// ===== Gallery lightbox =====
const galleryGrid = document.getElementById('galleryGrid');
const lightbox = document.getElementById('lightbox');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(imgEl) {
  const caption = imgEl.closest('figure').querySelector('figcaption').textContent;
  lightboxImg.src = imgEl.src;
  lightboxImg.alt = imgEl.alt;
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

galleryGrid.querySelectorAll('img').forEach((img) => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => openLightbox(img));
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(img);
    }
  });
});

lightboxBackdrop.addEventListener('click', closeLightbox);
lightboxClose.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

// ===== Contact form validation =====
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const formStatus = document.getElementById('formStatus');

function validateName() {
  const value = nameInput.value.trim();
  if (value.length < 2) {
    nameError.textContent = 'Please enter your full name.';
    return false;
  }
  nameError.textContent = '';
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) {
    emailError.textContent = 'Please enter a valid email address.';
    return false;
  }
  emailError.textContent = '';
  return true;
}

function validateMessage() {
  const value = messageInput.value.trim();
  if (value.length < 10) {
    messageError.textContent = 'Message should be at least 10 characters.';
    return false;
  }
  messageError.textContent = '';
  return true;
}

// Live validation as the user types/leaves a field
nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
messageInput.addEventListener('blur', validateMessage);

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isMessageValid = validateMessage();

  if (isNameValid && isEmailValid && isMessageValid) {
    formStatus.hidden = false;
    formStatus.textContent = `Thanks, ${nameInput.value.trim()}! Your reservation request has been received.`;
    formStatus.classList.remove('error');
    formStatus.classList.add('success');
    contactForm.reset();
  } else {
    formStatus.hidden = false;
    formStatus.textContent = 'Please fix the highlighted fields before submitting.';
    formStatus.classList.remove('success');
    formStatus.classList.add('error');
  }
});
