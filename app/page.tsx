'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, Star, ExternalLink, ScanLine, ArrowRight, ChevronDown, Globe, ShieldCheck, Clock, Minus, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- СЛОВАРЬ ПЕРЕВОДОВ ---
const translations = {
  ru: {
    navFeatures: "Преимущества",
    navFaq: "Вопросы",
    
    heroTitle: "Найди лучшую цену",
    heroSubtitle: "Мгновенное сравнение товаров на Wildberries и Kaspi.kz с помощью Искусственного Интеллекта. Экономьте до 40% на каждой покупке.",
    tryBtn: "Начать поиск",
    
    uploadTitle: "Загрузите изображение",
    uploadDesc: "Перетащите файл или кликните для поиска",
    tryNowHint: "Попробуйте прямо сейчас — это бесплатно",
    scanning: "ИИ анализирует товар...",
    scanBtn: "Скан",
    
    resultsTitle: "Найдено предложений",
    itemsCount: "товаров",
    noResultsWB: "На Wildberries пока пусто",
    noResultsKaspi: "На Kaspi.kz не найдено",
    
    reviews: "отзывов",
    noReviews: "Новинка",
    price: "Цена",
    
    featuresTitle: "Почему Searcher W-K?",
    featuresSubtitle: "Особенности",
    feat1Title: "Точность ИИ",
    feat1Desc: "Наш алгоритм распознает бренды, модели и цвета с точностью 98%.",
    feat2Title: "Мгновенный результат",
    feat2Desc: "Поиск по двум маркетплейсам занимает менее 3 секунд.",
    feat3Title: "Честное сравнение",
    feat3Desc: "Мы не продвигаем магазины. Мы просто показываем, где дешевле.",
    
    statsTitle: "Доверяют тысячи",
    stat1: "Поисков в сутки",
    stat2: "Сэкономлено",
    stat3: "Товаров в базе",
    
    faqTitle: "Частые вопросы",
    faq1Q: "Это бесплатно?",
    faq1A: "Да, базовый функционал поиска полностью бесплатен для всех пользователей.",
    faq2Q: "Какие товары можно искать?",
    faq2A: "Любые: одежду, технику, мебель, игрушки. Главное, чтобы фото было четким.",
    
    ctaTitle: "Готовы экономить?",
    ctaDesc: "Присоединяйтесь к умному шопингу уже сегодня.",
    
    footer: "Searcher W-K © 2026. Все права защищены."
  },
  en: {
    navFeatures: "Features",
    navFaq: "FAQ",

    heroTitle: "Find the Best Price",
    heroSubtitle: "Instant product comparison on Wildberries and Kaspi.kz powered by Artificial Intelligence. Save up to 40% on every purchase.",
    tryBtn: "Start Searching",
    
    uploadTitle: "Upload Product Photo",
    uploadDesc: "Drag & drop or click to scan",
    tryNowHint: "Try it right now — it's free",
    scanning: "AI is analyzing...",
    scanBtn: "Scan",
    
    resultsTitle: "Search Results",
    itemsCount: "items",
    noResultsWB: "Not found on WB",
    noResultsKaspi: "Not found on Kaspi",
    
    reviews: "reviews",
    noReviews: "New",
    price: "Price",
    
    featuresTitle: "Why Searcher W-K?",
    featuresSubtitle: "Features",
    feat1Title: "AI Precision",
    feat1Desc: "Our algorithm recognizes brands, models, and colors with 98% accuracy.",
    feat2Title: "Instant Results",
    feat2Desc: "Searching across two marketplaces takes less than 3 seconds.",
    feat3Title: "Fair Comparison",
    feat3Desc: "We don't promote stores. We simply show you where it's cheaper.",
    
    statsTitle: "Trusted by Thousands",
    stat1: "Daily Searches",
    stat2: "Money Saved",
    stat3: "Products Indexed",
    
    faqTitle: "FAQ",
    faq1Q: "Is it free?",
    faq1A: "Yes, the basic search functionality is completely free for all users.",
    faq2Q: "What products can I search for?",
    faq2A: "Anything: clothes, electronics, furniture, toys. Just make sure the photo is clear.",
    
    ctaTitle: "Ready to save?",
    ctaDesc: "Join smart shopping today.",
    
    footer: "Searcher W-K © 2026. All rights reserved."
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerSectionRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];

  const scrollToScanner = () => {
    const target = scannerSectionRef.current;
    if (!target) return;
    const startPosition = window.scrollY;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80; 
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let startTime: number | null = null;

    const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    requestAnimationFrame(animation);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      handleScan(file);
      setTimeout(scrollToScanner, 100); 
    }
  };

  const handleScan = async (file: File) => {
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
    const res = await axios.post('https://nonmalarious-eusebia-nonformidably.ngrok-free.dev/scan', formData, {
  headers: { 
    'Content-Type': 'multipart/form-data',
    'ngrok-skip-browser-warning': 'true'
  },
  
});
      setResult(res.data);
    } catch (err) {
      alert('Ошибка подключения (Connection Error)');
    } finally {
      setLoading(false);
    }
  };
