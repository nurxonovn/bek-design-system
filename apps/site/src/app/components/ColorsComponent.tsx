import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useTranslation } from './TranslationProvider';
import { Copy, Check, Shield, Palette, Eye, ArrowLeft } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { toast } from 'sonner';

export function ColorsComponent({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { t } = useTranslation();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyColor = async (color: string) => {
    const success = await copyToClipboard(color);
    if (success) {
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } else {
      toast.error('Failed to copy color');
    }
  };

  const colorPalette = {
    base: [
      { name: 'White', hex: '#FFFFFF', cssVar: '--color-white', usage: 'Pure white backgrounds', contrast: 'AAA' },
      { name: 'Black', hex: '#000000', cssVar: '--color-black', usage: 'High contrast text', contrast: 'AAA' },
      { name: 'Transparent', hex: 'transparent', cssVar: '--color-transparent', usage: 'Transparent overlays', contrast: '-' }
    ],
    gray: {
      light: [
        { name: 'Gray 25', hex: '#FCFCFD', cssVar: '--color-gray-25', usage: 'Lightest background', contrast: 'AA' },
        { name: 'Gray 50', hex: '#F9FAFB', cssVar: '--color-gray-50', usage: 'Card backgrounds', contrast: 'AA' },
        { name: 'Gray 100', hex: '#F2F4F7', cssVar: '--color-gray-100', usage: 'Subtle borders', contrast: 'AA' },
        { name: 'Gray 200', hex: '#EAECF0', cssVar: '--color-gray-200', usage: 'Disabled states', contrast: 'AA' },
        { name: 'Gray 300', hex: '#D0D5DD', cssVar: '--color-gray-300', usage: 'Borders and dividers', contrast: 'AAA' },
        { name: 'Gray 400', hex: '#98A2B3', cssVar: '--color-gray-400', usage: 'Placeholder text', contrast: 'AAA' },
        { name: 'Gray 500', hex: '#667085', cssVar: '--color-gray-500', usage: 'Secondary text', contrast: 'AAA' },
        { name: 'Gray 600', hex: '#475467', cssVar: '--color-gray-600', usage: 'Primary text light', contrast: 'AAA' },
        { name: 'Gray 700', hex: '#344054', cssVar: '--color-gray-700', usage: 'Emphasized text', contrast: 'AAA' },
        { name: 'Gray 800', hex: '#1D2939', cssVar: '--color-gray-800', usage: 'High emphasis', contrast: 'AAA' },
        { name: 'Gray 900', hex: '#101828', cssVar: '--color-gray-900', usage: 'Darkest text', contrast: 'AAA' },
        { name: 'Gray 950', hex: '#0C111D', cssVar: '--color-gray-950', usage: 'Maximum contrast', contrast: 'AAA' }
      ],
      dark: [
        { name: 'Gray 25', hex: '#0C111D', cssVar: '--color-gray-25-dark', usage: 'Darkest background', contrast: 'AAA' },
        { name: 'Gray 50', hex: '#101828', cssVar: '--color-gray-50-dark', usage: 'Card backgrounds', contrast: 'AAA' },
        { name: 'Gray 100', hex: '#1D2939', cssVar: '--color-gray-100-dark', usage: 'Elevated surfaces', contrast: 'AAA' },
        { name: 'Gray 200', hex: '#344054', cssVar: '--color-gray-200-dark', usage: 'Subtle borders', contrast: 'AAA' },
        { name: 'Gray 300', hex: '#475467', cssVar: '--color-gray-300-dark', usage: 'Borders and dividers', contrast: 'AAA' },
        { name: 'Gray 400', hex: '#667085', cssVar: '--color-gray-400-dark', usage: 'Placeholder text', contrast: 'AAA' },
        { name: 'Gray 500', hex: '#98A2B3', cssVar: '--color-gray-500-dark', usage: 'Secondary text', contrast: 'AAA' },
        { name: 'Gray 600', hex: '#D0D5DD', cssVar: '--color-gray-600-dark', usage: 'Primary text dark', contrast: 'AAA' },
        { name: 'Gray 700', hex: '#EAECF0', cssVar: '--color-gray-700-dark', usage: 'Emphasized text', contrast: 'AAA' },
        { name: 'Gray 800', hex: '#F2F4F7', cssVar: '--color-gray-800-dark', usage: 'High emphasis', contrast: 'AAA' },
        { name: 'Gray 900', hex: '#F9FAFB', cssVar: '--color-gray-900-dark', usage: 'Lightest text', contrast: 'AAA' },
        { name: 'Gray 950', hex: '#FCFCFD', cssVar: '--color-gray-950-dark', usage: 'Maximum contrast', contrast: 'AAA' }
      ]
    },
    brand: [
      { name: 'Brand 25', hex: '#F5F9FF', cssVar: '--color-brand-25', usage: 'Lightest brand tint', contrast: 'AA' },
      { name: 'Brand 50', hex: '#EFF6FF', cssVar: '--color-brand-50', usage: 'Subtle backgrounds', contrast: 'AA' },
      { name: 'Brand 100', hex: '#D1E9FF', cssVar: '--color-brand-100', usage: 'Light accents', contrast: 'AA' },
      { name: 'Brand 200', hex: '#B2D9FF', cssVar: '--color-brand-200', usage: 'Soft highlights', contrast: 'AAA' },
      { name: 'Brand 300', hex: '#84BFFF', cssVar: '--color-brand-300', usage: 'Medium accents', contrast: 'AAA' },
      { name: 'Brand 400', hex: '#53A4FD', cssVar: '--color-brand-400', usage: 'Hover states', contrast: 'AAA' },
      { name: 'Brand 500', hex: '#2E90FA', cssVar: '--color-brand-500', usage: 'Primary brand color', contrast: 'AAA' },
      { name: 'Brand 600', hex: '#1570EF', cssVar: '--color-brand-600', usage: 'Primary buttons', contrast: 'AAA' },
      { name: 'Brand 700', hex: '#175CD3', cssVar: '--color-brand-700', usage: 'Pressed states', contrast: 'AAA' },
      { name: 'Brand 800', hex: '#1849A9', cssVar: '--color-brand-800', usage: 'Strong emphasis', contrast: 'AAA' },
      { name: 'Brand 900', hex: '#194185', cssVar: '--color-brand-900', usage: 'Darkest brand', contrast: 'AAA' },
      { name: 'Brand 950', hex: '#102A56', cssVar: '--color-brand-950', usage: 'Maximum brand contrast', contrast: 'AAA' }
    ],
    error: [
      { name: 'Error 25', hex: '#FFFBFA', cssVar: '--color-error-25', usage: 'Lightest error tint', contrast: 'AA' },
      { name: 'Error 50', hex: '#FEF3F2', cssVar: '--color-error-50', usage: 'Error backgrounds', contrast: 'AA' },
      { name: 'Error 100', hex: '#FEE4E2', cssVar: '--color-error-100', usage: 'Light error accents', contrast: 'AA' },
      { name: 'Error 200', hex: '#FECDCA', cssVar: '--color-error-200', usage: 'Soft error highlights', contrast: 'AAA' },
      { name: 'Error 300', hex: '#FDA29B', cssVar: '--color-error-300', usage: 'Medium error accents', contrast: 'AAA' },
      { name: 'Error 400', hex: '#F97066', cssVar: '--color-error-400', usage: 'Error hover states', contrast: 'AAA' },
      { name: 'Error 500', hex: '#F04438', cssVar: '--color-error-500', usage: 'Primary error color', contrast: 'AAA' },
      { name: 'Error 600', hex: '#D92D20', cssVar: '--color-error-600', usage: 'Error buttons', contrast: 'AAA' },
      { name: 'Error 700', hex: '#B42318', cssVar: '--color-error-700', usage: 'Error pressed states', contrast: 'AAA' },
      { name: 'Error 800', hex: '#912018', cssVar: '--color-error-800', usage: 'Strong error emphasis', contrast: 'AAA' },
      { name: 'Error 900', hex: '#7A271A', cssVar: '--color-error-900', usage: 'Darkest error', contrast: 'AAA' },
      { name: 'Error 950', hex: '#55160C', cssVar: '--color-error-950', usage: 'Maximum error contrast', contrast: 'AAA' }
    ],
    warning: [
      { name: 'Warning 25', hex: '#FFFCF5', cssVar: '--color-warning-25', usage: 'Lightest warning tint', contrast: 'AA' },
      { name: 'Warning 50', hex: '#FFFAEB', cssVar: '--color-warning-50', usage: 'Warning backgrounds', contrast: 'AA' },
      { name: 'Warning 100', hex: '#FEF0C7', cssVar: '--color-warning-100', usage: 'Light warning accents', contrast: 'AA' },
      { name: 'Warning 200', hex: '#FEDF89', cssVar: '--color-warning-200', usage: 'Soft warning highlights', contrast: 'AAA' },
      { name: 'Warning 300', hex: '#FEC84B', cssVar: '--color-warning-300', usage: 'Medium warning accents', contrast: 'AAA' },
      { name: 'Warning 400', hex: '#FDB022', cssVar: '--color-warning-400', usage: 'Warning hover states', contrast: 'AAA' },
      { name: 'Warning 500', hex: '#F79009', cssVar: '--color-warning-500', usage: 'Primary warning color', contrast: 'AAA' },
      { name: 'Warning 600', hex: '#DC6803', cssVar: '--color-warning-600', usage: 'Warning buttons', contrast: 'AAA' },
      { name: 'Warning 700', hex: '#B54708', cssVar: '--color-warning-700', usage: 'Warning pressed states', contrast: 'AAA' },
      { name: 'Warning 800', hex: '#93370D', cssVar: '--color-warning-800', usage: 'Strong warning emphasis', contrast: 'AAA' },
      { name: 'Warning 900', hex: '#7A2E0E', cssVar: '--color-warning-900', usage: 'Darkest warning', contrast: 'AAA' },
      { name: 'Warning 950', hex: '#4E1D09', cssVar: '--color-warning-950', usage: 'Maximum warning contrast', contrast: 'AAA' }
    ],
    success: [
      { name: 'Success 25', hex: '#F6FEF9', cssVar: '--color-success-25', usage: 'Lightest success tint', contrast: 'AA' },
      { name: 'Success 50', hex: '#ECFDF3', cssVar: '--color-success-50', usage: 'Success backgrounds', contrast: 'AA' },
      { name: 'Success 100', hex: '#D1FADF', cssVar: '--color-success-100', usage: 'Light success accents', contrast: 'AA' },
      { name: 'Success 200', hex: '#A6F4C5', cssVar: '--color-success-200', usage: 'Soft success highlights', contrast: 'AAA' },
      { name: 'Success 300', hex: '#6CE9A6', cssVar: '--color-success-300', usage: 'Medium success accents', contrast: 'AAA' },
      { name: 'Success 400', hex: '#32D583', cssVar: '--color-success-400', usage: 'Success hover states', contrast: 'AAA' },
      { name: 'Success 500', hex: '#12B76A', cssVar: '--color-success-500', usage: 'Primary success color', contrast: 'AAA' },
      { name: 'Success 600', hex: '#039855', cssVar: '--color-success-600', usage: 'Success buttons', contrast: 'AAA' },
      { name: 'Success 700', hex: '#027A48', cssVar: '--color-success-700', usage: 'Success pressed states', contrast: 'AAA' },
      { name: 'Success 800', hex: '#05603A', cssVar: '--color-success-800', usage: 'Strong success emphasis', contrast: 'AAA' },
      { name: 'Success 900', hex: '#054F31', cssVar: '--color-success-900', usage: 'Darkest success', contrast: 'AAA' },
      { name: 'Success 950', hex: '#033A2E', cssVar: '--color-success-950', usage: 'Maximum success contrast', contrast: 'AAA' }
    ]
  };

  const ColorCard = ({ color }: { color: any }) => (
    <div className="group relative bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Color Swatch */}
      <div 
        className="h-16 w-full border-b border-border relative"
        style={{ backgroundColor: color.hex }}
      >
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0 bg-background/90 hover:bg-background shadow-sm"
            onClick={() => handleCopyColor(color.hex)}
          >
            {copiedColor === color.hex ? (
              <Check className="h-2.5 w-2.5 text-green-600" />
            ) : (
              <Copy className="h-2.5 w-2.5" />
            )}
          </Button>
        </div>
        {/* Contrast Badge */}
        {color.contrast !== '-' && (
          <div className="absolute bottom-1 left-1">
            <Badge 
              variant="secondary" 
              className={`text-xs px-1.5 py-0.5 ${
                color.contrast === 'AAA' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
              }`}
            >
              {color.contrast}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Color Info */}
      <div className="p-3 space-y-2">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-foreground">{color.name}</h4>
          <div className="flex items-center justify-between">
            <code className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {color.hex}
            </code>
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0 hover:bg-muted"
              onClick={() => handleCopyColor(color.hex)}
            >
              {copiedColor === color.hex ? (
                <Check className="h-2.5 w-2.5 text-green-600" />
              ) : (
                <Copy className="h-2.5 w-2.5" />
              )}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {color.usage}
        </p>
        <code className="block text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {color.cssVar}
        </code>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              <Shield className="h-3 w-3 mr-1" />
              {t.internalUse || 'Ichki foydalanish'}
            </Badge>
            {onNavigate && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate('components')}
                className="text-xs"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Komponentlarga qaytish
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Palette className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-medium">Rang Tokenlari</h1>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            SQB Business dizayn tizimi uchun to'liq rang tokenlari va palitralari. 
            Har bir rang accessibility standartlariga mos va light/dark mode uchun optimallashtirilgan.
          </p>
        </div>

        {/* Base Colors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Base Colors</CardTitle>
            <p className="text-sm text-muted-foreground">
              Asosiy ranglar - oq, qora va shaffof
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {colorPalette.base.map((color, index) => (
                <ColorCard key={index} color={color} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gray Colors - Light Mode */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Gray Scale - Light Mode</CardTitle>
            <p className="text-sm text-muted-foreground">
              Yorug' rejim uchun kulrang gradatsiyalar
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {colorPalette.gray.light.map((color, index) => (
                <ColorCard key={index} color={color} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gray Colors - Dark Mode */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Gray Scale - Dark Mode</CardTitle>
            <p className="text-sm text-muted-foreground">
              Qorong'u rejim uchun kulrang gradatsiyalar
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {colorPalette.gray.dark.map((color, index) => (
                <ColorCard key={index} color={color} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brand Colors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Brand Colors</CardTitle>
            <p className="text-sm text-muted-foreground">
              SQB brand ranglari - #2E90FA asosiy rang
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {colorPalette.brand.map((color, index) => (
                <ColorCard key={index} color={color} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Colors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Error Colors</CardTitle>
            <p className="text-sm text-muted-foreground">
              Xato va ogohlantirish uchun qizil ranglar
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {colorPalette.error.map((color, index) => (
                <ColorCard key={index} color={color} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Warning Colors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Warning Colors</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ogohlantirish uchun sariq-to'q sariq ranglar
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {colorPalette.warning.map((color, index) => (
                <ColorCard key={index} color={color} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Colors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Success Colors</CardTitle>
            <p className="text-sm text-muted-foreground">
              Muvaffaqiyat va tasdiq uchun yashil ranglar
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {colorPalette.success.map((color, index) => (
                <ColorCard key={index} color={color} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Guide */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Foydalanish Ko'rsatmalari</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">CSS Variables</h4>
                <pre className="bg-muted rounded p-3 text-xs overflow-x-auto">
                  <code>{`/* Ranglarni CSS da ishlatish */
.my-component {
  background-color: var(--color-brand-500);
  color: var(--color-gray-50);
  border: 1px solid var(--color-gray-300);
}`}</code>
                </pre>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Tailwind Classes</h4>
                <pre className="bg-muted rounded p-3 text-xs overflow-x-auto">
                  <code>{`<!-- Tailwind bilan ishlatish -->
<div class="bg-primary text-primary-foreground border-border">
  Content
</div>`}</code>
                </pre>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Angular Template</h4>
                <pre className="bg-muted rounded p-3 text-xs overflow-x-auto">
                  <code>{`<!-- Angular template da ishlatish -->
<sqb-button 
  [style.background-color]="'var(--color-brand-500)'"
  class="text-white">
  Brand Button
</sqb-button>`}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}