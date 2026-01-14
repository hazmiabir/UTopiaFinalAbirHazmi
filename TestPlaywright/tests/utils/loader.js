// ===================================================================
// File: tests/utils/loader.js
// Description: Charge les données de configuration et de test
// ===================================================================

const fs = require('fs');
const path = require('path');

/**
 * Loader - Charge les données depuis les fichiers JSON
 */
class Loader {
  
  /**
   * Charger un fichier JSON
   * @param {string} filename - Nom du fichier (sans extension)
   * @returns {Object} Données chargées
   */
  loadJson(filename) {
    const filePath = path.join(__dirname, '..', 'data', `${filename}.json`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  }

  /**
   * Charger les données des étapes de test
   * @returns {Object} Données des steps
   */
  loadSteps() {
    return this.loadJson('steps');
  }

  /**
   * Charger les utilisateurs de test
   * @returns {Object} Données des utilisateurs
   */
  loadUsers() {
    return this.loadJson('users');
  }
}

module.exports = new Loader();