const [textQuery, setTextQuery] = useState('');
const [textLoading, setTextLoading] = useState(false);

// Функция поиска по тексту
const handleTextSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textQuery.trim() || textLoading) return;

    setTextLoading(true); // Включаем загрузку
    setResult(null);
    setPreview(null);

    try {
        const res = await axios.post('https://nonmalarious-eusebia-nonformidably.ngrok-free.dev/search-text', 
            { query: textQuery },
            { headers: { 'ngrok-skip-browser-warning': 'true' } }
        );
        setResult(res.data);
        setTimeout(scrollToScanner, 100);
    } catch (err) {
        alert('Ошибка поиска');
    } finally {
        setTextLoading(false); // Выключаем загрузку
    }
};

const clearAll = () => {
    setTextQuery('');
    setPreview(null);
    setImage(null);
    setResult(null);
};

// Проверяем, заблокировано ли фото (если есть текст или идет поиск по тексту)
const isPhotoDisabled = textQuery.length > 0 || textLoading;
// Проверяем, заблокирован ли текст (если уже загружено фото)
const isTextDisabled = preview !== null || loading;
  const wbItems = result?.results.filter((i: any) => i.store === 'Wildberries') || [];
  const kaspiItems = result?.results.filter((i: any) => i.store === 'Kaspi') || [];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100">
      
      {/* --- HEADER --- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => window.location.reload()}>
             <div className="relative flex items-center justify-center w-10 h-10 bg-slate-900 rounded-xl shadow-lg hover:rotate-3 transition-transform">
              <div className="relative w-10 h-10 hover:rotate-3 transition-transform cursor-pointer">
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full shadow-lg rounded-xl">
        <rect width="100" height="100" rx="25" fill="#0f172a" />
        <text x="50" y="55" fontFamily="monospace" fontWeight="bold" fontSize="40" fill="white" textAnchor="middle" dominantBaseline="middle" letterSpacing="-3">W-K</text>
    </svg>
</div>
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-slate-900 tracking-tight">Searcher</span>
             </div>
           </div>

           <div className="flex items-center gap-2 md:gap-6">
             <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
                <a href="#features" className="hover:text-slate-900 transition-colors">{t.navFeatures}</a>
                <a href="#faq" className="hover:text-slate-900 transition-colors">{t.navFaq}</a>
             </div>
             <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
             <button 
                onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors px-2 py-1 bg-slate-50 rounded-lg border border-slate-100"
             >
                <Globe size={14} />
                <span>{lang.toUpperCase()}</span>
             </button>
             <button 
                onClick={scrollToScanner}
                className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-600 transition-all shadow-lg hover:shadow-purple-500/30 active:scale-95"
             >
                {t.scanBtn}
             </button>
           </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-white pt-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 px-6">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]"
            >
                Searcher <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 pr-2">W-K</span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed font-light"
            >
                {t.heroSubtitle}
            </motion.p>

            <motion.div
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                 className="flex flex-col md:flex-row gap-4"
            >
                <button 
                    onClick={scrollToScanner}
                    className="group relative inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all duration-300 shadow-2xl shadow-slate-900/20 hover:-translate-y-1"
                >
                    {t.tryBtn}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>
        </div>

        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
            onClick={scrollToScanner}
            className="absolute bottom-10 cursor-pointer text-slate-300 hover:text-purple-600 transition-colors p-4"
        >
            <ChevronDown size={32} />
        </motion.div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
        </div>
      </section>

      {/* --- SCANNER SECTION --- */}
      <div ref={scannerSectionRef} className="bg-slate-50 min-h-[60vh] h-auto py-32 px-4 relative scroll-mt-20 border-y border-slate-200">
        <main className="max-w-6xl mx-auto">
            <div className="w-full max-w-3xl mx-auto mb-10 px-4">
            <form onSubmit={handleTextSearch} className="relative group">
                <div className="relative flex items-center">
                    <input 
                        type="text"
                        value={textQuery}
                        onChange={(e) => setTextQuery(e.target.value)}
                        disabled={isTextDisabled} // Блокируется только если УЖЕ загружено ФОТО
                        placeholder={isTextDisabled ? "Удалите фото для поиска текстом" : "Название товара..."}
                        className={`w-full bg-white border-2 rounded-2xl py-5 px-6 pr-28 text-lg outline-none transition-all shadow-sm 
                            ${isTextDisabled 
                                ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'border-slate-200 focus:border-purple-500 focus:shadow-xl focus:shadow-purple-500/10'}`}
                    />
                    
                    <div className="absolute right-3 flex items-center gap-2">
                        {/* Кнопка отмены/очистки */}
                        {(textQuery.length > 0 || preview) && (
                            <button 
                                type="button"
                                onClick={clearAll}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                title="Очистить всё"
                            >
                                <Plus className="rotate-45" size={24} />
                            </button>
                        )}

                        {/* Кнопка поиска */}
                        <button 
                            type="submit"
                            disabled={isTextDisabled || textLoading || !textQuery.trim()}
                            className={`p-3 rounded-xl transition-all flex items-center justify-center min-w-[48px]
                                ${textLoading ? 'bg-purple-100' : 'bg-slate-900 text-white hover:bg-purple-600'}
                                ${isTextDisabled ? 'hidden' : 'flex'}`} // Скрываем только если активен режим фото
                        >
                            {textLoading ? (
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"
                                />
                            ) : (
                                <Search size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
            {/* INPUT AREA */}
            <div className={`relative flex flex-col items-center justify-center mb-20 transition-all duration-500 
            ${isPhotoDisabled ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
                disabled={isPhotoDisabled} 
            />

            {/* Сообщение-подсказка при блокировке */}
            {isPhotoDisabled && !textLoading && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                        Активен текстовый поиск
                    </span>
                </div>
            )}

            {preview ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative group w-80 h-80 rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-white bg-white">
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center z-10">
                            <div className="w-16 h-16 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mb-6"/>
                            <p className="text-sm font-bold text-slate-800 uppercase animate-pulse">{t.scanning}</p>
                        </div>
                    )}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center w-full">
                    <div 
                        onClick={() => !isPhotoDisabled && fileInputRef.current?.click()} 
                        className="w-full max-w-3xl h-72 border-2 border-dashed border-slate-300 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all group bg-white relative overflow-hidden"
                    >
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                            <Camera size={32} className="text-slate-400 group-hover:text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">{t.uploadTitle}</h3>
                        <p className="text-slate-400 mt-2">{t.uploadDesc}</p>
                    </div>
                </div>
            )}
        </div>

            {/* RESULTS AREA */}
            <AnimatePresence mode="wait">
            {result && (
                <motion.div 
                    initial={{ opacity: 0, y: 40 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                <div className="text-center mb-16">
                    <span className="text-purple-600 font-bold uppercase tracking-widest text-xs mb-2 block">{t.resultsTitle}</span>
                    <h2 className="text-4xl font-black text-slate-900 capitalize">{result.query}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    
                    {/* Wildberries Column */}
                    <div className="space-y-6">
                        <Header store="Wildberries" color="purple" count={wbItems.length} t={t} />
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-5">
                            {wbItems.length > 0 ? wbItems.map((item: any, idx: number) => (
                                <motion.div variants={itemVariants} key={idx}>
                                    <Card item={item} color="purple" t={t} />
                                </motion.div>
                            )) : <EmptyState text={t.noResultsWB} />}
                        </motion.div>
                    </div>

                    {/* Kaspi Column */}
                    <div className="space-y-6">
                        <Header store="Kaspi.kz" color="red" count={kaspiItems.length} t={t} />
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-5">
                             {kaspiItems.length > 0 ? kaspiItems.map((item: any, idx: number) => (
                                <motion.div variants={itemVariants} key={idx}>
                                    <Card item={item} color="red" t={t} />
                                </motion.div>
                            )) : <EmptyState text={t.noResultsKaspi} />}
                        </motion.div>
                    </div>

                </div>
                </motion.div>
            )}
            </AnimatePresence>
        </main>
      </div>

      {/* --- STATS SECTION --- */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
                  <div className="py-4">
                      <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2">15,000+</p>
                      <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">{t.stat1}</p>
                  </div>
                  <div className="py-4">
                      <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2">₸ 40M+</p>
                      <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">{t.stat2}</p>
                  </div>
                  <div className="py-4">
                      <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2">1.2M</p>
                      <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">{t.stat3}</p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
                <span className="text-purple-600 font-bold tracking-widest uppercase text-xs">{t.featuresSubtitle}</span>
                <h2 className="text-4xl font-black text-slate-900 mt-3">{t.featuresTitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <FeatureCard icon={<ScanLine size={32}/>} title={t.feat1Title} desc={t.feat1Desc} color="bg-purple-50 text-purple-600" />
                <FeatureCard icon={<Clock size={32}/>} title={t.feat2Title} desc={t.feat2Desc} color="bg-blue-50 text-blue-600" />
                <FeatureCard icon={<ShieldCheck size={32}/>} title={t.feat3Title} desc={t.feat3Desc} color="bg-emerald-50 text-emerald-600" />
            </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-slate-900">{t.faqTitle}</h2>
            </div>
            <div className="space-y-4">
                <FaqItem question={t.faq1Q} answer={t.faq1A} isOpen={openFaq === 1} onClick={() => setOpenFaq(openFaq === 1 ? null : 1)} />
                <FaqItem question={t.faq2Q} answer={t.faq2A} isOpen={openFaq === 2} onClick={() => setOpenFaq(openFaq === 2 ? null : 2)} />
            </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{t.ctaTitle}</h2>
              <p className="text-xl text-slate-500 mb-10">{t.ctaDesc}</p>
              <button 
                onClick={scrollToScanner}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/30 hover:-translate-y-1"
              >
                {t.tryBtn} <ArrowRight size={20} />
              </button>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-mono font-bold text-xs">WK</div>
                <span className="font-bold text-slate-900">Searcher</span>
            </div>
            <p className="text-slate-500 text-sm">{t.footer}</p>
            <div className="flex gap-4 opacity-50">
                <ExternalLink size={18} />
            </div>
        </div>
      </footer>
    </div>
  );
}

function Header({store, color, count, t}: {store: string, color: string, count: number, t: any}) {
    const isPurple = color === 'purple';
    return (
        <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isPurple ? 'bg-purple-600' : 'bg-red-600'}`} />
                {/* ИСПРАВЛЕН ЦВЕТ KASPI (Был red-900, стал red-600) */}
                <h3 className={`text-xl font-bold ${isPurple ? 'text-purple-900' : 'text-red-600'}`}>{store}</h3>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{count} {t.itemsCount}</span>
        </div>
    )
}

