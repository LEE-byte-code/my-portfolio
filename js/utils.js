function esc(str) {
  return str.replace(/[&<>'"]/g, function(t) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t;
  });
}
