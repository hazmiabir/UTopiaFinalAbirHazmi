/**
 * @fileoverview Product filtering test suite
 * @description Tests product sorting functionality (price and name filters)
 */

const { test, expect } = require('@playwright/test');
const { AuthActions, ProductActions, CommonActions } = require('../actions/actions.js');
const { getUserByType, loadSteps } = require('../utils/loader.js');
const { sortOptions } = require('../pages/actionMap.js');

test.describe('Product Filtering Tests', () => {
  let page;
  let context;
  let authActions;
  let productActions;
  let commonActions;
  const testData = loadSteps();
  const standardUser = getUserByType('standard');

  test.beforeAll(async ({ browser }) => {
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
  });

  test('should sort products by price from low to high', async () => {
    await productActions.selectSortFilter(sortOptions.PRICE_LOW_HIGH);
    await productActions.verifyPriceSortAscending();
    await commonActions.takeScreenshot('price-low-to-high');
  });

  test('should sort products by price from high to low', async () => {
    await productActions.selectSortFilter(sortOptions.PRICE_HIGH_LOW);
    await productActions.verifyPriceSortDescending();
    
    const prices = await productActions.getProductPrices();
    expect(prices[0]).toBe(Math.max(...prices));
    expect(prices[prices.length - 1]).toBe(Math.min(...prices));
    
    await commonActions.takeScreenshot('price-high-to-low');
  });

  test('should sort products alphabetically A to Z', async () => {
    await productActions.selectSortFilter(sortOptions.NAME_ASC);
    await productActions.verifyNameSort(true);
  });

  test('should sort products alphabetically Z to A', async () => {
    await productActions.selectSortFilter(sortOptions.NAME_DESC);
    await productActions.verifyNameSort(false);
  });

  test('should maintain filter after adding product to cart', async () => {
    await productActions.selectSortFilter(sortOptions.PRICE_HIGH_LOW);
    await productActions.addProductToCart(testData.products.backpack);
    
    const currentFilter = await productActions.getCurrentSortFilter();
    expect(currentFilter).toBe(sortOptions.PRICE_HIGH_LOW);
    
    await productActions.verifyPriceSortDescending();
  });
});