function Card({ item, color, t }: { item: any, color: 'purple' | 'red', t: any }) {
  const isPurple = color === 'purple';
  const hasReviews = item.reviews && item.reviews !== "0" && item.reviews !== 0;
  
  // УДАЛЕНИЕ СЛЕША В НАЧАЛЕ СТРОКИ
  const cleanName = item.name.replace(/^\/\s*/, '').trim();
  
  // Явные классы для Tailwind (чтобы цвета точно работали)
  const hoverBorderClass = isPurple ? 'hover:border-purple-200' : 'hover:border-red-200';
  const selectionClass = isPurple ? 'selection:bg-purple-100' : 'selection:bg-red-100';
  const titleHoverClass = isPurple ? 'group-hover:text-purple-700' : 'group-hover:text-red-600';
  const buttonClass = isPurple ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white';
  const priceColor = isPurple ? 'text-purple-600' : 'text-red-600';

  return (
    <a 
      href={item.link} 
      target="_blank"
      // Добавил selectionClass и исправил hoverBorderClass
      className={`group relative flex flex-row bg-white rounded-3xl p-3 border border-transparent shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 overflow-hidden hover:-translate-y-1 ${hoverBorderClass} ${selectionClass}`}
    >
      <div className="w-40 h-40 bg-slate-50 rounded-2xl flex items-center justify-center p-3 overflow-hidden shrink-0 relative">
        <img src={item.image} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt="Product" />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm text-slate-700">
            {isPurple ? '-WB' : '-Kaspi'}
        </div>
      </div>

      <div className="flex flex-col justify-between p-4 flex-grow relative">
        <div>
            <div className="flex items-center gap-1.5 mb-2">
                {hasReviews ? (
                    <>
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-slate-700">{item.rating || "5.0"}</span>
                        <span className="text-xs text-slate-400 font-medium">({item.reviews} {t.reviews})</span>
                    </>
                ) : (
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{t.noReviews}</span>
                )}
            </div>

            {/* Используем cleanName и правильный цвет при наведении */}
            <h4 className={`text-base font-semibold text-slate-800 line-clamp-2 leading-snug transition-colors ${titleHoverClass}`}>
            {cleanName}
            </h4>
        </div>

        <div className="flex items-end justify-between mt-3">
            <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium mb-0.5">{t.price}</span>
                <span className={`text-2xl font-black tracking-tight ${priceColor}`}>
                    {item.price.toLocaleString()} ₸
                </span>
            </div>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${buttonClass}`}>
                <ArrowRight size={20} className="-ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
        </div>
      </div>
    </a>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 text-sm bg-white">
      <Search size={32} className="mb-3 opacity-20" />
      {text}
    </div>
  )
}

function FeatureCard({icon, title, desc, color}: any) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
        </div>
    )
}

function FaqItem({question, answer, isOpen, onClick}: any) {
    return (
        <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-purple-200 bg-purple-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <button onClick={onClick} className="w-full flex items-center justify-between p-6 text-left">
                <span className={`font-bold text-lg ${isOpen ? 'text-purple-900' : 'text-slate-800'}`}>{question}</span>
                <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                    {isOpen ? <Minus size={20}/> : <Plus size={20}/>}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-6 pt-0 text-slate-600 leading-relaxed max-w-2xl">{answer}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}