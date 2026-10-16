let workoutData = {
  push: { title: 'Push', focus: 'Chest • Shoulders • Triceps', day: 'Monday', exercises: ['Barbell Bench Press', 'Chest Press Machine', 'Incline Dumbbell Press', 'Shoulder Press Machine', 'Cable Lateral Raise', 'Triceps Pushdown'] },
  pull: { title: 'Pull', focus: 'Back • Rear Delts • Biceps', day: 'Tuesday', exercises: ['Lat Pulldown', 'Seated Cable Row', 'Chest-Supported Row', 'Face Pull', 'Preacher Curl Machine', 'Cable Biceps Curl'] },
  legs: { title: 'Legs', focus: 'Quads • Hamstrings • Glutes • Calves', day: 'Wednesday', exercises: ['Leg Press', 'Hack Squat Machine', 'Leg Extension', 'Seated Leg Curl', 'Hip Thrust Machine', 'Standing Calf Raise'] },
  upper: { title: 'Upper Body', focus: 'Chest • Back • Shoulders • Arms', day: 'Thursday', exercises: ['Smith Machine Bench Press', 'Assisted Pull-Up', 'Machine Row', 'Pec Deck', 'Machine Shoulder Press', 'Cable Curl'] },
  lower: { title: 'Lower Body', focus: 'Quads • Posterior Chain • Core', day: 'Friday', exercises: ['Smith Machine Squat', 'Romanian Deadlift', 'Leg Press', 'Lying Leg Curl', 'Glute Kickback Machine', 'Cable Crunch'] },
  full: { title: 'Full Body', focus: 'Compound strength • Conditioning', day: 'Saturday', exercises: ['Goblet Squat', 'Dumbbell Bench Press', 'Lat Pulldown', 'Seated Row', 'Dumbbell Romanian Deadlift', 'Plank'] },
  rest: { title: 'Rest & Recovery', focus: 'Walking • Mobility • Sleep', day: 'Sunday', exercises: ['Easy Walk', 'Hip Mobility', 'Shoulder Mobility', 'Breathing Drill'] }
};
let exerciseMeta = {
  'Barbell Bench Press': ['Chest', 'Barbell'], 'Chest Press Machine': ['Chest', 'Machine'], 'Incline Dumbbell Press': ['Chest', 'Dumbbell'], 'Shoulder Press Machine': ['Shoulders', 'Machine'], 'Cable Lateral Raise': ['Shoulders', 'Cable'], 'Triceps Pushdown': ['Triceps', 'Cable'],
  'Lat Pulldown': ['Back', 'Machine'], 'Seated Cable Row': ['Back', 'Cable'], 'Chest-Supported Row': ['Back', 'Machine'], 'Face Pull': ['Rear delts', 'Cable'], 'Preacher Curl Machine': ['Biceps', 'Machine'], 'Cable Biceps Curl': ['Biceps', 'Cable'],
  'Leg Press': ['Legs', 'Machine'], 'Hack Squat Machine': ['Legs', 'Machine'], 'Leg Extension': ['Quads', 'Machine'], 'Seated Leg Curl': ['Hamstrings', 'Machine'], 'Hip Thrust Machine': ['Glutes', 'Machine'], 'Standing Calf Raise': ['Calves', 'Machine'],
  'Smith Machine Bench Press': ['Chest', 'Machine'], 'Assisted Pull-Up': ['Back', 'Machine'], 'Machine Row': ['Back', 'Machine'], 'Pec Deck': ['Chest', 'Machine'], 'Machine Shoulder Press': ['Shoulders', 'Machine'], 'Cable Curl': ['Biceps', 'Cable'],
  'Smith Machine Squat': ['Legs', 'Machine'], 'Romanian Deadlift': ['Hamstrings', 'Barbell'], 'Lying Leg Curl': ['Hamstrings', 'Machine'], 'Glute Kickback Machine': ['Glutes', 'Machine'], 'Cable Crunch': ['Core', 'Cable'], 'Goblet Squat': ['Legs', 'Dumbbell'], 'Dumbbell Bench Press': ['Chest', 'Dumbbell'], 'Dumbbell Romanian Deadlift': ['Hamstrings', 'Dumbbell'], 'Plank': ['Core', 'Bodyweight'], 'Easy Walk': ['Recovery', 'Cardio'], 'Hip Mobility': ['Mobility', 'Mobility'], 'Shoulder Mobility': ['Mobility', 'Mobility'], 'Breathing Drill': ['Recovery', 'Recovery']
};

