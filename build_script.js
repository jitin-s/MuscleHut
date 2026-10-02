/**
 * THE MUSCLE HUT GYM — PRODUCTION CLIENT JAVASCRIPT
 * Advanced vanilla JavaScript: Audio synthesizer, Ember particles canvas,
 * Barbell plate visualizer, 15-second routine quiz, Confetti explosion,
 * UI sound effects, BMI & 1RM calculator, Before/After slider, Lightbox.
 */

// Global State
let isPlayingPumpBeat = false;
let sfxEnabled = true;
let audioCtx = null;
let beatTimer = null;
let currentBmiUnit = 'metric';
let currentBillingCycle = 'monthly';
let currentTestimonialIndex = 0;
let testimonialInterval = null;
let lightboxCurrentIndex = 0;
const galleryItemsList = [];
let quizAnswers = {};

// ============================================================================
// 1. INITIALIZATION & DOM READY
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  // Preloader fade-out
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 400);
  }

  initCustomCursor();
  initScrollProgressBar();
  initHeroParticles();
  initFacilitySwitcher();
  initTypingEffect();
  initLiveClockAndCapacity();
  initAudioControls();
  initStatsCounter();
  initScrollReveal();
  initScheduleTabs();
  initBeforeAfterSlider();
  initGalleryFilterAndLightbox();
  initTestimonialCarousel();
  
  // Calculate initial metrics
  calculateBMI();
  calculate1RM();

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
    
    if (progressBar) progressBar.style.width = scrollPercent + '%';

    if (navbar) {
      if (scrollTop > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }

    if (backToTopBtn) {
      if (scrollTop > 350) backToTopBtn.classList.add('visible');
      else backToTopBtn.classList.remove('visible');
    }

    // Active nav link highlight
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
  playUiSfx('click');
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

  const interactives = document.querySelectorAll('a, button, input, select, textarea, .gallery-item, .program-card, .price-switch, .unit-pill-btn, .facility-chip-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('cursor-hover');
    });
  });
}

// ============================================================================
// 4. HERO EMBER PARTICLES CANVAS
// ============================================================================
function initHeroParticles() {
  const canvas = document.getElementById('heroParticlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 45;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      color: Math.random() > 0.3 ? '#00ff66' : '#ff4444'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < 0) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(render);
  }
  render();
}

// ============================================================================
// 5. HERO FACILITY SWITCHER
// ============================================================================
function initFacilitySwitcher() {
  const chips = document.querySelectorAll('.facility-chip-btn');
  const bgImg = document.getElementById('heroBackdropImg');
  if (!chips.length || !bgImg) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      playUiSfx('tick');
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const newSrc = chip.getAttribute('data-img');
      const fallbackSrc = chip.getAttribute('data-fallback');

      bgImg.style.opacity = '0.3';
      setTimeout(() => {
        bgImg.src = newSrc;
        if (fallbackSrc) {
          bgImg.onerror = () => { bgImg.src = fallbackSrc; };
        }
        bgImg.style.opacity = '1';
      }, 250);
    });
  });
}

// ============================================================================
// 6. LIVE SONIPAT CLOCK & DYNAMIC CAPACITY
// ============================================================================
function initLiveClockAndCapacity() {
  const clockEl = document.getElementById('liveClockText');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    // Format to 12-hour
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    // Estimate crowd capacity based on gym hour patterns
    let capacityText = "OPEN";
    if (hours >= 5 && hours < 9) {
      capacityText = "OPEN • 72% PRIME MORNING";
    } else if (hours >= 9 && hours < 16) {
      capacityText = "OPEN • 38% CALM / OPEN LIFT";
    } else if (hours >= 16 && hours < 21) {
      capacityText = "OPEN • 85% PEAK ENERGY";
    } else if (hours >= 21 && hours < 22) {
      capacityText = "OPEN • 45% LATE RECOVERY";
    } else {
      capacityText = "OPENS 5:30 AM • SONIPAT";
    }

    clockEl.textContent = `${capacityText} (${displayHours}:${minutes} ${ampm})`;
  }

  update();
  setInterval(update, 30000);
}

