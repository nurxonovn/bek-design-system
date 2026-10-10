import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { SegmentPicker } from './SegmentPicker';
import { useTranslation } from './TranslationProvider';
import { usePlatform } from './PlatformProvider';

import { 
  Search, Eye, Code, Shield, Palette, Type, Grid3X3, 
  Move, CornerDownLeft, Image, Navigation, Bell, 
  MessageSquare, Layers, Menu, Settings, AlertCircle,
  CheckCircle, XCircle, Info
} from 'lucide-react';

// Static data moved outside component
const getFoundationComponents = () => [
  {
    id: 'icons',
    name: 'Icons',
    description: 'HugeIcons professional to\'plamidan 1000+ professional ikon',
    icon: 'Image'
  },
  {
    id: 'colors',
    name: 'Colors', 
    description: 'Brand ranglari va rang palitralari',
    icon: 'Palette'
  },
  {
    id: 'typography',
    name: 'Typography',
    description: 'Matn stillari va font tizimi',
    icon: 'Type'
  },
  {
    id: 'logos',
    name: 'Logos',
    description: 'Brand logotiplari va nishonlari',
    icon: 'Shield'
  },
  {
    id: 'spacing',
    name: 'Spacing',
    description: 'Tizim spacing va padding qoidalari',
    icon: 'Move'
  },
  {
    id: 'radius',
    name: 'Border Radius',
    description: 'Burchak radiuslari tizimi',
    icon: 'CornerDownLeft'
  }
];

const getFormComponents = (t: any) => [
  {
    id: 'button',
    name: t.buttonName || 'Button',
    description: t.buttonDesc || 'Tugma komponenti'
  },
  {
    id: 'input',
    name: t.inputName || 'Input',
    description: t.inputDesc || 'Matn kiritish komponenti'
  },
  {
    id: 'checkbox',
    name: t.checkboxName || 'Checkbox',
    description: t.checkboxDesc || 'Belgilash komponenti'
  },
  {
    id: 'radio',
    name: 'Radio',
    description: 'Yagona tanlov komponenti'
  },
  {
    id: 'switch',
    name: t.switchName || 'Switch',
    description: t.switchDesc || 'Yoqish/o\'chirish komponenti'
  },
  {
    id: 'select',
    name: 'Select',
    description: 'Variantlardan tanlash komponenti'
  },
  {
    id: 'textarea',
    name: 'Textarea',
    description: 'Ko\'p qatorli matn kiritish'
  }
];

const getDataDisplayComponents = (t: any) => [
  {
    id: 'table',
    name: 'Table',
    description: 'Ma\'lumotlarni jadval ko\'rinishida ko\'rsatish'
  },
  {
    id: 'card',
    name: t.cardName || 'Card',
    description: t.cardDesc || 'Karta komponenti'
  },
  {
    id: 'avatar',
    name: t.avatarName || 'Avatar',
    description: t.avatarDesc || 'Avatar komponenti'
  },
  {
    id: 'badge',
    name: t.badgeName || 'Badge',
    description: t.badgeDesc || 'Badge komponenti'
  },
  {
    id: 'progress',
    name: t.progressName || 'Progress',
    description: t.progressDesc || 'Progress komponenti'
  },
  {
    id: 'slider',
    name: t.sliderName || 'Slider',
    description: t.sliderDesc || 'Slayder komponenti'
  }
];

const getNavigationComponents = () => [
  {
    id: 'navigation-menu',
    name: 'Navigation Menu',
    description: 'Asosiy navigatsiya menyulari'
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    description: 'Navigatsiya yo\'li ko\'rsatkichi'
  },
  {
    id: 'tabs',
    name: 'Tabs',
    description: 'Tab navigatsiya komponenti'
  },
  {
    id: 'pagination',
    name: 'Pagination',
    description: 'Sahifalash komponenti'
  }
];

const getFeedbackComponents = () => [
  {
    id: 'alert',
    name: 'Alert',
    description: 'Xabar va ogohlantirish komponentlari'
  },
  {
    id: 'toast',
    name: 'Toast',
    description: 'Qisqa muddatli xabarlar'
  },
  {
    id: 'modal',
    name: 'Modal',
    description: 'Modal dialog oynasi'
  },
  {
    id: 'dialog',
    name: 'Dialog',
    description: 'Tasdiqlash dialoglari'
  }
];

