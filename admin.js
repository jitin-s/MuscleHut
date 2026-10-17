(function () {
  const config = window.MUSCLE_HUT_SUPABASE || {};
  const loginPanel = document.getElementById('loginPanel');
  const mfaPanel = document.getElementById('mfaPanel');
  const dashboard = document.getElementById('dashboardPanel');
  const titleInput = document.getElementById('articleTitle');
  const slugInput = document.getElementById('articleSlug');
  const excerptInput = document.getElementById('articleExcerpt');
  const contentInput = document.getElementById('articleContent');
  let pendingFactorId = null;
  let pendingChallengeId = null;
  let slugWasEdited = false;

  if (!window.supabase || !config.url || config.url.includes('your-project')) {
    setMessage('loginMessage', 'Supabase configuration is not connected yet.');
    return;
  }

  const client = window.supabase.createClient(config.url, config.anonKey);
  client.auth.onAuthStateChange((_event, session) => { if (session) routeSession(session); else showLogin(); });

  document.getElementById('loginForm').addEventListener('submit', async event => {
    event.preventDefault();
    setMessage('loginMessage', '');
    const { error } = await client.auth.signInWithPassword({
      email: document.getElementById('loginEmail').value.trim(),
      password: document.getElementById('loginPassword').value
    });
    if (error) setMessage('loginMessage', 'Sign-in failed. Check your credentials.');
  });

  document.getElementById('mfaForm').addEventListener('submit', async event => {
    event.preventDefault();
    const code = document.getElementById('mfaCode').value.trim();
    if (!/^\d{6}$/.test(code) || !pendingFactorId || !pendingChallengeId) {
      setMessage('mfaMessage', 'Enter the six-digit authenticator code.');
      return;
    }
    const { error } = await client.auth.mfa.verify({ factorId: pendingFactorId, challengeId: pendingChallengeId, code });
    if (error) { setMessage('mfaMessage', 'That code is invalid or expired. Try the latest code.'); return; }
    const { data } = await client.auth.getSession();
    if (data.session) routeSession(data.session);
  });

  document.getElementById('mfaCancelButton').addEventListener('click', () => client.auth.signOut());
  document.getElementById('logoutButton').addEventListener('click', () => client.auth.signOut());

  document.getElementById('articleForm').addEventListener('submit', async event => {
    event.preventDefault();
    setMessage('articleMessage', '');
    const published = document.getElementById('articlePublished').checked;
    const article = {
      title: titleInput.value.trim(),
      slug: slugInput.value.trim(),
      excerpt: excerptInput.value.trim(),
      content: contentInput.value.trim(),
      author_name: document.getElementById('articleAuthor').value.trim(),
      category: document.getElementById('articleCategory').value,
      tags: document.getElementById('articleTags').value.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean).slice(0, 12),
      cover_image_url: document.getElementById('articleCoverImage').value.trim() || null,
      reading_time_minutes: readingTime(contentInput.value),
      published,
      published_at: published ? new Date().toISOString() : null
    };
    const { error } = await client.from('articles').insert(article);
    if (error) { setMessage('articleMessage', 'Article was not saved. Check that the latest SQL migration is installed.'); return; }
    setMessage('articleMessage', published ? 'Article published securely.' : 'Draft saved securely.');
    event.target.reset();
    slugWasEdited = false;
    updateCounts();
    updatePreview();
    loadArticles();
  });

  titleInput.addEventListener('input', () => {
    if (!slugWasEdited) slugInput.value = slugify(titleInput.value);
    updateCounts();
    updatePreview();
  });
  slugInput.addEventListener('input', () => { slugWasEdited = true; slugInput.value = slugify(slugInput.value); });
  [excerptInput, contentInput, document.getElementById('articleAuthor'), document.getElementById('articleCategory'), document.getElementById('articleTags'), document.getElementById('articleCoverImage')].forEach(input => input.addEventListener('input', updatePreview));
  [excerptInput, contentInput].forEach(input => input.addEventListener('input', updateCounts));
  document.getElementById('togglePreview').addEventListener('click', event => {
    const hidden = document.getElementById('articlePreview').classList.toggle('hidden');
    event.target.textContent = hidden ? 'SHOW PREVIEW' : 'HIDE PREVIEW';
  });
  document.getElementById('saveDraftButton').addEventListener('click', () => { document.getElementById('articlePublished').checked = false; });
  document.getElementById('publishButton').addEventListener('click', () => { document.getElementById('articlePublished').checked = true; });
  updateCounts();
  updatePreview();

  async function routeSession(session) {
    if (session.user.app_metadata?.role !== 'admin') {
      await client.auth.signOut();
      setMessage('loginMessage', 'This account is not authorized for article administration.');
      return;
    }
    if (config.requireMfa && session.user.aal !== 'aal2') { await prepareMfa(); return; }
    showDashboard();
  }

  async function prepareMfa() {
    const { data, error } = await client.auth.mfa.listFactors();
    if (error) { setMessage('loginMessage', 'MFA setup could not be loaded.'); return; }
    const verified = (data.all || []).find(factor => factor.factor_type === 'totp' && factor.status === 'verified');
    if (!verified) { setMessage('loginMessage', 'MFA enrollment is required for this account.'); return; }
    pendingFactorId = verified.id;
    const { data: challenge, error: challengeError } = await client.auth.mfa.challenge({ factorId: verified.id });
    if (challengeError) { setMessage('mfaMessage', 'A verification challenge could not be created.'); showMfa(); return; }
    pendingChallengeId = challenge.id;
    document.getElementById('mfaIntro').textContent = 'Enter the six-digit code from your authenticator app.';
    document.getElementById('mfaEnrollment').classList.add('hidden');
    showMfa();
  }

  function showMfa() { loginPanel.classList.add('hidden'); dashboard.classList.add('hidden'); mfaPanel.classList.remove('hidden'); document.getElementById('mfaCode').focus(); }
  function showDashboard() { loginPanel.classList.add('hidden'); mfaPanel.classList.add('hidden'); dashboard.classList.remove('hidden'); loadArticles(); }
  function showLogin() { dashboard.classList.add('hidden'); mfaPanel.classList.add('hidden'); loginPanel.classList.remove('hidden'); }
  async function loadArticles() {
    const { data } = await client.from('articles').select('title,category,published,reading_time_minutes,created_at').order('created_at', { ascending: false });
    document.getElementById('adminArticleList').innerHTML = (data || []).map(item => `<div><strong>${escapeHtml(item.title)}</strong><span>${item.published ? 'Published' : 'Draft'} · ${escapeHtml(item.category || 'Training')} · ${item.reading_time_minutes || 1} min</span></div>`).join('') || '<p class="muted">No articles yet.</p>';
  }
  function slugify(value) { return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 160); }
  function readingTime(value) { return Math.max(1, Math.ceil(value.trim().split(/\s+/).filter(Boolean).length / 200)); }
  function updateCounts() {
    document.getElementById('titleCount').textContent = `${titleInput.value.length}/160`;
    document.getElementById('excerptCount').textContent = `${excerptInput.value.length}/300`;
    document.getElementById('contentCount').textContent = `${contentInput.value.length}/50000`;
    document.getElementById('readingTime').textContent = `${readingTime(contentInput.value)} min`;
  }
  function updatePreview() {
    document.querySelector('#articlePreview .eyebrow').textContent = `${document.getElementById('articleCategory').value} · PREVIEW`;
    document.querySelector('#articlePreview h2').textContent = titleInput.value.trim() || 'Your article title';
    document.querySelector('#articlePreview .preview-excerpt').textContent = excerptInput.value.trim() || 'Your excerpt will appear here.';
    document.querySelector('#articlePreview .preview-body').textContent = contentInput.value.trim() || 'Your article content preview will appear here.';
  }
  function setMessage(id, message) { document.getElementById(id).textContent = message; }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character])); }
}());
