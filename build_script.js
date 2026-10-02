/**
 * THE MUSCLE HUT GYM — PRODUCTION CLIENT JAVASCRIPT
 * Fully featured vanilla JavaScript: Audio synthesizer, BMI, 1RM,
 * Before/After slider, Lightbox, Filterable gallery, Validations, Animations.
 */

// Global State
let isPlayingPumpBeat = false;
let audioCtx = null;
let beatTimer = null;
let currentBmiUnit = 'metric';
let currentBillingCycle = 'monthly';
let currentTestimonialIndex = 0;
let testimonialInterval = null;
let lightboxCurrentIndex = 0;
const galleryItemsList = [];

// ============================================================================
// 1. PRELOADER & INITIALIZATION
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  // Hide preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 450);
  }

  initCustomCursor();
  initScrollProgressBar();
  initTypingEffect();
  initStatsCounter();
  initScrollReveal();
  initScheduleTabs();
  initBeforeAfterSlider();
  initGalleryFilterAndLightbox();
  initTestimonialCarousel();
  initAudioPumpButton();
  calculateBMI(); // initial run
  calculate1RM(); // initial run

  // Set default checkout date to tomorrow
  const checkoutDateInput = document.getElementById('checkoutDate');
  if (checkoutDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    checkoutDateInput.value = tomorrow.toISOString().split('T')[0];
  }
});

// ============================================================================
// 2. SCROLL PROGRESS BAR & STICKY NAVBAR
// ============================================================================
function initScrollProgressBar() {
  const progressBar = document.getElementById('scrollProgressBar');
  const navbar = document.getElementById('siteNavbar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.site-navbar .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }

    // Sticky navbar styling
    if (navbar) {
      if (scrollTop > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active nav link highlight based on scroll position
    let currentSectionId = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollTop >= secTop && scrollTop < secTop + secHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// 3. CUSTOM CURSOR
// ============================================================================
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(renderRing);
  }
  renderRing();

  // Hover states on interactives
  const interactives = document.querySelectorAll('a, button, input, select, textarea, .gallery-item, .program-card, .price-switch, .unit-pill-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });
}

// ============================================================================
// 4. MOBILE DRAWER NAVIGATION
// ============================================================================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (hamburgerBtn && mobileDrawer) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });
}

function openMobileMenu() {
  mobileDrawer.classList.add('open');
  hamburgerBtn.classList.add('active');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileDrawer.classList.remove('open');
  hamburgerBtn.classList.remove('active');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// ============================================================================
// 5. HERO TYPING & WORD REVEAL ANIMATION
// ============================================================================
function initTypingEffect() {
  const typingTarget = document.getElementById('typingText');
  if (!typingTarget) return;

  const phrases = [
    "STRONGEST SELF",
    "INNER BEAST",
    "LEGACY IN IRON",
    "PEAK PHYSIQUE",
    "UNSTOPPABLE FORCE"
  ];

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typingTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2200; // Pause at full phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // Pause before typing next
    }

    setTimeout(typeLoop, typeSpeed);
  }

  setTimeout(typeLoop, 1500);
}

// ============================================================================
// 6. MOTIVATIONAL WORKOUT HYPE SYNTH PUMP BEAT (Web Audio API)
// ============================================================================
function initAudioPumpButton() {
  const btn = document.getElementById('audioPumpBtn');
  const btnText = document.getElementById('audioPumpText');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!isPlayingPumpBeat) {
      startPumpBeat();
      btn.classList.add('playing');
      if (btnText) btnText.textContent = 'STOP BEAT';
    } else {
      stopPumpBeat();
      btn.classList.remove('playing');
      if (btnText) btnText.textContent = 'PUMP BEAT';
    }
  });
}

function startPumpBeat() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  isPlayingPumpBeat = true;
  let step = 0;
  const tempo = 128; // 128 BPM energetic workout pace
  const stepInterval = (60 / tempo) * 1000 / 2; // eighth notes

  beatTimer = setInterval(() => {
    const now = audioCtx.currentTime;

    // 1. Kick on every quarter note (step 0, 2, 4, 6)
    if (step % 2 === 0) {
      playKick(now);
    }

    // 2. Offbeat Hi-hat (step 1, 3, 5, 7)
    if (step % 2 === 1) {
      playHihat(now);
    }

    // 3. Cyber Synth Bass Pulse on every step
    playSynthBass(now, step);

    step = (step + 1) % 8;
  }, stepInterval);
}

