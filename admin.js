(function () {
  const config = window.MUSCLE_HUT_SUPABASE || {};
  const loginPanel = document.getElementById('loginPanel');
  const mfaPanel = document.getElementById('mfaPanel');
  const dashboard = document.getElementById('dashboardPanel');
  let pendingFactorId = null;
  let pendingChallengeId = null;
  let enrollingFactor = false;

  if (!window.supabase || !config.url || config.url.includes('your-project')) {
    setMessage('loginMessage', 'Supabase configuration is not connected yet.');
    return;
  }

  const client = window.supabase.createClient(config.url, config.anonKey);
  client.auth.onAuthStateChange((_event, session) => {
    if (session) routeSession(session);
    else showLogin();
  });

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
    setMessage('mfaMessage', '');
    const code = document.getElementById('mfaCode').value.trim();
    if (!/^\d{6}$/.test(code) || !pendingFactorId || !pendingChallengeId) {
      setMessage('mfaMessage', 'Enter the six-digit authenticator code.');
      return;
    }
    const { error } = await client.auth.mfa.verify({
      factorId: pendingFactorId,
      challengeId: pendingChallengeId,
      code
    });
    if (error) {
      setMessage('mfaMessage', 'That code is invalid or expired. Try the latest code.');
      return;
    }
    const { data } = await client.auth.getSession();
    if (data.session) routeSession(data.session);
  });

  document.getElementById('mfaCancelButton').addEventListener('click', () => client.auth.signOut());
  document.getElementById('logoutButton').addEventListener('click', () => client.auth.signOut());

  document.getElementById('articleForm').addEventListener('submit', async event => {
    event.preventDefault();
    setMessage('articleMessage', '');
    const article = {
      title: document.getElementById('articleTitle').value.trim(),
      slug: document.getElementById('articleSlug').value.trim(),
      excerpt: document.getElementById('articleExcerpt').value.trim(),
      content: document.getElementById('articleContent').value.trim(),
      author_name: document.getElementById('articleAuthor').value.trim(),
      published: document.getElementById('articlePublished').checked,
      published_at: document.getElementById('articlePublished').checked ? new Date().toISOString() : null
    };
    const { error } = await client.from('articles').insert(article);
    if (error) {
      setMessage('articleMessage', 'Article was not saved. Check the slug and admin permissions.');
      return;
    }
    setMessage('articleMessage', 'Article saved securely.');
    event.target.reset();
    loadArticles();
  });

  async function routeSession(session) {
    const user = session.user;
    if (user.app_metadata?.role !== 'admin') {
      await client.auth.signOut();
      setMessage('loginMessage', 'This account is not authorized for article administration.');
      return;
    }
    if (config.requireMfa && user.aal !== 'aal2') {
      await prepareMfa();
      return;
    }
    showDashboard();
  }

  async function prepareMfa() {
    const { data, error } = await client.auth.mfa.listFactors();
    if (error) {
      setMessage('loginMessage', 'MFA setup could not be loaded. Check your Supabase Auth configuration.');
      return;
    }
    const verified = (data.all || []).find(factor => factor.factor_type === 'totp' && factor.status === 'verified');
    const unverified = (data.all || []).find(factor => factor.factor_type === 'totp' && factor.status === 'unverified');
    if (verified) {
      enrollingFactor = false;
      pendingFactorId = verified.id;
      const { data: challenge, error: challengeError } = await client.auth.mfa.challenge({ factorId: verified.id });
      if (challengeError) {
        setMessage('mfaMessage', 'A verification challenge could not be created.');
        showMfa();
        return;
      }
      pendingChallengeId = challenge.id;
      document.getElementById('mfaIntro').textContent = 'Enter the six-digit code from your authenticator app.';
      document.getElementById('mfaEnrollment').classList.add('hidden');
      showMfa();
      return;
    }
    if (unverified) {
      await client.auth.mfa.unenroll({ factorId: unverified.id });
    }
    const { data: enrollment, error: enrollError } = await client.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Muscle Hut Admin'
    });
    if (enrollError || !enrollment?.id || !enrollment?.totp) {
      setMessage('loginMessage', 'MFA enrollment could not be started.');
      return;
    }
    enrollingFactor = true;
    pendingFactorId = enrollment.id;
    const { data: challenge, error: challengeError } = await client.auth.mfa.challenge({ factorId: enrollment.id });
    if (challengeError) {
      setMessage('loginMessage', 'A verification challenge could not be created.');
      return;
    }
    pendingChallengeId = challenge.id;
    document.getElementById('mfaIntro').textContent = 'Scan the QR code with your authenticator app, then enter the six-digit code.';
    document.getElementById('mfaQrCode').src = enrollment.totp.qr_code;
    document.getElementById('mfaSecret').textContent = enrollment.totp.secret;
    document.getElementById('mfaEnrollment').classList.remove('hidden');
    showMfa();
  }

  function showMfa() {
    loginPanel.classList.add('hidden');
    dashboard.classList.add('hidden');
    mfaPanel.classList.remove('hidden');
    document.getElementById('mfaCode').focus();
  }

  function showDashboard() {
    loginPanel.classList.add('hidden');
    mfaPanel.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadArticles();
  }

  function showLogin() {
    dashboard.classList.add('hidden');
    mfaPanel.classList.add('hidden');
    loginPanel.classList.remove('hidden');
  }

  async function loadArticles() {
    const { data } = await client.from('articles').select('title,published,created_at').order('created_at', { ascending: false });
    document.getElementById('adminArticleList').innerHTML = (data || []).map(item => `<div><strong>${escapeHtml(item.title)}</strong><span>${item.published ? 'Published' : 'Draft'}</span></div>`).join('') || '<p class="muted">No articles yet.</p>';
  }

  function setMessage(id, message) {
    document.getElementById(id).textContent = message;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
  }
}());
