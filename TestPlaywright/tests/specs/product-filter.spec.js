/**
 * @fileoverview Product filtering test suite
 * @description Tests product sorting functionality (price and name filters)
 */

const { test, expect } = require('@playwright/test');
const { AuthActions, ProductActions, CommonActions } = require('../actions/actions.js');
const { getUserByType, loadSteps } = require('../utils/loader.js');
const { sortOptions } = require('../pages/actionMap.js');
const fs = require('fs');
const path = require('path');

test.describe('Product Filtering Tests', () => {
  let page;
  let context;
  let authActions;
  let productActions;
  let commonActions;
  const testData = loadSteps();
  const standardUser = getUserByType('standard');

  test.beforeAll(async ({ browser }) => {
    // Créer le dossier screenshots s'il n'existe pas
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
      console.log('📁 Screenshots directory created');
    }

    context = await browser.newContext();
    page = await context.newPage();
    
    authActions = new AuthActions(page);
    productActions = new ProductActions(page);
    commonActions = new CommonActions(page);

    await page.goto(testData.config.baseURL);
    await authActions.login(standardUser.username, standardUser.password);
    await commonActions.waitForPageLoad();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('should display default filter as Name A to Z', async () => {
    const currentFilter = await productActions.getCurrentSortFilter();
    expect(currentFilter).toBe(sortOptions.NAME_ASC);
    // Capture d'écran du filtre par défaut (Name A to Z)
    await commonActions.takeScreenshot('default-filter-name-a-to-z');
  });

  test('should sort products by price from low to high', async () => {
    await productActions.selectSortFilter(sortOptions.PRICE_LOW_HIGH);
    await productActions.verifyPriceSortAscending();
    // Capture d'écran du tri par prix croissant
    await commonActions.takeScreenshot('price-low-to-high');
  });

  test('should sort products by price from high to low', async () => {
    await productActions.selectSortFilter(sortOptions.PRICE_HIGH_LOW);
    await productActions.verifyPriceSortDescending();
    
    const prices = await productActions.getProductPrices();
    expect(prices[0]).toBe(Math.max(...prices));
    expect(prices[prices.length - 1]).toBe(Math.min(...prices));
    
    // Capture d'écran du tri par prix décroissant
    await commonActions.takeScreenshot('price-high-to-low');
  });

  test('should sort products alphabetically A to Z', async () => {
    await productActions.selectSortFilter(sortOptions.NAME_ASC);
    await productActions.verifyNameSort(true);
    // Capture d'écran du tri alphabétique A à Z
    await commonActions.takeScreenshot('sort-name-a-to-z');
  });

  test('should sort products alphabetically Z to A', async () => {
    await productActions.selectSortFilter(sortOptions.NAME_DESC);
    await productActions.verifyNameSort(false);
    // Capture d'écran du tri alphabétique Z à A
    await commonActions.takeScreenshot('sort-name-z-to-a');
  });

  test('should maintain filter after adding product to cart', async () => {
    await productActions.selectSortFilter(sortOptions.PRICE_HIGH_LOW);
    await productActions.addProductToCart(testData.products.backpack);
    
    const currentFilter = await productActions.getCurrentSortFilter();
    expect(currentFilter).toBe(sortOptions.PRICE_HIGH_LOW);
    
    await productActions.verifyPriceSortDescending();
    // Capture d'écran vérifiant que le filtre est maintenu après ajout au panier
    await commonActions.takeScreenshot('maintain-filter-after-add-to-cart');
  });
});