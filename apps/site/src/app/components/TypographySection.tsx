import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, Type, FileText, Palette } from 'lucide-react';
import { useTranslation } from './TranslationProvider';

export function TypographySection() {
  const { t, currentLanguage } = useTranslation();

  // Typography scale with detailed information - memoized to prevent re-computation
  const typeScale = useMemo(() => [
    {
      name: 'Display 2xl',
      size: '72px',
      rem: '4.5rem',
      lineHeight: '90px',
      lineHeightRem: '5.625rem',
      tracking: '-2%',
      usage: currentLanguage === 'uz' ? 'Eng katta sarlavhalar' : currentLanguage === 'ru' ? 'Самые большие заголовки' : 'Largest headings'
    },
    {
      name: 'Display xl',
      size: '60px',
      rem: '3.75rem',
      lineHeight: '72px',
      lineHeightRem: '4.5rem',
      tracking: '-2%',
      usage: currentLanguage === 'uz' ? 'Katta sarlavhalar' : currentLanguage === 'ru' ? 'Большие заголовки' : 'Large headings'
    },
    {
      name: 'Display lg',
      size: '48px',
      rem: '3rem',
      lineHeight: '60px',
      lineHeightRem: '3.75rem',
      tracking: '-2%',
      usage: currentLanguage === 'uz' ? 'Sahifa sarlavhalari' : currentLanguage === 'ru' ? 'Заголовки страниц' : 'Page headings'
    },
    {
      name: 'Display md',
      size: '36px',
      rem: '2.25rem',
      lineHeight: '44px',
      lineHeightRem: '2.75rem',
      tracking: '-2%',
      usage: currentLanguage === 'uz' ? 'Bo\'lim sarlavhalari' : currentLanguage === 'ru' ? 'Заголовки разделов' : 'Section headings'
    },
    {
      name: 'Display sm',
      size: '30px',
      rem: '1.875rem',
      lineHeight: '38px',
      lineHeightRem: '2.375rem',
      tracking: '0%',
      usage: currentLanguage === 'uz' ? 'Kichik sarlavhalar' : currentLanguage === 'ru' ? 'Маленькие заголовки' : 'Small headings'
    },
    {
      name: 'Text xl',
      size: '20px',
      rem: '1.25rem',
      lineHeight: '30px',
      lineHeightRem: '1.875rem',
      tracking: '0%',
      usage: currentLanguage === 'uz' ? 'Katta matn' : currentLanguage === 'ru' ? 'Большой текст' : 'Large text'
    },
    {
      name: 'Text lg',
      size: '18px',
      rem: '1.125rem',
      lineHeight: '28px',
      lineHeightRem: '1.75rem',
      tracking: '0%',
      usage: currentLanguage === 'uz' ? 'Asosiy matn' : currentLanguage === 'ru' ? 'Основной текст' : 'Body text large'
    },
    {
      name: 'Text md',
      size: '16px',
      rem: '1rem',
      lineHeight: '24px',
      lineHeightRem: '1.5rem',
      tracking: '0%',
      usage: currentLanguage === 'uz' ? 'Standart matn' : currentLanguage === 'ru' ? 'Стандартный текст' : 'Default body text'
    },
    {
      name: 'Text sm',
      size: '14px',
      rem: '0.875rem',
      lineHeight: '20px',
      lineHeightRem: '1.25rem',
      tracking: '0%',
      usage: currentLanguage === 'uz' ? 'Kichik matn' : currentLanguage === 'ru' ? 'Маленький текст' : 'Small text'
    },
    {
      name: 'Text xs',
      size: '12px',
      rem: '0.75rem',
      lineHeight: '18px',
      lineHeightRem: '1.125rem',
      tracking: '0%',
      usage: currentLanguage === 'uz' ? 'Caption matn' : currentLanguage === 'ru' ? 'Подписи' : 'Caption text'
    }
  ], [currentLanguage]);

  const fontWeights = useMemo(() => [
    {
      name: currentLanguage === 'uz' ? 'Regular' : currentLanguage === 'ru' ? 'Обычный' : 'Regular',
      weight: '400',
      usage: currentLanguage === 'uz' ? 'Asosiy matn va descriptions' : currentLanguage === 'ru' ? 'Основной текст и описания' : 'Body text and descriptions'
    },
    {
      name: currentLanguage === 'uz' ? 'Medium' : currentLanguage === 'ru' ? 'Средний' : 'Medium',
      weight: '500',
      usage: currentLanguage === 'uz' ? 'Buttonlar va linklar' : currentLanguage === 'ru' ? 'Кнопки и ссылки' : 'Buttons and links'
    },
    {
      name: currentLanguage === 'uz' ? 'Semibold' : currentLanguage === 'ru' ? 'Полужирный' : 'Semibold',
      weight: '600',
      usage: currentLanguage === 'uz' ? 'Kichik sarlavhalar' : currentLanguage === 'ru' ? 'Малые заголовки' : 'Small headings'
    },
    {
      name: currentLanguage === 'uz' ? 'Bold' : currentLanguage === 'ru' ? 'Жирный' : 'Bold',
      weight: '700',
      usage: currentLanguage === 'uz' ? 'Muhim sarlavhalar' : currentLanguage === 'ru' ? 'Важные заголовки' : 'Important headings'
    }
  ], [currentLanguage]);

  const handleDownloadFont = useMemo(() => () => {
    // This would typically download the font files
    // For now, we'll show a download notification
    console.log('Font download initiated');
    const message = currentLanguage === 'uz' ? 'ttinterphases Pro font yuklab olinmoqda...' : 
          currentLanguage === 'ru' ? 'Загружается шрифт ttinterphases Pro...' : 
          'Downloading ttinterphases Pro font...';
    alert(message);
  }, [currentLanguage]);

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <Type className="h-8 w-8 text-primary" />
          {currentLanguage === 'uz' ? 'Typography Tizimi' : 
           currentLanguage === 'ru' ? 'Система типографики' : 
           'Typography System'}
        </h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
          {currentLanguage === 'uz' ? 'Pure dizayn tizimining typography qoidalari, o\'lchamlari va font hiearxiyasi' : 
           currentLanguage === 'ru' ? 'Правила типографики, размеры и иерархия шрифтов системы дизайна Pure' : 
           'Typography rules, sizes, and font hierarchy of the Pure design system'}
        </p>
        <Button onClick={handleDownloadFont} className="shadow-lg hover:shadow-xl transition-all duration-300">
          <Download className="h-5 w-5 mr-2" />
          {currentLanguage === 'uz' ? 'ttinterphases Pro yuklab olish' : 
           currentLanguage === 'ru' ? 'Скачать ttinterphases Pro' : 
           'Download ttinterphases Pro'}
        </Button>
      </div>

      {/* Font Family Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-background to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Palette className="h-6 w-6 text-primary" />
              {currentLanguage === 'uz' ? 'Font Family' : 
               currentLanguage === 'ru' ? 'Семейство шрифтов' : 
               'Font Family'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center bg-white p-8 rounded-xl shadow-sm">
                <div className="text-6xl font-normal mb-4" style={{ fontFamily: '"ttinterphases Pro", sans-serif' }}>
                  Ag
                </div>
                <h4 className="text-2xl font-semibold mb-2" style={{ fontFamily: '"ttinterphases Pro", sans-serif' }}>
                  ttinterphases Pro
                </h4>
                <p className="text-muted-foreground text-sm">
                  {currentLanguage === 'uz' ? 'Pure dizayn tizimi uchun asosiy font' : 
                   currentLanguage === 'ru' ? 'Основной шрифт для системы дизайна Pure' : 
                   'Primary font for Pure design system'}
                </p>
              </div>
              
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="text-3xl mb-3" style={{ fontFamily: '"ttinterphases Pro", sans-serif', letterSpacing: '-0.02em' }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                </div>
                <div className="text-2xl mb-3" style={{ fontFamily: '"ttinterphases Pro", sans-serif' }}>
                  abcdefghijklmnopqrstuvwxyz
                </div>
                <div className="text-xl text-muted-foreground" style={{ fontFamily: '"ttinterphases Pro", sans-serif' }}>
                  0123456789 !@#$%^&*()
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Weights */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              {currentLanguage === 'uz' ? 'Font Weights' : 
               currentLanguage === 'ru' ? 'Начертания шрифта' : 
               'Font Weights'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fontWeights.map((weight, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div 
                    className="text-4xl"
                    style={{ 
                      fontFamily: '"ttinterphases Pro", sans-serif',
                      fontWeight: weight.weight,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Aa
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{weight.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {weight.weight}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {weight.usage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Typography Scale */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {currentLanguage === 'uz' ? 'Typography Scale' : 
             currentLanguage === 'ru' ? 'Шкала типографики' : 
             'Typography Scale'}
          </CardTitle>
          <p className="text-center text-muted-foreground">
            {currentLanguage === 'uz' ? 'Barcha matn o\'lchamlari va ularning qo\'llanilishi' : 
             currentLanguage === 'ru' ? 'Все размеры текста и их применение' : 
             'All text sizes and their usage'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {typeScale.map((type, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Typography sample */}
                  <div className="lg:flex-1">
                    <div className="mb-4">
                      <div 
                        className="mb-2"
                        style={{ 
                          fontFamily: '"ttinterphases Pro", sans-serif',
                          fontSize: type.size,
                          lineHeight: type.lineHeight,
                          letterSpacing: type.tracking === '0%' ? 'normal' : '-0.02em',
                          fontWeight: '600'
                        }}
                      >
                        {type.name}
                      </div>
                      <div 
                        style={{ 
                          fontFamily: '"ttinterphases Pro", sans-serif',
                          fontSize: type.size,
                          lineHeight: type.lineHeight,
                          letterSpacing: type.tracking === '0%' ? 'normal' : '-0.02em',
                          fontWeight: '400'
                        }}
                      >
                        {currentLanguage === 'uz' ? 'Namuna matn' : 
                         currentLanguage === 'ru' ? 'Образец текста' : 
                         'Sample text'}
                      </div>
                    </div>
                  </div>

                  {/* Typography details */}
                  <div className="lg:w-80">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b">
                      <span className="font-semibold text-primary">{type.name}</span>
                      <Badge variant="outline">{type.usage}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <div className="font-mono">{type.size} / {type.rem}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Line height:</span>
                        <div className="font-mono">{type.lineHeight} / {type.lineHeightRem}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tracking:</span>
                        <div className="font-mono">{type.tracking}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Font:</span>
                        <div className="font-mono text-xs">ttinterphases Pro</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Guidelines */}
      <Card className="border-0 shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="text-center">
            {currentLanguage === 'uz' ? 'Typography qo\'llanish qoidalari' : 
             currentLanguage === 'ru' ? 'Правила использования типографики' : 
             'Typography Usage Guidelines'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-green-600 flex items-center gap-2">
                ✓ {currentLanguage === 'uz' ? 'To\'g\'ri' : currentLanguage === 'ru' ? 'Правильно' : 'Correct'}
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  {currentLanguage === 'uz' ? 'Font hierarchy ga rioya qiling' : 
                   currentLanguage === 'ru' ? 'Соблюдайте иерархию шрифтов' : 
                   'Follow font hierarchy'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  {currentLanguage === 'uz' ? 'Line height ni texted readability uchun to\'g\'ri sozlang' : 
                   currentLanguage === 'ru' ? 'Правильно настройте межстрочный интервал для читаемости' : 
                   'Set proper line heights for readability'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  {currentLanguage === 'uz' ? 'Contrast va accessibility qoidalariga amal qiling' : 
                   currentLanguage === 'ru' ? 'Соблюдайте правила контраста и доступности' : 
                   'Follow contrast and accessibility guidelines'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  {currentLanguage === 'uz' ? 'Semantic font weight larni ishlatning' : 
                   currentLanguage === 'ru' ? 'Используйте семантические веса шрифта' : 
                   'Use semantic font weights'}
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-red-600 flex items-center gap-2">
                ✗ {currentLanguage === 'uz' ? 'Noto\'g\'ri' : currentLanguage === 'ru' ? 'Неправильно' : 'Incorrect'}
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  {currentLanguage === 'uz' ? 'Typography scale dan tashqari o\'lchamlar ishlatmang' : 
                   currentLanguage === 'ru' ? 'Не используйте размеры вне типографической шкалы' : 
                   'Don\'t use sizes outside the typography scale'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  {currentLanguage === 'uz' ? 'Ko\'p font weight larni aralashtirib ishlatmang' : 
                   currentLanguage === 'ru' ? 'Не смешивайте много различных весов шрифта' : 
                   'Don\'t mix too many font weights'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  {currentLanguage === 'uz' ? 'Past contrast bilan matn yozmang' : 
                   currentLanguage === 'ru' ? 'Не используйте текст с низким контрастом' : 
                   'Avoid low contrast text'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  {currentLanguage === 'uz' ? 'Boshqa font family larni aralashtirib ishlatmang' : 
                   currentLanguage === 'ru' ? 'Не смешивайте разные семейства шрифтов' : 
                   'Don\'t mix different font families'}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}