import { expect, test, type Page } from '@playwright/test';

// Klaviatura va fokus: SSR testlari tekshira olmaydigan xatti-harakat (1.6 Accessibility).
const open = (page: Page, dir: string) => page.goto(`./#/components/${dir}`);
const preview = (page: Page) => page.locator('.bek-preview');

test('Tabs: ←/→ o\'chirilgan tabni o\'tkazib yuboradi, Home/End chetga o\'tadi', async ({ page }) => {
  await open(page, 'tabs');
  const list = preview(page).getByRole('tablist', { name: 'Mahsulot' });
  const overview = list.getByRole('tab', { name: 'Umumiy' });
  const reviews = list.getByRole('tab', { name: /Sharhlar/ });
  await overview.focus();
  await page.keyboard.press('ArrowRight');
  await expect(reviews).toBeFocused();
  await expect(reviews).toHaveAttribute('aria-selected', 'true');
  await expect(preview(page).getByRole('tabpanel')).toHaveText('12 ta sharh.');
  await page.keyboard.press('ArrowRight'); // FAQ disabled → aylanib Umumiy'ga
  await expect(overview).toBeFocused();
  await page.keyboard.press('End');
  await expect(reviews).toBeFocused();
  await page.keyboard.press('Home');
  await expect(overview).toBeFocused();
});

test('Modal: fokus ichkarida, Escape yopadi va fokus tugmaga qaytadi', async ({ page }) => {
  await open(page, 'overlay');
  const trigger = preview(page).getByRole('button', { name: 'Modal ochish' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Profilni tahrirlash' });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  // showModal: fon inert — Tab dialog ichida aylanadi yoki brauzer paneliga chiqadi (activeElement = body),
  // lekin hech qachon sahifadagi boshqa elementga tushmaydi.
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    const escaped = await dialog.evaluate(
      (d) => document.activeElement !== document.body && !d.contains(document.activeElement),
    );
    expect(escaped).toBe(false);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('AlertDialog: alertdialog roli, Bekor qilish yopadi', async ({ page }) => {
  await open(page, 'overlay');
  const trigger = preview(page).getByRole('button', { name: "O'chirish…" });
  await trigger.click();
  const dialog = page.getByRole('alertdialog', { name: 'Ishonchingiz komilmi?' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Bekor qilish' }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('DropdownMenu: ↓ ochadi, ↑/↓ aylanadi, Escape yopib fokusni qaytaradi', async ({ page }) => {
  await open(page, 'overlay');
  const trigger = preview(page).getByRole('button', { name: 'Amallar' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const menu = page.getByRole('menu', { name: 'Buyurtma amallari' });
  await expect(menu).toBeVisible();
  const items = menu.getByRole('menuitem');
  await expect(items.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp'); // boshidan oxiriga
  await expect(items.last()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Tooltip: fokusda ko\'rinadi, Escape yashiradi', async ({ page }) => {
  await open(page, 'tooltip');
  const button = preview(page).getByRole('button', { name: 'Ulashish' });
  await button.focus();
  const tip = page.getByRole('tooltip');
  await expect(tip).toBeVisible();
  await expect(tip).toHaveText('Ulashish');
  await page.keyboard.press('Escape');
  await expect(tip).toBeHidden();
  await expect(button).toBeFocused();
});

test('Stepper: spinbutton ↑/↓, Home/End chegaralarda to\'xtaydi', async ({ page }) => {
  await open(page, 'stepper');
  const spin = preview(page).getByRole('spinbutton').first();
  await spin.focus();
  await expect(spin).toHaveAttribute('aria-valuenow', '2');
  await page.keyboard.press('ArrowUp');
  await expect(spin).toHaveAttribute('aria-valuenow', '3');
  await page.keyboard.press('End');
  await expect(spin).toHaveAttribute('aria-valuenow', '10');
  await page.keyboard.press('ArrowUp');
  await expect(spin).toHaveAttribute('aria-valuenow', '10');
  await page.keyboard.press('Home');
  await expect(spin).toHaveAttribute('aria-valuenow', '1');
  await expect(preview(page).getByRole('button', { name: /kamaytirish|decrease/i }).first()).toBeDisabled();
});

test('DatePicker: o\'qlar kunni, PageDown oyni almashtiradi, Enter tanlaydi', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-14T10:00:00'));
  await open(page, 'date-picker');
  const grid = preview(page).getByRole('grid');
  const focusable = grid.locator('button[tabindex="0"]');
  await focusable.focus();
  await expect(focusable).toHaveAttribute('data-date', '2026-10-14');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator(':focus')).toHaveAttribute('data-date', '2026-10-15');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator(':focus')).toHaveAttribute('data-date', '2026-10-22');
  await page.keyboard.press('PageDown');
  await expect(page.locator(':focus')).toHaveAttribute('data-date', '2026-11-22');
  await page.keyboard.press('Enter');
  await expect(grid.locator('[aria-selected="true"]')).toHaveCount(1);
  await expect(grid.locator('[aria-selected="true"] button')).toHaveAttribute('data-date', '2026-11-22');
});

test('Carousel: skroll maydoni Tab bilan fokuslanadi va → bilan suriladi', async ({ page }) => {
  await open(page, 'carousel');
  const viewport = preview(page).locator('.bek-carousel__viewport').first();
  await viewport.focus();
  await expect(viewport).toBeFocused();
  const before = await viewport.evaluate((el) => el.scrollLeft);
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => viewport.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
});
