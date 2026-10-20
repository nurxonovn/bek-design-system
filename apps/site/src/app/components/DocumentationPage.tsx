import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { DocsSidebar } from './DocsSidebar';
import { SegmentPicker } from './SegmentPicker';
import { useTranslation } from './TranslationProvider';
import { usePlatform } from './PlatformProvider';
import { Shield, Download, Code, BookOpen, Settings, Zap } from 'lucide-react';
import { getPlatformContent } from '../data/platformContent';

export function DocumentationPage() {
  const { t } = useTranslation();
  const { currentPlatform } = usePlatform();

  const content = getPlatformContent(currentPlatform);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <DocsSidebar />
        <main className="flex-1 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Shield className="h-4 w-4 mr-2" />
                {t.internalUse}
              </Badge>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-bold">{t.introduction}</h1>
                <SegmentPicker />
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                {content.description}
              </p>
            </div>

            <Separator />

            {/* Installation */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Download className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{t.installation}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.installationDesc}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-semibold mb-2">
                      {currentPlatform === 'web' ? t.npmInstall : 
                       currentPlatform === 'android' ? 'Gradle Dependencies' : 
                       'CocoaPods Installation'}
                    </h4>
                    <div className="space-y-2">
                      {content.installation.commands.map((command, index) => (
                        <pre key={index} className="bg-muted/50 rounded p-3 text-sm overflow-x-auto">
                          <code>{command}</code>
                        </pre>
                      ))}
                      {content.installation.notes && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <strong>Eslatma:</strong> {content.installation.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-semibold mb-2">
                      {currentPlatform === 'web' ? t.angularImport : 
                       currentPlatform === 'android' ? 'Import in Kotlin/Java' : 
                       'Import in Swift'}
                    </h4>
                    <pre className="bg-muted/50 rounded p-3 text-sm overflow-x-auto leading-relaxed">
                      <code>{content.implementation.setup}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Code className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{t.usage}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.usageDesc}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-semibold mb-2">{t.buttonComponent}</h4>
                    <pre className="bg-muted/50 rounded p-3 text-sm overflow-x-auto leading-relaxed">
                      <code>{content.components.button?.code || 'Example not available'}</code>
                    </pre>
                    {content.components.button?.notes && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Eslatma:</strong> {content.components.button.notes}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-base font-semibold mb-2">{t.inputComponent}</h4>
                    <pre className="bg-muted/50 rounded p-3 text-sm overflow-x-auto leading-relaxed">
                      <code>{content.components.input?.code || 'Example not available'}</code>
                    </pre>
                    {content.components.input?.notes && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Eslatma:</strong> {content.components.input.notes}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-base font-semibold mb-2">
                      {t.cardComponent}
                    </h4>
                    <pre className="bg-muted/50 rounded p-3 text-sm overflow-x-auto leading-relaxed">
                      <code>{content.components.card?.code || 'Example not available'}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{t.componentsTitle}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.componentsDesc}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Settings className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{t.configurationTitle}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.configurationDesc}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{t.quickStartTitle}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.quickStartDesc}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{t.standardsTitle}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.standardsDesc}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}