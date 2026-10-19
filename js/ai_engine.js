/**
 * ASISTEN BELAJAR OFFLINE - AGENTIC AI ENGINE
 * Persona: Boni (Teman Belajar AI Interaktif, Cerdas, dan Suportif)
 * 
 * Arsitektur Agentic AI:
 * 1. Intent Router Agent: Klasifikasi maksud pengguna (Sapaan, Out-of-Topic, Follow-up Pedagogis, RAG Dokumen, Fitur Belajar).
 * 2. Context & Memory Manager: Pelacakan riwayat, resolusi anafora/kata ganti, ekstraksi topik & konteks penjelasan sebelumnya.
 * 3. Hybrid RAG Engine: Pencarian semantik & leksikal berperingkat (QA pairs, passage chunks, chapter titles) dengan skor relevansi & sitasi presisi.
 * 4. Pedagogical Tutor Synthesizer: Strategi respons tutor adaptif (Feynman simplification, analogi, penalaran kausal "mengapa begitu", contoh nyata).
 * 5. Out-of-Topic Agent: Respons ramah, berwawasan, dan proporsional untuk pertanyaan di luar materi tanpa penolakan kaku.
 * 6. External LLM Orchestrator: Integrasi aman Gemini, Ollama, dan OpenAI dengan injeksi konteks RAG, validasi urutan peran (role alternation), timeout, dan fallback transparan.
 */

class OfflineAIEngine {
  constructor(modulesData = [], referenceData = []) {
    this.modules = Array.isArray(modulesData) ? modulesData : [];
    this.referenceData = Array.isArray(referenceData) ? referenceData : [];
    this.botName = 'Boni';
    this.userName = this.loadSavedUserName();
  }

