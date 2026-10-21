const {test, expect, openApp} = require('./fixtures.cjs');

for (const locale of ['nn', 'nb', 'en']) {
  test(`${locale}: themes, visible Explore activities and layout`, async ({page}) => {
    await openApp(page, locale);
    await expect(page.locator('#themeSelect option')).toHaveCount(2);
    await expect(page.locator('[data-nv="previous"]')).toBeDisabled();
    await page.locator('[data-nv="start"]').click();
    await page.locator('[data-theme-action="explore"]').click();
    const modes = page.locator('[data-theme-action="section"]');
    await expect(modes).toHaveCount(3);
    for (const mode of ['listen', 'rebuild', 'create']) {
      const control = page.locator(`[data-theme-action="section"][data-theme-value="${mode}"]`);
      await expect(control).toBeInViewport();
      await control.click();
      await expect(control).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(page.locator('[data-theme-action="save"]')).toBeVisible();
    await page.locator('[data-nv="next"]').click();
    await expect(page.locator('[data-nv="next"]')).toBeDisabled();
    await expect(page.locator('#themeSelect')).toHaveValue('1');
    for (const mode of ['listen', 'repair', 'create']) {
      const control = page.locator(`[data-gr-action="mode"][data-gr-value="${mode}"]`);
      await expect(control).toBeInViewport();
      await control.click();
      await expect(control).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(page.locator('[data-gr-action="cell"]').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('[data-nv="previous"]').click();
    await expect(page.locator('#themeSelect')).toHaveValue('0');
    await page.selectOption('#themeSelect', '1');
    await expect(page.locator('[data-gr-action="mode"]')).toHaveCount(3);
  });
}

test('language links switch all three pages and remember the choice', async ({page}) => {
  await openApp(page);
  for (const [locale, name] of [['nn', 'Nynorsk'], ['nb', 'Bokmål'], ['en', 'English']]) {
    await page.locator('.toolbar-menu summary').click();
    await expect(page.locator('.nv-language > strong')).toHaveText('Språk');
    await page.getByRole('link', {name, exact: true}).click();
    await expect(page).toHaveURL(new RegExp('/' + locale + '\\.html$'));
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await page.goto('/');
    await expect(page).toHaveURL(new RegExp('/' + locale + '\\.html$'));
  }
});

test('keyboard: menu, Escape focus return, Start and theme selector', async ({page}) => {
  await openApp(page);
  const summary = page.locator('.toolbar-menu summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-test-audio]')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-go="progress"]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(summary).toBeFocused();
  await expect(page.locator('[data-test-audio]')).not.toBeVisible();
  await page.locator('[data-nv="start"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-theme-action="explore"]')).toBeVisible();
  const select = page.locator('#themeSelect');
  await select.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(select).toHaveValue('1');
  await expect(select).toBeFocused();
  await expect(page.locator('[data-gr-action="mode"]')).toHaveCount(3);
});

test('Theme 01 quick entrance immediately exposes all activity controls', async ({page}) => {
  await openApp(page);
  await page.locator('[data-nv="start"]').click();
  await expect(page.locator('[data-theme-action="explore"]')).toBeVisible();
  await expect(page.locator('[data-theme-action="section"]')).toHaveCount(3);
});
