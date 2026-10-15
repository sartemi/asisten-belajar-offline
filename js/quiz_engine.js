/**
 * QUIZ GENERATOR ENGINE OFFLINE
 * Generator kuis interaktif dengan penentuan pengaturan:
 * - Jumlah soal (3, 5, 10, 15)
 * - Tipe soal: Pilihan Ganda (MC), Soal Uraian (Essay), atau Campuran
 * - Tingkat kesulitan: Mudah, Sedang, Sulit, atau Campuran
 * - Filter bab/cakupan materi
 * - Mode latihan interaktif (umpan balik instan sesuai foto Gambar 2) vs Ujian
 */

class OfflineQuizEngine {
  constructor(modulesData) {
    this.modules = modulesData;
    this.currentQuiz = null;
    this.currentIndex = 0;
    this.userAnswers = {};
    this.mode = 'practice'; // 'practice' (instant feedback) or 'exam'
    this.startTime = null;
  }

  generateQuiz(moduleId, options = {}) {
    const mod = this.modules.find(m => m.id === moduleId) || this.modules[0];
    if (!mod || !mod.quizQuestions) return null;

    let pool = [...mod.quizQuestions];

    // 1. Filter Tipe Soal (Pilihan Ganda, Uraian, atau Campuran)
    const selectedType = options.type || 'all';
    if (selectedType === 'mc') {
      pool = pool.filter(q => q.type !== 'essay');
    } else if (selectedType === 'essay') {
      pool = pool.filter(q => q.type === 'essay');
    }

    // 2. Filter Tingkat Kesulitan
    if (options.difficulty && options.difficulty !== 'all') {
      const filteredByDiff = pool.filter(q => q.difficulty && q.difficulty.toLowerCase() === options.difficulty.toLowerCase());
      if (filteredByDiff.length > 0) pool = filteredByDiff;
    }

    // 3. Filter Bab jika dipilih
    if (options.chapter && options.chapter !== 'all') {
      const babNum = parseInt(options.chapter);
      const filteredByBab = pool.filter(q => q.bab === babNum);
      if (filteredByBab.length > 0) pool = filteredByBab;
    }

    // Acak urutan pertanyaan
    pool.sort(() => Math.random() - 0.5);

    // Limit jumlah soal
    const count = options.count ? Math.min(parseInt(options.count), pool.length) : Math.min(5, pool.length);
    const selectedQuestions = pool.slice(0, Math.max(1, count));

    this.currentQuiz = {
      module: mod,
      questions: selectedQuestions,
      total: selectedQuestions.length,
      mode: options.mode || 'practice',
      type: selectedType
    };
    this.currentIndex = 0;
    this.userAnswers = {};
    this.startTime = new Date();

    return this.currentQuiz;
  }

  getCurrentQuestion() {
    if (!this.currentQuiz || !this.currentQuiz.questions[this.currentIndex]) return null;
    const q = this.currentQuiz.questions[this.currentIndex];
    const isEssay = q.type === 'essay';

    return {
      index: this.currentIndex,
      total: this.currentQuiz.total,
      data: q,
      isEssay: isEssay,
      userAnswer: this.userAnswers[this.currentIndex],
      isLast: this.currentIndex === this.currentQuiz.total - 1,
      isFirst: this.currentIndex === 0,
      stats: this.getStatsSoFar()
    };
  }

  getStatsSoFar() {
    let answered = 0;
    let correct = 0;
    if (this.currentQuiz) {
      this.currentQuiz.questions.forEach((_, idx) => {
        const ans = this.userAnswers[idx];
        if (ans) {
          answered++;
          if (ans.isCorrect) correct++;
        }
      });
    }
    return {
      answered: answered,
      correct: correct,
      scoreText: `Skor: ${correct}/${answered}`
    };
  }