  loadSavedUserName() {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('asisten_belajar_user_name') || null;
      }
    } catch (e) {
      // ignore
    }
    return null;
  }

  setUserName(name) {
    if (!name) return;
    const clean = name.trim();
    if (clean.length > 0) {
      this.userName = clean;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('asisten_belajar_user_name', clean);
        }
      } catch (e) {
        // ignore
      }
    }
  }

  extractNameFromQuery(text) {
    if (!text) return null;
    const clean = text.trim();
    // 1. "panggil nama saya Sartemi", "panggil aku Sartemi", "panggil saya Sartemi", "panggil namaku Sartemi"
    // 2. "nama saya Sartemi", "namaku Sartemi", "nama aku Sartemi", "kenalin namaku Sartemi"
    // 3. "panggil Sartemi aja"
    const patterns = [
      /(?:panggil\s+(?:nama\s+(?:saya|aku)|namaku|saya|aku)?|nama\s+(?:saya|aku)|namaku|nama\s+lengkapku|kenalin\s+namaku)\s+(?:adalah\s+)?([a-zA-Z0-9\s]{2,30})/i,
      /^panggil\s+([a-zA-Z0-9\s]{2,30})/i
    ];

    for (const pat of patterns) {
      const match = pat.exec(clean);
      if (match && match[1]) {
        let rawName = match[1].trim();
        // Bersihkan partikel ekor: dong, ya, deh, aja, saja, nih, kak, bang, dll.
        rawName = rawName.replace(/\b(dong|ya|yah|deh|aja|saja|nih|sih|kak|bang|mas|mbak|pak|bu|oke|yaudah)\b/gi, '').trim();
        // Bersihkan tanda baca di akhir
        rawName = rawName.replace(/[\.\,\!\?\:\;]+$/, '').trim();
        // Validasi kata yang bukan kata umum perintah
        if (
          rawName.length >= 2 &&
          !/^(bisa|apa|kenapa|mengapa|bagaimana|halo|hai|siapa|kamu|bot|ai|kuis|soal|flashcard|rangkum)$/i.test(rawName)
        ) {
          // Format Title Case
          return rawName
            .split(/\s+/)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
        }
      }
    }
    return null;
  }

  getReferenceLibrary() {
    if (this.referenceData && this.referenceData.length > 0) return this.referenceData;
    return [];
  }

  getModule(id) {
    if (!id) return null;
    if (this.modules && this.modules.length > 0) {
      const found = this.modules.find(m => m.id === id);
      if (found) return found;
    }
    if (this.referenceData && this.referenceData.length > 0) {
      return this.referenceData.find(m => m.id === id) || null;
    }
    return null;
  }

  // ==========================================
  // TOKENISASI, STOPWORDS & SYNONYM MAP
  // ==========================================

  getStopWords() {
    return new Set([
      'yang', 'dan', 'di', 'ke', 'dari', 'pada', 'ini', 'itu', 'untuk', 'dengan',
      'adalah', 'yaitu', 'atau', 'karena', 'oleh', 'dalam', 'secara', 'sebagai',
      'antara', 'serta', 'saat', 'akan', 'bisa', 'dapat', 'jika', 'bila', 'maka',
      'juga', 'hanya', 'namun', 'tetapi', 'tentang', 'terhadap', 'kalian', 'kamu',
      'kita', 'saya', 'aku', 'apa', 'apakah', 'siapa', 'siapakah', 'bagaimana',
      'mengapa', 'kenapa', 'berapa', 'manakah', 'mana', 'kapan', 'jelaskan',
      'sebutkan', 'tuliskan', 'berikan', 'menurut', 'dong', 'sih', 'deh', 'nih',
      'kan', 'ya', 'yah', 'ada', 'tidak', 'bukan', 'aja', 'saja', 'tersebut',
      'terjadi', 'menjadi', 'memiliki', 'tolong', 'coba', 'tahu', 'kasih', 'paham',
      'terkait', 'seperti', 'begitu', 'begini', 'hal', 'gimana'
    ]);
  }

  getGenericWords() {
    return new Set([
      'fungsi', 'cara', 'kerja', 'proses', 'definisi', 'pengertian', 'materi', 'bab',
      'modul', 'contoh', 'tahap', 'bagian', 'organ', 'sistem', 'hukum', 'teori',
      'rumus', 'soal', 'kuis', 'latihan', 'pertanyaan', 'pembahasan', 'penjelasan',
      'faktor', 'peran', 'dampak', 'manfaat', 'tujuan', 'struktur', 'makna', 'jenis',
      'prinsip', 'macam', 'bentuk', 'langkah'
    ]);
  }

  getSynonymMap() {
    return {
      'intestin': ['usus', 'intestinum', 'usus halus', 'usus besar', 'duodenum', 'jejunum', 'ileum', 'kolon', 'pencernaan', 'vili'],
      'intestinum': ['usus', 'intestin', 'usus halus', 'usus besar', 'duodenum', 'jejunum', 'ileum', 'kolon'],
      'usus': ['intestin', 'intestinum', 'usus halus', 'usus besar', 'duodenum', 'jejunum', 'ileum', 'kolon', 'vili'],
      'esofagus': ['kerongkongan', 'peristaltik', 'sfingter'],
      'kerongkongan': ['esofagus', 'peristaltik', 'faring'],
      'lambung': ['gaster', 'ventrikulus', 'hcl', 'pepsin', 'renin', 'asam lambung', 'kimus', 'mukus'],
      'hcl': ['asam klorida', 'asam lambung', 'sel parietal', 'pepsinogen', 'pepsin'],
      'pepsin': ['enzim lambung', 'pepsinogen', 'pepton', 'protein', 'hcl'],
      'renin': ['kasein', 'protein susu', 'enzim lambung', 'bayi'],
      'hati': ['hepar', 'empedu', 'kantung empedu', 'bilis'],
      'hepar': ['hati', 'empedu', 'emulsi'],
      'empedu': ['hati', 'hepar', 'kantung empedu', 'emulsi lemak', 'lipase'],
      'saliva': ['air liur', 'ludah', 'ptialin', 'amilase', 'mulut'],
      'ludah': ['saliva', 'air liur', 'ptialin', 'mulut'],
      'mulut': ['saliva', 'air liur', 'ptialin', 'gigi', 'lidah', 'bolus'],
      'kolon': ['usus besar', 'sekum', 'apendiks', 'rektum', 'defekasi', 'feses', 'e coli'],
      'rektum': ['anus', 'defekasi', 'feses', 'usus besar', 'kolon'],
      'anus': ['rektum', 'defekasi', 'feses', 'sfingter'],
      'kimus': ['chyme', 'lambung', 'bolus'],
      'chyme': ['kimus', 'lambung'],
      'maag': ['gastritis', 'lambung', 'asam lambung', 'ulkus'],
      'gastritis': ['maag', 'lambung', 'radang lambung', 'ulkus'],
      'sembelit': ['konstipasi', 'usus besar', 'reabsorpsi air'],
      'konstipasi': ['sembelit', 'usus besar', 'reabsorpsi'],
      'diare': ['feses cair', 'usus besar', 'dehidrasi'],
      'inflasi': ['harga', 'bank sentral', 'moneter', 'bi rate', 'uang', 'daya beli'],
      'cpu': ['prosesor', 'processor', 'alu', 'control unit', 'von neumann', 'register'],
      'prosesor': ['cpu', 'processor', 'alu', 'von neumann'],
      'ram': ['memori', 'volatile', 'cache', 'ruang simpan'],
      'litosfer': ['kerak bumi', 'lapisan bumi', 'lempeng tektonik', 'batuan', 'sial', 'sima'],
      'gempa': ['seismik', 'seismologi', 'tsunami', 'lempeng', 'richter'],
      'eksoterm': ['termokimia', 'entalpi', 'kalor', 'melepas panas', 'hukum hess'],
      'endoterm': ['termokimia', 'entalpi', 'kalor', 'menyerap panas', 'hukum hess'],
      'newton': ['gaya', 'inersia', 'percepatan', 'hukum newton', 'aksi reaksi', 'massa'],
      'inersia': ['hukum 1 newton', 'kelembaman', 'gaya', 'diam'],
      'kalkulus': ['turunan', 'integral', 'limit', 'diferensial'],
      'diferensial': ['turunan', 'kalkulus', 'gradien'],
      'proklamasi': ['rengasdengklok', 'kemerdekaan', 'soekarno', 'maeda', 'sayuti melik', 'bpupki', 'ppki'],
      'rengasdengklok': ['proklamasi', 'kemerdekaan', 'pemuda', 'soekarno', 'hatta']
    };
  }

  tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);
  }

  getMeaningfulTokens(text) {
    const stops = this.getStopWords();
    return this.tokenize(text).filter(w => !stops.has(w) && w.length > 2);
  }

  getExpandedTokens(meaningfulTokens) {
    const synMap = this.getSynonymMap();
    const tokenSet = new Set(meaningfulTokens);
    for (const t of meaningfulTokens) {
      if (synMap[t]) {
        for (const s of synMap[t]) {
          tokenSet.add(s);
        }
      }
    }
    return Array.from(tokenSet);
  }

  // ==========================================
  // CONTEXT & CONVERSATION MEMORY MANAGER
  // ==========================================

  extractDialogueContext(history, activeModule) {
    const context = {
      primaryTopic: null,
      lastExplanationText: '',
      lastSource: null,
      lastUserQuery: '',
      dialogueTurns: 0,
      recentKeywords: [],
      userName: this.userName || null
    };

    if (!Array.isArray(history) || history.length === 0) {
      if (activeModule) {
        context.primaryTopic = activeModule.subject || activeModule.shortName;
      }
      return context;
    }

    context.dialogueTurns = history.length;

    // Deteksi nama user dari riwayat jika belum tersimpan
    if (!context.userName && Array.isArray(history)) {
      for (let i = history.length - 1; i >= 0; i--) {
        const msg = history[i];
        if (msg.sender === 'user' || msg.role === 'user') {
          const foundName = this.extractNameFromQuery(msg.text || '');
          if (foundName) {
            context.userName = foundName;
            this.setUserName(foundName);
            break;
          }
        }
      }
    }

    // Ambil pesan AI terakhir dan pesan User terakhir
    let lastAiMsg = null;
    let lastUserMsg = null;

    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      if (!lastAiMsg && (msg.sender === 'ai' || msg.sender === 'assistant' || msg.role === 'model' || msg.role === 'assistant')) {
        lastAiMsg = msg;
      }
      if (!lastUserMsg && (msg.sender === 'user' || msg.role === 'user')) {
        lastUserMsg = msg;
      }
      if (lastAiMsg && lastUserMsg) break;
    }

    if (lastAiMsg && lastAiMsg.text) {
      context.lastExplanationText = lastAiMsg.text;
      context.lastSource = lastAiMsg.source || null;
    }

    if (lastUserMsg && lastUserMsg.text) {
      context.lastUserQuery = lastUserMsg.text;
    }

    // 1. Prioritas Utama: Cari entitas kurikulum spesifik dari seluruh riwayat (dari terbaru ke terlama)
    const entityBank = [
      'asam klorida', 'pepsin', 'renin', 'intestin', 'usus halus', 'usus besar', 'duodenum',
      'jejunum', 'ileum', 'kolon', 'esofagus', 'peristaltik', 'lambung', 'ptialin', 'empedu',
      'hukum 1 newton', 'hukum 2 newton', 'hukum 3 newton', 'hukum newton', 'inersia', 'gaya gesek',
      'termokimia', 'eksoterm', 'endoterm', 'hukum hess', 'katalis', 'laju reaksi', 'entalpi',
      'kalkulus', 'turunan', 'integral', 'limit', 'diferensial',
      'struktur sosial', 'diferensiasi sosial', 'stratifikasi sosial', 'mobilitas sosial',
      'litosfer', 'lempeng tektonik', 'gempa bumi', 'vulkanisme', 'tsunami',
      'inflasi', 'pasar modal', 'bank sentral', 'saham', 'kebijakan moneter',
      'cpu', 'prosesor', 'ram', 'model osi', 'jaringan komputer',
      'teks eksposisi', 'karya ilmiah', 'fotosintesis', 'siklus air', 'petir', 'pelangi'
    ];

    for (let i = history.length - 1; i >= 0; i--) {
      const msgText = (history[i].text || '').toLowerCase();
      for (const ent of entityBank) {
        if (msgText.includes(ent)) {
          context.primaryTopic = ent;
          break;
        }
      }
      if (context.primaryTopic) break;
    }

    // 2. Jika tidak ada di entityBank, cari entitas yang dibold (**...**) pada pesan AI yang bukan bullet heading
    if (!context.primaryTopic && lastAiMsg && lastAiMsg.text) {
      const boldMatches = lastAiMsg.text.match(/\*\*([a-zA-Z0-9\s\(\)\-\,\.\/]{2,40})\*\*/g);
      if (boldMatches && boldMatches.length > 0) {
        for (const b of boldMatches) {
          const clean = b.replace(/\*\*/g, '').trim();
          const cleanLower = clean.toLowerCase();
          if (
            !cleanLower.includes('catatan') && !cleanLower.includes('tip') &&
            !cleanLower.includes('kartu') && !cleanLower.includes('soal') &&
            !cleanLower.includes('pemicu') && !cleanLower.includes('poin') &&
            clean.length > 2
          ) {
            context.primaryTopic = clean;
            break;
          }
        }
      }
    }

    // 3. Fallback ke kata bermakna pada pertanyaan user terakhir yang bukan pertanyaan lanjutan kosong
    if (!context.primaryTopic && lastUserMsg && lastUserMsg.text) {
      const uTokens = this.getMeaningfulTokens(lastUserMsg.text);
      if (uTokens.length > 0 && !lastUserMsg.text.toLowerCase().includes('begitu') && !lastUserMsg.text.toLowerCase().includes('sederhana')) {
        context.primaryTopic = uTokens.slice(0, 3).join(' ');
      }
    }

    if (!context.primaryTopic && activeModule) {
      context.primaryTopic = activeModule.subject || activeModule.shortName;
    }

    return context;
  }

  // ==========================================
  // INTENT ROUTER AGENT
  // ==========================================

  classifyFriendIntent(clean, raw) {
    // A. Lelah / Capek / Butuh Istirahat
    if (/(capek|lelah|penat|letih|capek banget|energi habis|pengen istirahat|lelah banget|capek kuliah|capek sekolah|capek kerja|capek hidup|burnout|lemes banget)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'TIRED' };
    }

    // B. Sedih / Galau / Patah Hati / Bad Mood / Menangis
    if (/(lagi sedih|galau|patah hati|bad mood|sedih banget|mau nangis|pengen nangis|kecewa|lagi down|ngerasa sendiri|kesepian|hatiku hancur)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'SAD' };
    }

    // C. Stres / Overthinking / Pusing / Cemas
    if (/(stres|banyak pikiran|pusing banget|overthinking|cemas|khawatir|takut gagal|panik|bingung banget|otak mau meledak)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'STRESS' };
    }

    // D. Senang / Sukses / Nilai Bagus / Merayakan
    if (/(senang banget|aku berhasil|nilai ujianku|lulus|kabar baik|alhamdulillah|menang|hoki banget|bahagia banget|dapat nilai a|merayakan)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'HAPPY' };
    }

    // E. Mager / Malas Belajar / Gak Mood
    if (/(mager|malas belajar|males banget|gak ada motivasi|gak mood|susah fokus|ngantuk mau belajar|malas ngerjain)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'LAZY' };
    }

    // F. Status Boni / Sedang Apa / Lagi Ngapain
    if (/(lagi ngapain|lagi sibuk apa|sedang apa kamu|lagi apa boni|lagi mikirin apa|kamu lagi ngapain|sibuk gak)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'STATUS' };
    }

    // G. Bosen / Temenin Ngobrol / Gabut
    if (/(temenin (aku )?ngobrol|bosen nih|lagi bosen|gabut|pengen ngobrol|ngobrol yuk|butuh teman ngobrol|ngobrol dong|cerita yuk)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'BORED' };
    }

    // H. Urusan Makan / Lapar / Rekomendasi Makanan
    if (/(lapar nih|makan apa ya|makan apa hari ini|rekomendasi makanan|menu makan siang|menu makan malam|bingung mau makan|rekomendasi sarapan)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'FOOD' };
    }

    // I. Pamit Tidur / Ngantuk / Selamat Malam
    if (/(mau tidur dulu|ngantuk banget|selamat tidur|mau istirahat dulu|pamit tidur|tidur dulu ya|mau bobo|good night)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'SLEEP' };
    }

    // J. Minta Diceritakan Cerita / Trivia Seru
    if (/(cerita dong|ceritain sesuatu|ceritain hal seru|ada cerita menarik|cerita apa kek|cerita seru)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'STORY' };
    }

    // K. Deep Talk & Filosofi Kehidupan
    if (/(arti sukses|makna sukses|menurutmu sukses itu apa|sukses menurutmu)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'DEEP_SUCCESS' };
    }
    if (/(kenapa hidup (ini )?(susah|berat|rumit)|tujuan hidup)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'DEEP_LIFE' };
    }
    if (/(berdamai dengan masa lalu|takut salah|memaafkan diri|gagal melulu|merasa gagal)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'DEEP_FORGIVE' };
    }
    if (/(arti persahabatan|makna cinta|hubungan sehat|pacaran sehat|teman sejati)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'DEEP_RELATIONSHIP' };
    }
    if (/(berpikir positif|mindset positif|cara bahagia|menjaga kesehatan mental)/i.test(clean)) {
      return { intent: 'FRIEND_COMPANION', subType: 'DEEP_POSITIVE' };
    }

    return null;
  }

  classifyIntent(cleanQuery, rawQuery, context, activeModule) {
    // 0A. Deklarasi / Perintah Panggil Nama Pengguna
    const nameFound = this.extractNameFromQuery(cleanQuery);
    if (nameFound) {
      return { intent: 'USER_NAME_SET', name: nameFound };
    }

    // 0B. Pertanyaan Siapa Nama Saya / Panggil Namaku
    if (
      /(siapa\s+(nama\s+)?(ku|saya|aku)|nama\s+(saya|aku|ku)\s+siapa|kamu\s+(tahu|tau|ingat)\s+namaku|ingat\s+namaku|panggil\s+namaku(\s+dong)?|coba\s+panggil\s+namaku|tau\s+namaku)/i.test(cleanQuery) ||
      cleanQuery === 'siapa namaku?' || cleanQuery === 'siapa nama saya?' || cleanQuery === 'kamu tau namaku?'
    ) {
      return { intent: 'USER_NAME_QUERY' };
    }

    // 0C. Obrolan Keseharian & Teman Curhat (Companion Chat)
    const friendIntent = this.classifyFriendIntent(cleanQuery, rawQuery);
    if (friendIntent) {
      return friendIntent;
    }

    // 1. Kalkulator Matematika Instan
    if (this.calculateMath(cleanQuery)) {
      return { intent: 'CALCULATOR' };
    }

    // 2. Waktu & Jam
    if (/^(jam berapa|pukul berapa|hari apa|tanggal berapa|sekarang jam berapa|hari ini hari apa)\b/i.test(cleanQuery)) {
      return { intent: 'TIME' };
    }

    // 3. Cuaca
    if (cleanQuery === 'cuaca' || /^(cuaca hari ini|cuaca sekarang|bagaimana cuaca|gimana cuaca|ramalan cuaca)\b/i.test(cleanQuery)) {
      return { intent: 'WEATHER' };
    }

    // 4. Sapaan & Salam
    if (
      /^(halo|hai|helo|hei|hi|hello|hey|oy|oi|halo ai|hai ai|halo boni|hai boni|selamat pagi|selamat siang|selamat sore|selamat malam|assalamu|salam)\b/i.test(cleanQuery) ||
      cleanQuery === 'halo' || cleanQuery === 'hai' || cleanQuery === 'hi' || cleanQuery === 'hello'
    ) {
      return { intent: 'GREETING' };
    }

    // 5. Identitas Persona & Kemampuan
    if (
      /^(siapa kamu|kamu siapa|nama kamu|namamu siapa|siapa anda|siapakah kamu)\b/i.test(cleanQuery) ||
      cleanQuery === 'siapa kamu?' || cleanQuery === 'siapa namamu?'
    ) {
      return { intent: 'PERSONA_IDENTITY' };
    }

    if (
      /(cara kerja (kamu|bot|ai|aplikasi)|bagaimana (kamu|bot|ai) bekerja|^cara kerjamu$)/i.test(cleanQuery) ||
      cleanQuery.includes('bisa apa') || cleanQuery.includes('kemampuanmu') || cleanQuery.includes('fitur apa') ||
      cleanQuery.includes('apa yang bisa kamu lakukan') || cleanQuery.includes('bisa bantu apa')
    ) {
      return { intent: 'PERSONA_CAPABILITIES' };
    }

    // 6. Kabar, Pujian & Terima Kasih
    if (/^(apa kabar|gimana kabar|bagaimana kabarmu|kamu sehat)\b/i.test(cleanQuery)) {
      return { intent: 'MOOD' };
    }
    if (/(kamu (hebat|keren|mantap|pintar|cerdas)|boni (hebat|keren|mantap|pintar)|wah keren|makasih boni)/i.test(cleanQuery)) {
      return { intent: 'COMPLIMENT' };
    }
    if (/^(terima kasih|makasih|thanks|thank you|terimakasih|matur nuwun)\b/i.test(cleanQuery)) {
      return { intent: 'THANK_YOU' };
    }
    if (/^(dadah|sampai jumpa|bye|selamat tinggal|pamit)\b/i.test(cleanQuery)) {
      return { intent: 'FAREWELL' };
    }

    // 7. Candaan, Pantun, Motivasi
    if (/(ceritakan (jokes|lelucon|tebak-tebakan)|ada jokes|ada tebak-tebakan|bagi jokes|lelucon dong)/i.test(cleanQuery)) {
      return { intent: 'JOKES' };
    }
    if (/(ceritakan pantun|kasih pantun|bagi pantun|pantun belajar|pantun dong)/i.test(cleanQuery)) {
      return { intent: 'PANTUN' };
    }
    if (/(tips belajar|cara belajar|cara fokus|pomodoro|tips ujian|belajar efektif)/i.test(cleanQuery)) {
      return { intent: 'STUDY_TIPS' };
    }
    if (/(butuh motivasi|kasih motivasi|minta motivasi|kata mutiara|kata bijak)/i.test(cleanQuery)) {
      return { intent: 'MOTIVATION' };
    }

    // 8. Study Tools: Flashcard, Kuis, Rangkuman, Problem Solver
    if (/(buatkan|bikin|generate)\s+(\d+\s+)?flashcard/i.test(cleanQuery) || cleanQuery.includes('flashcard') || cleanQuery.includes('kartu belajar')) {
      return { intent: 'FLASHCARDS' };
    }
    if (
      /(buatkan|bikin|kasih|uji)\s+(\d+\s+)?(soal|kuis|pertanyaan latihan)\b/i.test(cleanQuery) ||
      cleanQuery === 'kuis' || cleanQuery === 'latihan soal' || cleanQuery === 'beri kuis'
    ) {
      return { intent: 'INCHAT_QUIZ' };
    }
    if (this.isSummaryIntent(cleanQuery)) {
      return { intent: 'SUMMARY' };
    }
    if (/(brainstorming|ide judul|ide proyek|ide esai|ide penelitian|bantu cari ide|rekomendasi ide)/i.test(cleanQuery)) {
      return { intent: 'BRAINSTORMING' };
    }
    if (this.checkProblemSolvingIntent(cleanQuery, rawQuery)) {
      return { intent: 'PROBLEM_SOLVING' };
    }

    // 9. Pergantian Topik Eksplisit
    const topicSwitchMatch = /(?:ganti topik|pindah topik|topik lain|sekarang bahas|kita bahas|beralih ke)\s+(.+)/i.exec(cleanQuery);
    if (topicSwitchMatch && topicSwitchMatch[1]) {
      return {
        intent: 'TOPIC_SWITCH',
        targetTopic: topicSwitchMatch[1].replace(/^(ke|tentang)\s+/i, '').trim()
      };
    }

    // 10. FOLLOW-UP PEDAGOGIS (TUTOR INTERAKTIF)
    // A. "Mengapa bisa begitu?" / Kausalitas
    if (
      /(mengapa|kenapa)\s+(bisa\s+)?(begitu|seperti itu|demikian|terjadi)/i.test(cleanQuery) ||
      cleanQuery === 'mengapa bisa begitu?' || cleanQuery === 'kenapa bisa begitu?' ||
      cleanQuery === 'mengapa?' || cleanQuery === 'kenapa?' ||
      cleanQuery.includes('apa alasannya') || cleanQuery.includes('kenapa hal itu terjadi')
    ) {
      return { intent: 'PEDAGOGICAL_FOLLOWUP', subType: 'WHY_CAUSAL' };
    }

    // B. "Bisakah dijelaskan dengan lebih sederhana?" / Feynman Technique
    if (
      /(bisa(kah)?\s+)?(dijelaskan\s+)?(dengan\s+)?(lebih\s+)?(sederhana|simpel|gampang|mudah)/i.test(cleanQuery) ||
      cleanQuery.includes('bahasa awam') || cleanQuery.includes('anak smp') || cleanQuery.includes('terlalu rumit') ||
      cleanQuery.includes('lebih mudah dimengerti') || cleanQuery.includes('secara sederhana')
    ) {
      return { intent: 'PEDAGOGICAL_FOLLOWUP', subType: 'SIMPLIFY' };
    }

    // C. Analogi & Perumpamaan
    if (
      /(berikan|kasih|buatkan|ada)?\s*(analogi|perumpamaan|ibaratnya)/i.test(cleanQuery) ||
      cleanQuery.includes('ibarat') || cleanQuery.includes('seperti apa analoginya')
    ) {
      return { intent: 'PEDAGOGICAL_FOLLOWUP', subType: 'ANALOGY' };
    }

    // D. Contoh Nyata
    if (
      /(berikan|kasih|ada)?\s*(contoh(nya)?|contoh nyata|kehidupan sehari-hari)/i.test(cleanQuery) ||
      cleanQuery.includes('contoh konkret') || cleanQuery === 'contohnya apa?' || cleanQuery === 'beri contoh'
    ) {
      return { intent: 'PEDAGOGICAL_FOLLOWUP', subType: 'EXAMPLE' };
    }

    // E. Perbedaan / Komparasi
    if (/(apa bedanya|perbedaannya apa|lalu bedanya|bagaimana perbandingannya)/i.test(cleanQuery)) {
      return { intent: 'PEDAGOGICAL_FOLLOWUP', subType: 'DIFFERENCE' };
    }

    // F. Fungsi & Mekanisme lanjutan
    if (/(fungsinya apa|apa fungsinya|gunanya apa|apa peran)/i.test(cleanQuery)) {
      return { intent: 'PEDAGOGICAL_FOLLOWUP', subType: 'FUNCTION' };
    }
    if (/(cara kerjanya|bagaimana cara kerja|gimana cara kerja|bagaimana prosesnya|mekanismenya)/i.test(cleanQuery)) {
      return { intent: 'PEDAGOGICAL_FOLLOWUP', subType: 'MECHANISM' };
    }
    if (/(jelaskan lebih (lanjut|detail|lengkap)|bisa lebih detail|rinciannya)/i.test(cleanQuery)) {
      return { intent: 'PEDAGOGICAL_FOLLOWUP', subType: 'MORE_DETAIL' };
    }

    // 11. OUT-OF-TOPIC (NON-AKADEMIK / UMUM)
    const isOOT = this.checkOutOfTopic(cleanQuery);
    if (isOOT) {
      return { intent: 'OUT_OF_TOPIC', category: isOOT.category, detail: isOOT };
    }

    // 12. PERTANYAAN MATERI DOKUMEN / ENSIKLOPEDIA
    return { intent: 'SUBJECT_INQUIRY' };
  }

  // ==========================================
  // DETEKSI OUT-OF-TOPIC SECARA NATURAL
  // ==========================================

  checkOutOfTopic(cleanQuery) {
    // Kuliner & Resep
    if (/(resep|masak|bikin|cara membuat)\s+(nasi goreng|mie|rendang|kue|kopi|teh|makanan|sayur|sambal)/i.test(cleanQuery) ||
        cleanQuery.includes('nasi goreng') || cleanQuery.includes('resep masakan')) {
      return { category: 'CULINARY', topic: 'resep masakan' };
    }

    // Olahraga & Pop Culture
    if (/(siapa|klub|pemain|skor|pertandingan)\s+(ronaldo|messi|sepak bola|badminton|persib|persija|real madrid|barcelona|nba)/i.test(cleanQuery) ||
        cleanQuery.includes('sepak bola') || cleanQuery.includes('liga inggris')) {
      return { category: 'SPORTS', topic: 'olahraga & figur' };
    }

    // Rekomendasi Hiburan / Hobi / Santai
    if (/(rekomendasi|saran|film|lagu|musik|game|hobi)\s+(bagus|santai|liburan|terbaik|menghilangkan stres|mengisi waktu)/i.test(cleanQuery) ||
        cleanQuery.includes('rekomendasi hobi') || cleanQuery.includes('film bagus') || cleanQuery.includes('game santai')) {
      return { category: 'HOBBY_ENTERTAINMENT', topic: 'hiburan & hobi' };
    }

    // Pertanyaan Hewan Peliharaan & Sehari-hari
    if (cleanQuery.includes('kucing mendengkur') || cleanQuery.includes('merawat kucing') || cleanQuery.includes('anjing') || cleanQuery.includes('hewan peliharaan')) {
      return { category: 'DAILY_PETS', topic: 'hewan & kehidupan sehari-hari' };
    }

    // Kehidupan sehari-hari / Gaya Hidup non-modul
    if (cleanQuery.includes('wisata jogja') || cleanQuery.includes('tempat liburan') || cleanQuery.includes('beli laptop')) {
      return { category: 'GENERAL_LIFESTYLE', topic: 'gaya hidup & umum' };
    }

    return null;
  }

  // ==========================================
  // HYBRID RAG RETRIEVAL ENGINE
  // ==========================================

  retrieveFromRAG(query, activeModule, options = {}) {
    const clean = query.toLowerCase();
    const tokens = this.getMeaningfulTokens(clean);
    const expanded = this.getExpandedTokens(tokens);
    const genericWords = this.getGenericWords();

    const candidates = [];
    const targetModules = activeModule ? [activeModule] : (this.modules && this.modules.length > 0 ? this.modules : []);
    if (!targetModules || targetModules.length === 0) {
      return null;
    }

    for (const mod of targetModules) {
      const isCurrentActive = activeModule && mod.id === activeModule.id;
      const baseMultiplier = isCurrentActive ? 1.5 : 1.0;

      // A. QA Pairs Search
      if (mod.qaPairs && Array.isArray(mod.qaPairs)) {
        for (const qa of mod.qaPairs) {
          let score = 0;
          const kwList = Array.isArray(qa.keywords) ? qa.keywords : [];

          for (const kw of kwList) {
            const lkw = kw.toLowerCase();
            if (clean.includes(lkw)) {
              score += genericWords.has(lkw) ? 4 : 14;
            } else {
              const kwTokens = this.getMeaningfulTokens(lkw);
              for (const kt of kwTokens) {
                if (expanded.includes(kt)) {
                  score += genericWords.has(kt) ? 2 : 6;
                }
              }
            }
          }

          const ansTokens = this.getMeaningfulTokens(qa.answer || '');
          const ansOverlap = ansTokens.filter(t => expanded.includes(t) && !genericWords.has(t));
          score += ansOverlap.length * 2.5;

          if (score > 3) {
            candidates.push({
              type: 'QA',
              score: score * baseMultiplier,
              text: qa.answer,
              source: qa.source || `Sumber: ${mod.shortName || mod.fullName}`,
              module: mod,
              keywords: kwList
            });
          }
        }
      }

      // B. Document Passage Chunks Search
      if (mod.chunks && Array.isArray(mod.chunks)) {
        for (const chunk of mod.chunks) {
          let cScore = 0;
          const chunkTokens = this.getMeaningfulTokens(chunk.text);
          const chunkOverlap = chunkTokens.filter(t => expanded.includes(t) && !genericWords.has(t));
          cScore += chunkOverlap.length * 3.5;

          // Frasa eksak
          if (clean.length > 4 && chunk.text.toLowerCase().includes(clean)) {
            cScore += 12;
          }

          if (cScore > 4) {
            candidates.push({
              type: 'CHUNK',
              score: cScore * baseMultiplier,
              text: chunk.text,
              source: chunk.source || `Sumber: ${mod.shortName || mod.fullName}`,
              module: mod
            });
          }
        }
      }

      // C. Full Text Lines (Fallback untuk uploaded files tanpa chunks)
      if ((!mod.chunks || mod.chunks.length === 0) && mod.lines && Array.isArray(mod.lines)) {
        for (let i = 0; i < mod.lines.length; i++) {
          const line = mod.lines[i];
          if (line.length < 25) continue;
          const lineTokens = this.getMeaningfulTokens(line);
          const lineOverlap = lineTokens.filter(t => expanded.includes(t) && !genericWords.has(t));
          if (lineOverlap.length >= 2) {
            candidates.push({
              type: 'LINE',
              score: lineOverlap.length * 3 * baseMultiplier,
              text: line,
              source: `Sumber: ${mod.shortName || mod.fullName} - Baris ${i + 1}`,
              module: mod
            });
          }
        }
      }

      // D. Chapters Matching
      if (mod.chapters && Array.isArray(mod.chapters)) {
        for (const ch of mod.chapters) {
          const chTokens = this.getMeaningfulTokens(ch.judul);
          const chOverlap = chTokens.filter(t => expanded.includes(t) && !genericWords.has(t));
          if (chOverlap.length >= 2 || (clean.includes(`bab ${ch.bab}`) && chOverlap.length >= 1)) {
            candidates.push({
              type: 'CHAPTER',
              score: (chOverlap.length * 4 + 4) * baseMultiplier,
              text: `Topik ini dibahas secara khusus pada Bab ${ch.bab}: "${ch.judul}" (Halaman ${ch.hal}) modul ${mod.fullName}.`,
              source: `Sumber: ${mod.shortName || mod.fullName} - Bab ${ch.bab}, Hal. ${ch.hal}`,
              module: mod
            });
          }
        }
      }
    }

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => b.score - a.score);
    const topMatch = candidates[0];

    return {
      top: topMatch,
      all: candidates.slice(0, 3),
      confidence: topMatch.score >= 8 ? 'HIGH' : (topMatch.score >= 4 ? 'MEDIUM' : 'LOW')
    };
  }

  // ==========================================
  // TITIK MASUK UTAMA PEMROSESAN PERTANYAAN
  // ==========================================

  async generateAnswer(query, moduleId, history = [], settings = {}) {
    const rawQuery = (query || '').trim();
    if (!rawQuery) {
      return {
        text: `Halo kawan! Ada materi atau topik apa yang ingin kita kupas bareng hari ini? Tulis saja pertanyaanmu ya! 😊`,
        source: null,
        suggestions: ['Apa fungsi HCl dan pepsin?', 'Tips belajar fokus', 'Bagaimana proses hujan?']
      };
    }

    const cleanQuery = rawQuery.toLowerCase();
    const activeModule = this.getModule(moduleId);
    const context = this.extractDialogueContext(history, activeModule);
    const intentData = this.classifyIntent(cleanQuery, rawQuery, context, activeModule);

    // 1. CEK DUKUNGAN EXTERNAL LLM API JIKA DIAKTIFKAN
    const effectiveProvider = (settings && settings.provider) || 'offline';
    if (effectiveProvider !== 'offline') {
      try {
        const apiResponse = await this.callExternalLLM(rawQuery, activeModule, history, settings, context, intentData);
        if (apiResponse && apiResponse.text) {
          return apiResponse;
        }
      } catch (err) {
        console.warn('Gagal memanggil API eksternal, beralih otomatis ke Offline Engine:', err);
        const offlineAnswer = this.generateOfflineAgentResponse(rawQuery, cleanQuery, activeModule, history, context, intentData);
        return {
          text: `⚠️ *Catatan: Tidak dapat terhubung ke model ${settings.provider} (${err.message || 'Koneksi gagal'}). Boni beralih ke Mode Cerdas Offline untuk menjawabmu:*\n\n${offlineAnswer.text}`,
          source: offlineAnswer.source,
          suggestions: offlineAnswer.suggestions,
          action: offlineAnswer.action
        };
      }
    }

    // 2. OFFLINE AGENTIC RESPONSE ENGINE
    return this.generateOfflineAgentResponse(rawQuery, cleanQuery, activeModule, history, context, intentData);
  }

  handleFriendCompanion(subType, cleanQuery, rawQuery, context, activeModule) {
    const name = (context && context.userName) || this.userName;
    const nameSuffix = name ? `, **${name}**` : '';
    const nameVocative = name ? ` **${name}**` : '';

    if (subType === 'TIRED') {
      return {
        text: `Denger kamu capek, aku ngerti banget perasaannya${nameSuffix}. Menjalani rutinitas dan belajar seharian itu emang nguras banyak tenaga dan pikiran. 🫂☕\n\n` +
          `Sekarang tarik napas pelan-pelan, minum air putih hangat, dan kalau bisa rebahan atau pejamkan mata sejenak ya. Jangan terlalu memaksakan diri—istirahat itu bukan buang-buang waktu, tapi cara tubuhmu buat ngebangun energi baru lagi.\n\n` +
          `Mau cerita apa yang bikin kamu paling capek hari ini, atau kamu lebih milih rehat santai dulu? Aku siap nemenin kapan pun kamu butuh!`,
        source: 'Teman Berbagi Boni',
        suggestions: ['Mau rehat rebahan dulu', 'Ada tebak-tebakan lucu?', 'Tips mengembalikan energi']
      };
    }

    if (subType === 'SAD') {
      return {
        text: `Sini cerita ke aku${nameSuffix}... Kalau hari ini rasanya berat dan bikin kamu sedih atau galau, wajar banget kok. Kamu gak harus selalu kelihatan kuat setiap saat. 🌧️🤍\n\n` +
          `Apapun yang lagi berkecamuk di dalam hatimu, perasaanmu itu valid dan berharga. Kadang yang kita butuhkan bukan nasihat rumit, tapi tempat yang aman buat sekadar didengarkan tanpa dihakimi.\n\n` +
          `Keluarkan aja semua unek-unekmu di sini kalau kamu mau curhat. Aku ada di sampingmu buat dengerin, oke?`,
        source: 'Teman Curhat Boni',
        suggestions: ['Pengen cerita unek-unek', 'Kasih kata-kata penguat', 'Ada hal lucu gak?']
      };
    }

    if (subType === 'STRESS') {
      return {
        text: `Pegang pundakmu sebentar dan hembuskan napas perlahan ya${nameSuffix}... 🌿\n\n` +
          `Rasa stres atau overthinking itu tanda kalau kamu orang yang peduli dan punya tanggung jawab besar. Tapi memikirkan semua beban sekaligus hanya akan bikin pikiranmu sesak dan kewalahan.\n\n` +
          `Yuk kita pakai aturan sederhana: **fokus pada satu hal kecil yang ada di depan matamu sekarang**. Masalah yang besar selalu bisa diurai kalau kita kerjakan sedikit demi sedikit. Tarik napas 4 detik, tahan 4 detik, hembuskan 4 detik.\n\n` +
          `Mau kita urai bareng apa yang lagi paling membebanimu saat ini?`,
        source: 'Teman Tenang Boni',
        suggestions: ['Bantu urai bebanku', 'Tips meredakan stres', 'Ceritain hal yang menenangkan']
      };
    }

    if (subType === 'HAPPY') {
      return {
        text: `Waaaah, selamat ya${nameVocative}! 🎉🥳 Aku ikut seneng dan bangga banget dengernya!\n\n` +
          `Semua usaha, waktu, dan kerja keras yang udah kamu curahkan akhirnya terbayar tuntas. Kamu berhak banget ngerayain momen keberhasilan ini dan tepuk pundak dirimu sendiri!\n\n` +
          `Gimana ceritanya tadi? Rasanya pasti lega dan bahagia banget kan? Ceritain dong momen serunya!`,
        source: 'Teman Sejati Boni',
        suggestions: ['Rasanya lega banget!', 'Mau cerita perjuangannya', 'Next target apa ya?']
      };
    }

    if (subType === 'LAZY') {
      return {
        text: `Haha santai, rasa mager atau malas itu manusiawi banget kok${nameSuffix}! Otak kita emang secara alami suka cari kenyamanan. 🛋️😄\n\n` +
          `Tapi kalau ada target yang perlu diselesaikan hari ini, coba trik andalan ini: **"Aturan 5 Menit"**.\n` +
          `Janji ke diri sendiri buat mulai ngerjain 5 menit aja dulu—cuma buka bukunya atau baca 1 paragraf. Kalau setelah 5 menit kamu masih bener-bener mager, kamu boleh berhenti. Tapi 90% waktu, begitu kita udah mulai melangkah, ritmenya bakal ngalir sendiri!\n\n` +
          `Gimana, mau coba 5 menit sekarang bareng aku?`,
        source: 'Teman Produktif Boni',
        suggestions: ['Oke, coba 5 menit sekarang', 'Kasih motivasi singkat', 'Ada tebak-tebakan gak?']
      };
    }

    if (subType === 'STATUS') {
      return {
        text: `Lagi santai nih sambil nungguin kamu nyapa${nameSuffix}! Seneng banget kamu mampir ke sini. 🤖✨\n\n` +
          `Aku selalu standby dan siap nemenin kamu—mau ngobrol santai ngalor-ngidul, diskusi wawasan seru, dengerin curhat, atau bahas pelajaran kalau nanti kamu mau. Kamu sendiri lagi ngapain nih sekarang${nameVocative}? Lagi ada waktu luang atau lagi jeda istirahat?`,
        source: 'Obrolan Teman Boni',
        suggestions: ['Lagi santai rehat aja', 'Temenin ngobrol dong', 'Ceritain hal seru']
      };
    }

    if (subType === 'BORED') {
      return {
        text: `Siaaapp 100%, dengan senang hati! Aku teman ngobrol setiamu nih${nameSuffix}. Mengusir rasa bosan itu keahlianku! 😄🎮\n\n` +
          `Banyak topik seru yang bisa kita obrolin nih:\n` +
          `1. 🧠 Mau denger tebak-tebakan receh yang bikin mikir dan senyum?\n` +
          `2. 🌌 Mau kupas fakta mencengangkan tentang misteri luar angkasa atau alam bawah laut?\n` +
          `3. 🎬 Mau rekomendasi tontonan / musik / ide aktivitas santai buat ngisi waktu?\n` +
          `4. ☕ Atau sekadar mau curhat cerita tentang harimu?\n\n` +
          `Tunjuk aja mana yang paling bikin kamu penasaran!`,
        source: 'Teman Seru Boni',
        suggestions: ['Kasih tebak-tebakan receh', 'Ceritakan misteri laut dalam', 'Rekomendasi musik santai']
      };
    }

    if (subType === 'FOOD') {
      return {
        text: `Urusan makanan emang selalu jadi topik paling menggoda ya${nameSuffix}! 🍜😋\n\n` +
          `Nih beberapa inspirasi menu sesuai suasana hatimu:\n` +
          `• 🍲 **Lagi butuh yang hangat & berkuah**: Soto ayam kuah bening/kuning, bakso urat panas, mie kuah kari, atau ramen gurih.\n` +
          `• 🍗 **Lagi pengen yang pedas & gurih nendang**: Ayam geprek sambal bawang, nasi padang rendang/gulai ayam, atau nasi gila pedas.\n` +
          `• 🥪 **Lagi pengen yang simpel & gak ribet**: Roti bakar cokelat keju, nasi goreng telur ceplok, atau bubur ayam gurih.\n\n` +
          `Lidahmu lagi condong ke yang mana nih kira-kira hari ini? Jangan lupa makan tepat waktu ya!`,
        source: 'Rekomendasi Santai Boni',
        suggestions: ['Pengen yang hangat berkuah', 'Pengen yang pedas gurih', 'Resep simpel di rumah']
      };
    }

    if (subType === 'SLEEP') {
      return {
        text: `Selamat istirahat ya${nameSuffix}! 🌙✨\n\n` +
          `Hari ini kamu udah berjuang dan berusaha dengan sangat baik. Apapun yang terjadi hari ini, simpan dulu semua beban dan tugasmu di luar kamar tidur.\n\n` +
          `Tarik selimut yang nyaman, rilekskan badan dan pikiranmu. Semoga mimpi indah dan bangun besok pagi dengan tubuh yang segar dan semangat baru. Sampai ketemu dan ngobrol lagi besok ya! Selamat tidur! 😴🌟`,
        source: 'Teman Istirahat Boni',
        suggestions: ['Makasih Boni, selamat malam', 'Sampai jumpa besok!']
      };
    }

    if (subType === 'STORY') {
      return {
        text: `Nih, aku ceritain satu kisah nyata inspiratif tentang ketekunan manusia! 📖✨\n\n` +
          `Pernah dengar tentang **Jadav Payeng** dari India? Saat usianya masih 16 tahun (tahun 1979), dia melihat daratan pasir tandus di dekat desanya terancam erosi dan hewan-hewan mati kepanasan. Merasa prihatin, dia memutuskan menanam **satu pohon setiap hari** di padang pasir tersebut.\n\n` +
          `Orang-orang awalnya menganggap tindakannya sia-sia dan aneh. Tapi tahukah kamu apa yang terjadi 40 tahun kemudian? Berkat satu pohon per hari yang konsisten, kini padang pasir tandus itu berubah menjadi **hutan rimba rimbun seluas 550 hektar** (bahkan lebih luas dari Central Park New York!), dan kini menjadi rumah bagi gajah, badak, dan harimau liar!\n\n` +
          `*Pesan moralnya:* Jangan pernah meremehkan langkah kecil yang kamu lakukan hari ini secara konsisten, karena hal kecil yang diulang setiap hari bisa mengubah dunia. Keren banget kan kisahnya?`,
        source: 'Kisah Inspiratif Boni',
        suggestions: ['Keren banget ceritanya!', 'Ada cerita menarik lainnya?', 'Tips konsisten setiap hari']
      };
    }

    if (subType === 'DEEP_SUCCESS') {
      return {
        text: `Pertanyaan reflektif yang sangat indah${nameSuffix}... 🌿💡\n\n` +
          `Menurutku, **sukses sejati itu bukan cuma angka di rekening, gelar, atau tepuk tangan orang lain**. Standar sukses di media sosial sering kali sempit dan bikin kita terus merasa kurang.\n\n` +
          `Sukses yang paling hakiki adalah ketika:\n` +
          `1. 🕊️ **Kedamaian Batin**: Kamu bisa tidur nyenyak di malam hari tanpa dihantui rasa bersalah atau kepura-puraan.\n` +
          `2. 🌱 **Pertumbuhan Diri**: Kamu hari ini menjadi versi yang sedikit lebih bijak, sabar, dan penuh kasih dibanding dirimu setahun yang lalu.\n` +
          `3. 🤝 **Kebermanfaatan**: Keberadaanmu memberi rasa aman, senyum, atau kemudahan bagi orang-orang di sekitarmu.\n\n` +
          `Jadi selama kamu terus berproses dan berbuat baik, kamu sudah berjalan di jalur kesuksesanmu sendiri. Kalau buat kamu sendiri, apa arti sukses paling bermakna?`,
        source: 'Refleksi Kehidupan Boni',
        suggestions: ['Gimana cara gak overthinking?', 'Cara berdamai dengan kegagalan', 'Apa makna persahabatan?']
      };
    }

    if (subType === 'DEEP_LIFE') {
      return {
        text: `Kadang hidup emang terasa begitu berat dan membingungkan ya${nameSuffix}... 🌧️🌱\n\n` +
          `Kenapa hidup kadang terasa sulit? Karena hidup bukan garis lurus yang mulus, melainkan proses tempaan. Ibarat otot di gym yang harus robek mikro dulu saat mengangkat beban berat agar bisa tumbuh lebih kuat, ujian hidup sering kali melatih kapasitas kesabaran dan empati kita.\n\n` +
          `Saat semuanya terasa berat, ingatlah:\n` +
          `• Kamu tidak harus menyelesaikan semua teka-teki masa depanmu hari ini.\n` +
          `• Cukup lewati hari ini, satu langkah kecil demi satu langkah kecil.\n` +
          `• Dan yang paling penting: **kamu tidak sendirian**. Ada banyak orang dan teman yang menyayangimu.\n\n` +
          `Peluk erat dirimu hari ini ya. Kamu jauh lebih tangguh dari yang kamu duga!`,
        source: 'Refleksi Kehidupan Boni',
        suggestions: ['Makasih ya udah nguatin', 'Gimana cara tetap positif?', 'Ceritain hal yang lucu dong']
      };
    }

    if (subType === 'DEEP_FORGIVE') {
      return {
        text: `Berdamai dan memaafkan diri sendiri adalah salah satu keberanian terbesar seorang manusia${nameSuffix}. 🤍\n\n` +
          `Sering kali kita gampang memaafkan orang lain, tapi paling kejam menghakimi diri sendiri atas kesalahan masa lalu. Ingatlah prinsip ini:\n\n` +
          `**"Dirimu di masa lalu bertindak dengan tingkat kedewasaan, informasi, dan emosi yang kamu miliki saat itu."**\n` +
          `Kalau sekarang kamu menyadari hal itu salah atau kurang tepat, itu bukti nyata bahwa kamu **sudah bertumbuh lebih bijak**!\n\n` +
          `Jangan hukum dirimu yang sekarang atas ketidaktahuan dirimu di masa lalu. Peluk kesalahan itu sebagai pelajaran berharga, lalu izinkan dirimu melangkah maju dengan hati yang lebih lapang ya.`,
        source: 'Kesehatan Mental & Hati',
        suggestions: ['Cara lepas dari rasa bersalah', 'Tips berpikir positif', 'Menurutmu arti sukses apa?']
      };
    }

    if (subType === 'DEEP_RELATIONSHIP') {
      return {
        text: `Tentang hubungan dan persahabatan, ini fondasi yang paling penting kawan${nameSuffix}: 🤝❤️\n\n` +
          `Teman atau pasangan sejati bukan mereka yang hanya ada saat kita lagi senang atau sukses, melainkan mereka yang:\n` +
          `1. 🛡️ **Memberi Ruang Aman**: Kamu bisa menjadi dirimu apa adanya tanpa takut dihakimi atau harus berpura-pura sempurna.\n` +
          `2. ⚖️ **Saling Mendukung & Tumbuh**: Menjadi cermin yang jujur untuk saling mengingatkan saat khilaf dan merayakan kemenangan kecil bersama.\n` +
          `3. 🤍 **Keseimbangan Respek**: Ada rasa saling menghargai batas pribadi (*boundaries*), kejujuran, dan komunikasi terbuka.\n\n` +
          `Miliki sedikit teman yang berkualitas jauh lebih berharga daripada punya ratusan kenalan tapi tidak ada yang benar-benar mengenalmu. Kamu setuju gak?`,
        source: 'Relasi & Persahabatan',
        suggestions: ['Setuju banget!', 'Tips komunikasi yang baik', 'Apa itu filosofi Stoikisme?']
      };
    }

    if (subType === 'DEEP_POSITIVE') {
      return {
        text: `Menjaga pikiran tetap positif bukan berarti pura-pura bahagia atau menyangkal rasa sedih (*toxic positivity*)${nameSuffix}. ☀️🌿\n\n` +
          `Berpikir positif yang sehat itu adalah kemampuan untuk berkata:\n` +
          `*"Situasi ini memang sulit dan bikin kecewa, tapi ini bukan akhir dari segalanya. Masih ada hal baik yang bisa kupelajari dan kuusahakan."*\n\n` +
          `Trik sederhana menjaga kesehatan mental harian:\n` +
          `• 📝 **Latihan Bersyukur (Gratitude Journal)**: Sebelum tidur, tuliskan 3 hal kecil yang kamu syukuri hari ini (misal: cuaca teduh, makanan enak, atau senyum teman).\n` +
          `• 📵 **Kurangi Doomscrolling**: Batasi melihat drama di media sosial yang bikin energimu terkuras.\n` +
          `• 🚶 **Gerakkan Tubuh**: Jalan kaki 15 menit di luar ruangan terbukti memicu hormon endorfin alami!\n\n` +
          `Coba sebutkan satu hal kecil yang bikin kamu bersyukur hari ini?`,
        source: 'Mindset & Kebahagiaan',
        suggestions: ['Satu hal yang kusyukuri hari ini...', 'Tips manajemen waktu', 'Beri tebak-tebakan']
      };
    }

    return null;
  }

  // ==========================================
  // MESIN UTAMA OFFLINE AGENTIC RESPONSE
  // ==========================================

  generateOfflineAgentResponse(rawQuery, cleanQuery, activeModule, history, context, intentData) {
    const intent = intentData.intent;

    // 0A. PENGELOLAAN NAMA PENGGUNA
    if (intent === 'USER_NAME_SET') {
      const name = intentData.name;
      this.setUserName(name);
      return {
        text: `Halo **${name}**! Senang banget kenalan sama kamu. Siap, mulai sekarang aku panggil kamu **${name}** ya! 😊\n\nAda yang lagi pengen kamu ceritain atau diskusikan hari ini, ${name}? Aku siap nemenin kamu ngobrol santai seperti teman, bahas hal-hal umum yang seru, atau nemenin belajar bareng!`,
        source: 'Memori Teman Boni',
        suggestions: ['Lagi ngapain, Boni?', 'Aku capek banget hari ini', 'Ada tebak-tebakan seru?', 'Ceritain hal menarik dong']
      };
    }

    if (intent === 'USER_NAME_QUERY') {
      const name = this.userName || (context && context.userName);
      if (name) {
        return {
          text: `Namamu **${name}** dong! Masa sama teman sendiri aku lupa hehe 😄\n\nAda yang lagi pengen diobrolin nih, ${name}?`,
          source: 'Memori Teman Boni',
          suggestions: ['Lagi ngapain, Boni?', 'Aku capek banget hari ini', 'Ada tebak-tebakan seru?', 'Ceritain hal menarik dong']
        };
      } else {
        return {
          text: `Kamu belum kasih tahu namamu ke aku nih hehe 😊 Kenalan dulu yuk!\n\nSiapa nama panggilanmu? Kamu bisa bilang misalnya *"Panggil aku Sartemi"* atau *"Namaku Sartemi"* ya!`,
          source: 'Memori Teman Boni',
          suggestions: ['Panggil aku Sartemi', 'Panggil aku Budi', 'Siapa namamu?']
        };
      }
    }

    // 0B. TEMAN CURHAT & OBROLAN KESEHARIAN SEPERTI TEMAN
    if (intent === 'FRIEND_COMPANION') {
      const friendAns = this.handleFriendCompanion(intentData.subType, cleanQuery, rawQuery, context, activeModule);
      if (friendAns) return friendAns;
    }

    // A. CHITCHAT, SAPAAN, JOKES, MOTIVASI, WAKTU, CUACA, KALKULATOR
    if (intent === 'CALCULATOR') {
      const mathResult = this.calculateMath(cleanQuery);
      return {
        text: `${mathResult} 🧮\n\nHitungannya pas kan? Mau aku bantu hitung angka lain atau bahas rumus matematika tertentu?`,
        source: 'Kalkulator Belajar Boni',
        suggestions: ['Hitung 50 * 12', 'Tips belajar matematika', 'Beri soal kuis']
      };
    }

    if (intent === 'TIME') {
      return this.handleTimeResponse();
    }

    if (intent === 'WEATHER') {
      return {
        text: `Karena aku beroperasi **100% offline langsung di browsermu**, aku tidak memantau langsung kondisi awan di atas rumahmu saat ini. Coba intip ke luar jendela sebentar, cerah atau mendung? 🌤️\n\nTapi kalau kamu mau bahas **sains di balik cuaca**—seperti kenapa bisa hujan, proses terbentuknya awan, petir, atau pelangi—aku siap jelaskan dengan seru! Mau bahas yang mana nih?`,
        source: null,
        suggestions: ['Kenapa bisa hujan?', 'Kenapa langit berwarna biru?', 'Bagaimana petir terjadi?']
      };
    }

    if (intent === 'GREETING') {
      return this.handleGreetingResponse(activeModule);
    }

    if (intent === 'PERSONA_IDENTITY' || intent === 'PERSONA_CAPABILITIES') {
      return this.handlePersonaResponse(intent);
    }

    if (intent === 'MOOD' || intent === 'COMPLIMENT' || intent === 'THANK_YOU' || intent === 'FAREWELL') {
      return this.handleChitChatSocial(intent);
    }

    if (intent === 'JOKES' || intent === 'PANTUN' || intent === 'STUDY_TIPS' || intent === 'MOTIVATION') {
      return this.handleFunAndMotivation(intent);
    }

    // B. STUDY TOOLS
    if (intent === 'FLASHCARDS') {
      let targetTopic = context.primaryTopic || (activeModule ? activeModule.subject : 'Konsep Kunci');
      const tentMatch = cleanQuery.match(/(?:tentang|materi|soal|seputar)\s+([a-zA-Z0-9\s]+)/i);
      if (tentMatch && tentMatch[1]) targetTopic = tentMatch[1].replace(/(tadi|ini|dong|ya)/gi, '').trim();
      return this.generateFlashcardsResponse(targetTopic, activeModule);
    }

    if (intent === 'INCHAT_QUIZ') {
      let targetTopic = context.primaryTopic || (activeModule ? activeModule.subject : 'Materi Pembelajaran');
      const tentMatch = cleanQuery.match(/(?:tentang|materi|soal|seputar)\s+([a-zA-Z0-9\s]+)/i);
      if (tentMatch && tentMatch[1]) targetTopic = tentMatch[1].replace(/(tadi|ini|dong|ya)/gi, '').trim();
      return this.generateInChatQuizResponse(targetTopic, activeModule);
    }

    if (intent === 'SUMMARY') {
      if (cleanQuery.includes('teks ini:') || cleanQuery.includes('teks berikut:') || cleanQuery.length > 150) {
        return this.summarizeUserPastedText(rawQuery);
      }
      if (activeModule) {
        return this.generateSummaryResponse(activeModule);
      }
      return {
        text: `Aku siap banget buatin rangkuman materi! 📝\n\nKamu bisa pilih salah satu modul materi di sidebar kiri atau paste teks catatan yang ingin kamu ringkas langsung di chat ini ya!`,
        source: null,
        suggestions: ['Muat Bahan P13', 'Tips belajar fokus', 'Apa fungsi HCl dan pepsin?']
      };
    }

    if (intent === 'BRAINSTORMING') {
      return this.generateBrainstormingResponse(rawQuery, activeModule);
    }

    if (intent === 'PROBLEM_SOLVING') {
      const ps = this.checkProblemSolvingIntent(cleanQuery, rawQuery);
      if (ps) return ps;
    }

    if (intent === 'TOPIC_SWITCH') {
      const newTopic = intentData.targetTopic;
      const direct = this.retrieveFromRAG(newTopic, null);
      if (direct && direct.top) {
        return {
          text: `Siap! Yuk kita beralih ke pembahasan materi baru kawan! 🚀\n\n${direct.top.text}`,
          source: direct.top.source,
          suggestions: ['Jelaskan lebih sederhana', 'Bisa berikan analogi?', 'Buatkan latihan soal']
        };
      }
    }

    // C. PERTANYAAN DI LUAR TOPIK (OUT OF TOPIC)
    if (intent === 'OUT_OF_TOPIC') {
      return this.handleOutOfTopicResponse(cleanQuery, rawQuery, intentData.category, activeModule);
    }

    // D. PENANGANAN FOLLOW-UP PEDAGOGIS (TUTOR INTERAKTIF)
    if (intent === 'PEDAGOGICAL_FOLLOWUP') {
      return this.handlePedagogicalFollowUp(intentData.subType, context, activeModule, cleanQuery);
    }

    // E. PENELUSURAN MATERI MELALUI HYBRID RAG
    const ragResult = this.retrieveFromRAG(cleanQuery, activeModule);
    if (ragResult && ragResult.confidence !== 'LOW') {
      const top = ragResult.top;
      const formatted = this.humanizeAnswer(top.text, cleanQuery, top.module);
      return {
        text: formatted,
        source: top.source,
        suggestions: this.getSuggestionsForModule(top.module, cleanQuery)
      };
    }

    // F. ENSIKLOPEDIA AKADEMIK, SAINS POPULER & OBROLAN UMUM (TANPA HARUS ADA MODUL)
    const sciencePop = this.checkPopularScience(cleanQuery);
    if (sciencePop) return sciencePop;

    const generalCuriosity = this.checkGeneralCuriosity(cleanQuery, rawQuery);
    if (generalCuriosity) return generalCuriosity;

    const broadAcademic = this.checkBroadAcademic(cleanQuery);
    if (broadAcademic) {
      return {
        text: broadAcademic.text,
        source: activeModule ? `Catatan Pengetahuan • Relevan dengan ${activeModule.subject}` : 'Ensiklopedia Belajar Boni',
        suggestions: this.getSuggestionsForModule(activeModule, cleanQuery)
      };
    }

    // G. PERTANYAAN MATERI DOKUMEN YANG TIDAK TERSEDIA SECARA SPESIFIK
    if (activeModule && (cleanQuery.includes('dokumen') || cleanQuery.includes('modul') || cleanQuery.includes('halaman'))) {
      return {
        text: `Berdasarkan dokumen modul **${activeModule.fullName}**, rincian spesifik mengenai *"**${rawQuery}**"* belum tercantum secara eksplisit pada teks bab yang tersedia. 📖\n\nModul ini terutama memuat topik seputar:\n${(activeModule.chapters || []).slice(0, 4).map(c => `• Bab ${c.bab}: ${c.judul}`).join('\n')}\n\nNamun, jika kamu ingin membahas prinsip dasarnya secara umum atau memecahkan soal terkait, tanyakan saja ya kawan!`,
        source: `Keterbatasan Rujukan: ${activeModule.shortName}`,
        suggestions: activeModule.quickPrompts ? activeModule.quickPrompts.slice(0, 3) : ['Rangkum materi ini', 'Tips belajar fokus']
      };
    }

    // H. SMART TUTOR FALLBACK
    return this.generateFriendlySmartFallback(rawQuery, cleanQuery, activeModule, context);
  }

  // ==========================================
  // PEDAGOGICAL TUTOR STRATEGIES
  // ==========================================

  handlePedagogicalFollowUp(subType, context, activeModule, cleanQuery) {
    const topic = context.primaryTopic || (activeModule ? activeModule.subject : 'Materi yang kita bahas');
    const prevText = context.lastExplanationText || '';

    // 1. "Mengapa bisa begitu?" (Causal Explanation)
    if (subType === 'WHY_CAUSAL') {
      return this.generateWhyCausalResponse(topic, prevText, activeModule);
    }

    // 2. "Bisakah dijelaskan dengan lebih sederhana?" (Feynman Simplification)
    if (subType === 'SIMPLIFY') {
      return this.generateFeynmanSimplification(topic, prevText, activeModule);
    }

    // 3. "Bisa berikan analogi?"
    if (subType === 'ANALOGY') {
      return this.generateAnalogyResponse(topic, prevText, activeModule);
    }

    // 4. "Bisa berikan contohnya?"
    if (subType === 'EXAMPLE') {
      return this.generateExampleResponse(topic, prevText, activeModule);
    }

    // 5. Perbedaan & Komparasi
    if (subType === 'DIFFERENCE') {
      return this.generateDifferenceResponse(topic, prevText, activeModule, cleanQuery);
    }

    // 6. Fungsi / Mekanisme / Rincian Lanjutan
    const resolvedQuery = `${cleanQuery} ${topic}`;
    const directRAG = this.retrieveFromRAG(resolvedQuery, activeModule);
    if (directRAG && directRAG.confidence !== 'LOW') {
      return {
        text: `Melanjutkan pembahasan kita tentang **${topic}** tadi kawan:\n\n${this.humanizeAnswer(directRAG.top.text, cleanQuery, activeModule)}`,
        source: directRAG.top.source,
        suggestions: ['Bisakah dijelaskan lebih sederhana?', 'Bisa berikan analoginya?', 'Buatkan kuis latihan']
      };
    }

    return {
      text: `Mengenai peran dan mekanisme lebih dalam dari **${topic}** yang kita diskusikan tadi kawan:\n\n` +
        `• ⚙️ **Tujuan Sistemik**: Bekerja memastikan setiap tahapan pemrosesan berjalan stabil dan saling mendukung antarkomponen.\n` +
        `• 🔄 **Alur Terkoordinasi**: Setiap kali ada input atau stimulus baru, reaksi bertahap diaktifkan agar output dapat dimanfaatkan secara optimal oleh sistem.\n` +
        `• 💡 **Dampak Keseimbangan**: Jika bagian ini terganggu, efisiensi sistem secara keseluruhan akan menurun dan memicu kompensasi kerja di bagian lain.\n\n` +
        `Ada aspek tertentu dari ${topic} yang mau kita kupas lagi, atau mau aku buatkan analogi sederhananya?`,
      source: `Konteks Diskusi: ${topic}`,
      suggestions: ['Jelaskan lebih sederhana', 'Bisa berikan analoginya?', 'Buatkan kuis latihan']
    };
  }

  generateWhyCausalResponse(topic, prevText, activeModule) {
    const topicLower = (topic || '').toLowerCase();

    // Spesifik Biologi Lambung & Enzim
    if (topicLower.includes('hcl') || topicLower.includes('asam klorida') || topicLower.includes('pepsin') || topicLower.includes('lambung')) {
      return {
        text: `Pertanyaan kritis yang bagus banget kawan! **Mengapa lambung harus memproduksi asam klorida (HCl) sekuat itu dan enzim pepsin?** 🧪\n\nNih rantai sebab-akibat ilmiahnya:\n\n` +
          `1. 🛡️ **Kebutuhan Sterilisasi Mutlak (Pemicu Utama)**:\nSetiap makanan yang kita kunyah membawa ribuan bakteri dari lingkungan luar. Tanpa suasana asam ekstrem (pH 1,5–2), bakteri patogen akan leluasa berkembang biak dan merusak usus kita.\n\n` +
          `2. 🔑 **Kunci Pembuka Enzim (Mekanisme Kausal)**:\nEnzim pepsin tidak boleh diproduksi dalam keadaan aktif di dalam sel dinding lambung, karena jika sudah aktif di dalam sel, ia akan **mencerna sel penghasilnya sendiri**! Maka sel memproduksinya dalam bentuk pasif (*pepsinogen*). Begitu bertemu asam HCl di rongga lambung, barulah kuncinya terbuka menjadi **pepsin aktif**.\n\n` +
          `3. 🥩 **Pelunakan Ikatan Molekul**:\nProtein hewani dan nabati memiliki struktur 3 dimensi yang sangat padat. Keasaman HCl menyebabkan denaturasi (penguraian lipatan rantai), sehingga sisi ikatan peptida terbuka lebar untuk dipotong-potong oleh pepsin.\n\n` +
          `*Jadi kesimpulannya:* Lingkungan asam kuat ini adalah desain pertahanan sekaligus pabrik pengolahan protein yang sangat presisi! Kebayang kan logikanya?`,
        source: 'Penalaran Fisiologis • Sistem Pencernaan',
        suggestions: ['Bisakah dijelaskan lebih sederhana?', 'Bisa beri analoginya?', 'Apa bedanya dengan renin?']
      };
    }

    // Spesifik Hukum Newton / Inersia
    if (topicLower.includes('newton') || topicLower.includes('inersia') || topicLower.includes('gaya')) {
      return {
        text: `Pertanyaan cerdas! **Mengapa benda memiliki sifat inersia (kelembaman) dan aksi-reaksi?** 🚀\n\nBerikut hukum kausalitas fisika di baliknya:\n\n` +
          `1. 🛑 **Karakter Alami Massa (Hukum I Newton)**:\nSetiap partikel bermassa secara alami menolak perubahan status geraknya (*hukum inersia*). Tanpa adanya resultan gaya luar (ΣF ≠ 0), tidak ada alasan fisik bagi benda yang diam untuk bergerak, atau benda yang bergerak lurus konstan untuk berubah arah.\n\n` +
          `2. ⚖️ **Keseimbangan Simetris Alam (Hukum III Newton)**:\nSetiap interaksi mekanik di alam semesta selalu melibatkan dua pihak yang saling kontak. Gaya tidak pernah muncul sendirian (*monopol*). Ketika kamu mendorong tembok, atom-atom pada dinding membalas menekan tanganmu dengan besar yang sama persis namun arah berlawanan.\n\n` +
          `Ada contoh fenomena fisika lain yang ingin kita bedah alasan di baliknya?`,
        source: 'Penalaran Fisika Klasik',
        suggestions: ['Jelaskan lebih simpel', 'Beri contoh di kehidupan', 'Buatkan kuis fisika']
      };
    }

    // Spesifik Intestin / Usus Halus / Vili
    if (topicLower.includes('intestin') || topicLower.includes('usus') || topicLower.includes('vili')) {
      return {
        text: `Kenapa usus halus manusia harus memiliki panjang hingga 7 meter dan dipenuhi jutaan lipatan **vili**? 🌾\n\n1. 📐 **Hukum Luas Permukaan Kontak**:\nNutrisi mikro (glukosa, asam amino) berukuran sangat kecil. Jika dinding usus rata seperti pipa paralon, makanan akan lewat terlalu cepat sebelum nutrisinya sempat diserap.\n\n2. 🧬 **Prinsip Efisiensi Penyerapan**:\nLipatan vili dan mikrovili melipatgandakan luas permukaan usus hingga setara lapangan tenis (~250 m²)! Dengan luas area raksasa dalam rongga perut yang kompak, tubuh bisa menyerap 90% zat gizi tanpa ada yang terbuang sia-sia.\n\nMenakjubkan kan adaptasi anatomi tubuh kita?`,
        source: 'Anatomi & Fisiologi Usus',
        suggestions: ['Bisa berikan analoginya?', 'Jelaskan lebih sederhana', 'Lanjut ke usus besar']
      };
    }

    // Causal Fallback Umum
    return {
      text: `Pertanyaan yang kritis banget! Memahami **"mengapa bisa begitu"** adalah kunci utama belajar menggunakan *first-principle thinking*. 💡\n\n` +
        `Mengenai **${topic}**, hal tersebut terjadi karena 3 faktor kausal utama:\n\n` +
        `1. 🎯 **Kondisi Awal & Kebutuhan Sistem**: Ada stimulus atau kondisi alami yang memicu sistem untuk bereaksi agar keseimbangan tetap terjaga.\n` +
        `2. 🔄 **Rantai Reaksi Bertahap**: Fenomena ini tidak terjadi sekaligus, melainkan melalui proses bertingkat di mana tahap awal menyiapkan bahan baku untuk tahap berikutnya.\n` +
        `3. ⚖️ **Efisiensi & Prinsip Kelestarian**: Hukum alam selalu memilih jalur yang paling stabil dan hemat energi (*energy minimum principle*).\n\n` +
        `Mau aku jelaskan bagian ini dengan analogi sederhana yang gampang dibayangkan sehari-hari?`,
      source: `Penalaran Kausalitas: ${topic}`,
      suggestions: ['Bisa berikan analoginya?', 'Jelaskan lebih sederhana', 'Beri contoh nyata']
    };
  }

  generateFeynmanSimplification(topic, prevText, activeModule) {
    const topicLower = (topic || '').toLowerCase();

    // Penyederhanaan Lambung & HCl/Pepsin
    if (topicLower.includes('hcl') || topicLower.includes('asam klorida') || topicLower.includes('pepsin') || topicLower.includes('lambung')) {
      return {
        text: `Siap! Kita pakai **Teknik Feynman**: jelasin konsep sulit dengan bahasa yang super santai dan gampang dipahami anak SMP sekalipun! 🧒💡\n\n` +
          `Bayangkan lambungmu itu seperti **mesin blender dapur yang super canggih**:\n\n` +
          `• 🛡️ **Asam HCl = Cairan Pembersih Sekaligus Tombol "ON"**:\nSaat kamu makan bakso atau ayam, ada kuman nakal yang ikut masuk. Nah, cairan asam lambung ini langsung membasmi kuman itu, sekaligus memencet tombol "ON" buat ngebangunin gunting pemotong protein.\n\n` +
          `• ✂️ **Enzim Pepsin = Gunting Khusus Pemotong Daging**:\nDaging yang kamu makan itu rantainya masih panjang dan tebal. Enzim pepsin bertugas menggunting rantai panjang itu jadi potongan-potongan kecil (*pepton*) supaya muat lewat di usus halus nanti.\n\n` +
          `*Intinya:* **HCl nyiapin medannya dan ngebangunin guntingnya, lalu Pepsin yang bertugas motong-motong makanannya!** Gampang banget kan?`,
        source: 'Penyederhanaan Konsep Boni • Teknik Feynman',
        suggestions: ['Bisa beri contoh lainnya?', 'Bisa beri analogi lain?', 'Buatkan 3 kuis latihan']
      };
    }

    // Penyederhanaan Inersia / Newton
    if (topicLower.includes('newton') || topicLower.includes('inersia')) {
      return {
        text: `Gampang kawan! Kalau disederhanakan, **Hukum Inersia (Hukum I Newton)** itu prinsipnya cuma satu:\n\n` +
          `**"Benda itu pada dasarnya PEMALAS!"** 😴\n\n` +
          `• Kalau benda lagi diam rebahan, dia maunya tetap diam rebahan terus.\n` +
          `• Kalau benda lagi meluncur maju, dia maunya terus meluncur maju tanpa berhenti.\n` +
          `• Dia baru mau berubah kalau ada yang **memaksa / mendorongnya (gaya luar)**.\n\n` +
          `Makanya pas kamu naik motor lalu direm mendadak, badanmu terdorong ke depan karena badanmu pengen tetap meluncur maju! Simpel banget kan?`,
        source: 'Penyederhanaan Konsep Boni • Fisika',
        suggestions: ['Beri contoh lain', 'Hukum 2 Newton apa?', 'Buatkan kuis']
      };
    }

    // Simplifikasi Umum
    return {
      text: `Siap kawan! Intisari materi **${topic}** kalau dirangkum dengan bahasa yang paling sederhana adalah:\n\n` +
        `1. 📌 **Garis Besarnya**: Komponen ini bertindak seperti pengatur atau pekerja khusus di dalam sistem.\n` +
        `2. ⚙️ **Kerjanya**: Mengambil bahan mentah (input) ➔ mengolahnya lewat aturan tertentu ➔ menghasilkan manfaat bagi kita (output).\n` +
        `3. 💡 **Kenapa Penting**: Tanpa kehadirannya, proses setelahnya bakal macet atau berhenti total.\n\n` +
        `Biar makin kebayang, mau aku ceritain perumpamaan (analogi) nyatanya?`,
      source: `Penyederhanaan Konsep: ${topic}`,
      suggestions: ['Bisa berikan analoginya?', 'Beri contoh nyata', 'Buatkan kuis latihan']
    };
  }

  generateAnalogyResponse(topic, prevText, activeModule) {
    const topicLower = (topic || '').toLowerCase();

    if (topicLower.includes('hcl') || topicLower.includes('pepsin') || topicLower.includes('lambung')) {
      return {
        text: `Nih analogi serunya kawan! 🏭✨\n\n` +
          `Bayangkan proses di lambung itu seperti **bengkel daur ulang besi tua**:\n\n` +
          `• 🧴 **Asam HCl itu seperti cairan pembersih karat**: Karat dan cat kotor dibersihkan dulu sampai bersih (kuman dibasmi, serat daging dilunakkan).\n` +
          `• 👷‍♂️ **Enzim Pepsin itu seperti teknisi pemotong besi las**: Begitu karat bersih, teknisi las langsung memotong batangan besi panjang jadi potongan-potongan pendek yang rapi.\n` +
          `• 🧱 **Dinding Mukus itu seperti baju tahan api teknisi**: Melindungi dinding lambung agar tidak ikut meleleh kena asamnya sendiri!\n\n` +
          `Keren kan kerja sama tim di dalam perut kita?`,
        source: 'Analogi Edukasi Boni',
        suggestions: ['Jelaskan usus halus', 'Bisa berikan kuis?', 'Apa bedanya dengan renin?']
      };
    }

    if (topicLower.includes('newton') || topicLower.includes('inersia')) {
      return {
        text: `Analogi paling gampang untuk **Inersia** adalah **penumpang di dalam angkot**! 🚐\n\n` +
          `Bayangkan kamu berdiri di angkot yang lagi jalan kencang:\n` +
          `• Pas pak supir ngerem mendadak ➔ badanmu otomatis terlempar ke depan! Kenapa? Karena badanmu maunya tetap mempertahankan kecepatan maju yang tadi.\n` +
          `• Pas angkot dari posisi diam tiba-tiba tancap gas ➔ badanmu malah terjungkal ke belakang! Karena badanmu maunya tetap diam di tempat.\n\n` +
          `Itulah inersia: keengganan mengubah status gerak!`,
        source: 'Analogi Edukasi Boni',
        suggestions: ['Hukum II Newton apa?', 'Beri soal latihan', 'Jelaskan gaya gesek']
      };
    }

    if (topicLower.includes('cpu') || topicLower.includes('ram')) {
      return {
        text: `Analogi paling pas untuk **CPU dan RAM** adalah **koki dan meja dapur**! 👨‍🍳🍳\n\n` +
          `• 👨‍🍳 **CPU (Prosesor)** = Koki yang gesit memotong, menggoreng, dan meracik resep masakan.\n` +
          `• 🪵 **RAM** = Meja dapur tempat bahan-bahan ditaruh saat koki lagi masak. Makin luas meja dapurmu (RAM besar), makin banyak bahan yang bisa diracik barengan tanpa sempit!\n` +
          `• 🗄️ **Harddisk / SSD** = Lemari gudang di belakang. Tempat nyimpan bahan makanan untuk jangka panjang, tapi kalau mau dimasak harus dipindahin ke meja dapur (RAM) dulu.\n\n` +
          `Kebayang kan kenapa komputer butuh RAM gede?`,
        source: 'Analogi Komputer Boni',
        suggestions: ['Apa itu ALU?', 'Model OSI 7 Layer', 'Tips belajar informatika']
      };
    }

    return {
      text: `Nih perumpamaan (analogi) menarik untuk memahami **${topic}** kawan! 💡\n\n` +
        `Bayangkan sistem ini seperti **kantor pos pengiriman paket**:\n` +
        `• Paket yang masuk (informasi atau zat) disortir terlebih dahulu di bagian penerimaan.\n` +
        `• Petugas khusus (komponen aktif dari ${topic}) bertugas memeriksa kelengkapan label dan mengemas ulang paket agar aman.\n` +
        `• Paket yang sudah siap lalu didistribusikan ke alamat tujuan masing-masing secara teratur.\n\n` +
        `Dengan analogi ini, konsepnya jadi jauh lebih nyata dan masuk akal kan?`,
      source: `Analogi Konsep: ${topic}`,
      suggestions: ['Beri contoh nyata', 'Jelaskan lebih sederhana', 'Uji dengan kuis']
    };
  }

  generateExampleResponse(topic, prevText, activeModule) {
    const topicLower = (topic || '').toLowerCase();

    if (topicLower.includes('hcl') || topicLower.includes('lambung') || topicLower.includes('pepsin')) {
      return {
        text: `Contoh nyata dalam kehidupan sehari-hari yang sering kita rasakan:\n\n` +
          `1. 🍋 **Kenapa perut terasa perih pas telat makan (Sakit Maag)?**\nLambung kita tetap memproduksi asam HCl secara ritmis meskipun belum ada makanan yang masuk. Karena tidak ada makanan yang dinetralkan, asam tersebut mengiritasi dinding lambung sendiri!\n\n` +
          `2. 🍖 **Kenapa daging empuk kalau dimarinasi jeruk nipis/nanas sebelum dimasak?**\nAsam pada jeruk dan enzim bromelain pada nanas meniru kerja asam lambung & pepsin: memecah serat protein daging sebelum kita makan!\n\n` +
          `Nyata banget kan perannya di kehidupan kita?`,
        source: 'Aplikasi Nyata Fisiologi',
        suggestions: ['Kenapa ada GERD?', 'Fungsi usus halus', 'Buatkan kuis']
      };
    }

    return {
      text: `Contoh konkret di kehidupan sehari-hari untuk topik **${topic}**:\n\n` +
        `• 🌟 **Kasus Praktis**: Saat kita mengamati fenomena sekitar, aturan dari konsep ini langsung terlihat pada cara kerja peralatan teknologi, reaksi alam, atau pola perilaku sosial.\n` +
        `• 💡 **Manfaat Mengetahuinya**: Dengan memahami prinsip ini, kita bisa memprediksi hasil eksperimen, menyelesaikan soal ujian dengan cepat, dan menghindari kesalahan dalam penalaran ilmiah.\n\n` +
        `Mau kita coba terapkan pemahaman ini ke satu latihan soal?`,
      source: `Contoh Konkret: ${topic}`,
      suggestions: ['Buatkan kuis latihan', 'Jelaskan lebih sederhana', 'Ganti topik']
    };
  }

  generateDifferenceResponse(topic, prevText, activeModule, cleanQuery) {
    // Bedakan Pepsin dan Renin
    if (cleanQuery.includes('renin') || (topic && topic.toLowerCase().includes('pepsin'))) {
      return {
        text: `Pertanyaan perbandingan yang sering banget keluar di ujian! **Apa bedanya Enzim Pepsin vs Enzim Renin?** 🥛🥩\n\n` +
          `| Karakteristik | 🥩 Enzim Pepsin | 🍼 Enzim Renin |\n` +
          `| :--- | :--- | :--- |\n` +
          `| **Sasaran Kerja** | Protein umum dari daging, telur, kacang | Khusus protein susu (**kasein**) |\n` +
          `| **Hasil Reaksi** | Memotong protein jadi polipeptida / **pepton** | Mengendapkan kaseinogen jadi gumpalan kasein |\n` +
          `| **Masa Puncak Aktif** | Sepanjang hidup manusia dewasa & anak | Sangat aktif saat masa bayi (peminum ASI) |\n` +
          `| **Tujuan Fisiologis** | Mencerna rantai protein secara luas | Mencegah cairan susu lewat terlalu cepat di lambung |\n\n` +
          `Jelas banget kan perbedaannya? Mau kita uji lewat kuis latihan singkat?`,
        source: 'Komparasi Enzim • Modul Biologi Bab 3',
        suggestions: ['Buatkan kuis latihan', 'Jelaskan usus halus', 'Apa itu ptialin?']
      };
    }

    return {
      text: `Perbandingan konsep seputar **${topic}** dapat kita bedah melalui 3 aspek utama:\n\n` +
        `1. 🎯 **Perbedaan Peran**: Komponen pertama bertindak sebagai pemicu (katalis), sedangkan komponen pembanding bertindak sebagai pelaksana konversi.\n` +
        `2. ⏱️ **Waktu & Lingkungan Kerja**: Masing-masing memiliki kondisi optimal yang berbeda (seperti tingkat keasaman, suhu, atau besaran gaya).\n` +
        `3. 📤 **Hasil Akhir**: Keduanya menghasilkan luaran yang saling melengkapi untuk kesinambungan sistem.\n\n` +
        `Mau dibahas lebih spesifik perbandingan istilah mana yang sedang kamu timbang?`,
      source: `Komparasi Konsep: ${topic}`,
      suggestions: ['Bisa beri contohnya?', 'Buatkan kuis latihan', 'Rangkum materi']
    };
  }

  // ==========================================
  // OUT-OF-TOPIC NATURAL HANDLING
  // ==========================================

  handleOutOfTopicResponse(cleanQuery, rawQuery, category, activeModule) {
    let answerText = '';
    let suggestions = [];

    if (category === 'CULINARY') {
      answerText = `Wah, ngomongin kuliner pas lagi jeda belajar memang bikin laper ya! 🍳😋\n\n` +
        `Nih resep simpel bikin **Nasi Goreng Spesial Rumahan** yang gurih dan wangi:\n\n` +
        `1. 🍚 **Bahan Utama**: Nasi putih dingin (sisa semalam lebih bagus biar gak lembek), 1 butir telur, daun bawang iris tipis.\n` +
        `2. 🧄 **Bumbu Halus/Cincang**: 2 siung bawang putih, 3 siung bawang merah, cabai rawit sesuai selera, sedikit terasi bakar (opsional).\n` +
        `3. 🍳 **Cara Masak Cepat**:\n` +
        `   • Panaskan minyak, orak-arik telur sampai matang, sisihkan di pinggir wajan.\n` +
        `   • Tumis bumbu cincang sampai harum wangi.\n` +
        `   • Masukkan nasi, besarkan api wajan. Beri 1 sdm kecap manis, 1 sdm kecap asin/saus tiram, sedikit garam, dan merica.\n` +
        `   • Aduk cepat dengan api besar (*smoky aroma*) selama 2 menit sampai butiran nasi terlapisi rata. Masukkan daun bawang sesaat sebelum diangkat!\n\n` +
        `Sajikan hangat dengan kerupuk dan mentimun. Dijamin mantap buat nambah energi belajar!\n\n` +
        `Kapan pun kamu mau lanjut bedah materi ${activeModule ? `**${activeModule.shortName}**` : 'pelajaran'} lagi, santai aja—Boni siap nemenin! Mau lanjut belajar sekarang atau mau tanya hal lain dulu?`;
      suggestions = ['Lanjut belajar materi', 'Tips belajar fokus', 'Bagaimana proses hujan?'];
    } else if (category === 'SPORTS') {
      answerText = `Dunia olahraga emang selalu seru buat dibahas kawan! ⚽🏆\n\n` +
        `Mengenai hal ini, rivalitas, dedikasi latihan atlet, dan taktik tim membuktikan bahwa prestasi tinggi lahir dari disiplin yang konsisten setiap hari—mirip banget sama prinsip belajar kita yang butuh ketekunan (*deliberate practice*)!\n\n` +
        `Mau kita bahas info olahraga lainnya, atau setelah ini mau kita lanjut review materi ${activeModule ? `**${activeModule.shortName}**` : 'pembelajaran'} bareng Boni?`;
      suggestions = ['Lanjut belajar materi', 'Tips belajar efektif', 'Beri tebak-tebakan'];
    } else if (category === 'HOBBY_ENTERTAINMENT') {
      answerText = `Istirahat sejenak sambil ngobrolin hobi itu penting banget buat nge-refresh otak dari kejenuhan (*mental reset*)! 🎮🎬\n\n` +
        `Nih beberapa rekomendasi seru buat mengisi waktu jeda belajarmu:\n` +
        `• 🌿 **Aktivitas Santai**: Jalan sore 15 menit tanpa gadget, mendengarkan musik lofi/instrumental, atau mencoba resep camilan baru.\n` +
        `• 🎨 **Hobi Kreatif**: Menggambar doodling, belajar instrumen musik, atau journaling evaluasi mingguan.\n` +
        `• 📖 **Buku / Tontonan**: Dokumenter alam (seperti Our Planet), film animasi inspiratif, atau novel fiksi ringan.\n\n` +
        `Kalau energi dan fokusmu sudah terkumpul lagi, yuk kabari Boni buat lanjut gas materi belajar ya!`;
      suggestions = ['Lanjut belajar materi', 'Tips manajemen waktu', 'Motivasi belajar'];
    } else if (category === 'DAILY_PETS') {
      answerText = `Kucing memang makhluk yang menggemaskan dan penuh misteri ya! 🐱🐾\n\n` +
        `Tahukah kamu? Suara dengkuran (*purring*) kucing pada frekuensi 25–150 Hz ternyata punya fungsi biologis: tidak hanya tanda mereka merasa aman dan nyaman, tapi getaran frekuensi itu secara sains terbukti membantu regenerasi tulang dan meredakan stres bagi kucing maupun manusia di dekatnya!\n\n` +
        `Menarik kan fakta sains di sekitar hewan sehari-hari? Ada yang mau kamu tanyakan lagi, atau kita mau kembali ke modul belajarmu?`;
      suggestions = ['Kenapa langit biru?', 'Lanjut belajar materi', 'Tips belajar fokus'];
    } else {
      answerText = `Pertanyaan yang santai dan menarik buat diobrolin kawan! 😊\n\n` +
        `Mengenai topik ini, pada dasarnya hal tersebut merupakan bagian seru dari kehidupan sehari-hari di luar ruang kelas yang bikin wawasan kita tetap seimbang dan segar.\n\n` +
        `Senang bisa ngobrol santai bareng kamu. Kapan pun kamu merasa siap untuk lanjut menuntaskan materi ${activeModule ? `**${activeModule.shortName}**` : 'sekolah'}, kasih tahu Boni ya!`;
      suggestions = ['Lanjut belajar materi', 'Tips belajar efektif', 'Apa fungsi HCl dan pepsin?'];
    }

    return {
      text: answerText,
      source: null,
      suggestions: suggestions
    };
  }

  // ==========================================
  // EXTERNAL LLM INTEGRATION (GEMINI, OLLAMA, OPENAI)
  // ==========================================

  async callExternalLLM(userQuery, activeModule, history, settings, context, intentData) {
    const provider = settings.provider || 'gemini';
    const activeModName = activeModule ? `${activeModule.fullName} (${activeModule.shortName})` : 'Tanpa Modul Terpilih';

    // 1. Ambil RAG Context untuk Dokumen jika tersedia
    let ragContextText = '';
    const ragResult = this.retrieveFromRAG(userQuery, activeModule);
    if (ragResult && ragResult.all && ragResult.all.length > 0) {
      ragContextText = '\n\n[DOKUMEN & MATERI RUJUKAN RESMI]:\n' +
        ragResult.all.map((c, i) => `[Rujukan ${i + 1}] (${c.source}):\n"${c.text}"`).join('\n\n');
    }

    const systemPrompt = `Kamu adalah Boni, Teman Belajar & Teman Diskusi AI yang cerdas, hangat, interaktif, dan suportif.
Karakteristik kepribadian dan pedoman tutor:
1. Menjawab pertanyaan pengguna secara jelas, ramah, dan terstruktur dengan format Markdown yang indah (bullet points, bolding konsep penting, emoji yang pas).
2. BEBAS MENGOBROL HAL UMUM TANPA HARUS ADA MODUL: Pengguna berhak bertanya dan berdiskusi tentang apa saja (kehidupan, sains, filosofi, teknologi, psikologi, hobi, resep, nasihat, dll.) tanpa harus memilih atau mengunggah modul. Berikan jawaban yang kaya wawasan, hangat, menyenangkan, dan mengajak bertukar pikiran.
3. Berperan sebagai tutor handal: jelaskan konsep rumit dengan bahasa sederhana (teknik Feynman), gunakan analogi konkret, berikan contoh nyata, dan dukung pertanyaan lanjutan seperti "mengapa bisa begitu?" atau "bisakah dijelaskan lebih sederhana?"
4. PENGGUNAAN RUJUKAN MODUL: Jika pengguna menanyakan materi pelajaran tertentu dan ada rujukan materi berikut, gunakan rujukan ini secara akurat tanpa mengarang nomor halaman/sumber palsu:
Modul Aktif: ${activeModName}${ragContextText}
5. JIKA PERTANYAAN DI LUAR TOPIK PEMBELAJARAN (Out of Topic seperti kuliner, olahraga, hiburan, keseharian): Jawab secara natural, informatif, dan proporsional. JANGAN menolak atau memaksa pengguna kembali ke materi secara kaku.
6. KETERBATASAN INFORMASI: Jika pengguna bertanya tentang dokumen tertentu tetapi rincian spesifik tidak tercantum dalam konteks, jelaskan secara jujur keterbatasan tersebut dan lengkapi dengan pengetahuan umum terverifikasi.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 detik timeout

    try {
      // =====================================
      // A. GOOGLE GEMINI API
      // =====================================
      const gemApiKey = settings.geminiApiKey || settings.geminiKey;
      if (provider === 'gemini' && gemApiKey) {
        const model = settings.geminiModel || 'gemini-2.0-flash';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${gemApiKey}`;

        // Gemini API mensyaratkan giliran pertama harus role 'user' dan peran harus berselang-seling
        const contents = [];
        const recentHistory = (history || []).slice(-8);

        let lastRole = null;
        for (const msg of recentHistory) {
          const role = (msg.sender === 'user' || msg.role === 'user') ? 'user' : 'model';
          // Pastikan pesan pertama adalah 'user'
          if (contents.length === 0 && role !== 'user') {
            continue;
          }
          // Gabungkan jika ada peran ganda berurutan
          if (role === lastRole && contents.length > 0) {
            contents[contents.length - 1].parts[0].text += `\n${msg.text}`;
          } else {
            contents.push({
              role: role,
              parts: [{ text: msg.text }]
            });
            lastRole = role;
          }
        }

        // Tambahkan query pengguna saat ini
        if (lastRole === 'user' && contents.length > 0) {
          contents[contents.length - 1].parts[0].text += `\n${userQuery}`;
        } else {
          contents.push({
            role: 'user',
            parts: [{ text: userQuery }]
          });
        }

        const body = {
          contents: contents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1600
          }
        };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`Gemini API HTTP ${res.status}: ${errBody || res.statusText}`);
        }

        const data = await res.json();
        const answerText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (answerText) {
          return {
            text: answerText,
            source: `Model AI: Google Gemini (${model})${ragResult && ragResult.top ? ` • ${ragResult.top.source}` : ''}`,
            suggestions: ['Jelaskan lebih sederhana', 'Bisa berikan analogi?', 'Buatkan kuis latihan']
          };
        }
      }

      // =====================================
      // B. OLLAMA (LOCAL LLM)
      // =====================================
      if (provider === 'ollama') {
        const baseUrl = (settings.ollamaUrl || 'http://localhost:11434').replace(/\/$/, '');
        const model = settings.ollamaModel || 'llama3';
        const endpoint = `${baseUrl}/api/chat`;

        const messages = [{ role: 'system', content: systemPrompt }];
        const recentHistory = (history || []).slice(-8);
        for (const msg of recentHistory) {
          messages.push({
            role: (msg.sender === 'user' || msg.role === 'user') ? 'user' : 'assistant',
            content: msg.text
          });
        }
        messages.push({ role: 'user', content: userQuery });

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: model, messages: messages, stream: false }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`Ollama Error HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        if (data.message?.content) {
          return {
            text: data.message.content,
            source: `Model AI: Ollama Local (${model})`,
            suggestions: ['Jelaskan lebih detail', 'Bisa berikan contohnya?', 'Buatkan latihan soal']
          };
        }
      }

      // =====================================
      // C. OPENAI / GROK COMPATIBLE API
      // =====================================
      const openApiKey = settings.openaiApiKey || settings.openaiKey;
      if (provider === 'openai' && openApiKey) {
        const baseUrl = (settings.openaiUrl || 'https://api.openai.com/v1').replace(/\/$/, '');
        const model = settings.openaiModel || 'gpt-4o-mini';
        const endpoint = `${baseUrl}/chat/completions`;

        const messages = [{ role: 'system', content: systemPrompt }];
        const recentHistory = (history || []).slice(-8);
        for (const msg of recentHistory) {
          messages.push({
            role: (msg.sender === 'user' || msg.role === 'user') ? 'user' : 'assistant',
            content: msg.text
          });
        }
        messages.push({ role: 'user', content: userQuery });

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openApiKey}`
          },
          body: JSON.stringify({ model: model, messages: messages, temperature: 0.7 }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`OpenAI API HTTP ${res.status}: ${errBody || res.statusText}`);
        }

        const data = await res.json();
        const answerText = data.choices?.[0]?.message?.content;
        if (answerText) {
          return {
            text: answerText,
            source: `Model AI: ${model}${ragResult && ragResult.top ? ` • ${ragResult.top.source}` : ''}`,
            suggestions: ['Bisa berikan analoginya?', 'Jelaskan lebih sederhana', 'Buatkan flashcard']
          };
        }
      }
    } finally {
      clearTimeout(timeoutId);
    }

    return null;
  }

  // ==========================================
  // RESPONSE GENERATOR: SOCIAL, PERSONA & CHIT-CHAT
  // ==========================================

  handleGreetingResponse(activeModule) {
    const now = new Date();
    const hour = now.getHours();
    let salamWaktu = 'pagi';
    if (hour >= 11 && hour < 15) salamWaktu = 'siang';
    else if (hour >= 15 && hour < 18) salamWaktu = 'sore';
    else if (hour >= 18 || hour < 5) salamWaktu = 'malam';

    const name = this.userName;
    const nameGreeting = name ? `, **${name}**` : '';

    let modContext = '';
    if (activeModule) {
      modContext = ` Saat ini kita sedang membuka materi **${activeModule.fullName}**.`;
    }

    return {
      text: `Halo${nameGreeting}, selamat ${salamWaktu}! 👋 Senang banget bisa ketemu kamu di sini.\n\nKenalin, aku **Boni**, teman belajar & teman diskusimu.${modContext} Kamu bisa tanya atau cerita apa saja—mulai dari ngobrol santai seperti teman, curhat, tanya wawasan sains seru, filosofi, tips belajar, sampai membedah materi modul jika ada file yang kamu upload.\n\nApa nih yang lagi pengen kamu obrolin atau tanyakan hari ini?`,
      source: null,
      suggestions: activeModule && activeModule.quickPrompts ? activeModule.quickPrompts.slice(0, 3) : ['Lagi ngapain, Boni?', 'Panggil namaku dong', 'Aku capek banget hari ini', 'Ada tebak-tebakan seru?']
    };
  }

  handlePersonaResponse(intent) {
    if (intent === 'PERSONA_IDENTITY') {
      return {
        text: `Kenalin, namaku **Boni**! 🎓 Teman belajar AI interaktif kamu yang beroperasi **100% lokal & offline di browsermu** (dan juga bisa dihubungkan ke model online seperti Gemini/Ollama).\n\nAnggap saja aku teman sekelas yang siap diajak diskusi materi pelajaran, mengupas konsep rumit jadi gampang dipahami, buatin flashcard, kuis latihan, merangkum modul, atau nemenin ngobrol santai pas kamu lagi capek belajar. Ada topik yang lagi pengen kamu kuasai bareng aku?`,
        source: null,
        suggestions: ['Apa saja kemampuanmu?', 'Tips belajar efektif', 'Bisa bantu apa saja?']
      };
    }

    return {
      text: `Banyak hal seru yang bisa kita lakukan bareng lho kawan! Nih beberapa di antaranya:\n\n` +
        `1. 📖 **Tanya Jawab & Diskusi Materi**: Tanyain konsep apa pun dari modul yang kamu upload. Aku akan jelaskan dengan bahasa yang bersahabat, analogi, dan menyertakan rujukan bab resminya.\n` +
        `2. 💡 **Penjelasan Adaptif**: Tanyakan hal lanjutan seperti *"mengapa bisa begitu?"*, *"bisakah dijelaskan lebih sederhana?"*, atau *"apa analoginya?"*.\n` +
        `3. 🎴 **Generator Flashcards**: Minta aku buatkan kartu belajar interaktif buat uji ingatan aktifmu (*active recall*).\n` +
        `4. ⚡ **Generator Kuis**: Latihan soal pilihan ganda maupun esai dengan pembahasan instan.\n` +
        `5. 📝 **Rangkuman Cepat**: Intisari materi dari modul pelajaran atau teks catatanmu.\n` +
        `6. 🧮 **Pemecah Soal Bertahap**: Bantu hitung soal fisika, matematika, dan kimia langkah-demi-langkah.\n` +
        `7. 💬 **Teman Ngobrol Bebas**: Mau tanya soal resep, cuaca, olahraga, hobi santai, atau tips motivasi—aku siap nemenin tanpa menghakimi!\n\nMau mulai dari mana kita hari ini?`,
      source: null,
      suggestions: ['Apa fungsi HCl dan pepsin?', 'Tips belajar fokus', 'Bagaimana proses hujan?']
    };
  }

  handleChitChatSocial(intent) {
    if (intent === 'MOOD') {
      return {
        text: `Kabar aku super semangat dan selalu siap 100% nemenin kamu belajar! 🌟\n\nKalau kabarmu sendiri gimana hari ini kawan? Semoga lagi sehat, bersemangat, dan bahagia ya. Ada materi seru yang pengen kita bahas bareng?`,
        source: null,
        suggestions: ['Tips belajar fokus', 'Motivasi belajar hari ini', 'Apa fungsi HCl dan pepsin?']
      };
    }

    if (intent === 'COMPLIMENT') {
      return {
        text: `Wah, makasih banyak ya pujiannya! Senang banget kalau penjelasanku bermanfaat buat kamu. 😊 Tapi kamu juga hebat banget lho karena punya rasa ingin tahu yang tinggi dan tekun belajar. Yuk kita lanjutkan semangat belajarnya!`,
        source: null,
        suggestions: ['Beri soal kuis menantang', 'Tips belajar fokus', 'Rangkum materi']
      };
    }

    if (intent === 'THANK_YOU') {
      return {
        text: `Sama-sama kawan! Senang banget bisa nemenin dan bantu belajarmu hari ini. 😊\n\nKapan pun kamu butuh teman diskusi materi, mau latihan kuis, atau butuh rujukan bab, panggil aku lagi ya! Semangat terus belajarnya!`,
        source: null,
        suggestions: ['Tips belajar efektif', 'Bagaimana proses hujan?', 'Buka Generator Kuis']
      };
    }

    if (intent === 'FAREWELL') {
      return {
        text: `Sampai jumpa lagi kawan! Tetap jaga kesehatan dan semangat terus ya. Kapan pun kamu mau lanjut belajar offline, aku selalu ada di sini standby nemenin kamu! 👋🎓`,
        source: null,
        suggestions: ['Halo!', 'Siapa kamu?', 'Tips belajar fokus']
      };
    }

    return null;
  }

  handleFunAndMotivation(intent) {
    if (intent === 'JOKES') {
      const jokes = [
        `😄 **Tebak-tebakan Sekolah:**\n*Tanya:* Kenapa buku matematika selalu kelihatan sedih dan galau?\n*Jawab:* Karena dia punya terlalu banyak **masalah (problem)** yang belum terpecahkan! 😂`,
        `😄 **Jokes Sains:**\n*Tanya:* Kenapa sel darah merah tidak pernah tersesat di jalan?\n*Jawab:* Karena dia selalu mengikuti arus peredaran darah! 🩸`,
        `😄 **Tebak-tebakan Fisika:**\n*Tanya:* Kenapa gravitasi itu setia banget sama kita?\n*Jawab:* Karena dia tidak pernah membiarkan kita melayang pergi meninggalkan bumi! 🌍`,
        `😄 **Jokes Kimia:**\n*Tanya:* Kenapa atom tidak boleh dipercaya?\n*Jawab:* Karena mereka yang menyusun (make up) segalanya di dunia ini! 🧪`
      ];
      const picked = jokes[Math.floor(Math.random() * jokes.length)];
      return {
        text: picked,
        source: 'Koleksi Candaan Boni',
        suggestions: ['Jokes lainnya', 'Kasih pantun dong', 'Lanjut belajar materi']
      };
    }

    if (intent === 'PANTUN') {
      const pantuns = [
        `🌸 **Pantun Semangat Belajar:**\n*Pohon kelapa tumbuh di taman,*\n*Buahnya manis enak dimakan.*\n*Belajar tekun bersama teman,*\n*Masa depan cerah kan didapatkan.* ✨`,
        `📚 **Pantun Cita-Cita:**\n*Pergi ke pasar membeli sukun,*\n*Pulangnya mampir ke kota Blitar.*\n*Jika belajar dengan tekun,*\n*Pasti menjadi anak yang pintar.* 🌟`,
        `💡 **Pantun Wawasan:**\n*Bunga melati harum semerbak,*\n*Tumbuh indah di tepi kolam.*\n*Membaca buku membuka benak,*\n*Menjelajah luas isi alam.* 📖`
      ];
      const picked = pantuns[Math.floor(Math.random() * pantuns.length)];
      return {
        text: picked,
        source: 'Pojok Pantun Boni',
        suggestions: ['Pantun lainnya', 'Tips belajar fokus', 'Generator kuis']
      };
    }

    if (intent === 'STUDY_TIPS') {
      return {
        text: `Nih, aku spill **5 trik belajar cerdas** ala ilmu sains kognitif yang bikin materi nempel kuat di otak:\n\n1. ⏱️ **Teknik Pomodoro**: Belajar fokus 25 menit (singkirkan HP), lalu istirahat 5 menit. Ulangi 4 sesi, baru istirahat panjang 15-20 menit. Otakmu bakal tetap segar!\n2. 🧠 **Active Recall (Uji Ingatan)**: Daripada cuma baca buku berulang kali, mending tutup bukumu lalu coba ceritakan kembali atau kerjakan kuis latihan.\n3. 🔄 **Spaced Repetition**: Ulas materi setelah 1 hari, 3 hari, dan 1 minggu agar masuk ke memori jangka panjang (*long-term memory*).\n4. 🗣️ **Teknik Feynman**: Jelaskan konsep materi ke orang lain (atau pura-pura jelasin ke cermin) dengan bahasa sesederhana mungkin.\n5. 💤 **Tidur Cukup**: Otak kita menata dan merapikan materi yang dipelajari pas tidur. Jadi jangan begadang pas mau ujian ya!\n\nMau kita coba latihan soal pakai teknik active recall sekarang?`,
        source: 'Tips Belajar Cerdas Boni',
        suggestions: ['Motivasi belajar', 'Buka Generator Kuis', 'Apa fungsi HCl dan pepsin?']
      };
    }

    if (intent === 'MOTIVATION') {
      const quotes = [
        `✨ *"Pendidikan bukanlah proses mengisi wadah yang kosong, melainkan menyalakan api rasa ingin tahu."* — Socrates\n\nSetiap langkah kecil dan materi yang kamu pelajari hari ini adalah batu bata untuk membangun impian besarmu nanti. Jangan pernah ragu sama kemampuanmu ya kawan! Kamu pasti bisa! 💪`,
        `✨ *"Hiduplah seolah kamu akan mati besok. Belajarlah seolah kamu akan hidup selamanya."* — Mahatma Gandhi\n\nIlmu adalah satu-satunya harta yang bakal terus menjagamu dan gak akan pernah bisa dicuri orang. Tetap semangat mengasah pikiranmu! 🌟`,
        `✨ *"Keberhasilan bukanlah kebetulan. Ia terbentuk dari kerja keras, ketekunan, belajar, dan cinta pada apa yang kamu kerjakan."* — B.J. Habibie\n\nPercayalah pada proses belajarmu, karena usaha sungguh-sungguh tidak pernah mengkhianati hasil! 🚀`
      ];
      const picked = quotes[Math.floor(Math.random() * quotes.length)];
      return {
        text: picked,
        source: 'Pojok Motivasi Boni',
        suggestions: ['Tips belajar efektif', 'Beri lelucon', 'Mulai latihan soal']
      };
    }

    return null;
  }

  handleTimeResponse() {
    const now = new Date();
    const hariArr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const bulanArr = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const hari = hariArr[now.getDay()];
    const tanggal = now.getDate();
    const bulan = bulanArr[now.getMonth()];
    const tahun = now.getFullYear();
    const jam = String(now.getHours()).padStart(2, '0');
    const menit = String(now.getMinutes()).padStart(2, '0');

    return {
      text: `Sekarang hari **${hari}, ${tanggal} ${bulan} ${tahun}**, pukul **${jam}:${menit}** (waktu perangkat lokalmu). ⏰\n\nWaktu yang pas banget buat nambah wawasan baru atau mengulang materi yang tadi dipelajari. Mau belajar topik apa kita sekarang?`,
      source: null,
      suggestions: ['Tips manajemen waktu', 'Motivasi belajar hari ini', 'Bagaimana cuaca hari ini?']
    };
  }

  // ==========================================
  // SMART FALLBACK
  // ==========================================

  generateFriendlySmartFallback(rawQuery, cleanQuery, activeModule, context) {
    const name = (context && context.userName) || this.userName;
    const nameGreeting = name ? `, **${name}**` : '';
    const nameCall = name ? ` ${name}` : '';

    if (activeModule) {
      return {
        text: `Pertanyaan kamu tentang **"${rawQuery}"** menarik banget${nameGreeting}! 💡\n\n` +
          `Dalam konteks materi modul **${activeModule.fullName}**, hal ini berkaitan dengan keteraturan dan prinsip dasar yang dipelajari pada materi ini:\n\n` +
          `• 📌 **Inti Konsep**: Setiap komponen bekerja memastikan proses berjalan seimbang dan terkoordinasi.\n` +
          `• ⚙️ **Mekanisme**: Menghubungkan prinsip dasar ke hasil nyata yang bisa kita amati.\n` +
          `• 📖 **Rujukan Bab**: Pembahasan materi terkait dapat kamu telusuri pada modul **${activeModule.shortName}** (Hal. 1 s/d ${activeModule.totalHal || 36}).\n\n` +
          `Kamu bisa tanyakan aspek yang lebih spesifik (seperti fungsinya, cara kerjanya, minta dijelaskan lebih sederhana, minta analogi, atau buatkan kuis latihan)!`,
        source: `Konteks Belajar: ${activeModule.shortName}`,
        suggestions: activeModule.quickPrompts ? activeModule.quickPrompts.slice(0, 3) : ['Rangkum materi ini', 'Tips belajar fokus', 'Generator kuis']
      };
    } else {
      // OBROLAN UMUM SEPERTI TEMAN SEJATI (ZERO-MODULE COMPANION CHAT)
      return {
        text: `Topik tentang **"${rawQuery}"** ini menarik banget buat diobrolin${nameGreeting}! 🌟\n\n` +
          `Kalau kita amati, hal seputar **"${rawQuery}"** ini punya banyak sudut pandang seru dan relate sama kehidupan. Di satu sisi, ada prinsip alami dan kebiasaan sehari-hari yang sering kita jumpai tanpa kita sadari. Di sisi lain, setiap orang biasanya punya perspektif dan cerita yang berbeda-beda saat ngomongin hal ini.\n\n` +
          `Aku penasaran nih${nameCall}, apa yang bikin kamu tertarik atau kepikiran topik ini hari ini? Kamu sendiri punya pandangan atau cerita tersendiri soal hal ini? Yuk ceritain ke aku! 😊`,
        source: 'Obrolan Teman Boni',
        suggestions: ['Ceritain sudut pandangmu', 'Ada fakta uniknya?', 'Mau ganti topik seru']
      };
    }
  }

  // ==========================================
  // STUDY TOOLS: FLASHCARDS, QUIZ, SUMMARIES, MATH
  // ==========================================

  generateFlashcardsResponse(topic, activeModule) {
    const cleanTopic = (topic || 'Materi Belajar').toUpperCase();
    return {
      text: `Wah, ide belajar yang mantap! Menguji ingatan dengan kartu belajar (**active recall**) adalah teknik paling efektif buat mengunci konsep di memori jangka panjang (*long-term memory*). 🎴✨\n\n` +
        `Berikut **3 Kartu Belajar Flashcard** untuk topik **${cleanTopic}**:\n\n` +
        `🎴 **KARTU 1**\n` +
        `• ❓ **Depan (Pertanyaan / Istilah)**: Apa definisi inti dan fungsi utama dari ${topic}?\n` +
        `• 💡 **Belakang (Jawaban Kunci)**: Merupakan komponen vital yang memproses dan mengatur kelangsungan fungsi sistem secara terstruktur dan terkoordinasi.\n\n` +
        `🎴 **KARTU 2**\n` +
        `• ❓ **Depan (Pertanyaan / Istilah)**: Sebutkan faktor atau zat pendukung yang bekerja sama dengan ${topic}!\n` +
        `• 💡 **Belakang (Jawaban Kunci)**: Didukung oleh enzim pencernaan / gaya reaksi / aturan ilmiah tertentu yang mempercepat konversi zat dan menjaga stabilitas lingkungan reaksi.\n\n` +
        `🎴 **KARTU 3**\n` +
        `• ❓ **Depan (Pertanyaan / Istilah)**: Apa dampak atau gangguan yang terjadi jika fungsi ${topic} tidak berjalan optimal?\n` +
        `• 💡 **Belakang (Jawaban Kunci)**: Efisiensi metabolisme/sistem menurun, memicu kelainan klinis atau hambatan laju kerja pada tahap berikutnya.\n\n` +
        `*Tip dari Boni: Tutup layar sebentar, tebak jawabannya dalam pikiranmu, lalu cocokkan! Mau dibuatkan flashcards untuk bab lainnya?*`,
      source: `Generator Flashcard Boni • Topik ${cleanTopic}`,
      suggestions: ['Buatkan 3 kuis latihan', 'Jelaskan lebih sederhana', 'Rangkum intisarinya']
    };
  }

  generateInChatQuizResponse(topic, activeModule) {
    return {
      text: `Yuk langsung kita uji pemahamanmu lewat **Kuis Cepat Teman Belajar**! 🎯\n\n` +
        `**Soal 1:**\nManakah pernyataan berikut yang paling tepat menjelaskan karakteristik utama dari **${topic}**?\n` +
        `A. Bekerja secara pasif tanpa memerlukan energi atau katalis pendukung\n` +
        `B. Berfungsi mengoptimalkan proses pemecahan dan penyerapan secara terkoordinasi\n` +
        `C. Menghambat jalannya siklus reaksi alami\n` +
        `D. Hanya ditemukan pada organisme bersel tunggal\n\n` +
        `**Soal 2:**\nFaktor lingkungan manakah yang paling berpengaruh terhadap efektivitas kerja **${topic}**?\n` +
        `A. Suhu optimal dan rentang derajat keasaman (pH) lingkungan\n` +
        `B. Kecepatan angin di udara terbuka\n` +
        `C. Intensitas medan magnet statis\n` +
        `D. Jumlah partikel debu ruangan\n\n` +
        `*Kunci jawaban cepat: Soal 1 = B, Soal 2 = A.*\n\n` +
        `Mau latihan kuis lebih banyak dengan skor otomatis? Kamu bisa klik tombol tab **Generator Kuis** di atas ya!`,
      source: `Kuis Interaktif • Topik ${topic}`,
      suggestions: ['Buka Generator Kuis', 'Jelaskan pembahasan nomor 1', 'Buatkan 3 flashcard']
    };
  }

  generateBrainstormingResponse(query, activeModule) {
    const modTitle = activeModule ? activeModule.subject : 'Sains & Teknologi';
    return {
      text: `Wah, brainstorming ide bareng Boni! Nih ada **3 ide judul proyek / esai inovatif** seputar materi **${modTitle}** yang berbobot dan aplikatif:\n\n` +
        `1. 💡 **Ide Eksplorasi Analitis**: *"Analisis Efektivitas Mekanisme Biologis dalam Mengatasi Gangguan Sistemik pada Era Modern"*.\n` +
        `   • *Fokus*: Meneliti bagaimana adaptasi organ/komponen terhadap pola hidup dan polutan lingkungan.\n\n` +
        `2. 🔬 **Ide Solusi Terapan**: *"Perancangan Model Komputasi Simulasi Reaksi Konversi Zat untuk Optimalisasi Efisiensi Energi"*.\n` +
        `   • *Fokus*: Menggabungkan rumus sains dan simulasi digital.\n\n` +
        `3. 📝 **Ide Kajian Komparatif**: *"Studi Komparasi Regulasi Sistem Tradisional vs Sistem Modern dalam Mempertahankan Kestabilan Sistem"*.\n` +
        `   • *Fokus*: Analisis mendalam dengan tinjauan pustaka ilmiah.\n\n` +
        `Tertarik mendalami salah satu dari ide di atas? Boni siap bantu susun kerangka (outline) pembahasannya!`,
      source: `Brainstorming Ide • ${modTitle}`,
      suggestions: ['Bantu susun outline nomor 1', 'Buatkan kuis latihan', 'Rangkum materi']
    };
  }

  summarizeUserPastedText(text) {
    const clean = text.replace(/^(tolong|coba)?\s*(rangkum|ringkas|buatkan rangkuman|summary)\s*(teks ini|teks berikut)?\s*:?/i, '').trim();
    const sentences = clean.split(/[.\n]+/).map(s => s.trim()).filter(s => s.length > 15);
    const topSentences = sentences.slice(0, Math.min(4, sentences.length));

    return {
      text: `Nih, aku sudah sarikan intisari penting dari teks yang kamu bagikan! 📝✨\n\n` +
        `**Rangkuman Poin Kunci:**\n` +
        topSentences.map((s, idx) => `• 📌 **Poin ${idx + 1}**: ${s}.`).join('\n') + `\n\n` +
        `*💡 Tip dari Boni: Kamu bisa gunakan poin-poin di atas sebagai bahan flashcard atau catatan kilat sebelum ujian!*`,
      source: 'Perangkum Teks Boni',
      suggestions: ['Buatkan kuis dari teks ini', 'Buatkan flashcard', 'Jelaskan lebih sederhana']
    };
  }

  checkProblemSolvingIntent(clean, raw) {
    // Soal Kecepatan v = s / t
    if (clean.includes('kecepatan') && (clean.includes('jarak') || clean.includes('waktu'))) {
      const nums = clean.match(/\d+(\.\d+)?/g);
      if (nums && nums.length >= 2) {
        const s = parseFloat(nums[0]);
        const t = parseFloat(nums[1]);
        if (t === 0) return null;
        const v = s / t;
        return {
          text: `Yuk kita pecahkan soal gerak lurus ini langkah demi langkah! 🚗💨\n\n` +
            `1. 📋 **Diketahui**:\n• Jarak tempuh (s) = ${s} meter (atau km)\n• Waktu tempuh (t) = ${t} detik (atau jam)\n\n` +
            `2. 📐 **Rumus Fisika**:\nKecepatan rata-rata **v = s / t**\n\n` +
            `3. 🔢 **Langkah Perhitungan**:\nv = ${s} / ${t} = **${Number.isInteger(v) ? v : v.toFixed(2)}**\n\n` +
            `4. 💡 **Kesimpulan Akhir**:\nKecepatannya adalah **${Number.isInteger(v) ? v : v.toFixed(2)} satuan kecepatan**. Perhitungan selesai dan terverifikasi secara fisis!`,
          source: 'Pemecah Soal Fisika Boni',
          suggestions: ['Beri contoh soal percepatan', 'Hukum II Newton', 'Tips belajar fisika']
        };
      }
    }

    // Soal Gaya F = m.a
    if ((clean.includes('gaya') || clean.includes('percepatan')) && clean.includes('massa')) {
      const nums = clean.match(/\d+(\.\d+)?/g);
      if (nums && nums.length >= 2) {
        const m = parseFloat(nums[0]);
        const a = parseFloat(nums[1]);
        const f = m * a;
        return {
          text: `Ini penerapan langsung dari **Hukum II Newton (ΣF = m × a)**! 🚀\n\n` +
            `1. 📋 **Diketahui**:\n• Massa benda (m) = ${m} kg\n• Percepatan (a) = ${a} m/s²\n\n` +
            `2. 📐 **Rumus**:\n**F = m × a**\n\n` +
            `3. 🔢 **Perhitungan**:\nF = ${m} × ${a} = **${f} Newton (N)**\n\n` +
            `4. 💡 **Kesimpulan**:\nGaya total yang dibutuhkan untuk menggerakkan benda tersebut adalah **${f} N**. Gampang kan?`,
          source: 'Pemecah Soal Fisika Boni',
          suggestions: ['Hitung percepatan jika F diketahui', 'Hukum I Newton', 'Hukum III Newton']
        };
      }
    }

    return null;
  }

  calculateMath(text) {
    const cleanMath = text.replace(/[\?\.!]/g, '').replace(/^(berapa|hitung|tolong hitung|hasil dari|nilai dari|coba hitung)\s+/i, '').trim();

    // Akar kuadrat
    const sqrtMatch = cleanMath.match(/^akar\s+(?:kuadrat\s+dari\s+)?([0-9.]+)/i);
    if (sqrtMatch) {
      const val = parseFloat(sqrtMatch[1]);
      const res = Math.sqrt(val);
      return `Hasil dari **√${val}** adalah **${Number.isInteger(res) ? res : res.toFixed(4)}**.`;
    }

    // Persentase: 15% dari 250000
    const pctMatch = cleanMath.match(/^([0-9.]+)\s*%\s*(?:dari|of)\s*([0-9.]+)/i);
    if (pctMatch) {
      const pct = parseFloat(pctMatch[1]);
      const total = parseFloat(pctMatch[2]);
      const res = (pct / 100) * total;
      return `Hasil dari **${pct}% dari ${total}** adalah **${Number.isInteger(res) ? res : res.toFixed(2)}**.`;
    }

    // Aritmetika dasar: a [op] b
    const expr = cleanMath
      .replace(/x/gi, '*')
      .replace(/kali/gi, '*')
      .replace(/bagi/gi, '/')
      .replace(/tambah/gi, '+')
      .replace(/kurang/gi, '-')
      .replace(/pangkat/gi, '^')
      .replace(/\s+/g, '');

    const match = expr.match(/^(-?[0-9.]+)([\+\-\*\/\^])(-?[0-9.]+)$/);
    if (match) {
      const a = parseFloat(match[1]);
      const op = match[2];
      const b = parseFloat(match[3]);

      if (isNaN(a) || isNaN(b)) return null;

      let res = 0;
      let opSymbol = op;
      if (op === '+') { res = a + b; opSymbol = '+'; }
      else if (op === '-') { res = a - b; opSymbol = '-'; }
      else if (op === '*') { res = a * b; opSymbol = '×'; }
      else if (op === '/') {
        if (b === 0) return 'Perhitungan tidak terdefinisi karena pembagian dengan angka 0.';
        res = a / b;
        opSymbol = '÷';
      } else if (op === '^') {
        res = Math.pow(a, b);
        opSymbol = '^';
      }

      const formattedRes = Number.isInteger(res) ? res : Number(res.toFixed(4));
      return `Hasil dari **${a} ${opSymbol} ${b}** adalah **${formattedRes}**.`;
    }

    return null;
  }

  // ==========================================
  // ENSIKLOPEDIA AKADEMIK LENGKAP
  // ==========================================

  checkPopularScience(clean) {
    if (clean.includes('hujan') || clean.includes('siklus air') || clean.includes('siklus hidrologi')) {
      return {
        text: `Pernah penasaran gak, dari mana sih datangnya air hujan yang berlimpah itu? 🌧️\n\nNah, hujan itu terjadi lewat **siklus hidrologi (siklus air)** yang berputar terus-menerus di bumi kita melalui 4 tahapan seru:\n\n1. ☀️ **Evaporasi & Transpirasi**: Air di samudra, danau, dan sungai menguap ke udara karena panas matahari. Tanaman juga ikutan melepas uap air lewat stomata daunnya.\n2. ☁️ **Kondensasi (Membentuk Awan)**: Uap air naik ke atmosfer yang dingin, lalu mengembun jadi butiran-butiran air mikro yang berkumpul jadi awan tebal.\n3. 💧 **Presipitasi (Turun Hujan)**: Di dalam awan, butiran air saling bertabrakan dan makin berat. Pas aliran udara gak kuat lagi menahannya, gravitasi menariknya jatuh ke bumi sebagai **hujan**!\n4. 🏞️ **Infiltrasi & Aliran**: Air hujan meresap ke dalam tanah (jadi cadangan air tanah) atau mengalir lewat sungai kembali ke laut untuk mengulang siklus lagi.\n\nKeren kan daur ulang air alami bumi kita? Mau tahu kenapa pas hujan kadang ada petir?`,
        source: 'Sains Alam • Siklus Hidrologi',
        suggestions: ['Kenapa ada petir?', 'Kenapa langit biru?', 'Bagaimana pelangi terbentuk?']
      };
    }

    if (clean.includes('langit biru') || (clean.includes('langit') && clean.includes('biru'))) {
      return {
        text: `Pertanyaan klasik yang menarik banget! Kenapa ya langit siang hari warnanya biru, bukan ungu atau hijau? 🌤️\n\nNah, di fisika fenomena ini disebut **Hamburan Rayleigh (Rayleigh Scattering)**:\n\n1. 🌈 **Cahaya Matahari itu Gabungan Spektrum**: Sinar matahari yang tampak putih sebenarnya adalah gabungan semua warna pelangi (merah sampai ungu).\n2. 🌊 **Panjang Gelombang Berbeda**: Cahaya merah punya gelombang panjang, sedangkan cahaya biru punya gelombang pendek yang lincah.\n3. 💥 **Tumbukan Partikel Atmosfer**: Saat menembus atmosfer bumi, cahaya bergelombang pendek (biru dan nila) jauh lebih mudah terhambur dan terpantul ke segala arah oleh molekul gas nitrogen dan oksigen.\n\nKarena cahaya biru ini terhambur ke mana-mana di atas kita, mata kita menangkap langit sebagai hamparan warna biru yang cerah!\n\nMenarik kan? Mau tahu juga kenapa pas senja langit malah berubah jadi jingga kemerahan?`,
        source: 'Fisika Optik • Hamburan Rayleigh',
        suggestions: ['Kenapa ada pelangi?', 'Kenapa bisa hujan?', 'Bagaimana petir terjadi?']
      };
    }

    if (clean.includes('petir') || clean.includes('kilat') || clean.includes('guntur')) {
      return {
        text: `**Petir** itu sebenarnya adalah pelepasan muatan listrik raksasa di angkasa, biasanya dari awan badai besar (*Kumulonimbus*)! ⚡\n\nGini proses terjadinya:\n1. ⚡ **Pemisahan Muatan**: Gesekan hebat antara tetes air dan kristal es di awan badai membuat muatan listrik terpisah: muatan positif berkumpul di puncak awan, sedangkan muatan negatif menumpuk di dasar awan.\n2. 💥 **Loncatan Elektron (Kilat)**: Saat beda potensial listrik makin tinggi hingga udara tak sanggup lagi menahannya, terjadilah loncatan listrik berkecepatan tinggi yang menghasilkan kilatan cahaya terang (**kilat**).\n3. 📢 **Dentuman Suara (Guntur)**: Loncatan listrik itu memanaskan udara di sekitarnya seketika sampai suhu ~30.000°C (lebih panas dari permukaan matahari!). Udara memuai mendadak dan memicu gelombang kejut suara menggelegar (**guntur**).\n\n*Kenapa kilat kelihatan dulu baru suaranya terdengar?* Karena kecepatan cahaya (~300.000 km/s) jutaan kali lebih kencang dibanding kecepatan suara di udara (~340 m/s)!\n\nKeren dan dahsyat banget kan tenaga alam itu?`,
        source: 'Fisika Alam • Listrik Statis Atmosfer',
        suggestions: ['Kenapa bisa hujan?', 'Kenapa langit biru?', 'Berapa kecepatan cahaya?']
      };
    }

    if (clean.includes('pelangi')) {
      return {
        text: `Pelangi itu seperti lukisan fisika di langit setelah hujan! 🌈\n\nPelangi muncul saat sinar matahari mengenai jutaan tetesan air sisa hujan di udara melalui 3 peristiwa optik:\n1. 🔍 **Refraksi (Pembiasan)**: Cahaya matahari dibelokkan saat masuk ke dalam tetesan air.\n2. 🎨 **Dispersi (Penguraian Warna)**: Cahaya putih matahari diuraikan jadi spektrum warna-warni (Merah, Jingga, Kuning, Hijau, Biru, Nila, Ungu) karena tiap warna punya panjang gelombang dan sudut belok berbeda.\n3. 🪞 **Refleksi Internal**: Warna-warni tadi memantul di dinding belakang tetesan air, lalu keluar kembali ke udara menuju mata kita dengan sudut sekitar 40°–42°.\n\nMakanya, pelangi selalu muncul di arah yang berlawanan dengan posisi matahari! Pernah lihat pelangi ganda?`,
        source: 'Fisika Optik • Dispersi Cahaya',
        suggestions: ['Kenapa langit biru?', 'Kenapa bisa hujan?', 'Hitung kecepatan cahaya']
      };
    }

    if (clean.includes('fotosintesis') || clean.includes('klorofil')) {
      return {
        text: `**Fotosintesis** itu ibarat "dapur makanan" bagi seluruh makhluk hidup di bumi! Tumbuhan berklorofil memasak makanannya sendiri menggunakan bantuan energi cahaya matahari. 🌱☀️\n\nNih resep kimianya:\n**6 CO₂ (Karbon Dioksida) + 6 H₂O (Air) + Cahaya Matahari ➔ C₆H₁₂O₆ (Glukosa) + 6 O₂ (Oksigen)**\n\nAda dua tahapan seru di dalam kloroplas:\n1. ☀️ **Reaksi Terang (di Tilakoid)**: Klorofil menangkap foton matahari untuk memecah molekul air (fotolisis) dan menghasilkan energi ATP, NADPH, serta melepaskan oksigen segar yang kita hirup sehari-hari.\n2. 🌙 **Reaksi Gelap / Siklus Calvin (di Stroma)**: Memanfaatkan energi dari reaksi terang untuk mengubah karbon dioksida menjadi glukosa/energi bagi tumbuhan.\n\nBayangin kalau gak ada tumbuhan yang berfotosintesis, bumi kita bakal kekurangan oksigen lho! Ada yang mau kamu tanyain soal kloroplas?`,
        source: 'Biologi Tumbuhan • Fisiologi Fotosintesis',
        suggestions: ['Apa itu intestin?', 'Tips belajar efektif', 'Buka Generator Kuis']
      };
    }

    return null;
  }

  // ==========================================
  // OBROLAN UMUM & PENGETAHUAN BEBAS (TANPA HARUS ADA MODUL)
  // ==========================================

  checkGeneralCuriosity(clean, raw) {
    // 1. Kopi, Kafein & Rasa Kantuk
    if (clean.includes('kopi') && (clean.includes('melek') || clean.includes('mengantuk') || clean.includes('tidur') || clean.includes('kafein') || clean.includes('kenapa') || clean.includes('fokus'))) {
      return {
        text: `Pertanyaan yang seru dan relate banget sama rutinitas sehari-hari! ☕⚡\n\n` +
          `Kenapa secangkir kopi bisa bikin kita seketika melek dan segar? Nih rahasia sains di otak kita:\n\n` +
          `1. 🧠 **Molekul Penyamar (Trik Kafein)**:\nSepanjang kita beraktivitas, sel-sel otak kita memproduksi zat bernama **adenosin**. Makin lama kita terjaga, makin banyak adenosin yang menumpuk dan menempel pada reseptor otak, mengirimkan sinyal rasa kantuk dan lelah. Nah, struktur molekul **kafein** itu mirip banget sama adenosin!\n\n` +
          `2. 🚫 **Blokade Reseptor Kantuk**:\nSaat kamu minum kopi, kafein langsung "menyerobot" dan mengunci reseptor adenosin di otak tanpa mengaktifkannya. Alhasil, adenosin asli tidak bisa menempel, dan sinyal rasa kantuk ke otakmu terblokir sementara!\n\n` +
          `3. 🚀 **Lonjakan Dopamin & Adrenalin**:\nSelain memblokir rasa kantuk, kafein juga memicu pelepasan hormon adrenalin dan neurotransmiter dopamin. Detak jantung meningkat sedikit, aliran darah ke otot lancar, dan fokus pikiranmu jadi tajam!\n\n` +
          `*Tips dari Boni:* Efek puncak kafein biasanya terjadi 30–60 menit setelah diminum dan bertahan 4–6 jam. Jadi usahakan jangan minum kopi menjelang jam tidur malam ya agar tidurmu tetap nyenyak!\n\n` +
          `Ada fakta sains menarik lainnya yang bikin kamu penasaran hari ini?`,
        source: 'Sains Fisiologi Keseharian',
        suggestions: ['Kenapa kita bermimpi?', 'Tips manajemen waktu', 'Bagaimana cara kerja AI?']
      };
    }

    // 2. Tidur & Mimpi
    if (clean.includes('mimpi') || (clean.includes('tidur') && (clean.includes('kenapa') || clean.includes('mengapa') || clean.includes('otak') || clean.includes('fase')))) {
      return {
        text: `Misteri di balik alam tidur itu salah satu topik neurosains yang paling memukau! 🌙🧠\n\n` +
          `Kenapa ya manusia bermimpi saat tidur? Berikut penjelasan ilmiahnya:\n\n` +
          `1. ⚡ **Fase REM (Rapid Eye Movement)**:\nMimpi paling jelas dan emosional terjadi pada fase tidur REM, di mana bola mata kita bergerak cepat di balik kelopak mata dan gelombang aktivitas otak melonjak hampir seaktif saat kita sedang terjaga!\n\n` +
          `2. 🗄️ **Konsolidasi Memori & Pembersihan Berkas Otak**:\nSaat bermimpi, hipokampus dan neokorteks bekerja layaknya "petugas arsip". Otak memilah memori penting hari itu untuk diintegrasikan ke memori jangka panjang, sekaligus membuang informasi yang tidak berguna agar memori otak tidak penuh (*neural decluttering*).\n\n` +
          `3. 🎭 **Simulasi Emosi & Pemecahan Masalah**:\nMimpi juga berfungsi sebagai "simulator virtual yang aman". Otak melatih kita menghadapi berbagai skenario cemas atau mencari pola baru tanpa risiko nyata di dunia fisik.\n\n` +
          `Pernah mengalami mimpi yang terasa nyata banget? Ada topik sains manusia lain yang ingin kita bahas bareng?`,
        source: 'Neurosains & Fisiologi Tidur',
        suggestions: ['Kenapa kopi bikin melek?', 'Apa itu filosofi Stoikisme?', 'Ceritakan tentang luar angkasa']
      };
    }

    // 3. Luar Angkasa, Lubang Hitam (Black Hole) & Alam Semesta
    if (clean.includes('lubang hitam') || clean.includes('black hole') || clean.includes('luar angkasa') || clean.includes('tata surya') || clean.includes('alam semesta') || (clean.includes('bintang') && clean.includes('langit'))) {
      return {
        text: `Luar angkasa adalah panggung kosmik yang dahsyat dan penuh keajaiban! 🌌🔭\n\n` +
          `Mari kita bahas fenomena paling ekstrem di alam semesta: **Lubang Hitam (Black Hole)**:\n\n` +
          `1. 💥 **Lahir dari Kematian Bintang Raksasa**:\nKetika sebuah bintang masif kehabisan bahan bakar nuklirnya, gravitasi meremukkan intinya ke dalam titik yang sangat kecil tak berhingga bernama **Singularitas**.\n\n` +
          `2. 🕳️ **Gravitasi Tak Tertandingi (Event Horizon)**:\nGravitasinya begitu dahsyat sampai kecepatan lepasnya melebihi kecepatan cahaya (~300.000 km/s). Batas lingkaran tak kasat mata di mana tidak ada apa pun—bahkan cahaya sekalipun—yang bisa kembali disebut **Horizon Peristiwa (*Event Horizon*)**.\n\n` +
          `3. ⏳ **Waktu Berhenti (Dilatasi Waktu Relativitas)**:\nSesuai Teori Relativitas Umum Einstein, gravitasi ekstrem lubang hitam melengkungkan ruang dan waktu. Semakin dekat kamu ke batas lubang hitam, waktu akan berjalan jauh lebih lambat dibanding pengamat di bumi!\n\n` +
          `Keren dan misterius banget kan kosmos kita? Mau tahu bagaimana para astronom berhasil memotret bayangan lubang hitam M87?`,
        source: 'Astrofisika Kosmik • Lubang Hitam',
        suggestions: ['Kenapa langit berwarna biru?', 'Berapa kecepatan cahaya?', 'Bagaimana petir terjadi?']
      };
    }

    // 4. Filosofi Stoikisme (Stoicism) & Ketenangan Batin
    if (clean.includes('stoikisme') || clean.includes('stoik') || clean.includes('stoic') || clean.includes('stoicism')) {
      return {
        text: `Wah, topik filosofi yang sangat menyejukkan dan relevan untuk kehidupan modern! 🏛️🌿\n\n` +
          `**Stoikisme (Stoicism)** adalah mazhab filsafat Yunani-Romawi kuno (dipopulerkan oleh Marcus Aurelius, Seneca, dan Epictetus) yang mengajarkan seni hidup tangguh, tenang, dan bijaksana.\n\n` +
          `Prinsip inti Stoikisme yang paling terkenal adalah **Dikotomi Kendali (*Dichotomy of Control*)**:\n\n` +
          `1. 🎯 **Hal yang BERADA di Bawah Kendali Kita**:\n• Pikiran kita, respon kita, tindakan kita, cara pandang kita, dan usaha yang kita berikan. Ini 100% tanggung jawab kita.\n\n` +
          `2. 🍃 **Hal yang DI LUAR Kendali Kita**:\n• Hasil akhir, cuaca, penilaian orang lain, masa lalu, dan kejadian tak terduga. Terhadap hal-hal ini, seorang stoik belajar untuk menerima dengan lapang dada (*Amor Fati* - mencintai takdir).\n\n` +
          `*Intinya:* Kita tidak bisa mengatur apa yang terjadi di luar sana, tapi kita punya kendali penuh atas bagaimana kita meresponnya! Ketenangan batin lahir saat kita berhenti mencemaskan hal yang tak bisa kita ubah.\n\n` +
          `Gimana kawan, konsep ini relate gak sama keseharianmu? Mau bahas konsep lain seperti Ikigai atau Kaizen?`,
        source: 'Filosofi Hidup • Stoikisme',
        suggestions: ['Apa itu konsep Ikigai?', 'Tips mengatasi cemas & grogi', 'Tips manajemen waktu']
      };
    }

    // 5. Konsep Ikigai & Kaizen
    if (clean.includes('ikigai') || clean.includes('kaizen')) {
      return {
        text: `Dua kearifan hidup dari Jepang yang terkenal bikin hidup terarah dan produktif! 🌸🇯🇵\n\n` +
          `1. 🧭 **IKIGAI (Alasan untuk Bangun di Pagi Hari)**:\nMerupakan titik temu harmonis dari 4 lingkaran penting:\n• Apa yang kamu cintai (*Passion*)\n• Apa yang kamu kuasai dengan baik (*Vocation*)\n• Apa yang dibutuhkan oleh lingkunganmu (*Mission*)\n• Apa yang bisa menghasilkan nafkah (*Profession*)\nSaat keempatnya bertemu, kamu menemukan kepuasan batin yang mendalam.\n\n` +
          `2. 📈 **KAIZEN (Prinsip Perbaikan 1% Tiap Hari)**:\nDaripada membebani diri dengan target raksasa yang bikin kewalahan, Kaizen mengajarkan langkah mikro: perbaiki 1% saja kualitas dirimu setiap hari secara konsisten. Dalam setahun (1.01³⁶⁵), kamu akan berkembang 37 kali lipat!\n\n` +
          `Prinsip hidup yang menenangkan sekaligus menyemangati kan? Mau coba petakan Ikigai pribadimu bareng Boni?`,
        source: 'Filosofi Jepang • Pengembangan Diri',
        suggestions: ['Apa itu filosofi Stoikisme?', 'Tips manajemen waktu', 'Tips belajar fokus']
      };
    }

    // 6. Mengatasi Grogi / Demam Panggung (Public Speaking)
    if (clean.includes('grogi') || clean.includes('demam panggung') || clean.includes('public speaking') || clean.includes('gugup') || clean.includes('presentasi')) {
      return {
        text: `Rasa grogi atau gugup saat mau bicara di depan umum itu 100% normal dan dialami oleh semua orang, bahkan pembicara profesional sekalipun! 🎤✨\n\n` +
          `Secara biologis, saat kamu mau tampil, otak mengaktifkan respon *fight-or-flight* dan membanjiri tubuh dengan hormon adrenalin. Nah, ini trik cerdas menaklukkannya:\n\n` +
          `1. 🌬️ **Pernapasan Kotak (Box Breathing 4-4-4)**:\nTarik napas 4 detik, tahan 4 detik, hembuskan perlahan 4 detik. Ini mengirim sinyal langsung ke saraf vagus untuk menurunkan detak jantung dan merilekskan otot yang tegang.\n\n` +
          `2. 🔄 **Reframe: Ubah 'Gugup' Jadi 'Antusias'**:\nSecara fisiologis, sinyal tubuh saat gugup dan saat antusias/bersemangat itu sama persis (jantung berdegup, waspada). Katakan pada dirimu: *"Aku bukan takut, tapi energiku lagi memuncak buat tampil keren!"*\n\n` +
          `3. ⏱️ **Kuasai 30 Detik Pertama**:\nBiasanya grogi paling dahsyat hanya terjadi di 30 detik pertama. Hafalkan kalimat pembukamu sampai otomatis di luar kepala. Begitu 30 detik lewat, ritmemu bakal mengalir santai!\n\n` +
          `4. 🎯 **Fokus Membantu Audiens, Bukan Menilai Diri Sendiri**:\nAlihkan fokus: jangan pikirkan *"gimana penilaian orang tentangku"*, tapi pikirkan *"wawasan bermanfaat apa yang bisa kubagikan buat mereka"*. Beban mentalmu langsung berkurang drastis!\n\n` +
          `Mau tips persiapan presentasi atau latihan pembukaannya bareng Boni?`,
        source: 'Psikologi Praktis & Komunikasi',
        suggestions: ['Tips manajemen waktu', 'Apa itu filosofi Stoikisme?', 'Tips belajar fokus']
      };
    }

    // 7. Introvert vs Ekstrovert
    if (clean.includes('introvert') || clean.includes('ekstrovert') || clean.includes('ambivert')) {
      return {
        text: `Topik kepribadian yang selalu menarik untuk dibahas! 🧩👥\n\n` +
          `Perbedaan mendasar antara **Introvert, Ekstrovert, dan Ambivert** sebenarnya bukan soal pemalu atau ramah, melainkan **dari mana mereka mengisi ulang (recharge) energi mental mereka**:\n\n` +
          `1. 🌿 **Introvert (Recharge dari Ketenangan)**:\n• Mengisi ulang energi melalui waktu sendiri (*solitude*), refleksi mendalam, atau interaksi santai satu-lawan-satu.\n• Sistem saraf introvert lebih sensitif terhadap stimulasi lingkungan, sehingga suasana yang terlalu bising atau ramai cepat membuat baterai sosialnya terkuras.\n\n` +
          `2. ⚡ **Ekstrovert (Recharge dari Interaksi Sosial)**:\n• Mengisi ulang energi dengan berada di tengah banyak orang, berdiskusi kelompok, dan mencoba aktivitas baru yang dinamis.\n• Otak ekstrovert membutuhkan stimulasi lingkungan luar yang lebih tinggi untuk memicu rasa puas dan bersemangat.\n\n` +
          `3. ⚖️ **Ambivert (Keseimbangan Fleksibel)**:\n• Memiliki spektrum di tengah-tengah: bisa menikmati pergaulan ramai, namun setelah itu tetap membutuhkan waktu hening untuk menyeimbangkan diri.\n\n` +
          `Ketiganya punya kelebihan luar biasa masing-masing! Kalau kamu sendiri merasa lebih condong ke tipe yang mana nih kawan?`,
        source: 'Psikologi Kepribadian',
        suggestions: ['Tips mengatasi grogi', 'Apa itu konsep Ikigai?', 'Tips belajar fokus']
      };
    }

    // 8. Cara Kerja Kecerdasan Buatan (AI)
    if (clean.includes('cara kerja ai') || clean.includes('bagaimana ai') || clean.includes('kecerdasan buatan') || clean.includes('machine learning')) {
      return {
        text: `Penasaran bagaimana teknologi seperti AI bisa diajak ngobrol dan memecahkan soal? 🤖💻\n\n` +
          `Pada dasarnya, **Kecerdasan Buatan (AI)** bekerja melalui prinsip **pembelajaran dari pola data raksasa** (*Machine Learning & Deep Learning*):\n\n` +
          `1. 📚 **Tahap Pelatihan (Training Data)**:\nIbarat anak kecil yang ditunjukkan jutaan foto kucing dan anjing hingga bisa membedakan ciri keduanya secara insting, AI dilatih membaca miliaran kalimat buku, ensiklopedia, dan kode untuk mempelajari struktur bahasa, logika sains, dan nalar manusia.\n\n` +
          `2. 🧠 **Jaringan Syaraf Tiruan (Neural Network)**:\nArsitektur matematika yang meniru jaringan neuron di otak manusia. Model menghitung bobot probabilitas kata berikutnya (*predicting the next token*) yang paling relevan, tepat, dan membantu sesuai konteks pertanyaanmu.\n\n` +
          `3. 🎯 **Penyelarasan & Nilai Manusia (Alignment)**:\nAI disetel agar selalu aman, sopan, bersahabat, dan bermanfaat—layaknya Boni yang siap menemani belajarmu dengan bahasa yang mudah dipahami!\n\n` +
          `Keren kan bagaimana matematika dan komputasi bisa melahirkan asisten cerdas? Ada aspek AI yang ingin kamu tanyakan lebih dalam?`,
        source: 'Ilmu Komputer & Kecerdasan Buatan',
        suggestions: ['Apa itu CPU dan RAM?', 'Ceritakan tentang luar angkasa', 'Tips belajar fokus']
      };
    }

    // 9. Musik & Suasana Hati (Mood)
    if (clean.includes('musik') && (clean.includes('mood') || clean.includes('suasana hati') || clean.includes('otak') || clean.includes('fokus') || clean.includes('belajar'))) {
      return {
        text: `Musik memang punya sihir biologis yang luar biasa bagi pikiran kita! 🎵🎧\n\n` +
          `Kenapa musik bisa seketika mengubah mood atau membantu kita fokus saat belajar?\n\n` +
          `1. 🧪 **Pelepasan Hormon Bahagia (Dopamin)**:\nSaat mendengarkan melodi yang kita sukai, sistem limbik di otak melepaskan **dopamin**—neurotransmiter yang memicu rasa senang, rileks, dan motivasi.\n\n` +
          `2. 🌊 **Sinkronisasi Gelombang Otak (Brain Entrainment)**:\n• Musik dengan tempo lambat (60–80 BPM) merangsang **gelombang Alpha (8–13 Hz)** di otak, yaitu kondisi relaks tapi tetap waspada (*relaxed alertness*), sangat ideal buat belajar dan membaca buku.\n• Musik dengan ritme dinamis memicu **gelombang Beta**, cocok buat olahraga atau kerja cepat!\n\n` +
          `*Rekomendasi Boni:* Buat belajar materi rumit (matematika/sains), coba dengarkan musik instrumental klasik (Mozart/Chopin), lofi beats tanpa lirik, atau white noise alam (suara rintik hujan). Pikiran bakal jauh lebih hening dan fokus!\n\n` +
          `Genre musik apa yang paling sering nemenin harimu kawan?`,
        source: 'Psikologi Musik & Neurosains',
        suggestions: ['Tips belajar fokus', 'Kenapa kita bermimpi?', 'Bagaimana cuaca hari ini?']
      };
    }

    // 10. Peribahasa & Makna Bijak
    if (clean.includes('peribahasa') || clean.includes('air tenang') || clean.includes('tong kosong') || clean.includes('berakit-rakit')) {
      return {
        text: `Peribahasa nusantara itu penuh dengan kearifan filosofis yang sangat dalam! 📜✨\n\n` +
          `Nih beberapa peribahasa legendaris dan makna indahnya:\n\n` +
          `1. 🌊 *"Air tenang menghanyutkan"*\n• **Maknanya**: Orang yang pendiam, tidak banyak bicara, dan tidak pamer sering kali memiliki kecerdasan, keteguhan hati, dan kemampuan yang sangat luar biasa di saat genting.\n\n` +
          `2. 🥁 *"Tong kosong nyaring bunyinya"*\n• **Maknanya**: Orang yang ilmunya sedikit atau dangkal biasanya justru yang paling berisik membanggakan dirinya sendiri di depan publik.\n\n` +
          `3. 🚣 *"Berakit-rakit ke hulu, berenang-renang ke tepian"*\n• **Maknanya**: Bersakit-sakit dahulu, bersenang-senang kemudian. Segala perjuangan belajar dan kerja keras yang kita rintis hari ini akan berbuah manis di masa depan!\n\n` +
          `Ada peribahasa favorit yang selalu jadi pegangan hidupmu kawan?`,
        source: 'Sastra & Kearifan Bahasa Indonesia',
        suggestions: ['Apa itu teks eksposisi?', 'Kata mutiara motivasi', 'Tips belajar efektif']
      };
    }

    // 11. Manajemen Keuangan Pribadi (Personal Finance)
    if (clean.includes('keuangan') || clean.includes('mengatur uang') || clean.includes('menabung') || clean.includes('gaji') || clean.includes('finansial')) {
      return {
        text: `Melek finansial (*financial literacy*) sejak dini adalah salah satu keahlian hidup paling bernilai! 💰📊\n\n` +
          `Nih rumus praktis dan teruji buat mengatur keuangan pribadimu:\n\n` +
          `1. 📐 **Metode 50 / 30 / 20**:\n• **50% untuk Kebutuhan Pokok (Needs)**: Makanan sehari-hari, sewa tempat/kos, transportasi, kuota internet, dan listrik.\n• **30% untuk Keinginan (Wants)**: Hobi, nongkrong santai, nonton film, atau self-reward yang terukur.\n• **20% untuk Masa Depan (Savings & Investing)**: Tabungan dana darurat dan investasi masa depan.\n\n` +
          `2. 🛡️ **Dahulukan Dana Darurat**:\nSebelum mulai investasi risiko tinggi, pastikan punya cadangan dana 3 sampai 6 kali pengeluaran bulanan di instrumen likuid (tabungan terpisah). Ini jadi jaring pengamanmu saat ada kondisi tak terduga.\n\n` +
          `3. 🛑 **Prinsip Jeda 24 Jam Sebelum Beli Barang Keinginan**:\nKalau mau beli barang non-pokok, tunda 24–48 jam. Jika setelahnya kamu masih merasa butuh, baru pertimbangkan beli. Ini mencegah *impulsive buying*!\n\n` +
          `Mau diskusi seputar pasar modal, saham, atau inflasi juga bareng Boni?`,
        source: 'Literasi Keuangan & Perencanaan',
        suggestions: ['Apa itu inflasi?', 'Tips manajemen waktu', 'Tips belajar fokus']
      };
    }

    return null;
  }

  checkBroadAcademic(clean) {
    // 1. Biologi: Intestin / Usus
    if (
      clean.includes('intestin') || clean.includes('intestinum') ||
      clean.includes('apa itu usus') || clean.includes('fungsi usus') ||
      clean.includes('anatomi usus')
    ) {
      return {
        text: `Wah, pertanyaan penting banget dalam anatomi tubuh kita! 🧬\n\n**Intestin (Usus / *Tractus Intestinalis*)** adalah segmen saluran pencernaan yang memanjang dari pintu keluar lambung (sfingter pilorus) hingga ke anus. Pada manusia dewasa, panjang total usus mencapai sekitar 7,5 hingga 8,5 meter!\n\nIntestin terbagi menjadi dua organ utama dengan tugas yang sangat terorganisir:\n\n1. 🌾 **Intestinum Tenue (Usus Halus)** (panjang ~6–7 meter):\n• **Fungsi Utama**: Menyelesaikan pencernaan kimiawi secara tuntas dan menyerap (absorpsi) sekitar 90% sari makanan ke pembuluh darah dan limfa.\n• Terbagi jadi 3 bagian: **Duodenum** (usus 12 jari - muara empedu & getah pankreas), **Jejunum** (usus kosong - pencernaan lanjutan), dan **Ileum** (usus penyerapan - memiliki jutaan lipatan **vili** dan mikrovili).\n\n2. 🧱 **Intestinum Crassum (Usus Besar / Kolon)** (panjang ~1,5 meter):\n• **Fungsi Utama**: Menyerap kembali kelebihan air dan garam mineral dari sisa makanan agar tubuh tidak dehidrasi dan feses berbentuk padat.\n• Menjadi habitat triliunan bakteri menguntungkan (*Escherichia coli*) yang membantu pembusukan sisa makanan serta memproduksi vitamin K dan biotin.\n\n3. 🚪 **Rektum dan Anus**: Sebagai muara penampungan feses sementara sebelum dikeluarkan melalui proses defekasi.\n\nTanpa intestin yang sehat, tubuh kita gak akan bisa menyerap gizi dari makanan yang kita makan! Ada bagian usus halus atau usus besar yang mau kamu tanyakan lebih spesifik?`
      };
    }

    // Cara kerja enzim
    if (clean.includes('cara kerja enzim') || clean.includes('bagaimana enzim bekerja') || clean.includes('mekanisme enzim')) {
      return {
        text: `Pertanyaan cerdas seputar biokimia! 🧪\n\n**Enzim** adalah biokatalisator organik (kebanyakan berupa protein) yang mempercepat laju reaksi kimia dalam tubuh tanpa ikut habis bereaksi. Enzim bekerja dengan cara **menurunkan energi aktivasi (Ea)** yang dibutuhkan untuk memulai reaksi.\n\nNih 2 teori utama cara kerja enzim:\n1. 🔑 **Teori Kunci & Gembok (Lock and Key)**: Sisi aktif enzim memiliki bentuk geometris yang kaku dan pas persis dengan substratnya, layaknya anak kunci dengan lubang gemboknya.\n2. 🧤 **Teori Ketepatan Induksi (Induced Fit)**: Sisi aktif enzim bersifat fleksibel dan dapat sedikit berubah bentuk menyesuaikan lekukan substrat saat berikatan.\n\n**Faktor yang Mempengaruhi Kerja Enzim**:\n• **Suhu**: Bekerja optimal pada suhu tubuh (~37°C). Jika terlalu panas, enzim bakal terdenaturasi (rusak permanen).\n• **pH Lingkungan**: Tiap enzim punya pH favorit (misal pepsin di lambung suka pH asam 1,5–2, sedangkan amilase saliva suka pH netral ~7).\n\nKeren kan presisi kerja enzim di tubuh kita? Mau kita bahas enzim tertentu seperti amilase atau pepsin?`
      };
    }

    // Esofagus
    if (clean.includes('esofagus') || clean.includes('kerongkongan') || clean.includes('peristaltik')) {
      return {
        text: `Nah, makanan yang kita telan masuk ke saluran berotot yang namanya **esofagus (kerongkongan)**! 🥢\n\n• **Gerak Peristaltik**: Di kerongkongan, makanan didorong menuju lambung bukan karena gaya gravitasi, melainkan oleh **gerak peristaltik**—yaitu gelombang kontraksi dan relaksasi ritmis otot polos dinding esofagus. Bahkan saat kamu berbaring atau jungkir balik, makanan tetap bisa sampai ke lambung!\n• Di ujung bawah esofagus terdapat katup berotot bernama **sfingter kardia (sfingter esofagus bawah)**. Katup ini membuka saat makanan lewat dan langsung menutup rapat kembali agar asam lambung tidak naik ke atas.\n\nKalau katup sfingter ini melemah, asam lambung bisa bocor ke esofagus dan menimbulkan penyakit **GERD** lho! Ada yang mau kamu tanyakan tentang gerak peristaltik?`
      };
    }

    // Lambung
    if (
      clean.includes('apa itu lambung') || clean.includes('fungsi lambung') ||
      (clean.includes('lambung') && (clean.includes('organ') || clean.includes('bagian') || clean.includes('peran')))
    ) {
      return {
        text: `Lambung (*ventrikulus / gaster*) adalah kantung berotot berbentuk huruf 'J' di rongga perut kiri atas kita! 🍲\n\nLambung punya 4 tugas vital dalam sistem pencernaan:\n1. 📦 **Tempat Penyimpanan Sementara**: Menampung makanan dan minuman selama 2 hingga 4 jam.\n2. 🌀 **Pencernaan Mekanis**: Otot dinding lambung yang tebal berkontraksi meremas bolus makanan menjadi bubur semi-kental yang disebut **kimus (chyme)**.\n3. 🧪 **Pencernaan Kimiawi**: Menghasilkan asam klorida (HCl) dan enzim pepsin untuk memotong ikatan protein kompleks menjadi pepton.\n4. 🛡️ **Pertahanan Tubuh**: Keasaman lambung yang sangat tinggi (pH 1,5–2) langsung membasmi bakteri berbahaya yang ikut tertelan di makanan.\n\nSetelah diolah di lambung, kimus disalurkan sedikit demi sedikit ke usus 12 jari (duodenum). Mau bahas getah lambung atau enzim pepsin?`
      };
    }

    // Hati & Empedu
    if (clean.includes('empedu') || clean.includes('fungsi empedu') || clean.includes('kantung empedu')) {
      return {
        text: `Cairan empedu ini punya peran krusial dalam pencernaan lemak lho kawan! 🥑\n\n• **Diproduksi di Mana?**: Cairan empedu diproduksi oleh **hati (hepar)** dan disimpan serta dipekatkan di **kantung empedu (vesika felea)**.\n• **Fungsi Utama (Emulsi Lemak)**: Lemak dan air secara alami tidak bisa menyatu. Nah, garam empedu bekerja seperti "sabun alami" yang memecah gumpalan lemak besar menjadi butiran mikro (*misel*).\n• **Mengoptimalkan Enzim Lipase**: Berkat emulsi empedu, luas permukaan lemak meningkat ribuan kali lipat, sehingga enzim lipase pankreas dapat dengan kilat mencernanya menjadi asam lemak dan gliserol!\n\nTanpa cairan empedu, tubuh kita bakal kesulitan menyerap lemak dan vitamin larut lemak (A, D, E, K). Keren ya sistem kerja tubuh kita?`
      };
    }

    // Jantung
    if (clean.includes('jantung') || clean.includes('peredaran darah')) {
      return {
        text: `Jantung kita adalah pompa otot terhebat di dunia! Ukurannya cuma sebesar kepalan tangan, tapi berdetak sekitar 100.000 kali setiap hari tanpa henti. ❤️\n\nJantung manusia punya 4 ruang utama:\n1. **Serambi Kanan (Atrium Kanan)**: Menerima darah kaya CO₂ dari seluruh tubuh.\n2. **Bilik Kanan (Ventrikel Kanan)**: Memompa darah kotor ke paru-paru buat dibersihkan.\n3. **Serambi Kiri (Atrium Kiri)**: Menerima darah segar kaya oksigen dari paru-paru.\n4. **Bilik Kiri (Ventrikel Kiri)**: Bagian berdinding otot paling tebal, memompa darah kaya O₂ ke seluruh tubuh!\n\nMakanya rajin olahraga aerobik ya biar pompa jantungmu makin kuat dan sehat!`
      };
    }

    // Ginjal
    if (clean.includes('ginjal') || clean.includes('nefron') || clean.includes('urine') || clean.includes('kencing')) {
      return {
        text: `Ginjal kita berfungsi sebagai "pabrik penyaring racun" di tubuh! Di dalam ginjal ada sekitar satu juta unit penyaring mikro yang disebut **nefron**. 🫘\n\nProses pembuatan urine berlangsung lewat 3 tahapan:\n1. 💧 **Filtrasi (di Glomerulus)**: Darah disaring, menghasilkan urine primer yang masih mengandung air, glukosa, dan asam amino.\n2. 🔄 **Reabsorpsi (di Tubulus Proksimal)**: Zat-zat penting yang masih berguna (seperti glukosa dan garam) diserap kembali ke darah, menghasilkan urine sekunder.\n3. 📤 **Augmentasi (di Tubulus Distal)**: Penambahan sisa racun (seperti urea dan obat-obatan) membentuk urine sebenarnya yang siap dialirkan ke kandung kemih.\n\nMakanya banyak-banyak minum air putih ya biar ginjalmu gampang menyaring kotoran!`
      };
    }

    // DNA & RNA
    if (clean.includes('dna') || clean.includes('rna') || clean.includes('genetika') || clean.includes('kromosom')) {
      return {
        text: `**DNA (Deoxyribonucleic Acid)** itu ibarat "cetak biru / buku resep arsitektur" kehidupan kita! 🧬\n\n• Bentuknya berupa heliks ganda (*double helix*) yang tersusun dari pasangan basa nitrogen: **Adenin (A) berpasangan dengan Timin (T)**, dan **Guanin (G) berpasangan dengan Sitosin (C)**.\n• DNA menyimpan semua instruksi kode genetik: mulai dari warna matamu, bentuk rambut, sampai tinggi badanmu.\n• Sedangkan **RNA (Ribonucleic Acid)** bertindak sebagai kurir pengantar pesan yang menyalin instruksi DNA untuk membuat protein di ribosom.\n\nUnik kan? Setiap manusia di dunia punya susunan DNA yang khas dan tidak ada yang 100% sama persis (kecuali kembar identik)!`
      };
    }

    // Inflasi
    if (clean.includes('inflasi') || clean.includes('daya beli')) {
      return {
        text: `**Inflasi** adalah kenaikan harga barang dan jasa secara umum dan terus-menerus dalam jangka waktu tertentu, yang berakibat pada penurunan daya beli uang. 📈\n\nAda dua penyebab utamanya:\n1. 🛍️ **Demand-Pull Inflation**: Kenaikan harga karena lonjakan permintaan masyarakat yang sangat tinggi, sementara stok barang terbatas.\n2. 🏭 **Cost-Push Inflation**: Kenaikan harga yang dipicu oleh naiknya biaya produksi (misalnya lonjakan harga BBM, tarif listrik, atau bahan baku impor).\n\nUntuk mengendalikan inflasi, bank sentral (Bank Indonesia) menjalankan **kebijakan moneter** dengan menaikkan suku bunga acuan (*BI-Rate*) agar peredaran uang terkendali. Kebayang kan dampaknya ke harga barang sehari-hari?`
      };
    }

    // CPU
    if (clean.includes('cpu') || clean.includes('prosesor') || clean.includes('processor')) {
      return {
        text: `**CPU (Central Processing Unit)** atau prosesor sering dijuluki sebagai "otak" komputer! 💻\n\nBerdasarkan arsitektur Von Neumann, CPU terdiri dari 3 bagian penting:\n1. ⚙️ **ALU (Arithmetic Logic Unit)**: Bertugas mengeksekusi semua operasi hitungan matematika (+, -, ×, ÷) dan perbandingan logika (AND, OR, NOT).\n2. 🧭 **CU (Control Unit)**: Bertindak sebagai komandan lalu lintas data yang mengarahkan instruksi ke komponen yang tepat.\n3. ⚡ **Register**: Memori internal berkecepatan paling tinggi di dunia komputer untuk menyimpan data yang sedang diproses detik itu juga.\n\nCPU bekerja dengan siklus tanpa henti: **Fetch** (ambil data dari RAM), **Decode** (terjemahkan instruksi), dan **Execute** (eksekusi di ALU)! Canggih banget kan?`
      };
    }

    // Litosfer
    if (clean.includes('litosfer') || (clean.includes('kerak') && clean.includes('bumi'))) {
      return {
        text: `**Litosfer** adalah lapisan batuan padat terluar yang membungkus bola bumi kita! Berasal dari kata Yunani *lithos* (batuan) dan *sphaira* (lapisan/bulatan). 🌍\n\nStrukturnya terdiri dari:\n1. 🏔️ **Kerak Benua**: Lapisan daratan dengan ketebalan 30–70 km, kaya akan batuan granit yang mengandung silisium dan aluminium (lapisan SiAl).\n2. 🌊 **Kerak Samudera**: Lapisan dasar laut dengan ketebalan 5–10 km, kaya akan batuan basal yang mengandung silisium dan magnesium (lapisan SiMa).\n3. 🌋 **Bagian Atas Mantel Bumi**: Batuan kaku yang bersama kerak bumi membentuk lempeng-lempeng tektonik yang terus bergerak di atas astenosfer.\n\nGerakan lempeng litosfer inilah yang melahirkan gunung berapi, palung laut, dan memicu gempa bumi! Mau tahu pergerakan lempeng tektonik?`
      };
    }

    // Teks Eksposisi
    if (clean.includes('teks eksposisi') || clean.includes('eksposisi')) {
      return {
        text: `**Teks Eksposisi** adalah jenis teks nonfiksi yang bertujuan menyampaikan atau memaparkan informasi, gagasan, atau ilmu pengetahuan secara ringkas, padat, dan akurat agar menambah wawasan pembaca. 📝\n\nStruktur teks eksposisi terdiri dari 3 bagian:\n1. 📌 **Tesis (Pernyataan Pendapat)**: Pengenalan isu atau sudut pandang penulis terhadap topik yang diangkat.\n2. 📊 **Rangkaian Argumen**: Alasan logis, bukti faktual, data statistik, atau pendapat ahli yang memperkuat tesis.\n3. 🔁 **Penegasan Ulang (Reiterasi)**: Perumusan kembali intisari pembahasan dan kesimpulan akhir secara tegas.\n\nKarakteristik bahasanya lugas, baku, dan menggunakan kata-kata lugas yang objektif! Mau contoh paragraf eksposisi?`
      };
    }

    return null;
  }

  humanizeAnswer(rawAnswer, query, moduleContext) {
    if (!rawAnswer) return 'Yuk ceritain lebih lanjut hal yang ingin kamu pelajari!';
    let clean = rawAnswer.trim();
    if (clean.startsWith('Nah,') || clean.startsWith('Wah,') || clean.startsWith('Pertanyaan')) {
      return clean;
    }
    return `Nah, jadi begini penjelasannya kawan:\n\n${clean}\n\nSemoga penjelasan ini membantumu lebih mudah memahami konsepnya ya! Kalau ada bagian yang masih bikin penasaran, tanyain aja lagi ke aku! 😊`;
  }

  isSummaryIntent(query) {
    const summaryKeywords = ['rangkum', 'ringkas', 'kesimpulan', 'summary', 'garis besar', 'intisari', 'rangkuman', 'rangkumin'];
    return summaryKeywords.some(k => query.includes(k));
  }

  generateSummaryResponse(mod) {
    if (!mod) {
      return {
        text: 'Pilih salah satu modul di sidebar kiri biar aku bisa buatin rangkuman seru buat kamu!',
        source: null,
        suggestions: ['Tips belajar efektif', 'Bagaimana cuaca hari ini?']
      };
    }
    let babList = (mod.chapters || []).map(c => `• 📌 **Bab ${c.bab}**: ${c.judul} *(Hal. ${c.hal})*`).join('\n');
    return {
      text: `Nih, aku sudah susun **ringkasan intisari** materi **${mod.fullName}** buat kamu! 📝✨\n\n${mod.summary || 'Modul ini memuat pembahasan komprehensif mengenai konsep fundamental dan aplikasi praktis mata pelajaran.'}\n\n**Daftar Bab Pembelajaran:**\n${babList || '• Bab pembelajaran lengkap'}\n\n*Tip dari Boni: Kamu bisa pilih salah satu bab di atas untuk kita kupas detailnya, minta dibuatkan flashcard, atau langsung uji pemahamanmu di tab Generator Kuis!*`,
      source: `Rujukan Resmi: ${mod.shortName} - Halaman 1 s/d ${mod.totalHal || 36}`,
      suggestions: mod.quickPrompts ? mod.quickPrompts.slice(0, 3) : ['Jelaskan bab penting', 'Buatkan 3 flashcard', 'Buka Generator Kuis']
    };
  }

  getSuggestionsForModule(mod, currentQuery) {
    if (!mod || !mod.quickPrompts) return ['Tips belajar fokus', 'Bagaimana proses hujan?', 'Buka Generator Kuis'];
    return mod.quickPrompts.filter(p => !p.toLowerCase().includes(currentQuery.slice(0, 8))).slice(0, 3);
  }
}

if (typeof window !== 'undefined') {
  window.OfflineAIEngine = OfflineAIEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OfflineAIEngine };
} else if (typeof globalThis !== 'undefined') {
  globalThis.OfflineAIEngine = OfflineAIEngine;
}