// ============================================================================
// 7. WEB AUDIO PUMP BEAT & SYNTHESIZED UI SFX
// ============================================================================
function initAudioControls() {
  const pumpBtn = document.getElementById('audioPumpBtn');
  const pumpText = document.getElementById('audioPumpText');
  const sfxBtn = document.getElementById('sfxToggleBtn');

  if (sfxBtn) {
    sfxBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      sfxBtn.classList.toggle('active', sfxEnabled);
      if (sfxEnabled) {
        sfxBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        playUiSfx('click');
      } else {
        sfxBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      }
    });
  }

  if (pumpBtn) {
    pumpBtn.addEventListener('click', () => {
      playUiSfx('click');
      if (!isPlayingPumpBeat) {
        startPumpBeat();
        pumpBtn.classList.add('playing');
        if (pumpText) pumpText.textContent = 'STOP BEAT';
      } else {
        stopPumpBeat();
        pumpBtn.classList.remove('playing');
        if (pumpText) pumpText.textContent = 'PUMP BEAT';
      }
    });
  }
}

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Synthesized Sound Effects (No external audio files required!)
function playUiSfx(type) {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'success') {
      // Harmonic celebratory chime
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.14, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    }
  } catch (e) {
    // Ignore audio errors if audio disabled by browser policy
  }
}