function stopPumpBeat() {
  isPlayingPumpBeat = false;
  if (beatTimer) {
    clearInterval(beatTimer);
    beatTimer = null;
  }
}

function playKick(time) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, time);
  osc.frequency.exponentialRampToValueAtTime(32, time + 0.12);
  gain.gain.setValueAtTime(0.7, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + 0.15);
}

function playHihat(time) {
  // Synthesize metallic noise
  const bufferSize = audioCtx.sampleRate * 0.04;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 7500;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.2, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start(time);
}

function playSynthBass(time, step) {
  const notes = [55, 55, 65, 55, 58, 55, 73, 65]; // Driving bass line
  const freq = notes[step] || 55;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, time);
  filter.frequency.exponentialRampToValueAtTime(120, time + 0.16);

  gain.gain.setValueAtTime(0.18, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + 0.2);
}

// ============================================================================
// 7. STATS COUNTER ON SCROLL
// ============================================================================
function initStatsCounter() {
  const counters = document.querySelectorAll('.counter');
  let hasCounted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasCounted) {
        hasCounted = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * target);
            counter.innerText = currentVal.toLocaleString('en-IN');

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target.toLocaleString('en-IN');
            }
          }
          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}

// ============================================================================
// 8. SCROLL REVEAL ANIMATIONS
// ============================================================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
}

