/**
 * AI ENGINE OFFLINE - PERSONA: BONI (TEMAN BELAJAR AI)
 * Mesin penalaran cerdas & ramah berbasis analisis teks semantik, stop-word & generic-word filtering,
 * intent classification, pustaka pengetahuan sains, materi sekolah, serta modul pembelajaran lokal 100% offline.
 * 
 * Karakter:
 * - Bersahabat, antusias, suportif (seperti teman belajar / study buddy yang pintar).
 * - Tidak kaku dan TIDAK copy-paste jawaban buku mentah-mentah.
 * - Menggunakan bahasa yang mengalir, analogi yang mudah dipahami, poin-poin terstruktur,
 *   serta ajakan diskusi di akhir penjelasan.
 * - Selalu menjawab pertanyaan pengguna (tidak menolak atau memberikan template hampa).
 */

class OfflineAIEngine {
  constructor(modulesData = [], referenceData = []) {
    this.modules = Array.isArray(modulesData) ? modulesData : [];
    this.referenceData = Array.isArray(referenceData) ? referenceData : [];
    this.botName = 'Boni';
  }

  getReferenceLibrary() {
    if (this.referenceData && this.referenceData.length > 0) return this.referenceData;
    if (typeof window !== 'undefined' && window.REFERENCE_P13_DATA) return window.REFERENCE_P13_DATA;
    if (typeof globalThis !== 'undefined' && globalThis.REFERENCE_P13_DATA) return globalThis.REFERENCE_P13_DATA;
    if (typeof global !== 'undefined' && global.REFERENCE_P13_DATA) return global.REFERENCE_P13_DATA;
    return [];
  }

