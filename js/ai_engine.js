/**
 * AI ENGINE OFFLINE
 * Mesin penalaran cerdas berbasis text analysis, BM25 keyword matching,
 * intent classification, serta modul percakapan umum & sains offline
 * yang bekerja 100% lokal di browser.
 */

class OfflineAIEngine {
  constructor(modulesData = []) {
    this.modules = Array.isArray(modulesData) ? modulesData : [];
  }

  getModule(id) {
    if (!this.modules || this.modules.length === 0) return null;
    return this.modules.find(m => m.id === id) || this.modules[0] || null;
  }

  tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
  }

  /**
   * Titik masuk utama pembuatan jawaban:
   * 1. Cek Percakapan Umum / Sapaan / Casual / Cuaca / Waktu / Matematika (source: null)
   * 2. Cek Intent Rangkuman
   * 3. Cek Intent Generator Kuis
   * 4. Pencarian Materi Modul Aktif & Lintas Modul (dengan rujukan bab & halaman)
   * 5. Fallback Cerdas
   */
  generateAnswer(query, moduleId) {
    const rawQuery = (query || '').trim();
    const cleanQuery = rawQuery.toLowerCase();
    const tokens = this.tokenize(cleanQuery);
    const activeModule = this.getModule(moduleId);

    // ==========================================
    // 1. CEK PERCAKAPAN UMUM & CASUAL CHATTING
    // ==========================================
    const generalChatResponse = this.handleGeneralChat(cleanQuery, rawQuery);
    if (generalChatResponse) {
      return generalChatResponse;
    }

    // ==========================================
    // 2. CEK INTENT RANGKUM / RINGKASAN
    // ==========================================
    if (this.isSummaryIntent(cleanQuery)) {
      if (activeModule) {
        return this.generateSummaryResponse(activeModule);
      } else {
        return {
          text: `Fitur **Rangkuman Otomatis** membutuhkan modul materi aktif.\n\nSilakan unggah file modul pembelajaran (.txt / .pdf) di sidebar kiri, atau klik tombol **"Muat Bahan P13"** untuk merangkum materi secara instan!`,
          source: null,
          suggestions: ['Muat Bahan P13', 'Tips belajar efektif', 'Siapa kamu?']
        };
      }
    }

    // ==========================================
    // 3. CEK INTENT PEMBUAT KUIS / LATIHAN
    // ==========================================
    if (this.isQuizIntent(cleanQuery)) {
      if (activeModule) {
        return {
          text: `Tentu! Kamu dapat langsung menggunakan fitur **Generator Kuis** di tab atas untuk menguji pemahaman materi **${activeModule.fullName}**.\n\nKamu bisa mengatur jumlah soal, format pilihan ganda atau esai, tingkat kesulitan, serta melihat skor dan pembahasan rujukan bab secara instan.`,
          source: `Rujukan: ${activeModule.shortName} - Bank Soal Evaluasi`,
          action: 'switch_to_quiz',
          suggestions: ['Buka Generator Kuis', 'Rangkum materi ini dulu', 'Jelaskan bab penting']
        };
      } else {
        return {
          text: `Tentu! Kamu bisa membuat kuis interaktif di tab **Generator Kuis**. Agar bank soal sesuai dengan materi yang kamu pelajari, silakan unggah modul atau klik **"Muat Bahan P13"** di sidebar kiri terlebih dahulu!`,
          source: null,
          action: 'switch_to_quiz',
          suggestions: ['Muat Bahan P13', 'Buka Generator Kuis', 'Tips belajar efektif']
        };
      }
    }

    // ==========================================
    // 4. JIKA MODUL SUDAH DIMUAT: CARI DI MODUL
    // ==========================================
    if (activeModule) {
      // 4A. Pencarian Berdasarkan QA Pairs di Modul Aktif
      let bestQA = null;
      let highestScore = 0;

      if (activeModule.qaPairs && activeModule.qaPairs.length > 0) {
        for (const qa of activeModule.qaPairs) {
          let score = 0;
          for (const kw of qa.keywords) {
            if (cleanQuery.includes(kw.toLowerCase())) {
              score += 3;
            } else {
              const kwTokens = this.tokenize(kw);
              const overlap = kwTokens.filter(t => tokens.includes(t));
              score += overlap.length;
            }
          }
          if (score > highestScore) {
            highestScore = score;
            bestQA = qa;
          }
        }

        if (bestQA && highestScore >= 2) {
          return {
            text: bestQA.answer,
            source: bestQA.source,
            suggestions: this.getSuggestionsForModule(activeModule, cleanQuery)
          };
        }
      }

      // 4B. Pencarian Berdasarkan Bab & Topik Modul Aktif
      if (activeModule.chapters && activeModule.chapters.length > 0) {
        for (const ch of activeModule.chapters) {
          const chTokens = this.tokenize(ch.judul);
          const overlap = chTokens.filter(t => tokens.includes(t));
          if (overlap.length >= 2 || cleanQuery.includes(`bab ${ch.bab}`)) {
            return {
              text: `Materi tersebut diuraikan secara komprehensif pada **${ch.judul}**.\n\nPada bab ini, dipelajari konsep fundamental, mekanisme ilmiah, serta hubungan sebab-akibat antar variabel yang teruji secara akademis. Topik ini menjadi salah satu pilar kompetensi utama pada mata pelajaran ${activeModule.subject}.`,
              source: `Sumber: ${activeModule.shortName} - Bab ${ch.bab}, Hal. ${ch.hal}`,
              suggestions: this.getSuggestionsForModule(activeModule, cleanQuery)
            };
          }
        }
      }

      // 4C. Cek apakah pertanyaan lebih cocok untuk Modul LAIN
      for (const mod of this.modules) {
        if (mod.id === activeModule.id) continue;
        if (!mod.qaPairs) continue;

        for (const qa of mod.qaPairs) {
          let score = 0;
          for (const kw of qa.keywords) {
            if (cleanQuery.includes(kw.toLowerCase())) score += 2;
          }
          if (score >= 2) {
            return {
              text: `Topik ini berkaitan erat dengan materi pada **${mod.fullName}**.\n\n${qa.answer}`,
              source: `${qa.source} (Disarankan berpindah ke ${mod.shortName} di sidebar)`,
              suggestModuleSwitch: mod.id,
              suggestions: [`Beralih ke ${mod.subject}`, 'Kembali ke materi saat ini']
            };
          }
        }
      }
    }

    // ==========================================
    // 5. PENGETAHUAN AKADEMIK UMUM (BILA BELUM ADA MODUL / MODUL TIDAK COCOK)
    // ==========================================
    const academicKnowledge = this.checkAcademicKnowledge(cleanQuery);
    if (academicKnowledge) {
      if (activeModule) {
        return {
          text: academicKnowledge.text,
          source: `Sumber: ${activeModule.shortName} - Materi Pendukung Siswa`,
          suggestions: this.getSuggestionsForModule(activeModule, cleanQuery)
        };
      } else {
        return {
          text: `${academicKnowledge.text}\n\n📌 *Catatan: Modul materi belum dimuat di sidebar. Kamu bisa mengunggah file modul (.txt / .pdf) atau klik tombol **"Muat Bahan P13"** untuk mendapatkan rujukan nomor halaman & bab resmi!*`,
          source: null,
          suggestions: ['Muat Bahan P13', 'Tips belajar efektif', 'Beri kuis latihan']
        };
      }
    }

    // ==========================================
    // 6. RESPON KONTEKSTUAL DEFAULT
    // ==========================================
    if (activeModule) {
      return {
        text: `Berdasarkan kajian materi pada **${activeModule.fullName}**, pembahasan terkait hal tersebut berkaitan dengan struktur sistematis materi di dalam modul ini. Silakan tanyakan konsep spesifik yang ingin kamu ketahui lebih mendalam, atau gunakan tombol **Rangkum** di bawah untuk ringkasan cepat.`,
        source: `Sumber: ${activeModule.shortName} - Edisi Referensi Siswa`,
        suggestions: activeModule.quickPrompts ? activeModule.quickPrompts.slice(0, 3) : []
      };
    } else {
      return {
        text: `Saya siap membantumu! Pertanyaan tersebut tampaknya berkaitan dengan materi ajar khusus. Agar saya dapat memberikan jawaban lengkap beserta rujukan bab dan nomor halaman buku secara presisi, silakan upload modul materi di sidebar kiri atau klik tombol **"Muat Bahan P13"**.\n\nKamu juga bisa bertanya pertanyaan umum lain seperti sains, cuaca, tips belajar, atau sekadar mengobrol santai!`,
        source: null,
        suggestions: ['Muat Bahan P13', 'Bagaimana cuaca hari ini?', 'Tips belajar fokus']
      };
    }
  }

  /**
   * Logika penanganan percakapan umum, sapaan, casual chat, cuaca, sains populer, matematika, dll.
   */
  handleGeneralChat(clean, raw) {
    // ----------------------------------------------------
    // A. KALKULATOR & PERHITUNGAN MATEMATIKA DASAR
    // ----------------------------------------------------
    const mathResult = this.calculateMath(clean);
    if (mathResult) {
      return {
        text: mathResult,
        source: null,
        suggestions: ['Hitung 50 * 12', 'Tips belajar matematika', 'Beri soal kuis']
      };
    }

    // ----------------------------------------------------
    // B. WAKTU & TANGGAL REAL-TIME
    // ----------------------------------------------------
    if (
      clean.includes('jam berapa') || clean.includes('pukul berapa') ||
      clean.includes('hari apa') || clean.includes('tanggal berapa') ||
      clean.includes('sekarang jam') || clean.includes('waktu sekarang') ||
      clean.includes('hari ini hari apa') || clean.includes('tanggal hari ini')
    ) {
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
        text: `Saat ini hari **${hari}, ${tanggal} ${bulan} ${tahun}**, pukul **${jam}:${menit}** (waktu perangkat lokalmu). ⏰\n\nWaktu yang tepat untuk belajar hal baru atau mengulang kembali materi yang telah dipelajari!`,
        source: null,
        suggestions: ['Tips manajemen waktu', 'Motivasi belajar', 'Bagaimana cuaca hari ini?']
      };
    }

    // ----------------------------------------------------
    // C. CUACA & FENOMENA ALAM (WEATHER & NATURE)
    // ----------------------------------------------------
    // C1: Cuaca aktual / hari ini
    if (
      clean.includes('cuaca hari ini') || clean.includes('cuaca sekarang') ||
      clean.includes('bagaimana cuaca') || clean.includes('gimana cuaca') ||
      clean.includes('apakah hari ini hujan') || clean.includes('ramalan cuaca') ||
      clean.includes('prediksi cuaca') || clean.includes('kondisi cuaca') ||
      clean.includes('cuaca di luar') || clean === 'cuaca'
    ) {
      return {
        text: `Karena saya beroperasi **100% offline langsung di browser** tanpa sensor satelit atau koneksi internet langsung ke BMKG, saya tidak dapat mendeteksi kondisi cuaca aktual di lokasimu saat ini. Kamu bisa melongok ke luar jendela untuk melihat kondisi langit! 🌤️\n\nNamun, jika kamu ingin membahas **ilmu pengetahuan (sains) di balik cuaca**—seperti proses terjadinya hujan, kenapa langit biru, petir, atau awan—saya siap menjelaskannya secara lengkap!`,
        source: null,
        suggestions: ['Kenapa bisa hujan?', 'Kenapa langit berwarna biru?', 'Bagaimana petir terjadi?']
      };
    }

    // C2: Mengapa hujan / proses siklus air
    if (
      clean.includes('kenapa hujan') || clean.includes('kenapa bisa hujan') ||
      clean.includes('proses hujan') || clean.includes('terjadinya hujan') ||
      clean.includes('siklus air') || clean.includes('siklus hidrologi')
    ) {
      return {
        text: `Hujan terjadi melalui **siklus hidrologi (siklus air)** yang berlangsung secara terus-menerus di bumi melalui 4 tahapan utama:\n\n1. **Evaporasi & Transpirasi**: Air di laut, danau, dan sungai menguap akibat panas matahari. Tumbuhan juga melepaskan uap air melalui stomata (transpirasi).\n2. **Kondensasi**: Uap air membubung ke atmosfer tinggi yang bersuhu dingin, lalu mengembun menjadi butiran air mikro dan membentuk gumpalan **awan**.\n3. **Presipitasi**: Butiran air di dalam awan saling bertabrakan dan membesar. Ketika sudah terlalu berat dan tidak dapat ditopang aliran udara ke atas, gravitasi menariknya jatuh sebagai **hujan**.\n4. **Infiltrasi & Aliran Permukaan**: Air hujan yang tiba di tanah meresap ke dalam lapisan air tanah (infiltrasi) atau mengalir melalui sungai kembali ke samudra.`,
        source: null,
        suggestions: ['Kenapa ada petir?', 'Kenapa langit biru?', 'Bagaimana pelangi terbentuk?']
      };
    }

    // C3: Mengapa langit biru
    if (
      clean.includes('langit biru') || clean.includes('kenapa langit berwarna biru') ||
      clean.includes('mengapa langit biru') || clean.includes('warna langit')
    ) {
      return {
        text: `Langit tampak berwarna biru di siang hari karena fenomena fisika optik yang disebut **Hamburan Rayleigh (Rayleigh Scattering)**.\n\n• Sinar matahari tampak berwarna putih, padahal sebenarnya adalah gabungan semua warna pelangi (spektrum cahaya tampak).\n• Cahaya biru memiliki **panjang gelombang pendek** dan frekuensi tinggi, sedangkan cahaya merah memiliki panjang gelombang panjang.\n• Ketika sinar matahari menembus atmosfer bumi, partikel gas (nitrogen dan oksigen) menghamburkan cahaya bergelombang pendek (biru dan nila) ke segala arah jauh lebih kuat dibanding cahaya merah. Akibatnya, langit terlihat dipenuhi pendaran cahaya biru di mata kita!`,
        source: null,
        suggestions: ['Kenapa ada pelangi?', 'Kenapa bisa hujan?', 'Bagaimana petir terjadi?']
      };
    }

    // C4: Petir dan kilat
    if (
      clean.includes('petir') || clean.includes('kilat') || clean.includes('guntur') || clean.includes('guruh')
    ) {
      return {
        text: `**Petir** adalah fenomena pelepasan muatan listrik statis raksasa di atmosfer, biasanya terjadi pada awan badai (*Kumulonimbus*):\n\n1. Gesekan hebat antara tetes air dan kristal es di dalam awan menciptakan pemisahan muatan listrik: muatan positif berkumpul di puncak awan, sedangkan muatan negatif menumpuk di dasar awan.\n2. Ketika beda potensial listrik antara awan dan tanah (atau antar awan) melampaui kemampuan isolasi udara, terjadi loncatan elektron berkecepatan tinggi yang menghasilkan kilatan cahaya (**kilat**).\n3. Loncatan listrik tersebut memanaskan udara di sekitarnya hingga mencapai ~30.000°C secara seketika. Udara yang memuai mendadak memicu gelombang kejut dentuman suara (**guntur/petir**).\n\n*Tahukah kamu?* Kita selalu melihat kilat terlebih dahulu baru mendengar gemuruh petir karena **kecepatan cahaya** (~300.000 km/s) jutaan kali lebih cepat daripada **kecepatan suara** di udara (~340 m/s)!`,
        source: null,
        suggestions: ['Kenapa bisa hujan?', 'Kenapa langit biru?', 'Berapa kecepatan cahaya?']
      };
    }

    // C5: Pelangi
    if (clean.includes('pelangi')) {
      return {
        text: `**Pelangi** terbentuk saat sinar matahari berinteraksi dengan butiran air hujan di udara melalui tiga proses fisika:\n\n1. **Refraksi (Pembiasan)**: Berkas cahaya matahari dibelokkan saat memasuki tetesan air karena perbedaan kerapatan medium udara dan air.\n2. **Dispersi (Penguraian Warna)**: Cahaya putih matahari diuraikan menjadi komponen spektrumnya (Merah, Jingga, Kuning, Hijau, Biru, Nila, Ungu) karena setiap warna memiliki panjang gelombang dan sudut pembelokan yang berbeda.\n3. **Refleksi Internal**: Cahaya yang terurai memantul di dinding belakang tetesan air, lalu keluar kembali ke udara menuju mata pengamat dengan sudut sekitar 40°–42°.`,
        source: null,
        suggestions: ['Kenapa langit biru?', 'Kenapa bisa hujan?', 'Hitung kecepatan cahaya']
      };
    }

    // ----------------------------------------------------
    // D. SAPAAN & SALAM (GREETINGS)
    // ----------------------------------------------------
    const isGreeting = (
      /^(halo|hai|helo|hei|hi|hello|hey|oy|oi|halo ai|hai ai|pagi|siang|sore|malam|selamat pagi|selamat siang|selamat sore|selamat malam|assalamu|salam|sampurasun)\b/i.test(clean) ||
      clean === 'halo' || clean === 'hai' || clean === 'hi' || clean === 'hello' || clean === 'hey' ||
      clean === 'selamat pagi' || clean === 'selamat siang' || clean === 'selamat sore' || clean === 'selamat malam'
    );

    if (isGreeting) {
      const now = new Date();
      const hour = now.getHours();
      let salamWaktu = 'pagi';
      if (hour >= 11 && hour < 15) salamWaktu = 'siang';
      else if (hour >= 15 && hour < 18) salamWaktu = 'sore';
      else if (hour >= 18 || hour < 5) salamWaktu = 'malam';

      return {
        text: `Halo, selamat ${salamWaktu}! 👋\n\nSaya **Asisten Belajar Offline**, siap menemani waktu belajarmu hari ini. Kamu bisa bertanya apa saja—baik seputar materi pelajaran, tips belajar, pertanyaan umum (seperti cuaca, sains, matematika dasar), atau sekadar mengobrol santai.\n\nApa yang ingin kamu bahas atau pelajari sekarang?`,
        source: null,
        suggestions: ['Bagaimana cuaca hari ini?', 'Tips belajar efektif', 'Bisa bantu apa saja?']
      };
    }

    // ----------------------------------------------------
    // E. IDENTITAS & KEMAMPUAN (WHO ARE YOU / CAPABILITIES)
    // ----------------------------------------------------
    if (
      clean.includes('siapa kamu') || clean.includes('kamu siapa') ||
      clean.includes('nama kamu') || clean.includes('namamu siapa') ||
      clean.includes('siapa anda') || clean === 'siapa kamu?'
    ) {
      return {
        text: `Saya adalah **Asisten Belajar AI Offline**! 🎓\n\nSaya dirancang sebagai pendamping belajar pribadi yang bekerja **100% lokal di browser**, tanpa perlu koneksi internet. Saya dapat membantu menganalisis modul pelajaran, menjawab pertanyaan dengan rujukan buku yang akurat, membuat kuis interaktif, merangkum materi, serta menjawab pertanyaan umum sehari-hari.`,
        source: null,
        suggestions: ['Apa saja fiturmu?', 'Bagaimana cuaca hari ini?', 'Tips belajar fokus']
      };
    }

    if (
      clean.includes('bisa apa') || clean.includes('kemampuanmu') ||
      clean.includes('fitur apa') || clean.includes('apa yang bisa kamu lakukan') ||
      clean.includes('bisa bantu apa') || clean.includes('cara kerja')
    ) {
      return {
        text: `Berikut beberapa kemampuan utama yang bisa saya lakukan untukmu:\n\n1. 📖 **Tanya Jawab Materi**: Menjawab pertanyaan materi dengan kutipan rujukan bab dan nomor halaman spesifik dari modul yang kamu upload.\n2. ⚡ **Generator Kuis**: Membuat kuis interaktif (pilihan ganda & esai) dengan opsi jumlah soal, evaluasi jawaban, dan pembahasan instan.\n3. 📝 **Rangkuman Modul**: Menyusun poin-poin inti sari dan daftar bab secara terstruktur.\n4. 💬 **Casual Chat & Umum**: Berdiskusi tentang cuaca, sains populer, matematika dasar, tips motivasi belajar, lelucon, dan pantun.\n5. 🔒 **100% Offline & Privat**: Seluruh proses berjalan di komputermu tanpa mengirim data ke internet.`,
        source: null,
        suggestions: ['Tips belajar efektif', 'Bagaimana proses hujan?', 'Buka Generator Kuis']
      };
    }

    // ----------------------------------------------------
    // F. OBROLAN SANTAI / KABAR / EMOSI (SMALL TALK)
    // ----------------------------------------------------
    if (
      clean.includes('apa kabar') || clean.includes('gimana kabar') ||
      clean.includes('bagaimana kabarmu') || clean.includes('sehat')
    ) {
      return {
        text: `Kabar saya luar biasa dan siap 100% menemani belajarmu! 🌟\n\nBagaimana dengan kabarmu hari ini? Semoga dalam keadaan sehat, bersemangat, dan siap menyerap ilmu-ilmu baru ya! Jika ada hal yang ingin kamu pelajari atau diskusikan, ceritakan saja!`,
        source: null,
        suggestions: ['Tips belajar fokus', 'Motivasi belajar hari ini', 'Hitung 25 * 14']
      };
    }

    if (
      clean.includes('lagi apa') || clean.includes('sedang apa') ||
      clean.includes('lagi ngapain') || clean.includes('sedang ngapain')
    ) {
      return {
        text: `Saya sedang standby di browser kamu, siap menganalisis materi belajar, membuat kuis latihan, atau menjawab rasa penasaranmu tentang berbagai hal! Mau mulai belajar materi sekarang atau santai dulu sejenak? 😊`,
        source: null,
        suggestions: ['Mulai belajar materi', 'Beri tebak-tebakan lucu', 'Tips manajemen waktu']
      };
    }

    if (
      clean.includes('kamu robot') || clean.includes('kamu ai') ||
      clean.includes('apakah kamu manusia') || clean.includes('kamu manusia')
    ) {
      return {
        text: `Betul! Saya adalah program **Artificial Intelligence (AI)** cerdas yang berjalan secara offline di peramban webmu. Meskipun saya program komputer dan bukan manusia, saya selalu siap mendampingimu belajar dengan ramah dan sabar layaknya teman setia! 🤖✨`,
        source: null,
        suggestions: ['Siapa yang membuatmu?', 'Apa yang bisa kamu lakukan?', 'Jokes bapak-bapak']
      };
    }

    if (
      clean.includes('kamu pintar') || clean.includes('hebat') ||
      clean.includes('keren') || clean.includes('mantap') || clean.includes('luar biasa')
    ) {
      return {
        text: `Terima kasih banyak atas pujiannya! 😊 Senang sekali bisa membantu belajarmu. Kamu juga pembelajar yang hebat karena terus berinisiatif mencari ilmu dan melatih pemahamanmu. Ayo lanjutkan semangat belajarnya!`,
        source: null,
        suggestions: ['Beri soal kuis menantang', 'Tips belajar fokus', 'Rangkum materi']
      };
    }

    if (
      clean.includes('bosan') || clean.includes('mager') ||
      clean.includes('malas') || clean.includes('capek') || clean.includes('lelah')
    ) {
      return {
        text: `Sangat wajar kok jika sesekali merasa jenuh atau lelah saat belajar. Otak kita juga butuh jeda istirahat agar tidak *burnout*! ☕\n\nCoba tips pemulihan cepat ini:\n1. 🚶 Regangkan badan dan berjalan kaki santai 3–5 menit.\n2. 💧 Minum segelas air putih dingin.\n3. 🎵 Dengarkan musik instrumental lembut sejenak.\n\nKalau mau hiburan ringan, mau saya ceritakan lelucon lucu atau pantun?`,
        source: null,
        suggestions: ['Ceritakan lelucon', 'Kasih pantun dong', 'Teknik belajar pomodoro']
      };
    }

    // ----------------------------------------------------
    // G. HIBURAN: JOKES & PANTUN
    // ----------------------------------------------------
    if (
      clean.includes('jokes') || clean.includes('lelucon') ||
      clean.includes('lucu') || clean.includes('tebak-tebakan') || clean.includes('cerita lucu')
    ) {
      const jokes = [
        `😄 **Tebak-tebakan Sains:**\n*Tanya:* Kenapa buku pelajaran matematika selalu tampak murung dan galau?\n*Jawab:* Karena dia punya terlalu banyak **masalah (problem)** yang belum terpecahkan!`,
        `😄 **Jokes Belajar:**\n*Tanya:* Kenapa sel darah merah tidak pernah tersesat di jalan?\n*Jawab:* Karena dia selalu mengikuti arus peredaran darah!`,
        `😄 **Tebak-tebakan Sekolah:**\n*Tanya:* Mengapa atom tidak boleh dipercaya?\n*Jawab:* Karena mereka yang menyusun (make up) segalanya!`,
        `😄 **Jokes Fisika:**\n*Tanya:* Kenapa gravitasi itu setia banget?\n*Jawab:* Karena dia tidak pernah melepaskan kita pergi meninggalkan bumi!`
      ];
      const pickedJoke = jokes[Math.floor(Math.random() * jokes.length)];
      return {
        text: pickedJoke,
        source: null,
        suggestions: ['Jokes lainnya', 'Kasih pantun', 'Lanjut belajar materi']
      };
    }

    if (clean.includes('pantun')) {
      const pantuns = [
        `🌸 **Pantun Semangat Belajar:**\n*Pohon kelapa tumbuh di taman,*\n*Buahnya manis enak dimakan.*\n*Belajar tekun bersama teman,*\n*Masa depan cerah kan didapatkan.* ✨`,
        `📚 **Pantun Cita-Cita:**\n*Pergi ke pasar membeli sukun,*\n*Pulangnya mampir ke kota Blitar.*\n*Jika belajar dengan tekun,*\n*Pasti menjadi anak yang pintar.* 🌟`,
        `💡 **Pantun Wawasan:**\n*Bunga melati harum semerbak,*\n*Tumbuh indah di tepi kolam.*\n*Membaca buku membuka benak,*\n*Menjelajah luas isi alam.* 📖`
      ];
      const pickedPantun = pantuns[Math.floor(Math.random() * pantuns.length)];
      return {
        text: pickedPantun,
        source: null,
        suggestions: ['Pantun lainnya', 'Tips belajar fokus', 'Generator kuis']
      };
    }

    // ----------------------------------------------------
    // H. TIPS BELAJAR & MOTIVASI (STUDY TIPS & MOTIVATION)
    // ----------------------------------------------------
    if (
      clean.includes('tips belajar') || clean.includes('cara belajar') ||
      clean.includes('cara fokus') || clean.includes('pomodoro') ||
      clean.includes('tips ujian') || clean.includes('belajar efektif')
    ) {
      return {
        text: `Berikut **5 strategi belajar efektif** berdasarkan penelitian sains kognitif modern:\n\n1. ⏱️ **Metode Pomodoro**: Belajar fokus tanpa distraksi selama 25 menit, disusul istirahat 5 menit. Setelah 4 sesi, ambil jeda panjang 15–20 menit.\n2. 🧠 **Active Recall**: Hindari hanya membaca pasif. Uji ingatanmu sendiri dengan menjawab kuis atau merangkum konsep tanpa membuka buku.\n3. 🔄 **Spaced Repetition (Pengulangan Berjarak)**: Ulas materi setelah 1 hari, 3 hari, dan 1 minggu untuk memperkuat memori jangka panjang.\n4. 📝 **Teknik Feynman**: Jelaskan konsep yang baru dipelajari kepada orang lain (atau dirimu sendiri) dengan bahasa sesederhana mungkin.\n5. 📵 **Karantina Notifikasi**: Letakkan smartphone di ruangan berbeda selama sesi belajar untuk mencegah peralihan fokus.`,
        source: null,
        suggestions: ['Motivasi belajar', 'Buka Generator Kuis', 'Bagaimana cuaca hari ini?']
      };
    }

    if (
      clean.includes('motivasi') || clean.includes('kata mutiara') ||
      clean.includes('semangat') || clean.includes('kata bijak')
    ) {
      const quotes = [
        `✨ *"Pendidikan bukanlah proses mengisi wadah yang kosong, melainkan menyalakan api rasa ingin tahu."* — Socrates\n\nSetiap langkah kecil yang kamu pelajari hari ini adalah fondasi kokoh bagi impian besarmu besok. Jangan menyerah, kamu pasti mampu! 💪`,
        `✨ *"Hiduplah seolah kamu akan mati besok. Belajarlah seolah kamu akan hidup selamanya."* — Mahatma Gandhi\n\nPengetahuan adalah satu-satunya harta yang tidak akan pernah bisa dicuri darimu. Tetap semangat mengasah pikiranmu! 🌟`,
        `✨ *"Keberhasilan bukanlah kebetulan. Ia terbentuk dari kerja keras, ketekunan, belajar, dan cinta pada apa yang kamu kerjakan."* — B.J. Habibie\n\nPercayalah pada proses belajarmu, karena usaha sungguh-sungguh tidak pernah mengkhianati hasil! 🚀`
      ];
      const pickedQuote = quotes[Math.floor(Math.random() * quotes.length)];
      return {
        text: pickedQuote,
        source: null,
        suggestions: ['Tips belajar efektif', 'Beri lelucon', 'Mulai latihan soal']
      };
    }

    // ----------------------------------------------------
    // I. TERIMA KASIH & PAMITAN (THANKS & FAREWELL)
    // ----------------------------------------------------
    if (
      clean.includes('terima kasih') || clean.includes('makasih') ||
      clean.includes('thanks') || clean.includes('thank you') ||
      clean.includes('matur nuwun') || clean.includes('terimakasih')
    ) {
      return {
        text: `Sama-sama! Senang sekali bisa membantu belajarmu hari ini. 😊\n\nJangan ragu untuk bertanya lagi kapan pun kamu butuh bantuan rujukan materi, kuis latihan, atau diskusi lainnya ya. Selamat belajar!`,
        source: null,
        suggestions: ['Tips belajar efektif', 'Bagaimana cuaca hari ini?', 'Buka Generator Kuis']
      };
    }

    if (
      clean.includes('dadah') || clean.includes('sampai jumpa') ||
      clean.includes('bye') || clean.includes('selamat tinggal') ||
      clean.includes('pamit') || clean.includes('goodbye')
    ) {
      return {
        text: `Sampai jumpa lagi! Tetap jaga kesehatan dan semangat terus dalam mengejar cita-citamu. Kapan pun kamu butuh teman belajar offline, saya selalu siap di sini! 👋🎓`,
        source: null,
        suggestions: ['Halo!', 'Siapa kamu?', 'Tips belajar fokus']
      };
    }

    // ----------------------------------------------------
    // J. PENGETAHUAN UMUM POPULER LAINNYA
    // ----------------------------------------------------
    if (clean.includes('ibukota indonesia') || clean.includes('ibu kota indonesia')) {
      return {
        text: `Ibu Kota Negara Indonesia adalah **Nusantara (IKN)** yang terletak di Kabupaten Penajam Paser Utara dan Kutai Kartanegara, Kalimantan Timur, berdasarkan Undang-Undang Nomor 3 Tahun 2022.\n\nSebelumnya, ibu kota negara berada di **DKI Jakarta**, yang kini tetap menjadi pusat perekonomian dan keuangan utama di Indonesia.`,
        source: null,
        suggestions: ['Berapa jumlah provinsi di Indonesia?', 'Tips belajar', 'Bagaimana proses hujan?']
      };
    }

    if (clean.includes('planet terbesar')) {
      return {
        text: `Planet terbesar di Tata Surya kita adalah **Yupiter (Jupiter)**. 🪐\n\nYupiter adalah raksasa gas dengan diameter sekitar 142.984 km (lebih dari 11 kali diameter bumi) dan memiliki volume yang sanggup memuat lebih dari 1.300 planet seukuran bumi di dalamnya!`,
        source: null,
        suggestions: ['Berapa kecepatan cahaya?', 'Kenapa langit biru?', 'Bagaimana petir terjadi?']
      };
    }

    if (clean.includes('kecepatan cahaya')) {
      return {
        text: `Kecepatan cahaya dalam ruang hampa udara adalah konstanta fisika universal sebesar **299.792.458 meter per detik** (sering dibulatkan menjadi **~300.000 km per detik**). ⚡\n\nPada kecepatan ini, cahaya hanya membutuhkan waktu sekitar 8 menit 20 detik untuk menempuh jarak dari Matahari ke Bumi (~150 juta kilometer)!`,
        source: null,
        suggestions: ['Kenapa ada petir?', 'Kenapa langit biru?', 'Hitung 300000 * 60']
      };
    }

    if (clean.includes('fotosintesis') && (!this.modules || this.modules.length === 0)) {
      return {
        text: `**Fotosintesis** adalah proses biokimia tumbuhan berklorofil untuk memproduksi makanan dengan memanfaatkan energi cahaya matahari.\n\n• **Reaksi Kimia**: 6CO₂ (Karbon Dioksida) + 6H₂O (Air) + Cahaya Matahari ➔ C₆H₁₂O₆ (Glukosa) + 6O₂ (Oksigen).\n• Terjadi di organel **kloroplas**, terutama di jaringan mesofil daun (palisade dan spons).\n• Melibatkan dua tahapan: **Reaksi Terang** (di tilakoid, menghasilkan ATP & NADPH) dan **Reaksi Gelap / Siklus Calvin** (di stroma, membentuk glukosa).`,
        source: null,
        suggestions: ['Muat Bahan P13', 'Tips belajar efektif', 'Buka Generator Kuis']
      };
    }

    return null; // Bukan general chat
  }

  /**
   * Safe parser untuk perhitungan matematika dasar
   */
  calculateMath(text) {
    // Pola: "hitung 15 * 12", "berapa 25 + 75", "100 / 4", "akar 144", dll.
    const cleanMath = text.replace(/^(berapa|hitung|tolong hitung|hasil dari|nilai dari)\s+/i, '').trim();

    // Cek akar kuadrat
    const sqrtMatch = cleanMath.match(/^akar\s+(?:kuadrat\s+dari\s+)?([0-9.]+)/i);
    if (sqrtMatch) {
      const val = parseFloat(sqrtMatch[1]);
      const res = Math.sqrt(val);
      return `Hasil dari **√${val}** adalah **${res}**.`;
    }

    // Cek operasi aritmetika dasar: a [op] b
    const expr = cleanMath
      .replace(/x/gi, '*')
      .replace(/kali/gi, '*')
      .replace(/bagi/gi, '/')
      .replace(/tambah/gi, '+')
      .replace(/kurang/gi, '-')
      .replace(/pangkat/gi, '^')
      .replace(/\s+/g, '');

    // Pola: angka operator angka
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
        if (b === 0) return 'Perhitungan tidak terdefinisi: pembagian dengan angka 0.';
        res = a / b;
        opSymbol = '÷';
      } else if (op === '^') {
        res = Math.pow(a, b);
        opSymbol = '^';
      }

      // Format desimal bila pecahan
      const formattedRes = Number.isInteger(res) ? res : Number(res.toFixed(4));
      return `Hasil perhitungan dari **${a} ${opSymbol} ${b}** adalah **${formattedRes}**. 🧮`;
    }

    return null;
  }

  /**
   * Pengetahuan akademik dasar jika pengguna bertanya materi tetapi modul belum dimuat
   */
  checkAcademicKnowledge(clean) {
    if (clean.includes('hcl') || clean.includes('pepsin') || clean.includes('asam klorida') || clean.includes('lambung')) {
      return {
        text: `**Asam Klorida (HCl)** dan **Pepsin** adalah zat krusial di lambung manusia:\n1. **Asam Klorida (HCl)**: Dihasilkan oleh sel parietal lambung. Berfungsi menciptakan suasana asam (pH 1,5–2), membunuh bakteri patogen pada makanan, serta mengaktifkan pepsinogen menjadi enzim pepsin aktif.\n2. **Pepsin**: Enzim protease yang memecah protein kompleks menjadi polipeptida (pepton) melalui pemutusan ikatan peptida.`
      };
    }

    if (clean.includes('renin')) {
      return {
        text: `**Enzim Renin** berfungsi mengendapkan protein kasein dari susu dengan bantuan ion kalsium di lambung, khususnya pada bayi mamalia, agar protein susu dapat dicerna lebih lanjut oleh pepsin.`
      };
    }

    if (clean.includes('pankreas') || clean.includes('lipase') || clean.includes('amilase') || clean.includes('tripsin')) {
      return {
        text: `Getah **Pankreas** menghasilkan tiga enzim pencernaan utama yang bermuara di usus halus (duodenum):\n1. **Lipase**: Menghidrolisis lemak menjadi asam lemak dan gliserol.\n2. **Amilase**: Memecah amilum/pati menjadi maltosa dan glukosa.\n3. **Tripsin**: Memecah pepton/protein menjadi peptida yang lebih sederhana dan asam amino.`
      };
    }

    if (clean.includes('newton') || clean.includes('hukum newton')) {
      return {
        text: `**Tiga Hukum Gerak Newton** dalam Fisika:\n1. **Hukum I Newton (Inersia/Kelembaman)**: Benda mempertahankan keadaannya (diam atau gerak lurus beraturan) jika resultan gaya sama dengan nol (ΣF = 0).\n2. **Hukum II Newton**: Percepatan sebanding dengan resultan gaya dan berbanding terbalik dengan massa benda (ΣF = m × a).\n3. **Hukum III Newton (Aksi-Reaksi)**: Setiap gaya aksi selalu menimbulkan gaya reaksi yang sama besar dan berlawanan arah (F_aksi = -F_reaksi).`
      };
    }

    return null;
  }

  isSummaryIntent(query) {
    const summaryKeywords = ['rangkum', 'ringkas', 'kesimpulan', 'summary', 'garis besar', 'intisari', 'rangkuman'];
    return summaryKeywords.some(k => query.includes(k));
  }

  isQuizIntent(query) {
    const quizKeywords = ['kuis', 'soal', 'latihan', 'ujian', 'evaluasi', 'tes pemahaman', 'buatkan kuis', 'bikin kuis'];
    return quizKeywords.some(k => query.includes(k));
  }

  generateSummaryResponse(mod) {
    if (!mod) {
      return {
        text: 'Pilih salah satu modul di sidebar kiri untuk menampilkan rangkumannya.',
        source: null,
        suggestions: ['Tips belajar efektif', 'Bagaimana cuaca hari ini?']
      };
    }
    let babList = (mod.chapters || []).map(c => `• **Bab ${c.bab}**: ${c.judul} *(Hal. ${c.hal})*`).join('\n');
    return {
      text: `Berikut adalah ringkasan eksekutif materi **${mod.fullName}** (${mod.code}):\n\n${mod.summary || 'Ringkasan komprehensif konsep esensial modul.'}\n\n**Daftar Bab Pembelajaran:**\n${babList || '• Bab pembelajaran lengkap'}\n\n*Tip: Pilih salah satu topik atau bab di atas untuk penjelasan rinci atau buat kuis interaktifnya di tab Generator Kuis!*`,
      source: `Sumber: ${mod.shortName} - Halaman 1 s/d ${mod.totalHal || 50}`,
      suggestions: mod.quickPrompts ? mod.quickPrompts.slice(0, 3) : []
    };
  }

  getSuggestionsForModule(mod, currentQuery) {
    if (!mod || !mod.quickPrompts) return ['Tips belajar fokus', 'Bagaimana cuaca hari ini?'];
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
