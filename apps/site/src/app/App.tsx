import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FallbackApp } from './components/FallbackApp';
import { ThemeProvider } from './components/ThemeProvider';
import { TranslationProvider } from './components/TranslationProvider';
import { PlatformProvider } from './components/PlatformProvider';
import { Toaster } from './components/ui/sonner';
import { useHashRoute } from './router';
import { findComponent } from './data/catalog';

import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { DocumentationPage } from './components/DocumentationPage';
import { FoundationPage } from './components/FoundationPage';
import { ComponentShowcasePage } from './components/ComponentShowcasePage';
import { IconsPage } from './components/IconsPage';
import { Footer } from './components/Footer';
import { CatalogPage } from './components/CatalogPage';
import { CatalogDetailPage } from './components/CatalogDetailPage';
import { TokensPage } from './components/TokensPage';
import { NotFound } from './components/NotFound';

// Marshrutlar hash orqali (#/components/button) — har sahifa ulashiladigan havola, GitHub Pages'da server sozlamasiz ishlaydi.
export default function App() {
  const [currentPage, navigate] = useHashRoute();

  const renderPage = () => {
    if (currentPage.startsWith('component-detail-')) {
      const dir = currentPage.replace('component-detail-', '');
      if (findComponent(dir)) return <CatalogDetailPage dir={dir} onNavigate={navigate} />;
      return <NotFound onNavigate={navigate} />;
    }
    if (currentPage === 'not-found') return <NotFound onNavigate={navigate} />;
    switch (currentPage) {
      case 'docs':
        return <DocumentationPage />;
      case 'components':
        return <CatalogPage onNavigate={navigate} />;
      case 'foundation':
        return <FoundationPage onNavigate={navigate} />;
      case 'colors':
        return <TokensPage initialTab="colors" />;
      case 'design-tokens':
        return <TokensPage />;
      case 'component-showcase':
        return <ComponentShowcasePage onNavigate={navigate} />;
      case 'icons':
        return <IconsPage />;
      case 'home':
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <ErrorBoundary
      fallback={
        <ThemeProvider>
          <FallbackApp />
        </ThemeProvider>
      }
    >
      <ThemeProvider>
        <TranslationProvider>
          <PlatformProvider>
            <div className="min-h-screen bg-background antialiased">
              <Header currentPage={currentPage} onNavigate={navigate} />
              <main className="flex-1">
                <ErrorBoundary key={currentPage} fallback={<FallbackApp />}>
                  {renderPage()}
                </ErrorBoundary>
              </main>
              <Footer onNavigate={navigate} />
              <Toaster />
            </div>
          </PlatformProvider>
        </TranslationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