  getModule(id) {
    if (!this.modules || this.modules.length === 0) return null;
    return this.modules.find(m => m.id === id) || this.modules[0] || null;
  }

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
      'terjadi', 'menjadi', 'memiliki'
    ]);
  }

  getGenericWords() {
    return new Set([
      'fungsi', 'kegunaan', 'peran', 'manfaat', 'tugas', 'proses', 
      'pengertian', 'definisi', 'arti', 'maksud', 'contoh', 'macam', 
      'jenis', 'bentuk', 'penyebab', 'tujuan', 'faktor', 'bagian', 
      'organ', 'zat', 'cara', 'langkah', 'tahap', 'mekanisme', 'materi',
      'bab', 'soal', 'kuis', 'latihan', 'beda', 'perbedaan', 'antara'
    ]);
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

  /**
   * Titik masuk utama pembuatan jawaban:
   * 1. Cek Sapaan, Casual Chat, Humor, Motivasi, Emosi, Waktu, Matematika
   * 2. Cek Intent Rangkuman
   * 3. Cek Intent Generator Kuis
   * 4. Pencarian Pengetahuan Sains & Alam Populer
   * 5. Pencarian Materi pada Modul Aktif (dengan parafrase ramah & rujukan resmi)
   * 6. Pencarian Lintas Modul (jika pertanyaan lebih pas di modul lain)
   * 7. Ensiklopedia Pengetahuan Akademik Luas
   * 8. Fallback Cerdas Teman Belajar (mengurai konsep pertanyaan secara solutif)
   */
  generateAnswer(query, moduleId) {
    try {
      const rawQuery = (query || '').trim();
      if (!rawQuery) {
        return {
          text: `Halo kawan! Ada yang bisa aku bantu jelaskan atau diskusikan hari ini? Tulis saja pertanyaanmu ya! 😊`,
          source: null,
          suggestions: ['Tips belajar fokus', 'Bagaimana cuaca hari ini?', 'Ceritakan jokes dong']
        };
      }

      const cleanQuery = rawQuery.toLowerCase();
      const tokens = this.tokenize(cleanQuery);
      const meaningfulTokens = this.getMeaningfulTokens(cleanQuery);
      const activeModule = this.getModule(moduleId);

      // ==========================================
      // 1. CEK PERCAKAPAN UMUM, CASUAL & EMOSI
      // ==========================================
      const generalChatResponse = this.handleGeneralChat(cleanQuery, rawQuery);
      if (generalChatResponse) {
        return generalChatResponse;
      }

      // ==========================================
      // 2. CEK INTENT RANGKUMAN
      // ==========================================
      if (this.isSummaryIntent(cleanQuery)) {
        if (activeModule) {
          return this.generateSummaryResponse(activeModule);
        } else {
          return {
            text: `Aku siap banget buatin rangkuman materi! 📝\n\nTapi saat ini belum ada modul materi yang aktif nih. Kamu bisa unggah file modul pembelajaran (.txt / .pdf) di sidebar kiri, atau klik tombol **"Muat Bahan P13"** biar kita bisa langsung bedah intisarinya bareng-bareng!`,
            source: null,
            suggestions: ['Muat Bahan P13', 'Tips belajar efektif', 'Siapa kamu?']
          };
        }
      }

      // ==========================================
      // 3. CEK INTENT GENERATOR KUIS
      // ==========================================
      if (this.isQuizIntent(cleanQuery)) {
        if (activeModule) {
          return {
            text: `Wah, asyik banget! Uji pemahaman lewat latihan itu cara paling efektif buat nancepin materi di kepala. 🎯\n\nYuk langsung buka tab **Generator Kuis** di atas! Kamu bisa pilih mau latihan **${activeModule.fullName}** dalam bentuk pilihan ganda atau esai, atur jumlah soalnya, dan langsung dapat evaluasi skor serta pembahasannya!`,
            source: `Rujukan: ${activeModule.shortName} - Bank Soal Latihan`,
            action: 'switch_to_quiz',
            suggestions: ['Buka Generator Kuis', 'Rangkum materi ini dulu', 'Jelaskan bab penting']
          };
        } else {
          return {
            text: `Yuk kita latihan soal! 💡 Supaya bank soalnya sesuai dengan materi yang lagi kamu pelajari, silakan unggah modul materi di sidebar kiri atau klik tombol **"Muat Bahan P13"** terlebih dahulu ya. Setelah itu kamu bisa langsung coba kuis interaktifnya di tab atas!`,
            source: null,
            action: 'switch_to_quiz',
            suggestions: ['Muat Bahan P13', 'Buka Generator Kuis', 'Tips belajar efektif']
          };
        }
      }

      // ==========================================
      // 4. PENGETAHUAN SAINS & ALAM POPULER
      // ==========================================
      const sciencePop = this.checkPopularScience(cleanQuery);
      if (sciencePop) {
        return sciencePop;
      }

      // ==========================================
      // 5. PENCARIAN PADA MODUL AKTIF (DENGAN PARAFRASE TEMAN)
      // ==========================================
      if (activeModule) {
        const moduleMatch = this.searchActiveModuleContent(cleanQuery, meaningfulTokens, activeModule);
        if (moduleMatch) {
          return moduleMatch;
        }
      }

      // ==========================================
      // 6. CEK APAKAH PERTANYAAN COCOK DENGAN MODUL LAIN DI PUSTAKA
      // ==========================================
      const crossModuleMatch = this.searchCrossModules(cleanQuery, meaningfulTokens, activeModule);
      if (crossModuleMatch) {
        return crossModuleMatch;
      }

      // ==========================================
      // 7. ENSIKLOPEDIA AKADEMIK UMUM
      // ==========================================
      const broadAcademic = this.checkBroadAcademic(cleanQuery, meaningfulTokens);
      if (broadAcademic) {
        if (activeModule) {
          return {
            text: broadAcademic.text,
            source: `Catatan Belajar Boni • Pendukung Materi ${activeModule.subject}`,
            suggestions: this.getSuggestionsForModule(activeModule, cleanQuery)
          };
        } else {
          return {
            text: broadAcademic.text,
            source: `Catatan Sains & Belajar Boni`,
            suggestions: ['Muat Bahan P13', 'Tips belajar fokus', 'Ceritakan tebak-tebakan']
          };
        }
      }

      // ==========================================
      // 8. RESPON CERDAS TEMAN BELAJAR (FALLBACK SOLUTIF)
      // ==========================================
      return this.generateFriendlySmartFallback(rawQuery, cleanQuery, meaningfulTokens, activeModule);

    } catch (err) {
      console.error('Error in generateAnswer:', err);
      return {
        text: `Wah, sempat ada sedikit kendala sistem pas memproses pesanmu barusan, tapi tenang aku sudah siap lagi! Boleh coba tanyakan ulang dengan kalimat santai kawan? Aku siap bantu jawab! 😊`,
        source: null,
        suggestions: ['Tips belajar fokus', 'Bagaimana cuaca hari ini?', 'Muat Bahan P13']
      };
    }
  }

  /**
   * Pencarian cerdas konten pada modul aktif:
   * Mengharuskan kecocokan istilah spesifik (bukan sekadar kata generik seperti 'fungsi' atau 'sel')
   */
  searchActiveModuleContent(cleanQuery, meaningfulTokens, activeModule) {
    if (!meaningfulTokens || meaningfulTokens.length === 0) return null;
    const genericWords = this.getGenericWords();

    // 5A. Pencarian QA Pairs
    let bestQA = null;
    let highestScore = 0;

    if (activeModule.qaPairs && activeModule.qaPairs.length > 0) {
      for (const qa of activeModule.qaPairs) {
        let score = 0;
        let specificMatched = false;
        const kwList = Array.isArray(qa.keywords) ? qa.keywords : [];
        
        for (const kw of kwList) {
          const lkw = kw.toLowerCase();
          if (cleanQuery.includes(lkw)) {
            if (genericWords.has(lkw)) {
              score += 1;
            } else {
              score += 10;
              specificMatched = true;
            }
          } else {
            const kwM = this.getMeaningfulTokens(lkw);
            const matchedCount = kwM.filter(t => meaningfulTokens.includes(t) && !genericWords.has(t)).length;
            if (matchedCount >= 2 || (kwM.length === 1 && matchedCount === 1)) {
              score += matchedCount * 4;
              specificMatched = true;
            }
          }
        }

        // Cek overlap jawaban hanya jika ada kecocokan spesifik
        if (specificMatched) {
          const ansM = this.getMeaningfulTokens(qa.answer || '');
          const ansOverlap = ansM.filter(t => meaningfulTokens.includes(t) && !genericWords.has(t));
          score += ansOverlap.length * 1.5;
        }

        if (specificMatched && score > highestScore) {
          highestScore = score;
          bestQA = qa;
        }
      }

      if (bestQA && highestScore >= 4) {
        const friendlyText = this.humanizeAnswer(bestQA.answer, cleanQuery, activeModule);
        return {
          text: friendlyText,
          source: bestQA.source || `Sumber: ${activeModule.shortName}`,
          suggestions: this.getSuggestionsForModule(activeModule, cleanQuery)
        };
      }
    }

    // 5B. Pencarian pada Bank Soal & Pembahasan Kuis
    if (activeModule.quizQuestions && activeModule.quizQuestions.length > 0) {
      let bestQuiz = null;
      let highestQuizScore = 0;

      for (const q of activeModule.quizQuestions) {
        let qScore = 0;
        let specificMatched = false;

        if (q.keywords && Array.isArray(q.keywords)) {
          for (const kw of q.keywords) {
            const lkw = kw.toLowerCase();
            if (cleanQuery.includes(lkw)) {
              if (!genericWords.has(lkw)) {
                qScore += 10;
                specificMatched = true;
              }
            } else {
              const kwM = this.getMeaningfulTokens(lkw);
              for (const t of kwM) {
                if (meaningfulTokens.includes(t) && !genericWords.has(t)) {
                  qScore += 4;
                  specificMatched = true;
                }
              }
            }
          }
        }

        // Cek teks soal & penjelasan (hitung hanya kata unik spesifik)
        const qMeaningfulSet = new Set(this.getMeaningfulTokens((q.question || '') + ' ' + (q.explanation || '') + ' ' + (q.modelAnswer || '')));
        const specificQueryTokens = meaningfulTokens.filter(t => !genericWords.has(t));
        const matchedSpecific = specificQueryTokens.filter(t => qMeaningfulSet.has(t));

        if (matchedSpecific.length >= 2 || (matchedSpecific.length >= 1 && specificMatched)) {
          qScore += matchedSpecific.length * 3;
          specificMatched = true;
        }

        if (specificMatched && qScore > highestQuizScore) {
          highestQuizScore = qScore;
          bestQuiz = q;
        }
      }

      if (bestQuiz && highestQuizScore >= 6) {
        const content = bestQuiz.modelAnswer || bestQuiz.explanation || bestQuiz.question;
        const friendlyText = this.humanizeAnswer(content, cleanQuery, activeModule);
        return {
          text: friendlyText,
          source: bestQuiz.citation || `Sumber: ${activeModule.shortName} - Bab ${bestQuiz.bab || 1}, Hal. ${bestQuiz.hal || 10}`,
          suggestions: this.getSuggestionsForModule(activeModule, cleanQuery)
        };
      }
    }

    // 5C. Pencarian Bab & Topik Modul Aktif
    if (activeModule.chapters && activeModule.chapters.length > 0) {
      for (const ch of activeModule.chapters) {
        const chMeaningful = this.getMeaningfulTokens(ch.judul).filter(t => !genericWords.has(t));
        const overlap = chMeaningful.filter(t => meaningfulTokens.includes(t));
        if (overlap.length >= 2 || (cleanQuery.includes(`bab ${ch.bab}`) && overlap.length >= 1)) {
          return {
            text: `Nah, topik yang kamu tanyakan ini dibahas tuntas di **${ch.judul}** (Bab ${ch.bab})! 📖\n\nDi bab ini, kita mempelajari konsep fundamentalnya, mekanisme ilmiahnya, serta contoh penerapannya dalam kehidupan sehari-hari. Bagian ini penting banget buat dikuasai pada pelajaran ${activeModule.subject}.\n\nMau kita kupas tuntas poin pentingnya, atau mau aku buatin latihan soal tentang bab ini?`,
            source: `Sumber: ${activeModule.shortName} - Bab ${ch.bab}, Hal. ${ch.hal}`,
            suggestions: this.getSuggestionsForModule(activeModule, cleanQuery)
          };
        }
      }
    }

    return null;
  }

  /**
   * Mencari kecocokan topik pada modul lain di daftar
   */
  searchCrossModules(cleanQuery, meaningfulTokens, activeModule) {
    if (!meaningfulTokens || meaningfulTokens.length === 0) return null;
    const genericWords = this.getGenericWords();
    const candidateModules = (this.modules && this.modules.length > 0) ? this.modules : this.getReferenceLibrary();
    if (!candidateModules || candidateModules.length === 0) return null;

    let bestMod = null;
    let bestQA = null;
    let highestScore = 0;

    for (const mod of candidateModules) {
      if (activeModule && mod.id === activeModule.id) continue;

      if (mod.qaPairs && mod.qaPairs.length > 0) {
        for (const qa of mod.qaPairs) {
          let score = 0;
          let specificMatched = false;

          for (const kw of (qa.keywords || [])) {
            const lkw = kw.toLowerCase();
            if (cleanQuery.includes(lkw)) {
              if (!genericWords.has(lkw)) {
                score += 10;
                specificMatched = true;
              }
            } else {
              const kwM = this.getMeaningfulTokens(lkw);
              const matchedCount = kwM.filter(t => meaningfulTokens.includes(t) && !genericWords.has(t)).length;
              if (matchedCount >= 2 || (kwM.length === 1 && matchedCount === 1)) {
                score += matchedCount * 4;
                specificMatched = true;
              }
            }
          }

          // Cek teks jawaban jika ada kecocokan spesifik
          const ansM = this.getMeaningfulTokens(qa.answer || '');
          const ansOverlap = ansM.filter(t => meaningfulTokens.includes(t) && !genericWords.has(t));
          if (ansOverlap.length >= 2) {
            score += ansOverlap.length * 3;
            specificMatched = true;
          }

          if (specificMatched && score > highestScore) {
            highestScore = score;
            bestQA = qa;
            bestMod = mod;
          }
        }
      }
    }

    if (bestQA && bestMod && highestScore >= 5) {
      const friendlyText = this.humanizeAnswer(bestQA.answer, cleanQuery, bestMod);
      const isAlreadyInSidebar = this.modules && this.modules.some(m => m.id === bestMod.id);
      const hint = isAlreadyInSidebar
        ? `💡 *Tip dari Boni: Kalau mau mempelajari materi ${bestMod.shortName} lebih lengkap beserta bank soal latihannya, kamu bisa klik modul tersebut di sidebar kiri ya!*`
        : `💡 *Tip dari Boni: Materi lengkap dan kuis untuk topik ini tersedia di ${bestMod.fullName}. Kamu bisa klik tombol **"Muat Bahan P13"** di sidebar kiri untuk memuatnya ke aplikasi!*`;

      return {
        text: `Nah, topik ini sebenarnya dibahas mendalam di materi **${bestMod.fullName}**! Tapi tenang, aku jelasin intinya buat kamu kawan:\n\n${friendlyText}\n\n${hint}`,
        source: `${bestQA.source || `Sumber: ${bestMod.shortName}`}`,
        suggestModuleSwitch: bestMod.id,
        suggestions: isAlreadyInSidebar ? [`Beralih ke ${bestMod.subject}`, 'Kembali ke materi saat ini'] : ['Muat Bahan P13', 'Tips belajar fokus']
      };
    }

    return null;
  }

  /**
   * MENGUBAH / MEMPARAFRASE TEKS KAKU MENJADI GAYA TEMAN BELAJAR (STUDY BUDDY)
   * Menggantikan gaya bahasa buku pelajaran yang kaku dengan gaya tutur yang hangat,
   * terstruktur, kaya analogi, dan interaktif.
   */
  humanizeAnswer(rawAnswer, query, moduleContext) {
    if (!rawAnswer) return 'Yuk ceritain lebih lanjut hal yang ingin kamu pelajari!';

    let clean = rawAnswer.trim();

    // 1. GERD, Gastritis, dan Masalah Pencernaan (diutamakan agar tidak tertimpa kata duodenum di Ulkus)
    if (clean.includes('GERD') || clean.includes('Gastritis') || clean.includes('Ulkus') || clean.includes('Konstipasi') || clean.includes('sembelit') || clean.includes('lambung sakit')) {
      return `Terkait masalah kesehatan pada sistem pencernaan, ada beberapa gangguan yang sering terjadi kawan:\n\n1. 🔥 **GERD (Refluks Asam)**: Asam lambung naik kembali ke kerongkongan karena katup pemisah (sfingter kardia) melemah, bikin dada terasa panas (*heartburn*).\n2. ⚡ **Gastritis (Maag)**: Peradangan pada dinding lambung akibat produksi asam berlebih, stres, atau infeksi bakteri *Helicobacter pylori*.\n3. 🩹 **Ulkus Peptikum (Tukak Lambung)**: Luka terbuka di dinding lambung karena lapisan lendir pelindungnya rusak terkikis asam.\n4. 🧱 **Konstipasi (Sembelit)**: Feses mengeras akibat usus besar menyerap terlalu banyak air, biasanya karena kurang serat dan kurang minum air putih.\n\nMakanya, yuk jaga lambung kita dengan makan teratur dan minum cukup air putih! Mau tips pola hidup sehat untuk pencernaan?`;
    }

    // 2. Duodenum, Pankreas, Empedu, Tripsin, Lipase
    if ((clean.includes('Duodenum') || clean.includes('duodenum')) && (clean.includes('pankreas') || clean.includes('empedu') || clean.includes('tripsin'))) {
      return `Wah, duodenum (usus 12 jari) ini bisa dibilang "dapur kimiawi utama" di tubuh kita! Di sini bermuara dua cairan pencernaan super penting:\n\n🥑 **1. Cairan Empedu (dari Hati & Kantung Empedu)**\n• Berfungsi mengemulsi lemak (memecah gumpalan lemak besar jadi butiran mikro) layaknya sabun pembersih, supaya enzim gampang mencernanya.\n\n⚙️ **2. Getah Pankreas (Trio Enzim Ampuh)**:\n• **Lipase**: Menghidrolisis lemak menjadi asam lemak dan gliserol.\n• **Amilase Pankreas**: Melanjutkan penguraian amilum menjadi glukosa.\n• **Tripsin**: Memotong ikatan protein menjadi asam amino sederhana yang siap diserap tubuh.\n\nKerja sama keduanya bikin semua nutrisi dari makanan siap diserap oleh usus halus! Keren banget ya?`;
    }

    // 3. Biologi: Enzim Lambung (HCl, pepsin, renin)
    if (clean.includes('parietal') && (clean.includes('HCl') || clean.includes('pepsinogen') || clean.includes('Asam klorida') || clean.includes('oksintik'))) {
      return `Nah, bayangin di dalam lambung kita itu ada cairan super tangguh yang namanya **asam klorida (HCl)**. Cairan ini diproduksi langsung oleh sel parietal di dinding lambung.\n\nKenapa tubuh kita butuh HCl? Nih ada 3 tugas pentingnya:\n1. 🛡️ **Senjata Pelindung**: Lambung dibuat sangat asam (pH 1,5–2) supaya bakteri atau kuman penyakit yang ikut tertelan di makanan langsung musnah.\n2. ⚡ **Membangunkan Enzim**: Enzim pemotong protein asalnya masih "tertidur" dalam bentuk *pepsinogen*. Nah, asam HCl inilah yang bertindak sebagai tombol 'ON' untuk mengubahnya jadi **pepsin** aktif!\n3. 🥩 **Melunakkan Makanan**: Asam ini membantu melonggarkan ikatan serat makanan sehingga lebih gampang dicerna.\n\nSetelah aktif, si **pepsin** langsung bekerja memecah protein kompleks menjadi molekul pepton (polipeptida sederhana) lewat hidrolisis ikatan peptida.\n\nKeren kan mekanisme tubuh kita? Mau kita bahas juga enzim lambung lainnya seperti renin?`;
    }

    if (clean.includes('kasein') && (clean.includes('Renin') || clean.includes('renin'))) {
      return `Pertanyaan seru nih! Renin dan pepsin itu sama-sama bekerja di lambung untuk mencerna protein, tapi punya peran spesifik yang beda lho kawan:\n\n🍼 **1. Enzim Renin (Si Pengendap Susu)**\n• Tugas khususnya adalah mengendapkan protein susu (**kasein**) dari kaseinogen dengan bantuan ion kalsium.\n• Enzim ini sangat aktif pada masa bayi supaya cairan susu tidak langsung bablas keluar lambung, tapi mengental dulu biar bisa dicerna bertahap.\n\n🥩 **2. Enzim Pepsin (Si Pemotong Protein Umum)**\n• Bertugas memecah rantai ikatan peptida protein umum menjadi pepton dan polipeptida yang lebih sederhana.\n• Bekerja optimal dalam suasana asam lambung (pH 1,5 - 2,0).\n\n**Gampangnya gini**: Renin itu 'menggumpalkan susu' biar siap olah, sedangkan Pepsin itu 'guntingnya' yang memotong-motong protein jadi bagian kecil!\n\nUdah kebayang kan bedanya? Ada bagian yang masih bikin penasaran?`;
    }

    if (clean.includes('ptialin') || clean.includes('rongga mulut') || clean.includes('saliva')) {
      return `Nah, proses pencernaan pertama kali dimulai dari mulut kita! Di sini makanan diolah lewat dua cara sekaligus lho:\n\n🦷 **1. Pencernaan Mekanis**: Dilakukan oleh gigi kita (gigi seri, taring, dan geraham) yang mengunyah dan menghaluskan makanan menjadi gumpalan lembut (bolus) sambil dibantu gerakan lidah.\n\n💧 **2. Pencernaan Kimiawi**: Dibantu oleh air liur (saliva) yang mengandung enzim **ptialin (amilase saliva)**. Enzim ini bertugas mengubah zat tepung (amilum) menjadi gula sederhana maltosa pada suasana pH netral.\n\n*Pernah nyobain ngunyah nasi putih lama-lama terus rasanya jadi agak manis?* Nah, itu bukti nyata kerja enzim ptialin di mulutmu!\n\nAsyik kan? Mau lanjut ke perjalanan makanan di lambung?`;
    }

    // 4. Sejarah: Rengasdengklok
    if (clean.includes('Rengasdengklok') || clean.includes('rengasdengklok') || (clean.includes('Karawang') && clean.includes('Soekarno'))) {
      return `Wah, ini salah satu kisah perjuangan paling menegangkan dalam sejarah kemerdekaan kita! 🇮🇩\n\nPeristiwa **Rengasdengklok** terjadi pada 16 Agustus 1945 dini hari. Waktu itu, para pemuda patriotik (Chaerul Saleh, Sukarni, Wikana, Darwis) memutuskan untuk 'mengamankan' Bung Karno dan Bung Hatta ke Rengasdengklok, Karawang.\n\nKenapa harus diamankan?\n1. Supaya kedua tokoh bangsa ini bebas dari intervensi atau janji-janji manis tentara Jepang yang baru saja kalah perang.\n2. Mendesak agar proklamasi kemerdekaan dilakukan SEGERA murni dengan kekuatan bangsa Indonesia sendiri, bukan lewat PPKI bentukan Jepang!\n\nLangkah berani golongan muda ini akhirnya sukses mempercepat proklamasi esok harinya pada 17 Agustus 1945. Jiwa keberanian mereka patut banget kita tiru ya kawan! Ada tokoh pemuda yang mau kamu tanyain?`;
    }

    // Sejarah: Maeda & Perumusan Naskah
    if (clean.includes('Maeda') || clean.includes('Sayuti Melik') || clean.includes('naskah proklamasi')) {
      return `Nah, malam 16 Agustus 1945 itu rumah Laksamana Tadashi Maeda di Jl. Imam Bonjol No. 1 Jakarta jadi saksi bisu lahirnya naskah kemerdekaan kita!\n\n📜 **Proses Perumusannya**:\n• Konsep naskah disusun bertiga oleh **Ir. Soekarno, Drs. Moh. Hatta, dan Mr. Ahmad Soebardjo** di ruang makan Maeda.\n• Naskah tulisan tangan Bung Karno kemudian diketik rapi oleh **Sayuti Melik** menggunakan mesin ketik.\n• Sayuti Melik juga melakukan sedikit koreksi redaksional, seperti mengubah kata *tempoh* menjadi *tempo*, dan mengganti kalimat penutup menjadi *Atas nama bangsa Indonesia*.\n\nSetelah itu, naskah ditandatangani oleh Soekarno dan Hatta atas nama seluruh bangsa Indonesia. Bersejarah banget kan suasananya?`;
    }

    // Sejarah: 17 Agustus 1945 & Fatmawati
    if (clean.includes('Fatmawati') || clean.includes('17 Agustus') || clean.includes('Pegangsaan Timur') || clean.includes('dijahit')) {
      return `Wah, ini momen paling bersejarah dan mengharukan bagi bangsa Indonesia! 🇮🇩✨\n\nPada hari Jumat legendaris, **17 Agustus 1945 pukul 10.00 WIB** di halaman rumah Bung Karno (Jl. Pegangsaan Timur No. 56, Jakarta):\n• Naskah Proklamasi dibacakan secara khidmat oleh Ir. Soekarno didampingi Drs. Moh. Hatta.\n• Bendera pusaka Merah Putih yang dijahit tangan langsung dengan penuh cinta oleh **Ibu Fatmawati** dikibarkan tinggi-tinggi oleh **Latief Hendraningrat dan Suhud**.\n• Seluruh rakyat yang hadir serentak menyanyikan lagu kebangsaan **Indonesia Raya** tanpa iringan musik dengan penuh haru dan tekad kemerdekaan!\n\nMerinding ya membayangkan perjuangan para pendahulu kita saat itu? Mau tahu cerita seputar penyebaran berita proklamasi ke seluruh pelosok negeri?`;
    }

    // 5. Fisika: Hukum Newton
    if (clean.includes('Hukum I Newton') || clean.includes('Inersia') || clean.includes('kelembaman') || clean.includes('ΣF = 0')) {
      return `Yuk kita bahas **Hukum I Newton** (Prinsip Kelembaman / Inersia)! 🚗💨\n\nPrinsip intinya sederhana banget kawan:\n*"Jika tidak ada gaya luar yang memengaruhi suatu benda (ΣF = 0), benda yang diam akan tetap diam, dan benda yang bergerak akan terus bergerak lurus beraturan."*\n\n**Contoh nyata sehari-hari**:\n• Waktu kamu naik mobil atau bus, lalu sopirnya tiba-tiba ngerem mendadak, tubuhmu pasti otomatis tersentak ke depan! Kenapa? Karena tubuhmu 'ingin mempertahankan gerak maju' awalnya.\n• Sebaliknya, pas mobil mendadak ngegas kencang, tubuhmu terdorong ke belakang jok.\n\nSifat benda mempertahankan keadaannya ini yang disebut **inersia**. Gampang dipahami kan? Mau lanjut ke Hukum II Newton (F = m.a)?`;
    }

    if (clean.includes('Hukum II Newton') || clean.includes('F = m') || clean.includes('percepatan')) {
      return `Nah, kalau **Hukum II Newton**, ini rumusnya yang paling terkenal di fisika: **ΣF = m × a**! 🚀\n\nIntinya gini kawan:\n• Kalau kamu mendorong sebuah benda dengan gaya (F) yang makin besar, percepatannya (a) bakal makin kencang.\n• Tapi kalau massa bendanya (m) makin berat (misal dorong kulkas vs dorong kardus mie instan), percepatannya bakal makin lambat dengan gaya yang sama.\n\n**Rumus gampangnya**:\n• Percepatan **a = F / m**\n• Satuan: Gaya (Newton), Massa (kg), Percepatan (m/s²).\n\nKira-kira mau coba kita hitung contoh soal percepatan bareng? Tulis aja angkanya!`;
    }

    if (clean.includes('Hukum III Newton') || clean.includes('Aksi-Reaksi') || clean.includes('aksi-reaksi')) {
      return `Hukum III Newton ini yang biasa kita kenal sebagai prinsip **Aksi - Reaksi**! 🤝\n\nBunyinya gini:\n*"Setiap ada gaya aksi pada suatu benda, benda itu akan memberikan gaya reaksi yang SAMA BESAR tapi BERLAWANAN ARAH (F_aksi = -F_reaksi)."*\n\n**Kunci pentingnya**:\nGaya aksi dan reaksi itu SELALU bekerja pada DUA BENDA YANG BERBEDA lho kawan!\n• Contoh roket: Gas panas disembur kencang ke bawah (aksi), dorongan baliknya bikin badan roket meluncur terbang ke atas (reaksi).\n• Contoh berenang: Tanganmu mendayung air ke belakang (aksi), badanmu melaju ke depan (reaksi).\n\nKeren kan hukum fisika di alam kita? Mau lanjut ke contoh lain?`;
    }

    // 6. Kimia: Eksoterm & Endoterm
    if (clean.includes('Eksoterm') || clean.includes('eksoterm') || clean.includes('endoterm') || clean.includes('Endoterm')) {
      return `Pertanyaan seru nih! Dalam kimia termokimia, ada dua jenis reaksi berdasarkan perpindahan panas/kalornya kawan:\n\n🔥 **1. Reaksi Eksoterm (Melepas Kalor)**\n• Sistem reaksi melepaskan energi panas ke lingkungan sekitarnya.\n• Ciri khasnya: Nilai perubahan entalpi bernilai negatif (**ΔH < 0**), dan suhu di sekitar wadah bakal terasa **panas / hangat**.\n• Contoh nyata: Api unggun yang menghangatkan malam, atau reaksi pembakaran gas LPG di kompor!\n\n❄️ **2. Reaksi Endoterm (Menyerap Kalor)**\n• Sistem reaksi menyerap energi panas dari lingkungan ke dalam sistem.\n• Ciri khasnya: Nilai perubahan entalpi bernilai positif (**ΔH > 0**), dan lingkungan bakal terasa **dingin / sejuk** karena kalornya disedot.\n• Contoh nyata: Kompres dingin instan, es batu yang mencair, atau fotosintesis tumbuhan.\n\n**Gampangnya gini**: *Ekso* itu 'keluar' (panas keluar), *Endo* itu 'ke dalam' (panas diserap masuk)!\n\nKebayang kan bedanya? Mau kita coba contoh reaksi lainnya?`;
    }

    // Kimia: Hukum Hess
    if (clean.includes('Hess') || clean.includes('hess')) {
      return `Nah, **Hukum Hess** ini salah satu prinsip paling sakti di termokimia kawan! Ditemukan oleh Germain Henri Hess pada tahun 1840.\n\nInti bunyinya gini:\n*\"Perubahan entalpi total suatu reaksi kimia HANYA bergantung pada keadaan awal (reaktan) dan keadaan akhir (produk), dan sama sekali TIDAK bergantung pada jalannya atau tahapan reaksi.\"*\n\n**Analogi gampangnya**:\nBayangin kamu mau naik dari lantai 1 ke lantai 5 sebuah gedung. Entah kamu naik lift langsung, lewat tangga darurat meliuk-liuk, atau muter-muter dulu lewat lantai 2 dan 3, perubahan ketinggianmu dari lantai 1 ke lantai 5 tetap SAMA PERSIS!\n\nJadi di kimia, kalau suatu reaksi susah diukur langsung di lab, kita bisa menghitungnya dari kombinasi reaksi-reaksi perantara lain. Asyik kan triknya?`;
    }

    // 7. Matematika: Limit & Turunan
    if (clean.includes('limit') || clean.includes('0/0') || clean.includes('lhopital') || clean.includes('L’Hôpital')) {
      return `Pernah ngerjain soal limit fungsi aljabar, pas disubstitusi angkanya malah ketemu bentuk tak tentu **0/0**? Jangan panik, itu bukan jalan buntu kawan! 📐\n\nNih 3 jurus ampuh buat menyelesaikannya:\n1. ✂️ **Faktorkan Aljabar**: Cari faktor pembuat nol di pembilang dan penyebut (misal x - a), lalu coret bagian yang sama!\n2. 🪞 **Kalikan Sekawan**: Kalau fungsinya ada bentuk akar kuadrat (misal √x - √a), kalikan atas-bawah dengan bentuk sekawannya (√x + √a).\n3. ⚡ **Aturan L'Hôpital (Jurus Cepat)**: Kalau bentuknya 0/0, turunkan fungsi pembilang dan turunkan fungsi penyebut secara terpisah: **lim f(x)/g(x) = lim f'(x)/g'(x)**!\n\nMau kita coba langsung ke salah satu contoh soal limit?`;
    }

    // 8. Sosiologi: Diferensiasi vs Stratifikasi
    if (clean.includes('Diferensiasi') || clean.includes('diferensiasi') || clean.includes('Stratifikasi') || clean.includes('stratifikasi')) {
      return `Pertanyaan seru nih! Di sosiologi, pembagian kelompok masyarakat dibedakan jadi dua bentuk utama kawan:\n\n↔️ **1. Diferensiasi Sosial (Horizontal / Sejajar)**\n• Pembagian masyarakat ke dalam kelompok-kelompok yang sederajat tanpa ada tingkatan tinggi atau rendah.\n• Contohnya: Perbedaan agama, suku/etnis, ras, jenis kelamin, dan klan. Tidak ada yang lebih tinggi atau lebih mulia, semuanya setara!\n\n↕️ **2. Stratifikasi Sosial (Vertikal / Bertingkat)**\n• Pengelompokan masyarakat ke dalam lapisan-lapisan sosial hierarkis (kelas atas, menengah, bawah).\n• Dasar pembedanya: Kekayaan materi, tingkat kekuasaan politik, tingkat pendidikan, atau kehormatan/gelar kebangsawanan.\n\n**Gampangnya gini**: Kalau *diferensiasi* itu berjejer ke samping (sejajar), kalau *stratifikasi* itu bertingkat ke atas seperti tangga kue lapis!\n\nKebayang kan perbedaannya? Mau bahas bentuk mobilitas sosial juga?`;
    }

    // Format umum yang hangat dan bersahabat
    return `Nah, jadi begini penjelasannya kawan:\n\n${clean}\n\nSemoga penjelasan ini membantumu lebih mudah memahami konsepnya ya! Kalau ada bagian yang masih bikin penasaran, tanyain aja lagi ke aku! 😊`;
  }

  /**
   * PENANGANAN PERCAKAPAN UMUM, SAPAAN, CASUAL, HUMOR, MATEMATIKA, WAKTU
   */
  handleGeneralChat(clean, raw) {
    // ----------------------------------------------------
    // A. KALKULATOR MATEMATIKA
    // ----------------------------------------------------
    const mathResult = this.calculateMath(clean);
    if (mathResult) {
      return {
        text: `${mathResult} 🧮\n\nHitungannya pas kan? Mau aku bantu hitung angka lain atau bahas rumus matematika tertentu?`,
        source: 'Kalkulator Belajar Boni',
        suggestions: ['Hitung 50 * 12', 'Tips belajar matematika', 'Beri soal kuis']
      };
    }

    // ----------------------------------------------------
    // B. WAKTU & HARI
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
        text: `Sekarang hari **${hari}, ${tanggal} ${bulan} ${tahun}**, pukul **${jam}:${menit}** (waktu perangkat lokalmu). ⏰\n\nWaktu yang pas banget buat nambah wawasan baru atau mengulang materi yang tadi dipelajari. Mau belajar topik apa kita sekarang?`,
        source: null,
        suggestions: ['Tips manajemen waktu', 'Motivasi belajar hari ini', 'Bagaimana cuaca hari ini?']
      };
    }

    // ----------------------------------------------------
    // C. CUACA HARI INI
    // ----------------------------------------------------
    if (
      clean.includes('cuaca hari ini') || clean.includes('cuaca sekarang') ||
      clean.includes('bagaimana cuaca') || clean.includes('gimana cuaca') ||
      clean.includes('apakah hari ini hujan') || clean.includes('ramalan cuaca') ||
      clean.includes('prediksi cuaca') || clean.includes('kondisi cuaca') ||
      clean.includes('cuaca di luar') || clean === 'cuaca'
    ) {
      return {
        text: `Karena aku beroperasi **100% offline langsung di browsermu** tanpa koneksi internet ke BMKG atau sensor satelit, aku gak bisa memantau langsung langit di atas rumahmu saat ini nih hehe. Coba intip ke luar jendela sebentar, cerah atau mendung? 🌤️\n\nTapi kalau kamu mau bahas **ilmu sains di balik cuaca**—seperti kenapa bisa hujan, cara awan terbentuk, petir, atau pelangi—aku siap banget jelasin dengan seru! Mau bahas yang mana dulu nih?`,
        source: null,
        suggestions: ['Kenapa bisa hujan?', 'Kenapa langit berwarna biru?', 'Bagaimana petir terjadi?']
      };
    }

    // ----------------------------------------------------
    // D. SAPAAN & SALAM (GREETINGS)
    // ----------------------------------------------------
    const isGreeting = (
      /^(halo|hai|helo|hei|hi|hello|hey|oy|oi|halo ai|hai ai|halo boni|hai boni|pagi|siang|sore|malam|selamat pagi|selamat siang|selamat sore|selamat malam|assalamu|salam|sampurasun)\b/i.test(clean) ||
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
        text: `Halo, selamat ${salamWaktu}! 👋 Senang banget ketemu kamu di sini.\n\nKenalin, aku **Boni**, teman belajarmu yang siap menemani kapan pun kamu butuh bantuan. Kamu bisa tanya apa saja—mulai dari materi pelajaran, sains seru, tips belajar santai, hitungan matematika, atau sekadar ngobrol ringan pas lagi butuh jeda.\n\nApa nih yang lagi pengen kamu pelajari atau tanyain hari ini?`,
        source: null,
        suggestions: ['Bagaimana cuaca hari ini?', 'Tips belajar fokus', 'Ceritakan tebak-tebakan']
      };
    }

    // ----------------------------------------------------
    // E. IDENTITAS & PERSONA
    // ----------------------------------------------------
    if (
      clean.includes('siapa kamu') || clean.includes('kamu siapa') ||
      clean.includes('nama kamu') || clean.includes('namamu siapa') ||
      clean.includes('siapa anda') || clean === 'siapa kamu?' || clean === 'siapa namamu?'
    ) {
      return {
        text: `Kenalin, namaku **Boni**! 🎓 Teman belajar AI kamu yang beroperasi **100% lokal & offline di peramban webmu**.\n\nAnggap saja aku teman sekelasmu yang siap diajak diskusi materi pelajaran, mengupas konsep yang sulit jadi gampang dipahami, buatin kuis latihan, merangkum modul, atau nemenin ngobrol santai pas kamu lagi capek belajar. Ada materi yang lagi pengen kamu kuasai bareng aku?`,
        source: null,
        suggestions: ['Apa saja kemampuanmu?', 'Tips belajar efektif', 'Bisa bantu apa saja?']
      };
    }

    if (
      clean.includes('bisa apa') || clean.includes('kemampuanmu') ||
      clean.includes('fitur apa') || clean.includes('apa yang bisa kamu lakukan') ||
      clean.includes('bisa bantu apa') || clean.includes('cara kerja')
    ) {
      return {
        text: `Banyak hal seru yang bisa kita lakuin bareng lho! Nih beberapa di antaranya:\n\n1. 📖 **Tanya Jawab Materi**: Tanyain konsep apa pun dari modul yang kamu upload. Aku bakal jelasin dengan bahasa yang santai dan menyertakan rujukan nomor halaman bukunya.\n2. ⚡ **Generator Kuis**: Kita bisa latihan soal pilihan ganda maupun esai dengan pembahasan instan.\n3. 📝 **Rangkuman Cepat**: Aku bisa bantuin bikin intisari materi dari modul pelajaranmu.\n4. 💬 **Teman Diskusi & Sains**: Mau tanya soal cuaca, tata surya, tubuh manusia, sejarah, matematika dasar, sampai tips motivasi belajar—aku siap nemenin!\n5. 🔒 **100% Offline & Privat**: Semua percakapan dan modulmu aman tersimpan di komputermu sendiri tanpa perlu internet.\n\nMau mulai dari mana kita hari ini?`,
        source: null,
        suggestions: ['Tips belajar fokus', 'Bagaimana proses hujan?', 'Buka Generator Kuis']
      };
    }

    // ----------------------------------------------------
    // F. OBROLAN SANTAI, KABAR & KELUH KESAH (EMPATI TEMAN)
    // ----------------------------------------------------
    if (
      clean.includes('apa kabar') || clean.includes('gimana kabar') ||
      clean.includes('bagaimana kabarmu') || clean.includes('sehat')
    ) {
      return {
        text: `Kabar aku super semangat dan selalu siap 100% nemenin kamu belajar! 🌟\n\nKalau kabarmu sendiri gimana hari ini kawan? Semoga lagi sehat, bersemangat, dan bahagia ya. Ada materi seru yang pengen kita bahas bareng?`,
        source: null,
        suggestions: ['Tips belajar fokus', 'Motivasi belajar hari ini', 'Hitung 25 * 14']
      };
    }

    if (
      clean.includes('lagi apa') || clean.includes('sedang apa') ||
      clean.includes('lagi ngapain') || clean.includes('sedang ngapain')
    ) {
      return {
        text: `Lagi siap siaga di browsermu nih! Nungguin kamu ngajak diskusi materi, bikin kuis, atau nemenin ngobrol santai. Kamu sendiri lagi sibuk ngerjain tugas apa, atau lagi santai dulu? 😊`,
        source: null,
        suggestions: ['Mulai belajar materi', 'Beri tebak-tebakan lucu', 'Tips manajemen waktu']
      };
    }

    if (
      clean.includes('kamu robot') || clean.includes('kamu ai') ||
      clean.includes('apakah kamu manusia') || clean.includes('kamu manusia')
    ) {
      return {
        text: `Hehe iya, aku adalah program **Artificial Intelligence (AI)** cerdas yang berjalan lokal di komputermu. Meskipun aku kecerdasan buatan, anggap saja aku teman belajar setia yang siap nemenin kamu dengan ramah, sabar, dan gak bakal bosen diajak diskusi berkali-kali! 🤖✨`,
        source: null,
        suggestions: ['Apa yang bisa kamu lakukan?', 'Jokes bapak-bapak', 'Tips belajar']
      };
    }

    if (
      clean.includes('kamu pintar') || clean.includes('hebat') ||
      clean.includes('keren') || clean.includes('mantap') || clean.includes('luar biasa')
    ) {
      return {
        text: `Wah, makasih banyak ya pujiannya! Senang banget kalau penjelasanku bermanfaat buat kamu. 😊 Tapi kamu juga hebat banget lho karena punya rasa ingin tahu yang tinggi dan tekun belajar. Yuk kita lanjutkan semangat belajarnya!`,
        source: null,
        suggestions: ['Beri soal kuis menantang', 'Tips belajar fokus', 'Rangkum materi']
      };
    }

    if (
      clean.includes('bosan') || clean.includes('mager') ||
      clean.includes('malas') || clean.includes('capek') || clean.includes('lelah') ||
      clean.includes('pusing') || clean.includes('jenuh')
    ) {
      return {
        text: `Peluk online dulu dari aku! 🤗 Wajar banget kok, belajar terus-menerus itu bisa bikin otak lelah dan jenuh. Istirahat sejenak itu bukan malas, tapi bagian penting dari proses belajar supaya otakmu punya waktu memproses informasi!\n\nCoba tips rileks cepat ini:\n1. 💧 Minum segelas air putih dingin.\n2. 🚶 Berdiri dan rengangkan badan santai 3–5 menit.\n3. 👀 Alihkan pandangan ke luar jendela atau tanaman hijau.\n\nKalau mau hiburan ringan biar gak tegang, mau aku ceritain tebak-tebakan lucu atau pantun penyemangat?`,
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

    if (clean.includes('pantun')) {
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

    // ----------------------------------------------------
    // H. TIPS BELAJAR & MOTIVASI
    // ----------------------------------------------------
    if (
      clean.includes('tips belajar') || clean.includes('cara belajar') ||
      clean.includes('cara fokus') || clean.includes('pomodoro') ||
      clean.includes('tips ujian') || clean.includes('belajar efektif') ||
      clean.includes('cepat hafal') || clean.includes('biar paham')
    ) {
      return {
        text: `Nih, aku spill **5 trik belajar cerdas** ala ilmu sains kognitif yang bikin materi nempel kuat di otak:\n\n1. ⏱️ **Teknik Pomodoro**: Belajar fokus 25 menit (singkirkan HP), lalu istirahat 5 menit. Ulangi 4 sesi, baru istirahat panjang 15-20 menit. Otakmu bakal tetap segar!\n2. 🧠 **Active Recall (Uji Ingatan)**: Daripada cuma baca buku berulang kali, mending tutup bukumu lalu coba ceritakan kembali atau kerjakan kuis latihan.\n3. 🔄 **Spaced Repetition**: Ulas materi setelah 1 hari, 3 hari, dan 1 minggu agar masuk ke memori jangka panjang (*long-term memory*).\n4. 🗣️ **Teknik Feynman**: Jelaskan konsep materi ke orang lain (atau pura-pura jelasin ke boneka/cermin) dengan bahasa sesederhana mungkin.\n5. 💤 **Tidur Cukup**: Otak kita menata dan merapikan materi yang dipelajari pas tidur. Jadi jangan begadang pas mau ujian ya!\n\nMau kita coba latihan soal pakai teknik active recall sekarang?`,
        source: 'Tips Belajar Cerdas Boni',
        suggestions: ['Motivasi belajar', 'Buka Generator Kuis', 'Bagaimana proses hujan?']
      };
    }

    if (
      clean.includes('motivasi') || clean.includes('kata mutiara') ||
      clean.includes('semangat') || clean.includes('kata bijak')
    ) {
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

    // ----------------------------------------------------
    // I. TERIMA KASIH & PAMITAN
    // ----------------------------------------------------
    if (
      clean.includes('terima kasih') || clean.includes('makasih') ||
      clean.includes('thanks') || clean.includes('thank you') ||
      clean.includes('matur nuwun') || clean.includes('terimakasih')
    ) {
      return {
        text: `Sama-sama kawan! Seneng banget bisa nemenin dan bantu belajarmu hari ini. 😊\n\nKapan pun kamu butuh teman diskusi materi, mau latihan kuis, atau butuh rujukan bab, panggil aku lagi ya! Semangat terus belajarnya!`,
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
        text: `Sampai jumpa lagi kawan! Tetap jaga kesehatan dan semangat terus ya. Kapan pun kamu mau lanjut belajar offline, aku selalu ada di sini standby nemenin kamu! 👋🎓`,
        source: null,
        suggestions: ['Halo!', 'Siapa kamu?', 'Tips belajar fokus']
      };
    }

    return null;
  }

  /**
   * PENGETAHUAN SAINS POPULER & ALAM SEHARI-HARI (FRIENDLY STYLE)
   */
  checkPopularScience(clean) {
    // 1. Mengapa hujan / proses siklus air
    if (
      clean.includes('kenapa hujan') || clean.includes('kenapa bisa hujan') ||
      clean.includes('proses hujan') || clean.includes('terjadinya hujan') ||
      clean.includes('siklus air') || clean.includes('siklus hidrologi')
    ) {
      return {
        text: `Pernah penasaran gak, dari mana sih datangnya air hujan yang berlimpah itu? 🌧️\n\nNah, hujan itu terjadi lewat **siklus hidrologi (siklus air)** yang berputar terus-menerus di bumi kita melalui 4 tahapan seru:\n\n1. ☀️ **Evaporasi & Transpirasi**: Air di samudra, danau, dan sungai menguap ke udara karena panas matahari. Tanaman juga ikutan melepas uap air lewat stomata daunnya.\n2. ☁️ **Kondensasi (Membentuk Awan)**: Uap air naik ke atmosfer yang dingin, lalu mengembun jadi butiran-butiran air mikro yang berkumpul jadi awan putih tebal.\n3. 💧 **Presipitasi (Turun Hujan)**: Di dalam awan, butiran air saling bertabrakan dan makin berat. Pas aliran udara gak kuat lagi menahannya, gravitasi menariknya jatuh ke bumi sebagai **hujan**!\n4. 🏞️ **Infiltrasi & Aliran**: Air hujan meresap ke dalam tanah (jadi cadangan air tanah) atau mengalir lewat sungai kembali ke laut untuk mengulang siklus lagi.\n\nKeren kan daur ulang air alami bumi kita? Mau tahu kenapa pas hujan kadang ada petir?`,
        source: 'Sains Alam • Siklus Hidrologi',
        suggestions: ['Kenapa ada petir?', 'Kenapa langit biru?', 'Bagaimana pelangi terbentuk?']
      };
    }

    // 2. Mengapa langit biru
    if (
      clean.includes('langit biru') || clean.includes('kenapa langit berwarna biru') ||
      clean.includes('mengapa langit biru') || clean.includes('warna langit')
    ) {
      return {
        text: `Pertanyaan klasik yang menarik banget! Kenapa ya langit siang hari warnanya biru, bukan ungu atau hijau? 🌤️\n\nNah, di fisika fenomena ini disebut **Hamburan Rayleigh (Rayleigh Scattering)**:\n\n1. 🌈 **Cahaya Matahari itu Gabungan Spektrum**: Sinar matahari yang tampak putih sebenarnya adalah gabungan semua warna pelangi (merah sampai ungu).\n2. 🌊 **Panjang Gelombang Berbeda**: Cahaya merah punya gelombang panjang, sedangkan cahaya biru punya gelombang pendek yang lincah.\n3. 💥 **Tumbukan Partikel Atmosfer**: Saat menembus atmosfer bumi, cahaya bergelombang pendek (biru dan nila) jauh lebih mudah terhambur dan terpantul ke segala arah oleh molekul gas nitrogen dan oksigen.\n\nKarena cahaya biru ini terhambur ke mana-mana di atas kita, mata kita menangkap langit sebagai hamparan warna biru yang cerah!\n\nMenarik kan? Mau tahu juga kenapa pas senja langit malah berubah jadi jingga kemerahan?`,
        source: 'Fisika Optik • Hamburan Rayleigh',
        suggestions: ['Kenapa ada pelangi?', 'Kenapa bisa hujan?', 'Bagaimana petir terjadi?']
      };
    }

    // 3. Petir dan kilat
    if (
      clean.includes('petir') || clean.includes('kilat') || clean.includes('guntur') || clean.includes('guruh')
    ) {
      return {
        text: `**Petir** itu sebenarnya adalah pelepasan listrik raksasa di angkasa, biasanya dari awan badai besar (*Kumulonimbus*)! ⚡\n\nGini proses terjadinya:\n1. ⚡ **Pemisahan Muatan**: Gesekan hebat antara tetes air dan kristal es di awan badai membuat muatan listrik terpisah: muatan positif berkumpul di puncak awan, sedangkan muatan negatif menumpuk di dasar awan.\n2. 💥 **Loncatan Elektron (Kilat)**: Saat beda potensial listrik makin tinggi hingga udara tak sanggup lagi menahannya, terjadilah loncatan listrik berkecepatan tinggi yang menghasilkan kilatan cahaya terang (**kilat**).\n3. 📢 **Dentuman Suara (Guntur)**: Loncatan listrik itu memanaskan udara di sekitarnya seketika sampai suhu ~30.000°C (lebih panas dari permukaan matahari!). Udara memuai mendadak dan memicu gelombang kejut suara menggelegar (**guntur**).\n\n*Kenapa kilat kelihatan dulu baru suaranya terdengar?* Karena kecepatan cahaya (~300.000 km/s) jutaan kali lebih kencang dibanding kecepatan suara di udara (~340 m/s)!\n\nKeren dan dahsyat banget kan tenaga alam itu?`,
        source: 'Fisika Alam • Listrik Statis Atmosfer',
        suggestions: ['Kenapa bisa hujan?', 'Kenapa langit biru?', 'Berapa kecepatan cahaya?']
      };
    }

    // 4. Pelangi
    if (clean.includes('pelangi')) {
      return {
        text: `Pelangi itu seperti lukisan fisika di langit setelah hujan! 🌈\n\nPelangi muncul saat sinar matahari mengenai jutaan tetesan air sisa hujan di udara melalui 3 peristiwa optik:\n1. 🔍 **Refraksi (Pembiasan)**: Cahaya matahari dibelokkan saat masuk ke dalam tetesan air.\n2. 🎨 **Dispersi (Penguraian Warna)**: Cahaya putih matahari diuraikan jadi spektrum warna-warni (Merah, Jingga, Kuning, Hijau, Biru, Nila, Ungu) karena tiap warna punya panjang gelombang dan sudut belok berbeda.\n3. 🪞 **Refleksi Internal**: Warna-warni tadi memantul di dinding belakang tetesan air, lalu keluar kembali ke udara menuju mata kita dengan sudut sekitar 40°–42°.\n\nMakanya, pelangi selalu muncul di arah yang berlawanan dengan posisi matahari! Pernah lihat pelangi ganda?`,
        source: 'Fisika Optik • Dispersi Cahaya',
        suggestions: ['Kenapa langit biru?', 'Kenapa bisa hujan?', 'Hitung kecepatan cahaya']
      };
    }

    // 5. Fotosintesis
    if (clean.includes('fotosintesis') || clean.includes('klorofil')) {
      return {
        text: `**Fotosintesis** itu ibarat "dapur makanan" bagi seluruh makhluk hidup di bumi! Tumbuhan berklorofil memasak makanannya sendiri menggunakan bantuan energi cahaya matahari. 🌱☀️\n\nNih resep kimianya:\n**6 CO₂ (Karbon Dioksida) + 6 H₂O (Air) + Sinar Matahari ➔ C₆H₁₂O₆ (Glukosa) + 6 O₂ (Oksigen)**\n\nAda dua tahapan seru di dalam kloroplas:\n1. ☀️ **Reaksi Terang (di Tilakoid)**: Klorofil menangkap foton matahari untuk memecah molekul air (fotolisis) dan menghasilkan energi ATP, NADPH, serta melepaskan oksigen segar yang kita hirup sehari-hari.\n2. 🌙 **Reaksi Gelap / Siklus Calvin (di Stroma)**: Memanfaatkan energi dari reaksi terang untuk mengubah karbon dioksida menjadi glukosa/energi bagi tumbuhan.\n\nBayangin kalau gak ada tumbuhan yang berfotosintesis, bumi kita bakal kekurangan oksigen lho! Ada yang mau kamu tanyain soal daun atau kloroplas?`,
        source: 'Biologi Tumbuhan • Fisiologi Fotosintesis',
        suggestions: ['Muat Bahan P13', 'Tips belajar efektif', 'Buka Generator Kuis']
      };
    }

    // 6. Air laut asin
    if (clean.includes('laut asin') || clean.includes('kenapa air laut asin')) {
      return {
        text: `Pernah gak sengaja ketelen air laut pas berenang di pantai terus rasanya asin banget? 🌊🧂\n\nNah, rasa asin itu berasal dari proses alam selama miliaran tahun lho:\n1. 🌧️ **Hujan Mengikis Batuan**: Air hujan yang sedikit asam mengenai batuan di daratan dan melarutkan mineral garam di dalamnya.\n2. 🏞️ **Aliran Sungai ke Laut**: Air sungai membawa larutan mineral garam tersebut (terutama ion natrium Na⁺ dan klorida Cl⁻) menuju ke samudra.\n3. ☀️ **Penguapan Air Murni**: Panas matahari membuat air laut menguap membentuk awan hujan, tapi mineral garamnya tertinggal dan tidak ikut menguap!\n\nKarena siklus ini berulang selama ratusan juta tahun, kadar garam di laut pun semakin pekat dan membuatnya terasa asin seperti sekarang. Menarik banget kan siklus bumi kita?`,
        source: 'Geografi & Oseanografi',
        suggestions: ['Kenapa bisa hujan?', 'Kenapa langit biru?', 'Bagaimana petir terjadi?']
      };
    }

    // 7. Manusia butuh tidur
    if (clean.includes('butuh tidur') || clean.includes('kenapa kita tidur') || clean.includes('harus tidur')) {
      return {
        text: `Tidur itu bukan cuma sekadar istirahat pas badan capek lho, tapi proses super krusial buat otak dan tubuh kita! 🛌💤\n\nNih 3 alasan kenapa kita wajib tidur cukup:\n1. 🧹 **Pembersihan Racun di Otak**: Saat tidur nyenyak, cairan serebrospinal membersihkan zat sisa racun dan plak di otak yang menumpuk seharian.\n2. 📚 **Konsolidasi Memori**: Otak kita memindahkan materi pelajaran dan hafalan dari memori jangka pendek ke memori jangka panjang (*long-term memory*). Makanya kalau mau ujian, tidur cukup itu kunci biar ilmunya nempel!\n3. 🔋 **Perbaikan Sel & Imun**: Tubuh melepaskan hormon pertumbuhan (*growth hormone*) untuk mereparasi sel-sel yang rusak dan memperkuat daya tahan tubuh.\n\nJadi jangan biasakan begadang ya kawan! Mau tips mengatur jadwal tidur yang ideal buat pelajar?`,
        source: 'Sains Kesehatan & Neurosains',
        suggestions: ['Tips belajar efektif', 'Teknik belajar pomodoro', 'Motivasi belajar']
      };
    }

    // 8. Planet & Tata Surya
    if (clean.includes('planet terbesar') || clean.includes('jupiter') || clean.includes('yupiter')) {
      return {
        text: `Planet terbesar di Tata Surya kita adalah **Yupiter (Jupiter)**! 🪐\n\nYupiter adalah raksasa gas dengan diameter sekitar 142.984 km (lebih dari 11 kali ukuran diameter bumi!). Volume Yupiter begitu raksasa sampai bisa memuat lebih dari **1.300 planet bumi** di dalamnya!\n\nUniknya lagi, Yupiter punya bintik merah raksasa (*Great Red Spot*) yang sebenarnya adalah badai angin kencang abadi yang sudah berputar ratusan tahun. Dahsyat banget ya alam semesta kita?`,
        source: 'Astronomi • Tata Surya',
        suggestions: ['Berapa kecepatan cahaya?', 'Kenapa langit biru?', 'Bagaimana petir terjadi?']
      };
    }

    // 9. Kecepatan Cahaya
    if (clean.includes('kecepatan cahaya')) {
      return {
        text: `Kecepatan cahaya dalam ruang hampa udara adalah batas kecepatan tertinggi di alam semesta, yaitu sekitar **299.792.458 meter per detik** (sering dibulatkan jadi **300.000 km per detik**)! ⚡\n\nBayangin secepat apa itu:\n• Dalam 1 detik, cahaya bisa mengelilingi bola bumi sebanyak 7,5 kali!\n• Dari matahari ke bumi yang jaraknya ~150 juta kilometer, cahaya cuma butuh waktu sekitar 8 menit 20 detik untuk sampai ke mata kita.\n\nKeren banget kan fisika relativitas itu? Mau coba hitung jarak tempuh cahaya dalam 1 jam?`,
        source: 'Fisika Modern • Konstanta Kecepatan Cahaya',
        suggestions: ['Kenapa langit biru?', 'Kenapa ada petir?', 'Hitung 300000 * 60']
      };
    }

    // 10. Gempa bumi & Tsunami
    if (clean.includes('gempa') || clean.includes('tsunami')) {
      return {
        text: `Gempa bumi dan tsunami adalah bukti dinamisnya kerak bumi kita kawan 🌋\n\n• **Gempa Bumi**: Terjadi saat lempeng tektonik bumi yang saling bergesekan atau bertumbukan mendadak melepaskan energi yang terkunci, memicu gelombang seismik yang merambat dan mengguncang tanah.\n• **Tsunami**: Terjadi jika gempa bumi bawah laut berkekuatan besar menyebabkan patahan vertikal dasar laut yang mendadak naik atau turun, menghempaskan volume air laut raksasa menjadi gelombang pantai yang menjulang tinggi.\n\nIndonesia berada di kawasan *Ring of Fire* (Cincin Api Pasifik) dan pertemuan tiga lempeng tektonik besar, makanya pemahaman mitigasi bencana gempa itu penting banget buat kita kuasai ya!`,
        source: 'Geografi Fisik • Geodinamika Lempeng',
        suggestions: ['Kenapa ada gunung berapi?', 'Bagaimana proses hujan?', 'Tips belajar fokus']
      };
    }

    // 11. IKN / Ibu kota Indonesia
    if (clean.includes('ibukota indonesia') || clean.includes('ibu kota indonesia') || clean.includes('ikn')) {
      return {
        text: `Ibu Kota Negara Indonesia adalah **Nusantara (IKN)** yang berlokasi di wilayah Kabupaten Penajam Paser Utara dan Kutai Kartanegara, Kalimantan Timur, berdasarkan UU No. 3 Tahun 2022. 🏛️\n\nSebelumnya, ibu kota negara berada di **DKI Jakarta**, yang kini tetap memegang peran krusial sebagai pusat perekonomian dan bisnis terdepan di Indonesia.\n\nPernah dengar konsep *smart forest city* yang dirancang untuk IKN? Seru banget lho konsepnya!`,
        source: 'Geografi & Wawasan Nusantara',
        suggestions: ['Berapa jumlah provinsi di Indonesia?', 'Tips belajar', 'Bagaimana proses hujan?']
      };
    }

    return null;
  }

  /**
   * ENSIKLOPEDIA PENGETAHUAN AKADEMIK UMUM
   */
  checkBroadAcademic(clean, tokens) {
    // A. Biologi: Lambung, Enzim, Darah, Sel, Organ Tubuh
    if ((clean.includes('lambung') || clean.includes('getah lambung')) && (clean.includes('enzim') || clean.includes('apa saja') || clean.includes('apa aja'))) {
      return {
        text: `Nah, di dalam lambung kita ada getah lambung yang memproduksi beberapa zat dan enzim pencernaan super penting kawan:\n\n1. ⚡ **Asam Klorida (HCl)**: Dihasilkan sel parietal, bertugas mematikan kuman penyakit dan mengaktifkan pepsinogen menjadi pepsin aktif.\n2. 🥩 **Enzim Pepsin**: Bertugas memotong ikatan protein kompleks menjadi pepton (polipeptida sederhana).\n3. 🍼 **Enzim Renin**: Mengendapkan protein susu (kasein) dari kaseinogen dengan bantuan ion kalsium (sangat aktif pada bayi).\n4. 🛡️ **Mukus (Lendir Basa)**: Lapisan pelindung tebal kaya bikarbonat yang menjaga dinding lambung agar tidak terluka oleh asam pekatnya sendiri.\n\nKeren kan kerja sama zat dan enzim di lambung kita? Mau tahu bagaimana proses pencernaan lanjutannya di usus halus?`
      };
    }

    if (clean.includes('fungsi lambung') || (clean.includes('lambung') && clean.includes('fungsi'))) {
      return {
        text: `Lambung kita punya 4 fungsi vital dalam sistem pencernaan lho kawan:\n\n1. 📦 **Tempat Penyimpanan Sementara**: Menampung makanan dan minuman yang kita telan selama 2 hingga 4 jam.\n2. 🌀 **Pencernaan Mekanis**: Otot dinding lambung berkontraksi dan meremas-remas makanan (*gerak peristaltik*) hingga menjadi bubur halus yang disebut **kimus (chyme)**.\n3. 🧪 **Pencernaan Kimiawi**: Menghasilkan asam HCl dan enzim pepsin untuk mulai mencerna dan memotong protein.\n4. 🛡️ **Benteng Imun Pertama**: Keasaman lambung yang tinggi (pH 1,5–2) langsung membasmi bakteri patogen yang ikut terbawa di makanan.\n\nSetelah dari lambung, kimus bakal dialirkan sedikit demi sedikit ke usus halus. Keren kan cara kerja lambung kita?`
      };
    }

    if (clean.includes('sel darah') || clean.includes('eritrosit') || clean.includes('leukosit') || clean.includes('trombosit') || clean.includes('darah merah') || clean.includes('darah putih')) {
      return {
        text: `Di dalam tubuh kita, darah punya 3 komponen sel utama dengan tugas yang saling melengkapi lho:\n\n1. 🔴 **Eritrosit (Sel Darah Merah)**: Mengandung protein **hemoglobin** yang mengikat oksigen dari paru-paru untuk diedarkan ke seluruh tubuh, sekaligus membawa karbon dioksida kembali ke paru-paru. Bentuknya bikonkaf tanpa inti sel!\n2. ⚪ **Leukosit (Sel Darah Putih)**: Prajurit sistem imun yang bertugas memburu dan membunuh bakteri, virus, atau kuman penyakit.\n3. 🩸 **Trombosit (Keping Darah)**: Bertugas melakukan pembekuan darah pas kita terluka supaya darah gak terus-menerus mengucur.\n\nKeren kan armada sel darah kita? Mau tahu golongan darah atau cara kerja jantung?`
      };
    }

    if (clean.includes('jantung') || clean.includes('peredaran darah')) {
      return {
        text: `Jantung kita adalah pompa otot terhebat di dunia! Ukurannya cuma sebesar kepalan tangan, tapi berdetak sekitar 100.000 kali setiap hari tanpa henti. ❤️\n\nJantung manusia punya 4 ruang utama:\n1. **Serambi Kanan (Atrium Kanan)**: Menerima darah kaya CO₂ dari seluruh tubuh.\n2. **Bilik Kanan (Ventrikel Kanan)**: Memompa darah kotor ke paru-paru buat dibersihkan.\n3. **Serambi Kiri (Atrium Kiri)**: Menerima darah segar kaya oksigen dari paru-paru.\n4. **Bilik Kiri (Ventrikel Kiri)**: Bagian berdinding otot paling tebal, memompa darah kaya O₂ ke seluruh tubuh!\n\nMakanya rajin olahraga aerobik ya biar pompa jantungmu makin kuat dan sehat!`
      };
    }

    if (clean.includes('ginjal') || clean.includes('nefron') || clean.includes('urine') || clean.includes('kencing')) {
      return {
        text: `Ginjal kita berfungsi sebagai "pabrik penyaring racun" di tubuh! Di dalam ginjal ada sekitar satu juta unit penyaring mikro yang disebut **nefron**. 🫘\n\nProses pembuatan urine berlangsung lewat 3 tahapan:\n1. 💧 **Filtrasi (di Glomerulus)**: Darah disaring, menghasilkan urine primer yang masih mengandung air, glukosa, dan asam amino.\n2. 🔄 **Reabsorpsi (di Tubulus Proksimal)**: Zat-zat penting yang masih berguna (seperti glukosa dan garam) diserap kembali ke darah, menghasilkan urine sekunder.\n3. 📤 **Augmentasi (di Tubulus Distal)**: Penambahan sisa racun (seperti urea dan obat-obatan) membentuk urine sebenarnya yang siap dialirkan ke kandung kemih.\n\nMakanya banyak-banyak minum air putih ya biar ginjalmu gampang menyaring kotoran!`
      };
    }

    if (clean.includes('dna') || clean.includes('rna') || clean.includes('genetika') || clean.includes('kromosom')) {
      return {
        text: `**DNA (Deoxyribonucleic Acid)** itu ibarat "cetak biru / buku resep arsitektur" kehidupan kita! 🧬\n\n• Bentuknya berupa heliks ganda (*double helix*) yang tersusun dari pasangan basa nitrogen: **Adenin (A) berpasangan dengan Timin (T)**, dan **Guanin (G) berpasangan dengan Sitosin (C)**.\n• DNA menyimpan semua instruksi kode genetik: mulai dari warna matamu, bentuk rambut, sampai tinggi badanmu.\n• Sedangkan **RNA (Ribonucleic Acid)** bertindak sebagai kurir pengantar pesan yang menyalin instruksi DNA untuk membuat protein di ribosom.\n\nUnik kan? Setiap manusia di dunia punya susunan DNA yang khas dan tidak ada yang 100% sama persis (kecuali kembar identik)!`
      };
    }

    if (clean.includes('sel') && (clean.includes('mitokondria') || clean.includes('nukleus') || clean.includes('organel') || clean.includes('bagian sel'))) {
      return {
        text: `Sel adalah unit struktural dan fungsional terkecil dari semua makhluk hidup. Di dalam sel ada organel-organel kecil yang punya peran masing-masing layaknya pabrik:\n\n1. 🧠 **Nukleus (Inti Sel)**: Pusat kendali sel yang menyimpan DNA dan mengatur seluruh aktivitas sel.\n2. ⚡ **Mitokondria**: Dijuluki *powerhouse of cell*, tempat respirasi sel menghasilkan energi ATP untuk kita beraktivitas.\n3. 🏭 **Ribosom**: Tempat perakitan protein berdasarkan kode genetik.\n4. 🛡️ **Membran Sel**: Pintu gerbang selektif yang mengatur zat apa saja yang boleh keluar-masuk sel.\n\nTubuh kita terdiri dari triliunan sel yang bekerja sama setiap detik lho! Keren banget kan?`
      };
    }

    if (clean.includes('bernapas') || clean.includes('pernapasan') || clean.includes('paru-paru') || clean.includes('alveolus')) {
      return {
        text: `Bernapas itu proses pengambilan oksigen (O₂) dan pengeluaran karbon dioksida (CO₂) oleh sistem pernapasan kita 🫁\n\n1. 👃 **Hidung**: Udara disaring oleh bulu hidung, dihangatkan, dan dilembapkan oleh selaput lendir.\n2. 🌬️ **Trakea & Bronkus**: Udara mengalir melalui tenggorokan menuju cabang paru-paru.\n3. 🍇 **Alveolus**: Di kantung udara mikro yang mirip buah anggur ini, terjadi pertukaran gas secara difusi: oksigen masuk ke pembuluh darah dan CO₂ dilepaskan ke udara hembusan.\n\nOksigen itu krusial banget dipakai sel-sel tubuh membakar glukosa jadi energi gerak dan berpikir kita sehari-hari lho!`
      };
    }

    // B. Kimia & Fisika
    if (clean.includes('atom') || clean.includes('proton') || clean.includes('elektron') || clean.includes('neutron')) {
      return {
        text: `**Atom** adalah blok penyusun dasar semua materi di alam semesta! Mejamu, buku pelajaranmu, bahkan udara yang kamu hirup tersusun dari atom. ⚛️\n\nStruktur atom terdiri dari:\n1. 🔴 **Inti Atom (Nukleus)**: Di bagian pusat, terdiri dari **Proton** (bermuatan positif) dan **Neutron** (netral tanpa muatan).\n2. 🔵 **Awan Elektron**: Partikel super ringan bermuatan negatif yang berputar mengelilingi inti atom pada lintasan energi tertentu.\n\n*Fun fact:* Lebih dari 99,99% bagian dari sebuah atom sebenarnya adalah ruang kosong lho! Mau tahu cara atom saling berikatan membentuk molekul?`
      };
    }

    if (clean.includes('asam basa') || clean.includes('ph')) {
      return {
        text: `Di kimia, sifat larutan dibedakan dari derajat keasamannya (skala **pH 0 sampai 14**) kawan 🧪:\n\n• **Asam (pH < 7)**: Rasanya masam, memerahkan kertas lakmus biru, menghasilkan ion H⁺ di air. Contoh: air lemon, cuka, dan asam lambung (HCl).\n• **Netral (pH = 7)**: Tidak asam dan tidak basa. Contohnya air murni (H₂O).\n• **Basa (pH > 7)**: Rasanya agak pahit dan licin di kulit, membirukan lakmus merah, menghasilkan ion OH⁻. Contoh: sabun, deterjen, dan obat maag antasida.\n\nObat maag itu sifatnya basa lho, makanya pas kamu minum, dia langsung menetralkan asam lambung berlebih di perut!`
      };
    }

    if (clean.includes('ngerem') || clean.includes('kedorong') || clean.includes('rem mendadak') || clean.includes('tersentak')) {
      return {
        text: `Pernah naik mobil atau bus, terus pas sopirnya ngerem mendadak tubuhmu langsung tersentak ke depan? 🚗💨\n\nNah, di fisika fenomena ini adalah bukti nyata dari **Hukum I Newton (Prinsip Inersia / Kelembaman)**!\n\n• Tubuhmu aslinya sedang bergerak maju bersama mobil dengan kecepatan tertentu.\n• Saat mobil direm, rem menghentikan laju mobil, tapi tubuhmu punya kecenderungan alami untuk **mempertahankan gerak majunya**.\n• Itulah kenapa tubuhmu terdorong ke depan sampai sabuk pengaman menahanmu!\n\nMakanya sabuk pengaman (*seatbelt*) itu wajib banget dipakai demi keamanan kita ya kawan!`
      };
    }

    // C. Matematika: Aljabar, Limit, Turunan
    if (clean.includes('turunan') || clean.includes('diferensial')) {
      return {
        text: `**Turunan (Diferensial)** dalam kalkulus itu intinya mengukur **laju perubahan sesaat** kawan! 📈\n\n**Analogi gampangnya**:\nKalau kamu lagi naik motor, jarak yang kamu tempuh dibagi total waktu perjalanan itu kecepatan rata-rata. Tapi angka yang ditunjukkan jarum spidometer pas DETIK INI JUGA—itulah turunan pertama dari fungsi posisi terhadap waktu!\n\n**Aturan dasarnya super simpel**:\nJika **f(x) = a · xⁿ**, maka turunannya adalah **f’(x) = a · n · xⁿ⁻¹**\n*Contoh*: Turunan dari f(x) = 5x³ adalah f’(x) = 5 × 3 × x² = **15x²**.\n\nGampang kan pola rumusnya? Mau coba hitung turunan fungsi lainnya bareng aku?`
      };
    }

    if (clean.includes('integral')) {
      return {
        text: `Kalau turunan itu proses 'memecah' laju perubahan, maka **Integral** adalah kebalikannya alias **anti-turunan (menjumlahkan)**! 📐\n\nFungsi utama integral:\n1. Menghitung akumulasi total nilai.\n2. Menghitung luas bidang datar di bawah kurva yang bentuknya meliuk-liuk dan gak beraturan.\n3. Menghitung volume benda putar 3 dimensi.\n\n**Rumus dasar integral tak tentu**:\n∫ xⁿ dx = **(1 / (n + 1)) · xⁿ⁺¹ + C** (untuk n ≠ -1)\n*Contoh*: ∫ 3x² dx = (3/3) · x³ + C = **x³ + C**.\n\nKeren kan hubungan timbal balik kalkulus? Mau coba latihan soal integral?`
      };
    }

    return null;
  }

  /**
   * Safe parser untuk perhitungan matematika dasar
   */
  calculateMath(text) {
    const cleanMath = text.replace(/[\?\.!]/g, '').replace(/^(berapa|hitung|tolong hitung|hasil dari|nilai dari|coba hitung)\s+/i, '').trim();

    // Cek akar kuadrat
    const sqrtMatch = cleanMath.match(/^akar\s+(?:kuadrat\s+dari\s+)?([0-9.]+)/i);
    if (sqrtMatch) {
      const val = parseFloat(sqrtMatch[1]);
      const res = Math.sqrt(val);
      return `Hasil dari **√${val}** adalah **${Number.isInteger(res) ? res : res.toFixed(4)}**.`;
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

  /**
   * RESPON FALLBACK CERDAS TEMAN BELAJAR
   * Mengurai pertanyaan pengguna secara analitis daripada menolak atau memberikan template hampa.
   */
  generateFriendlySmartFallback(rawQuery, cleanQuery, meaningfulTokens, activeModule) {
    if (activeModule) {
      return {
        text: `Pertanyaan kamu tentang **"${rawQuery}"** seru banget buat kita diskusikan! 💡\n\nKalau kita kaitkan dengan mata pelajaran **${activeModule.fullName}**, pembahasan seputar hal ini berhubungan erat dengan konsep dasar yang dipelajari pada modul ini. Kamu bisa tanyakan bagian yang lebih spesifik (misalnya fungsinya, cara kerjanya, atau contoh nyatanya), atau klik tombol **Rangkum** di bawah untuk intisari lengkapnya!\n\nKira-kira ada bagian tertentu yang mau kita bedah lebih dulu kawan?`,
        source: `Konteks Belajar: ${activeModule.shortName}`,
        suggestions: activeModule.quickPrompts ? activeModule.quickPrompts.slice(0, 3) : ['Rangkum materi ini', 'Tips belajar fokus', 'Generator kuis']
      };
    } else {
      return {
        text: `Pertanyaan yang menarik banget kawan! Mengenai **"${rawQuery}"**, topik ini seru banget untuk dipelajari lebih dalam. 🌟\n\nAgar aku bisa memberikan penjelasan yang lebih presisi dengan rujukan bab dan nomor halaman buku resmi, yuk unggah file modul materi (.txt / .pdf) di sidebar kiri atau klik tombol **"Muat Bahan P13"**!\n\nSelain itu, kamu juga bebas nanya apa saja ke aku—mulai dari sains seru, matematika, tips belajar santai, sampai ngobrol santai bareng Boni! Mau bahas apa lagi nih?`,
        source: null,
        suggestions: ['Muat Bahan P13', 'Bagaimana proses hujan?', 'Tips belajar efektif']
      };
    }
  }

  isSummaryIntent(query) {
    const summaryKeywords = ['rangkum', 'ringkas', 'kesimpulan', 'summary', 'garis besar', 'intisari', 'rangkuman', 'rangkumin'];
    return summaryKeywords.some(k => query.includes(k));
  }

  isQuizIntent(query) {
    if (query.includes('fotosintesis') || query.includes('sintesis')) return false;
    return /\b(kuis|soal|latihan|ujian|evaluasi|tes)\b/i.test(query) ||
           query.includes('buatkan kuis') || query.includes('bikin kuis');
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
      text: `Nih, aku sudah susun **ringkasan intisari** materi **${mod.fullName}** buat kamu! 📝✨\n\n${mod.summary || 'Modul ini memuat pembahasan komprehensif mengenai konsep fundamental dan aplikasi praktis mata pelajaran.'}\n\n**Daftar Bab Pembelajaran:**\n${babList || '• Bab pembelajaran lengkap'}\n\n*Tip dari Boni: Kamu bisa pilih salah satu bab di atas untuk kita kupas detailnya, atau langsung uji pemahamanmu di tab Generator Kuis!*`,
      source: `Rujukan Resmi: ${mod.shortName} - Halaman 1 s/d ${mod.totalHal || 36}`,
      suggestions: mod.quickPrompts ? mod.quickPrompts.slice(0, 3) : ['Jelaskan bab penting', 'Buka Generator Kuis']
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