export function ComponentsPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { t } = useTranslation();
  const { currentPlatform } = usePlatform();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Handle component detail view
  const handleViewComponentDetail = (componentId: string) => {
    // Navigate to component detail page
    if (onNavigate) {
      onNavigate(`component-detail-${componentId}`);
    }
  };

  // Memoized component data
  const componentData = useMemo(() => {
    const foundation = getFoundationComponents();
    const formControls = getFormComponents(t);
    const dataDisplay = getDataDisplayComponents(t);
    const navigation = getNavigationComponents();
    const feedback = getFeedbackComponents();
    
    return { foundation, formControls, dataDisplay, navigation, feedback };
  }, [t]);

  // Memoized categories
  const categories = useMemo(() => {
    const { foundation, formControls, dataDisplay, navigation, feedback } = componentData;
    const total = foundation.length + formControls.length + dataDisplay.length + navigation.length + feedback.length;
    
    return [
      { id: 'all', name: 'Barchasi', count: total },
      { id: 'foundation', name: 'Foundation', count: foundation.length },
      { id: 'form-controls', name: 'Form Controls', count: formControls.length },
      { id: 'data-display', name: 'Data Display', count: dataDisplay.length },
      { id: 'navigation', name: 'Navigation', count: navigation.length },
      { id: 'feedback', name: 'Feedback & Overlays', count: feedback.length },
    ];
  }, [componentData]);

  // Memoized filtered components
  const filteredData = useMemo(() => {
    const filterComponents = (components: any[]) => {
      if (!searchTerm) return components;
      return components.filter(component => {
        const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             component.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
    };

    return {
      foundation: filterComponents(componentData.foundation),
      formControls: filterComponents(componentData.formControls),
      dataDisplay: filterComponents(componentData.dataDisplay),
      navigation: filterComponents(componentData.navigation),
      feedback: filterComponents(componentData.feedback)
    };
  }, [componentData, searchTerm]);

  const shouldShowSection = (sectionId: string) => {
    return selectedCategory === 'all' || selectedCategory === sectionId;
  };

  const handlePreviewComponent = (componentId: string) => {
    console.log(`Preview component: ${componentId}`);
    if (componentId === 'colors' && onNavigate) {
      onNavigate('colors');
    }
  };

  const handleViewCode = (componentId: string) => {
    console.log(`Code for ${componentId} on ${currentPlatform}`);
    alert(`${currentPlatform.toUpperCase()} kodi ko'rsatiladi`);
  };

  const renderIcon = (iconName: string) => {
    const iconProps = { className: "h-6 w-6" };
    switch (iconName) {
      case 'Image': return <Image {...iconProps} />;
      case 'Palette': return <Palette {...iconProps} />;
      case 'Type': return <Type {...iconProps} />;
      case 'Shield': return <Shield {...iconProps} />;
      case 'Move': return <Move {...iconProps} />;
      case 'CornerDownLeft': return <CornerDownLeft {...iconProps} />;
      default: return <Grid3X3 {...iconProps} />;
    }
  };

  const renderSimplePreview = (componentId: string) => {
    switch (componentId) {
      case 'icons':
        return (
          <div className="flex items-center justify-center gap-1">
            <div className="grid grid-cols-3 gap-1">
              <Search className="h-3 w-3 text-primary" />
              <Bell className="h-3 w-3 text-primary" />
              <Settings className="h-3 w-3 text-primary" />
              <Menu className="h-3 w-3 text-primary" />
              <AlertCircle className="h-3 w-3 text-primary" />
              <CheckCircle className="h-3 w-3 text-primary" />
            </div>
          </div>
        );
      case 'colors':
        return (
          <div className="flex items-center justify-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#2E90FA]"></div>
            <div className="w-3 h-3 rounded-full bg-[#F04438]"></div>
            <div className="w-3 h-3 rounded-full bg-[#F79009]"></div>
            <div className="w-3 h-3 rounded-full bg-[#12B76A]"></div>
            <div className="w-3 h-3 rounded-full bg-[#667085]"></div>
          </div>
        );
      case 'typography':
        return (
          <div className="text-center space-y-1">
            <div className="text-sm font-medium">Heading</div>
            <div className="text-xs text-muted-foreground">Body</div>
          </div>
        );
      case 'button':
        return (
          <div className="flex gap-1 flex-wrap">
            <Button size="sm" className="text-xs px-2 py-1 h-7">Primary</Button>
            <Button variant="secondary" size="sm" className="text-xs px-2 py-1 h-7">Secondary</Button>
            <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-7">Outline</Button>
          </div>
        );
      case 'input':
        return (
          <div className="w-full space-y-2">
            <Input placeholder="Sample input" className="text-xs h-7" />
            <Input placeholder="Disabled" disabled className="text-xs h-7" />
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center gap-3">
            <Checkbox id={`check-${componentId}`} defaultChecked />
            <Checkbox id={`check-${componentId}-2`} />
          </div>
        );
      case 'radio':
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full border-2 border-border"></div>
            </div>
          </div>
        );
      case 'switch':
        return (
          <div className="flex items-center gap-2">
            <Switch defaultChecked />
            <Switch />
          </div>
        );
      case 'select':
        return (
          <div className="w-full">
            <select className="w-full px-2 py-1 text-xs border border-border rounded-md bg-background">
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>
        );
      case 'textarea':
        return (
          <textarea 
            placeholder="Textarea..." 
            className="w-full px-2 py-1 text-xs border border-border rounded-md bg-background resize-none"
            rows={2}
          />
        );
      case 'table':
        return (
          <div className="w-full overflow-hidden">
            <div className="text-xs">
              <div className="flex border-b border-border">
                <div className="flex-1 px-2 py-1 font-medium">Name</div>
                <div className="flex-1 px-2 py-1 font-medium">Status</div>
              </div>
              <div className="flex border-b border-border">
                <div className="flex-1 px-2 py-1 text-muted-foreground">Item 1</div>
                <div className="flex-1 px-2 py-1 text-muted-foreground">Active</div>
              </div>
            </div>
          </div>
        );
      case 'card':
        return (
          <Card className="w-full">
            <CardContent className="p-2">
              <div className="text-xs text-muted-foreground">Card content</div>
            </CardContent>
          </Card>
        );
      case 'avatar':
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">AB</AvatarFallback>
            </Avatar>
          </div>
        );
      case 'badge':
        return (
          <div className="flex items-center gap-1 flex-wrap">
            <Badge variant="default" className="text-xs px-1.5 py-0">New</Badge>
            <Badge variant="secondary" className="text-xs px-1.5 py-0">Beta</Badge>
            <Badge variant="outline" className="text-xs px-1.5 py-0">Info</Badge>
          </div>
        );
      case 'progress':
        return (
          <div className="w-full space-y-1">
            <Progress value={60} className="h-1" />
            <Progress value={30} className="h-1" />
          </div>
        );
      case 'slider':
        return <Slider value={[50]} max={100} step={1} className="w-full" />;
      case 'navigation-menu':
        return (
          <div className="flex gap-1 text-xs">
            <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Home</div>
            <div className="px-2 py-1 text-muted-foreground">About</div>
          </div>
        );
      case 'breadcrumb':
        return (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Home</span>
            <span>/</span>
            <span className="text-foreground">Page</span>
          </div>
        );
      case 'tabs':
        return (
          <div className="w-full">
            <div className="flex border-b border-border">
              <div className="px-2 py-1 text-xs border-b-2 border-primary text-primary">Tab 1</div>
              <div className="px-2 py-1 text-xs text-muted-foreground">Tab 2</div>
            </div>
          </div>
        );
      case 'pagination':
        return (
          <div className="flex items-center gap-1 text-xs">
            <div className="w-5 h-5 flex items-center justify-center border border-border rounded">1</div>
            <div className="w-5 h-5 flex items-center justify-center border border-primary bg-primary text-primary-foreground rounded">2</div>
            <div className="w-5 h-5 flex items-center justify-center border border-border rounded">3</div>
          </div>
        );
      case 'alert':
        return (
          <div className="w-full space-y-1">
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs">
              <Info className="h-2.5 w-2.5" />
              <span>Alert message</span>
            </div>
          </div>
        );
      case 'toast':
        return (
          <div className="w-full">
            <div className="flex items-center gap-1 px-2 py-1 bg-card border border-border rounded shadow-sm text-xs">
              <CheckCircle className="h-2.5 w-2.5 text-green-500" />
              <span>Success toast</span>
            </div>
          </div>
        );
      case 'modal':
      case 'dialog':
        return (
          <div className="w-full">
            <div className="border border-border rounded bg-card p-2 shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-medium">Modal Title</div>
                <XCircle className="h-2.5 w-2.5 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground">Content...</div>
            </div>
          </div>
        );
      default:
        return <div className="text-xs text-muted-foreground">Preview</div>;
    }
  };

  const renderComponentCard = (component: any, showActions = false) => (
    <Card 
      key={component.id} 
      className="group hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => {
        if (component.id === 'icons' && onNavigate) {
          onNavigate('icons');
        } else {
          handleViewComponentDetail(component.id);
        }
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2">
            {component.icon && (
              <div className="text-primary mt-0.5">
                {renderIcon(component.icon)}
              </div>
            )}
            <div>
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {component.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed text-center">
                {component.description}
              </p>
            </div>
          </div>
          {showActions && (
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => handlePreviewComponent(component.id)}
                title="Preview"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => handleViewCode(component.id)}
                title="Code"
              >
                <Code className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-3">
        <div className="min-h-[60px] flex items-center justify-center">
          {renderSimplePreview(component.id)}
        </div>
      </CardContent>
    </Card>
  );

  const renderSection = (title: string, icon: React.ReactNode, components: any[], showActions = false) => {
    const sectionId = title.toLowerCase().replace(/\s+/g, '-').replace('&', '');
    if (!shouldShowSection(sectionId)) return null;
    if (components.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 px-4 py-2 bg-muted/30 rounded-lg">
          {icon}
          <h2>{title}</h2>
          <Badge variant="outline">
            {components.length}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {components.map(component => renderComponentCard(component, showActions))}
        </div>
      </div>
    );
  };

  const hasResults = Object.values(filteredData).some(arr => arr.length > 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" style={{ fontSize: 'var(--text-xs)' }}>
              <Shield className="h-3 w-3 mr-1" />
              {t.internalUse || 'Ichki foydalanish'}
            </Badge>
            <Badge variant="outline" style={{ fontSize: 'var(--text-xs)' }}>
              So'ngi yangilanish: 10.10.2025
            </Badge>
            <Badge variant="outline" style={{ fontSize: 'var(--text-xs)' }}>
              v1.0.0
            </Badge>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 style={{ fontSize: 'var(--text-3xl)' }}>{t.componentsTitle || 'Komponentlar'}</h1>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={() => onNavigate && onNavigate('component-showcase')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Barcha variantlar
              </Button>
              <SegmentPicker />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground leading-relaxed max-w-2xl text-center" style={{ fontSize: 'var(--text-sm)' }}>
              BEK dizayn tizimi {currentPlatform === 'web' ? 'Angular' : currentPlatform === 'android' ? 'Android' : 'iOS'} komponent kutubxonasi. 
              Barcha komponentlar production-ready va bank standartlariga moslashtirilgan. Har bir komponent barcha variant va holatlarini ko'rish uchun "Barcha variantlar" tugmasini bosing.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>
              <span>• 30+ Komponent</span>
              <span>• TypeScript Support</span>
              <span>• Light/Dark Mode</span>
              <span>• Token-Based Design</span>
              <span>• React Ready</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t.searchComponents || 'Komponentlarni qidirish...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 text-sm h-9"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-xs h-8"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-8">
          {renderSection('Foundation', <Layers className="h-5 w-5 text-primary" />, filteredData.foundation, true)}
          {renderSection('Form Controls', <Grid3X3 className="h-5 w-5 text-primary" />, filteredData.formControls, true)}
          {renderSection('Data Display', <Eye className="h-5 w-5 text-primary" />, filteredData.dataDisplay, true)}
          {renderSection('Navigation & Interaction', <Navigation className="h-5 w-5 text-primary" />, filteredData.navigation, true)}
          {renderSection('Feedback & Overlays', <MessageSquare className="h-5 w-5 text-primary" />, filteredData.feedback, true)}
        </div>

        {/* No results */}
        {!hasResults && (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-base font-medium mb-2">{t.noComponentsFound || 'Komponentlar topilmadi'}</h3>
              <p className="text-sm text-muted-foreground text-center">
                {t.noComponentsFoundDesc || 'Qidiruv so\'rovingizni o\'zgartiring yoki boshqa kategoriyani tanlang.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}