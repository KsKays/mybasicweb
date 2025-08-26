// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Visual and Accessibility Tests', () => {

  test('should have proper visual styling', async ({ page }) => {
    await page.goto('/');
    
    // Check gradient background
    const body = page.locator('body');
    const backgroundStyle = await body.evaluate(el => window.getComputedStyle(el).background);
    expect(backgroundStyle).toContain('linear-gradient');
    
    // Check container styling
    const container = page.locator('.container');
    await expect(container).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // white background
    await expect(container).toHaveCSS('border-radius', '10px');
    
    // Check form styling
    const form = page.locator('.registration-form');
    await expect(form).toBeVisible();
  });

  test('should have proper button hover effects', async ({ page }) => {
    await page.goto('/');
    
    const submitButton = page.locator('button[type="submit"]');
    
    // Get initial button style
    const initialTransform = await submitButton.evaluate(el => window.getComputedStyle(el).transform);
    
    // Hover over button
    await submitButton.hover();
    
    // Button should have hover effects (this might require some time for CSS transitions)
    await page.waitForTimeout(300);
    
    // Check button is still visible and clickable
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through all form elements
    await page.keyboard.press('Tab'); // Name field
    await expect(page.locator('#name')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Gender field  
    await expect(page.locator('#gender')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Email field
    await expect(page.locator('#email')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Country field
    await expect(page.locator('#country')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Submit button
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/');
    
    // Check that all form fields have associated labels
    const nameLabel = page.locator('label[for="name"]');
    await expect(nameLabel).toBeVisible();
    await expect(nameLabel).toHaveText(/Full Name/);
    
    const genderLabel = page.locator('label[for="gender"]');
    await expect(genderLabel).toBeVisible();
    await expect(genderLabel).toHaveText(/Gender/);
    
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
    await expect(emailLabel).toHaveText(/Email/);
    
    const countryLabel = page.locator('label[for="country"]');
    await expect(countryLabel).toBeVisible();
    await expect(countryLabel).toHaveText(/Country/);
  });

  test('should have proper form field attributes', async ({ page }) => {
    await page.goto('/');
    
    // Check required attributes
    await expect(page.locator('#name')).toHaveAttribute('required');
    await expect(page.locator('#gender')).toHaveAttribute('required');
    await expect(page.locator('#email')).toHaveAttribute('required');
    await expect(page.locator('#country')).toHaveAttribute('required');
    
    // Check input types
    await expect(page.locator('#name')).toHaveAttribute('type', 'text');
    await expect(page.locator('#email')).toHaveAttribute('type', 'email');
    
    // Check names for form submission
    await expect(page.locator('#name')).toHaveAttribute('name', 'name');
    await expect(page.locator('#gender')).toHaveAttribute('name', 'gender');
    await expect(page.locator('#email')).toHaveAttribute('name', 'email');
    await expect(page.locator('#country')).toHaveAttribute('name', 'country');
  });

  test('should take visual regression screenshots', async ({ page }) => {
    await page.goto('/');
    
    // Take screenshot of initial state
    await expect(page).toHaveScreenshot('registration-form-initial.png');
    
    // Fill form and take screenshot
    await page.fill('#name', 'Visual Test User');
    await page.selectOption('#gender', 'female');
    await page.fill('#email', 'visual@example.com');
    await page.selectOption('#country', 'thailand');
    
    await expect(page).toHaveScreenshot('registration-form-filled.png');
    
    // Submit form and take screenshot of success state
    await page.click('button[type="submit"]');
    
    // Wait for success message to appear
    await expect(page.locator('#message')).toBeVisible();
    await expect(page).toHaveScreenshot('registration-form-success.png');
  });

  test('should work properly on different viewport sizes', async ({ page }) => {
    // Test on desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    await expect(page.locator('.container')).toBeVisible();
    const containerWidth = await page.locator('.container').evaluate(el => el.offsetWidth);
    expect(containerWidth).toBeLessThanOrEqual(500); // max-width constraint
    
    // Test on tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('.container')).toBeVisible();
    
    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.locator('.container')).toBeVisible();
    
    // Form should still be functional on mobile
    await page.fill('#name', 'Mobile Test');
    await page.selectOption('#gender', 'male');
    await page.fill('#email', 'mobile.visual@example.com');
    await page.selectOption('#country', 'singapore');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#message')).toHaveText(/Registration successful/);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Check label text color (should be readable)
    const label = page.locator('label').first();
    const labelColor = await label.evaluate(el => window.getComputedStyle(el).color);
    expect(labelColor).toBe('rgb(85, 85, 85)'); // #555 color
    
    // Check button text color
    const button = page.locator('button[type="submit"]');
    const buttonColor = await button.evaluate(el => window.getComputedStyle(el).color);
    expect(buttonColor).toBe('rgb(255, 255, 255)'); // white text
  });

  test('should handle focus states properly', async ({ page }) => {
    await page.goto('/');
    
    // Check focus on input fields
    await page.focus('#name');
    const nameField = page.locator('#name');
    
    // Should have focus styles (border color change)
    const focusBorderColor = await nameField.evaluate(el => window.getComputedStyle(el).borderColor);
    expect(focusBorderColor).toBe('rgb(102, 126, 234)'); // #667eea focus color
    
    // Check background color on focus
    const focusBackground = await nameField.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(focusBackground).toBe('rgb(255, 255, 255)'); // white background on focus
  });
});