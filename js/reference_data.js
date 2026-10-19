/**
 * DATA REFERENSI BAHAN LATIHAN P13
 * Pustaka referensi komprehensif 10 mata pelajaran untuk asisten belajar offline.
 * Berisi ringkasan bab, basis pengetahuan tanya-jawab (QA Pairs) lengkap, bank kuis, dan prompt interaktif.
 */

const REFERENCE_P13_DATA = [
  // =========================================================================
  // MODUL 02: BIOLOGI - SISTEM PENCERNAAN DAN METABOLISME
  // =========================================================================
  {
    id: 'modul_02',
    code: 'MOD-BIO-11-02',
    shortName: 'Modul_02_Biologi...',
    fullName: 'Modul 02: Biologi - Sistem Pencernaan dan Metabolisme',
    subject: 'Biologi',
    totalHal: 36,
    icon: '🧬',
    summary: 'Membahas arsitektur anatomi dan fisiologi saluran pencernaan manusia dari rongga mulut hingga rektum, sekresi enzim pencernaan lambung dan pankreas, absorpsi nutrisi pada vili usus halus, mikrobiota usus besar, serta gangguan klinis pencernaan.',
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
        keywords: ['intestin', 'intestinum', 'usus', 'apa itu intestin', 'pengertian intestin', 'fungsi usus', 'saluran usus'],
        answer: 'Intestin (usus atau *tractus intestinalis*) adalah segmen terpanjang dari saluran pencernaan manusia yang membentang dari sfingter pilorus lambung hingga ke anus. Intestin terbagi menjadi dua bagian utama:\n\n1. 🌾 **Intestinum Tenue (Usus Halus)** (panjang ~6–7 meter):\n• Berfungsi menyelesaikan pencernaan kimiawi secara tuntas dan menyerap (absorpsi) sekitar 90% sari makanan ke pembuluh darah dan limfa.\n• Terbagi atas 3 bagian: **Duodenum** (usus 12 jari), **Jejunum** (usus kosong), dan **Ileum** (usus penyerapan) yang permukaannya dipenuhi jutaan lipatan mikroskopis (**vili**).\n\n2. 🧱 **Intestinum Crassum (Usus Besar / Kolon)** (panjang ~1,5 meter):\n• Berfungsi menyerap kembali kelebihan air dan elektrolit dari sisa makanan yang tidak tercerna, membentuk massa feses padat, serta menjadi tempat tinggal mikrobiota simbiotik (*Escherichia coli*) yang memproduksi vitamin K dan biotin.\n\n3. 🚪 **Rektum & Anus**: Ujung akhir usus besar untuk menampung feses sementara sebelum dikeluarkan melalui proses defekasi.',
        source: 'Sumber: Modul_02_Biologi... - Bab 1 & 5, Hal. 4 & 20'
      },
      {
        keywords: ['usus halus', 'intestinum tenue', 'duodenum', 'jejunum', 'ileum', 'fungsi usus halus', 'bagian usus halus'],
        answer: 'Usus halus (*intestinum tenue*) adalah pusat pemecahan kimiawi dan penyerapan nutrisi makanan. Terdiri dari 3 bagian:\n\n1. **Duodenum (Usus 12 Jari)**: Muara saluran dari kantung empedu (hati) dan getah pankreas. Di sini lemak diemulsi empedu, sementara karbohidrat, protein, dan lemak dicerna oleh amilase, tripsin, dan lipase pankreas.\n2. **Jejunum (Usus Kosong)**: Tempat lanjutan pemecahan molekul oleh enzim dinding usus (sukus enterikus), seperti maltase, sukrase, laktase, dan peptidase/erepsin.\n3. **Ileum (Usus Penyerapan)**: Permukaannya berlipat-lipat dan memiliki jutaan **vili** serta mikrovili untuk menyerap glukosa, asam amino, vitamin, mineral (ke kapiler darah), serta asam lemak dan gliserol (ke pembuluh kil/lakteal limfatik).',
        source: 'Sumber: Modul_02_Biologi... - Bab 5, Hal. 19-22'
      },
      {
        keywords: ['usus besar', 'kolon', 'colon', 'intestinum crassum', 'fungsi usus besar', 'bakteri usus', 'e coli', 'defekasi'],
        answer: 'Usus besar (*intestinum crassum*) terdiri dari sekum (dengan apendiks/umbai cacing), kolon (asendens, transversum, desendens, sigmoid), dan rektum. Fungsi utamanya:\n\n1. 💧 **Reabsorpsi Air dan Garam Mineral**: Menyerap air dari kimus sisa pencernaan agar tubuh tidak mengalami dehidrasi dan feses berbentuk padat teratur.\n2. 🦠 **Fermentasi oleh Bakteri Simbiotik**: Bakteri baik seperti *Escherichia coli* membantu membusukkan sisa makanan dan menyintesis vitamin K serta biotin untuk diserap tubuh.\n3. 📦 **Pembentukan & Penampungan Feses**: Memadatkan sisa zat yang tidak tercerna sebelum diteruskan ke rektum untuk dikeluarkan lewat anus.',
        source: 'Sumber: Modul_02_Biologi... - Bab 6, Hal. 23-26'
      },
      {
        keywords: ['hcl', 'asam klorida', 'pepsin', 'fungsi hcl', 'fungsi pepsin', 'sel parietal'],
        answer: 'Asam klorida (HCl) disekresikan secara spesifik oleh sel parietal (oksintik) pada dinding lambung. Fungsinya:\n1. Mengaktifkan pepsinogen (enzim inaktif yang dihasilkan chief cell) menjadi enzim **pepsin** aktif.\n2. Menciptakan pH asam kuat (pH 1,5–2,0) yang membunuh bakteri patogen di makanan.\n3. Melunakkan serat makanan agar mudah dicerna.\n\nSetelah aktif, **enzim pepsin** bertugas memotong rantai protein kompleks menjadi polipeptida/pepton melalui hidrolisis ikatan peptida.',
        source: 'Sumber: Modul_02_Biologi... - Bab 3, Hal. 14'
      },
      {
        keywords: ['renin', 'beda renin', 'pepsin dan renin', 'kasein', 'protein susu', 'enzim renin'],
        answer: 'Renin dan pepsin sama-sama enzim lambung pencerna protein, namun mekanismenya berbeda:\n\n1. 🍼 **Enzim Renin**: Berfungsi khusus mengendapkan/menggumpalkan protein susu (**kasein**) dari kaseinogen dengan bantuan ion kalsium (Ca²⁺). Enzim ini sangat aktif pada masa bayi agar cairan susu tidak terlalu cepat lewat di lambung sehingga nutrisinya sempat dicerna.\n2. 🥩 **Enzim Pepsin**: Memecah rantai ikatan peptida protein umum menjadi pepton dan polipeptida sederhana dalam suasana asam lambung (pH 1,5–2,0).',
        source: 'Sumber: Modul_02_Biologi... - Bab 3, Hal. 11'
      },
      {
        keywords: ['ptialin', 'amilase', 'mulut', 'pencernaan mekanik', 'kimiawi mulut', 'air liur', 'saliva'],
        answer: 'Di rongga mulut terjadi dua jenis pencernaan secara bersamaan:\n1. 🦷 **Pencernaan Mekanis**: Dilakukan oleh gigi yang memotong dan mengunyah makanan, serta lidah yang membantu membolak-balikkan bolus.\n2. 💧 **Pencernaan Kimiawi**: Dilakukan oleh air liur (saliva) yang mengandung enzim **ptialin (amilase saliva)**. Enzim ini menghidrolisis zat tepung (amilum) menjadi disakarida maltosa pada rentang pH netral (~6,8–7,0).',
        source: 'Sumber: Modul_02_Biologi... - Bab 2, Hal. 6'
      },
      {
        keywords: ['duodenum', 'pankreas', 'empedu', 'tripsin', 'lipase', 'usus 12 jari'],
        answer: 'Duodenum (usus 12 jari) merupakan muara saluran dari kantung empedu dan kelenjar pankreas:\n• **Cairan Empedu (dari Hati)**: Mengemulsi lemak menjadi tetesan mikro agar luas permukaannya meningkat.\n• **Getah Pankreas**: Mengandung amilase pankreas (mencerna amilum), tripsin (mencerna protein/pepton menjadi asam amino), dan lipase pankreas (menghidrolisis lemak menjadi asam lemak dan gliserol), serta natrium bikarbonat untuk menetralkan asam lambung.',
        source: 'Sumber: Modul_02_Biologi... - Bab 4, Hal. 16'
      },
      {
        keywords: ['gerd', 'gastritis', 'ulkus', 'lambung sakit', 'sembelit', 'gangguan pencernaan', 'maag', 'konstipasi'],
        answer: 'Gangguan klinis utama pada sistem pencernaan:\n1. **GERD (Gastroesophageal Reflux Disease)**: Naiknya asam lambung ke esofagus akibat kelemahan sfingter kardia, menimbulkan rasa perih dan terbakar di dada (*heartburn*).\n2. **Gastritis (Maag)**: Peradangan mukosa lambung akibat iritasi asam berlebih, stres, atau infeksi *Helicobacter pylori*.\n3. **Ulkus Peptikum (Tukak Lambung)**: Luka terbuka pada mukosa lambung atau duodenum akibat terkikisnya lapisan lendir pelindung oleh asam dan pepsin.\n4. **Konstipasi (Sembelit)**: Feses mengeras akibat usus besar menyerap terlalu banyak air, biasanya karena kurang asupan serat dan air.\n5. **Diare**: Feses cair akibat iritasi usus besar yang mempercepat peristaltik sehingga reabsorpsi air terganggu.',
        source: 'Sumber: Modul_02_Biologi... - Bab 7, Hal. 28'
      },
      {
        keywords: ['saluran pencernaan', 'urutan pencernaan', 'organ pencernaan', 'proses pencernaan makanan'],
        answer: 'Urutan saluran pencernaan makanan pada manusia dari awal sampai akhir adalah:\n1. **Mulut**: Pengunyahan mekanik oleh gigi dan kimiawi oleh enzim ptialin.\n2. **Faring & Esofagus (Kerongkongan)**: Mendorong bolus ke lambung melalui gerak peristaltik.\n3. **Lambung**: Meremas kimus dan mencerna kimiawi dengan HCl, pepsin, dan renin.\n4. **Usus Halus (Duodenum, Jejunum, Ileum)**: Pencernaan enzimatis tuntas dan penyerapan sari makanan pada vili.\n5. **Usus Besar (Kolon)**: Penyerapan air dan fermentasi sisa makanan oleh bakteri *E. coli*.\n6. **Rektum & Anus**: Penampungan sementara feses dan saluran pembuangan akhir (defekasi).',
        source: 'Sumber: Modul_02_Biologi... - Bab 1, Hal. 2-4'
      },
      {
        keywords: ['esofagus', 'kerongkongan', 'peristaltik', 'gerak peristaltik'],
        answer: 'Esofagus (kerongkongan) adalah tabung berotot sepanjang ~25 cm penghubung faring ke lambung. Makanan terdorong ke lambung melalui **gerak peristaltik**, yaitu gelombang kontraksi dan relaksasi ritmis otot polos sirkular dan longitudinal dinding esofagus. Di ujung bawahnya terdapat sfingter esofagus bawah (kardia) yang mencegah asam lambung naik kembali.',
        source: 'Sumber: Modul_02_Biologi... - Bab 2, Hal. 7'
      },
      {
        keywords: ['vili', 'mikrovili', 'penyerapan', 'absorpsi', 'jonjot usus', 'pembuluh kil', 'lakteal'],
        answer: 'Vili (jonjot usus) adalah lipatan mikroskopis pada dinding dalam ileum (usus penyerapan):\n• Vili melipatgandakan luas permukaan usus hingga setara lapangan tenis (~200–300 m²).\n• Di dalam setiap vili terdapat **kapiler darah** (menyerap glukosa, asam amino, vitamin B & C, mineral) dan **pembuluh kil / lakteal limfatik** (menyerap asam lemak, gliserol, dan vitamin larut lemak A, D, E, K).',
        source: 'Sumber: Modul_02_Biologi... - Bab 5, Hal. 21'
      },
      {
        keywords: ['hati', 'hepar', 'kantung empedu', 'fungsi empedu', 'emulsi lemak'],
        answer: 'Hati (hepar) memproduksi cairan empedu yang kemudian disimpan dan dipekatkan di **kantung empedu (vesika felea)**. Empedu mengandung garam empedu yang berfungsi **mengemulsi lemak**—memecah gumpalan lemak besar menjadi tetesan mikroskopis agar enzim lipase pankreas dapat dengan mudah dan cepat menghidrolisisnya.',
        source: 'Sumber: Modul_02_Biologi... - Bab 4, Hal. 17'
      },
      {
        keywords: ['kimus', 'chyme', 'bolus', 'lambung mencerna'],
        answer: 'Bolus adalah gumpalan makanan padat yang telah dikunyah dan dibasahi air liur di rongga mulut. Ketika masuk ke lambung, bolus diremas oleh kontraksi otot dinding lambung dan dicampur dengan getah asam lambung menjadi cairan bubur полу-kental yang disebut **kimus (chyme)** sebelum dialirkan ke duodenum.',
        source: 'Sumber: Modul_02_Biologi... - Bab 3, Hal. 10'
      }
    ],
    quickPrompts: [
      'Apa itu intestin dan fungsinya?',
      'Jelaskan fungsi asam klorida (HCl) dan pepsin!',
      'Apa perbedaan usus halus dan usus besar?',
      'Bagaimana peran enzim di duodenum dan pankreas?',
      'Rangkum Modul 02 Biologi'
    ],
    quizQuestions: [
      {
        id: 'bio_q1',
        bab: 3,
        hal: 14,
        difficulty: 'Sedang',
        question: 'Sel lambung manakah yang secara spesifik memproduksi asam klorida (HCl) guna mengaktifkan pepsinogen?',
        options: ['Sel Goblet', 'Sel Parietal (Oksintik)', 'Sel Zimogen (Chief Cell)', 'Sel Enteroendokrin G'],
        correct: 1,
        explanation: 'Asam klorida (HCl) disekresikan secara spesifik oleh sel parietal (oksintik) pada dinding lambung, sedangkan pepsinogen dihasilkan oleh chief cell (sel zimogen).'
      },
      {
        id: 'bio_q2',
        bab: 3,
        hal: 11,
        difficulty: 'Mudah',
        question: 'Enzim yang berperan khusus dalam mengendapkan kasein dari susu di dalam lambung adalah...',
        options: ['Ptialin', 'Tripsin', 'Renin', 'Lipase'],
        correct: 2,
        explanation: 'Enzim renin berfungsi mengkoagulasikan atau mengendapkan kasein (protein susu) menjadi parakasein dengan bantuan ion kalsium.'
      },
      {
        id: 'bio_q3',
        bab: 2,
        hal: 6,
        difficulty: 'Mudah',
        question: 'Enzim ptialin (amilase saliva) di rongga mulut bekerja optimal pada pemecahan zat makanan jenis...',
        options: ['Protein menjadi asam amino', 'Amilum menjadi maltosa', 'Lemak menjadi gliserol', 'Polipeptida menjadi asam lemak'],
        correct: 1,
        explanation: 'Ptialin (amilase saliva) menghidrolisis ikatan amilum (pati) menjadi disakarida maltosa dalam rentang pH netral rongga mulut.'
      },
      {
        id: 'bio_q4',
        bab: 5,
        hal: 21,
        difficulty: 'Sedang',
        question: 'Bagian usus halus yang berfungsi utama dalam penyerapan nutrisi sari makanan melalui vili adalah...',
        options: ['Duodenum', 'Jejunum', 'Ileum', 'Kolon'],
        correct: 2,
        explanation: 'Ileum (usus penyerapan) memiliki jutaan vili dan mikrovili tempat absorpsi glukosa, asam amino, serta asam lemak.'
      },
      {
        id: 'bio_q5',
        bab: 4,
        hal: 16,
        difficulty: 'Sedang',
        question: 'Organ manakah yang menghasilkan enzim lipase, amilase, dan tripsin untuk pencernaan di usus halus?',
        options: ['Hati (hepar)', 'Pankreas', 'Lambung (gaster)', 'Usus besar (kolon)'],
        correct: 1,
        explanation: 'Pankreas menghasilkan getah pankreas yang kaya enzim pencernaan meliputi lipase pankreas, amilase pankreas, dan tripsinogen.'
      }
    ]
  },

  // =========================================================================
  // MODUL 01: SEJARAH - PERJUANGAN PROKLAMASI KEMERDEKAAN INDONESIA
  // =========================================================================
  {
    id: 'modul_01',
    code: 'MOD-SEJ-11-01',
    shortName: 'Modul_01_Sejarah...',
    fullName: 'Modul 01: Sejarah - Perjuangan Proklamasi Kemerdekaan Indonesia',
    subject: 'Sejarah',
    totalHal: 36,
    icon: '📜',
    summary: 'Membahas dinamika krusial detik-detik proklamasi kemerdekaan Republik Indonesia, menyerahnya Jepang kepada Sekutu, perdebatan golongan tua dan muda, Peristiwa Rengasdengklok, perumusan naskah di rumah Laksamana Maeda, hingga pembacaan teks 17 Agustus 1945.',
    chapters: [
      { bab: 1, judul: 'Kekalahan Fasisme Jepang dan Kevakuman Kekuasaan (Vacuum of Power)', hal: '1 - 4' },
      { bab: 2, judul: 'Perbedaan Strategi Golongan Tua dan Golongan Muda Patriotik', hal: '5 - 8' },
      { bab: 3, judul: 'Kronologi Peristiwa Rengasdengklok 16 Agustus 1945', hal: '9 - 14' },
      { bab: 4, judul: 'Konsensus Rumah Laksamana Tadashi Maeda di Jalan Imam Bonjol', hal: '15 - 18' },
      { bab: 5, judul: 'Perumusan dan Redaksi Otentik Naskah Proklamasi Kemerdekaan', hal: '19 - 22' },
      { bab: 6, judul: 'Upacara Pembacaan Teks Proklamasi di Jalan Pegangsaan Timur 56', hal: '23 - 26' },
      { bab: 7, judul: 'Penyebaran Berita Kemerdekaan dan Reaksi Spontan Rakyat Indonesia', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['rengasdengklok', 'peristiwa rengasdengklok', 'tujuan rengasdengklok', 'latar belakang rengasdengklok', 'golongan muda'],
        answer: 'Peristiwa Rengasdengklok terjadi pada 16 Agustus 1945 dini hari ketika para pemuda (Chaerul Saleh, Sukarni, Wikana, Darwis) membawa Ir. Soekarno dan Drs. Moh. Hatta ke Rengasdengklok, Karawang. Tujuannya: (1) Menjauhkan kedua tokoh dari tekanan dan pengaruh janji kemerdekaan tentara Jepang; (2) Mendesak agar proklamasi kemerdekaan dilakukan segera murni atas kekuatan bangsa Indonesia sendiri tanpa melalui PPKI bentukan Jepang.',
        source: 'Sumber: Modul_01_Sejarah... - Bab 3, Hal. 10'
      },
      {
        keywords: ['maeda', 'laksamana maeda', 'tadashi maeda', 'perumusan proklamasi', 'naskah proklamasi', 'sayuti melik'],
        answer: 'Perumusan naskah proklamasi berlangsung malam 16 Agustus hingga dini hari 17 Agustus 1945 di rumah Laksamana Tadashi Maeda (Jl. Imam Bonjol No. 1, Jakarta). Konsep teks disusun oleh Ir. Soekarno, Drs. Moh. Hatta, dan Mr. Ahmad Soebardjo di ruang makan. Teks tulisan tangan kemudian diketik oleh Sayuti Melik dengan penyesuaian kata (kata "tempoh" menjadi "tempo", "wakil-wakil bangsa Indonesia" menjadi "Atas nama bangsa Indonesia"), lalu ditandatangani oleh Soekarno dan Hatta.',
        source: 'Sumber: Modul_01_Sejarah... - Bab 4 & 5, Hal. 16-20'
      },
      {
        keywords: ['fatmawati', 'bendera merah putih', 'pengibar bendera', 'latief hendraningrat', 'suhud', 'pegangsaan timur'],
        answer: 'Pembacaan teks proklamasi dilakukan pada hari Jumat, 17 Agustus 1945 pukul 10.00 WIB di halaman rumah Ir. Soekarno di Jl. Pegangsaan Timur No. 56, Jakarta. Bendera Merah Putih dijahit tangan langsung oleh Ibu Fatmawati dan dikibarkan oleh Latief Hendraningrat didampingi Suhud Sastro Kusumo serta SK Trimurti, diiringi lagu kebangsaan Indonesia Raya tanpa musik.',
        source: 'Sumber: Modul_01_Sejarah... - Bab 6, Hal. 24'
      },
      {
        keywords: ['bpupki', 'ppki', 'badan penyelidik usaha', 'panitia persiapan kemerdekaan'],
        answer: 'BPUPKI (Dokuritsu Junbi Cosakai) dibentuk pada 1 Maret 1945 untuk menyelidiki dan mempersiapkan dasar negara serta konstitusi (menghasilkan Piagam Jakarta / Pancasila). Setelah tugasnya tuntas, BPUPKI dibubarkan dan digantikan oleh PPKI (Dokuritsu Junbi Inkai) pada 7 Agustus 1945 yang diketuai Ir. Soekarno untuk mempersiapkan pemindahan kekuasaan.',
        source: 'Sumber: Modul_01_Sejarah... - Bab 1, Hal. 3'
      },
      {
        keywords: ['vacuum of power', 'kekosongan kekuasaan', 'hiroshima', 'nagasaki', 'jepang menyerah'],
        answer: 'Kekosongan kekuasaan (*vacuum of power*) di Indonesia terjadi setelah kota Hiroshima (6 Agustus 1945) dan Nagasaki (9 Agustus 1945) dijatuhi bom atom oleh Sekutu, menyebabkan Kaisar Hirohito mengumumkan penyerahan Jepang tanpa syarat pada 15 Agustus 1945. Informasi rahasia ini disadap oleh pemuda Sutan Sjahrir lewat siaran radio luar negeri.',
        source: 'Sumber: Modul_01_Sejarah... - Bab 1, Hal. 2'
      }
    ],
    quickPrompts: [
      'Apa latar belakang peristiwa Rengasdengklok?',
      'Bagaimana kronologi perumusan teks proklamasi di rumah Maeda?',
      'Siapa yang menjahit dan mengibarkan bendera Merah Putih?',
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
          'Memaksa kedua tokoh membentuk kabinet perang',
          'Mengamankan keduanya dari pengaruh serta campur tangan Jepang',
          'Menyerahkan kedua tokoh kepada pasukan Sekutu',
          'Menghindari kejaran tentara Belanda'
        ],
        correct: 1,
        explanation: 'Golongan pemuda mengamankan Soekarno dan Hatta ke Rengasdengklok agar tidak terpengaruh janji Jepang.'
      },
      {
        id: 'sej_q2',
        bab: 5,
        hal: 20,
        difficulty: 'Mudah',
        question: 'Tokoh yang mengetik naskah proklamasi kemerdekaan Indonesia yang otentik adalah...',
        options: ['Sukarni', 'Sayuti Melik', 'Chaerul Saleh', 'BM Diah'],
        correct: 1,
        explanation: 'Naskah proklamasi diketik oleh Sayuti Melik dengan beberapa perubahan redaksional.'
      }
    ]
  },

  // =========================================================================
  // MODUL 03: FISIKA - MEKANIKA KLASIK DAN HUKUM NEWTON
  // =========================================================================
  {
    id: 'modul_03',
    code: 'MOD-FIS-11-03',
    shortName: 'Modul_03_Fisika...',
    fullName: 'Modul 03: Fisika - Mekanika Klasik dan Hukum Newton',
    subject: 'Fisika',
    totalHal: 36,
    icon: '⚡',
    summary: 'Membahas hukum gerak Newton (Hukum I inersia, Hukum II F=m.a, Hukum III aksi-reaksi), gaya normal, gaya gesekan statis/kinetis, diagram benda bebas, gerak lurus berubah beraturan (GLBB), serta usaha dan energi mekanik.',
    chapters: [
      { bab: 1, judul: 'Konsep Gaya, Kerangka Acuan Inersia, dan Hukum I Newton (Kelembaman)', hal: '1 - 4' },
      { bab: 2, judul: 'Hukum II Newton: Gaya, Massa, Percepatan, dan Analisis Dinamika Gerak', hal: '5 - 8' },
      { bab: 3, judul: 'Hukum III Newton: Karakteristik Pasangan Gaya Aksi-Reaksi', hal: '9 - 14' },
      { bab: 4, judul: 'Analisis Gaya Kontak: Gaya Normal, Gaya Tegang Tali, dan Bidang Miring', hal: '15 - 18' },
      { bab: 5, judul: 'Gaya Gesek: Koefisien Gesek Statis vs Kinetis dan Hambatan Gerak', hal: '19 - 22' },
      { bab: 6, judul: 'Penerapan Hukum Newton pada Sistem Katrol dan Gerak Melingkar Beraturan', hal: '23 - 26' },
      { bab: 7, judul: 'Usaha, Energi Kinetik, Energi Potensial, dan Hukum Kekekalan Energi', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['hukum 1 newton', 'hukum i newton', 'inersia', 'kelembaman', 'sigma f = 0'],
        answer: 'Hukum I Newton (Prinsip Kelembaman / Inersia) berbunyi: "Jika resultan gaya yang bekerja pada suatu benda sama dengan nol (ΣF = 0), benda yang diam akan tetap diam, dan benda yang bergerak lurus beraturan akan terus bergerak dengan kecepatan konstan." Contoh nyata: saat bus direm mendadak, tubuh penumpang tersentak ke depan karena mempertahankan gerak majunya.',
        source: 'Sumber: Modul_03_Fisika... - Bab 1, Hal. 3'
      },
      {
        keywords: ['hukum 2 newton', 'hukum ii newton', 'f = m a', 'percepatan', 'gaya dan massa'],
        answer: 'Hukum II Newton menyatakan bahwa percepatan (a) yang dihasilkan oleh resultan gaya berbanding lurus dengan besar resultan gaya (ΣF) dan berbanding terbalik dengan massa benda (m). Rumus matematisnya: **ΣF = m × a** (atau **a = ΣF / m**). Satuan gaya adalah Newton (kg·m/s²).',
        source: 'Sumber: Modul_03_Fisika... - Bab 2, Hal. 6'
      },
      {
        keywords: ['hukum 3 newton', 'hukum iii newton', 'aksi reaksi', 'f aksi = -f reaksi'],
        answer: 'Hukum III Newton menyatakan: "Setiap ada gaya aksi pada suatu benda, benda tersebut akan memberikan gaya reaksi yang sama besar tetapi berlawanan arah." Rumus: **F_aksi = -F_reaksi**. Ciri utamanya: gaya aksi dan reaksi SELALU bekerja pada DUA BENDA YANG BERBEDA, sehingga tidak pernah saling meniadakan. Contoh: gas roket menyembur ke bawah, badan roket terdorong ke atas.',
        source: 'Sumber: Modul_03_Fisika... - Bab 3, Hal. 11'
      },
      {
        keywords: ['gaya gesek', 'gesek statis', 'gesek kinetis', 'koefisien gesek'],
        answer: 'Gaya gesek adalah gaya yang melawan arah gerak benda akibat kontak dua permukaan. Terdiri dari:\n1. **Gaya Gesek Statis (fs)**: Bekerja saat benda masih diam hingga tepat akan bergerak (fs_max = μs × N).\n2. **Gaya Gesek Kinetis (fk)**: Bekerja saat benda sudah meluncur/bergerak (fk = μk × N).\nNilai koefisien gesek statis (μs) selalu lebih besar dari kinetis (μk).',
        source: 'Sumber: Modul_03_Fisika... - Bab 5, Hal. 20'
      },
      {
        keywords: ['usaha dan energi', 'energi kinetik', 'energi potensial', 'kekekalan energi'],
        answer: 'Usaha (W) adalah perkalian gaya dengan perpindahan (W = F × s × cos θ). Energi Kinetik adalah energi gerak (Ek = ½ m v²). Energi Potensial Gravitasi adalah energi karena ketinggian (Ep = m g h). Hukum Kekekalan Energi Mekanik menyatakan: **Em = Ek + Ep = konstan** jika tidak ada gaya disipatif seperti gesekan.',
        source: 'Sumber: Modul_03_Fisika... - Bab 7, Hal. 29'
      }
    ],
    quickPrompts: [
      'Jelaskan bunyi dan contoh Hukum I Newton (Inersia)!',
      'Bagaimana rumus dan penerapan Hukum II Newton (F = m.a)?',
      'Apa ciri khas gaya aksi-reaksi pada Hukum III Newton?',
      'Rangkum Modul 03 Fisika'
    ],
    quizQuestions: [
      {
        id: 'fis_q1',
        bab: 1,
        hal: 3,
        difficulty: 'Mudah',
        question: 'Sebuah koin berada di atas kertas di atas meja. Ketika kertas ditarik secara mendadak, koin tetap diam di posisinya. Hal ini membuktikan...',
        options: ['Hukum II Newton', 'Hukum I Newton (Inersia)', 'Hukum Gravitasi Universal', 'Hukum Aksi Reaksi'],
        correct: 1,
        explanation: 'Kelembaman membuat benda mempertahankan keadaan diamnya saat gaya luar bekerja seketika.'
      },
      {
        id: 'fis_q2',
        bab: 2,
        hal: 7,
        difficulty: 'Mudah',
        question: 'Benda bermassa 5 kg diberi gaya mendatar sebesar 20 N pada lantai licin tanpa gesekan. Berapakah percepatan benda tersebut?',
        options: ['2 m/s²', '4 m/s²', '10 m/s²', '100 m/s²'],
        correct: 1,
        explanation: 'Berdasarkan Hukum II Newton: a = F / m = 20 N / 5 kg = 4 m/s².'
      }
    ]
  },

  // =========================================================================
  // MODUL 04: KIMIA - TERMOKIMIA DAN LAJU REAKSI
  // =========================================================================
  {
    id: 'modul_04',
    code: 'MOD-KIM-11-04',
    shortName: 'Modul_04_Kimia...',
    fullName: 'Modul 04: Kimia - Termokimia dan Laju Reaksi',
    subject: 'Kimia',
    totalHal: 36,
    icon: '🧪',
    summary: 'Membahas sistem dan lingkungan dalam termokimia, reaksi eksoterm vs endoterm, perubahan entalpi standar (pembentukan, penguraian, pembakaran), kalorimeter, Hukum Hess, teori tumbukan molekuler, dan faktor penentu laju reaksi.',
    chapters: [
      { bab: 1, judul: 'Sistem dan Lingkungan: Reaksi Eksoterm vs Endoterm dalam Termokimia', hal: '1 - 4' },
      { bab: 2, judul: 'Perubahan Entalpi Standar (Pembentukan, Penguraian, dan Pembakaran)', hal: '5 - 8' },
      { bab: 3, judul: 'Penentuan Kalor Reaksi Menggunakan Kalorimeter Bom dan Sederhana', hal: '9 - 12' },
      { bab: 4, judul: 'Hukum Hess dan Perhitungan Entalpi Berdasarkan Siklus Termokimia', hal: '13 - 16' },
      { bab: 5, judul: 'Energi Ikatan Rata-rata dan Prediksi Perubahan Entalpi Reaksi Gas', hal: '17 - 20' },
      { bab: 6, judul: 'Teori Tumbukan dan Konsep Energi Aktivasi (Arrhenius)', hal: '21 - 24' },
      { bab: 7, judul: 'Faktor-Faktor yang Mempengaruhi Laju Reaksi: Konsentrasi, Suhu, dan Katalis', hal: '25 - 28' }
    ],
    qaPairs: [
      {
        keywords: ['eksoterm', 'endoterm', 'reaksi eksoterm', 'reaksi endoterm', 'beda eksoterm endoterm', 'perubahan entalpi'],
        answer: 'Dalam termokimia, reaksi dibedakan berdasarkan perpindahan kalor:\n1. 🔥 **Reaksi Eksoterm**: Sistem melepaskan kalor ke lingkungan. Nilai perubahan entalpi negatif (**ΔH < 0**). Suhu lingkungan mengalami kenaikan (terasa hangat/panas). Contoh: reaksi pembakaran, reaksi kapur tohor dengan air.\n2. ❄️ **Reaksi Endoterm**: Sistem menyerap kalor dari lingkungan. Nilai perubahan entalpi positif (**ΔH > 0**). Suhu lingkungan mengalami penurunan (terasa dingin). Contoh: es batu mencair, fotosintesis, garam amonium nitrat dilarutkan dalam air.',
        source: 'Sumber: Modul_04_Kimia... - Bab 1, Hal. 3'
      },
      {
        keywords: ['hukum hess', 'aturan hess', 'siklus hess', 'perhitungan entalpi'],
        answer: 'Hukum Hess menyatakan bahwa perubahan entalpi total suatu reaksi kimia hanya bergantung pada keadaan awal (reaktan) dan keadaan akhir (produk), serta tidak dipengaruhi oleh tahapan atau jalan reaksi. Jika suatu reaksi dapat berlangsung melalui beberapa tahap, maka ΔH total adalah penjumlahan dari ΔH masing-masing tahap reaksi.',
        source: 'Sumber: Modul_04_Kimia... - Bab 4, Hal. 14'
      },
      {
        keywords: ['laju reaksi', 'faktor laju reaksi', 'katalis', 'teori tumbukan', 'energi aktivasi'],
        answer: 'Laju reaksi adalah kecepatan berkurangnya konsentrasi reaktan atau bertambahnya konsentrasi produk per satuan waktu. Dipengaruhi oleh 4 faktor utama:\n1. **Konsentrasi / Tekanan**: Semakin pekat, partikel makin rapat sehingga frekuensi tumbukan meningkat.\n2. **Luas Permukaan**: Bidang sentuh partikel halus lebih luas dibanding gumpalan, memperbanyak peluang tumbukan efektif.\n3. **Suhu**: Kenaikan suhu meningkatkan energi kinetik partikel sehingga lebih banyak yang melampaui energi aktivasi.\n4. **Katalis**: Zat yang mempercepat laju reaksi dengan cara menurunkan nilai **energi aktivasi (Ea)** tanpa ikut terkonsumsi secara permanen.',
        source: 'Sumber: Modul_04_Kimia... - Bab 6 & 7, Hal. 22-26'
      },
      {
        keywords: ['kalorimeter', 'q = m c delta t', 'kapasitas kalor'],
        answer: 'Kalorimeter digunakan untuk mengukur jumlah kalor yang diserap atau dilepas dalam reaksi kimia. Rumus kalor yang diserap larutan adalah **q = m × c × ΔT**, di mana m adalah massa larutan (gram), c adalah kalor jenis air (J/g·°C), dan ΔT adalah perubahan suhu (T_akhir - T_awal). Entalpi reaksi: ΔH = -q / mol.',
        source: 'Sumber: Modul_04_Kimia... - Bab 3, Hal. 10'
      }
    ],
    quickPrompts: [
      'Apa perbedaan reaksi eksoterm dan endoterm?',
      'Bagaimana bunyi dan aplikasi Hukum Hess?',
      'Sebutkan 4 faktor yang mempengaruhi laju reaksi!',
      'Rangkum Modul 04 Kimia'
    ],
    quizQuestions: [
      {
        id: 'kim_q1',
        bab: 1,
        hal: 4,
        difficulty: 'Mudah',
        question: 'Ciri utama dari reaksi eksoterm adalah...',
        options: ['Sistem menyerap kalor dari lingkungan (ΔH > 0)', 'Sistem melepaskan kalor ke lingkungan (ΔH < 0)', 'Tidak terjadi perubahan suhu', 'Suhu lingkungan menjadi dingin'],
        correct: 1,
        explanation: 'Pada reaksi eksoterm, sistem melepaskan energi panas ke lingkungan sehingga ΔH bernilai negatif dan suhu lingkungan naik.'
      },
      {
        id: 'kim_q2',
        bab: 7,
        hal: 26,
        difficulty: 'Sedang',
        question: 'Fungsi utama katalis dalam mempercepat jalannya suatu reaksi kimia adalah...',
        options: ['Menaikkan energi kinetik partikel pereaksi', 'Menurunkan energi aktivasi (Ea) reaksi', 'Mengubah entalpi akhir reaksi', 'Meningkatkan konsentrasi produk'],
        correct: 1,
        explanation: 'Katalis menyediakan rute reaksi alternatif dengan energi aktivasi yang lebih rendah.'
      }
    ]
  },

  // =========================================================================
  // MODUL 05: MATEMATIKA - KALKULUS DIFERENSIAL DAN INTEGRAL
  // =========================================================================
  {
    id: 'modul_05',
    code: 'MOD-MAT-11-05',
    shortName: 'Modul_05_Matematika...',
    fullName: 'Modul 05: Matematika - Kalkulus Diferensial dan Integral',
    subject: 'Matematika',
    totalHal: 36,
    icon: '📐',
    summary: 'Membahas limit fungsi aljabar dan trigonometri, aturan L’Hôpital, konsep turunan pertama dan kedua, aplikasi diferensial (nilai optimum, gradien garis singgung), integral tak tentu dan tertentu, serta perhitungan luas daerah di bawah kurva.',
    chapters: [
      { bab: 1, judul: 'Definisi Intuitif Limit, Teorema Apit, dan Bentuk Tak Tentu 0/0', hal: '1 - 4' },
      { bab: 2, judul: 'Aturan L’Hôpital dan Limit Tak Hingga pada Fungsi Rasional', hal: '5 - 8' },
      { bab: 3, judul: 'Konsep Garis Singgung, Kecepatan Sesaat, dan Turunan Fungsi Aljabar', hal: '9 - 14' },
      { bab: 4, judul: 'Aturan Rantai (Chain Rule), Turunan Perkalian, dan Pembagian Fungsi', hal: '15 - 18' },
      { bab: 5, judul: 'Aplikasi Turunan: Titik Stasioner, Kecekungan, Maksimum-Minimum', hal: '19 - 22' },
      { bab: 6, judul: 'Integral Tak Tentu sebagai Antiturunan dan Teknik Substitusi Aljabar', hal: '23 - 26' },
      { bab: 7, judul: 'Teorema Dasar Kalkulus dan Perhitungan Luas Bidang Datar Kurva', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['limit', 'bentuk tak tentu', '0/0', 'lhopital', 'l hopital', 'cara ngerjain limit'],
        answer: 'Jika substitusi langsung limit menghasilkan bentuk tak tentu **0/0**, ada 3 strategi penyelesaian:\n1. ✂️ **Faktorisasi**: Faktorkan pembilang dan penyebut lalu sederhanakan suku pembuat nol (x - a).\n2. 🪞 **Kalikan Bentuk Sekawan**: Dipakai jika fungsi memuat bentuk akar kuadrat (misal √x - √a dikalikan √x + √a).\n3. ⚡ **Aturan L’Hôpital**: Turunkan fungsi pembilang f\'(x) dan penyebut g\'(x) secara terpisah: **lim [f(x)/g(x)] = lim [f\'(x)/g\'(x)]**.',
        source: 'Sumber: Modul_05_Matematika... - Bab 1 & 2, Hal. 4 & 6'
      },
      {
        keywords: ['turunan', 'diferensial', 'rumus turunan', 'cara turunan', 'konsep turunan'],
        answer: 'Turunan (diferensial) mengukur laju perubahan nilai suatu fungsi terhadap variabelnya secara sesaat (gradien garis singgung kurva).\n• Rumus dasar turunan fungsi aljabar: Jika **f(x) = a · xⁿ**, maka turunannya adalah **f\'(x) = a · n · xⁿ⁻¹**.\n• Contoh: Jika f(x) = 4x³, maka f\'(x) = 4 × 3 × x² = **12x²**.\n• Aturan rantai: d/dx [f(g(x))] = f\'(g(x)) · g\'(x).',
        source: 'Sumber: Modul_05_Matematika... - Bab 3, Hal. 10'
      },
      {
        keywords: ['integral', 'antiturunan', 'rumus integral', 'integral tentu', 'luas kurva'],
        answer: 'Integral adalah operasi balikan (invers) dari turunan (disebut juga antiturunan):\n1. **Integral Tak Tentu**: **∫ a · xⁿ dx = (a / (n + 1)) · xⁿ⁺¹ + C** (dengan n ≠ -1). Contoh: ∫ 6x² dx = (6/3) x³ + C = 2x³ + C.\n2. **Integral Tentu**: Digunakan untuk menghitung akumulasi total atau **luas bidang datar** di bawah kurva fungsi f(x) dari batas x = a hingga x = b: **L = ∫[a ke b] f(x) dx**.',
        source: 'Sumber: Modul_05_Matematika... - Bab 6 & 7, Hal. 24 & 28'
      }
    ],
    quickPrompts: [
      'Bagaimana cara menyelesaikan limit fungsi bentuk 0/0?',
      'Jelaskan rumus dasar turunan fungsi aljabar!',
      'Apa perbedaan integral tak tentu dan integral tentu?',
      'Rangkum Modul 05 Matematika'
    ],
    quizQuestions: [
      {
        id: 'mat_q1',
        bab: 3,
        hal: 11,
        difficulty: 'Mudah',
        question: 'Turunan pertama dari f(x) = 3x⁴ - 5x² + 7 adalah...',
        options: ['12x³ - 10x', '12x³ - 5x + 7', '7x³ - 10x', '12x⁴ - 10x²'],
        correct: 0,
        explanation: 'f\'(x) = 3(4)x³ - 5(2)x + 0 = 12x³ - 10x.'
      },
      {
        id: 'mat_q2',
        bab: 6,
        hal: 25,
        difficulty: 'Mudah',
        question: 'Hasil dari ∫ 4x³ dx adalah...',
        options: ['12x² + C', 'x⁴ + C', '4x⁴ + C', 'x³ + C'],
        correct: 1,
        explanation: '∫ 4x³ dx = (4/4) x⁴ + C = x⁴ + C.'
      }
    ]
  },

  // =========================================================================
  // MODUL 06: SOSIOLOGI - STRUKTUR SOSIAL DAN DIFERENSIASI
  // =========================================================================
  {
    id: 'modul_06',
    code: 'MOD-SOS-11-06',
    shortName: 'Modul_06_Sosiologi...',
    fullName: 'Modul 06: Sosiologi - Struktur Sosial dan Diferensiasi',
    subject: 'Sosiologi',
    totalHal: 36,
    icon: '👥',
    summary: 'Membahas dinamika struktur sosial masyarakat, diferensiasi sosial horizontal (ras, suku bangsa, klan, agama, gender), stratifikasi sosial vertikal (kelas sosial, kekayaan, kekuasaan), sistem terbuka vs tertutup, mobilitas sosial, dan integrasi masyarakat multikultural.',
    chapters: [
      { bab: 1, judul: 'Hakikat Struktur Sosial: Status, Peran, Norma, dan Keteraturan Sosial', hal: '1 - 4' },
      { bab: 2, judul: 'Diferensiasi Sosial Horizontal: Parameter Suku, Agama, Ras, dan Antargolongan', hal: '5 - 8' },
      { bab: 3, judul: 'Stratifikasi Sosial Vertikal: Kriteria Kekayaan, Kekuasaan, dan Prestise', hal: '9 - 14' },
      { bab: 4, judul: 'Sistem Pelapisan Sosial Terbuka, Tertutup, dan Campuran di Nusantara', hal: '15 - 18' },
      { bab: 5, judul: 'Saluran Mobilitas Sosial Vertikal Naik (Social Climbing) dan Turun (Sinking)', hal: '19 - 22' },
      { bab: 6, judul: 'Potensi Konflik Antarkelompok, Primordialisme, dan Etnosentrisme', hal: '23 - 26' },
      { bab: 7, judul: 'Integrasi Sosial, Harmoni Masyarakat Multikultural, dan Konsensus', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['diferensiasi', 'stratifikasi', 'diferensiasi sosial', 'stratifikasi sosial', 'beda diferensiasi dan stratifikasi'],
        answer: 'Di sosiologi, pembagian kelompok masyarakat dibedakan menjadi dua arah:\n1. ↔️ **Diferensiasi Sosial (Horizontal / Sejajar)**: Pengelompokan masyarakat secara horizontal ke dalam unit-unit sosial yang sederajat tanpa hierarki tinggi atau rendah. Contoh: perbedaan suku bangsa, agama, ras, jenis kelamin, dan klan.\n2. ↕️ **Stratifikasi Sosial (Vertikal / Bertingkat)**: Pelapisan masyarakat ke dalam strata sosial hierarkis (atas, menengah, bawah). Dasar ukurannya: kekayaan materi, tingkat kekuasaan, tingkat pendidikan, atau kehormatan bangsawan.',
        source: 'Sumber: Modul_06_Sosiologi... - Bab 2 & 3, Hal. 6 & 11'
      },
      {
        keywords: ['mobilitas sosial', 'social climbing', 'social sinking', 'saluran mobilitas'],
        answer: 'Mobilitas sosial adalah perpindahan status sosial individu atau kelompok:\n• **Mobilitas Vertikal Naik (Social Climbing)**: Perpindahan ke strata sosial yang lebih tinggi (misal: anak petani lulus sarjana menjadi manajer perusahaan).\n• **Mobilitas Vertikal Turun (Social Sinking)**: Penurunan ke strata lebih rendah (misal: pengusaha mengalami kebangkrutan).\n• **Saluran Mobilitas**: Lembaga pendidikan, organisasi politik, lembaga keagamaan, angkatan bersenjata, dan organisasi profesi.',
        source: 'Sumber: Modul_06_Sosiologi... - Bab 5, Hal. 20'
      },
      {
        keywords: ['primordialisme', 'etnosentrisme', 'multikultural'],
        answer: 'Sikap penghambat integrasi masyarakat multikultural:\n• **Primordialisme**: Ikatan loyalitas berlebihan terhadap hal-hal yang dibawa sejak lahir (suku, klan, daerah asal).\n• **Etnosentrisme**: Sikap menilai kebudayaan suku/kelompok lain menggunakan standar kebudayaannya sendiri dan menganggap budayanya paling unggul.',
        source: 'Sumber: Modul_06_Sosiologi... - Bab 6, Hal. 24'
      }
    ],
    quickPrompts: [
      'Apa perbedaan diferensiasi sosial dan stratifikasi sosial?',
      'Jelaskan bentuk-bentuk mobilitas sosial vertikal!',
      'Apa yang dimaksud etnosentrisme dan primordialisme?',
      'Rangkum Modul 06 Sosiologi'
    ],
    quizQuestions: [
      {
        id: 'sos_q1',
        bab: 2,
        hal: 6,
        difficulty: 'Mudah',
        question: 'Pengelompokan masyarakat berdasarkan perbedaan suku bangsa dan agama digolongkan ke dalam...',
        options: ['Stratifikasi sosial vertikal', 'Diferensiasi sosial horizontal', 'Disintegrasi sosial', 'Konflik kelas'],
        correct: 1,
        explanation: 'Diferensiasi membagi masyarakat ke dalam kelompok-kelompok yang sederajat tanpa hierarki.'
      }
    ]
  },

  // =========================================================================
  // MODUL 07: GEOGRAFI - LITOSFER DAN DINAMIKA PLANET BUMI
  // =========================================================================
  {
    id: 'modul_07',
    code: 'MOD-GEO-11-07',
    shortName: 'Modul_07_Geografi...',
    fullName: 'Modul 07: Geografi - Litosfer dan Dinamika Planet Bumi',
    subject: 'Geografi',
    totalHal: 36,
    icon: '🌍',
    summary: 'Membahas lapisan kerak/mantel/inti bumi, tektonik lempeng konvergen/divergen/transform, fenomena vulkanisme Ring of Fire Indonesia, gelombang gempa primer (P) dan sekunder (S), proses eksogen pelapukan dan erosi, serta mitigasi bencana.',
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
        keywords: ['litosfer', 'lapisan bumi', 'kerak bumi', 'mantel bumi', 'inti bumi'],
        answer: 'Litosfer (dari bahasa Yunani: *lithos* = batuan, *sphaira* = bulatan) adalah lapisan batuan padat terluar yang menyelimuti planet bumi, mencakup kerak bumi (kerak benua dan kerak samudera) dan bagian paling atas mantel bumi hingga kedalaman ~100 km. Di bawah litosfer terdapat lapisan astenosfer yang bersifat plastis/semi-cair tempat lempeng-lempeng litosfer mengapung dan bergerak aktif.',
        source: 'Sumber: Modul_07_Geografi... - Bab 1, Hal. 2'
      },
      {
        keywords: ['lempeng tektonik', 'konvergen', 'divergen', 'transform', 'batas lempeng', 'ring of fire'],
        answer: 'Ada 3 jenis pergerakan batas lempeng tektonik bumi:\n1. ➡️⬅️ **Batas Konvergen (Bertumbukan)**: Lempeng saling mendekat, membentuk zona subduksi (penunjaman), palung laut dalam, dan deretan gunung berapi aktif (seperti jalur Ring of Fire di Indonesia).\n2. ⬅️➡️ **Batas Divergen (Saling Menjauh)**: Lempeng saling berpisah akibat keluarnya magma baru, membentuk punggung tengah samudera (*mid-ocean ridge*) atau lembah retakan (*rift valley*).\n3. ⬆️⬇️ **Batas Transform (Sesar Mendatar)**: Lempeng bergesekan horizontal berlawanan arah, memicu sesar aktif dan gempa bumi dangkal (contoh: Sesar San Andreas atau Patahan Semangko di Sumatra).',
        source: 'Sumber: Modul_07_Geografi... - Bab 3, Hal. 11'
      },
      {
        keywords: ['gempa bumi', 'gelombang gempa', 'gelombang p', 'gelombang s', 'seismologi', 'tsunami'],
        answer: 'Gempa bumi memancarkan gelombang seismik dari pusat gempa di dalam bumi (hiposentrum):\n• **Gelombang Primer (P)**: Gelombang longitudinal berkecepatan paling tinggi (pertama kali tercatat seismograf), dapat merambat melalui zat padat, cair, dan gas.\n• **Gelombang Sekunder (S)**: Gelombang transversal berkecepatan lebih lambat yang HANYA dapat merambat melalui medium zat padat.\n• **Tsunami**: Terjadi jika gempa tektonik dasar laut berkekuatan besar memicu patahan vertikal dasar laut yang mengangkat volume air secara masif.',
        source: 'Sumber: Modul_07_Geografi... - Bab 5, Hal. 20'
      }
    ],
    quickPrompts: [
      'Apa itu litosfer dan bagaimana strukturnya?',
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
        explanation: 'Zona subduksi terbentuk saat lempeng samudera yang lebih berat menunjam ke bawah lempeng benua.'
      }
    ]
  },

  // =========================================================================
  // MODUL 08: EKONOMI - MANAJEMEN KEUANGAN DAN PASAR MODAL
  // =========================================================================
  {
    id: 'modul_08',
    code: 'MOD-EKO-11-08',
    shortName: 'Modul_08_Ekonomi...',
    fullName: 'Modul 08: Ekonomi - Manajemen Keuangan dan Pasar Modal',
    subject: 'Ekonomi',
    totalHal: 36,
    icon: '📈',
    summary: 'Membahas sistem pembayaran, fungsi Bank Indonesia menjaga stabilitas rupiah, inflasi dan kebijakan moneter, intermediasi perbankan, instrumen pasar modal (saham, obligasi, reksadana), serta peran pengawasan OJK dan BEI.',
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
        keywords: ['inflasi', 'apa itu inflasi', 'penyebab inflasi', 'demand pull', 'cost push'],
        answer: 'Inflasi adalah kenaikan harga barang dan jasa secara umum dan terus-menerus dalam periode tertentu, yang menyebabkan turunnya daya beli nilai mata uang. Dua penyebab utamanya:\n1. **Demand-Pull Inflation**: Kenaikan harga dipicu oleh lonjakan permintaan masyarakat yang melebihi kapasitas produksi barang.\n2. **Cost-Push Inflation**: Kenaikan harga didorong oleh lonjakan biaya produksi (seperti naiknya harga BBM, bahan baku impor, atau upah buruh).\nBank sentral mengendalikan inflasi melalui **kebijakan moneter ketat** (menaikkan suku bunga acuan BI-Rate).',
        source: 'Sumber: Modul_08_Ekonomi... - Bab 6, Hal. 24'
      },
      {
        keywords: ['bank sentral', 'bank indonesia', 'tujuan bi', 'kebijakan moneter', 'bi rate'],
        answer: 'Tujuan tunggal Bank Indonesia (BI) menurut UU adalah mencapai dan memelihara kestabilan nilai rupiah, baik terhadap inflasi barang domestik maupun nilai tukar terhadap valuta asing (kurs). Untuk mencapainya, BI menjalankan kebijakan moneter: (1) Operasi Pasar Terbuka, (2) Penetapan Tingkat Diskonto (suku bunga), dan (3) Penetapan Giro Wajib Minimum (cadangan kas bank).',
        source: 'Sumber: Modul_08_Ekonomi... - Bab 2, Hal. 6'
      },
      {
        keywords: ['pasar modal', 'saham', 'obligasi', 'reksadana', 'ojk', 'bei', 'dividen', 'capital gain'],
        answer: 'Pasar modal adalah tempat bertemunya pihak yang membutuhkan dana jangka panjang (emiten/perusahaan) dengan pemilik dana (investor). Instrumen utamanya:\n1. 📈 **Saham**: Bukti kepemilikan modal suatu perusahaan. Keuntungan investor berupa **dividen** (bagi hasil laba) dan **capital gain** (keuntungan selisih harga jual).\n2. 📜 **Obligasi**: Surat pengakuan utang dari penerbit (pemerintah/korporasi) dengan imbalan pembayaran bunga kupon berkala dan pengembalian pokok saat jatuh tempo.\n3. 🧺 **Reksadana**: Wadah penghimpun dana dari masyarakat pemodal untuk dikelola manajer investasi ke portofolio efek.\nDiawasi oleh **Otoritas Jasa Keuangan (OJK)** dan diperdagangkan di **Bursa Efek Indonesia (BEI)**.',
        source: 'Sumber: Modul_08_Ekonomi... - Bab 4 & 5, Hal. 16-20'
      }
    ],
    quickPrompts: [
      'Apa itu inflasi dan apa penyebab utamanya?',
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

  // =========================================================================
  // MODUL 09: INFORMATIKA - ARSITEKTUR KOMPUTER DAN JARINGAN
  // =========================================================================
  {
    id: 'modul_09',
    code: 'MOD-INF-11-09',
    shortName: 'Modul_09_Informatika...',
    fullName: 'Modul 09: Informatika - Arsitektur Komputer dan Jaringan',
    subject: 'Informatika',
    totalHal: 36,
    icon: '💻',
    summary: 'Membahas arsitektur Von Neumann (CPU, ALU, CU, Fetch-Decode-Execute), hierarki memori (register, cache, RAM, storage), representasi data biner & heksadesimal, model jaringan OSI 7-layer vs TCP/IP, IP addressing, serta keamanan siber dasar.',
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
        keywords: ['cpu', 'apa itu cpu', 'fungsi cpu', 'prosesor', 'processor', 'von neumann', 'alu', 'control unit'],
        answer: 'CPU (Central Processing Unit) atau prosesor adalah "otak" komputer yang menjalankan instruksi program. Berdasarkan arsitektur Von Neumann, CPU terdiri dari 3 komponen inti:\n1. ⚙️ **ALU (Arithmetic Logic Unit)**: Melakukan perhitungan aritmatika (+, -, ×, ÷) dan operasi perbandingan logika (AND, OR, NOT).\n2. 🧭 **Control Unit (CU)**: Mengatur dan mengoordinasikan seluruh lalu lintas data serta sinyal kontrol komponen komputer.\n3. ⚡ **Register**: Memori internal berkecepatan sangat tinggi untuk menyimpan instruksi dan data yang sedang diproses saat itu juga.\n\nCPU bekerja dalam siklus **Fetch** (ambil instruksi dari RAM), **Decode** (terjemahkan kode instruksi), dan **Execute** (eksekusi perhitungan di ALU).',
        source: 'Sumber: Modul_09_Informatika... - Bab 1, Hal. 3'
      },
      {
        keywords: ['ram', 'rom', 'cache', 'memori komputer', 'beda ram dan rom'],
        answer: 'Perbedaan utama jenis memori komputer:\n1. **RAM (Random Access Memory)**: Memori kerja utama bersifat *volatile* (datanya hilang saat listrik mati). Berfungsi menyimpan data dan aplikasi yang sedang aktif berjalan agar CPU dapat mengaksesnya dengan cepat.\n2. **ROM (Read Only Memory)**: Memori non-volatile permanen yang memuat program dasar bootloader (BIOS/UEFI).\n3. **Cache Memory**: Memori perantara super cepat di dalam CPU (L1, L2, L3) untuk mengurangi jeda akses ke RAM.',
        source: 'Sumber: Modul_09_Informatika... - Bab 2, Hal. 6'
      },
      {
        keywords: ['osi layer', 'model osi', '7 layer osi', 'tcp ip'],
        answer: 'Model OSI (Open Systems Interconnection) membagi komunikasi jaringan menjadi 7 lapisan (dari bawah ke atas):\n1. Physical (sinyal fisik/kabel)\n2. Data Link (frame & MAC address)\n3. Network (paket & IP address / router)\n4. Transport (segmen TCP/UDP & port)\n5. Session (manajemen sesi)\n6. Presentation (enkripsi & format data)\n7. Application (antarmuka aplikasi seperti HTTP, DNS, SMTP).\nSedangkan model TCP/IP menyederhanakannya menjadi 4 layer: Network Access, Internet, Transport, dan Application.',
        source: 'Sumber: Modul_09_Informatika... - Bab 4, Hal. 16'
      }
    ],
    quickPrompts: [
      'Apa fungsi CPU dan komponen intinya dalam arsitektur Von Neumann?',
      'Jelaskan perbedaan antara RAM, ROM, dan Cache Memory!',
      'Sebutkan 7 lapisan pada Model Jaringan OSI!',
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

  // =========================================================================
  // MODUL 10: BAHASA INDONESIA - KAJIAN SASTRA DAN TEKS AKADEMIK
  // =========================================================================
  {
    id: 'modul_10',
    code: 'MOD-IND-11-10',
    shortName: 'Modul_10_B.Indonesia...',
    fullName: 'Modul 10: Bahasa Indonesia - Kajian Sastra dan Teks Akademik',
    subject: 'Bahasa Indonesia',
    totalHal: 36,
    icon: '📚',
    summary: 'Membahas karakteristik bahasa ragam ilmiah (lugas, baku, denotatif, objektif), sistematika karya tulis ilmiah, kaidah kutipan & parafrase anti-plagiarisme, format rujukan APA, struktur teks eksposisi/argumentasi, serta unsur intrinsik cerpen dan novel.',
    chapters: [
      { bab: 1, judul: 'Karakteristik Bahasa Ragam Ilmiah: Lugas, Baku, Denotatif, dan Objektif', hal: '1 - 4' },
      { bab: 2, judul: 'Sistematika Penyusunan Karya Tulis Ilmiah: Judul, Abstrak, dan Pendahuluan', hal: '5 - 8' },
      { bab: 3, judul: 'Kajian Pustaka, Kerangka Berpikir, dan Perumusan Hipotesis Penelitian', hal: '9 - 14' },
      { bab: 4, judul: 'Metode Penelitian Kualitatif dan Kuantitatif dalam Kajian Bahasa dan Sastra', hal: '15 - 18' },
      { bab: 5, judul: 'Teknik Kutipan Langsung, Parafrase Anti-Plagiarisme, dan Daftar Pustaka APA', hal: '19 - 22' },
      { bab: 6, judul: 'Struktur dan Ciri Kebahasaan Teks Eksposisi, Argumentasi, dan Resensi Kritis', hal: '23 - 26' },
      { bab: 7, judul: 'Analisis Unsur Intrinsik dan Ekstrinsik dalam Karya Sastra Cerpen dan Puisi', hal: '27 - 32' }
    ],
    qaPairs: [
      {
        keywords: ['ragam ilmiah', 'bahasa baku', 'denotatif', 'objektif', 'karya ilmiah'],
        answer: 'Ragam bahasa ilmiah memiliki 4 karakteristik utama:\n1. 📏 **Lugas**: Kalimat hemat kata, langsung menuju inti permasalahan tanpa berbelit-belit.\n2. 📘 **Baku**: Taat asas pada kaidah Ejaan yang Disempurnakan (EYD) dan kosakata baku KBBI.\n3. 🎯 **Denotatif**: Menggunakan makna harfiah yang sebenarnya, menghindari makna kiasan (*konotatif*) agar tidak menimbulkan multitafsir.\n4. ⚖️ **Objektif**: Berlandaskan fakta empiris yang teruji, bukan prasangka atau emosi subjektif penulis.',
        source: 'Sumber: Modul_10_B.Indonesia... - Bab 1, Hal. 3'
      },
      {
        keywords: ['teks eksposisi', 'struktur teks eksposisi', 'tujuan eksposisi'],
        answer: 'Teks eksposisi adalah teks nonfiksi yang bertujuan memaparkan atau menjelaskan informasi, pengetahuan, atau gagasan secara ringkas, padat, dan akurat agar menambah wawasan pembaca. Strukturnya terdiri dari:\n1. **Tesis (Pernyataan Pendapat)**: Sudut pandang penulis mengenai topik yang dibahas.\n2. **Rangkaian Argumen**: Alasan logis, data statistik, atau fakta konkret pendukung tesis.\n3. **Penegasan Ulang (Reiterasi)**: Perumusan kembali kesimpulan intisari teks.',
        source: 'Sumber: Modul_10_B.Indonesia... - Bab 6, Hal. 24'
      },
      {
        keywords: ['parafrase', 'plagiarisme', 'kutipan langsung', 'kutipan tidak langsung', 'daftar pustaka'],
        answer: 'Parafrase adalah teknik menuangkan ide atau informasi orang lain menggunakan susunan kalimat dan kosakata sendiri tanpa mengubah makna aslinya, guna mencegah plagiarisme. Aturan pentingnya: tetap harus menyertakan sitasi sumber penulis dan tahun penerbitan (misal: Smith, 2024).',
        source: 'Sumber: Modul_10_B.Indonesia... - Bab 5, Hal. 20'
      },
      {
        keywords: ['unsur intrinsik', 'unsur cerpen', 'majas', 'personifikasi', 'metafora'],
        answer: 'Unsur intrinsik karya sastra (cerpen/novel):\n• **Tema**: Ide sentral cerita.\n• **Tokoh & Penokohan**: Karakter dan watak pelaku.\n• **Alur (Plot)**: Rangkaian peristiwa (maju, mundur, atau campuran).\n• **Latar (Setting)**: Tempat, waktu, dan suasana.\n• **Sudut Pandang**: Posisi pencerita (orang pertama "aku" atau orang ketiga "dia/nama").\n• **Amanat**: Pesan moral yang ingin disampaikan pengarang.\n\nMajas populer: **Metafora** (perbandingan langsung tanpa kata pembanding) dan **Personifikasi** (melekatkan sifat manusia pada benda mati).',
        source: 'Sumber: Modul_10_B.Indonesia... - Bab 7, Hal. 28'
      }
    ],
    quickPrompts: [
      'Apa ciri utama bahasa ragam ilmiah yang denotatif?',
      'Bagaimana struktur teks eksposisi dan tujuannya?',
      'Jelaskan teknik parafrase untuk mencegah plagiarisme!',
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
