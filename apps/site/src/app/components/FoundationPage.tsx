import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowLeft, Palette, Type, Layout, Grid, Move, Circle, Eye, Download } from 'lucide-react';
import { useTranslation } from './TranslationProvider';
import { TypographySection } from './TypographySection';

interface FoundationPageProps {
  onNavigate: (page: string) => void;
}

export function FoundationPage({ onNavigate }: FoundationPageProps) {
  const { t } = useTranslation();

  const foundationElements = [
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Design Tokens",
      description: "Asosiy dizayn tokenlar va ranglar",
      items: "Primary, Secondary, Success, Error, Warning, Gray",
      category: "Visual",
      onClick: () => onNavigate('design-tokens')
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Color System",
      description: "Ranglar tizimi va paletlar",
      items: "Primary, Secondary, Success, Error, Warning, Gray",
      category: "Visual"
    },
    {
      icon: <Type className="h-6 w-6" />,
      title: "Typography",
      description: "Matnlar va shriftlar",
      items: "ttinterphases Pro, Headers, Body, Labels",
      category: "Text"
    },
    {
      icon: <Move className="h-6 w-6" />,
      title: "Spacing System",
      description: "Masofa va o'lchamlar",
      items: "4px, 8px, 16px, 24px, 32px, 48px",
      category: "Layout"
    },
    {
      icon: <Circle className="h-6 w-6" />,
      title: "Border Radius",
      description: "Burchak radiuslari",
      items: "0px, 4px, 8px, 12px, 16px, 24px",
      category: "Visual"
    },
    {
      icon: <Grid className="h-6 w-6" />,
      title: "Grid System",
      description: "Layout va grid tizimi",
      items: "12 columns, Responsive breakpoints",
      category: "Layout"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Elevation",
      description: "Soyalar va chuqurlik",
      items: "None, Small, Medium, Large, Extra Large",
      category: "Visual"
    }
  ];

  const designTokens = [
    {
      name: "Colors",
      count: "24",
      description: "Brand va semantic ranglar"
    },
    {
      name: "Typography",
      count: "8",
      description: "Matn o'lchamlari va vaznlari"
    },
    {
      name: "Spacing",
      count: "12",
      description: "Margin va padding qiymatlari"
    },
    {
      name: "Shadows",
      count: "6",
      description: "Elevation soyalari"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-2 hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Orqaga</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Foundation</h1>
                <p className="text-sm text-muted-foreground">Dizayn tizimi asoslari</p>   
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Design Tokens
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Dizayn Foundation
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Pure dizayn tizimining asosiy elementlari - ranglar, typography, spacing va boshqa foundational tokenlar
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300">
                <Download className="h-5 w-5 mr-2" />
                Design Tokens
              </Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate('theming')}>
                Theming sahifasiga o'tish
              </Button>
            </div>
          </div>
        </section>

        {/* Design Tokens Overview */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Design Tokens</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dizayn tizimimizdagi barcha qiymatlar va tokenlar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {designTokens.map((token, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{token.count}</div>
                  <h4 className="font-semibold mb-2">{token.name}</h4>
                  <p className="text-sm text-muted-foreground">{token.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <TypographySection />

        {/* Foundation Elements */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Foundation Elementlar</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dizayn tizimimizning asosiy komponentlari va qoidalari
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foundationElements.map((element, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group ${element.onClick ? 'cursor-pointer' : ''}`}
                onClick={element.onClick}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                      {element.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {element.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{element.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {element.description}
                  </p>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      {element.items}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Platform Specific */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-background to-primary/5">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl md:text-3xl mb-4">
                  Platform-specific Foundation
                </CardTitle>
                <p className="text-lg text-muted-foreground">
                  Har bir platform uchun maxsus moslashtirilgan foundation elementlar
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Layout className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">Web (Angular)</h4>
                    <p className="text-sm text-muted-foreground">CSS Variables, SCSS mixins, Angular directives</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Grid className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">Android</h4>
                    <p className="text-sm text-muted-foreground">XML resources, Kotlin extensions, Material theming</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Type className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">iOS</h4>
                    <p className="text-sm text-muted-foreground">SwiftUI tokens, UIKit extensions, Asset catalogs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">
                  Foundation qo'llanish qoidalari
                </CardTitle>
                <p className="text-muted-foreground">
                  Foundation elementlarini to'g'ri ishlatish uchun asosiy qoidalar
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">✓ To'g'ri</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Foundation tokenlarini doimiy ishlatish</li>
                      <li>• Platform uchun mos keladigan qiymatlarni tanlash</li>
                      <li>• Semantic ranglarni ma'no bo'yicha ishlatish</li>
                      <li>• Izchil spacing tizimiga rioya qilish</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600">✗ Noto'g'ri</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Hard-coded qiymatlarni ishlatish</li>
                      <li>• Foundation tokenlarini o'zgartirish</li>
                      <li>• Platform-specific qoidalarni buzish</li>
                      <li>• Izchil emas bo'lgan o'lchamlarni qo'llash</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}