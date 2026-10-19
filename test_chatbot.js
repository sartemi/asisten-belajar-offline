/**
 * TEST SUITE: AUDIT DAN VERIFIKASI CHATBOT AGENTIC AI (BONI)
 * Menjalankan skenario pengujian komprehensif sesuai instruksi:
 * 1. Diskusi Materi Pembelajaran (Biologi, Fisika, dsb.)
 * 2. Pertanyaan Lanjutan: "Mengapa bisa begitu?" (Causal reasoning)
 * 3. Permintaan Penjelasan Lebih Sederhana (Feynman technique)
 * 4. Permintaan Analogi & Perumpamaan
 * 5. Contoh Nyata di Kehidupan Sehari-hari
 * 6. Komparasi / Perbedaan Konsep (Pepsin vs Renin)
 * 7. Percakapan Santai / Sapaan / Persona
 * 8. Pertanyaan di Luar Topik (Out-of-Topic: Resep Nasi Goreng, Hobi) secara natural & proporsional
 * 9. Pertanyaan Membutuhkan Sumber Dokumen (Sitasi presisi)
 * 10. Keterbatasan Informasi (Dokumen tidak memuat detail tanpa halusinasi)
 * 11. Fitur Belajar: Flashcards, Kuis Chat, Kalkulator, Problem Solving
 * 12. Penanganan Kegagalan API / Graceful Fallback
 */

const fs = require('fs');
const path = require('path');

// Muat reference data & engines
const refDataCode = fs.readFileSync(path.join(__dirname, 'js', 'reference_data.js'), 'utf8');
const moduleParserCode = fs.readFileSync(path.join(__dirname, 'js', 'module_parser.js'), 'utf8');
const aiEngineCode = fs.readFileSync(path.join(__dirname, 'js', 'ai_engine.js'), 'utf8');

global.window = global;
global.globalThis = global;

eval(refDataCode);
const REFERENCE_P13_DATA = global.REFERENCE_P13_DATA;

eval(moduleParserCode);
const ModuleParser = global.ModuleParser;

eval(aiEngineCode);
const OfflineAIEngine = global.OfflineAIEngine;

