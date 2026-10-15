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

    // 1. Cek kecocokan dengan pustaka referensi Bahan Latihan P13
    const matchedRef = this.findReferenceMatch(filename);
    if (matchedRef) {
      // Salin object agar independen
      return JSON.parse(JSON.stringify(matchedRef));
    }

    // 2. Jika file kustom .txt atau .md
    if (lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
      const text = await this.readTextFile(file);
      return this.buildModuleFromText(filename, text);
    }

    // 3. Jika file .pdf kustom
    if (lowerName.endsWith('.pdf')) {
      const text = await this.extractPdfText(file);
      return this.buildModuleFromText(filename, text || 'Dokumen Modul PDF');
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
        // Ekstraksi string teks dasar dari buffer biner PDF
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

    return {
      id: 'mod_' + Math.random().toString(36).substr(2, 8),
      code: 'MOD-CUSTOM',
      shortName: shortName,
      fullName: title.length > 50 ? title.slice(0, 50) + '...' : title,
      subject: subject,
      totalHal: Math.max(1, Math.ceil(lines.length / 30)),
      icon: '📘',
      summary: lines.slice(0, 4).join(' '),
      chapters: chapters.length > 0 ? chapters : [{ bab: 1, judul: 'Materi Inti', hal: '1 - 5' }],
      qaPairs: qaPairs,
      quickPrompts: [
        `Rangkum ${shortName}`,
        `Jelaskan poin penting dalam materi ini!`,
        `Buat kuis untuk materi ini`
      ],
      quizQuestions: quizQuestions
    };
  }

  detectSubject(filename, text) {
    const lower = (filename + ' ' + text).toLowerCase();
    if (lower.includes('biologi') || lower.includes('pencernaan') || lower.includes('sel')) return 'Biologi';
    if (lower.includes('sejarah') || lower.includes('proklamasi') || lower.includes('kemerdekaan')) return 'Sejarah';
    if (lower.includes('fisika') || lower.includes('newton') || lower.includes('gaya')) return 'Fisika';
    if (lower.includes('kimia') || lower.includes('reaksi') || lower.includes('entalpi')) return 'Kimia';
    if (lower.includes('matematika') || lower.includes('kalkulus') || lower.includes('integral')) return 'Matematika';
    if (lower.includes('sosiologi') || lower.includes('sosial') || lower.includes('konflik')) return 'Sosiologi';
    if (lower.includes('geografi') || lower.includes('bumi') || lower.includes('lempeng')) return 'Geografi';
    if (lower.includes('ekonomi') || lower.includes('bank') || lower.includes('uang')) return 'Ekonomi';
    if (lower.includes('informatika') || lower.includes('komputer') || lower.includes('jaringan')) return 'Informatika';
    if (lower.includes('indonesia') || lower.includes('sastra') || lower.includes('karya ilmiah')) return 'Bahasa Indonesia';
    return 'Umum';
  }

  extractChapters(lines) {
    const chapters = [];
    let count = 1;

    for (const line of lines) {
      if (/^(bab\s+\d+|[0-9]+\.\s+[A-Z])/i.test(line)) {
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
    for (let i = 0; i < Math.min(lines.length, 25); i++) {
      const line = lines[i];
      if (line.includes(':') && line.length > 30) {
        const parts = line.split(':');
        pairs.push({
          keywords: parts[0].toLowerCase().split(/\s+/),
          answer: line,
          source: `Sumber: ${shortName} - Bab 1`
        });
      }
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
