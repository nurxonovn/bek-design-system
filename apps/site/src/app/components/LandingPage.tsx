import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Accessibility, 
  TrendingUp, 
  Palette,
  Type,
  Layout,
  Grid,
  FileText,
  Users,
  CheckCircle,
  Code,
  Layers,
  Sparkles
} from 'lucide-react';
import { useTranslation } from './TranslationProvider';
import Icon1 from '../imports/Icon1';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { t } = useTranslation();

  // Core values cards data
  const coreValues = [
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Consistency",
      description: "Barcha BEK mahsulotlarida bir xil uslub va komponentlar"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Speed",
      description: "Faster prototyping and development with pre-built components"
    },
    {
      icon: <Accessibility className="h-8 w-8" />,
      title: "Accessibility",
      description: "Inclusive, WCAG-compliant interfaces for all users"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Scalability", 
      description: "Designed to grow with products and evolving business needs"
    }
  ];

  // Design tokens preview data
  const designTokens = [
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Colors",
      description: "Brand colors, semantic tokens",
      preview: (
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-primary rounded-full"></div>
          <div className="w-4 h-4 bg-secondary rounded-full"></div>
          <div className="w-4 h-4 bg-muted rounded-full"></div>
        </div>
      )
    },
    {
      icon: <Type className="h-6 w-6" />,
      title: "Typography", 
      description: "Font scales, weights, spacing",
      preview: (
        <div className="text-right">
          <div className="font-medium" style={{ fontSize: 'var(--text-lg)' }}>Aa</div>
          <div className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>Inter</div>
        </div>
      )
    },
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Spacing",
      description: "Consistent spacing system",
      preview: (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-primary/30 rounded"></div>
          <div className="w-3 h-3 bg-primary/50 rounded"></div>
          <div className="w-4 h-4 bg-primary rounded"></div>
        </div>
      )
    }
  ];

  // Component preview data
  const componentPreviews = [
    {
      name: "Buttons",
      description: "Primary, secondary, and tertiary actions"
    },
    {
      name: "Forms",
      description: "Input fields, validation, and form layouts"
    },
    {
      name: "Navigation",
      description: "Headers, menus, and navigation patterns"
    },
    {
      name: "Data Display",
      description: "Tables, cards, and information architecture"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        {/* Abstract geometric background */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-6 pt-32 pb-24 text-center">
          {/* Logo */}

          
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-8 px-4 py-2 bg-primary/10 text-primary border-primary/20">
              <Shield className="h-4 w-4 mr-2" />
              BEK Design System · Figma ↔ kod
            </Badge>
            
            <h1 className="font-medium tracking-tight mb-6" style={{ fontSize: 'var(--text-6xl)', lineHeight: '1.1' }}>
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent text-[56px] font-bold">
                BEK
              </span>
              <span className="block text-foreground mt-2 font-normal" style={{ fontSize: 'var(--text-4xl)' }}>
                Design System
              </span>
            </h1>
            
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed text-center" style={{ fontSize: 'var(--text-xl)' }}>
              Figma'dagi har bir komponent — kodda aynan o'zi. Tokenlar, variantlar, qoidalar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => onNavigate('components')} 
                className="px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ borderRadius: 'var(--radius)' }}
              >
                Komponentlar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => onNavigate('docs')} 
                className="px-8 py-4 border-2 border-border hover:bg-accent transition-all duration-300"
                style={{ borderRadius: 'var(--radius)' }}
              >
                Boshlash
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About BEK Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-medium mb-6" style={{ fontSize: 'var(--text-5xl)' }}>BEK Design System nima?</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-center" style={{ fontSize: 'var(--text-lg)' }}>
            BEK mahsulotlari uchun yagona dizayn-tizim: Figma manba, @bek/tokens va @bek/react — bitta haqiqat.
            Har komponent Figma spetsifikatsiyasi bilan avtomatik tekshiriladi.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center rounded-[20px]">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  {value.icon}
                </div>
                <h3 className="font-medium mb-4" style={{ fontSize: 'var(--text-lg)' }}>{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-center">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Core Elements Section */}
      <section className="bg-accent/20 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-medium mb-6" style={{ fontSize: 'var(--text-5xl)' }}>Core Elements</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-center" style={{ fontSize: 'var(--text-lg)' }}>
              Foundational design tokens and components that power consistent experiences
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Design Tokens */}
            <div className="mb-16">
              <h3 className="font-medium mb-8 text-center" style={{ fontSize: 'var(--text-2xl)' }}>Design Tokens</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {designTokens.map((token, index) => (
                  <Card key={index} className="border-border hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-primary">
                            {token.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{token.title}</h4>
                            <p className="text-muted-foreground text-center" style={{ fontSize: 'var(--text-sm)' }}>{token.description}</p>
                          </div>
                        </div>
                        {token.preview}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Component Preview */}
            <div>
              <h3 className="font-medium mb-8 text-center" style={{ fontSize: 'var(--text-2xl)' }}>UI Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {componentPreviews.map((component, index) => (
                  <Card 
                    key={index} 
                    className="border-border hover:shadow-md transition-all duration-300 cursor-pointer hover:border-primary/30"
                    onClick={() => onNavigate('components')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Layers className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-medium mb-2">{component.name}</h4>
                      <p className="text-muted-foreground text-center" style={{ fontSize: 'var(--text-sm)' }}>{component.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Portal Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-medium mb-6" style={{ fontSize: 'var(--text-5xl)' }}>Documentation & Portal</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed text-center" style={{ fontSize: 'var(--text-lg)' }}>
                Centralized guidelines and components for designers and developers. 
                Izchil BEK interfeyslari uchun kerak bo'lgan hamma narsa.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Component specifications and usage guidelines</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Code examples for Angular, Android, and iOS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Design tokens and brand guidelines</span>
                </div>
              </div>
              
              <Button 
                onClick={() => onNavigate('docs')} 
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Documentation
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <Card className="border-border shadow-xl">
                <CardContent className="p-0">
                  {/* Mock documentation interface */}
                  <div className="bg-accent/50 p-4 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <span className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>BEK Documentation</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Button Component</h4>
                        <Badge variant="secondary" style={{ fontSize: 'var(--text-xs)' }}>Angular</Badge>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <code className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                          {'<Button variant="action">'}
                          <br />
                          {'  Submit Application'}
                          <br />
                          {'</Button>'}
                        </code>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" style={{ fontSize: 'var(--text-xs)' }}>Primary</Button>
                        <Button size="sm" variant="outline" style={{ fontSize: 'var(--text-xs)' }}>Secondary</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Governance Section */}
      <section className="bg-accent/20 py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-medium mb-6" style={{ fontSize: 'var(--text-5xl)' }}>Community & Governance</h2>
            <p className="text-muted-foreground mb-12 leading-relaxed text-center" style={{ fontSize: 'var(--text-lg)' }}>
              BEK dizaynerlari va dasturchilari tomonidan, butun ekotizim uchun. 
              Collaborative development ensures quality and consistency.
            </p>
            
            <div className="flex justify-center mb-12">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full border-4 border-background flex items-center justify-center"
                  >
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                ))}
                <div className="w-12 h-12 bg-muted rounded-full border-4 border-background flex items-center justify-center font-medium text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  +12
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h4 className="font-medium mb-2 text-[rgb(34,34,34)] text-[16px]">Design Team</h4>
                  <p className="text-muted-foreground text-center" style={{ fontSize: 'var(--text-sm)' }}>UX/UI designers ensuring consistency</p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <Code className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h4 className="font-medium mb-2 text-[16px] text-[rgb(34,34,34)]">Engineering</h4>
                  <p className="text-muted-foreground text-center" style={{ fontSize: 'var(--text-sm)' }}>Frontend developers building components</p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Product</h4>
                  <p className="text-muted-foreground text-center" style={{ fontSize: 'var(--text-sm)' }}>Product managers driving requirements</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-6 py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-medium mb-8" style={{ fontSize: 'var(--text-6xl)' }}>
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent text-[56px] font-bold">
              Start building with BEK
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed text-center" style={{ fontSize: 'var(--text-xl)' }}>
            BEK ilovalaringizni yagona dizayn-tizim bilan tezroq va izchil quring. 
            Built for scale, designed for success.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => onNavigate('docs')} 
            className="px-12 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            style={{ fontSize: 'var(--text-lg)', borderRadius: 'var(--radius)' }}
          >
            Boshlash
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 pt-16 border-t border-border">
            <div className="text-center">
              <div className="font-medium text-primary mb-2" style={{ fontSize: 'var(--text-4xl)' }}>50+</div>
              <div className="text-[rgb(136,136,136)]">Components</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-primary mb-2" style={{ fontSize: 'var(--text-4xl)' }}>3</div>
              <div className="text-[rgb(136,136,136)]">Platforms</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-primary mb-2" style={{ fontSize: 'var(--text-4xl)' }}>100%</div>
              <div className="text-[rgb(136,136,136)]">BEK Brand</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}