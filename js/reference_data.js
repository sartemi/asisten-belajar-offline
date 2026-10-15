/**
 * DATA REFERENSI BAHAN LATIHAN P13
 * Tersimpan sebagai pustaka referensi untuk diimpor sesuai keinginan pengguna.
 * Awalnya daftar modul di aplikasi DIBUAT KOSONG (0 MODUL TERSEDIA).
 */

const REFERENCE_P13_DATA = [
  {
    id: 'modul_02',
    code: 'MOD-BIO-11-02',
    shortName: 'Modul_02_Biologi...',
    fullName: 'Modul 02: Biologi - Sistem Pencernaan dan Metabolisme',
    subject: 'Biologi',
    totalHal: 36,
    icon: '🧬',
    summary: 'Membahas arsitektur anatomi dan fisiologi saluran pencernaan manusia dari rongga mulut hingga rektum, sekresi enzim pencernaan lambung dan pankreas, absorpsi nutrisi pada vili usus halus, serta patofisiologi klinis seperti GERD, gastritis, dan malnutrisi.',
    chapters: [
      { bab: 1, judul: 'Gambaran Umum dan Arsitektur Makroskopis Saluran Pencernaan', hal: '1 - 4' },
      { bab: 2, judul: 'Pencernaan Mekanis dan Kimiawi di Rongga Mulut serta Faring', hal: '5 - 8' },
      { bab: 3, judul: 'Fisiologi Lambung: Asam Lambung (HCl), Enzim Pepsin, Renin, dan Mukus', hal: '9 - 14' },
      { bab: 4, judul: 'Pencernaan Duodenum dan Kontribusi Getah Pankreas serta Empedu Hati', hal: '15 - 18' },
      { bab: 5, judul: 'Penyerapan Nutrisi Makro dan Mikro pada Vili Usus Halus (Jejunum & Ileum)', hal: '19 - 22' },
      { bab: 6, judul: 'Kolon, Mikrobiota Usus Simbiotik, dan Mekanisme Defekasi', hal: '23 - 26' },
      { bab: 7, judul: 'Gangguan Klinis Sistem Pencernaan: Ulkus Peptikum, GERD, dan Malnutrisi', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['hcl', 'asam klorida', 'pepsin', 'fungsi hcl', 'fungsi pepsin'],
        answer: 'Asam klorida (HCl) diproduksi sel parietal lambung. Fungsinya: (1) mengaktifkan pepsinogen menjadi pepsin, (2) membunuh bakteri patogen, (3) menciptakan pH asam untuk kerja enzim. Pepsin sendiri berfungsi memecah protein menjadi polipeptida melalui hidrolisis ikatan peptida.',
        source: 'Sumber: Modul_02_Biologi... - Bab 3, Hal. 14'
      },
      {
        keywords: ['renin', 'beda renin', 'pepsin dan renin', 'kasein', 'protein susu'],
        answer: 'Renin dan pepsin sama-sama enzim pencerna protein di lambung, namun peran spesifiknya berbeda: (1) Enzim Renin secara khusus berfungsi mengendapkan protein susu (kasein) dari kaseinogen dengan bantuan ion kalsium, terutama banyak diproduksi pada masa bayi agar susu tidak terlalu cepat lewat di lambung; (2) Enzim Pepsin memecah rantai ikatan peptida protein umum menjadi pepton dan polipeptida sederhana dalam suasana asam lambung (pH 1,5 - 2,0).',
        source: 'Sumber: Modul_02_Biologi... - Bab 3, Hal. 11'
      },
      {
        keywords: ['ptialin', 'amilase', 'mulut', 'pencernaan mekanik', 'kimiawi mulut'],
        answer: 'Di rongga mulut terjadi dua jenis pencernaan: (1) Pencernaan mekanis oleh gigi (seri, taring, geraham) yang menghaluskan bolus; (2) Pencernaan kimiawi oleh enzim ptialin (amilase saliva) yang memecah amilum menjadi disakarida maltosa pada rentang pH mendekati netral.',
        source: 'Sumber: Modul_02_Biologi... - Bab 2, Hal. 6'
      },
      {
        keywords: ['duodenum', 'pankreas', 'empedu', 'tripsin', 'lipase'],
        answer: 'Duodenum (usus 12 jari) merupakan muara saluran empedu dan getah pankreas. Empedu hati berfungsi mengemulsi lemak. Pankreas menghasilkan amilase pankreas (mencerna amilum), tripsin (mencerna protein menjadi peptida sederhana), dan lipase pankreas (menghidrolisis lemak menjadi asam lemak dan gliserol).',
        source: 'Sumber: Modul_02_Biologi... - Bab 4, Hal. 16'
      },
      {
        keywords: ['gerd', 'gastritis', 'ulkus', 'lambung sakit', 'sembelit', 'gangguan pencernaan'],
        answer: 'Gangguan klinis pencernaan: (1) GERD: refluks asam lambung ke esofagus akibat kelemahan sfingter kardia esofagus; (2) Gastritis: inflamasi mukosa lambung akibat iritasi asam berlebih atau bakteri Helicobacter pylori; (3) Ulkus Peptikum: luka terbuka pada mukosa lambung/duodenum; (4) Konstipasi: kesulitan buang air besar akibat penyerapan air berlebihan di usus besar.',
        source: 'Sumber: Modul_02_Biologi... - Bab 7, Hal. 28'
      }
    ],
    quickPrompts: [
      'Jelaskan fungsi asam klorida (HCl) dan pepsin!',
      'Apa itu renin dan apa bedanya dengan pepsin?',
      'Bagaimana peran enzim di duodenum dan pankreas?',
      'Apa perbedaan pencernaan mekanik dan kimiawi?',
      'Rangkum Modul 02 Biologi'
    ],
    quizQuestions: [
      {
        id: 'bio_q1',
        bab: 3,
        hal: 14,
        difficulty: 'Sedang',
        question: 'Sel lambung manakah yang secara spesifik memproduksi asam klorida (HCl) guna mengaktifkan pepsinogen?',
        options: [
          'Sel Goblet',
          'Sel Parietal (Oksintik)',
          'Sel Zimogen (Chief Cell)',
          'Sel Enteroendokrin G'
        ],
        correct: 1,
        explanation: 'Asam klorida (HCl) disekresikan secara spesifik oleh sel parietal (oksintik) pada dinding lambung, sedangkan pepsinogen dihasilkan oleh chief cell (sel zimogen).'
      },
      {
        id: 'bio_q2',
        bab: 3,
        hal: 11,
        difficulty: 'Mudah',
        question: 'Enzim yang berperan khusus dalam mengendapkan kasein dari susu di dalam lambung adalah...',
        options: [
          'Ptialin',
          'Tripsin',
          'Renin',
          'Lipase'
        ],
        correct: 2,
        explanation: 'Enzim renin berfungsi mengkoagulasikan atau mengendapkan kasein (protein susu) menjadi parakasein dengan bantuan ion kalsium.'
      },
      {
        id: 'bio_q3',
        bab: 2,
        hal: 6,
        difficulty: 'Mudah',
        question: 'Enzim ptialin (amilase saliva) di rongga mulut bekerja optimal pada pemecahan zat makanan jenis...',
        options: [
          'Protein menjadi asam amino',
          'Amilum menjadi maltosa',
          'Lemak menjadi gliserol',
          'Asam nukleat menjadi nukleotida'
        ],
        correct: 1,
        explanation: 'Ptialin menghidrolisis ikatan alfa-1,4 glikosidik pada amilum (pati) menjadi disakarida sederhana maltosa.'
      },
      {
        id: 'bio_q4',
        bab: 4,
        hal: 16,
        difficulty: 'Sedang',
        question: 'Fungsi utama cairan empedu yang disekresikan oleh hati ke duodenum adalah...',
        options: [
          'Mengemulsi molekul lemak agar luas permukaannya meningkat',
          'Menguraikan peptida menjadi asam amino bebas',
          'Menetralkan asam nukleat dari lambung',
          'Membunuh bakteri patogen di ileum'
        ],
        correct: 0,
        explanation: 'Empedu bertindak sebagai deterjen biologis (emulsifier) untuk memecah globula lemak besar menjadi tetesan mikroskopis.'
      },
      {
        id: 'bio_q_gambar2',
        bab: 4,
        hal: 16,
        type: 'mc',
        difficulty: 'Sedang',
        question: 'Organ manakah yang menghasilkan enzim lipase, amilase, dan tripsin untuk pencernaan di usus halus?',
        options: [
          'Hati (hepar)',
          'Pankreas',
          'Lambung (gaster)',
          'Usus besar (kolon)'
        ],
        correct: 1,
        explanation: 'Pankreas menghasilkan getah pankreas yang kaya enzim pencernaan meliputi lipase pankreas (hidrolisis lemak), amilase pankreas (hidrolisis amilum), dan tripsinogen/tripsin (hidrolisis protein) yang disalurkan ke duodenum.'
      },
      {
        id: 'bio_essay_1',
        bab: 3,
        hal: 14,
        type: 'essay',
        difficulty: 'Sedang',
        question: 'Uraikan fungsi asam klorida (HCl) yang disekresikan oleh sel parietal dalam proses pencernaan lambung!',
        keywords: ['pepsinogen', 'pepsin', 'bakteri', 'patogen', 'asam', 'ph', 'protein'],
        modelAnswer: 'Asam klorida (HCl) disekresikan sel parietal lambung berfungsi: (1) Mengaktifkan pepsinogen menjadi enzim pepsin aktif, (2) Membunuh bakteri patogen dan mikroorganisme berbahaya yang masuk bersama makanan, (3) Menciptakan pH asam (1.5 - 2.0) yang optimal bagi kerja enzim lambung dan denaturasi protein.',
        explanation: 'HCl merupakan asam lambung utama yang menjaga keasaman lambung demi efektivitas enzim proteolitik pepsin serta proteksi imunologis terhadap mikroba patogen.',
        citation: 'Sumber: Modul_02_Biologi... - Bab 3, Hal. 14'
      },
      {
        id: 'bio_essay_2',
        bab: 3,
        hal: 11,
        type: 'essay',
        difficulty: 'Sedang',
        question: 'Jelaskan perbedaan mendasar antara fungsi enzim renin dan pepsin dalam lambung!',
        keywords: ['renin', 'pepsin', 'kasein', 'susu', 'pepton', 'protein', 'peptida'],
        modelAnswer: 'Enzim Renin berfungsi khusus mengendapkan atau menggumpalkan protein susu (kasein) dari kaseinogen dengan bantuan kalsium (terutama aktif pada bayi agar susu tidak terlalu cepat lewat). Sedangkan enzim Pepsin memecah ikatan peptida protein umum menjadi molekul pepton/polipeptida yang lebih sederhana.',
        explanation: 'Keduanya sama-sama mencerna protein namun memiliki target substrat dan mekanisme koagulasi vs proteolisis yang berbeda.',
        citation: 'Sumber: Modul_02_Biologi... - Bab 3, Hal. 11'
      }
    ]
  },
  {
    id: 'modul_01',
    code: 'MOD-SEJ-11-01',
    shortName: 'Modul_01_Sejarah...',
    fullName: 'Modul 01: Sejarah - Perjuangan Proklamasi Kemerdekaan Indonesia',
    subject: 'Sejarah',
    totalHal: 36,
    icon: '📜',
    summary: 'Membahas dinamika krusial peristiwa sekitar proklamasi kemerdekaan Republik Indonesia: menyerahnya Jepang pasca-Hiroshima Nagasaki, peristiwa Rengasdengklok, perumusan teks proklamasi di kediaman Maeda, pembacaan 17 Agustus 1945, hingga diplomasi kemerdekaan.',
    chapters: [
      { bab: 1, judul: 'Latar Belakang Geopolitik Pasifik & Menyerahnya Kekaisaran Jepang', hal: '1 - 4' },
      { bab: 2, judul: 'Polarisasi Persepsi Antargenerasi: Golongan Muda vs Golongan Tua', hal: '5 - 8' },
      { bab: 3, judul: 'Peristiwa Rengasdengklok: Pengamanan Soekarno-Hatta ke Karawang', hal: '9 - 14' },
      { bab: 4, judul: 'Perumusan Naskah Proklamasi di Rumah Laksamana Tadashi Maeda', hal: '15 - 18' },
      { bab: 5, judul: 'Kronologi Pembacaan Teks Proklamasi 17 Agustus 1945 di Pegangsaan Timur 56', hal: '19 - 22' },
      { bab: 6, judul: 'Penyebarluasan Berita Proklamasi Melalui Radio Domei dan Surat Kabar', hal: '23 - 26' },
      { bab: 7, judul: 'Awal Perjuangan Diplomasi Kedaulatan: Linggajati, Renville, dan KMB', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['rengasdengklok', 'tujuan rengasdengklok', 'pemuda rengasdengklok', 'sukarni'],
        answer: 'Peristiwa Rengasdengklok terjadi pada dini hari 16 Agustus 1945. Golongan pemuda (Chaerul Saleh, Sukarni, Wikana, Darwis) membawa Soekarno dan Hatta ke Rengasdengklok, Karawang. Tujuannya adalah mengamankan kedua pemimpin bangsa dari pengaruh dan intervensi tentara Jepang serta mendesak agar proklamasi diproklamirkan secepatnya tanpa campur tangan PPKI buatan Jepang.',
        source: 'Sumber: Modul_01_Sejarah... - Bab 3, Hal. 10'
      },
      {
        keywords: ['maeda', 'sayuti melik', 'perumusan naskah', 'teks proklamasi'],
        answer: 'Perumusan naskah proklamasi dilakukan pada malam 16 Agustus 1945 di kediaman Laksamana Tadashi Maeda di Jalan Imam Bonjol No. 1 Jakarta. Konsep disusun oleh Ir. Soekarno, Drs. Moh. Hatta, dan Mr. Ahmad Soebardjo. Teks diketik oleh Sayuti Melik dengan perbaikan istilah seperti tempoh menjadi tempo dan atas nama bangsa Indonesia.',
        source: 'Sumber: Modul_01_Sejarah... - Bab 4, Hal. 16'
      },
      {
        keywords: ['17 agustus', 'pembacaan proklamasi', 'pegangsaan timur', 'fatmawati', 'latief'],
        answer: 'Pembacaan proklamasi dilaksanakan pada hari Jumat, 17 Agustus 1945 pukul 10.00 WIB di kediaman Soekarno, Jalan Pegangsaan Timur No. 56 Jakarta. Bendera Merah Putih yang dijahit tangan oleh Ibu Fatmawati dikibarkan oleh Latief Hendraningrat dan Suhud dengan iringan lagu kebangsaan Indonesia Raya.',
        source: 'Sumber: Modul_01_Sejarah... - Bab 5, Hal. 20'
      }
    ],
    quickPrompts: [
      'Apa tujuan utama Peristiwa Rengasdengklok?',
      'Bagaimana proses perumusan teks proklamasi di rumah Maeda?',
      'Siapa saja tokoh yang mengetik dan mengibarkan bendera merah putih?',
      'Rangkum Modul 01 Sejarah'
    ],
    quizQuestions: [
      {
        id: 'sej_q1',
        bab: 3,
        hal: 10,
        difficulty: 'Mudah',
        question: 'Tujuan utama golongan pemuda membawa Ir. Soekarno dan Drs. Moh. Hatta ke Rengasdengklok adalah...',
        options: [
          'Memaksa kedua tokoh menandatangani piagam PBB',
          'Mengamankan keduanya dari pengaruh dan tekanan tentara Jepang',
          'Menggelar rapat rahasia bersama kaisar Hirohito',
          'Menyembunyikan cadangan senjata perang pemuda'
        ],
        correct: 1,
        explanation: 'Pemuda mengamankan Soekarno-Hatta agar proklamasi lahir murni dari perjuangan bangsa Indonesia tanpa campur tangan Jepang.'
      },
      {
        id: 'sej_q2',
        bab: 4,
        hal: 17,
        difficulty: 'Sedang',
        question: 'Siapakah tokoh yang bertugas mengetik naskah proklamasi dengan menyempurnakan beberapa kata dari draf tulisan tangan Soekarno?',
        options: [
          'B.M. Diah',
          'Chaerul Saleh',
          'Sayuti Melik',
          'Wikana'
        ],
        correct: 2,
        explanation: 'Sayuti Melik mengetik naskah proklamasi menggunakan mesin ketik yang dipinjam dari perwakilan perwira Jerman di Jakarta.'
      }
    ]
  },
  {
    id: 'modul_03',
    code: 'MOD-FIS-11-03',
    shortName: 'Modul_03_Fisika...',
    fullName: 'Modul 03: Fisika - Mekanika Klasik dan Hukum Newton',
    subject: 'Fisika',
    totalHal: 36,
    icon: '⚡',
    summary: 'Membahas dinamika partikel dan formulasi hukum gerak Newton: Hukum I (Inersia), Hukum II (F = m.a), Hukum III (Aksi-Reaksi), gaya gesekan kinetik/statis, gaya normal, serta penerapannya pada bidang miring, katrol, dan gerak melingkar.',
    chapters: [
      { bab: 1, judul: 'Kinematika Partikel: Posisi, Kecepatan, dan Percepatan sebagai Vektor', hal: '1 - 4' },
      { bab: 2, judul: 'Konseptualisasi Gaya dan Massa dalam Mekanika Newton', hal: '5 - 8' },
      { bab: 3, judul: 'Hukum I Newton: Prinsip Inersia dan Kerangka Acuan Inersial', hal: '9 - 14' },
      { bab: 4, judul: 'Hukum II Newton: Hubungan Gaya Netto, Massa, dan Akselerasi Linear', hal: '15 - 18' },
      { bab: 5, judul: 'Hukum III Newton: Pasangan Gaya Aksi-Reaksi dan Implikasi Momentum', hal: '19 - 22' },
      { bab: 6, judul: 'Dinamika Gaya Gesekan: Statis vs Kinetis pada Bidang Miring', hal: '23 - 26' },
      { bab: 7, judul: 'Penerapan Hukum Newton pada Gerak Melingkar Beraturan dan Sistem Katrol', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['hukum 1 newton', 'hukum i newton', 'inersia', 'kelembaman', 'sigma f = 0'],
        answer: 'Hukum I Newton (Kelembaman/Inersia): Jika resultan gaya pada benda sama dengan nol (ΣF = 0), maka benda diam akan tetap diam, dan benda yang bergerak lurus beraturan akan tetap bergerak dengan kecepatan konstan. Contoh: tubuh terdorong saat mobil direm mendadak.',
        source: 'Sumber: Modul_03_Fisika... - Bab 3, Hal. 10'
      },
      {
        keywords: ['hukum 2 newton', 'hukum ii newton', 'f = m a', 'percepatan newton'],
        answer: 'Hukum II Newton menyatakan bahwa percepatan sebuah benda berbanding lurus dengan resultan gaya total yang bekerja padanya dan berbanding terbalik dengan massanya. Rumus matematis: ΣF = m . a.',
        source: 'Sumber: Modul_03_Fisika... - Bab 4, Hal. 16'
      },
      {
        keywords: ['hukum 3 newton', 'hukum iii newton', 'aksi reaksi', 'f aksi = -f reaksi'],
        answer: 'Hukum III Newton (Aksi-Reaksi): Jika benda A memberikan gaya F pada benda B, maka benda B memberikan gaya balasan -F yang sama besar tetapi berlawanan arah pada benda A. Ciri penting: pasangan gaya aksi-reaksi bekerja pada DUA BENDA BERBEDA.',
        source: 'Sumber: Modul_03_Fisika... - Bab 5, Hal. 20'
      }
    ],
    quickPrompts: [
      'Jelaskan bunyi Hukum I, II, dan III Newton!',
      'Sebuah balok 5 kg ditarik gaya 20 N di lantai licin, hitung percepatannya!',
      'Rangkum Modul 03 Fisika'
    ],
    quizQuestions: [
      {
        id: 'fis_q1',
        bab: 3,
        hal: 11,
        difficulty: 'Mudah',
        question: 'Kondisi di mana resultan gaya total yang bekerja pada suatu benda bernilai nol (ΣF = 0) sesuai dengan prinsip...',
        options: [
          'Hukum Keppler I',
          'Hukum I Newton (Inersia)',
          'Hukum II Newton (Akselerasi)',
          'Hukum III Newton (Aksi-Reaksi)'
        ],
        correct: 1,
        explanation: 'Hukum I Newton merumuskan kondisi kesetimbangan ketika resultan gaya eksternal bernilai nol (ΣF = 0).'
      },
      {
        id: 'fis_q2',
        bab: 4,
        hal: 16,
        difficulty: 'Mudah',
        question: 'Sebuah balok bermassa 4 kg ditarik oleh gaya horizontal sebesar 16 N di atas lantai tanpa gesekan. Percepatan balok adalah...',
        options: [
          '2 m/s²',
          '4 m/s²',
          '8 m/s²',
          '64 m/s²'
        ],
        correct: 1,
        explanation: 'a = F / m = 16 N / 4 kg = 4 m/s².'
      }
    ]
  },
  {
    id: 'modul_04',
    code: 'MOD-KIM-11-04',
    shortName: 'Modul_04_Kimia...',
    fullName: 'Modul 04: Kimia - Termokimia dan Laju Reaksi',
    subject: 'Kimia',
    totalHal: 36,
    icon: '🧪',
    summary: 'Membahas reaksi eksoterm (ΔH < 0) vs endoterm (ΔH > 0), penentuan entalpi standar, kalorimeter bom, Hukum Hess, energi ikatan, teori tumbukan, dan faktor-faktor laju reaksi.',
    chapters: [
      { bab: 1, judul: 'Sistem dan Lingkungan: Reaksi Eksoterm vs Endoterm dalam Termokimia', hal: '1 - 4' },
      { bab: 2, judul: 'Perubahan Entalpi Standar (Pembentukan, Penguraian, dan Pembakaran)', hal: '5 - 8' },
      { bab: 3, judul: 'Penentuan Kalor Reaksi Menggunakan Kalorimeter Bom dan Kalorimeter Sederhana', hal: '9 - 14' },
      { bab: 4, judul: 'Hukum Hess dan Perhitungan Entalpi Berdasarkan Siklus Termokimia', hal: '15 - 18' },
      { bab: 5, judul: 'Energi Ikatan Rata-rata dan Prediksi Perubahan Entalpi Reaksi Gas', hal: '19 - 22' },
      { bab: 6, judul: 'Teori Tumbukan dan Konsep Energi Aktivasi (Arrhenius)', hal: '23 - 26' },
      { bab: 7, judul: 'Faktor-Faktor yang Mempengaruhi Laju Reaksi: Konsentrasi, Luas Permukaan, Suhu, Katalis', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['eksoterm', 'endoterm', 'delta h', 'kalor termokimia'],
        answer: 'Reaksi Eksoterm melepaskan kalor ke lingkungan (ΔH < 0, suhu lingkungan naik). Reaksi Endoterm menyerap kalor dari lingkungan ke sistem (ΔH > 0, suhu lingkungan turun).',
        source: 'Sumber: Modul_04_Kimia... - Bab 1, Hal. 3'
      },
      {
        keywords: ['hukum hess', 'siklus hess'],
        answer: 'Hukum Hess menyatakan bahwa perubahan entalpi reaksi hanya bergantung pada keadaan awal dan akhir, tidak dipengaruhi jalannya reaksi.',
        source: 'Sumber: Modul_04_Kimia... - Bab 4, Hal. 16'
      }
    ],
    quickPrompts: [
      'Jelaskan perbedaan reaksi eksoterm dan endoterm!',
      'Bagaimana prinsip Hukum Hess?',
      'Rangkum Modul 04 Kimia'
    ],
    quizQuestions: [
      {
        id: 'kim_q1',
        bab: 1,
        hal: 4,
        difficulty: 'Mudah',
        question: 'Pada reaksi yang melepaskan kalor ke lingkungan sehingga suhu wadah naik, nilai perubahan entalpi (ΔH) adalah...',
        options: ['Positif (ΔH > 0)', 'Negatif (ΔH < 0)', 'Nol (ΔH = 0)', 'Tak tentu'],
        correct: 1,
        explanation: 'Reaksi eksotermik melepaskan panas sehingga entalpi sistem berkurang (ΔH < 0).'
      }
    ]
  },
  {
    id: 'modul_05',
    code: 'MOD-MAT-11-05',
    shortName: 'Modul_05_Matematika...',
    fullName: 'Modul 05: Matematika - Kalkulus Diferensial dan Integral',
    subject: 'Matematika',
    totalHal: 36,
    icon: '📐',
    summary: 'Membahas limit fungsi aljabar tak tentu, definisi dan aturan turunan, garis singgung kurva, nilai stasioner, hingga anti-turunan (integral) dan Teorema Dasar Kalkulus.',
    chapters: [
      { bab: 1, judul: 'Konsep Intuitif dan Definisi Formal Limit Fungsi Mendekati Suatu Nilai', hal: '1 - 4' },
      { bab: 2, judul: 'Limit Fungsi Aljabar Tak Tentu (0/0) dan Limit Menuju Tak Hingga', hal: '5 - 8' },
      { bab: 3, judul: 'Definisi Turunan Pertama sebagai Laju Perubahan Nilai Sesaat', hal: '9 - 14' },
      { bab: 4, judul: 'Aturan Rantai, Turunan Fungsi Trigonometri, dan Turunan Tingkat Tinggi', hal: '15 - 18' },
      { bab: 5, judul: 'Aplikasi Turunan: Garis Singgung Kurva, Fungsi Naik-Turun, dan Nilai Ekstrim', hal: '19 - 22' },
      { bab: 6, judul: 'Anti-Turunan (Integral Tak Tentu) dan Teknik Substitusi Aljabar', hal: '23 - 26' },
      { bab: 7, judul: 'Teorema Dasar Kalkulus dan Penghitungan Luas Daerah di Bawah Kurva', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['limit tak tentu', 'bentuk 0/0', 'aturan lhopital'],
        answer: 'Jika substitusi langsung menghasilkan 0/0, gunakan pemfaktoran aljabar, perkalian sekawan, atau aturan L’Hôpital: lim f(x)/g(x) = lim f’(x)/g’(x).',
        source: 'Sumber: Modul_05_Matematika... - Bab 2, Hal. 7'
      }
    ],
    quickPrompts: [
      'Bagaimana cara menyelesaikan limit aljabar bentuk 0/0?',
      'Jika f(x) = 3x² + 5x, berapakah f’(x)?',
      'Rangkum Modul 05 Matematika'
    ],
    quizQuestions: [
      {
        id: 'mat_q1',
        bab: 3,
        hal: 11,
        difficulty: 'Mudah',
        question: 'Turunan pertama dari f(x) = 4x³ - 5x² + 7x adalah...',
        options: ['12x² - 10x + 7', '12x³ - 10x² + 7', '4x² - 5x + 7', '12x² - 5x'],
        correct: 0,
        explanation: 'f’(x) = 4(3)x² - 5(2)x + 7 = 12x² - 10x + 7.'
      }
    ]
  },
  {
    id: 'modul_06',
    code: 'MOD-SOS-11-06',
    shortName: 'Modul_06_Sosiologi...',
    fullName: 'Modul 06: Sosiologi - Struktur Sosial dan Diferensiasi',
    subject: 'Sosiologi',
    totalHal: 36,
    icon: '👥',
    summary: 'Membahas diferensiasi horizontal, stratifikasi sosial vertikal, teori konflik kelas Karl Marx, resolusi dan akomodasi konflik (mediasi, arbitrase), serta integrasi multikultural.',
    chapters: [
      { bab: 1, judul: 'Konsep Hakiki Struktur Sosial: Unsur Pembentuk dan Ciri Universal', hal: '1 - 4' },
      { bab: 2, judul: 'Diferensiasi Sosial Berdasarkan Ras, Etnis, Agama, dan Gender', hal: '5 - 8' },
      { bab: 3, judul: 'Stratifikasi Sosial Terbuka, Tertutup, dan Campuran dalam Masyarakat', hal: '9 - 14' },
      { bab: 4, judul: 'Konsekuensi Stratifikasi Sosial terhadap Peluang Hidup dan Gaya Hidup', hal: '15 - 18' },
      { bab: 5, judul: 'Akar Penyebab Konflik Sosial: Teori Karl Marx, Dahrendorf, dan Coser', hal: '19 - 22' },
      { bab: 6, judul: 'Bentuk-Bentuk Akomodasi dan Resolusi Konflik Konstruktif', hal: '23 - 26' },
      { bab: 7, judul: 'Integrasi Sosial, Multikulturalisme, dan Pembentukan Identitas Nasional', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['diferensiasi sosial', 'stratifikasi sosial', 'beda diferensiasi dan stratifikasi'],
        answer: 'Diferensiasi sosial bersifat horizontal (sejajar tanpa hierarki status, seperti ras, agama, gender). Stratifikasi sosial bersifat vertikal (bertingkat ke dalam kelas atas, menengah, bawah berdasarkan kekayaan, kekuasaan, atau kehormatan).',
        source: 'Sumber: Modul_06_Sosiologi... - Bab 2 & 3, Hal. 9'
      }
    ],
    quickPrompts: [
      'Apa perbedaan diferensiasi dan stratifikasi sosial?',
      'Jelaskan bentuk akomodasi mediasi vs arbitrase!',
      'Rangkum Modul 06 Sosiologi'
    ],
    quizQuestions: [
      {
        id: 'sos_q1',
        bab: 2,
        hal: 6,
        difficulty: 'Mudah',
        question: 'Pengelompokan masyarakat secara horizontal tanpa perbedaan tingkatan disebut...',
        options: ['Stratifikasi sosial', 'Diferensiasi sosial', 'Mobilitas sosial', 'Marginalisasi'],
        correct: 1,
        explanation: 'Diferensiasi membagi masyarakat ke dalam kelompok sederajat.'
      }
    ]
  },
  {
    id: 'modul_07',
    code: 'MOD-GEO-11-07',
    shortName: 'Modul_07_Geografi...',
    fullName: 'Modul 07: Geografi - Litosfer dan Dinamika Planet Bumi',
    subject: 'Geografi',
    totalHal: 36,
    icon: '🌍',
    summary: 'Membahas lapisan kerak/mantel/inti bumi, tektonik lempeng konvergen/divergen/transform, fenomena vulkanisme Ring of Fire Indonesia, gelombang gempa primer (P) dan sekunder (S), serta mitigasi bencana.',
    chapters: [
      { bab: 1, judul: 'Struktur Interior Planet Bumi: Inti Dalam, Inti Luar, Mantel, dan Kerak Bumi', hal: '1 - 4' },
      { bab: 2, judul: 'Teori Tektonik Lempeng dan Bukti Pergeseran Benua (Wegener)', hal: '5 - 8' },
      { bab: 3, judul: 'Batas Lempeng Konvergen, Divergen, dan Transform: Jalur Ring of Fire', hal: '9 - 14' },
      { bab: 4, judul: 'Dinamika Vulkanisme: Karakteristik Magma, Tipe Erupsi, dan Bentuk Gunung Api', hal: '15 - 18' },
      { bab: 5, judul: 'Seismologi Gempa Bumi: Gelombang Primer, Sekunder, dan Pengukuran Magnitudo', hal: '19 - 22' },
      { bab: 6, judul: 'Proses Eksogen: Pelapukan, Erosi, Sedimentasi, dan Morfologi Permukaan', hal: '23 - 26' },
      { bab: 7, judul: 'Sistem Peringatan Dini, Mitigasi Struktural, dan Adaptasi Kebencanaan', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['lempeng tektonik', 'konvergen', 'divergen', 'transform'],
        answer: 'Batas konvergen bertumbukan membentuk palung laut dan busur vulkanik (seperti di Indonesia). Batas divergen saling menjauh membentuk punggungan tengah samudera. Batas transform bergeser mendatar membentuk patahan/sesar.',
        source: 'Sumber: Modul_07_Geografi... - Bab 3, Hal. 11'
      }
    ],
    quickPrompts: [
      'Jelaskan 3 jenis pergerakan batas lempeng tektonik!',
      'Apa perbedaan gelombang primer (P) dan sekunder (S)?',
      'Rangkum Modul 07 Geografi'
    ],
    quizQuestions: [
      {
        id: 'geo_q1',
        bab: 3,
        hal: 11,
        difficulty: 'Mudah',
        question: 'Zona penunjaman lempeng samudera ke bawah lempeng benua dinamakan zona...',
        options: ['Divergensi', 'Subduksi', 'Transform', 'Rift valley'],
        correct: 1,
        explanation: 'Zona subduksi terbentuk saat lempeng samudera yang lebih berat menunjam ke bawah.'
      }
    ]
  },
  {
    id: 'modul_08',
    code: 'MOD-EKO-11-08',
    shortName: 'Modul_08_Ekonomi...',
    fullName: 'Modul 08: Ekonomi - Manajemen Keuangan dan Pasar Modal',
    subject: 'Ekonomi',
    totalHal: 36,
    icon: '📈',
    summary: 'Membahas sistem pembayaran, fungsi Bank Indonesia menjaga stabilitas rupiah, intermediasi perbankan umum dan syariah, instrumen pasar modal (saham, obligasi, reksadana), serta peran OJK dan BEI.',
    chapters: [
      { bab: 1, judul: 'Uang dan Sistem Pembayaran Modern: Dari Barter Hingga Transaksi Digital', hal: '1 - 4' },
      { bab: 2, judul: 'Fungsi dan Peran Bank Sentral (Bank Indonesia) dalam Menjaga Stabilitas Rupiah', hal: '5 - 8' },
      { bab: 3, judul: 'Operasional Bank Umum dan Bank Syariah: Prinsip Intermediasi Keuangan', hal: '9 - 14' },
      { bab: 4, judul: 'Pasar Modal Indonesia: Mekanisme Perdagangan Saham, Obligasi, dan Reksadana', hal: '15 - 18' },
      { bab: 5, judul: 'Lembaga Penunjang Pasar Modal: OJK, BEI, KSEI, dan KPEI', hal: '19 - 22' },
      { bab: 6, judul: 'Kebijakan Moneter dan Fiskal dalam Mengendalikan Inflasi dan Pengangguran', hal: '23 - 26' },
      { bab: 7, judul: 'Analisis Fundamental Sederhana: Membaca Laporan Keuangan Neraca dan Laba Rugi', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['bank sentral', 'bank indonesia', 'tujuan bi', 'kebijakan moneter'],
        answer: 'Tujuan tunggal Bank Indonesia adalah mencapai dan memelihara kestabilan nilai rupiah, baik terhadap laju inflasi harga barang maupun terhadap nilai tukar valuta asing (kurs).',
        source: 'Sumber: Modul_08_Ekonomi... - Bab 2, Hal. 6'
      }
    ],
    quickPrompts: [
      'Apa tujuan utama Bank Indonesia sebagai bank sentral?',
      'Jelaskan perbedaan saham, obligasi, dan reksadana!',
      'Rangkum Modul 08 Ekonomi'
    ],
    quizQuestions: [
      {
        id: 'eko_q1',
        bab: 2,
        hal: 6,
        difficulty: 'Mudah',
        question: 'Tujuan tunggal Bank Indonesia menurut undang-undang perbankan sentral adalah...',
        options: ['Menyalurkan kredit mikro', 'Mencapai dan memelihara kestabilan nilai rupiah', 'Menetapkan tarif pajak', 'Mencetak keuntungan usaha'],
        correct: 1,
        explanation: 'Kestabilan nilai rupiah terhadap inflasi dan nilai tukar adalah mandat utama BI.'
      }
    ]
  },
  {
    id: 'modul_09',
    code: 'MOD-INF-11-09',
    shortName: 'Modul_09_Informatika...',
    fullName: 'Modul 09: Informatika - Arsitektur Komputer dan Jaringan',
    subject: 'Informatika',
    totalHal: 36,
    icon: '💻',
    summary: 'Membahas arsitektur Von Neumann (CPU, ALU, CU, Fetch-Decode-Execute), hierarki memori (register, cache, RAM, storage), representasi biner & boolean, model jaringan OSI 7-layer vs TCP/IP, serta keamanan siber.',
    chapters: [
      { bab: 1, judul: 'Arsitektur Von Neumann: CPU, ALU, Unit Kontrol, dan Siklus Fetch-Decode-Execute', hal: '1 - 4' },
      { bab: 2, judul: 'Hierarki Memori Komputer: Register, Cache L1-L3, RAM, dan Secondary Storage', hal: '5 - 8' },
      { bab: 3, judul: 'Representasi Data Biner, Heksadesimal, dan Logika Gerbang Boolean', hal: '9 - 14' },
      { bab: 4, judul: 'Model Jaringan OSI 7-Layer vs TCP/IP 4-Layer: Analisis Aliran Paket Data', hal: '15 - 18' },
      { bab: 5, judul: 'Alamat IP Versi 4 (IPv4), Subnetting CIDR, dan Alokasi Alamat Privat vs Publik', hal: '19 - 22' },
      { bab: 6, judul: 'Protokol Routing, DNS, DHCP, dan Arsitektur Web Client-Server Modern', hal: '23 - 26' },
      { bab: 7, judul: 'Keamanan Siber Dasar: Enkripsi Simetris/Asimetris, Hashing, dan Firewall', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['von neumann', 'fetch decode execute', 'siklus cpu', 'alu'],
        answer: 'Siklus instruksi CPU Von Neumann: Fetch (Unit Kontrol mengambil instruksi dari RAM), Decode (menerjemahkan instruksi menjadi sinyal kendali), dan Execute (ALU mengeksekusi operasi matematika/logika).',
        source: 'Sumber: Modul_09_Informatika... - Bab 1, Hal. 3'
      }
    ],
    quickPrompts: [
      'Jelaskan siklus Fetch-Decode-Execute pada CPU Von Neumann!',
      'Apa perbedaan model OSI 7-Layer dan TCP/IP 4-Layer?',
      'Rangkum Modul 09 Informatika'
    ],
    quizQuestions: [
      {
        id: 'inf_q1',
        bab: 1,
        hal: 4,
        difficulty: 'Mudah',
        question: 'Komponen CPU yang melakukan operasi perhitungan matematika dan logika adalah...',
        options: ['Control Unit (CU)', 'Arithmetic Logic Unit (ALU)', 'Memory Controller', 'Storage Drive'],
        correct: 1,
        explanation: 'ALU mengeksekusi operasi aritmatika dan logika pada data biner.'
      }
    ]
  },
  {
    id: 'modul_10',
    code: 'MOD-IND-11-10',
    shortName: 'Modul_10_B.Indonesia...',
    fullName: 'Modul 10: Bahasa Indonesia - Kajian Sastra dan Teks Akademik',
    subject: 'Bahasa Indonesia',
    totalHal: 36,
    icon: '📚',
    summary: 'Membahas karakteristik bahasa ragam ilmiah (lugas, baku, denotatif, objektif), sistematika karya tulis ilmiah, kaidah kutipan & parafrase anti-plagiarisme, daftar pustaka APA, serta unsur intrinsik cerpen.',
    chapters: [
      { bab: 1, judul: 'Karakteristik Bahasa Ragam Ilmiah: Lugas, Baku, Denotatif, dan Objektif', hal: '1 - 4' },
      { bab: 2, judul: 'Sistematika Penyusunan Karya Tulis Ilmiah: Judul, Abstrak, dan Bab Pendahuluan', hal: '5 - 8' },
      { bab: 3, judul: 'Kajian Pustaka, Kerangka Berpikir, dan Perumusan Hipotesis Penelitian', hal: '9 - 14' },
      { bab: 4, judul: 'Metode Penelitian Kualitatif dan Kuantitatif dalam Kajian Bahasa dan Sastra', hal: '15 - 18' },
      { bab: 5, judul: 'Teknik Kutipan Langsung, Parafrase Anti-Plagiarisme, dan Penulisan Daftar Pustaka APA', hal: '19 - 22' },
      { bab: 6, judul: 'Struktur dan Ciri Kebahasaan Teks Resensi Kritis Karya Sastra Novel dan Drama', hal: '23 - 26' },
      { bab: 7, judul: 'Analisis Unsur Intrinsik dan Ekstrinsik dalam Antologi Cerpen Sastra Indonesia', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['ragam ilmiah', 'bahasa baku', 'denotatif', 'objektif'],
        answer: 'Ragam bahasa ilmiah memiliki 4 karakteristik: (1) Lugas (hemat kata, tanpa basa-basi); (2) Baku (sesuai EYD dan KBBI); (3) Denotatif (makna harfiah sebenarnya tanpa kiasan konotasi); (4) Objektif (berdasarkan fakta ilmiah bukan emosi subjektif).',
        source: 'Sumber: Modul_10_B.Indonesia... - Bab 1, Hal. 3'
      }
    ],
    quickPrompts: [
      'Apa ciri utama bahasa ragam ilmiah yang denotatif?',
      'Bagaimana cara melakukan parafrase agar terhindar dari plagiarisme?',
      'Rangkum Modul 10 Bahasa Indonesia'
    ],
    quizQuestions: [
      {
        id: 'ind_q1',
        bab: 1,
        hal: 4,
        difficulty: 'Mudah',
        question: 'Makna harfiah sebenarnya tanpa tafsiran kiasan dalam teks karya ilmiah disebut makna...',
        options: ['Konotatif', 'Denotatif', 'Metaforis', 'Asosiatif'],
        correct: 1,
        explanation: 'Makna denotatif adalah makna lugas yang objektif dan bebas kiasan ambigu.'
      }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.REFERENCE_P13_DATA = REFERENCE_P13_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REFERENCE_P13_DATA };
} else if (typeof globalThis !== 'undefined') {
  globalThis.REFERENCE_P13_DATA = REFERENCE_P13_DATA;
}