// ============================================================================
// 9. CLASS SCHEDULE TABS
// ============================================================================
function initScheduleTabs() {
  const tabBtns = document.querySelectorAll('.schedule-tab-btn');
  const panels = document.querySelectorAll('.schedule-day-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const day = btn.getAttribute('data-day');
      const targetPanel = document.getElementById(`panel-${day}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

function bookClass(className, timeSlot, trainerName) {
  const modal = document.getElementById('bookingModal');
  document.getElementById('bookingClassName').value = className;
  document.getElementById('bookingClassTime').value = timeSlot;
  document.getElementById('bookingClassTrainer').value = trainerName;
  openModal('bookingModal');
}

function handleClassBookingSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('bookingName').value.trim();
  const phone = document.getElementById('bookingPhone').value.trim();
  const className = document.getElementById('bookingClassName').value;

  if (name.length < 2 || phone.length < 10) {
    alert("Please enter a valid full name and 10-digit mobile number.");
    return;
  }

  closeModal('bookingModal');
  showSuccessModal(
    "SPOT RESERVED!", 
    `Hey <strong>${name}</strong>, your spot for <strong>${className}</strong> is reserved! Show this confirmation at the front desk when you arrive.`
  );
}

// ============================================================================
// 10. BMI & 1RM STRENGTH CALCULATOR
// ============================================================================
function switchCalcTab(tab) {
  const tabBmiToggle = document.getElementById('tabBmiToggle');
  const tabOnermToggle = document.getElementById('tabOnermToggle');
  const panelBmi = document.getElementById('panelBmi');
  const panelOnerm = document.getElementById('panelOnerm');

  if (tab === 'bmi') {
    tabBmiToggle.classList.add('active');
    tabOnermToggle.classList.remove('active');
    panelBmi.classList.add('active');
    panelOnerm.classList.remove('active');
  } else {
    tabOnermToggle.classList.add('active');
    tabBmiToggle.classList.remove('active');
    panelOnerm.classList.add('active');
    panelBmi.classList.remove('active');
  }
}

function setBmiUnit(unit) {
  currentBmiUnit = unit;
  const metricBtn = document.getElementById('unitMetricBtn');
  const imperialBtn = document.getElementById('unitImperialBtn');
  const heightLabel = document.getElementById('bmiHeightLabel');
  const heightSuffix = document.getElementById('bmiHeightSuffix');
  const weightLabel = document.getElementById('bmiWeightLabel');
  const weightSuffix = document.getElementById('bmiWeightSuffix');
  const heightInput = document.getElementById('bmiHeight');
  const weightInput = document.getElementById('bmiWeight');

  if (unit === 'metric') {
    metricBtn.classList.add('active');
    imperialBtn.classList.remove('active');
    heightLabel.textContent = 'Height (cm)';
    heightSuffix.textContent = 'cm';
    weightLabel.textContent = 'Weight (kg)';
    weightSuffix.textContent = 'kg';
    heightInput.value = '175';
    weightInput.value = '70';
  } else {
    imperialBtn.classList.add('active');
    metricBtn.classList.remove('active');
    heightLabel.textContent = 'Height (inches)';
    heightSuffix.textContent = 'in';
    weightLabel.textContent = 'Weight (lbs)';
    weightSuffix.textContent = 'lbs';
    heightInput.value = '69';
    weightInput.value = '154';
  }
  calculateBMI();
}

function calculateBMI() {
  const heightVal = parseFloat(document.getElementById('bmiHeight').value);
  const weightVal = parseFloat(document.getElementById('bmiWeight').value);
  const resultScore = document.getElementById('bmiResultScore');
  const badge = document.getElementById('bmiCategoryBadge');
  const needle = document.getElementById('bmiGaugeNeedle');
  const recText = document.getElementById('bmiRecText');

  if (!heightVal || !weightVal || heightVal <= 0 || weightVal <= 0) return;

  let bmi = 0;
  if (currentBmiUnit === 'metric') {
    const heightM = heightVal / 100;
    bmi = weightVal / (heightM * heightM);
  } else {
    bmi = (weightVal / (heightVal * heightVal)) * 703;
  }

  const roundedBmi = bmi.toFixed(1);
  resultScore.textContent = roundedBmi;

  // Position needle on gauge (10 to 40 BMI range)
  let percent = ((bmi - 10) / (38 - 10)) * 100;
  percent = Math.max(2, Math.min(98, percent));
  needle.style.left = percent + '%';

  // Category and styling
  if (bmi < 18.5) {
    badge.textContent = "UNDERWEIGHT";
    badge.style.background = "rgba(52, 152, 219, 0.15)";
    badge.style.color = "#3498db";
    badge.style.borderColor = "#3498db";
    recText.innerHTML = "Your BMI suggests you could benefit from healthy muscle mass gain. We recommend our <strong>Weight Training & Hypertrophy Program</strong> with progressive caloric surplus and protein guidance from Coach Vikram.";
  } else if (bmi >= 18.5 && bmi < 25) {
    badge.textContent = "HEALTHY / NORMAL";
    badge.style.background = "rgba(46, 204, 113, 0.15)";
    badge.style.color = "#2ecc71";
    badge.style.borderColor = "#2ecc71";
    recText.innerHTML = "Great job! Your BMI is in the prime athletic zone. To sculpt dense muscle and enhance conditioning, try our <strong>Iron Bodybuilding & Turf CrossFit Splits</strong>.";
  } else if (bmi >= 25 && bmi < 30) {
    badge.textContent = "OVERWEIGHT";
    badge.style.background = "rgba(241, 196, 15, 0.15)";
    badge.style.color = "#f1c40f";
    badge.style.borderColor = "#f1c40f";
    recText.innerHTML = "You are in a prime position for a body recomposition. Combine our <strong>Zumba & Group Aerobics</strong> with high-intensity compound lifting to incinerate fat while preserving dense muscle.";
  } else {
    badge.textContent = "OBESE CATEGORY";
    badge.style.background = "rgba(231, 76, 60, 0.15)";
    badge.style.color = "#e74c3c";
    badge.style.borderColor = "#e74c3c";
    recText.innerHTML = "Our certified coaches in Sector 15 specialize in sustainable fat loss transformations without joint impact. Start with our <strong>1-on-1 Personal Coaching</strong> and low-impact cardio turf protocols.";
  }
}

// 1RM Calculation
function calculate1RM() {
  const weight = parseFloat(document.getElementById('onermWeight').value);
  const reps = parseInt(document.getElementById('onermReps').value);
  const resultDisplay = document.getElementById('onermResultNumber');

  if (!weight || !reps || weight <= 0 || reps <= 0) return;

  // Brzycki Formula: 1RM = Weight × (36 / (37 - Reps))
  const oneRm = weight * (36 / (37 - Math.min(reps, 12)));
  resultDisplay.innerHTML = `${oneRm.toFixed(1)} <span style="font-size:2rem; font-family:var(--font-heading);">KG</span>`;

  document.getElementById('weight95').textContent = `${(oneRm * 0.95).toFixed(1)} kg`;
  document.getElementById('weight85').textContent = `${(oneRm * 0.85).toFixed(1)} kg`;
  document.getElementById('weight75').textContent = `${(oneRm * 0.75).toFixed(1)} kg`;
  document.getElementById('weight65').textContent = `${(oneRm * 0.65).toFixed(1)} kg`;
}

// ============================================================================
// 11. PRICING TOGGLE
// ============================================================================
function setBilling(cycle) {
  currentBillingCycle = cycle;
  const toggle = document.getElementById('pricingToggleSwitch');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelYearly = document.getElementById('labelYearly');

  if (cycle === 'yearly') {
    toggle.checked = true;
    labelYearly.classList.add('active');
    labelMonthly.classList.remove('active');
  } else {
    toggle.checked = false;
    labelMonthly.classList.add('active');
    labelYearly.classList.remove('active');
  }
  updatePricingCards();
}

function toggleBillingCycle(checkbox) {
  setBilling(checkbox.checked ? 'yearly' : 'monthly');
}

function updatePricingCards() {
  const priceBasic = document.getElementById('priceBasic');
  const periodBasic = document.getElementById('periodBasic');
  const pricePro = document.getElementById('pricePro');
  const periodPro = document.getElementById('periodPro');
  const priceElite = document.getElementById('priceElite');
  const periodElite = document.getElementById('periodElite');

  if (currentBillingCycle === 'yearly') {
    // 25% discount on annual commit
    priceBasic.textContent = '1,125';
    periodBasic.textContent = '/ month (₹13,500/yr)';
    pricePro.textContent = '1,875';
    periodPro.textContent = '/ month (₹22,500/yr)';
    priceElite.textContent = '3,000';
    periodElite.textContent = '/ month (₹36,000/yr)';
  } else {
    priceBasic.textContent = '1,500';
    periodBasic.textContent = '/ month';
    pricePro.textContent = '2,500';
    periodPro.textContent = '/ month';
    priceElite.textContent = '4,000';
    periodElite.textContent = '/ month';
  }
}

function openCheckoutModal(planName, monthlyRate) {
  const modal = document.getElementById('checkoutModal');
  const rateText = currentBillingCycle === 'yearly' 
    ? `₹${(monthlyRate * 0.75).toFixed(0)}/mo (Billed annually at ₹${(monthlyRate * 0.75 * 12).toFixed(0)})`
    : `₹${monthlyRate.toLocaleString('en-IN')}/month`;

  document.getElementById('checkoutPlanName').value = planName;
  document.getElementById('checkoutPlanPrice').value = rateText;
  openModal('checkoutModal');
}

function handleMembershipSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('checkoutName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const plan = document.getElementById('checkoutPlanName').value;

  if (name.length < 2 || phone.length < 10) {
    alert("Please enter a valid full name and 10-digit mobile number.");
    return;
  }

  closeModal('checkoutModal');
  showSuccessModal(
    "WELCOME TO THE MUSCLE HUT!",
    `Congratulations <strong>${name}</strong>! Your registration for the <strong>${plan}</strong> is reserved at our promotional rate. Coach Vikram will contact you shortly on <strong>${phone}</strong>.`
  );
}

// ============================================================================
// 12. BEFORE / AFTER DRAGGABLE SLIDER
// ============================================================================
function initBeforeAfterSlider() {
  const stage = document.getElementById('baSliderStage');
  const beforeImg = document.getElementById('baBeforeImg');
  const divider = document.getElementById('baDividerHandle');
  if (!stage || !beforeImg || !divider) return;

  let isDragging = false;

  function updateSlider(x) {
    const rect = stage.getBoundingClientRect();
    let posX = x - rect.left;
    posX = Math.max(0, Math.min(posX, rect.width));
    const percent = (posX / rect.width) * 100;

    beforeImg.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
    divider.style.left = `${percent}%`;
  }

  stage.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch Support
  stage.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });
}

// ============================================================================
// 13. FILTERABLE GALLERY & LIGHTBOX
// ============================================================================
function initGalleryFilterAndLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-tab-btn');
  const items = document.querySelectorAll('.gallery-item');

  // Populate global gallery list for next/previous lightbox navigation
  items.forEach((item, idx) => {
    const img = item.querySelector('.gallery-item-img');
    const caption = item.querySelector('.gallery-item-caption')?.textContent || '';
    galleryItemsList.push({
      src: img?.getAttribute('src') || '',
      caption: caption
    });
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        const categories = item.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightboxModal');
    if (modal && modal.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    }
  });
}

function openLightbox(src, caption, fallbackSrc) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');

  img.src = src;
  if (fallbackSrc) {
    img.onerror = () => { img.src = fallbackSrc; };
  } else {
    img.onerror = null;
  }
  captionEl.textContent = caption || '';
  
  // Find index in list
  const idx = galleryItemsList.findIndex(item => item.src === src);
  if (idx !== -1) lightboxCurrentIndex = idx;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function prevLightbox() {
  if (galleryItemsList.length === 0) return;
  lightboxCurrentIndex = (lightboxCurrentIndex - 1 + galleryItemsList.length) % galleryItemsList.length;
  const item = galleryItemsList[lightboxCurrentIndex];
  document.getElementById('lightboxImg').src = item.src;
  document.getElementById('lightboxCaption').textContent = item.caption;
}

function nextLightbox() {
  if (galleryItemsList.length === 0) return;
  lightboxCurrentIndex = (lightboxCurrentIndex + 1) % galleryItemsList.length;
  const item = galleryItemsList[lightboxCurrentIndex];
  document.getElementById('lightboxImg').src = item.src;
  document.getElementById('lightboxCaption').textContent = item.caption;
}

// ============================================================================
// 14. TESTIMONIALS CAROUSEL
// ============================================================================
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.t-dot');
  const totalSlides = 3;

  function updateSlide(index) {
    currentTestimonialIndex = index;
    if (track) {
      track.style.transform = `translateX(-${currentTestimonialIndex * 100}%)`;
    }
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentTestimonialIndex);
    });
  }

  window.goToTestimonial = function(index) {
    updateSlide(index);
    resetTestimonialTimer();
  };

  function startAutoPlay() {
    testimonialInterval = setInterval(() => {
      const nextIndex = (currentTestimonialIndex + 1) % totalSlides;
      updateSlide(nextIndex);
    }, 5500);
  }

  function resetTestimonialTimer() {
    if (testimonialInterval) clearInterval(testimonialInterval);
    startAutoPlay();
  }

  startAutoPlay();

  // Pause on hover
  const viewport = document.getElementById('testimonialViewport');
  if (viewport) {
    viewport.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
    viewport.addEventListener('mouseleave', () => resetTestimonialTimer());
  }
}

// ============================================================================
// 15. FREE TRIAL FORM VALIDATION & SUBMISSION
// ============================================================================
function handleTrialSubmit(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('trialName');
  const phoneInput = document.getElementById('trialPhone');
  const emailInput = document.getElementById('trialEmail');
  const goalSelect = document.getElementById('trialGoal');

  let isValid = true;

  // Validate Name
  if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
    nameInput.classList.add('is-invalid');
    isValid = false;
  } else {
    nameInput.classList.remove('is-invalid');
  }

  // Validate Indian Phone (10 digits)
  const phoneVal = phoneInput.value.trim().replace(/\D/g, '');
  if (phoneVal.length < 10) {
    phoneInput.classList.add('is-invalid');
    isValid = false;
  } else {
    phoneInput.classList.remove('is-invalid');
  }

  // Validate Email (if provided)
  if (emailInput.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('is-invalid');
      isValid = false;
    } else {
      emailInput.classList.remove('is-invalid');
    }
  } else {
    emailInput.classList.remove('is-invalid');
  }

  // Validate Goal
  if (!goalSelect.value) {
    goalSelect.classList.add('is-invalid');
    isValid = false;
  } else {
    goalSelect.classList.remove('is-invalid');
  }

  if (!isValid) return;

  const clientName = nameInput.value.trim();
  const goal = goalSelect.value;
  const slot = document.getElementById('trialSlot').value;

  // Reset form
  e.target.reset();

  showSuccessModal(
    "FREE PASS CONFIRMED!",
    `Congratulations <strong>${clientName}</strong>! Your 1-Day Free Pass for <strong>${goal}</strong> (${slot}) has been approved. Show this pass on your phone at our Sector 15 gym reception.`
  );
}

// Newsletter
function handleNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('newsEmail');
  const successEl = document.getElementById('newsSuccess');
  if (input.value.trim()) {
    input.value = '';
    if (successEl) successEl.style.display = 'block';
  }
}

// ============================================================================
// 16. PROGRAM MODAL DATA & CONTROLLER
// ============================================================================
const programDetailsData = {
  'weight-training': {
    title: 'Weight Training & Iron Hypertrophy',
    badge: 'STRENGTH & HYPERTROPHY',
    desc: 'Our flagship weight room is engineered for serious lifters. We feature competition-grade Olympic barbells, calibrated cast-iron and bumper plates, and a complete line of bio-mechanical pin-loaded and plate-loaded machines designed to isolate specific muscle groups through complete ranges of motion.',
    amenities: [
      'Olympic Squat Racks and Deadlift Platforms',
      'Dumbbell racks progressing up to 50 kg pairs',
      'Dual adjustable cable crossovers and multi-pulley stations',
      'Specialized chest, back, and hamstring isolation machines',
      'Daily posture evaluation and form corrections by Coach Vikram'
    ],
    recommendedFor: 'Anyone wanting to build lean muscle mass, gain raw functional power, and reshape body composition.'
  },
  'crossfit': {
    title: 'CrossFit & Functional Turf Conditioning',
    badge: 'EXPLOSIVE STAMINA',
    desc: 'Unleash your athleticism on our dedicated indoor green turf track. This program blends functional movements, calisthenics, and high-intensity conditioning to create relentless endurance, explosive hip drive, and ironclad work capacity.',
    amenities: [
      'Heavy push/pull prowler sleds with Olympic plate capacity',
      'Heavy-duty 1.5-inch combat battle ropes',
      'Cast-iron Russian kettlebell racks from 8kg to 32kg',
      'Plyometric jump boxes and slam ball stations',
      'Agility ladder and turf sprint lanes'
    ],
    recommendedFor: 'Athletes, powerlifters wanting conditioning, and anyone seeking maximum caloric burn and metabolic conditioning.'
  },
  'zumba': {
    title: 'Dynamic Zumba & Dance Aerobics',
    badge: 'HIGH-OCTANE CARDIO',
    desc: 'Experience Sonipat’s most electrifying group fitness class! Set to infectious Punjabi beats, Latin rhythms, and modern dance music, our Zumba sessions burn upwards of 600 calories an hour while elevating mood and cardiovascular health.',
    amenities: [
      'Choreographed by licensed Zumba specialist Coach Priya',
      'High-impact acoustic sound setup and laser mood lighting',
      'Non-slip cushioned turf and aerobics studio flooring',
      'Supportive and motivating group culture suitable for all ages',
      'Morning (7:30 AM) and Evening (7:00 PM) batches'
    ],
    recommendedFor: 'Women and men looking for fun, high-energy fat burning without the monotony of treadmills.'
  },
  'yoga': {
    title: 'Power Yoga & Joint Mobility',
    badge: 'CORE & RECOVERY',
    desc: 'Heavy lifting tightens fascial tissue and compresses spinal discs. Our Power Yoga and Mobility class systematically restores joint articular space, improves pelvic symmetry, builds unbreakable core stability, and bulletproofs you against lifting injuries.',
    amenities: [
      'High-density antibacterial yoga mats provided',
      'Thoracic spine and hip capsule decompression sequences',
      'Deep diaphragmatic breathing techniques for nervous system recovery',
      'Isometric core bracing drills for squat and deadlift transfer',
      'Foam rolling and fascial release instruction'
    ],
    recommendedFor: 'Lifters with stiff shoulders/lower backs, athletes needing flexibility, and anyone seeking stress relief.'
  },
  'boxing': {
    title: 'Boxing & Combat Conditioning',
    badge: 'REFLEXES & AGILITY',
    desc: 'Condition like a combat athlete. Master technical punching combinations, slipping drills, rapid rotational hip torque, and relentless interval conditioning on heavy bags and speed stations.',
    amenities: [
      'Professional heavy hanging leather bags',
      'Focus mitt rounds with certified combat coach',
      'Skipping rope speed technique instruction',
      'Rotational medicine ball power drills',
      'Hand wraps and gloves sanitation protocols'
    ],
    recommendedFor: 'Individuals looking to build real athletic endurance, hand-eye coordination, and stress de-escalation.'
  },
  'personal-training': {
    title: '1-on-1 VIP Personal Coaching',
    badge: 'FAST-TRACK TRANSFORMATION',
    desc: 'The fastest path to your goal. Work exclusively with a certified personal coach who designs your custom lifting split, supervises every single rep, checks biomechanical angles, and monitors your dietary macros weekly.',
    amenities: [
      'Dedicated 1-on-1 private training sessions',
      'Customized macronutrient diet and grocery blueprint',
      'Weekly skinfold body fat & circumferences tracking',
      'Priority access to all machines during peak hours',
      'Direct WhatsApp trainer consultation 24/7'
    ],
    recommendedFor: 'Beginners needing safe instruction, individuals with stubborn plateaus, and busy professionals needing strict accountability.'
  }
};

function openProgramModal(programKey) {
  const data = programDetailsData[programKey];
  if (!data) return;

  const contentBox = document.getElementById('programModalContent');
  contentBox.innerHTML = `
    <span class="hero-badge-tag" style="margin-bottom:12px; font-size:0.75rem;">${data.badge}</span>
    <h3 style="font-family:var(--font-display); font-size:2.2rem; color:var(--text-white); margin-bottom:14px; letter-spacing:1px;">
      ${data.title}
    </h3>
    <p style="color:var(--text-light); line-height:1.7; font-size:1rem; margin-bottom:20px;">
      ${data.desc}
    </p>
    <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:var(--radius-sm); padding:20px; margin-bottom:24px;">
      <h5 style="color:var(--primary); font-family:var(--font-heading); font-size:1rem; letter-spacing:1px; margin-bottom:12px; text-transform:uppercase;">
        <i class="fa-solid fa-list-check"></i> What's Included in this Program:
      </h5>
      <ul style="list-style:none; display:flex; flex-direction:column; gap:10px;">
        ${data.amenities.map(a => `<li style="display:flex; align-items:flex-start; gap:10px; font-size:0.92rem; color:var(--text-light);"><i class="fa-solid fa-check" style="color:var(--primary); margin-top:3px;"></i> <span>${a}</span></li>`).join('')}
      </ul>
    </div>
    <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:24px;">
      <strong>Recommended For:</strong> ${data.recommendedFor}
    </div>
    <div style="display:flex; gap:14px; flex-wrap:wrap;">
      <a href="#contact" class="btn btn-primary" onclick="closeModal('programDetailModal')" style="flex:1;">TRY IN FREE PASS</a>
      <a href="https://wa.me/919034158102?text=Hi%20Muscle%20Hut%2C%20tell%20me%20more%20about%20${encodeURIComponent(data.title)}" target="_blank" rel="noopener" class="btn btn-secondary" style="flex:1;">
        <i class="fa-brands fa-whatsapp"></i> WHATSAPP INQUIRY
      </a>
    </div>
  `;

  openModal('programDetailModal');
}

// ============================================================================
// 17. MODAL UTILITY FUNCTIONS
// ============================================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modals when clicking backdrop
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('site-modal')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

function showSuccessModal(title, message) {
  document.getElementById('successModalTitle').innerHTML = title;
  document.getElementById('successModalMessage').innerHTML = message;
  openModal('successModal');
}
