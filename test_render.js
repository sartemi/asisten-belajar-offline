const fs = require('fs');

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

global.window = global;
eval(fs.readFileSync('js/reference_data.js', 'utf8'));
eval(fs.readFileSync('js/ai_engine.js', 'utf8'));
const engine = new OfflineAIEngine(REFERENCE_P13_DATA, REFERENCE_P13_DATA);

(async () => {
  const res = await engine.generateAnswer('knp lambung gak bolong kena hcl?', 'modul_02', [], { provider: 'offline' });
  
  const msg = { sender: 'ai', text: res.text, source: res.source, analysis: res.analysis };
  const formattedText = msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  
  const a = msg.analysis;
  const regBadge = a.register === 'gaul' ? '⚡ Bahasa Gaul' : (a.register === 'formal' ? '🏛️ Bahasa Baku' : '💬 Ragam Santai');
  const regClass = a.register === 'gaul' ? 'badge-gaul' : (a.register === 'formal' ? 'badge-formal' : 'badge-santai');

  const analysisHtml = `
    <div class="analysis-pill-card">
      <div class="analysis-pill-header">
        <span class="analysis-pill-title">Analisis Pertanyaan: <strong>${escapeHtml(a.topic || 'Wawasan')}</strong></span>
        <span class="analysis-reg-badge ${regClass}">${regBadge}</span>
      </div>
      <div class="analysis-field">${escapeHtml(a.intentDescription)}</div>
      ${a.normalizedQuery ? `<div class="analysis-field">${escapeHtml(a.normalizedQuery)}</div>` : ''}
      ${a.slangTokens && a.slangTokens.length > 0 ? `<div class="analysis-field">${a.slangTokens.map(s => escapeHtml(s)).join(' ')}</div>` : ''}
      <div class="analysis-field">${escapeHtml(a.disambiguation)}</div>
    </div>
  `;
  console.log('Rendering SUCCESS! Length of HTML:', analysisHtml.length);
})();
