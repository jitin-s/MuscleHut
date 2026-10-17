(function () {
  const view = document.getElementById('articleView'), slug = new URLSearchParams(location.search).get('slug'), config = window.MUSCLE_HUT_SUPABASE || {};
  if (!slug || !window.supabase || !config.url || config.url.includes('your-project')) { view.innerHTML = '<p class="empty-state">This article is not available.</p>'; return; }
  window.supabase.createClient(config.url, config.anonKey).from('articles').select('title,content,author_name,category,tags,reading_time_minutes,cover_image_url,published_at').eq('slug', slug).eq('published', true).maybeSingle().then(({ data, error }) => {
    if (error || !data) { view.innerHTML = '<p class="empty-state">This article is not available.</p>'; return; }
    view.innerHTML = `<article class="article-detail">${data.cover_image_url ? `<img class="article-cover article-cover-large" src="${safeUrl(data.cover_image_url)}" alt="">` : ''}<p class="eyebrow">${escapeHtml(data.category || 'Training')} · ${data.reading_time_minutes || 1} MIN READ</p><h1>${escapeHtml(data.title)}</h1><p class="article-byline">By ${escapeHtml(data.author_name)}</p><div class="article-tags">${(data.tags || []).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div><div class="article-content">${formatContent(data.content)}</div></article>`;
  });
  function safeUrl(value) { try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? escapeHtml(url.href) : ''; } catch (_) { return ''; } }
  function formatContent(value) { return escapeHtml(value).split(/\n{2,}/).map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join(''); }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character])); }
}());
