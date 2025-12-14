import { test, expect } from '@playwright/test';

test.describe('Group Management', () => {
  let testEmail;
  let testPassword;
  let testName;

  test.beforeEach(async ({ page }) => {
    // Register and login before each test
    const timestamp = Date.now();
    testEmail = `groupuser${timestamp}@example.com`;
    testName = 'Group Test User';
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

    await page.waitForURL('**/calendar', { timeout: 10000 });
    
    // Navigate to calendar
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render
    
    // Clear localStorage to start fresh
    await page.evaluate(() => {
      localStorage.removeItem('calendar_entries');
      localStorage.removeItem('kalendarz_groups');
    });
    await page.reload();
    await page.waitForTimeout(1000);
  });

  test('should display Groups section in sidebar', async ({ page }) => {
    // Verify Groups section exists
    await expect(page.locator('.sidebar-section:has-text("Grupy")')).toBeVisible();
    
    // Verify add button exists
    await expect(page.locator('.sidebar-add-btn').first()).toBeVisible();
  });

  test('should open group modal when clicking + button', async ({ page }) => {
    // Click add group button
    await page.click('.sidebar-add-btn');
    
    // Wait for modal
    await page.waitForSelector('.group-modal', { state: 'visible', timeout: 5000 });
    
    // Verify modal is visible
    await expect(page.locator('.group-modal')).toBeVisible();
    await expect(page.locator('.group-modal .modal-header h2')).toContainText('Nowa grupa');
    
    // Verify form fields
    await expect(page.locator('input#group-name')).toBeVisible();
  });

  test('should create new group with name and color', async ({ page }) => {
    // Open modal
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    
    // Fill name
    await page.fill('input#group-name', 'Personal');
    
    // Select color (click 2nd color option)
    const colorOptions = page.locator('.group-modal .color-preset');
    await colorOptions.nth(1).click();
    
    // Save
    await page.click('.group-modal button[type="submit"]');
    
    // Modal should close
    await page.waitForSelector('.group-modal', { state: 'hidden', timeout: 5000 });
    
    // Verify group appears in sidebar
    await expect(page.locator('.group-item:has-text("Personal")')).toBeVisible();
    
    // Verify in localStorage
    const groups = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_groups');
      return data ? JSON.parse(data) : [];
    });
    
    const personalGroup = groups.find(g => g.name === 'Personal');
    expect(personalGroup).toBeDefined();
    expect(personalGroup.color).toBeTruthy();
  });

  test('should create group with minimal data (only name)', async ({ page }) => {
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    
    // Only fill name, use default color
    await page.fill('input#group-name', 'Minimal Group');
    
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    // Verify group exists
    await expect(page.locator('.group-item:has-text("Minimal Group")')).toBeVisible();
  });

  test('should not save group without name', async ({ page }) => {
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    
    // Try to save without name
    await page.click('.group-modal button[type="submit"]');
    
    // Modal should still be visible (validation failed)
    await expect(page.locator('.group-modal')).toBeVisible();
    
    // Verify no group was saved
    const groups = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_groups');
      return data ? JSON.parse(data) : [];
    });
    
    expect(groups.length).toBe(0);
  });

  test('should open edit modal when clicking existing group', async ({ page }) => {
    // Create group first
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    await page.fill('input#group-name', 'Edit Test');
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    await page.waitForTimeout(500);
    
    // Click on the group
    await page.click('.group-item:has-text("Edit Test")');
    
    // Modal should open in edit mode
    await page.waitForSelector('.group-modal', { state: 'visible' });
    await expect(page.locator('.group-modal .modal-header h2')).toContainText('Edytuj grupę');
    
    // Verify name is pre-filled
    const nameValue = await page.locator('input#group-name').inputValue();
    expect(nameValue).toBe('Edit Test');
  });

  test('should update group name', async ({ page }) => {
    // Create group
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    await page.fill('input#group-name', 'Original Name');
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    await page.waitForTimeout(500);
    
    // Edit group
    await page.click('.group-item:has-text("Original Name")');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    
    // Change name
    await page.fill('input#group-name', 'Updated Name');
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    // Verify update in sidebar
    await expect(page.locator('.group-item:has-text("Updated Name")')).toBeVisible();
    await expect(page.locator('.group-item:has-text("Original Name")')).not.toBeVisible();
    
    // Verify in localStorage
    const groups = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_groups');
      return data ? JSON.parse(data) : [];
    });
    
    const updatedGroup = groups.find(g => g.name === 'Updated Name');
    expect(updatedGroup).toBeDefined();
  });

  test('should update group color', async ({ page }) => {
    // Create group with default color
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    await page.fill('input#group-name', 'Color Test');
    
    // Select first color
    const colorOptions = page.locator('.group-modal .color-preset');
    await colorOptions.first().click();
    const firstColor = await colorOptions.first().getAttribute('style');
    
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    await page.waitForTimeout(500);
    
    // Edit and change color
    await page.click('.group-item:has-text("Color Test")');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    
    // Select different color
    await colorOptions.nth(3).click();
    
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    // Verify color changed in localStorage
    const groups = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_groups');
      return data ? JSON.parse(data) : [];
    });
    
    const colorGroup = groups.find(g => g.name === 'Color Test');
    expect(colorGroup.color).toBeTruthy();
    // Color should be different from initial
  });

  test('should delete group', async ({ page }) => {
    // Create group
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    await page.fill('input#group-name', 'To Delete');
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    await page.waitForTimeout(500);
    
    // Open edit modal
    await page.click('.group-item:has-text("To Delete")');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    
    // Click delete button
    await page.click('.group-modal button:has-text("Usuń")');
    
    // Modal should close
    await page.waitForSelector('.group-modal', { state: 'hidden', timeout: 5000 });
    
    // Verify group is removed from sidebar
    await expect(page.locator('.group-item:has-text("To Delete")')).not.toBeVisible();
    
    // Verify deletion in localStorage
    const groups = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_groups');
      return data ? JSON.parse(data) : [];
    });
    
    const deletedGroup = groups.find(g => g.name === 'To Delete');
    expect(deletedGroup).toBeUndefined();
  });

  test('should show entry count for each group', async ({ page }) => {
    // Create group
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    await page.fill('input#group-name', 'Count Group');
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    await page.waitForTimeout(500);
    
    // Initial count should be 0
    const groupItem = page.locator('.group-item:has-text("Count Group")');
    const initialCount = await groupItem.locator('.group-count').textContent();
    expect(initialCount).toBe('0');
    
    // Create entry in this group
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    await page.fill('input[placeholder="Nazwa wpisu"]', 'Entry 1');
    await page.fill('input[type="date"]', '2025-12-20');
    
    const groupSelect = page.locator('select');
    await groupSelect.selectOption({ label: 'Count Group' });
    
    await page.click('button[type="submit"]');
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    await page.waitForTimeout(500);
    
    // Count should be 1
    const updatedCount = await groupItem.locator('.group-count').textContent();
    expect(updatedCount).toBe('1');
  });

  test('should maintain entry associations when deleting group', async ({ page }) => {
    // Create group
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    await page.fill('input#group-name', 'Association Test');
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    await page.waitForTimeout(500);
    
    // Create entry in this group
    await page.click('.add-entry-btn');
    await page.waitForSelector('.entry-modal', { state: 'visible' });
    
    await page.fill('input[placeholder="Nazwa wpisu"]', 'Orphaned Entry');
    await page.fill('input[type="date"]', '2025-12-21');
    
    const groupSelect = page.locator('select');
    await groupSelect.selectOption({ label: 'Association Test' });
    
    await page.click('button[type="submit"]');
    await page.waitForSelector('.entry-modal', { state: 'hidden' });
    
    await page.waitForTimeout(500);
    
    // Delete the group
    await page.click('.group-item:has-text("Association Test")');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    await page.click('.group-modal button:has-text("Usuń")');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    // Verify entry still exists (as per spec: entries remain)
    const entries = await page.evaluate(() => {
      const data = localStorage.getItem('calendar_entries');
      return data ? JSON.parse(data) : [];
    });
    
    const orphanedEntry = entries.find(e => e.name === 'Orphaned Entry');
    expect(orphanedEntry).toBeDefined();
  });

  test('should close modal when clicking cancel', async ({ page }) => {
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    
    // Fill some data
    await page.fill('input#group-name', 'Cancelled Group');
    
    // Click cancel
    await page.click('.group-modal button:has-text("Anuluj")');
    
    // Modal should close
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    // Verify no group was saved
    const groups = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_groups');
      return data ? JSON.parse(data) : [];
    });
    
    const cancelledGroup = groups.find(g => g.name === 'Cancelled Group');
    expect(cancelledGroup).toBeUndefined();
  });

  test('should close modal when clicking overlay', async ({ page }) => {
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    
    // Click overlay (outside modal content)
    await page.click('.group-modal .modal-overlay', { position: { x: 10, y: 10 } });
    
    // Modal should close
    await page.waitForSelector('.group-modal', { state: 'hidden', timeout: 3000 });
  });

  test('should display custom color from color picker', async ({ page }) => {
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    
    await page.fill('input#group-name', 'Custom Color');
    
    // Use custom color picker
    const colorInput = page.locator('.group-modal input[type="color"]');
    await colorInput.fill('#ff5733');
    
    await page.click('.group-modal button[type="submit"]');
    await page.waitForSelector('.group-modal', { state: 'hidden' });
    
    // Verify custom color in localStorage
    const groups = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_groups');
      return data ? JSON.parse(data) : [];
    });
    
    const customGroup = groups.find(g => g.name === 'Custom Color');
    expect(customGroup.color).toBe('#ff5733');
  });

  test('should display group preview with selected color', async ({ page }) => {
    await page.click('.sidebar-add-btn');
    await page.waitForSelector('.group-modal', { state: 'visible' });
    
    await page.fill('input#group-name', 'Preview Test');
    
    // Select a color
    const colorOptions = page.locator('.group-modal .color-preset');
    await colorOptions.nth(2).click();
    
    // Verify preview exists and shows the color
    const preview = page.locator('.group-modal .group-preview');
    await expect(preview).toBeVisible();
    
    const previewStyle = await preview.getAttribute('style');
    expect(previewStyle).toContain('border');
  });

  test('should create multiple groups', async ({ page }) => {
    const groupNames = ['Work', 'Personal', 'Family', 'Hobbies'];
    
    for (const name of groupNames) {
      await page.click('.sidebar-add-btn');
      await page.waitForSelector('.group-modal', { state: 'visible' });
      
      await page.fill('input#group-name', name);
      
      await page.click('.group-modal button[type="submit"]');
      await page.waitForSelector('.group-modal', { state: 'hidden' });
      
      await page.waitForTimeout(300);
    }
    
    // Verify all groups are visible
    for (const name of groupNames) {
      await expect(page.locator(`.group-item:has-text("${name}")`)).toBeVisible();
    }
    
    // Verify in localStorage
    const groups = await page.evaluate(() => {
      const data = localStorage.getItem('kalendarz_groups');
      return data ? JSON.parse(data) : [];
    });
    
    expect(groups.length).toBe(4);
  });

  test('should show empty state when no groups exist', async ({ page }) => {
    // After clearing localStorage, should show empty message
    const emptyMessage = page.locator('.groups-list .empty-message');
    await expect(emptyMessage).toBeVisible();
    await expect(emptyMessage).toContainText('Brak grup');
  });

  test('should display groups in order of creation', async ({ page }) => {
    // Create groups in specific order
    const groupNames = ['Alpha', 'Beta', 'Gamma'];
    
    for (const name of groupNames) {
      await page.click('.sidebar-add-btn');
      await page.waitForSelector('.group-modal', { state: 'visible' });
      await page.fill('input#group-name', name);
      await page.click('.group-modal button[type="submit"]');
      await page.waitForSelector('.group-modal', { state: 'hidden' });
      await page.waitForTimeout(300);
    }
    
    // Get all group names in order
    const groupItems = page.locator('.group-item .group-name');
    const displayedNames = await groupItems.allTextContents();
    
    // Should maintain creation order
    expect(displayedNames[0]).toBe('Alpha');
    expect(displayedNames[1]).toBe('Beta');
    expect(displayedNames[2]).toBe('Gamma');
  });
});
