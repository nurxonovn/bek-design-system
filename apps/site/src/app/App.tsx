import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FallbackApp } from './components/FallbackApp';
import { ThemeProvider } from './components/ThemeProvider';
import { TranslationProvider } from './components/TranslationProvider';
import { PlatformProvider } from './components/PlatformProvider';
import { Toaster } from './components/ui/sonner';

// Import components directly to avoid lazy loading issues
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { DocumentationPage } from './components/DocumentationPage';
import { ComponentsPage } from './components/ComponentsPage';
import { FoundationPage } from './components/FoundationPage';
import { ColorsComponent } from './components/ColorsComponent';
import { DesignTokensPage } from './components/DesignTokensPage';
import { ComponentDetailPage } from './components/ComponentDetailPage';
import { ComponentShowcasePage } from './components/ComponentShowcasePage';
import { IconsPage } from './components/IconsPage';
import { Footer } from './components/Footer';

type Page = 'home' | 'docs' | 'components' | 'component-showcase' | 'foundation' | 'colors' | 'design-tokens' | 'icons' | string;



export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    try {
      // Check if current page is a component detail page
      if (currentPage.startsWith('component-detail-')) {
        const componentId = currentPage.replace('component-detail-', '');
        return (
          <ErrorBoundary>
            <ComponentDetailPage componentId={componentId} onNavigate={setCurrentPage} />
          </ErrorBoundary>
        );
      }

      switch (currentPage) {
        case 'home':
          return (
            <ErrorBoundary>
              <LandingPage onNavigate={setCurrentPage} />
            </ErrorBoundary>
          );
        case 'docs':
          return (
            <ErrorBoundary>
              <DocumentationPage />
            </ErrorBoundary>
          );
        case 'components':
          return (
            <ErrorBoundary>
              <ComponentsPage onNavigate={setCurrentPage} />
            </ErrorBoundary>
          );
        case 'foundation':
          return (
            <ErrorBoundary>
              <FoundationPage onNavigate={setCurrentPage} />
            </ErrorBoundary>
          );
        case 'colors':
          return (
            <ErrorBoundary>
              <ColorsComponent onNavigate={setCurrentPage} />
            </ErrorBoundary>
          );
        case 'design-tokens':
          return (
            <ErrorBoundary>
              <DesignTokensPage onNavigate={setCurrentPage} />
            </ErrorBoundary>
          );
        case 'component-showcase':
          return (
            <ErrorBoundary>
              <ComponentShowcasePage onNavigate={setCurrentPage} />
            </ErrorBoundary>
          );
        case 'icons':
          return (
            <ErrorBoundary>
              <IconsPage />
            </ErrorBoundary>
          );
        default:
          return (
            <ErrorBoundary>
              <LandingPage onNavigate={setCurrentPage} />
            </ErrorBoundary>
          );
      }
    } catch (error) {
      console.error('Error in renderPage:', error);
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Error loading page</h1>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      );
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
        <ErrorBoundary fallback={<FallbackApp />}>
          <TranslationProvider>
            <ErrorBoundary fallback={<FallbackApp />}>
              <PlatformProvider>
                <div className="min-h-screen bg-background antialiased">
                  <Header currentPage={currentPage} onNavigate={setCurrentPage} />
                  <main className="flex-1">
                    {renderPage()}
                  </main>
                  <Footer onNavigate={setCurrentPage} />
                  <Toaster />
                </div>
              </PlatformProvider>
            </ErrorBoundary>
          </TranslationProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </ErrorBoundary>
  );
}