  submitAnswer(questionIndex, optionIndex) {
    if (!this.currentQuiz) return null;
    const q = this.currentQuiz.questions[questionIndex];
    if (!q) return null;

    const isCorrect = optionIndex === q.correct;
    this.userAnswers[questionIndex] = {
      type: 'mc',
      selected: optionIndex,
      isCorrect: isCorrect,
      correctIndex: q.correct,
      correctText: q.options[q.correct],
      explanation: q.explanation,
      citation: `Sumber: ${this.currentQuiz.module.shortName} - Bab ${q.bab}, Hal. ${q.hal}`
    };

    return this.userAnswers[questionIndex];
  }

  submitEssayAnswer(questionIndex, studentText) {
    if (!this.currentQuiz) return null;
    const q = this.currentQuiz.questions[questionIndex];
    if (!q) return null;

    const textClean = (studentText || '').toLowerCase().trim();
    const keywords = q.keywords || [];
    let hits = 0;

    keywords.forEach(kw => {
      if (textClean.includes(kw.toLowerCase())) hits++;
    });

    const ratio = keywords.length > 0 ? hits / keywords.length : (textClean.length > 20 ? 1 : 0.5);
    const isCorrect = ratio >= 0.4 || (textClean.length >= 25 && hits >= 1);
    const scoreVal = ratio >= 0.7 ? 100 : (ratio >= 0.4 ? 75 : 45);

    let feedbackLabel = 'Perlu Pendalaman';
    if (scoreVal >= 85) feedbackLabel = 'Jawaban Sangat Tepat & Lengkap!';
    else if (scoreVal >= 60) feedbackLabel = 'Jawaban Cukup Baik & Mengena.';

    this.userAnswers[questionIndex] = {
      type: 'essay',
      studentText: studentText,
      isCorrect: isCorrect,
      scoreValue: scoreVal,
      feedbackLabel: feedbackLabel,
      modelAnswer: q.modelAnswer || q.explanation,
      explanation: q.explanation,
      citation: q.citation || `Sumber: ${this.currentQuiz.module.shortName} - Bab ${q.bab}, Hal. ${q.hal}`
    };

    return this.userAnswers[questionIndex];
  }

  nextQuestion() {
    if (this.currentQuiz && this.currentIndex < this.currentQuiz.total - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  prevQuestion() {
    if (this.currentQuiz && this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }

  calculateResults() {
    if (!this.currentQuiz) return null;
    let correctCount = 0;
    const details = [];

    this.currentQuiz.questions.forEach((q, idx) => {
      const ans = this.userAnswers[idx];
      const isCorrect = ans ? ans.isCorrect : false;
      if (isCorrect) correctCount++;

      details.push({
        index: idx + 1,
        question: q.question,
        type: q.type || 'mc',
        options: q.options || [],
        correct: q.correct,
        selected: ans ? ans.selected : null,
        studentText: ans ? ans.studentText : null,
        modelAnswer: q.modelAnswer || null,
        isCorrect: isCorrect,
        explanation: q.explanation,
        citation: ans && ans.citation ? ans.citation : `Sumber: ${this.currentQuiz.module.shortName} - Bab ${q.bab}, Hal. ${q.hal}`
      });
    });

    const total = this.currentQuiz.total;
    const score = Math.round((correctCount / total) * 100);

    let message = 'Terus berlatih untuk memperdalam pemahaman konsep materi!';
    let badge = 'Perlu Review';
    if (score >= 85) {
      message = 'Luar biasa! Penguasaan materi kamu sangat komprehensif dan matang!';
      badge = 'Sangat Menguasai';
    } else if (score >= 60) {
      message = 'Bagus! Kamu sudah memahami konsep-konsep kunci dengan baik.';
      badge = 'Pemahaman Baik';
    }

    return {
      moduleName: this.currentQuiz.module.fullName,
      totalQuestions: total,
      correctCount: correctCount,
      incorrectCount: total - correctCount,
      score: score,
      badge: badge,
      message: message,
      details: details
    };
  }
}

if (typeof window !== 'undefined') {
  window.OfflineQuizEngine = OfflineQuizEngine;
} else if (typeof globalThis !== 'undefined') {
  globalThis.OfflineQuizEngine = OfflineQuizEngine;
}
