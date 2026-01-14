// ===================================================================
// File: tests/specs/saucedemo-filter.spec.js
// Description: Tests de filtrage - Version modulaire
// ===================================================================

const { test, expect } = require('@playwright/test');
const actions = require('../actions/actions');
const actionMap = require('../pages/actionMap');
const loader = require('../utils/loader');

// Charger les données de test
const steps = loader.loadSteps();
const users = loader.loadUsers();

/**
 * Suite de tests : Filtrage des produits
 */
test.describe('Filtrage des produits - Architecture POM', () => {

  // Hook : Connexion avant chaque test
  test.beforeEach(async ({ page }) => {
    await actions.login(page, users.standard.username, users.standard.password);
    await actions.verifyLoginSuccess(page);
  });

  /**
   * Test 1 : Vérifier le filtre par défaut et tri croissant
   */
  test('Vérifier le filtre par défaut et trier par prix croissant', async ({ page }) => {
    // Vérifier le filtre par défaut
    await actions.verifyCurrentFilter(page, steps.filters.default);
    console.log('✅ Filtre par défaut vérifié');

    // Changer vers prix croissant
    await actions.selectFilter(page, steps.filters.priceLowHigh);
    
    // Récupérer et vérifier les prix
    const prices = await actions.getProductPrices(page);
    console.log('Prix triés (croissant):', prices);
    
    actions.verifyAscendingOrder(prices);
    console.log('✅ Ordre croissant vérifié');

    // Screenshot
    await actions.takeScreenshot(page, steps.screenshots.priceLowHigh);
  });

  /**
   * Test 2 : Tri par prix décroissant
   */
  test('Trier par prix décroissant', async ({ page }) => {
    // Sélectionner prix décroissant
    await actions.selectFilter(page, steps.filters.priceHighLow);
    
    // Récupérer et vérifier les prix
    const prices = await actions.getProductPrices(page);
    console.log('Prix triés (décroissant):', prices);
    
    // Vérifications
    actions.verifyDescendingOrder(prices);
    expect(prices[0]).toBe(Math.max(...prices));
    expect(prices[prices.length - 1]).toBe(Math.min(...prices));
    
    console.log('✅ Ordre décroissant vérifié');

    // Screenshot
    await actions.takeScreenshot(page, steps.screenshots.priceHighLow);
  });

  /**
   * Test 3 : Tri alphabétique Z-A
   */
  test('Trier par nom Z-A', async ({ page }) => {
    // Sélectionner tri Z-A
    await actions.selectFilter(page, steps.filters.nameZA);
    
    // Récupérer et vérifier les noms
    const names = await actions.getProductNames(page);
    console.log('Premier produit:', names[0]);
    console.log('Dernier produit:', names[names.length - 1]);
    
    actions.verifyAlphabeticalDescending(names);
    console.log('✅ Ordre Z-A vérifié');

    // Screenshot
    await actions.takeScreenshot(page, steps.screenshots.nameZA);
  });
});

/**
 * Suite de tests : Validation de connexion
 */
test.describe('Tests de connexion', () => {

  test('Connexion réussie - Utilisateur standard', async ({ page }) => {
    await actions.login(page, users.standard.username, users.standard.password);
    await actions.verifyLoginSuccess(page);
    console.log('✅ Connexion réussie');
  });

  test('Connexion bloquée - Utilisateur verrouillé', async ({ page }) => {
    await actions.login(page, users.locked.username, users.locked.password);
    await actions.verifyLoginError(page, steps.errorMessages.lockedOut);
    await actions.takeScreenshot(page, steps.screenshots.lockedError);
    console.log('✅ Erreur de verrouillage détectée');
  });

  test('Erreur - Champs vides', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.click(actionMap.login.loginButton);
    await actions.verifyLoginError(page, steps.errorMessages.usernameRequired);
    console.log('✅ Erreur champs vides détectée');
  });

  test('Erreur - Mot de passe incorrect', async ({ page }) => {
    await actions.login(page, steps.login.invalidPassword.username, steps.login.invalidPassword.password);
    await actions.verifyLoginError(page, steps.errorMessages.passwordMismatch);
    console.log('✅ Erreur mot de passe incorrect détectée');
  });
});
// ... (gardez vos tests existants pour le standard_user)

/**
 * Suite de tests : Détection de bugs (Problem User)
 */
test.describe('Tests de robustesse - Utilisateur à problèmes', () => {

  test('Le filtrage par prix doit échouer pour le problem_user', async ({ page }) => {
    // 1. Connexion avec l'utilisateur problématique
    await actions.login(page, users.problem.username, users.problem.password);
    await actions.verifyLoginSuccess(page);

    // 2. Action de filtrage (Prix croissant)
    // Note : Le menu change visuellement, mais pas la liste des produits
    await actions.selectFilter(page, steps.filters.priceLowHigh);
    
    // 3. Récupération des données réelles à l'écran
    const prices = await actions.getProductPrices(page);
    console.log('Prix affichés pour problem_user :', prices);

    // 4. Assertion : va échouer car prices ne sera pas trié
    actions.verifyAscendingOrder(prices);
  });

  test('Le filtrage alphabétique doit échouer pour le problem_user', async ({ page }) => {
    await actions.login(page, users.problem.username, users.problem.password);
    await actions.selectFilter(page, steps.filters.nameZA);
    
    const names = await actions.getProductNames(page);
    
    // Va échouer car le site ne réagit pas au clic sur cet utilisateur
    actions.verifyAlphabeticalDescending(names);
  });
});