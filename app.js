const AppState = {
  theme: localStorage.getItem('ozod_theme') || 'parchment',
  script: localStorage.getItem('ozod_script') || 'latin',
  soundEnabled: localStorage.getItem('ozod_sound') === 'true',
  fontSize: 18,
  activeBookId: null,
};

const Translit = {
  toCyrillicText(text) {
    if (!text || typeof text !== 'string') return text;

    let res = text;

    const compounds = [
      { pattern: /o[‘'’ʻ]/g, rep: 'ў' },
      { pattern: /O[‘'’ʻ]/g, rep: 'Ў' },
      { pattern: /g[‘'’ʻ]/g, rep: 'ғ' },
      { pattern: /G[‘'’ʻ]/g, rep: 'Ғ' },
      { pattern: /sh/g, rep: 'ш' },
      { pattern: /Sh/g, rep: 'Ш' },
      { pattern: /SH/g, rep: 'Ш' },
      { pattern: /ch/g, rep: 'ч' },
      { pattern: /Ch/g, rep: 'Ч' },
      { pattern: /CH/g, rep: 'CH' },
      { pattern: /yo/g, rep: 'ё' },
      { pattern: /Yo/g, rep: 'Ё' },
      { pattern: /YO/g, rep: 'Ё' },
      { pattern: /yu/g, rep: 'ю' },
      { pattern: /Yu/g, rep: 'Ю' },
      { pattern: /YU/g, rep: 'Ю' },
      { pattern: /ya/g, rep: 'я' },
      { pattern: /Ya/g, rep: 'Я' },
      { pattern: /YA/g, rep: 'Я' },
      { pattern: /ye/g, rep: 'е' },
      { pattern: /Ye/g, rep: 'Е' },
      { pattern: /YE/g, rep: 'Е' },
      { pattern: /ts/g, rep: 'ц' },
      { pattern: /Ts/g, rep: 'Ц' },
      { pattern: /TS/g, rep: 'Ц' }
    ];

    compounds.forEach(item => {
      res = res.replace(item.pattern, item.rep);
    });

    res = res.replace(/(^|[\s\(\[\{"'«—])e/g, '$1э');
    res = res.replace(/(^|[\s\(\[\{"'«—])E/g, '$1Э');

    const singleMap = {
      'a': 'а', 'A': 'А',
      'b': 'б', 'B': 'Б',
      'd': 'д', 'D': 'Д',
      'e': 'е', 'E': 'Е',
      'f': 'ф', 'F': 'Ф',
      'g': 'г', 'G': 'Г',
      'h': 'ҳ', 'H': 'Ҳ',
      'i': 'и', 'I': 'И',
      'j': 'ж', 'J': 'Ж',
      'k': 'к', 'K': 'К',
      'l': 'л', 'L': 'Л',
      'm': 'м', 'M': 'М',
      'n': 'н', 'N': 'Н',
      'o': 'о', 'O': 'О',
      'p': 'п', 'P': 'П',
      'q': 'қ', 'Q': 'Қ',
      'r': 'р', 'R': 'Р',
      's': 'с', 'S': 'С',
      't': 'т', 'T': 'Т',
      'u': 'у', 'U': 'У',
      'v': 'в', 'V': 'В',
      'x': 'х', 'X': 'Х',
      'y': 'й', 'Y': 'Й',
      'z': 'з', 'Z': 'З'
    };

    res = res.split('').map(char => singleMap[char] || char).join('');

    res = res.replace(/([бвгджзйклмнпрстфхцчшщқғҳБВГДЖЗЙКЛМНПРСТФХЦЧШЩҚҒҲ])[‘'’ʻ]/g, '$1ъ');

    return res;
  },

  toCyrillicHTML(html) {
    if (!html || typeof html !== 'string') return html;
    const parts = html.split(/(<[^>]+>|&[a-zA-Z0-9#]+;)/g);
    return parts.map(part => {
      if ((part.startsWith('<') && part.endsWith('>')) || (part.startsWith('&') && part.endsWith(';'))) {
        return part;
      }
      return this.toCyrillicText(part);
    }).join('');
  },

  toLatinText(text) {
    if (!text || typeof text !== 'string') return text;

    let res = text;
    const compounds = [
      { pattern: /ш/g, rep: 'sh' }, { pattern: /Ш/g, rep: 'Sh' },
      { pattern: /ч/g, rep: 'ch' }, { pattern: /Ч/g, rep: 'Ch' },
      { pattern: /ё/g, rep: 'yo' }, { pattern: /Ё/g, rep: 'Yo' },
      { pattern: /ю/g, rep: 'yu' }, { pattern: /Ю/g, rep: 'Yu' },
      { pattern: /я/g, rep: 'ya' }, { pattern: /Я/g, rep: 'Ya' },
      { pattern: /ў/g, rep: 'o‘' }, { pattern: /Ў/g, rep: 'O‘' },
      { pattern: /ғ/g, rep: 'g‘' }, { pattern: /Ғ/g, rep: 'G‘' },
      { pattern: /ц/g, rep: 'ts' }, { pattern: /Ц/g, rep: 'Ts' }
    ];

    compounds.forEach(item => {
      res = res.replace(item.pattern, item.rep);
    });

    const singleMap = {
      'а': 'a', 'А': 'A',
      'б': 'b', 'Б': 'B',
      'д': 'd', 'Д': 'D',
      'е': 'e', 'Е': 'E',
      'э': 'e', 'Э': 'E',
      'ф': 'f', 'Ф': 'F',
      'г': 'g', 'Г': 'G',
      'ҳ': 'h', 'Ҳ': 'H',
      'х': 'x', 'Х': 'X',
      'и': 'i', 'И': 'I',
      'ж': 'j', 'Ж': 'J',
      'к': 'k', 'К': 'K',
      'қ': 'q', 'Қ': 'Q',
      'л': 'l', 'Л': 'L',
      'м': 'm', 'М': 'M',
      'n': 'н', 'N': 'Н',
      'о': 'o', 'О': 'O',
      'п': 'p', 'П': 'P',
      'р': 'r', 'Р': 'R',
      'с': 's', 'С': 'S',
      'т': 't', 'Т': 'T',
      'у': 'u', 'У': 'U',
      'в': 'v', 'В': 'V',
      'й': 'y', 'Й': 'Y',
      'з': 'z', 'З': 'Z',
      'ъ': '’', 'ь': ''
    };

    return res.split('').map(char => singleMap[char] || char).join('');
  },

  toLatinHTML(html) {
    if (!html || typeof html !== 'string') return html;
    const parts = html.split(/(<[^>]+>|&[a-zA-Z0-9#]+;)/g);
    return parts.map(part => {
      if ((part.startsWith('<') && part.endsWith('>')) || (part.startsWith('&') && part.endsWith(';'))) {
        return part;
      }
      return this.toLatinText(part);
    }).join('');
  }
};

function walkTextNodes(rootElement, callback) {
  if (!rootElement) return;

  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;

        const tag = parent.tagName.toLowerCase();
        if (tag === 'script' || tag === 'style' || tag === 'svg' || tag === 'path' || tag === 'code' || parent.classList.contains('no-translit')) {
          return NodeFilter.FILTER_REJECT;
        }

        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let node = walker.nextNode();
  while (node) {
    callback(node);
    node = walker.nextNode();
  }
}

function applyScript(script) {
  AppState.script = script;
  document.documentElement.setAttribute('data-script', script);
  localStorage.setItem('ozod_script', script);

  const badge = document.getElementById('currentScriptBadge');
  const switchLabel = document.getElementById('scriptSwitchLabel');
  if (badge) {
    badge.textContent = script === 'latin' ? 'LOTIN' : 'КИРИЛЛ';
  }
  if (switchLabel) {
    switchLabel.textContent = script === 'latin' ? '⇌ КИРИЛЛ' : '⇌ LOTIN';
  }

  walkTextNodes(document.body, (textNode) => {
    if (textNode._originalLatin === undefined) {
      textNode._originalLatin = textNode.nodeValue;
    }

    if (script === 'cyrillic') {
      textNode.nodeValue = Translit.toCyrillicText(textNode._originalLatin);
    } else {
      textNode.nodeValue = textNode._originalLatin;
    }
  });

  if (AppState.activeBookId) {
    refreshBookModalContent();
  }
}

const BooksDatabase = {
  zamon: {
    title: "Zamon. Qalb. Poeziya",
    year: "1962-yil · Toshkent, Badiiy Adabiyot Nashriyoti",
    category: "Adabiy Tanqid",
    content: `
      <h4>She’riyatda Samimiylik va Badiiyat Mezoni</h4>
      <p>
        She’r — shunchaki vaznli qofiyalar tizmasi yoki ma’lum bir sanaga bag‘ishlangan balandparvoz chaqiriq emas. She’riyat — bu qalbning eng chuqur, eng pinhona haroratidan otilib chiqqan faryoddir. Agar asarda muallifning yurak dardi bo‘lmasa, mingta chiroyli so‘z ham uni o‘lik vujudlikdan qutqara olmaydi.
      </p>
      <blockquote>
        “Haqiqiy poeziya zamon bilan hamnafas yashaydi, ammo u zamonning yuzaki qiyofasini emas, inson qalbining o‘sha zamondagi intilishlari va iztiroblarini ifodalashi lozim.”
      </blockquote>
      <p>
        Biz ko‘p yillar davomida poeziyani mafkuraning xizmatkoriga aylantirib qo‘ydik. Shoirlardan faqat g‘alaba, faqat qahramonlik haqida yozishni talab qildik. Vaholanki, inson qalbida shodlik bilan birga g‘am ham, iztirob ham, armon ham bo‘ladi. She’riyat bu murakkablikni aks ettirmas ekan, u o‘zining tarbiyaviy va estetik mohiyatini yo‘qotadi.
      </p>
      <p>
        Shoir har bir misra ustida zargar kabi ishlashi shart. Badiiylik — bu kashfiyotdir. Har bir yangi she’r o‘quvchiga olamning yangi bir qirrasini, inson tuyg‘ularining noma’lum bir jilosini kashf etib bermog‘i lozim.
      </p>
    `
  },
  cholpon: {
    title: "Cho‘lponni Anglash",
    year: "1994-yil · Toshkent, “Yozuvchi” Nashriyoti",
    category: "Jadidlar & Cho‘lpon",
    content: `
      <h4>Buyuk Shoirning Xalqqa Qaytishi</h4>
      <p>
        Abdulhamid Sulaymon o‘g‘li Cho‘lpon — XX asr o‘zbek she’riyatining eng yorqin, eng fojiali yulduzidir. Uni 1937-yilda jismonan yo‘q qildilar, so‘ngra yarim asrdan ortiq vaqt davomida uning nomini va merosini xalq xotirasidan o‘chirishga urindilar. Unga “burjua millatchisi”, “aksilinqilobchi” degan soxta yorliqlarni yopishtirdilar.
      </p>
      <blockquote>
        “Cho‘lponni oqlash — faqat bitta marhum shoir sha’nini tiklash emas, balki millatimizning toptalgan g‘ururini, o‘g‘irlangan ma’naviy boyligini o‘ziga qaytarish demakdir.”
      </blockquote>
      <p>
        Cho‘lpon she’rlaridagi musiqiylik va nafosat o‘zbek tilining qudratini ko‘rsatadi. Uning: “Ko‘ngil, sen munchalar nega / Kishanlar birla do‘stlashding?” degan misralari shunchaki she’r emas, bu butun boshli Turkistonning uyg‘onish manifesti edi.
      </p>
      <p>
        U o‘z asarlarida mustaqillikni, milliy erkinlikni va inson sha’nini kuyladi. Biz bugun istiqlol mevasidan bahramand bo‘lar ekanmiz, Cho‘lpon kabi fidoiylarning ruhi oldida doimo bosh eguvchimiz.
      </p>
    `
  },
  etiqod: {
    title: "E’tiqodimni Nega O‘zgartirdim?",
    year: "1997-yil · “Tafakkur” Jurnali",
    category: "Publitsistika & Iqror",
    content: `
      <h4>Bir Ziyolining Vijdoni Tazarrusi</h4>
      <p>
        Ushbu maqolani yozish men uchun oson kechmadi. Bu — qariyb yetmish yillik umrimning sarhisobi, qalbimning shafqatsiz tahlilidir. Men uzoq yillar sovet mafkurasining sofligiga, uning insoniyatga baxt keltirishiga ishonib yashaganman. Universitetda talabalarga shu g‘oyalarni o‘rgatganman.
      </p>
      <blockquote>
        “Xato qilish inson tabiatiga xos. Ammo xatoni bila turib unda qaysarlik bilan turib olish — xiyonatdir. Adashganini tan olish esa ruhning poklanishidir.”
      </blockquote>
      <p>
        Qachonki biz qatag‘on hujjatlarini, 1937-yil fojialarini, Fitrat, Cho‘lpon, Qodiriy, Usmon Nosir kabi daholarimizning qanday shafqatsizlik bilan mahv etilganini o‘z ko‘zimiz bilan ko‘rganimizda, ichimizda qandaydir poydevor qulab tushdi.
      </p>
      <p>
        Meni o‘z e’tiqodimni o‘zgartirganlikda ayblaganlarga javobim bitta: men millatimning ozodligini, inson qadr-qimmatini va mustaqil vatanimni har qanday qotib qolgan aqidalardan ustun qo‘yaman!
      </p>
    `
  },
  ijod: {
    title: "Ijodni Anglash Baxti",
    year: "2004-yil · “Sharq” Nashriyoti",
    category: "Monografiyalar",
    content: `
      <h4>Badiiy So‘z Sehri va Adabiy Portretlar</h4>
      <p>
        Yozuvchilik — qismat. Ijodkor o‘z asari orqali xalqning qalbini xaritaga tushiradi. Abdulla Qahhorning temirdek qat’iy va lo‘nda jumlalari, Oybekning ohangdor va lirik tabiati, G‘afur G‘ulomning donishmandona xalqchilligi — bularning har biri alohida bir dunyo.
      </p>
      <blockquote>
        “Ijodni anglash — bu shunchaki kitobni varaqlash emas. Bu muallif bilan birga iztirob chekish, uning qahramonlari bilan birga yashash va ulg‘ayish demakdir.”
      </blockquote>
      <p>
        Kitobxon asarni o‘qiyotganda o‘zining ichki dunyosini tozalaydi. Yaxshi asar odamni yovuzlikdan qaytaradi, mehr-oqibatga chorlaydi. Agar adabiyot insonni yaxshiroq, saxiyroq va vijdoni pokroq qilmasa, u o‘z vazifasini bajara olmagan bo‘ladi.
      </p>
      <p>
        Ushbu kitob mening umr bo‘yi adabiyot deb atalgan muqaddas dargohga qilgan xizmatimning kamtarona xulosasidir.
      </p>
    `
  },
  sardaftar: {
    title: "Sardaftar Sahifalari",
    year: "1999-yil · Toshkent Nashriyoti",
    category: "Xotiralar & O‘ylar",
    content: `
      <h4>Xotiralar, Ustozlar va Hayot Saboqlari</h4>
      <p>
        Oxunqaynarda o‘tgan bolaligim, Toshkentdagi 14-maktab, O‘rta Osiyo davlat universitetining yog‘och zinalari... O‘tgan yillar kino lentasidek ko‘z oldimdan o‘tadi.
      </p>
      <blockquote>
        “Inson hayotida ustozning o‘rni beqiyos. Bizga adabiyotni sevishni o‘rgatgan buyuk zotlar oldida bir umr qarzdormiz.”
      </blockquote>
      <p>
        Men hayotim davomida juda ko‘p murakkab shaxslar bilan uchrashdim. Ularning har biri mening xarakterimga, dunyoqarashimga o‘z ta’sirini o‘tkazdi. Bu xotiralar — shaxsiy kechinmalar emas, balki butun bir adabiy davrning tirik guvohligidir.
      </p>
    `
  },
  darslik: {
    title: "Adabiyot — Hayot Darsligi",
    year: "1981-yil · Toshkent Nashriyoti",
    category: "Estetik Dastur",
    content: `
      <h4>Adabiyot va Yosh Avlod Kamoloti</h4>
      <p>
        Nega biz adabiyotni hayot darsligi deb ataymiz? Chunki inson matematika yoki fizikadan koinot qonuniyatlarini o‘rgansa, adabiyotdan inson bo‘lish san’atini o‘rganadi.
      </p>
      <blockquote>
        “Badiiy adabiyot didni tarbiyalaydi. Did esa insonning har bir xatti-harakatida, so‘zlashuvida, hatto kiyinishida ham namoyon bo‘ladi.”
      </blockquote>
      <p>
        Kitob o‘qigan inson boshqalarning dardini his qila oladi. Unda empatiya, rahm-shafqat paydo bo‘ladi. Ma’naviyati boy xalqni hech qachon yengib bo‘lmaydi.
      </p>
    `
  }
};

const InterviewData = {
  qa1: {
    answer: [
      "“Inson hayotida eng dahshatli narsa — o‘z-o‘zini aldab yashashdir. Men ham ko‘pchilik qatori sovet mafkurasiga ishonganman, uning shiorlariga ergashganman. Ammo istiqlol arafasida va mustaqillik yillarida ko‘zimiz ochildi: bu tuzum millatimizning sara ziyolilarini qirib tashlaganini, ruhiyatimizni mayib qilganini ko‘rdik.",
      "Rossiya Kommunistik partiyasi rahbari Zyuganovning ‘o‘z e’tiqodini o‘zgartirganlardan hazar qilaman’ degan gapi qalbimga nayza bo‘lib sanchildi. O‘shanda men o‘zimga aytdim: agar xato yo‘ldan ketayotganingni bilsang-u, o‘jarlik bilan o‘sha botqoqda qolsang, bu vafodorlik emas, nodonlikdir! Haqiqatni tan olish va o‘tmish xatolaridan saboq chiqarish — har bir ziyolining vijdoni oldidagi farzidir.”"
    ],
    cite: "— “E’tiqodimni nega o‘zgartirdim?” asari va intervyulardan"
  },
  qa2: {
    answer: [
      "“Adabiy tanqid — jazo organi emas! Afsuski, sho‘ro davrida tanqidchi qaysidir asarga ‘hukm chiqaruvchi qozikalon’ qilib qo‘yilgan edi. Haqiqiy tanqidchi — yozuvchining do‘sti, uning sirdoshi va asaridagi nozik go‘zalliklarni kitobxonga ochib beruvchi ko‘prikdir.",
      "Tanqidchi asarni tahlil qilish uchun o‘sha asar muallifidan kam bo‘lmagan darajada adabiyotni, tilni va qalb psixologiyasini bilishi shart. Fikr dalil bilan, mehr bilan aytilishi kerak.”"
    ],
    cite: "— “Adabiy etyudlar” va ma’ruzalaridan"
  },
  qa3: {
    answer: [
      "“Cho‘lponning mislsiz samimiyati va uning dardli she’rlari menga kuch berdi. Uning she’rlarini o‘qiganimda, qulog‘im ostida erkinlik uchun kurashgan butun bir avlodning ovozi jaranglardi.",
      "Unga nisbatan qilingan tuhmatlar shu qadar jirkanch va asossiz ediki, agar uning haqiqatini aytmasak, keyingi avlodlar bizni kechirmas edi. Men faqat burchimni bajardim, xolos.”"
    ],
    cite: "— “Cho‘lponni anglash” kitobi muqaddimasidan"
  },
  qa4: {
    answer: [
      "“Yo‘q, mutlaqo mumkin emas! O‘z qobig‘iga o‘ralib qolgan har qanday madaniyat tanazzulga yuz tutadi. Alisher Navoiy bobomiz ham o‘z davrida Sharqning barcha ilm-fani va adabiy durdonalarini o‘zlashtirib, so‘ng o‘zbek tilida beqiyos asarlar yaratganlar.",
      "Biz ‘Jahon adabiyoti’ jurnalini tashkil etganimizning boisi ham shu: o‘zbek o‘quvchisi Markesni, Heminqueyni, Kafkani, Kamyuni, Koeloni o‘z ona tilida o‘qisin, tafakkuri kengaysin.”"
    ],
    cite: "— “Jahon adabiyoti” jurnali tahririyat maqolalaridan"
  },
  qa5: {
    answer: [
      "“Tafakkur erkinligi! Tana xasta bo‘lishi mumkin, oyoqlar yurmasligi mumkin, ammo agar miyangiz ishlayotgan, qalbingiz yonayotgan bo‘lsa, siz tiriksiz! Men kasallikka taslim bo‘lishni istamadim.",
      "Shogirdlarim, qizlarim kelib turishdi, men aytib turdim, ular qog‘ozga tushirishdi. Mehnat insonni darddan chalg‘itadi, unga yangi hayot bag‘ishlaydi. Oxirgi nafasimgacha xalqimga foydali bir so‘z qoldirish orzusi meni oyoqda tutib turdi.”"
    ],
    cite: "— Hayotining so‘nggi yillaridagi xotira suhbatlaridan"
  }
};

const QuotesPool = [
  { text: "Fikr esa g‘oyibdan hosil bo‘lmaydi. Fikr — bilimning, izlanishning va eng muhimi, uyg‘oq vijdonning hosilasidir.", author: "Ozod Sharafiddinov · “Zamon. Qalb. Poeziya”" },
  { text: "Qachonki sen biror narsani chin dildan orzu qilsang, butun Koinot unga erishishing uchun senga yordamga keladi...", author: "Paulo Koelo (Ozod Sharafiddinov tarjimasi)" },
  { text: "Tanqid — bu adabiyotdagi go‘zallikni kashf etish va uning badiiy qonuniyatlarini xalqqa tushuntirib berish san’atidir.", author: "Ozod Sharafiddinov · “Adabiy etyudlar”" },
  { text: "Cho‘lponni anglash — millatning o‘zligini, o‘z sha’nini va ozodlik qadrini anglashi demakdir.", author: "Ozod Sharafiddinov · “Cho‘lponni anglash”" },
  { text: "Vatan bizga ato etilgan ulug‘ ne’mat ekan, Vatanga muhabbat ham har birimizning qalbimizdagi muqaddas burchdir.", author: "Ozod Sharafiddinov · “Ma’naviy kamolot yo‘llarida”" },
  { text: "Adashganini tan olish — ojizlik emas, balki ruhning poklanishi va katta ma’naviy jasoratdir.", author: "Ozod Sharafiddinov · “E’tiqodimni nega o‘zgartirdim?”" },
  { text: "Kitob o‘qimaydigan xalqning kelajagi tumanli bo‘ladi. Adabiyot kishiga nafis did va mehr-shafqat bag‘ishlaydi.", author: "Ozod Sharafiddinov · “Ijodni anglash baxti”" }
];

class AmbianceSoundEngine {
  constructor() {
    this.ctx = null;
  }

  getContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playActivationChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const playTone = (freq, startDelay, duration, gainVal) => {
      const t = ctx.currentTime + startDelay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(gainVal, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    };

    playTone(523.25, 0.0, 0.28, 0.35);
    playTone(783.99, 0.1, 0.4, 0.4);
  }

  playTypewriterClick() {
    if (!AppState.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.06);

    oscGain.gain.setValueAtTime(0.38, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);

    const bufferSize = Math.floor(ctx.sampleRate * 0.04);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.32, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(t);
  }

  playPaperRustle() {
    if (!AppState.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const duration = 0.22;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.exponentialRampToValueAtTime(500, t + duration);
    filter.Q.setValueAtTime(2.5, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
  }
}

const SoundEngine = new AmbianceSoundEngine();

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(AppState.theme);
  applyScript(AppState.script);
  updateSoundUI();

  setupNavigation();
  setupThemeDropdown();
  setupScriptToggle();
  setupSoundToggle();
  setupBookshelf();
  setupTranslationAtelier();
  setupWisdomEngine();
  setupInterviewExplorer();
  setupReaderModal();
  setupScrollProgress();
});

function applyTheme(themeName) {
  document.body.className = `theme-${themeName}`;
  document.documentElement.setAttribute('data-theme', themeName);
  AppState.theme = themeName;
  localStorage.setItem('ozod_theme', themeName);

  const themeDisplayNames = {
    parchment: "Sardaftar",
    obsidian: "Tafakkur",
    editorial: "Jahon Adabiyoti"
  };

  const nameEl = document.getElementById('currentThemeName');
  if (nameEl) nameEl.textContent = themeDisplayNames[themeName] || "Sardaftar";

  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === themeName);
  });
}

function setupThemeDropdown() {
  const dropdownBtn = document.getElementById('themeDropdownBtn');
  const themeMenu = document.getElementById('themeMenu');

  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('show');
    SoundEngine.playTypewriterClick();
  });

  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const selected = opt.dataset.theme;
      applyTheme(selected);
      themeMenu.classList.remove('show');
      SoundEngine.playTypewriterClick();
    });
  });

  document.addEventListener('click', () => {
    if (themeMenu) themeMenu.classList.remove('show');
  });
}

function setupScriptToggle() {
  const scriptBtn = document.getElementById('scriptToggleBtn');
  scriptBtn.addEventListener('click', () => {
    const nextScript = AppState.script === 'latin' ? 'cyrillic' : 'latin';
    applyScript(nextScript);
    SoundEngine.playPaperRustle();
    showToast(nextScript === 'cyrillic' ? "Кирилл ёзувига ўтказилди" : "Lotin yozuviga o‘tkazildi");
  });
}

function updateSoundUI() {
  const soundBtn = document.getElementById('soundToggleBtn');
  const onIcon = soundBtn.querySelector('.sound-on-icon');
  const offIcon = soundBtn.querySelector('.sound-off-icon');

  if (AppState.soundEnabled) {
    onIcon.style.display = 'block';
    offIcon.style.display = 'none';
    soundBtn.classList.add('active');
  } else {
    onIcon.style.display = 'none';
    offIcon.style.display = 'block';
    soundBtn.classList.remove('active');
  }
}

function setupSoundToggle() {
  const soundBtn = document.getElementById('soundToggleBtn');
  soundBtn.addEventListener('click', () => {
    AppState.soundEnabled = !AppState.soundEnabled;
    localStorage.setItem('ozod_sound', AppState.soundEnabled);
    updateSoundUI();
    if (AppState.soundEnabled) {
      SoundEngine.getContext();
      SoundEngine.playActivationChime();
      showToast("Adabiy muhit tovushlari yoqildi 🔔");
    } else {
      showToast("Tovushlar o‘chirildi");
    }
  });
}

function setupBookshelf() {
  const filterBtns = document.querySelectorAll('.lib-filter-btn');
  const bookItems = document.querySelectorAll('.book-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      SoundEngine.playTypewriterClick();

      const category = btn.dataset.category;
      bookItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.btn-read-book, .book-card').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const bookItem = trigger.closest('.book-item');
      if (bookItem) {
        const bookId = bookItem.dataset.bookId;
        openBookModal(bookId);
      }
    });
  });
}

function openBookModal(bookId) {
  AppState.activeBookId = bookId;
  const modal = document.getElementById('bookReaderModal');
  refreshBookModalContent();
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  SoundEngine.playPaperRustle();
}

function refreshBookModalContent() {
  if (!AppState.activeBookId) return;
  const book = BooksDatabase[AppState.activeBookId];
  if (!book) return;

  const titleEl = document.getElementById('modalBookTitle');
  const catEl = document.getElementById('modalBookCategory');
  const yearEl = document.getElementById('modalBookYear');
  const bodyEl = document.getElementById('modalChapterContent');

  let title = book.title;
  let category = book.category;
  let year = book.year;
  let content = book.content;

  if (AppState.script === 'cyrillic') {
    title = Translit.toCyrillicText(title);
    category = Translit.toCyrillicText(category);
    year = Translit.toCyrillicText(year);
    content = Translit.toCyrillicHTML(content);
  }

  titleEl.textContent = title;
  catEl.textContent = category;
  yearEl.textContent = year;
  bodyEl.innerHTML = content;
}

function closeBookModal() {
  const modal = document.getElementById('bookReaderModal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
  AppState.activeBookId = null;
  SoundEngine.playTypewriterClick();
}

function setupReaderModal() {
  const closeBtn = document.getElementById('closeBookModalBtn');
  const backdrop = document.getElementById('modalBackdrop');
  const incBtn = document.getElementById('increaseFontSizeBtn');
  const decBtn = document.getElementById('decreaseFontSizeBtn');
  const scrollBtn = document.getElementById('readerScrollTop');
  const readerBody = document.getElementById('readerBody');

  if (closeBtn) closeBtn.addEventListener('click', closeBookModal);
  if (backdrop) backdrop.addEventListener('click', closeBookModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBookModal();
  });

  if (incBtn) {
    incBtn.addEventListener('click', () => {
      if (AppState.fontSize < 26) {
        AppState.fontSize += 2;
        readerBody.style.fontSize = `${AppState.fontSize}px`;
        SoundEngine.playTypewriterClick();
      }
    });
  }

  if (decBtn) {
    decBtn.addEventListener('click', () => {
      if (AppState.fontSize > 14) {
        AppState.fontSize -= 2;
        readerBody.style.fontSize = `${AppState.fontSize}px`;
        SoundEngine.playTypewriterClick();
      }
    });
  }

  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      readerBody.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function setupTranslationAtelier() {
  const tabs = document.querySelectorAll('.trans-tab');
  const panels = document.querySelectorAll('.trans-content-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      SoundEngine.playPaperRustle();

      const targetId = `trans-${tab.dataset.transTarget}`;
      panels.forEach(p => {
        p.classList.toggle('active', p.id === targetId);
      });
    });
  });
}

function setupWisdomEngine() {
  const tagBtns = document.querySelectorAll('.tag-btn');
  const quoteCards = document.querySelectorAll('.quote-card');
  const generateBtn = document.getElementById('generateQuoteBtn');
  const randomDisplay = document.getElementById('randomQuoteDisplay');
  const randomAuthor = document.getElementById('randomQuoteAuthor');

  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tagBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      SoundEngine.playTypewriterClick();

      const tag = btn.dataset.tag;
      quoteCards.forEach(card => {
        if (tag === 'all' || card.dataset.tag === tag) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      SoundEngine.playTypewriterClick();
      generateBtn.style.transform = 'scale(0.95)';
      setTimeout(() => { generateBtn.style.transform = ''; }, 150);

      const randomIdx = Math.floor(Math.random() * QuotesPool.length);
      const chosen = QuotesPool[randomIdx];

      let text = chosen.text;
      let author = chosen.author;

      if (AppState.script === 'cyrillic') {
        text = Translit.toCyrillicText(text);
        author = Translit.toCyrillicText(author);
      }

      randomDisplay.style.opacity = '0';
      setTimeout(() => {
        randomDisplay.textContent = text;
        randomAuthor.textContent = author;
        randomDisplay.style.opacity = '1';
      }, 200);
    });
  }

  document.querySelectorAll('.copy-quote-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.quote-card');
      const quoteText = card.querySelector('.quote-body').innerText.trim();
      const quoteSource = card.querySelector('.quote-source').innerText.trim();
      const fullCopy = `“${quoteText}”\n— ${quoteSource}\n(Ozod Sharafiddinov Raqamli Sanctuary)`;

      navigator.clipboard.writeText(fullCopy).then(() => {
        SoundEngine.playTypewriterClick();
        showToast("Iqtibos nusxalandi!");
      }).catch(() => {
        showToast("Nusxa olishda xatolik yuz berdi");
      });
    });
  });
}

function setupInterviewExplorer() {
  const qBtns = document.querySelectorAll('.iq-btn');
  const answerContent = document.getElementById('iapContent');

  qBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      qBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      SoundEngine.playTypewriterClick();

      const qaId = btn.dataset.qaId;
      const data = InterviewData[qaId];
      if (!data) return;

      let p1 = data.answer[0];
      let p2 = data.answer[1];
      let cite = data.cite;

      if (AppState.script === 'cyrillic') {
        p1 = Translit.toCyrillicText(p1);
        p2 = Translit.toCyrillicText(p2);
        cite = Translit.toCyrillicText(cite);
      }

      answerContent.style.opacity = '0';
      setTimeout(() => {
        answerContent.innerHTML = `
          <p>${p1}</p>
          <p>${p2}</p>
          <div class="iap-cite">${cite}</div>
        `;
        answerContent.style.opacity = '1';
      }, 200);
    });
  });
}

function setupNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        SoundEngine.playTypewriterClick();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function setupScrollProgress() {
  const progressBar = document.getElementById('readingProgressBar');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const msgEl = document.getElementById('toastMsg');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}
