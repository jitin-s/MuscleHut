(function () {
  const config = window.MUSCLE_HUT_SUPABASE || {}, loginPanel = document.getElementById('loginPanel'), dashboard = document.getElementById('dashboardPanel');
  if (!window.supabase || !config.url || config.url.includes('your-project')) { document.getElementById('loginMessage').textContent = 'Supabase configuration is not connected yet.'; return; }
  const client = window.supabase.createClient(config.url, config.anonKey);
  client.auth.onAuthStateChange((_event, session) => { if (session) showDashboard(session); else showLogin(); });
  document.getElementById('loginForm').addEventListener('submit', async event => { event.preventDefault(); setMessage('loginMessage', ''); const { error } = await client.auth.signInWithPassword({ email: document.getElementById('loginEmail').value.trim(), password: document.getElementById('loginPassword').value }); if (error) setMessage('loginMessage', 'Sign-in failed. Check your credentials or MFA policy.'); });
  document.getElementById('logoutButton').addEventListener('click', () => client.auth.signOut());
  document.getElementById('articleForm').addEventListener('submit', async event => {
    event.preventDefault(); setMessage('articleMessage', '');
    const title = document.getElementById('articleTitle').value.trim(), slug = document.getElementById('articleSlug').value.trim(), excerpt = document.getElementById('articleExcerpt').value.trim(), content = document.getElementById('articleContent').value.trim(), author_name = document.getElementById('articleAuthor').value.trim(), published = document.getElementById('articlePublished').checked;
    const { error } = await client.from('articles').insert({ title, slug, excerpt, content, author_name, published, published_at: published ? new Date().toISOString() : null });
    if (error) { setMessage('articleMessage', 'Article was not saved. Check the slug and admin permissions.'); return; }
    setMessage('articleMessage', 'Article saved securely.'); event.target.reset(); loadArticles();
  });
  async function showDashboard(session) {
    const user = session.user;
    if (user.app_metadata?.role !== 'admin') { await client.auth.signOut(); setMessage('loginMessage', 'This account is not authorized for article administration.'); return; }
    if (config.requireMfa && user.aal !== 'aal2') { await client.auth.signOut(); setMessage('loginMessage', 'Multi-factor authentication is required for this admin account. Enable MFA in Supabase Auth, then sign in again.'); return; }
    loginPanel.classList.add('hidden'); dashboard.classList.remove('hidden'); loadArticles();
  }
  function showLogin() { dashboard.classList.add('hidden'); loginPanel.classList.remove('hidden'); }
  async function loadArticles() { const { data } = await client.from('articles').select('title,published,created_at').order('created_at', { ascending: false }); document.getElementById('adminArticleList').innerHTML = (data || []).map(item => `<div><strong>${escapeHtml(item.title)}</strong><span>${item.published ? 'Published' : 'Draft'}</span></div>`).join('') || '<p class="muted">No articles yet.</p>'; }
  function setMessage(id, message) { document.getElementById(id).textContent = message; }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character])); }
}());
