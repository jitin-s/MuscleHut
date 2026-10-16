(function () {
  const list = document.getElementById('articleList');
  const config = window.MUSCLE_HUT_SUPABASE || {};
  if (!window.supabase || !config.url || config.url.includes('your-project')) {
    list.innerHTML = '<p class="empty-state">Articles are being connected. Add the Supabase public configuration before publishing.</p>';
    return;
  }
  const client = window.supabase.createClient(config.url, config.anonKey);
  client.from('articles').select('title,slug,excerpt,author_name,published_at').eq('published', true).order('published_at', { ascending: false }).then(({ data, error }) => {
    if (error) { list.innerHTML = '<p class="empty-state">Articles could not be loaded right now.</p>'; return; }
    list.innerHTML = data.length ? data.map(article => `<article class="article-card"><p class="eyebrow">${new Date(article.published_at || Date.now()).toLocaleDateString()}</p><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.excerpt)}</p><div class="article-meta">By ${escapeHtml(article.author_name)} <a href="article.html?slug=${encodeURIComponent(article.slug)}">READ ARTICLE →</a></div></article>`).join('') : '<p class="empty-state">No published articles yet.</p>';
  });
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character])); }
}());
