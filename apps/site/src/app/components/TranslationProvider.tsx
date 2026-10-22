import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Language = 'uz' | 'ru' | 'en';

export interface Translations {
  // Header
  documentation: string;
  components: string;
  theming: string;
  icons: string;
  designSystemName: string;
  
  // Landing Page
  internalUse: string;
  bekTeams: string;
  designSystem: string;
  officialDesignSystem: string;
  buildConsistent: string;
  getStarted: string;
  browseComponents: string;
  bekComponentLibrary: string;
  builtForBek: string;
  builtForBekDesc: string;
  
  // Features
  enterpriseReady: string;
  enterpriseReadyDesc: string;
  optimizedPerformance: string;
  optimizedPerformanceDesc: string;
  bekBrandConsistent: string;
  bekBrandConsistentDesc: string;
  teamCollaboration: string;
  teamCollaborationDesc: string;
  
  // Internal Notice
  confidentialInternal: string;
  confidentialInternalDesc: string;
  
  // CTA
  readyToBuild: string;
  readyToBuildDesc: string;
  startBuilding: string;
  viewGuidelines: string;
  
  // Footer
  footerDesc: string;
  gettingStarted: string;
  themingGuide: string;
  implementationExamples: string;
  internalResources: string;
  githubRepo: string;
  internalPackage: string;
  changeLog: string;
  developmentGuidelines: string;
  internalSupport: string;
  figmaFile: string;
  devTeamWiki: string;
  itSupportPortal: string;
  requestAccess: string;
  copyrightText: string;
  internalPrivacy: string;
  developmentStandards: string;
  
  // Documentation
  introduction: string;
  gettingStartedDesc: string;
  installation: string;
  usage: string;
  installationDesc: string;
  usageDesc: string;
  npmInstall: string;
  angularImport: string;
  buttonComponent: string;
  inputComponent: string;
  cardComponent: string;
  featuresTitle: string;
  componentsTitle: string;
  componentsDesc: string;
  configurationTitle: string;
  configurationDesc: string;
  quickStartTitle: string;
  quickStartDesc: string;
  standardsTitle: string;
  standardsDesc: string;
  
  // Components Page
  searchComponents: string;
  allComponents: string;
  inputComponents: string;
  displayComponents: string;
  layoutComponents: string;
  noComponentsFound: string;
  noComponentsFoundDesc: string;
  
  // Theming Page
  themingTitle: string;
  themingDesc: string;
  lightMode: string;
  darkMode: string;
  themeSelection: string;
  themeSelectionDesc: string;
  currentTheme: string;
  colorTokens: string;
  colorTokensDesc: string;
  liveExamples: string;
  liveExamplesDesc: string;
  implementationGuide: string;
  implementationGuideDesc: string;
  cssImport: string;
  themeService: string;
  templateUsage: string;
  
  // Sidebar
  overview: string;
  quickStart: string;
  architecture: string;
  designPrinciples: string;
  accessibility: string;
  basicComponents: string;
  formComponents: string;
  navigationComponents: string;
  feedbackComponents: string;
  overlayComponents: string;
  dataDisplayComponents: string;
  layoutComponents2: string;
  utilitiesComponents: string;
  colors: string;
  typography: string;
  spacing: string;
  shadows: string;
  animations: string;
  breakpoints: string;
  darkModeGuide: string;
  customization: string;
  migration: string;
  troubleshooting: string;
  changelog: string;
  roadmap: string;
  contributing: string;
  
  // Component names
  buttonName: string;
  inputName: string;
  cardName: string;
  badgeName: string;
  checkboxName: string;
  switchName: string;
  sliderName: string;
  progressName: string;
  avatarName: string;
  
  // Component descriptions
  buttonDesc: string;
  inputDesc: string;
  cardDesc: string;
  badgeDesc: string;
  checkboxDesc: string;
  switchDesc: string;
  sliderDesc: string;
  progressDesc: string;
  avatarDesc: string;
  
  // Example labels
  primary: string;
  secondary: string;
  outline: string;
  ghost: string;
  transparent: string;
  simple: string;
  exampleCard: string;
  cardContent: string;
  newBadge: string;
  warningBadge: string;
  acceptTerms: string;
  receiveNews: string;
  notifications: string;
  volume: string;
  loading: string;
  profile: string;
  buttons: string;
  cards: string;
  badges: string;
  
  // Platform-specific content
  platform: {
    web: string;
    android: string;
    ios: string;
  };
  platformSpecific: string;
  selectPlatform: string;
  webDescription: string;
  androidDescription: string;
  iosDescription: string;
  webInstallation: string;
  androidInstallation: string;
  iosInstallation: string;
  webImplementation: string;
  androidImplementation: string;
  iosImplementation: string;
  