window.addEventListener('DOMContentLoaded', () => {
  initNavigation(); renderSplit(); renderLibrary(); populateExercises(); initPlanner(); initScrollState();
});
function initNavigation() {
  const button = document.getElementById('hamburgerBtn'), drawer = document.getElementById('mobileDrawer');
  if (!button || !drawer) return;
  const setOpen = open => { drawer.classList.toggle('open', open); button.classList.toggle('active', open); button.setAttribute('aria-expanded', String(open)); drawer.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('menu-open', open); };
  button.addEventListener('click', () => setOpen(!drawer.classList.contains('open')));
  drawer.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}
function initScrollState() {
  const nav = document.getElementById('siteNavbar'), progress = document.getElementById('scrollProgressBar');
  const links = [...document.querySelectorAll('.site-navbar .nav-link')], sections = [...document.querySelectorAll('main section[id]')];
  window.addEventListener('scroll', () => { const top = window.scrollY; nav.classList.toggle('scrolled', top > 36); const max = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${max ? (top / max) * 100 : 0}%`; let current = 'home'; sections.forEach(section => { if (top >= section.offsetTop - 150) current = section.id; }); links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`)); });
}
function renderSplit() {
  const grid = document.getElementById('splitGrid');
  grid.innerHTML = Object.entries(workoutData).map(([key, item], index) => `<article class="split-card ${key === 'rest' ? 'rest-card' : ''}"><span class="split-day">${item.day}</span><div class="split-number">${String(index + 1).padStart(2, '0')}</div><h3>${item.title}</h3><p>${item.focus}</p><button class="text-action" type="button" data-day="${key}">VIEW EXERCISES <svg class="svg-icon"><use href="#icon-arrow"></use></svg></button></article>`).join('');
  grid.querySelectorAll('[data-day]').forEach(button => button.addEventListener('click', () => { document.getElementById('planExercise').value = workoutData[button.dataset.day].exercises[0]; document.getElementById('planner').scrollIntoView({ behavior: 'smooth' }); }));
}
function renderLibrary() {
  document.getElementById('exerciseLibrary').innerHTML = Object.entries(workoutData).filter(([key]) => key !== 'rest').map(([key, item]) => `<article class="library-card"><div class="library-card-head"><span>${item.day}</span><h3>${item.title}</h3></div><ul>${item.exercises.map(exercise => `<li><span>${exercise}</span><small>${exerciseMeta[exercise]?.[1] || 'Gym'}</small></li>`).join('')}</ul></article>`).join('');
}
function populateExercises() {
  const select = document.getElementById('planExercise');
  select.innerHTML = Object.values(workoutData).flatMap(item => item.exercises).filter((value, index, array) => array.indexOf(value) === index).map(exercise => `<option value="${exercise}">${exercise}</option>`).join('');
}
function initPlanner() { document.getElementById('repPlannerForm').addEventListener('submit', event => { event.preventDefault(); calculateRecommendation(); }); }
function calculateRecommendation() {
  const age = Number(document.getElementById('planAge').value), weight = Number(document.getElementById('planWeight').value), experience = document.getElementById('planExperience').value, goal = document.getElementById('planGoal').value, exercise = document.getElementById('planExercise').value;
  const result = document.getElementById('plannerResult');
  if (!age || !weight || !experience || !exercise) return;
  const isIsolation = /raise|curl|extension|pushdown|fly|pec deck|calf|crunch|face pull|mobility|breathing/i.test(exercise);
  let sets = experience === 'new' ? 2 : experience === 'regular' ? 3 : 4;
  if (weight >= 100 && !isIsolation) sets = Math.max(2, sets - 1);
  if (age >= 50) sets = Math.max(2, sets - 1);
  let reps = goal === 'strength' ? (isIsolation ? '8-10' : '4-6') : goal === 'muscle' ? (isIsolation ? '10-15' : '8-12') : (isIsolation ? '12-15' : '8-12');
  if (age >= 50) reps = isIsolation ? '10-15' : '8-12';
  const rest = goal === 'strength' && !isIsolation ? '2-3 min' : isIsolation ? '60-90 sec' : '90-120 sec';
  const category = exerciseMeta[exercise]?.[0] || 'Target muscle';
  const note = age < 18 ? 'Use supervision and prioritize technique over load.' : age >= 50 ? 'Warm up fully and stop if a movement causes pain.' : 'Choose a load that leaves 2-3 clean reps in reserve.';
  result.innerHTML = `<div class="result-top"><span class="result-kicker">YOUR STARTING POINT</span><h3>${exercise}</h3><p>${category} • ${goal === 'strength' ? 'Strength focus' : goal === 'muscle' ? 'Muscle focus' : 'Fitness focus'}</p></div><div class="result-metrics"><div><strong>${sets}</strong><span>sets</span></div><div><strong>${reps}</strong><span>reps</span></div><div><strong>${rest}</strong><span>rest</span></div></div><div class="result-guidance"><strong>How to use it</strong><p>${note} Complete all sets with controlled form. When you hit the top of the rep range for every set, add the smallest available weight next session.</p></div>`;
}
