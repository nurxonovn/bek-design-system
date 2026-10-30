import { expect, test, type Page } from '@playwright/test';

// @bek-ui/backgrounds: canvas sikli brauzerda (Figma 2.6 BGR-01 … BGR-04) — SSR testlari tekshira olmaydigan qism.
const DIRS = ['matrix-rain', 'dot-field', 'grain-gradient', 'aurora'];

const canvas = (page: Page) => page.locator('.bek-preview canvas.bek-background');
const snapshot = (page: Page) => canvas(page).evaluate((c: HTMLCanvasElement) => c.toDataURL());
const pause = (page: Page, ms: number) => page.waitForTimeout(ms);

async function open(page: Page, dir: string) {
  await page.goto(`./#/components/${dir}`);
  await expect(canvas(page)).toBeVisible();
  // ResizeObserver birinchi o'lchamni bergach canvas chiziladi.
  await expect.poll(() => canvas(page).evaluate((c: HTMLCanvasElement) => c.width)).toBeGreaterThan(1);
}

for (const dir of DIRS) {
  test.describe(dir, () => {
    test('bezak: aria-hidden, pointer-events none, konteynerni to\'ldiradi, chizadi', async ({ page }) => {
      await open(page, dir);
      const c = canvas(page);
      await expect(c).toHaveAttribute('aria-hidden', 'true');
      await expect(c).toHaveCSS('pointer-events', 'none');
      await expect(c).toHaveCSS('position', 'absolute');
      const info = await c.evaluate((el: HTMLCanvasElement) => {
        const r = el.getBoundingClientRect();
        const p = el.parentElement!.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const px = el.getContext('2d')!.getImageData(el.width >> 1, el.height >> 1, 1, 1).data;
        return { w: r.width, pw: p.width, h: r.height, ph: p.height, cw: el.width, dpr, alpha: px[3] };
      });
      expect(info.w).toBeCloseTo(info.pw, 0);
      expect(info.h).toBeCloseTo(info.ph, 0);
      expect(info.cw).toBe(Math.round(info.w * info.dpr));
      expect(info.alpha).toBe(255); // fon (bg/base) chizilgan
    });

    test('animatsiya ishlaydi; prefers-reduced-motion → bitta statik kadr (o\'zgarish tinglanadi)', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await open(page, dir);
      await pause(page, 300);
      const a = await snapshot(page);
      await pause(page, 700);
      expect(await snapshot(page)).not.toBe(a);

      await page.emulateMedia({ reducedMotion: 'reduce' });
      await pause(page, 200);
      const s1 = await snapshot(page);
      await pause(page, 600);
      expect(await snapshot(page)).toBe(s1);
    });

    test('statik kadr mavzu almashganda qayta chiziladi (Light/Dark tokenlari)', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
      await open(page, dir);
      await pause(page, 200);
      const light = await snapshot(page);
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      await expect.poll(() => snapshot(page)).not.toBe(light);
    });

    test('ekrandan tashqarida to\'xtaydi (IntersectionObserver)', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await open(page, dir);
      await page.locator('.bek-preview').evaluate((el: HTMLElement) => {
        el.style.transform = 'translateY(-100000px)';
      });
      await pause(page, 300);
      const a = await snapshot(page);
      await pause(page, 600);
      expect(await snapshot(page)).toBe(a);
    });
  });
}

test('MatrixRain: o\'yin maydonchasi — ton Classic, canvas klassi almashadi', async ({ page }) => {
  await open(page, 'matrix-rain');
  await page.locator('.bek-preview').getByLabel('Ton').selectOption('classic');
  await expect(canvas(page)).toHaveClass(/bek-matrix-rain--classic/);
  await expect(canvas(page)).toHaveAttribute('data-tone', 'classic');
});