  // Icons Page
  iconsTitle: string;
  iconsDesc: string;
  searchIcons: string;
  allIcons: string;
  noIconsFound: string;
  noIconsFoundDesc: string;
  iconDetails: string;
  copyCode: string;
  downloadIcon: string;
  downloadSvg: string;
  downloadPng: string;
  iconSize: string;
  iconFormat: string;
  iconCode: string;
  iconUsage: string;
  iconCopied: string;
  iconDownloaded: string;
}

const translations: Record<Language, Translations> = {
  uz: {
    // Header
    documentation: "Hujjatlar",
    components: "Komponentlar",
    theming: "Mavzular",
    icons: "Ikonkalar",
    designSystemName: "BEK",
    
    // Landing Page
    internalUse: "Ichki foydalanish uchun - BEK jamoalari",
    bekTeams: "BEK jamoalari",
    designSystem: "Dizayn tizimi",
    officialDesignSystem: "BEK uchun BEK dizayn tizimi. Barcha BEK raqamli mahsulotlarida izchil, professional interfeyslari yaratish.",
    buildConsistent: "Barcha BEK raqamli mahsulotlarida izchil, professional interfeyslari yaratish.",
    getStarted: "Boshlash",
    browseComponents: "Komponentlarni ko'rish",
    bekComponentLibrary: "BEK komponent kutubxonasi",
    builtForBek: "BEK raqamli ekotizimi uchun yaratilgan",
    builtForBekDesc: "Ochiq dizayn tizimi — barcha BEK mahsulotlari mobil, planshet va vebda bir xil ko'rinadi.",
    
    // Features
    enterpriseReady: "Korxona uchun tayyor",
    enterpriseReadyDesc: "BEK ichki ilovalarida korxona darajasidagi xavfsizlik va standartlar bilan maxsus yaratilgan.",
    optimizedPerformance: "Optimallashtirilgan ishlash",
    optimizedPerformanceDesc: "Bank ilova talablari va ishlash standartlari uchun optimallashtirilgan yengil React komponentlari.",
    bekBrandConsistent: "BEK brendiga mos",
    bekBrandConsistentDesc: "BEK vizual identifikatsiya yo'riqnomalari bilan izchil ranglar, tipografiya va dizayn namunalari.",
    teamCollaboration: "Jamoa hamkorligi",
    teamCollaborationDesc: "BEK rivojlantirish jamoalari uchun aniq hujjatlar va standartlashtirilgan amalga oshirish namunalari bilan ishlab chiqilgan.",
    
    // Internal Notice
    confidentialInternal: "Maxfiy va faqat ichki foydalanish",
    confidentialInternalDesc: "BEK dizayn tizimi BEK ga tegishli bo'lib, faqat ichki rivojlantirish jamoalari uchun mo'ljallangan. Barcha komponentlar, namunalar va hujjatlar maxfiy bo'lib, jamoadan tashqarida baham ko'rilmasligi kerak.",
    
    // CTA
    readyToBuild: "BEK standartlari bilan qurishga tayyormisiz?",
    readyToBuildDesc: "Brend izchilligi va barcha ilovalarida optimal foydalanuvchi tajribasini ta'minlash uchun loyihangizda BEK dizayn tizimini ishlatishni boshlang.",
    startBuilding: "Qurishni boshlash",
    viewGuidelines: "Yo'riqnomalarni ko'rish",
    
    // Footer
    footerDesc: "BEK ning izchil, professional biznes ilovalar uchun ichki dizayn tizimi. Maxfiy va vakolatli BEK rivojlantirish jamolariga cheklangan.",
    gettingStarted: "Boshlash",
    themingGuide: "Mavzu yo'riqnomasi",
    implementationExamples: "Amalga oshirish misollari",
    internalResources: "Ichki resurslar",
    githubRepo: "BEK GitHub repozitoriyasi",
    internalPackage: "Ichki paket registri",
    changeLog: "O'zgarishlar jurnali",
    developmentGuidelines: "Rivojlantirish yo'riqnomalari",
    internalSupport: "Ichki yordam",
    figmaFile: "Figma fayli",
    devTeamWiki: "Rivojlantirish jamoasi Wiki",
    itSupportPortal: "IT yordam portali",
    requestAccess: "Ruxsat so'rash",
    copyrightText: "BEK. Faqat ichki foydalanish - Maxfiy.",
    internalPrivacy: "Ichki maxfiylik siyosati",
    developmentStandards: "Rivojlantirish standartlari",
    
    // Documentation
    introduction: "Kirish",
    gettingStartedDesc: "BEK dizayn tizimi bilan boshlash yo'riqnomasi",
    installation: "O'rnatish",
    usage: "Foydalanish",
    installationDesc: "BEK dizayn tizimini React loyihangizga o'rnatish uchun quyidagi qadamlarni bajaring:",
    usageDesc: "BEK komponentlarini ishlatish misollari:",
    npmInstall: "NPM paket orqali",
    angularImport: "React modulini import qilish",
    buttonComponent: "Button komponenti",
    inputComponent: "Input komponenti",
    cardComponent: "Card komponenti",
    featuresTitle: "Xususiyatlar",
    componentsTitle: "Komponentlar",
    componentsDesc: "40+ dan ortiq tayyor React komponenti, har biri BEK brand standartlariga mos keladi.",
    configurationTitle: "Konfiguratsiya",
    configurationDesc: "Oson konfiguratsiya va sozlash imkoniyatlari, loyihangiz ehtiyojlariga mos.",
    quickStartTitle: "Tezkor ishga tushirish",
    quickStartDesc: "Bir necha daqiqada dizayn tizimini loyihangizga integratsiya qiling.",
    standardsTitle: "BEK standartlari",
    standardsDesc: "Barcha komponentlar BEK xavfsizlik va sifat standartlariga javob beradi.",
    
    // Components Page
    searchComponents: "Komponentlarni qidiring...",
    allComponents: "Barchasi",
    inputComponents: "Kiritish",
    displayComponents: "Ko'rsatish",
    layoutComponents: "Joylashtirish",
    noComponentsFound: "Komponentlar topilmadi",
    noComponentsFoundDesc: "Qidiruv so'zingizni o'zgartirib ko'ring yoki boshqa kategoriyani tanlang.",
    
    // Theming Page  
    themingTitle: "Mavzular",
    themingDesc: "BEK dizayn tizimi mavzulari va uslublari. BEK dizayn tizimi yorug' va qorong'u mavzularni qo'llab-quvvatlaydi.",
    lightMode: "Yorug' rejim",
    darkMode: "Qorong'u rejim",
    themeSelection: "Mavzu tanlash",
    themeSelectionDesc: "Mavzuni almashtirish uchun yuqoridagi tugmani bosing.",
    currentTheme: "Joriy mavzu",
    colorTokens: "Rang tokenlar",
    colorTokensDesc: "BEK dizayn tizimida ishlatiladigan asosiy ranglar",
    liveExamples: "Jonli misollar",
    liveExamplesDesc: "Komponentlar joriy mavzuda qanday ko'rinishini ko'ring",
    implementationGuide: "Amalga oshirish yo'riqnomasi",
    implementationGuideDesc: "React ilovangizda BEK mavzularini ishlatish uchun:",
    cssImport: "CSS o'zgaruvchilarini import qilish",
    themeService: "Mavzu service dan foydalanish",
    templateUsage: "Template da mavzuni qo'llash",
    
    // Sidebar
    overview: "Umumiy ko'rinish",
    quickStart: "Tezkor boshlash",
    architecture: "Arxitektura",
    designPrinciples: "Dizayn tamoyillari",
    accessibility: "Kirish imkoniyati",
    basicComponents: "Asosiy komponentlar",
    formComponents: "Forma komponentlari",
    navigationComponents: "Navigatsiya komponentlari",
    feedbackComponents: "Fikr bildirish komponentlari",
    overlayComponents: "Qoplama komponentlari",
    dataDisplayComponents: "Ma'lumot ko'rsatish komponentlari",
    layoutComponents2: "Tartib komponentlari",
    utilitiesComponents: "Yordamchi komponentlar",
    colors: "Ranglar",
    typography: "Tipografiya",
    spacing: "Oraliqlar",
    shadows: "Soyalar",
    animations: "Animatsiyalar",
    breakpoints: "Sinish nuqtalari",
    darkModeGuide: "Qorong'u rejim yo'riqnomasi",
    customization: "Moslashish",
    migration: "Migratsiya",
    troubleshooting: "Muammolarni hal qilish",
    changelog: "O'zgarishlar tarixi",
    roadmap: "Yo'l xaritasi",
    contributing: "Hissa qo'shish",
    
    // Component names
    buttonName: "Button / Tugma",
    inputName: "Input / Kiritish maydoni", 
    cardName: "Card / Karta",
    badgeName: "Badge / Nishon",
    checkboxName: "Checkbox / Belgilash katakchasi",
    switchName: "Switch / Almashtirish tugmasi",
    sliderName: "Slider / Slayder",
    progressName: "Progress / Jarayon ko'rsatkichi",
    avatarName: "Avatar / Profil rasmi",
    
    // Component descriptions
    buttonDesc: "Interaktiv harakatlar uchun turli xil tugma variantlari",
    inputDesc: "Matn kiritish uchun turli xil input maydonlari",
    cardDesc: "Tarkibni guruhlash uchun karta komponenti",
    badgeDesc: "Holat va kategoriyalarni ko'rsatish uchun",
    checkboxDesc: "Bir nechta tanlovni belgilash uchun",
    switchDesc: "Ikki holat orasida almashish uchun",
    sliderDesc: "Qiymatni diapazondan tanlash uchun",
    progressDesc: "Jarayon holatini ko'rsatish uchun",
    avatarDesc: "Foydalanuvchi profil rasmini ko'rsatish",
    
    // Example labels
    primary: "Asosiy",
    secondary: "Ikkinchi",
    outline: "Kontur",
    ghost: "Shaffof",
    transparent: "Shaffof",
    simple: "Oddiy",
    exampleCard: "Misol karta",
    cardContent: "Bu yerda karta tarkibi joylashadi.",
    newBadge: "Yangi",
    warningBadge: "Ogohlantirish",
    acceptTerms: "Shartlarni qabul qilaman",
    receiveNews: "Yangiliklar xabarnomasini olish",
    notifications: "Bildirishnomalar",
    volume: "Ovoz balandligi",
    loading: "Yuklash",
    profile: "Profil",
    buttons: "Tugmalar",
    cards: "Kartalar", 
    badges: "Nishonlar",
    
    // Platform-specific content
    platform: {
      web: "Web",
      android: "Android",
      ios: "iOS"
    },
    platformSpecific: "Platforma uchun maxsus",
    selectPlatform: "Platformani tanlang",
    webDescription: "Web ilovalar uchun React komponentlari va CSS frameworklari",
    androidDescription: "Android ilovalar uchun native komponentlar va Material Design",
    iosDescription: "iOS ilovalar uchun native komponentlar va Human Interface Guidelines",
    webInstallation: "pnpm add @bek-ui/tokens @bek-ui/react",
    androidInstallation: "pnpm add @bek-ui/tokens   # tokens.json → Compose temasi",
    iosInstallation: "pnpm add @bek-ui/tokens   # tokens.json → SwiftUI temasi",
    webImplementation: "React moduli sifatida import qiling va HTML templatelarida ishlating",
    androidImplementation: "Kotlin/Java kodingizda BEK komponentlarni ishlating",
    iosImplementation: "Swift kodingizda BEK UI komponentlarni ishlating",
    
    // Icons Page
    iconsTitle: "Ikonkalar",
    iconsDesc: "BEK dizayn tizimi uchun 18000+ dan ortiq ikonkalar. Barcha ikonkalarni turli formatlar va o'lchamlarda yuklab olish mumkin.",
    searchIcons: "Ikonkalarni qidiring...",
    allIcons: "Barcha ikonkalar",
    noIconsFound: "Ikonkalar topilmadi",
    noIconsFoundDesc: "Qidiruv so'zingizni o'zgartirib ko'ring.",
    iconDetails: "Ikonka tafsilotlari",
    copyCode: "Kodni nusxalash",
    downloadIcon: "Ikonkani yuklab olish",
    downloadSvg: "SVG yuklab olish",
    downloadPng: "PNG yuklab olish",
    iconSize: "Ikonka o'lchami",
    iconFormat: "Ikonka formati",
    iconCode: "Ikonka kodi",
    iconUsage: "Foydalanish",
    iconCopied: "Kod nusxalandi!",
    iconDownloaded: "Ikonka yuklab olindi!"
  },
  ru: {
    // Header
    documentation: "Документация",
    components: "Компоненты",
    theming: "Темы",
    icons: "Иконки",
    designSystemName: "BEK",
    
    // Landing Page
    internalUse: "Только для внутреннего использования - Команды BEK",
    bekTeams: "Команды BEK",
    designSystem: "Дизайн-система",
    officialDesignSystem: "Дизайн-система BEK для BEK. Создавайте согласованные, профессиональные интерфейсы во всех цифровых продуктах банка.",
    buildConsistent: "Создавайте согласованные, профессиональные интерфейсы во всех цифровых продуктах банка.",
    getStarted: "Начать",
    browseComponents: "Просмотр компонентов",
    bekComponentLibrary: "Библиотека компонентов BEK",
    builtForBek: "Создано для цифровой экосистемы BEK",
    builtForBekDesc: "Открытая дизайн-система: все продукты BEK выглядят одинаково на мобильных, планшетах и в вебе.",
    
    // Features
    enterpriseReady: "Готово для предприятия",
    enterpriseReadyDesc: "Создано специально для внутренних приложений BEK с корпоративной безопасностью и стандартами.",
    optimizedPerformance: "Оптимизированная производительность",
    optimizedPerformanceDesc: "Легкие компоненты React, оптимизированные для требований BEK их приложений и стандартов производительности.",
    bekBrandConsistent: "Соответствие бренду BEK",
    bekBrandConsistentDesc: "Следует руководящим принципам визуальной идентичности BEK с согласованными цветами, типографико�� и шаблонами дизайна.",
    teamCollaboration: "Командная работа",
    teamCollaborationDesc: "Разработано для команд разработки BEK с четкой документацией и стандартизированными шаблонами реализации.",
    
    // Internal Notice
    confidentialInternal: "Конфиденциально и только для внутреннего использования",
    confidentialInternalDesc: "Эта дизайн-система является собственностью BEK Business и предназначена исключительно для внутренних команд разработки. Все компоненты, шаблоны и документация являются конфиденциальными и не должны передаваться за пределы BEK.",
    
    // CTA
    readyToBuild: "Готовы создавать с стандартами BEK?",
    readyToBuildDesc: "Начните внедрение дизайн-системы BEK в свой проект, чтобы обеспечить согласованность бренда и оптимальный пользовательский опыт во всех приложениях.",
    startBuilding: "Начать создание",
    viewGuidelines: "Просмотр руководств",
    
    // Footer
    footerDesc: "Внутренняя дизайн-система BEK для согласованных, профессиональных бизнес-приложений. Конфиденциально и ограничено для авторизованных команд разработки BEK.",
    gettingStarted: "Начало работы",
    themingGuide: "Руководство по темам",
    implementationExamples: "Примеры реализации",
    internalResources: "Внутренние ресурсы",
    githubRepo: "Репозиторий BEK GitHub",
    internalPackage: "Внутренний реестр пакетов",
    changeLog: "Журнал изменений",
    developmentGuidelines: "Руководящие принципы разработки",
    internalSupport: "Внутренняя поддержка",
    figmaFile: "Файл Figma",
    devTeamWiki: "Wiki команды разработки",
    itSupportPortal: "Портал IT-поддержки",
    requestAccess: "Запросить доступ",
    copyrightText: "BEK. Только для внутреннего использования - Конфиденциально.",
    internalPrivacy: "Внутренняя политика конфиденциальности",
    developmentStandards: "Стандарты разработки",
    
    // Documentation
    introduction: "Введение",
    gettingStartedDesc: "Руководство по началу работы с дизайн-системой BEK",
    installation: "Установка",
    usage: "Использование",
    installationDesc: "Для установки дизайн-системы BEK в ваш React проект выполните следующие шаги:",
    usageDesc: "Примеры использования компонентов BEK Business:",
    npmInstall: "Через пакет NPM",
    angularImport: "Импорт React модуля",
    buttonComponent: "Компонент Button",
    inputComponent: "Компонент Input",
    cardComponent: "Компонент Card",
    featuresTitle: "Особенности",
    componentsTitle: "Компоненты",
    componentsDesc: "Более 40 готовых React компонентов, каждый из которых соответствует стандартам бренда BEK.",
    configurationTitle: "Конфигурация",
    configurationDesc: "Простые возможности конфигурации и настройки, адаптированные к потребностям вашего проекта.",
    quickStartTitle: "Быстрый старт",
    quickStartDesc: "Интегрируйте дизайн-систему в ваш проект за несколько минут.",
    standardsTitle: "Стандарты BEK",
    standardsDesc: "Все компоненты соответствуют стандартам безопасности и качества BEK.",
    
    // Components Page
    searchComponents: "Поиск компонентов...",
    allComponents: "Все",
    inputComponents: "Ввод",
    displayComponents: "Отображение",
    layoutComponents: "Макет",
    noComponentsFound: "Компоненты не найдены",
    noComponentsFoundDesc: "Попробуйте изменить поисковый запрос или выберите другую категорию.",
    
    // Theming Page
    themingTitle: "Темы",
    themingDesc: "Темы и стили дизайн-системы BEK Business. Дизайн-система BEK Business поддерживает светлую и темную темы.",
    lightMode: "Светлый режим",
    darkMode: "Темный режим",
    themeSelection: "Выбор темы",
    themeSelectionDesc: "Нажмите кнопку выше, чтобы переключить тему.",
    currentTheme: "Текущая тема",
    colorTokens: "Цветовые токены",
    colorTokensDesc: "Основные цвета, используемые в дизайн-системе BEK Business",
    liveExamples: "Живые примеры",
    liveExamplesDesc: "Посмотрите, как выглядят компоненты в текущей теме",
    implementationGuide: "Руководство по внедрению",
    implementationGuideDesc: "Для использования тем BEK в вашем React приложении:",
    cssImport: "Импорт CSS переменных",
    themeService: "Использование сервиса тем",
    templateUsage: "Применение темы в шаблоне",
    
    // Sidebar
    overview: "Обзор",
    quickStart: "Быстрый старт",
    architecture: "Архитектура",
    designPrinciples: "Принципы дизайна",
    accessibility: "Доступность",
    basicComponents: "Базовые компоненты",
    formComponents: "Компоненты форм",
    navigationComponents: "Компоненты навигации",
    feedbackComponents: "Компоненты обратной связи",
    overlayComponents: "Компоненты наложения",
    dataDisplayComponents: "Компоненты отображения данных",
    layoutComponents2: "Компоненты макета",
    utilitiesComponents: "Вспомогательные компоненты",
    colors: "Цвета",
    typography: "Типографика",
    spacing: "Отступы",
    shadows: "Тени",
    animations: "Анимации",
    breakpoints: "Точки останова",
    darkModeGuide: "Руководство по темному режиму",
    customization: "Настройка",
    migration: "Миграция",
    troubleshooting: "Устранение неполадок",
    changelog: "История изменений",
    roadmap: "Дорожная карта",
    contributing: "Участие в разработке",
    
    // Component names
    buttonName: "Button / Кнопка",
    inputName: "Input / Поле ввода",
    cardName: "Card / Карточка",
    badgeName: "Badge / Бейдж",
    checkboxName: "Checkbox / Флажок",
    switchName: "Switch / Переключатель",
    sliderName: "Slider / Слайдер",
    progressName: "Progress / Прогресс",
    avatarName: "Avatar / Аватар",
    
    // Component descriptions
    buttonDesc: "Различные варианты кнопок для интерактивных действий",
    inputDesc: "Различные поля ввода для ввода текста",
    cardDesc: "Компонент карточки для группировки контента",
    badgeDesc: "Для отображения статуса и категорий",
    checkboxDesc: "Для выбора нескольких вариантов",
    switchDesc: "Для переключения между двумя состояниями",
    sliderDesc: "Для выбора значения из диапазона",
    progressDesc: "Для отображения состояния процесса",
    avatarDesc: "Для отображения изображения профиля пользователя",
    
    // Example labels
    primary: "Основная",
    secondary: "Вторичная",
    outline: "Контурная",
    ghost: "Прозрачная",
    transparent: "Прозрачная",
    simple: "Простой",
    exampleCard: "Пример карточки",
    cardContent: "Здесь размещается содержимое карточки.",
    newBadge: "Новый",
    warningBadge: "Важное",
    acceptTerms: "Принимаю условия",
    receiveNews: "Получать новости",
    notifications: "Уведомления",
    volume: "Громкость",
    loading: "Загрузка",
    profile: "Профиль",
    buttons: "Кнопки",
    cards: "Карточки",
    badges: "Бейджи",
    
    // Platform-specific content
    platform: {
      web: "Web",
      android: "Android",
      ios: "iOS"
    },
    platformSpecific: "Специфично для платформы",
    selectPlatform: "Выберите платформу",
    webDescription: "React компоненты и CSS фреймворки для веб-приложений",
    androidDescription: "Нативные компоненты и Material Design для Android приложений",
    iosDescription: "Нативные компоненты и Human Interface Guidelines для iOS приложений",
    webInstallation: "pnpm add @bek-ui/tokens @bek-ui/react",
    androidInstallation: "pnpm add @bek-ui/tokens   # tokens.json → Compose temasi",
    iosInstallation: "pnpm add @bek-ui/tokens   # tokens.json → SwiftUI temasi",
    webImplementation: "Импортируйте как React модуль и используйте в HTML шаблонах",
    androidImplementation: "Используйте BEK компоненты в вашем Kotlin/Java коде",
    iosImplementation: "Используйте BEK UI компоненты в вашем Swift коде",
    
    // Icons Page
    iconsTitle: "Иконки",
    iconsDesc: "Более 18000 иконок для дизайн-системы BEK Business. Все иконки доступны для скачивания в различных форматах и размерах.",
    searchIcons: "Поиск иконок...",
    allIcons: "Все иконки",
    noIconsFound: "Иконки не найдены",
    noIconsFoundDesc: "Попробуйте изменить поисковый запрос.",
    iconDetails: "Детали иконки",
    copyCode: "Копировать код",
    downloadIcon: "Скачать иконку",
    downloadSvg: "Скачать SVG",
    downloadPng: "Скачать PNG",
    iconSize: "Размер иконки",
    iconFormat: "Формат иконки",
    iconCode: "Код иконки",
    iconUsage: "Использование",
    iconCopied: "Код скопирован!",
    iconDownloaded: "Иконка скачана!"
  },
  en: {
    // Header
    documentation: "Documentation",
    components: "Components",
    theming: "Theming",
    icons: "Icons",
    designSystemName: "BEK",
    
    // Landing Page
    internalUse: "Internal Use Only - BEK Teams",
    bekTeams: "BEK Teams",
    designSystem: "Design System",
    officialDesignSystem: "The official design system for BEK Business applications. Build consistent, professional interfaces across all BEK digital products.",
    buildConsistent: "Build consistent, professional interfaces across all BEK digital products.",
    getStarted: "Get Started",
    browseComponents: "Browse Components",
    bekComponentLibrary: "BEK Component Library",
    builtForBek: "Built for BEK's digital ecosystem",
    builtForBekDesc: "An open design system that keeps every BEK product consistent across mobile, tablet and web.",
    
    // Features
    enterpriseReady: "Enterprise Ready",
    enterpriseReadyDesc: "Built specifically for BEK's internal applications with enterprise-grade security and standards.",
    optimizedPerformance: "Optimized Performance",
    optimizedPerformanceDesc: "Lightweight React components optimized for BEK's application requirements and performance standards.",
    bekBrandConsistent: "BEK Brand Consistent",
    bekBrandConsistentDesc: "Follows BEK's visual identity guidelines with consistent colors, typography, and design patterns.",
    teamCollaboration: "Team Collaboration",
    teamCollaborationDesc: "Designed for BEK development teams with clear documentation and standardized implementation patterns.",
    
    // Internal Notice
    confidentialInternal: "Confidential & Internal Use Only",
    confidentialInternalDesc: "This design system is proprietary to BEK Business and is intended exclusively for internal development teams. All components, patterns, and documentation are confidential and should not be shared outside of BEK.",
    
    // CTA
    readyToBuild: "Ready to build with BEK standards?",
    readyToBuildDesc: "Start implementing BEK's design system in your project to ensure brand consistency and optimal user experience across all applications.",
    startBuilding: "Start Building",
    viewGuidelines: "View Guidelines",
    
    // Footer
    footerDesc: "BEK's internal design system for consistent, professional business applications. Confidential and restricted to authorized BEK development teams.",
    gettingStarted: "Getting Started",
    themingGuide: "Theming Guide",
    implementationExamples: "Implementation Examples",
    internalResources: "Internal Resources",
    githubRepo: "BEK GitHub Repository",
    internalPackage: "Internal Package Registry",
    changeLog: "Change Log",
    developmentGuidelines: "Development Guidelines",
    internalSupport: "Internal Support",
    figmaFile: "Figma file",
    devTeamWiki: "Development Team Wiki",
    itSupportPortal: "IT Support Portal",
    requestAccess: "Request Access",
    copyrightText: "BEK Business. Internal Use Only - Confidential.",
    internalPrivacy: "Internal Privacy Policy",
    developmentStandards: "Development Standards",
    
    // Documentation
    introduction: "Introduction",
    gettingStartedDesc: "Getting started guide for BEK Business Design System",
    installation: "Installation",
    usage: "Usage",
    installationDesc: "To install BEK Business Design System in your React project, follow these steps:",
    usageDesc: "Examples of using BEK Business components:",
    npmInstall: "Via NPM package",
    angularImport: "Import React module",
    buttonComponent: "Button component",
    inputComponent: "Input component",
    cardComponent: "Card component",
    featuresTitle: "Features",
    componentsTitle: "Components",
    componentsDesc: "40+ ready-made React components, each conforming to BEK brand standards.",
    configurationTitle: "Configuration",
    configurationDesc: "Easy configuration and customization options, tailored to your project needs.",
    quickStartTitle: "Quick Start",
    quickStartDesc: "Integrate the design system into your project in minutes.",
    standardsTitle: "BEK Standards",
    standardsDesc: "All components meet BEK security and quality standards.",
    
    // Components Page
    searchComponents: "Search components...",
    allComponents: "All",
    inputComponents: "Input",
    displayComponents: "Display",
    layoutComponents: "Layout",
    noComponentsFound: "No components found",
    noComponentsFoundDesc: "Try changing your search term or select a different category.",
    
    // Theming Page
    themingTitle: "Theming",
    themingDesc: "BEK Business Design System themes and styles. BEK Business Design System supports light and dark themes.",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    themeSelection: "Theme Selection",
    themeSelectionDesc: "Click the button above to toggle the theme.",
    currentTheme: "Current theme",
    colorTokens: "Color Tokens",
    colorTokensDesc: "Primary colors used in BEK Business Design System",
    liveExamples: "Live Examples",
    liveExamplesDesc: "See how components look in the current theme",
    implementationGuide: "Implementation Guide",
    implementationGuideDesc: "To use BEK themes in your React application:",
    cssImport: "Import CSS variables",
    themeService: "Using theme service",
    templateUsage: "Apply theme in template",
    
    // Sidebar
    overview: "Overview",
    quickStart: "Quick Start",
    architecture: "Architecture",
    designPrinciples: "Design Principles",
    accessibility: "Accessibility",
    basicComponents: "Basic Components",
    formComponents: "Form Components",
    navigationComponents: "Navigation Components",
    feedbackComponents: "Feedback Components",
    overlayComponents: "Overlay Components",
    dataDisplayComponents: "Data Display Components",
    layoutComponents2: "Layout Components",
    utilitiesComponents: "Utilities Components",
    colors: "Colors",
    typography: "Typography",
    spacing: "Spacing",
    shadows: "Shadows",
    animations: "Animations",
    breakpoints: "Breakpoints",
    darkModeGuide: "Dark Mode Guide",
    customization: "Customization",
    migration: "Migration",
    troubleshooting: "Troubleshooting",
    changelog: "Changelog",
    roadmap: "Roadmap",
    contributing: "Contributing",
    
    // Component names
    buttonName: "Button",
    inputName: "Input",
    cardName: "Card",
    badgeName: "Badge",
    checkboxName: "Checkbox",
    switchName: "Switch",
    sliderName: "Slider",
    progressName: "Progress",
    avatarName: "Avatar",
    
    // Component descriptions
    buttonDesc: "Various button variants for interactive actions",
    inputDesc: "Various input fields for text entry",
    cardDesc: "Card component for grouping content",
    badgeDesc: "For displaying status and categories",
    checkboxDesc: "For selecting multiple options",
    switchDesc: "For switching between two states",
    sliderDesc: "For selecting a value from a range",
    progressDesc: "For displaying process status",
    avatarDesc: "For displaying user profile image",
    
    // Example labels
    primary: "Primary",
    secondary: "Secondary",
    outline: "Outline",
    ghost: "Ghost",
    transparent: "Transparent",
    simple: "Simple",
    exampleCard: "Example Card",
    cardContent: "Card content is placed here.",
    newBadge: "New",
    warningBadge: "Important",
    acceptTerms: "Accept Terms",
    receiveNews: "Receive Newsletter",
    notifications: "Notifications",
    volume: "Volume",
    loading: "Loading",
    profile: "Profile",
    buttons: "Buttons",
    cards: "Cards",
    badges: "Badges",
    
    // Platform-specific content
    platform: {
      web: "Web",
      android: "Android",
      ios: "iOS"
    },
    platformSpecific: "Platform Specific",
    selectPlatform: "Select Platform",
    webDescription: "React components and CSS frameworks for web applications",
    androidDescription: "Native components and Material Design for Android applications",
    iosDescription: "Native components and Human Interface Guidelines for iOS applications",
    webInstallation: "pnpm add @bek-ui/tokens @bek-ui/react",
    androidInstallation: "pnpm add @bek-ui/tokens   # tokens.json → Compose temasi",
    iosInstallation: "pnpm add @bek-ui/tokens   # tokens.json → SwiftUI temasi",
    webImplementation: "Import as React module and use in HTML templates",
    androidImplementation: "Use BEK components in your Kotlin/Java code",
    iosImplementation: "Use BEK UI components in your Swift code",
    
    // Icons Page
    iconsTitle: "Icons",
    iconsDesc: "18000+ icons for BEK Business Design System. All icons are available for download in various formats and sizes.",
    searchIcons: "Search icons...",
    allIcons: "All Icons",
    noIconsFound: "No icons found",
    noIconsFoundDesc: "Try changing your search term.",
    iconDetails: "Icon Details",
    copyCode: "Copy Code",
    downloadIcon: "Download Icon",
    downloadSvg: "Download SVG",
    downloadPng: "Download PNG",
    iconSize: "Icon Size",
    iconFormat: "Icon Format",
    iconCode: "Icon Code",
    iconUsage: "Usage",
    iconCopied: "Code copied!",
    iconDownloaded: "Icon downloaded!"
  }
};

interface TranslationContextType {
  language: Language;
  currentLanguage: Language; // Add this for consistency
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('uz');

  const contextValue: TranslationContextType = {
    language,
    currentLanguage: language, // Add this
    setLanguage: useCallback((lang: Language) => setLanguage(lang), []),
    t: translations[language]
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}