// 128 BPM Workout Pump Beat Synthesizer
function startPumpBeat() {
  const ctx = getAudioContext();
  isPlayingPumpBeat = true;
  let step = 0;
  const tempo = 128;
  const stepInterval = (60 / tempo) * 1000 / 2;

  beatTimer = setInterval(() => {
    const now = ctx.currentTime;

    // Sub Bass Kick on downbeats (0, 2, 4, 6)
    if (step % 2 === 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(34, now + 0.12);
      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }

    // Crisp Metallic Hi-Hat on offbeats (1, 3, 5, 7)
    if (step % 2 === 1) {
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7500;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    }

    // Plucky Sawtooth Synth Bassline
    const notes = [55, 55, 65, 55, 58, 55, 73, 65];
    const freq = notes[step] || 55;
    const sawOsc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const sawGain = ctx.createGain();
    sawOsc.type = 'sawtooth';
    sawOsc.frequency.setValueAtTime(freq, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(130, now + 0.16);
    sawGain.gain.setValueAtTime(0.18, now);
    sawGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    sawOsc.connect(filter);
    filter.connect(sawGain);
    sawGain.connect(ctx.destination);
    sawOsc.start(now);
    sawOsc.stop(now + 0.2);

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

// ============================================================================
// 8. HERO TYPING EFFECT
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
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(typeLoop, typeSpeed);
  }

  setTimeout(typeLoop, 1500);
}

// ============================================================================
// 9. STATS COUNTER & SCROLL REVEAL
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
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * target);
            counter.innerText = currentVal.toLocaleString('en-IN');

            if (progress < 1) requestAnimationFrame(updateCounter);
            else counter.innerText = target.toLocaleString('en-IN');
          }
          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}

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
// 10. CLASS SCHEDULE TABS & BOOKING
// ============================================================================
function initScheduleTabs() {
  const tabBtns = document.querySelectorAll('.schedule-tab-btn');
  const panels = document.querySelectorAll('.schedule-day-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiSfx('tick');
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const day = btn.getAttribute('data-day');
      const targetPanel = document.getElementById(`panel-${day}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

function bookClass(className, timeSlot, trainerName) {
  playUiSfx('click');
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
  triggerConfetti();
  playUiSfx('success');
  showSuccessModal(
    "SPOT RESERVED!", 
    `Hey <strong>${name}</strong>, your spot for <strong>${className}</strong> is locked in! Show this pass at the front desk when you arrive.`
  );
}

// ============================================================================
// 11. BMI & 1RM STRENGTH CALCULATOR + BARBELL VISUALIZER
// ============================================================================
function switchCalcTab(tab) {
  playUiSfx('tick');
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
  playUiSfx('tick');
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
  playUiSfx('click');
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

  resultScore.textContent = bmi.toFixed(1);

  // Position needle on gauge
  let percent = ((bmi - 10) / (38 - 10)) * 100;
  percent = Math.max(2, Math.min(98, percent));
  needle.style.left = percent + '%';

  // Category
  if (bmi < 18.5) {
    badge.textContent = "UNDERWEIGHT";
    badge.style.background = "rgba(52, 152, 219, 0.15)";
    badge.style.color = "#3498db";
    badge.style.borderColor = "#3498db";
    recText.innerHTML = "Your BMI suggests you could benefit from lean mass gain. We recommend our <strong>Weight Training & Hypertrophy Program</strong> with caloric surplus and nutrition guidance from Coach Vikram.";
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
    recText.innerHTML = "Prime position for body recomposition. Combine our <strong>Zumba & Group Aerobics</strong> with high-intensity compound lifting to incinerate fat while preserving dense muscle.";
  } else {
    badge.textContent = "OBESE CATEGORY";
    badge.style.background = "rgba(231, 76, 60, 0.15)";
    badge.style.color = "#e74c3c";
    badge.style.borderColor = "#e74c3c";
    recText.innerHTML = "Our certified coaches in Sector 15 specialize in sustainable fat loss transformations without joint impact. Start with our <strong>1-on-1 Personal Coaching</strong> and low-impact cardio turf protocols.";
  }
}

// 1RM Calculation & Olympic Barbell Plate Visualizer
function calculate1RM() {
  playUiSfx('click');
  const weight = parseFloat(document.getElementById('onermWeight').value);
  const reps = parseInt(document.getElementById('onermReps').value);
  const resultDisplay = document.getElementById('onermResultNumber');

  if (!weight || !reps || weight <= 0 || reps <= 0) return;

  const oneRm = weight * (36 / (37 - Math.min(reps, 12)));
  resultDisplay.innerHTML = `${oneRm.toFixed(1)} <span style="font-size:2rem; font-family:var(--font-heading);">KG</span>`;

  document.getElementById('weight95').textContent = `${(oneRm * 0.95).toFixed(1)} kg`;
  document.getElementById('weight85').textContent = `${(oneRm * 0.85).toFixed(1)} kg`;
  document.getElementById('weight75').textContent = `${(oneRm * 0.75).toFixed(1)} kg`;
  document.getElementById('weight65').textContent = `${(oneRm * 0.65).toFixed(1)} kg`;

  // Render Olympic Barbell Plates for the 1RM weight
  renderBarbellPlates(oneRm);
}

function renderBarbellPlates(totalKg) {
  const shaft = document.getElementById('barbellShaftDisplay');
  const textSummary = document.getElementById('plateTextSummary');
  if (!shaft || !textSummary) return;

  // Assume standard 20kg Olympic Barbell
  const barWeight = 20;
  let remainingPerSide = Math.max(0, (totalKg - barWeight) / 2);

  const availablePlates = [
    { weight: 25, class: 'plate-25', name: '25kg' },
    { weight: 20, class: 'plate-20', name: '20kg' },
    { weight: 15, class: 'plate-15', name: '15kg' },
    { weight: 10, class: 'plate-10', name: '10kg' },
    { weight: 5,  class: 'plate-5',  name: '5kg' },
    { weight: 2.5,class: 'plate-2_5',name: '2.5kg' }
  ];

  const loadedPlates = [];
  availablePlates.forEach(p => {
    while (remainingPerSide >= p.weight) {
      loadedPlates.push(p);
      remainingPerSide -= p.weight;
    }
  });

  shaft.innerHTML = '';
  if (loadedPlates.length === 0) {
    shaft.innerHTML = `<span style="color:#bbb; font-size:0.75rem; padding:0 8px;">20kg Barbell Only</span>`;
    textSummary.textContent = "Barbell Only (20 kg)";
    return;
  }

  loadedPlates.forEach(p => {
    const chip = document.createElement('span');
    chip.className = `barbell-plate-chip ${p.class}`;
    chip.textContent = p.name;
    shaft.appendChild(chip);
  });

  const plateCounts = {};
  loadedPlates.forEach(p => { plateCounts[p.name] = (plateCounts[p.name] || 0) + 1; });
  const summaryStr = Object.entries(plateCounts).map(([k, v]) => `${v}×${k}`).join(' + ');
  textSummary.innerHTML = `Per side: <strong>${summaryStr}</strong> on 20kg Olympic Bar`;
}

// ============================================================================
// 12. PRICING TOGGLE
// ============================================================================
function setBilling(cycle) {
  playUiSfx('tick');
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
  playUiSfx('click');
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
  triggerConfetti();
  playUiSfx('success');
  showSuccessModal(
    "WELCOME TO THE MUSCLE HUT!",
    `Congratulations <strong>${name}</strong>! Your registration for the <strong>${plan}</strong> is reserved at our promotional rate. Coach Vikram will contact you shortly on <strong>${phone}</strong>.`
  );
}

// ============================================================================
// 13. BEFORE / AFTER DRAGGABLE SLIDER
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
// 14. FILTERABLE GALLERY & LIGHTBOX
// ============================================================================
function initGalleryFilterAndLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-tab-btn');
  const items = document.querySelectorAll('.gallery-item');

  items.forEach((item) => {
    const img = item.querySelector('.gallery-item-img');
    const caption = item.querySelector('.gallery-item-caption')?.textContent || '';
    galleryItemsList.push({
      src: img?.getAttribute('src') || '',
      caption: caption
    });
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiSfx('tick');
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
  playUiSfx('click');
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
  
  const idx = galleryItemsList.findIndex(item => item.src === src);
  if (idx !== -1) lightboxCurrentIndex = idx;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  playUiSfx('tick');
  const modal = document.getElementById('lightboxModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function prevLightbox() {
  playUiSfx('tick');
  if (galleryItemsList.length === 0) return;
  lightboxCurrentIndex = (lightboxCurrentIndex - 1 + galleryItemsList.length) % galleryItemsList.length;
  const item = galleryItemsList[lightboxCurrentIndex];
  document.getElementById('lightboxImg').src = item.src;
  document.getElementById('lightboxCaption').textContent = item.caption;
}

function nextLightbox() {
  playUiSfx('tick');
  if (galleryItemsList.length === 0) return;
  lightboxCurrentIndex = (lightboxCurrentIndex + 1) % galleryItemsList.length;
  const item = galleryItemsList[lightboxCurrentIndex];
  document.getElementById('lightboxImg').src = item.src;
  document.getElementById('lightboxCaption').textContent = item.caption;
}

// ============================================================================
// 15. TESTIMONIALS CAROUSEL
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
    playUiSfx('tick');
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

  const viewport = document.getElementById('testimonialViewport');
  if (viewport) {
    viewport.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
    viewport.addEventListener('mouseleave', () => resetTestimonialTimer());
  }
}

// ============================================================================
// 16. FREE TRIAL FORM SUBMISSION & CONFETTI
// ============================================================================
function handleTrialSubmit(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('trialName');
  const phoneInput = document.getElementById('trialPhone');
  const emailInput = document.getElementById('trialEmail');
  const goalSelect = document.getElementById('trialGoal');

  let isValid = true;

  if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
    nameInput.classList.add('is-invalid');
    isValid = false;
  } else {
    nameInput.classList.remove('is-invalid');
  }

  const phoneVal = phoneInput.value.trim().replace(/\D/g, '');
  if (phoneVal.length < 10) {
    phoneInput.classList.add('is-invalid');
    isValid = false;
  } else {
    phoneInput.classList.remove('is-invalid');
  }

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

  if (!goalSelect.value) {
    goalSelect.classList.add('is-invalid');
    isValid = false;
  } else {
    goalSelect.classList.remove('is-invalid');
  }

  if (!isValid) {
    playUiSfx('click');
    return;
  }

  const clientName = nameInput.value.trim();
  const goal = goalSelect.value;
  const slot = document.getElementById('trialSlot').value;

  e.target.reset();
  triggerConfetti();
  playUiSfx('success');

  showSuccessModal(
    "FREE PASS CONFIRMED!",
    `Congratulations <strong>${clientName}</strong>! Your 1-Day Free Pass for <strong>${goal}</strong> (${slot}) has been approved. Show this pass on your phone at our Sector 15 gym reception.`
  );
}

function handleNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('newsEmail');
  const successEl = document.getElementById('newsSuccess');
  if (input.value.trim()) {
    input.value = '';
    playUiSfx('success');
    if (successEl) successEl.style.display = 'block';
  }
}

// Canvas Confetti Generator
function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  const colors = ['#00ff66', '#ffffff', '#ffcc00', '#ff3344', '#00f0ff'];

  for (let i = 0; i < 90; i++) {
    confetti.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      r: Math.random() * 6 + 3,
      d: Math.random() * 90,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
      tiltAngle: 0,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.8) * 16,
      gravity: 0.35,
      alpha: 1
    });
  }

  let frames = 0;
  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frames++;

    confetti.forEach(c => {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.tiltAngle += c.tiltAngleIncremental;
      c.tilt = Math.sin(c.tiltAngle) * 12;
      c.alpha -= 0.012;

      if (c.alpha > 0) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, c.alpha);
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    if (frames < 90) {
      requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  renderConfetti();
}

// ============================================================================
// 17. 15-SECOND BEAST ROUTINE MATCHER QUIZ
// ============================================================================
function answerQuiz(step, val) {
  playUiSfx('click');
  quizAnswers[`step${step}`] = val;

  document.getElementById(`quizStep${step}`).style.display = 'none';

  if (step === 1) {
    document.getElementById('quizStep2').style.display = 'block';
  } else if (step === 2) {
    document.getElementById('quizStep3').style.display = 'block';
  } else if (step === 3) {
    computeQuizResults();
  }
}

function computeQuizResults() {
  const resultStep = document.getElementById('quizResult');
  const title = document.getElementById('quizResultTitle');
  const desc = document.getElementById('quizResultDesc');
  const days = document.getElementById('quizResultDays');

  const goal = quizAnswers.step1 || 'hypertrophy';
  const freq = quizAnswers.step2 || '4days';
  const level = quizAnswers.step3 || 'intermediate';

  let routineTitle = "";
  let routineDesc = "";
  let routineDays = "";

  if (goal === 'hypertrophy') {
    if (freq === '6days') {
      routineTitle = "The Muscle Hut 6-Day PPL Hypertrophy Protocol";
      routineDesc = "High-volume Push/Pull/Legs rotation twice per week. Prioritizes compound bench press, Romanian deadlifts, squat racks, and bio-mechanical cables with progressive overload.";
      routineDays = "Schedule: Mon (Push) • Tue (Pull) • Wed (Legs) • Thu (Push) • Fri (Pull) • Sat (Legs) • Sun (Rest)";
    } else {
      routineTitle = "The 4-Day Upper / Lower Muscle Split";
      routineDesc = "Optimal hypertrophy frequency with high recovery capacity. Mon/Thu focused on chest, back, and shoulders; Tue/Fri dedicated to quads, hamstrings, and calves.";
      routineDays = "Schedule: Mon (Upper Power) • Tue (Lower Power) • Thu (Upper Hypertrophy) • Fri (Lower Hypertrophy)";
    }
  } else if (goal === 'fatloss') {
    routineTitle = "The Turf Shred & Zumba Hybrid Protocol";
    routineDesc = "Torch fat while preserving muscle mass. Alternates heavy strength maintenance days with high-octane evening Zumba sessions and prowler sled conditioning on the green turf.";
    routineDays = "Schedule: Mon (Strength) • Tue (Zumba Aerobics) • Thu (Strength) • Fri (Turf HIIT & Core) • Sat (Circuit)";
  } else {
    routineTitle = "The Sonipat Powerlifting & Strength Engine";
    routineDesc = "Engineered for maximum raw numbers. Centered around Coach Rohit's 5x5 barbell power progression on squat, bench press, and deadlift platforms.";
    routineDays = "Schedule: Mon (Heavy Bench) • Wed (Heavy Squat) • Fri (Heavy Deadlift) • Sat (Accessory & Grip)";
  }

  title.textContent = routineTitle;
  desc.textContent = routineDesc;
  days.textContent = routineDays;

  resultStep.style.display = 'block';
  triggerConfetti();
  playUiSfx('success');
}

function claimQuizPass() {
  closeModal('quizModal');
  const goal = document.getElementById('trialGoal');
  if (goal) goal.value = "Muscle Building / Hypertrophy";
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

function shareQuizOnWhatsApp() {
  const title = document.getElementById('quizResultTitle').textContent;
  const url = `https://wa.me/919034158102?text=Hi%20Muscle%20Hut%20Gym%2C%20I%20took%20the%20quiz%20and%20got%20matched%20with%3A%20${encodeURIComponent(title)}.%20I%20want%20to%20start%20this%20routine!`;
  window.open(url, '_blank');
}

// ============================================================================
// 18. PROGRAM MODALS
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
  playUiSfx('click');
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

// Modal Utility
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  playUiSfx('tick');
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

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
