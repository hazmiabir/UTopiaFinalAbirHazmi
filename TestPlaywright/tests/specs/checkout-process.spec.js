/**
 * @fileoverview Checkout process test suite
 * @description Tests the complete purchase flow from product selection to confirmation
 */

const { test, expect } = require('@playwright/test');
const {
  AuthActions,
  ProductActions,
  CartActions,
  CheckoutActions,
  CommonActions
} = require('../actions/actions.js');
const { getUserByType, loadSteps } = require('../utils/loader.js');

test.describe('Checkout Process Tests', () => {
  let page;
  let authActions;
  let productActions;
  let cartActions;
  let checkoutActions;
  let commonActions;

  const testData = loadSteps();
  const standardUser = getUserByType('standard');

  /**
   * =========================
   * BEFORE ALL
   * Login once with standard user
   * =========================
   */
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    authActions = new AuthActions(page);
    productActions = new ProductActions(page);
    cartActions = new CartActions(page);
    checkoutActions = new CheckoutActions(page);
    commonActions = new CommonActions(page);

    await page.goto(testData.config.baseURL);
    await authActions.login(standardUser.username, standardUser.password);

    // MODIFICATION:
    // On attend explicitement que la page inventory soit chargée
    await page.waitForURL('**/inventory.html');
    await page.waitForSelector('.inventory_list', { state: 'visible' });
  });

  /**
   * =========================
   * BEFORE EACH
   * Reset navigation to inventory page
   * =========================
   */
  test.beforeEach(async () => {
    await page.goto(`${testData.config.baseURL}/inventory.html`);
    await page.waitForSelector('.inventory_list', { state: 'visible' });
  });

  /**
   * =========================
   * TEST 1: Single product checkout
   * =========================
   */
  test('should complete full checkout process with single product', async () => {
    // Step 2: Add product to cart
    await productActions.addProductToCart(testData.products.backpack);
    await productActions.verifyCartBadgeCount(1);

    // Step 3: Go to cart
    await cartActions.goToCart();
    await cartActions.verifyProductInCart(testData.products.backpack);
    expect(await cartActions.getCartItemCount()).toBe(1);

    // Step 4: Checkout
    await cartActions.proceedToCheckout();

    // Step 5 & 6: Fill checkout info and continue
    await checkoutActions.fillCheckoutInfo(testData.checkout.testCustomer);
    await checkoutActions.continueToOverview();

    // Step 7: Verify overview page
    await checkoutActions.verifyCheckoutOverview();

    // Optional business check
    const totalPrice = await checkoutActions.getTotalPrice();
    expect(totalPrice).toBeGreaterThan(0);

    // Step 8: Finish
    await checkoutActions.finishPurchase();

    // Step 9: Verify confirmation message
    await checkoutActions.verifyOrderConfirmation(
      testData.checkout.confirmationMessage
    );

    /**
     * MODIFICATION IMPORTANTE:
     * Après le checkout, SauceDemo supprime le badge panier.
     * Il n'affiche PAS "0".
     * On vérifie donc l'ABSENCE du badge.
     */
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  /**
   * =========================
   * TEST 2: Multiple products checkout
   * =========================
   */
  test('should complete checkout with multiple products', async () => {
    await productActions.addProductToCart(testData.products.backpack);
    await productActions.addProductToCart(testData.products.bikeLight);
    await productActions.addProductToCart(testData.products.boltTShirt);

    await productActions.verifyCartBadgeCount(3);

    await cartActions.goToCart();
    expect(await cartActions.getCartItemCount()).toBe(3);

    await cartActions.proceedToCheckout();
    await checkoutActions.fillCheckoutInfo(testData.checkout.testCustomer);
    await checkoutActions.continueToOverview();
    await checkoutActions.verifyCheckoutOverview();
    await checkoutActions.finishPurchase();

    await checkoutActions.verifyOrderConfirmation(
      testData.checkout.confirmationMessage
    );

    // MODIFICATION: même logique, badge absent
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  /**
   * =========================
   * TEST 3: Cancel checkout
   * =========================
   */
  test('should allow canceling checkout at information step', async () => {
    await productActions.addProductToCart(testData.products.onesie);
    await cartActions.goToCart();
    await cartActions.proceedToCheckout();

    await page.fill('[data-test="firstName"]', 'Cancel');
    await page.click('[data-test="cancel"]');

    expect(page.url()).toContain('/cart.html');
    await cartActions.verifyProductInCart(testData.products.onesie);
  });

  /**
   * =========================
   * TEST 4: Required fields validation
   * =========================
   */
  test('should validate required checkout fields', async () => {
    await productActions.addProductToCart(testData.products.fleeceJacket);
    await cartActions.goToCart();
    await cartActions.proceedToCheckout();

    await checkoutActions.continueToOverview();

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('required');
  });

  /**
   * =========================
   * TEST 5: Pricing calculation
   * =========================
   */
  test('should display correct pricing calculation in overview', async () => {
    await productActions.addProductToCart(testData.products.backpack);
    await cartActions.goToCart();
    await cartActions.proceedToCheckout();
    await checkoutActions.fillCheckoutInfo(testData.checkout.testCustomer);
    await checkoutActions.continueToOverview();

    const itemTotalText = await page.locator('.summary_subtotal_label').textContent();
    const taxText = await page.locator('.summary_tax_label').textContent();
    const totalText = await page.locator('.summary_total_label').textContent();

    const itemTotal = parseFloat(itemTotalText.replace('Item total: $', ''));
    const tax = parseFloat(taxText.replace('Tax: $', ''));
    const total = parseFloat(totalText.replace('Total: $', ''));

    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });
});