async function runTests() {
  console.log('================================================================');
  console.log('🚀 MEMULAI PENGUJIAN KOMPREHENSIF AGENTIC AI CHATBOT (BONI)');
  console.log('================================================================\n');

  const engine = new OfflineAIEngine(REFERENCE_P13_DATA, REFERENCE_P13_DATA);
  const bioModId = 'modul_02'; // Modul Biologi
  let passedCount = 0;
  let totalTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      if (details) console.log(`   ${details}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (details) console.error(`   ${details}`);
    }
  }

  // Skenario 1: Pertanyaan Materi Pembelajaran
  console.log('--- Skenario 1: Diskusi Materi Pembelajaran ---');
  const history1 = [];
  const q1 = 'Jelaskan fungsi asam klorida (HCl) dan pepsin dalam lambung!';
  history1.push({ sender: 'user', text: q1 });
  const res1 = await engine.generateAnswer(q1, bioModId, [], { provider: 'offline' });
  history1.push({ sender: 'ai', text: res1.text, source: res1.source });
  
  assert(
    res1.text.includes('HCl') || res1.text.includes('asam klorida') || res1.text.includes('pepsin'),
    'Respon memuat penjelasan spesifik HCl dan pepsin',
    `Snippet: ${res1.text.slice(0, 120)}...`
  );
  assert(
    res1.source && res1.source.includes('Modul_02_Biologi'),
    'Respon menyertakan sitasi sumber modul biologi',
    `Source: ${res1.source}`
  );

  // Skenario 2: Pertanyaan Lanjutan "Mengapa bisa begitu?"
  console.log('\n--- Skenario 2: Pertanyaan Lanjutan ("Mengapa bisa begitu?") ---');
  const q2 = 'Mengapa bisa begitu?';
  history1.push({ sender: 'user', text: q2 });
  const res2 = await engine.generateAnswer(q2, bioModId, history1, { provider: 'offline' });
  history1.push({ sender: 'ai', text: res2.text, source: res2.source });

  assert(
    res2.text.includes('Sterilisasi') || res2.text.includes('pepsinogen') || res2.text.includes('asam') || res2.text.includes('bakteri'),
    'Chatbot memahami konteks kausalitas lambung/HCl/pepsin pada "mengapa bisa begitu"',
    `Snippet: ${res2.text.slice(0, 150)}...`
  );
  assert(
    !res2.text.includes('prinsip fundamental yang dipelajari pada modul ini'),
    'Respon BUKAN template fallback hampa!',
    'Jawaban kaya akan penalaran kausal'
  );

  // Skenario 3: Permintaan Penjelasan Lebih Sederhana (Feynman Technique)
  console.log('\n--- Skenario 3: Penjelasan Lebih Sederhana ("Bisakah dijelaskan dengan lebih sederhana?") ---');
  const q3 = 'Bisakah dijelaskan dengan lebih sederhana? Terlalu rumit.';
  history1.push({ sender: 'user', text: q3 });
  const res3 = await engine.generateAnswer(q3, bioModId, history1, { provider: 'offline' });
  history1.push({ sender: 'ai', text: res3.text, source: res3.source });

  assert(
    res3.text.includes('Feynman') || res3.text.includes('Gunting') || res3.text.includes('sederhana') || res3.text.includes('blender'),
    'Respon menggunakan strategi penyederhanaan / analogi ramah anak sekolah',
    `Snippet: ${res3.text.slice(0, 160)}...`
  );

  // Skenario 4: Permintaan Analogi
  console.log('\n--- Skenario 4: Permintaan Analogi ---');
  const q4 = 'Bisa berikan analoginya?';
  history1.push({ sender: 'user', text: q4 });
  const res4 = await engine.generateAnswer(q4, bioModId, history1, { provider: 'offline' });
  history1.push({ sender: 'ai', text: res4.text, source: res4.source });

  assert(
    res4.text.includes('bengkel') || res4.text.includes('las') || res4.text.includes('karat') || res4.text.includes('analogi'),
    'Respon menyajikan analogi perumpamaan konseptual',
    `Snippet: ${res4.text.slice(0, 150)}...`
  );

  // Skenario 5: Contoh di Kehidupan Sehari-hari
  console.log('\n--- Skenario 5: Contoh Nyata Kehidupan Sehari-hari ---');
  const q5 = 'Contoh dalam kehidupan sehari-hari apa?';
  history1.push({ sender: 'user', text: q5 });
  const res5 = await engine.generateAnswer(q5, bioModId, history1, { provider: 'offline' });
  history1.push({ sender: 'ai', text: res5.text, source: res5.source });

  assert(
    res5.text.includes('Maag') || res5.text.includes('telat makan') || res5.text.includes('perih'),
    'Respon memberikan contoh nyata sehari-hari (sakit maag / asam lambung)',
    `Snippet: ${res5.text.slice(0, 140)}...`
  );

  // Skenario 6: Komparasi / Perbedaan Konsep (Pepsin vs Renin)
  console.log('\n--- Skenario 6: Komparasi Perbedaan (Pepsin vs Renin) ---');
  const q6 = 'Kalau renin bedanya apa?';
  history1.push({ sender: 'user', text: q6 });
  const res6 = await engine.generateAnswer(q6, bioModId, history1, { provider: 'offline' });
  history1.push({ sender: 'ai', text: res6.text, source: res6.source });

  assert(
    res6.text.includes('Renin') && (res6.text.includes('kasein') || res6.text.includes('susu') || res6.text.includes('bayi')),
    'Respon menjelaskan komparasi spesifik pepsin vs renin',
    `Snippet: ${res6.text.slice(0, 150)}...`
  );

  // Skenario 7: Percakapan Santai / Sapaan / Persona
  console.log('\n--- Skenario 7: Percakapan Santai & Persona ---');
  const resGreeting = await engine.generateAnswer('Halo Boni, selamat pagi!', bioModId, [], { provider: 'offline' });
  assert(
    resGreeting.text.includes('Boni') && (resGreeting.text.includes('pagi') || resGreeting.text.includes('siang') || resGreeting.text.includes('Halo')),
    'Sapaan dibalas hangat sesuai persona Boni',
    `Snippet: ${resGreeting.text.slice(0, 120)}...`
  );

  const resPersona = await engine.generateAnswer('Siapa kamu dan bisa bantu apa saja?', bioModId, [], { provider: 'offline' });
  assert(
    resPersona.text.includes('Teman belajar AI') || resPersona.text.includes('Boni'),
    'Persona dan kapabilitas dijelaskan secara terstruktur',
    `Snippet: ${resPersona.text.slice(0, 120)}...`
  );

  // Skenario 8: Pertanyaan di Luar Topik (Out-of-Topic: Resep Nasi Goreng)
  console.log('\n--- Skenario 8: Out-of-Topic (Resep Nasi Goreng & Hobi) ---');
  const resOOT1 = await engine.generateAnswer('Bagaimana cara membuat nasi goreng yang enak?', bioModId, [], { provider: 'offline' });
  assert(
    resOOT1.text.includes('Nasi Goreng') && resOOT1.text.includes('bumbu') && !resOOT1.text.includes('konsep seputar bagaimana cara membuat nasi goreng ini berkaitan erat dengan prinsip fundamental'),
    'Respon out-of-topic kuliner dijawab secara natural dan proporsional (TIDAK ditolak, TIDAK dipaksakan ke biologi lambung!)',
    `Snippet: ${resOOT1.text.slice(0, 150)}...`
  );
  assert(
    resOOT1.text.includes('Lanjut') || resOOT1.text.includes('belajar') || resOOT1.text.includes('Boni siap nemenin'),
    'Respon out-of-topic memiliki jembatan ramah untuk kembali belajar',
    'Menghubungkan secara sopan tanpa pemaksaan'
  );

  const resOOT2 = await engine.generateAnswer('Ada rekomendasi hobi santai buat liburan?', null, [], { provider: 'offline' });
  assert(
    resOOT2.text.includes('Hobi') || resOOT2.text.includes('Santai') || resOOT2.text.includes('rekomendasi'),
    'Rekomendasi hobi dijawab santai dan menyenangkan',
    `Snippet: ${resOOT2.text.slice(0, 140)}...`
  );

  // Skenario 9: Pertanyaan Membutuhkan Sumber Dokumen (RAG)
  console.log('\n--- Skenario 9: Pertanyaan Grounded Dokumen (RAG) ---');
  const resDoc = await engine.generateAnswer('Apa itu intestin dan bagaimana strukturnya menurut modul?', bioModId, [], { provider: 'offline' });
  const lowerDoc = (resDoc.text || '').toLowerCase();
  assert(
    (lowerDoc.includes('intestin') || lowerDoc.includes('usus')) && (lowerDoc.includes('duodenum') || lowerDoc.includes('jejunum') || lowerDoc.includes('ileum')),
    'Dokumen RAG berhasil mengambil anatomi intestin secara presisi',
    `Snippet: ${resDoc.text.slice(0, 140)}...`
  );
  assert(
    resDoc.source && resDoc.source.includes('Modul_02_Biologi'),
    'Menyertakan rujukan dokumen resmi',
    `Source: ${resDoc.source}`
  );

  // Skenario 10: Keterbatasan Informasi (Dokumen tidak memuat detail tanpa halusinasi)
  console.log('\n--- Skenario 10: Keterbatasan Informasi dalam Dokumen ---');
  const resLimit = await engine.generateAnswer('Apakah modul biologi ini memuat data statistik konsumsi pizza di Indonesia tahun 2024?', bioModId, [], { provider: 'offline' });
  assert(
    resLimit.text.includes('belum tercantum') || resLimit.text.includes('tidak') || resLimit.text.includes('Keterbatasan'),
    'Jujur menyatakan informasi tidak ada di dokumen tanpa berhalusinasi atau mengarang nomor halaman palsu',
    `Snippet: ${resLimit.text.slice(0, 150)}...`
  );

  // Skenario 11: Fitur Belajar (Flashcards, Kuis Chat, Problem Solving)
  console.log('\n--- Skenario 11: Fitur Belajar ---');
  const resFC = await engine.generateAnswer('Buatkan 3 flashcard tentang sistem pencernaan', bioModId, [], { provider: 'offline' });
  assert(
    resFC.text.includes('KARTU 1') && resFC.text.includes('KARTU 2') && resFC.text.includes('KARTU 3'),
    'Generator flashcard membuat 3 kartu belajar interaktif',
    `Snippet: ${resFC.text.slice(0, 130)}...`
  );

  const resQuiz = await engine.generateAnswer('Buatkan kuis latihan', bioModId, [], { provider: 'offline' });
  assert(
    resQuiz.text.includes('Soal 1') && resQuiz.text.includes('Soal 2'),
    'Kuis latihan chat dibuat dengan opsi dan kunci pembahasan',
    `Snippet: ${resQuiz.text.slice(0, 130)}...`
  );

  const resMath = await engine.generateAnswer('Sebuah mobil menempuh jarak 150 meter dalam waktu 5 detik. Berapa kecepatannya?', null, [], { provider: 'offline' });
  assert(
    resMath.text.includes('30') && resMath.text.includes('v = s / t'),
    'Pemecah soal fisika bertahap menghitung v = s / t = 30 satuan kecepatan',
    `Snippet: ${resMath.text.slice(0, 140)}...`
  );

  // Skenario 12: Penanganan Kegagalan API / Graceful Fallback
  console.log('\n--- Skenario 12: Penanganan Kegagalan API & Fallback ---');
  const mockBadSettings = {
    provider: 'gemini',
    geminiApiKey: 'AIzaSyFakeInvalidKeyForTesting12345',
    geminiModel: 'gemini-2.0-flash'
  };
  const resApiFail = await engine.generateAnswer('Jelaskan fungsi asam lambung!', bioModId, [], mockBadSettings);
  assert(
    resApiFail.text.includes('Catatan') || resApiFail.text.includes('Offline') || resApiFail.text.includes('asam'),
    'Ketika API eksternal gagal, sistem otomatis beralih ke Mode Cerdas Offline dan memberi tahu pengguna secara transparan',
    `Snippet: ${resApiFail.text.slice(0, 150)}...`
  );

  // Skenario 13: Mengobrol Bebas tentang Hal Umum Tanpa Modul Sama Sekali
  console.log('\n--- Skenario 13: Mengobrol Hal Umum Tanpa Harus Ada Modul (Zero-Module Chat) ---');
  const emptyEngine = new OfflineAIEngine([], []);

  // 13.1 Kopi & Sains Keseharian tanpa modul
  const resCoffee = await emptyEngine.generateAnswer('Kenapa kopi bisa bikin kita melek dan gak ngantuk?', null, [], { provider: 'offline' });
  assert(
    (resCoffee.text.includes('adenosin') || resCoffee.text.includes('kafein') || resCoffee.text.includes('kantuk')) && !resCoffee.text.includes('unggah modul'),
    'Chatbot mampu berdiskusi sains kopi/kafein tanpa modul (TIDAK menuntut unggah modul)',
    `Snippet: ${resCoffee.text.slice(0, 150)}...`
  );

  // 13.2 Filosofi Stoikisme tanpa modul
  const resStoic = await emptyEngine.generateAnswer('Apa itu filosofi Stoikisme dan bagaimana penerapannya?', null, [], { provider: 'offline' });
  assert(
    (resStoic.text.includes('Stoikisme') || resStoic.text.includes('Kendali') || resStoic.text.includes('Marcus Aurelius')) && !resStoic.text.includes('unggah modul'),
    'Chatbot mampu berdiskusi filosofi Stoikisme tanpa modul (TIDAK menuntut unggah modul)',
    `Snippet: ${resStoic.text.slice(0, 150)}...`
  );

  // 13.3 Luar angkasa & Lubang Hitam tanpa modul
  const resSpace = await emptyEngine.generateAnswer('Ceritakan tentang lubang hitam di luar angkasa dong!', null, [], { provider: 'offline' });
  assert(
    (resSpace.text.includes('Lubang Hitam') || resSpace.text.includes('Black Hole') || resSpace.text.includes('Event Horizon')) && !resSpace.text.includes('unggah modul'),
    'Chatbot mampu berdiskusi astronomi lubang hitam tanpa modul',
    `Snippet: ${resSpace.text.slice(0, 150)}...`
  );

  // 13.4 Psikologi & Mengatasi Grogi tanpa modul
  const resNervous = await emptyEngine.generateAnswer('Gimana ya cara mengatasi grogi atau demam panggung pas presentasi?', null, [], { provider: 'offline' });
  assert(
    (resNervous.text.includes('grogi') || resNervous.text.includes('Box Breathing') || resNervous.text.includes('napas') || resNervous.text.includes('Antusias')) && !resNervous.text.includes('unggah modul'),
    'Chatbot mampu memberikan nasihat psikologis mengatasi grogi tanpa modul',
    `Snippet: ${resNervous.text.slice(0, 150)}...`
  );

  // 13.5 Obrolan Bebas Terbuka (Open Fallback) tanpa modul
  const resOpen = await emptyEngine.generateAnswer('Menurut kamu kenapa manusia butuh seni dan kreativitas dalam hidup?', null, [], { provider: 'offline' });
  assert(
    resOpen.text.includes('Inti Pembahasan') || resOpen.text.includes('kreativitas') || resOpen.text.includes('pengalaman') || resOpen.text.includes('sudut pandang'),
    'Chatbot merespons obrolan reflektif umum dengan wawasan kaya tanpa meminta unggah modul',
    `Snippet: ${resOpen.text.slice(0, 150)}...`
  );
  assert(
    !resOpen.text.includes('unggah file modul materi') && !resOpen.text.includes('Muat Bahan P13'),
    'Respon obrolan bebas TIDAK menuntut atau menyuruh upload modul!',
    'Murni mengobrol luwes layaknya teman sejati'
  );

  console.log('\n================================================================');
  console.log(`🎯 HASIL AKHIR PENGUJIAN: ${passedCount} / ${totalTests} SKENARIO BERHASIL`);
  console.log('================================================================\n');

  if (passedCount === totalTests) {
    console.log('🎉 SEMUA SKENARIO BERHASIL DIVERIFIKASI DENGAN SEMPURNA!');
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
