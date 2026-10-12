import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { components } from './catalog';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * Asosli istisnolar (figma.json `accepted` kabi): faqat ko'rsatilgan qoida + element, sababi bilan.
 * Yangi yozuv faqat axe'ning noto'g'ri topilmasi uchun; haqiqiy kamchilik komponentda tuzatiladi.
 */
const ACCEPTED: Record<string, { rule: string; target: RegExp; reason: string }[]> = {
  slider: [
    {
      rule: 'target-size',
      target: /^input\[aria-label="Narx (dan|gacha)"\]$/,
      reason:
        "RangeSlider: ikki native range input bitta yo'lak ustida ustma-ust (pointer-events: none); " +
        "bosiladigani faqat thumb'lar, axe esa input qutilarini bir-birini to'sgan deb hisoblaydi.",
    },
  ],
};

async function openComponent(page: Page, dir: string) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(`./#/components/${dir}`);
  const preview = page.locator('.bek-preview');
  await expect(preview).toBeVisible();
  return { preview, errors };
}

for (const { dir, title } of components) {
  test.describe(dir, () => {
    test('sahifa va jonli namuna xatosiz ochiladi', async ({ page }) => {
      const { preview, errors } = await openComponent(page, dir);
      await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
      await expect(preview).not.toContainText("namuna hali yozilmagan");
      expect(errors).toEqual([]);
    });

    for (const scheme of ['light', 'dark'] as const) {
      test(`a11y: WCAG 2.2 AA (${scheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        await openComponent(page, dir);
        await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
        const { violations } = await new AxeBuilder({ page })
          .include('.bek-preview')
          .withTags(WCAG)
          .analyze();
        const accepted = ACCEPTED[dir] ?? [];
        const summary = violations
          .map((v) => ({
            rule: v.id,
            impact: v.impact,
            nodes: v.nodes
              .map((n) => n.target.join(' '))
              .filter((t) => !accepted.some((a) => a.rule === v.id && a.target.test(t))),
          }))
          .filter((v) => v.nodes.length > 0)
          .map((v) => ({ ...v, nodes: v.nodes.slice(0, 5) }));
        expect(summary).toEqual([]);
      });
    }
  });
}
