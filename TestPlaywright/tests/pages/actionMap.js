// ===================================================================
// File: tests/pages/actionMap.js
// Description: Contient tous les sélecteurs (locators) de l'application
// ===================================================================

/**
 * ActionMap - Centralise tous les sélecteurs CSS/XPath
 * Avantage : Si l'UI change, on modifie uniquement ce fichier
 */
class ActionMap {
  constructor() {
    // Sélecteurs de la page de connexion
    this.login = {
      usernameInput: '#user-name',
      passwordInput: '#password',
      loginButton: '#login-button',
      errorMessage: '[data-test="error"]'
    };

    // Sélecteurs de la page produits
    this.inventory = {
      title: '.title',
      filterDropdown: '.product_sort_container',
      productPrices: '.inventory_item_price',
      productNames: '.inventory_item_name',
      productImages: '.inventory_item_img img'
    };

    // Options du filtre
    this.filterOptions = {
      nameAZ: 'az',
      nameZA: 'za',
      priceLowHigh: 'lohi',
      priceHighLow: 'hilo'
    };
  }
}

module.exports = new ActionMap();