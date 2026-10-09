import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Building, FileText, Palette, Settings } from 'lucide-react';

export function FallbackApp() {
  const [currentPage, setCurrentPage] = useState('home');

  const pages = [
    { id: 'home', name: 'Home', icon: Building },
    { id: 'docs', name: 'Documentation', icon: FileText },
    { id: 'components', name: 'Components', icon: Palette },
    { id: 'foundation', name: 'Foundation', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">Pure Design System</h1>
            </div>
            <nav className="flex gap-2">
              {pages.map(page => (
                <Button
                  key={page.id}
                  variant={currentPage === page.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page.id)}
                  className="flex items-center gap-2"
                >
                  <page.icon className="h-4 w-4" />
                  {page.name}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              Welcome to Pure Design System
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A comprehensive design system for SQB applications
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get started with our comprehensive documentation
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Components
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Explore our library of reusable components
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Foundation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Design tokens, colors, and typography
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentPage === 'docs' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Documentation</h1>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
                <p className="text-muted-foreground mb-4">
                  Welcome to the Pure Design System documentation. This system provides
                  a comprehensive set of design tokens, components, and patterns for
                  building consistent SQB applications.
                </p>
                <h3 className="text-lg font-semibold mb-2">Installation</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  npm install @sqb/design-system
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentPage === 'components' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Components</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Button', 'Input', 'Card', 'Badge'].map(component => (
                <Card key={component}>
                  <CardHeader>
                    <CardTitle>{component}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {component} component with various styles and sizes
                    </p>
                    <Button size="sm">Example {component}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'foundation' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Foundation</h1>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary rounded mb-2"></div>
                      <span className="text-xs">Primary</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-secondary rounded mb-2"></div>
                      <span className="text-xs">Secondary</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-muted rounded mb-2"></div>
                      <span className="text-xs">Muted</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h1>Heading 1</h1>
                    <h2>Heading 2</h2>
                    <h3>Heading 3</h3>
                    <p>Body text example</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}