/**
 * @fileoverview Authentication test suite
 * @description Tests login functionality with various user types and error scenarios
 */

const { test, expect } = require('@playwright/test');
const { AuthActions, CommonActions } = require('../actions/actions.js');
const { getUserByType, loadSteps } = require('../utils/loader.js');

test.describe('Login Tests', () => {
  let page;
  let authActions;
  let commonActions;
  const testData = loadSteps();

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    
    authActions = new AuthActions(page);
    commonActions = new CommonActions(page);
    
    await page.goto(testData.config.baseURL);
  });

  test('should successfully login with standard user', async () => {
    const standardUser = getUserByType('standard');
    
    await authActions.login(standardUser.username, standardUser.password);
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('should display error for locked out user', async () => {
    const lockedUser = getUserByType('locked');
    
    await authActions.login(lockedUser.username, lockedUser.password);
    await authActions.verifyErrorMessage(testData.errorMessages.lockedUser);
    await expect(page).toHaveURL(testData.config.baseURL + '/');
  });

  test('should display error for invalid credentials', async () => {
    await authActions.login('invalid_user', 'wrong_password');
    await authActions.verifyErrorMessage(testData.errorMessages.invalidCredentials);
  });

  test('should display error when username is missing', async () => {
    await authActions.login('', testData.credentials.validPassword);
    await authActions.verifyErrorMessage(testData.errorMessages.missingUsername);
  });

  test('should display error when password is missing', async () => {
    const standardUser = getUserByType('standard');
    
    await authActions.login(standardUser.username, '');
    await authActions.verifyErrorMessage(testData.errorMessages.missingPassword);
  });

  test('should allow dismissing error message', async () => {
    await authActions.login('invalid', 'invalid');
    
    const errorElement = page.locator('[data-test="error"]');
    await expect(errorElement).toBeVisible();
    
    await page.click('.error-button');
    await expect(errorElement).not.toBeVisible();
  });

  test('should successfully logout after login', async () => {
    const standardUser = getUserByType('standard');
    
    await authActions.login(standardUser.username, standardUser.password);
    await expect(page).toHaveURL(/.*inventory.html/);
    
    await authActions.logout();
    await expect(page).toHaveURL(testData.config.baseURL + '/');
    await expect(page.locator('[data-test="username"]')).toBeVisible();
  });

  test('should handle problem user login', async () => {
    const problemUser = getUserByType('problem');
    
    await authActions.login(problemUser.username, problemUser.password);
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('should clear input fields on page reload', async () => {
    const standardUser = getUserByType('standard');
    
    await page.fill('[data-test="username"]', standardUser.username);
    await page.fill('[data-test="password"]', standardUser.password);
    await page.reload();
    
    const usernameValue = await page.inputValue('[data-test="username"]');
    const passwordValue = await page.inputValue('[data-test="password"]');
    
    expect(usernameValue).toBe('');
    expect(passwordValue).toBe('');
  });
});