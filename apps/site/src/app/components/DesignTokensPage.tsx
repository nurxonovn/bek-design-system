import React from 'react';
import { ArrowLeft, Palette, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface DesignTokensPageProps {
  onNavigate: (page: string) => void;
}

export function DesignTokensPage({ onNavigate }: DesignTokensPageProps) {
  const colorTokens = [
    { name: 'Primary', value: '#2E90FA', description: 'Asosiy brand rangi' },
    { name: 'Secondary', value: '#64748B', description: 'Ikkinchi darajali rang' },
    { name: 'Success', value: '#10B981', description: 'Muvaffaqiyat holati' },
    { name: 'Warning', value: '#F59E0B', description: 'Ogohlantirish holati' },
    { name: 'Error', value: '#EF4444', description: 'Xatolik holati' },
    { name: 'Background', value: '#FAFAFA', description: 'Orqa fon rangi' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('foundation')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Orqaga
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Dizayn Tokenlar
              </h1>
              <p className="text-sm text-muted-foreground">
                Dizayn tizimimizdagi barcha asosiy rang va token namunalari
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Color Tokens Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Palette className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Rang Tokenlari</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colorTokens.map((token, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{token.name}</CardTitle>
                      <div 
                        className="w-8 h-8 rounded-full border border-border"
                        style={{ backgroundColor: token.value }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {token.value}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {token.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Typography Tokens */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Circle className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Tipografiya Tokenlari</h2>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-4xl font-medium mb-2">Heading 1</h3>
                    <Badge variant="outline">ttinterphases Pro, 36px, Medium</Badge>
                  </div>
                  <div>
                    <h4 className="text-2xl font-medium mb-2">Heading 2</h4>
                    <Badge variant="outline">ttinterphases Pro, 24px, Medium</Badge>
                  </div>
                  <div>
                    <p className="text-base mb-2">Body Text</p>
                    <Badge variant="outline">ttinterphases Pro, 16px, Normal</Badge>
                  </div>
                  <div>
                    <p className="text-sm mb-2">Small Text</p>
                    <Badge variant="outline">ttinterphases Pro, 14px, Normal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Spacing Tokens */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Circle className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Spacing Tokenlari</h2>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[4, 8, 16, 24, 32, 48, 64, 80].map((size) => (
                    <div key={size} className="text-center">
                      <div 
                        className="bg-primary/20 mx-auto mb-2"
                        style={{ width: `${size}px`, height: '16px' }}
                      />
                      <Badge variant="outline">{size}px</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}