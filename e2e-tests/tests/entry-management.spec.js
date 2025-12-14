import { test, expect } from '@playwright/test';

test.describe('Entry Management', () => {
  let testEmail;
  let testPassword;
  let testName;

  test.beforeEach(async ({ page }) => {
    // Register and login before each test
    const timestamp = Date.now();
    testEmail = `entryuser${timestamp}@example.com`;
    testName = 'Entry Test User';
    testPassword = 'password123';

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Register
    await page.click('button:has-text("Register")');
    await page.fill('input[id="register-name"]', testName);
    await page.fill('input[id="register-email"]', testEmail);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);
    await page.click('button[type="submit"]:has-text("Register")');

    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Navigate to calendar
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render
    
    // Clear localStorage to start fresh
    await page.evaluate(() => {
      localStorage.removeItem('kalendarz_entries');
      localStorage.removeItem('kalendarz_groups');
    });
    await page.reload();
    await page.waitForTimeout(1000);
  });

  test('should open entry modal when clicking + button in header', async ({ page }) => {
    // Click the add entry button
    await page.click('.add-entry-btn');
    
    // Wait for modal to appear
    await page.waitForSelector('.entry-modal', { state: 'visible', timeout: 5000 });
    
    // Verify modal is visible
    await expect(page.locator('.entry-modal')).toBeVisible();
    await expect(page.locator('.modal-header h2')).toContainText('Nowy wpis');
    
    // Verify form fields exist
    await expect(page.locator('input#entry-name')).toBeVisible();
    await expect(page.locator('input#entry-date')).toBeVisible();
    await expect(page.locator('textarea#entry-description')).toBeVisible();
  });

  test('should add new entry with complete form data', async ({ page }) => {
    // Open modal
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    // Fill form
    await page.fill('input#entry-name', 'Test Event');
    await page.fill('input#entry-date', '2025-12-25');
    await page.fill('textarea#entry-description', 'This is a test event');
    
    // Select icon (click 2nd icon in grid)
    const iconButtons = page.locator('.icon-preset');
    await iconButtons.nth(1).click();
    
    // Save entry
    await page.click('button[type="submit"]');
    
    // Wait for modal to close
    await page.waitForSelector('.entry-modal', { state: 'hidden', timeout: 5000 });
    
    // Verify entry appears in localStorage
    const entries = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_entries');
      return data ? JSON.parse(data) : [];
    });
    
    expect(entries.length).toBeGreaterThan(0);
    const testEntry = entries.find(e => e.name === 'Test Event');
    expect(testEntry).toBeDefined();
    expect(testEntry.date).toBe('2025-12-25');
    expect(testEntry.description).toBe('This is a test event');
  });

  test('should add entry with minimal data (only name and date)', async ({ page }) => {
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    // Fill only required fields
    await page.fill('input#entry-name', 'Minimal Event');
    await page.fill('input#entry-date', '2025-12-31');
    
    await page.click('button[type="submit"]');
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    // Verify in localStorage
    const entries = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_entries');
      return data ? JSON.parse(data) : [];
    });
    
    const minimalEntry = entries.find(e => e.name === 'Minimal Event');
    expect(minimalEntry).toBeDefined();
    expect(minimalEntry.date).toBe('2025-12-31');
  });

  test('should not save entry without name', async ({ page }) => {
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    // Only fill date, leave name empty
    await page.fill('input#entry-date', '2025-12-20');
    
    // Try to save
    await page.click('button[type="submit"]');
    
    // Modal should still be visible (validation failed)
    await expect(page.locator('.entry-modal')).toBeVisible();
    
    // Check no entry was saved
    const entries = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_entries');
      return data ? JSON.parse(data) : [];
    });
    
    expect(entries.length).toBe(0);
  });

  test('should open entry modal when clicking on a calendar day', async ({ page }) => {
    // Click on a calendar day (not today, not other month)
    const calendarDays = page.locator('.calendar-day:not(.other-month):not(.today)');
    await calendarDays.first().click();
    
    // Wait for modal
    await page.waitForSelector('.entry-modal', { state: 'visible', timeout: 5000 });
    
    // Verify modal opened
    await expect(page.locator('.entry-modal')).toBeVisible();
    
    // Verify date field is pre-filled
    const dateValue = await page.locator('input#entry-date').inputValue();
    expect(dateValue).toBeTruthy();
    expect(dateValue).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
  });

  test('should prefill date when clicking specific day', async ({ page }) => {
    // Navigate to January 2025 for predictable testing
    await page.click('.month-button');
    await page.click('button:has-text("Styczeń")');
    
    await page.click('.year-button');
    await page.fill('input[type="number"]', '2025');
    await page.click('button:has-text("OK")');
    
    await page.waitForTimeout(500);
    
    // Click on 15th day (should be visible)
    const day15 = page.locator('.calendar-day .day-number:has-text("15")').first();
    await day15.click();
    
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    // Verify date is January 15, 2025
    const dateValue = await page.locator('input#entry-date').inputValue();
    expect(dateValue).toBe('2025-01-15');
  });

  test('should open edit modal when clicking existing entry', async ({ page }) => {
    // First create an entry
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    await page.fill('input#entry-name', 'Edit Test Entry');
    await page.fill('input#entry-date', '2025-12-20');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    // Reload to ensure entry is rendered
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Navigate to December 2025
    await page.click('.month-button');
    await page.click('button:has-text("Grudzień")');
    await page.click('.year-button');
    await page.fill('input[type="number"]', '2025');
    await page.click('button:has-text("OK")');
    await page.waitForTimeout(500);
    
    // Click on the entry
    const entry = page.locator('.entry-item:has-text("Edit Test Entry")');
    await entry.click();
    
    // Verify modal opened in edit mode
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    await expect(page.locator('.modal-header h2')).toContainText('Edytuj wpis');
    
    // Verify form is pre-filled
    const nameValue = await page.locator('input#entry-name').inputValue();
    expect(nameValue).toBe('Edit Test Entry');
  });

  test('should update entry in edit mode', async ({ page }) => {
    // Create entry
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    await page.fill('input#entry-name', 'Original Name');
    await page.fill('input#entry-date', '2025-12-20');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Navigate to December 2025
    await page.click('.month-button');
    await page.click('button:has-text("Grudzień")');
    await page.click('.year-button');
    await page.fill('input[type="number"]', '2025');
    await page.click('button:has-text("OK")');
    await page.waitForTimeout(500);
    
    // Click entry to edit
    await page.click('.entry-item:has-text("Original Name")');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    // Change name
    await page.fill('input#entry-name', 'Updated Name');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    // Verify update in localStorage
    const entries = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_entries');
      return data ? JSON.parse(data) : [];
    });
    
    const updatedEntry = entries.find(e => e.name === 'Updated Name');
    expect(updatedEntry).toBeDefined();
    
    const originalEntry = entries.find(e => e.name === 'Original Name');
    expect(originalEntry).toBeUndefined(); // Should be replaced
  });

  test('should delete entry', async ({ page }) => {
    // Create entry
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    await page.fill('input#entry-name', 'To Delete');
    await page.fill('input#entry-date', '2025-12-20');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Navigate to December 2025
    await page.click('.month-button');
    await page.click('button:has-text("Grudzień")');
    await page.click('.year-button');
    await page.fill('input[type="number"]', '2025');
    await page.click('button:has-text("OK")');
    await page.waitForTimeout(500);
    
    // Click entry to edit
    await page.click('.entry-item:has-text("To Delete")');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    // Click delete button
    await page.click('button:has-text("Usuń")');
    
    // Confirm deletion (if there's a confirmation)
    await page.waitForTimeout(500);
    
    // Modal should close
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    // Verify entry is deleted from localStorage
    const entries = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_entries');
      return data ? JSON.parse(data) : [];
    });
    
    const deletedEntry = entries.find(e => e.name === 'To Delete');
    expect(deletedEntry).toBeUndefined();
  });

  test('should create entry from template with preset colors', async ({ page }) => {
    // Wait for templates to load
    await page.waitForSelector('.template-item', { timeout: 5000 });
    
    // Get first template
    const firstTemplate = page.locator('.template-item').first();
    const templateIcon = await firstTemplate.locator('.template-icon').textContent();
    
    // Click template
    await firstTemplate.click();
    
    // Modal should open
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    // Verify icon is pre-selected (check if the icon appears in preview)
    const selectedIcon = await page.locator('.icon-preview').textContent();
    expect(selectedIcon).toBe(templateIcon);
    
    // Fill required fields
    await page.fill('input#entry-name', 'Template Entry');
    await page.fill('input#entry-date', '2025-12-22');
    
    // Save
    await page.click('button[type="submit"]');
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    // Verify entry has template properties
    const entries = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_entries');
      return data ? JSON.parse(data) : [];
    });
    
    const templateEntry = entries.find(e => e.name === 'Template Entry');
    expect(templateEntry).toBeDefined();
    expect(templateEntry.icon).toBe(templateIcon);
    expect(templateEntry.backgroundColor).toBeTruthy();
    expect(templateEntry.textColor).toBeTruthy();
  });

  test('should close modal when clicking cancel', async ({ page }) => {
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    // Fill some data
    await page.fill('input#entry-name', 'Cancelled Entry');
    
    // Click cancel
    await page.click('button:has-text("Anuluj")');
    
    // Modal should close
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    // Verify no entry was saved
    const entries = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_entries');
      return data ? JSON.parse(data) : [];
    });
    
    const cancelledEntry = entries.find(e => e.name === 'Cancelled Entry');
    expect(cancelledEntry).toBeUndefined();
  });

  test('should close modal when clicking overlay', async ({ page }) => {
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    // Click overlay (outside modal content)
    await page.click('.modal-overlay', { position: { x: 10, y: 10 } });
    
    // Modal should close
    await page.waitForSelector('.entry-modal', { state: 'hidden', timeout: 3000 });
  });

  test('should select icon from icon picker', async ({ page }) => {
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    // Click 3rd icon option
    const iconOptions = page.locator('.icon-preset');
    await iconOptions.nth(2).click();
    
    // Get the selected icon
    const selectedIcon = await iconOptions.nth(2).textContent();
    
    // Verify it appears in preview
    const previewIcon = await page.locator('.icon-preview').textContent();
    expect(previewIcon).toBe(selectedIcon);
    
    // Save entry
    await page.fill('input#entry-name', 'Icon Test');
    await page.fill('input#entry-date', '2025-12-23');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    // Verify icon saved
    const entries = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_entries');
      return data ? JSON.parse(data) : [];
    });
    
    const iconEntry = entries.find(e => e.name === 'Icon Test');
    expect(iconEntry.icon).toBe(selectedIcon);
  });

  test('should assign entry to group', async ({ page }) => {
    // First create a group
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    await page.fill('input[placeholder="Nazwa grupy"]', 'Test Group');
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    await page.waitForTimeout(500);
    
    // Create entry with group
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    await page.fill('input#entry-name', 'Grouped Entry');
    await page.fill('input#entry-date', '2025-12-24');
    
    // Select group from dropdown
    const groupSelect = page.locator('select');
    await groupSelect.selectOption({ label: 'Test Group' });
    
    await page.click('button[type="submit"]');
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    // Verify entry has groupId
    const entries = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_entries');
      return data ? JSON.parse(data) : [];
    });
    
    const groupedEntry = entries.find(e => e.name === 'Grouped Entry');
    expect(groupedEntry.groupId).toBeTruthy();
  });

  test('should show entry count update in group after adding entry', async ({ page }) => {
    // Create group
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    await page.fill('input[placeholder="Nazwa grupy"]', 'Count Test Group');
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    await page.waitForTimeout(500);
    
    // Get initial count
    const groupItem = page.locator('.group-item:has-text("Count Test Group")');
    const initialCount = await groupItem.locator('.group-count').textContent();
    
    // Create entry in this group
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    await page.fill('input#entry-name', 'Count Entry');
    await page.fill('input#entry-date', '2025-12-25');
    
    const groupSelect = page.locator('select');
    await groupSelect.selectOption({ label: 'Count Test Group' });
    
    await page.click('button[type="submit"]');
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    await page.waitForTimeout(500);
    
    // Get new count
    const newCount = await groupItem.locator('.group-count').textContent();
    
    // Count should increase by 1
    expect(parseInt(newCount)).toBe(parseInt(initialCount) + 1);
  });
});
