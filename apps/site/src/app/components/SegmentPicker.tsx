import React from 'react';
import { usePlatform, Platform } from './PlatformProvider';
import { useTranslation } from './TranslationProvider';

export function SegmentPicker() {
  const { currentPlatform, setPlatform } = usePlatform();
  const { t } = useTranslation();

  const platforms: { value: Platform; label: string }[] = [
    { value: 'web', label: t.platform.web },
    { value: 'android', label: t.platform.android },
    { value: 'ios', label: t.platform.ios }
  ];

  return (
    <div className="inline-flex items-center rounded-full bg-muted p-1">
      {platforms.map((platform) => (
        <button
          key={platform.value}
          onClick={() => setPlatform(platform.value)}
          className={`
            px-8 py-1 text-sm font-medium rounded-full transition-colors
            ${currentPlatform === platform.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          {platform.label}
        </button>
      ))}
    </div>
  );
}