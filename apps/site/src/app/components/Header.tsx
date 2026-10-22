import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Moon, Sun, Globe, Menu, X, Clock, ChevronDown, Github } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useTranslation, Language } from './TranslationProvider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { BekLogo } from '@bek-ui/react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleSettingsClick = () => {
    // BEK ichki settings sahifasiga yo'naltirish
    console.log('Settings clicked - BEK internal settings');
    // Bu yerda real settings modal yoki sahifaga yo'naltirish bo'lishi mumkin
  };

  const handleHelpClick = () => {
    // BEK ichki yordam resurslariga yo'naltirish
    console.log('Help clicked - BEK internal help resources');
    // Bu yerda help modal yoki docs sahifasiga yo'naltirish bo'lishi mumkin
    onNavigate('docs');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-18 items-center justify-between px-4 p-[0px]">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 group"
            >
              <BekLogo product="Design System" size="m" aria-hidden />
            </button>
            
            {/* Version Badge with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Badge 
                  variant="secondary" 
                  className="text-xs px-3 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 px-[8px] py-[4px]"
                >
                  v1.0
                  <ChevronDown className="h-3 w-3" />
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">BEK Design System</h4>
                    <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                      Joriy
                    </Badge>
                  </div>
                  
                  {/* Current Version */}
                  <div className="border rounded-lg p-3 mb-3 bg-primary/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">v1.0.0</span>
                      <Badge variant="outline" className="text-xs">Stable</Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <Clock className="h-3 w-3 mr-1" />
                      2024-yil 15-dekabr
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      • Typography system yangilandi (ttinterphases Pro)<br/>
                      • Foundation components qo'shildi<br/>
                      • 3 tilda tarjima qo'llab-quvvatlash<br/>
                      • Dark/Light mode optimizatsiyasi
                    </p>
                  </div>

                  {/* Previous Versions */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground mb-2">Oldingi versiyalar</h5>
                    
                    <div className="border rounded-lg p-2 opacity-60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xs">v0.9.0</span>
                        <Badge variant="secondary" className="text-xs">Beta</Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        2024-yil 1-dekabr
                      </div>
                    </div>

                    <div className="border rounded-lg p-2 opacity-60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xs">v0.8.0</span>
                        <Badge variant="secondary" className="text-xs">Alpha</Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        2024-yil 20-noyabr
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="my-3" />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Barcha versiyalar</span>
                    <button className="text-primary hover:underline">
                      Changelog →
                    </button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('docs')}
              className={`relative text-sm font-medium transition-all duration-300 hover:text-primary group ${
                currentPage === 'docs' ? 'text-primary' : 'text-foreground/70'
              }`}
            >
              {t.documentation}
              {currentPage === 'docs' && (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
              )}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
            <button
              onClick={() => onNavigate('components')}
              className={`relative text-sm font-medium transition-all duration-300 hover:text-primary group ${
                currentPage === 'components' ? 'text-primary' : 'text-foreground/70'
              }`}
            >
              {t.components}
              {currentPage === 'components' && (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
              )}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>


          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 w-9 px-0 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                  title="Tilni tanlang / Выберите язык / Select Language"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center space-x-2 cursor-pointer text-sm ${
                      language === lang.code ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Github Link */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 px-0 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                    onClick={() => window.open('https://github.com/nurxonovn/bek-design-system', '_blank')}
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">GitHub repository</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Theme Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 px-0 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                    onClick={toggleTheme}
                  >
                    {theme === 'light' ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {theme === 'light' ? 'Qorong\'u rejimga o\'tish' : 'Yorug\' rejimga o\'tish'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <nav className="container mx-auto px-4 py-4 space-y-3">
              <button
                onClick={() => {
                  onNavigate('docs');
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-sm font-medium transition-colors hover:text-foreground/80 py-2 ${
                  currentPage === 'docs' ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                {t.documentation}
              </button>
              <button
                onClick={() => {
                  onNavigate('components');
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-sm font-medium transition-colors hover:text-foreground/80 py-2 ${
                  currentPage === 'components' ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                {t.components}
              </button>


            </nav>
          </div>
        )}
      </header>
    </>
  );
}