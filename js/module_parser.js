/**
 * MODULE PARSER & UPLOAD HANDLER
 * Membaca dan memproses file modul yang di-upload oleh pengguna (.txt, .pdf, .md)
 * secara 100% offline langsung di browser.
 */

class ModuleParser {
  constructor(referenceLibrary = []) {
    this.referenceLibrary = referenceLibrary;
  }

  async parseFiles(fileList) {
    const parsedModules = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const mod = await this.parseSingleFile(file);
        if (mod) {
          parsedModules.push(mod);
        }
      } catch (err) {
        console.error('Gagal memproses file:', file.name, err);
      }
    }

    return parsedModules;
  }

  async parseSingleFile(file) {
    const filename = file.name;
    const lowerName = filename.toLowerCase();

    let textContent = '';
    if (lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
      textContent = await this.readTextFile(file);
    } else if (lowerName.endsWith('.pdf')) {
      textContent = await this.extractPdfText(file);
    }

    // 1. Cek kecocokan dengan pustaka referensi Bahan Latihan P13
    const matchedRef = this.findReferenceMatch(filename);
    if (matchedRef) {
      const cloned = JSON.parse(JSON.stringify(matchedRef));
      if (textContent) {
        cloned.content = textContent;
        cloned.lines = textContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        // Tambahkan QA pairs hasil ekstraksi teks dokumen
        const extraQA = this.generateAutoQAPairs(cloned.shortName, cloned.lines);
        if (extraQA.length > 0) {
          cloned.qaPairs = [...(cloned.qaPairs || []), ...extraQA];
        }
        cloned.chunks = this.createChunks(textContent, cloned.shortName, cloned.chapters);
      }
      return cloned;
    }

    // 2. Jika file kustom .txt, .md, atau .pdf
    if (textContent) {
      return this.buildModuleFromText(filename, textContent);
    }

    return null;
  }

  findReferenceMatch(filename) {
    const clean = filename.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const ref of this.referenceLibrary) {
      const refId = ref.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const refSubj = ref.subject.toLowerCase();
      const refShort = ref.shortName.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (clean.includes(refId) || clean.includes(refShort) || clean.includes(refSubj)) {
        return ref;
      }
    }
    return null;
  }

  readTextFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file, 'utf-8');
    });
  }

  async extractPdfText(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        try {
          const bytes = new Uint8Array(buffer);
          let str = '';
          for (let i = 0; i < Math.min(bytes.length, 500000); i++) {
            const charCode = bytes[i];
            if (charCode >= 32 && charCode <= 126) {
              str += String.fromCharCode(charCode);
            } else if (charCode === 10 || charCode === 13) {
              str += '\n';
            }
          }
          resolve(str);
        } catch (err) {
          resolve('');
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsArrayBuffer(file);
    });
  }

  buildModuleFromText(filename, fullText) {
    const lines = fullText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const title = lines[0] || filename.replace(/\.[^/.]+$/, '');
    const subject = this.detectSubject(filename, fullText);
    const chapters = this.extractChapters(lines);

    const baseName = filename.replace(/\.[^/.]+$/, '');
    const shortName = baseName.length > 18 ? baseName.slice(0, 15) + '...' : baseName;

    // Generate QA pairs otomatis dari kalimat-kalimat penting
    const qaPairs = this.generateAutoQAPairs(shortName, lines);
    const quizQuestions = this.generateAutoQuiz(lines, subject);
    const chunks = this.createChunks(fullText, shortName, chapters);

    return {
      id: 'mod_' + Math.random().toString(36).substr(2, 8),
      code: 'MOD-CUSTOM',
      shortName: shortName,
      fullName: title.length > 50 ? title.slice(0, 50) + '...' : title,
      subject: subject,
      totalHal: Math.max(1, Math.ceil(lines.length / 30)),
      icon: '📘',
      summary: lines.slice(0, 4).join(' '),
      content: fullText,
      lines: lines,
      chunks: chunks,
      chapters: chapters.length > 0 ? chapters : [{ bab: 1, judul: 'Materi Inti', hal: '1 - 5' }],
      qaPairs: qaPairs,
      quickPrompts: [
        `Rangkum ${shortName}`,
        `Jelaskan poin penting dalam materi ini!`,
        `Buatkan kuis untuk materi ini`,
        `Buatkan 3 flashcard tentang materi ini`
      ],
      quizQuestions: quizQuestions
    };
  }

  createChunks(fullText, shortName, chapters = []) {
    if (!fullText) return [];
    const paragraphs = fullText.split(/\r?\n\s*\r?\n/).map(p => p.trim()).filter(p => p.length > 20);
    const chunks = [];
    let currentChapter = chapters && chapters.length > 0 ? chapters[0].judul : 'Materi Pembelajaran';

    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      // Periksa apakah paragraf ini adalah judul bab baru
      const matchedChapter = (chapters || []).find(ch => p.toLowerCase().includes(ch.judul.toLowerCase().slice(0, 20)));
      if (matchedChapter) {
        currentChapter = matchedChapter.judul;
      }

      chunks.push({
        id: `chunk_${i + 1}`,
        text: p,
        chapter: currentChapter,
        source: `Sumber: ${shortName} • ${currentChapter}`
      });
    }

    // Jika paragraf sedikit (dokumen pendek/tanpa jeda paragraf), buat chunk per kelompok baris
    if (chunks.length <= 1) {
      const lines = fullText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      const groupSize = 4;
      for (let i = 0; i < lines.length; i += groupSize) {
        const slice = lines.slice(i, i + groupSize);
        chunks.push({
          id: `chunk_line_${i + 1}`,
          text: slice.join(' '),
          chapter: currentChapter,
          source: `Sumber: ${shortName} • Baris ${i + 1}–${Math.min(i + groupSize, lines.length)}`
        });
      }
    }

    return chunks;
  }

  detectSubject(filename, text) {
    const lower = (filename + ' ' + text).toLowerCase();
    if (lower.includes('biologi') || lower.includes('pencernaan') || lower.includes('sel') || lower.includes('organ')) return 'Biologi';
    if (lower.includes('sejarah') || lower.includes('proklamasi') || lower.includes('kemerdekaan')) return 'Sejarah';
    if (lower.includes('fisika') || lower.includes('newton') || lower.includes('gaya') || lower.includes('energi')) return 'Fisika';
    if (lower.includes('kimia') || lower.includes('reaksi') || lower.includes('entalpi') || lower.includes('termokimia')) return 'Kimia';
    if (lower.includes('matematika') || lower.includes('kalkulus') || lower.includes('integral') || lower.includes('turunan')) return 'Matematika';
    if (lower.includes('sosiologi') || lower.includes('sosial') || lower.includes('konflik') || lower.includes('struktur')) return 'Sosiologi';
    if (lower.includes('geografi') || lower.includes('bumi') || lower.includes('lempeng') || lower.includes('litosfer')) return 'Geografi';
    if (lower.includes('ekonomi') || lower.includes('bank') || lower.includes('uang') || lower.includes('inflasi')) return 'Ekonomi';
    if (lower.includes('informatika') || lower.includes('komputer') || lower.includes('jaringan') || lower.includes('cpu')) return 'Informatika';
    if (lower.includes('indonesia') || lower.includes('sastra') || lower.includes('karya ilmiah') || lower.includes('eksposisi')) return 'Bahasa Indonesia';
    return 'Umum';
  }

  extractChapters(lines) {
    const chapters = [];
    let count = 1;

    for (const line of lines) {
      if (/^(bab\s+\d+|[0-9]+\.\s+[A-Z]|pasal\s+\d+|bagian\s+\d+)/i.test(line)) {
        chapters.push({
          bab: count,
          judul: line.slice(0, 70),
          hal: `${count * 4 - 3} - ${count * 4}`
        });
        count++;
        if (count > 8) break;
      }
    }
    return chapters;
  }

  generateAutoQAPairs(shortName, lines) {
    const pairs = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Format 1: Bagian dengan titik dua "Istilah: Definisi"
      if (line.includes(':') && line.length > 25 && line.length < 500) {
        const parts = line.split(':');
        const term = parts[0].replace(/^[0-9a-zA-Z\.\-\s]+/, '').trim();
        if (term.length >= 3) {
          pairs.push({
            keywords: [term.toLowerCase(), ...term.toLowerCase().split(/\s+/)].filter(w => w.length > 2),
            answer: line,
            source: `Sumber: ${shortName} - Baris ${i + 1}`
          });
        }
      }
      // Format 2: Kalimat definisi dengan kata "adalah", "merupakan", "berfungsi", "terdiri dari"
      else if (
        /\b(adalah|merupakan|berfungsi|terdiri dari|didefinisikan)\b/i.test(line) &&
        line.length > 30 && line.length < 400
      ) {
        const words = line.split(/\s+/).slice(0, 6);
        pairs.push({
          keywords: words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(w => w.length > 2),
          answer: line,
          source: `Sumber: ${shortName} - Teks Dokumen`
        });
      }

      if (pairs.length >= 40) break;
    }
    return pairs;
  }

  generateAutoQuiz(lines, subject) {
    return [
      {
        id: 'auto_q1',
        bab: 1,
        hal: 2,
        difficulty: 'Mudah',
        question: `Berdasarkan isi dokumen materi ${subject}, manakah pernyataan yang paling tepat menggambarkan topik inti?`,
        options: [
          lines[0] || 'Prinsip dasar materi',
          'Konsep sekunder tanpa aplikasi',
          'Penyimpangan data observasi',
          'Teori umum tanpa kesimpulan'
        ],
        correct: 0,
        explanation: 'Pilihan ini mencerminkan rumusan konsep pokok yang diuraikan di awal bab.'
      },
      {
        id: 'auto_q2',
        bab: 1,
        hal: 4,
        difficulty: 'Sedang',
        question: 'Tujuan utama dari pengujian materi pada modul ini adalah untuk...',
        options: [
          'Memvalidasi pemahaman konsep secara komprehensif',
          'Menghilangkan keterkaitan antar variabel',
          'Mengabaikan rujukan pustaka ilmiah',
          'Mempersingkat durasi belajar tanpa evaluasi'
        ],
        correct: 0,
        explanation: 'Evaluasi berkala ditujukan untuk mengukur dan memperkuat penguasaan materi secara menyeluruh.'
      }
    ];
  }
}

if (typeof window !== 'undefined') {
  window.ModuleParser = ModuleParser;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModuleParser };
}
