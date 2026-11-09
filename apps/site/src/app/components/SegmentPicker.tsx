import { SegmentedControl } from '@bek-ui/react';
import { usePlatform, Platform } from './PlatformProvider';
import { useTranslation } from './TranslationProvider';

const isPlatform = (value: string): value is Platform =>
  value === 'web' || value === 'android' || value === 'ios';

/** Platforma tanlagich — BEK 3.10 Segmented control (Light/Dark ranglari komponentdan). */
export function SegmentPicker() {
  const { currentPlatform, setPlatform } = usePlatform();
  const { t } = useTranslation();

  return (
    <SegmentedControl
      className="bek-site-segment-picker"
      aria-label="Platform"
      value={currentPlatform}
      onChange={(value) => {
        if (isPlatform(value)) setPlatform(value);
      }}
      options={[
        { value: 'web', label: t.platform.web },
        { value: 'android', label: t.platform.android },
        { value: 'ios', label: t.platform.ios },
      ]}
    />
  );
}
