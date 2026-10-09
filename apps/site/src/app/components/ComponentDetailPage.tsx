import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { SegmentPicker } from './SegmentPicker';
import { useTranslation } from './TranslationProvider';
import { usePlatform } from './PlatformProvider';
import { ArrowLeft, Copy, Download, Eye, Code, Palette, Shield } from 'lucide-react';

interface ComponentDetailPageProps {
  componentId: string;
  onNavigate: (page: string) => void;
}

export function ComponentDetailPage({ componentId, onNavigate }: ComponentDetailPageProps) {
  const { t } = useTranslation();
  const { currentPlatform } = usePlatform();

  // Mock component data - bu yerda real component ma'lumotlari bo'lishi kerak
  const componentData = {
    id: componentId,
    name: getComponentName(componentId),
    description: getComponentDescription(componentId),
    category: getComponentCategory(componentId),
    version: '1.0.0',
    lastUpdated: '2024-01-15'
  };

  function getComponentName(id: string): string {
    const names: { [key: string]: string } = {
      'button': 'Button',
      'input': 'Input',
      'card': 'Card',
      'checkbox': 'Checkbox',
      'switch': 'Switch',
      'icons': 'Icons',
      'colors': 'Colors',
      'typography': 'Typography'
    };
    return names[id] || 'Component';
  }

  function getComponentDescription(id: string): string {
    const descriptions: { [key: string]: string } = {
      'button': 'Harakatlarni boshlash uchun foydalaniladigan tugma komponenti',
      'input': 'Foydalanuvchi kiritishi uchun matn maydoni',
      'card': 'Tarkibni guruhlash uchun konteyner komponenti',
      'checkbox': 'Ko\'p tanlov imkoniyati beruvchi komponent',
      'switch': 'Yoqish/o\'chirish funksiyasi uchun komponent',
      'icons': 'Tizimda ishlatiladigan ikonlar to\'plami',
      'colors': 'Rang palette va ranglar tizimi',
      'typography': 'Matn va shrift sozlamalari'
    };
    return descriptions[id] || 'Komponent haqida ma\'lumot';
  }

  function getComponentCategory(id: string): string {
    const categories: { [key: string]: string } = {
      'button': 'UI Kit',
      'input': 'UI Kit',
      'card': 'UI Kit',
      'checkbox': 'UI Kit',
      'switch': 'UI Kit',
      'icons': 'Foundation',
      'colors': 'Foundation',
      'typography': 'Foundation'
    };
    return categories[id] || 'UI Kit';
  }

  const renderComponentPreview = () => {
    // Platform-specific preview
    switch (componentId) {
      case 'button':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        );
      case 'input':
        return (
          <div className="space-y-4 max-w-md">
            <input 
              type="text" 
              placeholder="Default input" 
              className="w-full px-3 py-2 border border-border rounded-md"
            />
            <input 
              type="text" 
              placeholder="Disabled input" 
              disabled
              className="w-full px-3 py-2 border border-border rounded-md opacity-50"
            />
          </div>
        );
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <Palette className="h-12 w-12 mx-auto mb-3" />
            <p>Component preview bo'ladi</p>
          </div>
        );
    }
  };

  const renderCodeExample = () => {
    const codeExamples: { [key: string]: string } = {
      web: `// Angular Component Example
<pure-${componentId} 
  [variant]="'primary'"
  [size]="'default'"
  (click)="handleClick()">
  Click me
</pure-${componentId}>`,
      android: `// Android Compose Example
PureButton(
    text = "Click me",
    variant = ButtonVariant.Primary,
    onClick = { handleClick() }
)`,
      ios: `// SwiftUI Example
PureButton(
    title: "Click me",
    variant: .primary,
    action: handleClick
)`
    };

    return codeExamples[currentPlatform] || codeExamples.web;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('components')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Componentlarga qaytish
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl md:text-3xl font-medium">{componentData.name}</h1>
                <Badge variant="secondary">{componentData.category}</Badge>
                <Badge variant="outline">v{componentData.version}</Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {componentData.description}
              </p>
            </div>
            <SegmentPicker />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Jonli Ko'rinish</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-3 w-3 mr-1" />
                      Nusxalash
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <div className="min-h-[200px] flex items-center justify-center bg-muted/30 rounded-lg">
                  {renderComponentPreview()}
                </div>
              </CardContent>
            </Card>

            {/* Code Example */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-4 w-4" />
                  <span>Kod Namunasi ({currentPlatform.toUpperCase()})</span>
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <pre className="bg-muted p-4 rounded-b-lg overflow-x-auto text-sm">
                  <code>{renderCodeExample()}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* Component Info */}
            <Card>
              <CardHeader>
                <CardTitle>Komponent Ma'lumotlari</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-4 space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Kategoriya</label>
                  <p className="text-sm font-medium">{componentData.category}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Versiya</label>
                  <p className="text-sm font-medium">v{componentData.version}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Oxirgi yangilanish</label>
                  <p className="text-sm font-medium">{componentData.lastUpdated}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Platform</label>
                  <p className="text-sm font-medium capitalize">{currentPlatform}</p>
                </div>
              </CardContent>
            </Card>

            {/* Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Xususiyatlar</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>variant:</strong> primary | secondary | outline | ghost
                  </div>
                  <div>
                    <strong>size:</strong> sm | default | lg
                  </div>
                  <div>
                    <strong>disabled:</strong> boolean
                  </div>
                  <div>
                    <strong>loading:</strong> boolean
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Resurslar</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-4 space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-3 w-3 mr-2" />
                  Figma fayli yuklab olish
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-3 w-3 mr-2" />
                  Design tokens
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Code className="h-3 w-3 mr-2" />
                  GitHub repositoriyasi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}