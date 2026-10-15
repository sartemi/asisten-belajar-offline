/**
 * ASISTEN BELAJAR OFFLINE - APLIKASI UTAMA (APP.JS)
 * Menghubungkan antarmuka pengguna, parser upload file, AI engine, dan Quiz engine.
 */

document.addEventListener('DOMContentLoaded', () => {
  // State Aplikasi
  const state = {
    modules: [],             // AWALNYA KOSONG sesuai instruksi pengguna
    activeModuleId: null,    // Belum ada yang dipilih sampai user upload
    activeTab: 'chatbot',    // 'chatbot' atau 'quiz'
    chatHistory: [],
    searchKeyword: '',
    quizSettings: {
      count: 5,
      type: 'mc',
      difficulty: 'all',
      mode: 'practice'
    }
  };

  // Parser & Engine
  const parser = new ModuleParser(window.REFERENCE_P13_DATA || []);
  let aiEngine = new OfflineAIEngine([], window.REFERENCE_P13_DATA || []);
  let quizEngine = new OfflineQuizEngine([]);

  // DOM Elements - Sidebar
  const moduleCountEl = document.getElementById('moduleCount');
  const moduleListEl = document.getElementById('moduleList');
  const moduleSearchInput = document.getElementById('moduleSearchInput');
  const fileUploadInput = document.getElementById('fileUploadInput');
  const btnUploadTrigger = document.getElementById('btnUploadTrigger');
  const btnLoadReferenceP13 = document.getElementById('btnLoadReferenceP13');
  const btnClearModules = document.getElementById('btnClearModules');
  const uploadDropZone = document.getElementById('uploadDropZone');

  // DOM Elements - Navigation & Header
  const tabChatbotBtn = document.getElementById('tabChatbot');
  const tabQuizBtn = document.getElementById('tabQuiz');
  const chatbotView = document.getElementById('chatbotView');
  const quizView = document.getElementById('quizView');
  const activeModuleBadge = document.getElementById('activeModuleBadge');

  // DOM Elements - Chatbot
  const chatMessagesEl = document.getElementById('chatMessages');
  const chatInputEl = document.getElementById('chatInput');
  const btnKirim = document.getElementById('btnKirim');
  const btnRangkum = document.getElementById('btnRangkum');
  const quickChipsContainer = document.getElementById('quickChipsContainer');

  // DOM Elements - Quiz View & Clean Toolbar
  const quizActiveModuleName = document.getElementById('quizActiveModuleName');
  const quizSettingsSummary = document.getElementById('quizSettingsSummary');
  const btnToggleSettings = document.getElementById('btnToggleSettings');
  const btnQuickGenerate = document.getElementById('btnQuickGenerate');

  // DOM Elements - Clean Quiz Settings Modal
  const quizSettingsOverlay = document.getElementById('quizSettingsOverlay');
  const quizSettingsModal = document.getElementById('quizSettingsModal');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const btnCancelSettings = document.getElementById('btnCancelSettings');
  const btnApplySettings = document.getElementById('btnApplySettings');

  // Quiz Play Card Elements
  const quizEmptyNotice = document.getElementById('quizEmptyNotice');
  const quizPlayCard = document.getElementById('quizPlayCard');
  const quizResultCard = document.getElementById('quizResultCard');

  const quizMetaLeft = document.getElementById('quizMetaLeft');
  const quizScoreText = document.getElementById('quizScoreText');
  const quizProgressBar = document.getElementById('quizProgressBar');
  const quizQuestionText = document.getElementById('quizQuestionText');
  const quizOptionsContainer = document.getElementById('quizOptionsContainer');

  const quizEssayContainer = document.getElementById('quizEssayContainer');
  const essayInput = document.getElementById('essayInput');
  const btnSubmitEssay = document.getElementById('btnSubmitEssay');

  const quizFeedbackBanner = document.getElementById('quizFeedbackBanner');
  const feedbackCorrectCount = document.getElementById('feedbackCorrectCount');
  const feedbackMessageText = document.getElementById('feedbackMessageText');
  const btnQuickNext = document.getElementById('btnQuickNext');

  const quizExplanationBox = document.getElementById('quizExplanationBox');
  const btnQuizPrev = document.getElementById('btnQuizPrev');
  const btnQuizNext = document.getElementById('btnQuizNext');
  const btnQuizFinish = document.getElementById('btnQuizFinish');

  // Quiz Results Elements
  const resultScoreValue = document.getElementById('resultScoreValue');
  const resultScoreBadge = document.getElementById('resultScoreBadge');
  const resultMessage = document.getElementById('resultMessage');
  const resultSummaryStats = document.getElementById('resultSummaryStats');
  const resultDetailsContainer = document.getElementById('resultDetailsContainer');
  const btnRetakeQuiz = document.getElementById('btnRetakeQuiz');
  const btnNewQuizConfig = document.getElementById('btnNewQuizConfig');

  // ==========================================
  // 1. UPLOAD & MANAJEMEN MODUL
  // ==========================================

  if (btnUploadTrigger && fileUploadInput) {
    btnUploadTrigger.addEventListener('click', () => {
      fileUploadInput.click();
    });

    fileUploadInput.addEventListener('change', async (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await handleFilesUploaded(files);
      }
      fileUploadInput.value = '';
    });
  }

  // Drag and Drop files ke sidebar
  if (uploadDropZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadDropZone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadDropZone.classList.remove('drag-active');
      });
    });

    uploadDropZone.addEventListener('drop', async (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        await handleFilesUploaded(files);
      }
    });
  }

  async function handleFilesUploaded(files) {
    showStatusNotification(`Memproses ${files.length} file...`);
    const newModules = await parser.parseFiles(files);
    
    if (newModules.length > 0) {
      newModules.forEach(newMod => {
        const existingIdx = state.modules.findIndex(m => m.id === newMod.id || m.shortName === newMod.shortName);
        if (existingIdx !== -1) {
          state.modules[existingIdx] = newMod;
        } else {
          state.modules.push(newMod);
        }
      });

      updateEngines();
      renderModules();

      if (!state.activeModuleId || !state.modules.some(m => m.id === state.activeModuleId)) {
        const bioMod = state.modules.find(m => m.id === 'modul_02');
        selectModule(bioMod ? bioMod.id : state.modules[0].id);
      } else {
        selectModule(state.activeModuleId);
      }

      showStatusNotification(`Berhasil menambahkan ${newModules.length} modul!`);
    } else {
      showStatusNotification('Tidak ada modul valid yang berhasil dibaca.');
    }
  }

  // Tombol Cepat: Muat Pustaka Bahan P13
  if (btnLoadReferenceP13) {
    btnLoadReferenceP13.addEventListener('click', () => {
      if (window.REFERENCE_P13_DATA && window.REFERENCE_P13_DATA.length > 0) {
        state.modules = JSON.parse(JSON.stringify(window.REFERENCE_P13_DATA));
        updateEngines();
        renderModules();
        selectModule('modul_02');
        showStatusNotification('10 Modul Bahan P13 berhasil dimuat!');
        resetChatMessages();
      }
    });
  }

  // Tombol Reset / Bersihkan Modul
  if (btnClearModules) {
    btnClearModules.addEventListener('click', () => {
      if (state.modules.length === 0) return;
      if (confirm('Kosongkan semua daftar modul?')) {
        state.modules = [];
        state.activeModuleId = null;
        updateEngines();
        renderModules();
        updateHeaderAndBadges();
        resetChatMessages();
        showStatusNotification('Daftar modul telah dikosongkan.');
      }
    });
  }

  function updateEngines() {
    aiEngine = new OfflineAIEngine(state.modules, window.REFERENCE_P13_DATA || []);
    quizEngine = new OfflineQuizEngine(state.modules);
  }

  function showStatusNotification(msg) {
    let notif = document.getElementById('statusToast');
    if (!notif) {
      notif = document.createElement('div');
      notif.id = 'statusToast';
      notif.className = 'status-toast';
      document.body.appendChild(notif);
    }
    notif.textContent = msg;
    notif.classList.add('show');
    setTimeout(() => {
      notif.classList.remove('show');
    }, 2800);
  }

  // ==========================================
  // 2. RENDER SIDEBAR & DAFTAR MODUL
  // ==========================================

  function renderModules() {
    const count = state.modules.length;
    if (moduleCountEl) {
      moduleCountEl.textContent = count;
    }

    moduleListEl.innerHTML = '';

    if (count === 0) {
      moduleListEl.innerHTML = `
        <div class="empty-modules-notice">
          <div class="empty-icon">📂</div>
          <div class="empty-title">Modul Masih Kosong</div>
          <div class="empty-desc">Klik tombol <strong>Upload File Modul</strong> di atas untuk memasukkan materi (.txt / .pdf) dari folder Bahan Latihan P13.</div>
        </div>
      `;
      return;
    }

    const filtered = state.modules.filter(m => {
      if (!state.searchKeyword) return true;
      const kw = state.searchKeyword.toLowerCase();
      return m.shortName.toLowerCase().includes(kw) || 
             m.fullName.toLowerCase().includes(kw) || 
             m.subject.toLowerCase().includes(kw);
    });

    if (filtered.length === 0) {
      moduleListEl.innerHTML = '<div class="no-modules">Tidak ada modul yang cocok dengan pencarian.</div>';
      return;
    }

    filtered.forEach(m => {
      const item = document.createElement('div');
      item.className = `module-item ${m.id === state.activeModuleId ? 'active' : ''}`;
      item.setAttribute('data-id', m.id);
      item.innerHTML = `
        <span class="module-icon">📄</span>
        <span class="module-name" title="${m.fullName}">${m.shortName}</span>
      `;
      item.addEventListener('click', () => {
        selectModule(m.id);
      });
      moduleListEl.appendChild(item);
    });
  }

  function selectModule(moduleId) {
    state.activeModuleId = moduleId;
    updateHeaderAndBadges();

    document.querySelectorAll('.module-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-id') === moduleId);
    });

    const curMod = aiEngine.getModule(moduleId);
    if (curMod) {
      renderQuickChips(curMod);
    }

    // Jika sedang di tab kuis, auto-generate atau refresh kuis untuk modul ini
    if (state.activeTab === 'quiz') {
      startQuizWithCurrentSettings();
    }
  }

  function updateHeaderAndBadges() {
    const curMod = state.activeModuleId ? aiEngine.getModule(state.activeModuleId) : null;
    if (activeModuleBadge) {
      if (curMod) {
        activeModuleBadge.textContent = curMod.fullName;
        activeModuleBadge.classList.remove('badge-empty');
      } else {
        activeModuleBadge.textContent = 'Belum ada modul dipilih';
        activeModuleBadge.classList.add('badge-empty');
      }
    }

    if (quizActiveModuleName) {
      quizActiveModuleName.textContent = curMod ? curMod.fullName : 'Pilih modul di sidebar';
    }
  }

  function renderQuickChips(promptsOrMod) {
    if (!quickChipsContainer) return;
    quickChipsContainer.innerHTML = '';
    let prompts = [];
    if (Array.isArray(promptsOrMod)) {
      prompts = promptsOrMod;
    } else if (promptsOrMod && promptsOrMod.quickPrompts) {
      prompts = promptsOrMod.quickPrompts;
    } else {
      prompts = [
        'Bagaimana cuaca hari ini?',
        'Tips belajar fokus',
        'Kenapa bisa hujan?',
        'Hitung 25 x 14'
      ];
    }

    prompts.slice(0, 4).forEach(prompt => {
      const chip = document.createElement('button');
      chip.className = 'quick-chip';
      chip.textContent = prompt;
      chip.addEventListener('click', () => {
        chatInputEl.value = prompt;
        sendMessage();
      });
      quickChipsContainer.appendChild(chip);
    });
  }

  // ==========================================
  // 3. TAB SWITCHING (CHATBOT VS QUIZ)
  // ==========================================

  tabChatbotBtn.addEventListener('click', () => switchTab('chatbot'));
  tabQuizBtn.addEventListener('click', () => switchTab('quiz'));

  function switchTab(tabName) {
    state.activeTab = tabName;
    if (tabName === 'chatbot') {
      tabChatbotBtn.classList.add('active');
      tabQuizBtn.classList.remove('active');
      chatbotView.classList.remove('hidden');
      quizView.classList.add('hidden');
    } else {
      tabQuizBtn.classList.add('active');
      tabChatbotBtn.classList.remove('active');
      quizView.classList.remove('hidden');
      chatbotView.classList.add('hidden');
      handleQuizTabOpened();
    }
  }

  // ==========================================
  // 4. CHATBOT INTERAKSI
  // ==========================================

  function resetChatMessages() {
    chatMessagesEl.innerHTML = '';
    state.chatHistory = [];

    if (state.modules.length === 0) {
      addMessage('ai', 'Halo! Kenalin, aku **Boni**, teman belajar AI kamu di sini! 😊\n\nKamu bisa tanya apa saja ke aku—mulai dari materi pelajaran, sains seru, tips belajar santai, hitung matematika, sampai ngobrol ringan pas butuh jeda. Kalau kamu punya file modul (.txt / .pdf), klik tombol **"Upload File Modul"** atau **"Muat Bahan P13"** di sidebar kiri biar kita bisa bedah materinya bareng ya!');
      renderQuickChips([
        'Bagaimana cuaca hari ini?',
        'Tips belajar fokus',
        'Kenapa bisa hujan?',
        'Hitung 25 x 14'
      ]);
    } else {
      const curMod = aiEngine.getModule(state.activeModuleId);
      const modName = curMod ? curMod.shortName : 'modul';
      addMessage('ai', `Hai! Aku **Boni**, siap nemenin kamu belajar **${modName}**. Tanyain konsep apa pun yang bikin penasaran, atau klik tombol **Rangkum** kalau mau intisari babnya ya! 🚀`);
      
      if (state.activeModuleId === 'modul_02') {
        addMessage('user', 'Jelaskan fungsi asam klorida (HCl) dan pepsin dalam sistem pencernaan!');
        addMessage('ai', 'Nah, di dalam lambung kita itu ada cairan super tangguh namanya **asam klorida (HCl)**. Cairan ini dihasilkan oleh sel parietal di dinding lambung.\n\nKenapa tubuh butuh HCl? Nih ada 3 tugas pentingnya:\n1. 🛡️ **Pelindung dari kuman**: Suasana lambung dibuat sangat asam (pH 1,5–2) supaya bakteri jahat di makanan langsung musnah.\n2. ⚡ **Membangunkan enzim**: Enzim pemotong protein asalnya masih "tidur" dalam bentuk *pepsinogen*. Nah, asam HCl inilah tombol "ON" yang mengubahnya jadi **pepsin** aktif!\n3. 🥩 **Melunakkan makanan**: Asam ini mengurai struktur protein agar enzim lebih mudah mencernanya.\n\nSetelah aktif, si **pepsin** langsung bekerja memecah protein kompleks jadi pepton (polipeptida sederhana) lewat hidrolisis ikatan peptida.\n\nKeren kan mekanisme tubuh kita? Mau lanjut bahas enzim lambung lainnya seperti renin?', 'Sumber: Modul_02_Biologi... - Bab 3, Hal. 14');
        chatInputEl.value = 'Apa itu renin dan apa bedanya dengan pepsin?';
      }
      if (curMod) {
        renderQuickChips(curMod);
      }
    }
  }

  function addMessage(sender, text, source = null) {
    const msgObj = { sender, text, source, timestamp: new Date() };
    state.chatHistory.push(msgObj);
    renderSingleMessage(msgObj);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  function renderSingleMessage(msg) {
    const row = document.createElement('div');
    row.className = `chat-message-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`;

    if (msg.sender === 'ai') {
      const formattedText = msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\n/g, '<br>');
      row.innerHTML = `
        <div class="ai-avatar" title="Boni • Teman Belajar AI">🤖</div>
        <div class="ai-bubble-container">
          <div class="ai-sender-name">Boni • Teman Belajar</div>
          <div class="ai-bubble">${formattedText}</div>
          ${msg.source ? `<div class="ai-source">${msg.source}</div>` : ''}
        </div>
      `;
    } else {
      row.innerHTML = `
        <div class="user-bubble-container">
          <div class="user-sender-name">Kamu</div>
          <div class="user-bubble">${escapeHtml(msg.text).replace(/\n/g, '<br>')}</div>
        </div>
        <div class="user-avatar" title="Kamu">S</div>
      `;
    }

    chatMessagesEl.appendChild(row);
  }

  function sendMessage() {
    const text = chatInputEl.value.trim();
    if (!text) return;

    addMessage('user', text);
    chatInputEl.value = '';

    showTypingIndicator();

    setTimeout(() => {
      try {
        removeTypingIndicator();
        const response = aiEngine.generateAnswer(text, state.activeModuleId);
        if (response && response.text) {
          addMessage('ai', response.text, response.source);
        } else {
          addMessage('ai', 'Pertanyaanmu menarik banget! Coba ceritakan lebih spesifik bagian mana yang ingin kita pelajari bareng ya kawan! 😊');
        }

        if (response && response.suggestions && response.suggestions.length > 0) {
          renderQuickChips(response.suggestions);
        }

        if (response && response.action === 'switch_to_quiz') {
          const actionBtn = document.createElement('button');
          actionBtn.className = 'inline-action-btn';
          actionBtn.innerHTML = '⚡ Buka Generator Kuis Sekarang';
          actionBtn.addEventListener('click', () => switchTab('quiz'));
          chatMessagesEl.appendChild(actionBtn);
          chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        }
      } catch (err) {
        console.error('Error handling chat response:', err);
        removeTypingIndicator();
        addMessage('ai', 'Wah, sempat ada sedikit kendala memproses pesanmu, tapi tenang aku sudah di sini lagi! Boleh coba tanyakan sekali lagi kawan? Aku siap bantu jawab! 😊');
      }
    }, 320);
  }

  function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.id = 'typingIndicator';
    typing.className = 'chat-message-row ai-row';
    typing.innerHTML = `
      <div class="ai-avatar" title="Boni • Sedang mengetik...">🤖</div>
      <div class="ai-bubble-container">
        <div class="ai-sender-name">Boni • Sedang mengetik...</div>
        <div class="ai-bubble typing-bubble">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </div>
      </div>
    `;
    chatMessagesEl.appendChild(typing);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  function removeTypingIndicator() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  }

  btnKirim.addEventListener('click', sendMessage);

  chatInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  btnRangkum.addEventListener('click', () => {
    if (state.modules.length === 0) {
      showStatusNotification('Silakan upload atau muat modul materi terlebih dahulu!');
      addMessage('ai', 'Fitur **Rangkuman Otomatis** membutuhkan modul materi ajar. Silakan unggah modul (.txt / .pdf) atau klik tombol **"Muat Bahan P13"** di sidebar kiri terlebih dahulu ya kawan!');
      return;
    }
    const curMod = aiEngine.getModule(state.activeModuleId);
    addMessage('user', `Rangkum ${curMod.fullName}`);
    showTypingIndicator();
    setTimeout(() => {
      try {
        removeTypingIndicator();
        const summaryResp = aiEngine.generateSummaryResponse(curMod);
        addMessage('ai', summaryResp.text, summaryResp.source);
      } catch (err) {
        removeTypingIndicator();
        addMessage('ai', 'Maaf kawan, rangkuman belum bisa dimuat saat ini. Coba pilih ulang modul di sidebar ya!');
      }
    }, 320);
  });

  moduleSearchInput.addEventListener('input', (e) => {
    state.searchKeyword = e.target.value;
    renderModules();
  });

  // ==========================================
  // 5. GENERATOR KUIS INTERAKTIF & SETTINGS
  // ==========================================

  // ==========================================
  // 5. GENERATOR KUIS INTERAKTIF & CLEAN SETTINGS
  // ==========================================

  // Buka Modal Pengaturan
  function openQuizSettingsModal() {
    if (quizSettingsOverlay) {
      quizSettingsOverlay.classList.remove('hidden');
      quizSettingsOverlay.style.display = 'flex';
      syncPillsWithState();
    }
  }

  // Tutup Modal Pengaturan
  function closeQuizSettingsModal() {
    if (quizSettingsOverlay) {
      quizSettingsOverlay.classList.add('hidden');
      quizSettingsOverlay.style.display = 'none';
    }
  }

  // Sinkronkan Pill Buttons dengan state saat ini
  function syncPillsWithState() {
    document.querySelectorAll('.segmented-pill-group').forEach(group => {
      const settingKey = group.getAttribute('data-setting');
      const curVal = String(state.quizSettings[settingKey]);
      group.querySelectorAll('.pill-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-value') === curVal);
      });
    });
  }

  // Event Listener untuk Segmented Pills
  document.querySelectorAll('.segmented-pill-group').forEach(group => {
    const settingKey = group.getAttribute('data-setting');
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.pill-btn');
      if (!btn) return;

      group.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const val = btn.getAttribute('data-value');
      state.quizSettings[settingKey] = settingKey === 'count' ? parseInt(val) : val;
    });
  });

  // Toggle & Close Events
  if (btnToggleSettings) {
    btnToggleSettings.addEventListener('click', (e) => {
      e.preventDefault();
      openQuizSettingsModal();
    });
  }

  if (btnCloseSettings) {
    btnCloseSettings.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeQuizSettingsModal();
    });
  }

  if (btnCancelSettings) {
    btnCancelSettings.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeQuizSettingsModal();
    });
  }

  // Klik di luar modal untuk menutup
  if (quizSettingsOverlay) {
    quizSettingsOverlay.addEventListener('click', (e) => {
      if (e.target === quizSettingsOverlay) {
        closeQuizSettingsModal();
      }
    });
  }

  // Tombol Escape menutup modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quizSettingsOverlay && !quizSettingsOverlay.classList.contains('hidden')) {
      closeQuizSettingsModal();
    }
  });

  // Tombol Terapkan Pengaturan & Generate
  if (btnApplySettings) {
    btnApplySettings.addEventListener('click', () => {
      closeQuizSettingsModal();
      updateSettingsSummaryBadge();
      startQuizWithCurrentSettings();
      showStatusNotification('Pengaturan kuis berhasil diterapkan!');
    });
  }

  if (btnQuickGenerate) {
    btnQuickGenerate.addEventListener('click', () => {
      startQuizWithCurrentSettings();
    });
  }

  // Update Badge Ringkasan Pengaturan di Toolbar
  function updateSettingsSummaryBadge() {
    if (!quizSettingsSummary) return;
    const count = state.quizSettings.count;
    let typeLabel = 'Pilihan Ganda';
    if (state.quizSettings.type === 'essay') typeLabel = 'Soal Uraian';
    else if (state.quizSettings.type === 'all') typeLabel = 'Campuran';

    let diffLabel = 'Semua Level';
    if (state.quizSettings.difficulty === 'mudah') diffLabel = 'Mudah';
    else if (state.quizSettings.difficulty === 'sedang') diffLabel = 'Sedang';
    else if (state.quizSettings.difficulty === 'sulit') diffLabel = 'Sulit';

    quizSettingsSummary.textContent = `${count} Soal • ${typeLabel} • ${diffLabel}`;
  }

  function handleQuizTabOpened() {
    updateHeaderAndBadges();
    updateSettingsSummaryBadge();

    if (state.modules.length === 0 || !state.activeModuleId) {
      quizEmptyNotice.classList.remove('hidden');
      quizPlayCard.classList.add('hidden');
      quizResultCard.classList.add('hidden');
      return;
    }

    if (!quizEngine.currentQuiz) {
      startQuizWithCurrentSettings();
    } else {
      quizEmptyNotice.classList.add('hidden');
      quizPlayCard.classList.remove('hidden');
      quizResultCard.classList.add('hidden');
      renderCurrentQuizQuestion();
    }
  }

  function startQuizWithCurrentSettings() {
    if (state.modules.length === 0 || !state.activeModuleId) return;

    quizEngine.generateQuiz(state.activeModuleId, {
      count: state.quizSettings.count,
      type: state.quizSettings.type,
      difficulty: state.quizSettings.difficulty,
      mode: state.quizSettings.mode
    });

    quizEmptyNotice.classList.add('hidden');
    quizPlayCard.classList.remove('hidden');
    quizResultCard.classList.add('hidden');

    renderCurrentQuizQuestion();
  }

  // Render Question Sesuai Gambar 2
  function renderCurrentQuizQuestion() {
    const q = quizEngine.getCurrentQuestion();
    if (!q) return;

    const curMod = aiEngine.getModule(state.activeModuleId);
    const shortModName = curMod ? curMod.shortName.replace('...', '') : 'Modul';

    // 1. Meta Row Sesuai Gambar 2: "Soal 3 dari 5 • Modul_02_Biologi" dan "Skor: 2/2"
    quizMetaLeft.textContent = `Soal ${q.index + 1} dari ${q.total} • ${shortModName}`;
    quizScoreText.textContent = q.stats.scoreText;

    // 2. Progress Bar
    const progressPercent = ((q.index + 1) / q.total) * 100;
    quizProgressBar.style.width = `${progressPercent}%`;

    // 3. Question Text
    quizQuestionText.textContent = q.data.question;

    // Sembunyikan elemen dinamis terlebih dahulu
    quizFeedbackBanner.classList.add('hidden');
    quizExplanationBox.classList.add('hidden');

    // 4. Render Pilihan Ganda (MC) vs Uraian (Essay)
    if (!q.isEssay) {
      // Pilihan Ganda
      quizOptionsContainer.classList.remove('hidden');
      quizEssayContainer.classList.add('hidden');
      renderMultipleChoiceOptions(q);
    } else {
      // Soal Uraian / Esai
      quizOptionsContainer.classList.add('hidden');
      quizEssayContainer.classList.remove('hidden');
      renderEssayQuestion(q);
    }

    // 5. Tombol Navigasi Bawah
    btnQuizPrev.disabled = q.isFirst;
    btnQuizNext.classList.toggle('hidden', q.isLast);
    btnQuizFinish.classList.toggle('hidden', !q.isLast);
  }

  function renderMultipleChoiceOptions(q) {
    quizOptionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.data.options.forEach((optText, optIdx) => {
      const optBtn = document.createElement('button');
      optBtn.className = 'quiz-option-btn';

      // Jika soal ini sudah pernah dijawab sebelumnya
      if (q.userAnswer) {
        if (optIdx === q.data.correct) {
          optBtn.classList.add('correct');
        } else if (optIdx === q.userAnswer.selected) {
          optBtn.classList.add('incorrect');
        }
        optBtn.disabled = true;
      }

      optBtn.innerHTML = `
        <span class="option-letter">${letters[optIdx]}</span>
        <span class="option-text">${escapeHtml(optText)}</span>
      `;

      optBtn.addEventListener('click', () => {
        handleOptionSelect(q.index, optIdx);
      });

      quizOptionsContainer.appendChild(optBtn);
    });

    // Jika sudah dijawab, tampilkan feedback banner seperti di Gambar 2!
    if (q.userAnswer) {
      renderFeedbackBanner(q);
    }
  }

  function renderEssayQuestion(q) {
    if (q.userAnswer) {
      essayInput.value = q.userAnswer.studentText;
      essayInput.disabled = true;
      btnSubmitEssay.disabled = true;
      renderEssayFeedbackBanner(q);
    } else {
      essayInput.value = '';
      essayInput.disabled = false;
      btnSubmitEssay.disabled = false;
    }
  }

  btnSubmitEssay.addEventListener('click', () => {
    const q = quizEngine.getCurrentQuestion();
    if (!q) return;

    const answerText = essayInput.value.trim();
    if (!answerText) {
      showStatusNotification('Silakan tulis jawaban uraian Anda terlebih dahulu.');
      return;
    }

    quizEngine.submitEssayAnswer(q.index, answerText);
    renderCurrentQuizQuestion();
  });

  function handleOptionSelect(questionIndex, optionIndex) {
    quizEngine.submitAnswer(questionIndex, optionIndex);
    renderCurrentQuizQuestion();
  }

  // Banner Umpan Balik Sesuai Gambar 2:
  // "2 dari 2 soal benar sejauh ini. Jawaban benar: Pankreas. Lanjut ke soal 4."
  function renderFeedbackBanner(q) {
    const stats = q.stats;
    const isLast = q.isLast;
    const nextQuestionNum = q.index + 2;

    feedbackCorrectCount.textContent = stats.correct;
    
    let nextStepText = isLast ? 'Kuis telah selesai! Klik Selesai & Kumpulkan.' : `Lanjut ke soal ${nextQuestionNum}.`;
    feedbackMessageText.textContent = `dari ${stats.answered} soal benar sejauh ini. Jawaban benar: ${q.userAnswer.correctText}. ${nextStepText}`;

    btnQuickNext.textContent = isLast ? 'Lihat Nilai Akhir ✓' : 'Lanjut ke Soal Berikutnya →';
    btnQuickNext.onclick = () => {
      if (isLast) {
        showQuizResults();
      } else {
        quizEngine.nextQuestion();
        renderCurrentQuizQuestion();
      }
    };

    quizFeedbackBanner.classList.remove('hidden');

    // Tampilkan rujukan modul
    quizExplanationBox.classList.remove('hidden');
    quizExplanationBox.className = `quiz-explanation-box ${q.userAnswer.isCorrect ? 'box-correct' : 'box-incorrect'}`;
    quizExplanationBox.innerHTML = `
      <div class="exp-header">
        <strong>${q.userAnswer.isCorrect ? '✅ Jawaban Anda Tepat!' : '❌ Jawaban Kurang Tepat'}</strong>
      </div>
      <div class="exp-body">${q.userAnswer.explanation}</div>
      <div class="exp-citation">${q.userAnswer.citation}</div>
      <button class="exp-ask-btn" id="btnAskAboutQuestion">💬 Tanya Chatbot tentang Soal Ini</button>
    `;

    document.getElementById('btnAskAboutQuestion').addEventListener('click', () => {
      switchTab('chatbot');
      chatInputEl.value = `Jelaskan lebih lanjut mengenai materi soal: "${q.data.question}"`;
      sendMessage();
    });
  }

  function renderEssayFeedbackBanner(q) {
    const stats = q.stats;
    const isLast = q.isLast;
    const nextQuestionNum = q.index + 2;

    feedbackCorrectCount.textContent = stats.correct;
    
    let nextStepText = isLast ? 'Kuis telah selesai! Klik Selesai & Kumpulkan.' : `Lanjut ke soal ${nextQuestionNum}.`;
    feedbackMessageText.textContent = `dari ${stats.answered} soal terjawab sejauh ini. Penilaian: ${q.userAnswer.feedbackLabel}. ${nextStepText}`;

    btnQuickNext.textContent = isLast ? 'Lihat Nilai Akhir ✓' : 'Lanjut ke Soal Berikutnya →';
    btnQuickNext.onclick = () => {
      if (isLast) {
        showQuizResults();
      } else {
        quizEngine.nextQuestion();
        renderCurrentQuizQuestion();
      }
    };

    quizFeedbackBanner.classList.remove('hidden');

    // Tampilkan model jawaban & rujukan
    quizExplanationBox.classList.remove('hidden');
    quizExplanationBox.className = 'quiz-explanation-box box-correct';
    quizExplanationBox.innerHTML = `
      <div class="exp-header">
        <strong>💡 Model Jawaban & Ulasan Akademik:</strong>
      </div>
      <div class="exp-body">${q.userAnswer.modelAnswer}</div>
      <div class="exp-citation">${q.userAnswer.citation}</div>
      <button class="exp-ask-btn" id="btnAskAboutEssay">💬 Tanya Chatbot tentang Konsep Ini</button>
    `;

    document.getElementById('btnAskAboutEssay').addEventListener('click', () => {
      switchTab('chatbot');
      chatInputEl.value = `Jelaskan lebih mendalam mengenai konsep: "${q.data.question}"`;
      sendMessage();
    });
  }

  btnQuizPrev.addEventListener('click', () => {
    if (quizEngine.prevQuestion()) {
      renderCurrentQuizQuestion();
    }
  });

  btnQuizNext.addEventListener('click', () => {
    if (quizEngine.nextQuestion()) {
      renderCurrentQuizQuestion();
    }
  });

  btnQuizFinish.addEventListener('click', () => {
    showQuizResults();
  });

  function showQuizResults() {
    const results = quizEngine.calculateResults();
    if (!results) return;

    quizPlayCard.classList.add('hidden');
    quizResultCard.classList.remove('hidden');

    resultScoreValue.textContent = results.score;
    resultScoreBadge.textContent = results.badge;
    resultMessage.textContent = results.message;
    resultSummaryStats.innerHTML = `
      <div class="stat-item"><span class="stat-num">${results.totalQuestions}</span> Total Soal</div>
      <div class="stat-item stat-green"><span class="stat-num">${results.correctCount}</span> Benar / Memuaskan</div>
      <div class="stat-item stat-red"><span class="stat-num">${results.incorrectCount}</span> Perlu Review</div>
    `;

    resultDetailsContainer.innerHTML = '';
    results.details.forEach(d => {
      const item = document.createElement('div');
      item.className = `result-review-item ${d.isCorrect ? 'review-correct' : 'review-incorrect'}`;
      
      let answerReviewHtml = '';
      if (d.type === 'mc') {
        answerReviewHtml = `
          <div>Pilihanmu: <em>${d.selected !== null ? escapeHtml(d.options[d.selected]) : 'Tidak dijawab'}</em></div>
          ${!d.isCorrect ? `<div class="correct-text">Kunci Benar: <strong>${escapeHtml(d.options[d.correct])}</strong></div>` : ''}
        `;
      } else {
        answerReviewHtml = `
          <div>Jawaban Uraianmu: <em>${d.studentText ? escapeHtml(d.studentText) : 'Tidak dijawab'}</em></div>
          <div class="correct-text">Kunci Konsep Pokok: <strong>${escapeHtml(d.modelAnswer)}</strong></div>
        `;
      }

      item.innerHTML = `
        <div class="review-title">
          <span>${d.isCorrect ? '✅' : '❌'} <strong>Soal ${d.index} (${d.type === 'essay' ? 'Uraian' : 'Pilihan Ganda'}):</strong> ${escapeHtml(d.question)}</span>
        </div>
        <div class="review-answer">
          ${answerReviewHtml}
        </div>
        <div class="review-exp">${d.explanation}</div>
        <div class="review-cit">${d.citation}</div>
      `;
      resultDetailsContainer.appendChild(item);
    });
  }

  btnRetakeQuiz.addEventListener('click', () => {
    startQuizWithCurrentSettings();
  });

  btnNewQuizConfig.addEventListener('click', () => {
    quizSettingsDrawer.classList.remove('hidden');
    quizPlayCard.classList.remove('hidden');
    quizResultCard.classList.add('hidden');
  });

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }

  // ==========================================
  // INISIALISASI AWAL (KOSONG SESUAI PERMINTAAN)
  // ==========================================
  renderModules();
  updateHeaderAndBadges();
  resetChatMessages();
});
