(function () {
  const view = document.getElementById('articleView'), slug = new URLSearchParams(location.search).get('slug'), config = window.MUSCLE_HUT_SUPABASE || {};
  if (!slug || !window.supabase || !config.url || config.url.includes('your-project')) { view.innerHTML = '<p class="empty-state">This article is not available.</p>'; return; }
  window.supabase.createClient(config.url, config.anonKey).from('articles').select('title,content,author_name,published_at').eq('slug', slug).eq('published', true).maybeSingle().then(({ data, error }) => {
    if (error || !data) { view.innerHTML = '<p class="empty-state">This article is not available.</p>'; return; }
    view.innerHTML = `<article class="article-detail"><p class="eyebrow">${new Date(data.published_at || Date.now()).toLocaleDateString()}</p><h1>${escapeHtml(data.title)}</h1><p class="article-byline">By ${escapeHtml(data.author_name)}</p><div class="article-content">${formatContent(data.content)}</div></article>`;
  });
  function formatContent(value) { return escapeHtml(value).split(/\n{2,}/).map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join(''); }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character])); }
}());
