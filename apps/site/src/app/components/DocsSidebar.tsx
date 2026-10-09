import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { useTranslation } from './TranslationProvider';

export function DocsSidebar() {
  const { t } = useTranslation();

  const sidebarSections = [
    {
      title: 'Getting Started',
      items: [
        { title: t.overview, href: '#overview' },
        { title: t.quickStart, href: '#quick-start' },
        { title: t.installation, href: '#installation' },
        { title: t.architecture, href: '#architecture' },
      ]
    },
    {
      title: 'Foundation',
      items: [
        { title: t.designPrinciples, href: '#design-principles' },
        { title: t.accessibility, href: '#accessibility' },
        { title: t.colors, href: '#colors' },
        { title: t.typography, href: '#typography' },
        { title: t.spacing, href: '#spacing' },
        { title: t.shadows, href: '#shadows' },
        { title: t.animations, href: '#animations' },
        { title: t.breakpoints, href: '#breakpoints' },
      ]
    },
    {
      title: 'Components',
      items: [
        { title: t.basicComponents, href: '#basic-components' },
        { title: t.formComponents, href: '#form-components' },
        { title: t.navigationComponents, href: '#navigation-components' },
        { title: t.feedbackComponents, href: '#feedback-components' },
        { title: t.overlayComponents, href: '#overlay-components' },
        { title: t.dataDisplayComponents, href: '#data-display-components' },
        { title: t.layoutComponents2, href: '#layout-components' },
        { title: t.utilitiesComponents, href: '#utilities-components' },
      ]
    },
    {
      title: 'Theming',
      items: [
        { title: t.lightMode, href: '#light-mode' },
        { title: t.darkMode, href: '#dark-mode' },
        { title: t.darkModeGuide, href: '#dark-mode-guide' },
        { title: t.customization, href: '#customization' },
      ]
    },
    {
      title: 'Advanced',
      items: [
        { title: t.migration, href: '#migration' },
        { title: t.troubleshooting, href: '#troubleshooting' },
        { title: t.changelog, href: '#changelog' },
        { title: t.roadmap, href: '#roadmap' },
        { title: t.contributing, href: '#contributing' },
      ]
    }
  ];

  return (
    <div className="w-64 shrink-0">
      <div className="sticky top-20 h-[calc(100vh-5rem)]">
        <ScrollArea className="h-full px-1">
          <div className="py-4">
            <nav className="space-y-6">
              {sidebarSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h4 className="text-sm font-semibold text-foreground mb-3 px-2">
                    {section.title}
                  </h4>
                  <ul className="space-y-1">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <a
                          href={item.href}
                          className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}