(function () {
  const list = document.getElementById('articleList');
  const config = window.MUSCLE_HUT_SUPABASE || {};
  if (!window.supabase || !config.url || config.url.includes('your-project')) {
    list.innerHTML = '<p class="empty-state">Articles are being connected. Add the Supabase public configuration before publishing.</p>';
    return;
  }
  const client = window.supabase.createClient(config.url, config.anonKey);
  client.from('articles').select('title,slug,excerpt,author_name,category,tags,reading_time_minutes,cover_image_url,published_at').eq('published', true).order('published_at', { ascending: false }).then(({ data, error }) => {
    if (error) { list.innerHTML = '<p class="empty-state">Articles could not be loaded right now.</p>'; return; }
    list.innerHTML = data.length ? data.map(article => `<article class="article-card">${article.cover_image_url ? `<img class="article-cover" src="${safeUrl(article.cover_image_url)}" alt="">` : ''}<p class="eyebrow">${escapeHtml(article.category || 'Training')} · ${article.reading_time_minutes || 1} MIN READ</p><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.excerpt)}</p><div class="article-meta">By ${escapeHtml(article.author_name)} <a href="article.html?slug=${encodeURIComponent(article.slug)}">READ ARTICLE →</a></div></article>`).join('') : '<p class="empty-state">No published articles yet.</p>';
  });
  function safeUrl(value) { try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? escapeHtml(url.href) : ''; } catch (_) { return ''; } }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character])); }
}());
