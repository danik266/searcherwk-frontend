import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Настройка Viewport (мобильная адаптация и цвет темы)
export const viewport: Viewport = {
  themeColor: "#0f172a", // Цвет статус-бара в мобильных браузерах (под ваш slate-900)
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Полная конфигурация SEO
export const metadata: Metadata = {
  // Замените на ваш реальный домен, когда задеплоите (важно для индексации картинок)
  metadataBase: new URL("https://searcher-wk.kz"), 

  title: {
    default: "Searcher W-K | Умный поиск товаров на Wildberries и Kaspi",
    template: "%s | Searcher W-K",
  },
  description:
    "Мгновенное сравнение цен на Wildberries и Kaspi.kz с помощью Искусственного Интеллекта. Загрузите фото товара и найдите лучшее предложение. Экономьте до 40%.",
  
  // Ключевые слова для поисковиков
  keywords: [
    "Wildberries поиск по фото",
    "Kaspi поиск по фото",
    "Сравнение цен Казахстан",
    "Searcher W-K",
    "ИИ поиск товаров",
    "Шампатов Даниал",
    "дешевые товары",
    "анализ цен маркетплейсов"
  ],

  // Информация об авторе и приложении
  applicationName: "Searcher W-K",
  authors: [{ name: "Danial Kairdenovich Shampatov", url: "https://github.com/your-profile" }],
  creator: "Danial Kairdenovich Shampatov",
  publisher: "Searcher W-K Team",

  // Настройка роботов (разрешаем индексацию всего)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Иконки (используем ваш svg и ico)
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" }, // Для старых браузеров (лежит в app/)
      { url: "/logo.svg", type: "image/svg+xml" }, // Современный формат (лежит в public/)
    ],
    apple: "/logo.svg", // Apple устройства часто понимают SVG, либо можно добавить apple-touch-icon.png
  },

  // Open Graph - как ссылка будет выглядеть в Telegram, WhatsApp, Facebook
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: "en_US",
    // url: "https://searcher-wk.kz",
    title: "Searcher W-K — Найди лучшую цену по фото",
    description: "Сравнение товаров на Wildberries и Kaspi.kz. Точность ИИ 98%.",
    siteName: "Searcher W-K",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Searcher W-K Interface",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Searcher W-K | AI Поиск",
    description: "Сравнивай цены на Wildberries и Kaspi за 3 секунды.",
    images: ["/og-image.jpg"], 
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}