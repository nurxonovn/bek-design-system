import React from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Settings, HelpCircle, Mail, Shield } from 'lucide-react';
import { useTranslation } from './TranslationProvider';
import Icon1 from '../imports/Icon1';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const handleSettingsClick = () => {
    console.log('Footer Settings clicked - BEK internal settings');
    // Bu yerda settings sahifasiga yo'naltirish
    onNavigate('theming');
  };

  const handleHelpClick = () => {
    console.log('Footer Help clicked - BEK internal help');
    // Bu yerda help sahifasiga yo'naltirish
    onNavigate('docs');
  };

  const handleMailClick = () => {
    console.log('Footer Mail clicked - BEK internal contact');
    // Bu yerda BEK ichki email yoki contact form ochish
    // Real loyihada BEK teams channel yoki email ochiladi
  };

  return (
    <footer className="border-t bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-[120px] h-[32px] flex-shrink-0">
                <Icon1 />
              </div>
            </div>
            <p className="text-base text-[rgb(136,136,136)] leading-relaxed">
              {t.footerDesc}
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 p-0 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                onClick={handleSettingsClick}
                title="BEK ichki sozlamalar"
              >
                <Settings className="h-5 w-5" />
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 p-0 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                onClick={handleHelpClick}
                title="Yordam va hujjatlar"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 p-0 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                onClick={handleMailClick}
                title="BEK ichki aloqa"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Documentation */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[rgb(34,34,34)] text-[16px]">{t.documentation}</h4>
            <nav className="space-y-4">
              <button
                onClick={() => onNavigate('docs')}
                className="block w-full text-left text-base text-[rgb(136,136,136)] hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                {t.gettingStarted}
              </button>
              <button
                onClick={() => onNavigate('components')}
                className="block w-full text-left text-base text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                {t.components}
              </button>


              <button
                onClick={() => onNavigate('components')}
                className="block w-full text-left text-base text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                {t.implementationExamples}
              </button>
            </nav>
          </div>

          {/* Internal Resources */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[rgb(34,34,34)] text-[16px]">{t.internalResources}</h4>
            <nav className="space-y-4">
              <button
                onClick={() => window.open('https://github.com/nurxonovn/bek-design-system', '_blank', 'noreferrer')}
                className="block w-full text-left text-base text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                {t.sqbGitlab}
              </button>
              <button
                onClick={() => window.open('https://github.com/nurxonovn/bek-design-system/tree/main/packages', '_blank', 'noreferrer')}
                className="block w-full text-left text-base text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                {t.internalPackage}
              </button>
              <button
                onClick={() => window.open('https://github.com/nurxonovn/bek-design-system/blob/main/packages/react/CHANGELOG.md', '_blank', 'noreferrer')}
                className="block w-full text-left text-base text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                {t.changeLog}
              </button>
              <button
                onClick={() => onNavigate('docs')}
                className="block w-full text-left text-base text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                {t.developmentGuidelines}
              </button>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[rgb(34,34,34)] text-[16px]">{t.internalSupport}</h4>
            <nav className="space-y-4">
              <button
                onClick={() => window.open('https://www.figma.com/design/6ADJMMCbBHzYiIW0MBxJqh/BEK-Design-System', '_blank', 'noreferrer')}
                className="block w-full text-left text-base text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                {t.sqbTeamsChannel}
              </button>
              <button
                onClick={() => console.log('Dev team wiki clicked')}
                className="block w-full text-left text-base text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                {t.devTeamWiki}
              </button>
              <button
                onClick={() => console.log('IT support portal clicked')}
                className="block w-full text-left text-base text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                {t.itSupportPortal}
              </button>
              <button
                onClick={() => console.log('Request access clicked')}
                className="block w-full text-left text-base text-[rgb(136,136,136)] hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                {t.requestAccess}
              </button>
            </nav>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 text-base text-muted-foreground">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span className="text-[rgb(136,136,136)]">© {currentYear} {t.copyrightText}</span>
          </div>
          <div className="flex items-center space-x-6 mt-6 md:mt-0">
            <button
              onClick={() => console.log('Internal privacy policy clicked')}
              className="text-base text-[rgb(136,136,136)] hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
            >
              {t.internalPrivacy}
            </button>
            <button
              onClick={() => console.log('Development standards clicked')}
              className="text-base text-[rgb(136,136,136)] hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
            >
              {t.developmentStandards}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}