// ===================================================================
// File: tests/actions/actions.js
// Description: Contient toutes les actions réutilisables
// ===================================================================

const actionMap = require('../pages/actionMap');
const { expect } = require('@playwright/test');

/**
 * Actions - Classe contenant toutes les actions utilisateur
 * Chaque méthode représente une action métier
 */
class Actions {
  
  /**
   * Se connecter à l'application
   * @param {Page} page - Instance Playwright page
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   */
  async login(page, username, password) {
    await page.goto('https://www.saucedemo.com/');
    await page.fill(actionMap.login.usernameInput, username);
    await page.fill(actionMap.login.passwordInput, password);
    await page.click(actionMap.login.loginButton);
  }

  /**
   * Vérifier que la connexion a réussi
   * @param {Page} page - Instance Playwright page
   */
  async verifyLoginSuccess(page) {
    await expect(page.locator(actionMap.inventory.title)).toHaveText('Products');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  }

  /**
   * Vérifier un message d'erreur de connexion
   * @param {Page} page - Instance Playwright page
   * @param {string} expectedMessage - Message attendu
   */
  async verifyLoginError(page, expectedMessage) {
    const errorMessage = page.locator(actionMap.login.errorMessage);
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(expectedMessage);
  }

  /**
   * Sélectionner un filtre dans le dropdown
   * @param {Page} page - Instance Playwright page
   * @param {string} filterValue - Valeur du filtre (az, za, lohi, hilo)
   */
  async selectFilter(page, filterValue) {
    const dropdown = page.locator(actionMap.inventory.filterDropdown);
    await dropdown.selectOption(filterValue);
    await page.waitForTimeout(500); // Attendre l'application du tri
  }

  /**
   * Vérifier le filtre actuel
   * @param {Page} page - Instance Playwright page
   * @param {string} expectedValue - Valeur attendue
   */
  async verifyCurrentFilter(page, expectedValue) {
    const dropdown = page.locator(actionMap.inventory.filterDropdown);
    await expect(dropdown).toHaveValue(expectedValue);
  }

  /**
   * Récupérer tous les prix des produits
   * @param {Page} page - Instance Playwright page
   * @returns {Array<number>} Tableau des prix en nombres
   */
  async getProductPrices(page) {
    const pricesText = await page.locator(actionMap.inventory.productPrices).allTextContents();
    return pricesText.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Récupérer tous les noms des produits
   * @param {Page} page - Instance Playwright page
   * @returns {Array<string>} Tableau des noms de produits
   */
  async getProductNames(page) {
    return await page.locator(actionMap.inventory.productNames).allTextContents();
  }

  /**
   * Vérifier que les prix sont triés par ordre croissant
   * @param {Array<number>} prices - Tableau de prix
   */
  verifyAscendingOrder(prices) {
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  }

  /**
   * Vérifier que les prix sont triés par ordre décroissant
   * @param {Array<number>} prices - Tableau de prix
   */
  verifyDescendingOrder(prices) {
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  }

  /**
   * Vérifier que les noms sont triés alphabétiquement (Z-A)
   * @param {Array<string>} names - Tableau de noms
   */
  verifyAlphabeticalDescending(names) {
    const firstName = names[0];
    const lastName = names[names.length - 1];
    expect(firstName.localeCompare(lastName)).toBeGreaterThan(0);
  }

  // ... (reste du code inchangé)

  /**
   * Vérifier que les prix sont triés par ordre croissant
   */
  verifyAscendingOrder(prices) {
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices, "Le tri croissant a échoué (Bug détecté)").toEqual(sorted);
  }

  /**
   * Vérifier que les prix sont triés par ordre décroissant
   */
  verifyDescendingOrder(prices) {
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices, "Le tri décroissant a échoué (Bug détecté)").toEqual(sorted);
  }

  /**
   * Vérifier que les noms sont triés alphabétiquement (Z-A)
   */
  verifyAlphabeticalDescending(names) {
    const sorted = [...names].sort().reverse();
    expect(names, "Le tri alphabétique Z-A a échoué (Bug détecté)").toEqual(sorted);
  }

// ... (reste du code inchangé)
  /**
   * Capturer une screenshot
   * @param {Page} page - Instance Playwright page
   * @param {string} filename - Nom du fichier
   */
  async takeScreenshot(page, filename) {
    await page.screenshot({
      path: `screenshots/${filename}`,
      fullPage: true
    });
    console.log(`✅ Screenshot capturée: ${filename}`);
  }
}

module.exports = new Actions();