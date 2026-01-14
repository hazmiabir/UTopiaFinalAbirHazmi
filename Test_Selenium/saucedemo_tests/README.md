# =====================================================
# FILE: README.md
# =====================================================
🧪 Selenium Test Coverage – Documentation

📌 Objectif des tests
    Cette suite de tests Selenium automatise la vérification fonctionnelle de l’application SauceDemo afin de garantir :
        * le bon fonctionnement du processus de connexion,
        * l’affichage correct des produits,
        * la navigation vers les pages de détails,
        * la cohérence des informations produits (nom, prix, image).

🏗️ Architecture POM
## 📁 Structure du Projet
saucedemo_tests/
├── __init__.py
├── config/
│   ├── __init__.py
│   └── config.py
├── pages/
│   ├── __init__.py
│   ├── base_page.py
│   ├── login_page.py
│   ├── inventory_page.py
│   └── product_detail_page.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   └── test_products.py
├── requirements.txt
├── README.md
└── .gitignore

🔐 Tests d’authentification
    Les tests valident la connexion pour différents types d’utilisateurs :
           * Connexion réussie pour les utilisateurs standards
           * Vérification du comportement attendu pour l’utilisateur locked_out_user
           * Détection et validation des messages d’erreur en cas de connexion bloquée

    📄 Test concerné :
        * test_login_all_users

🛒 Tests de vérification des produits
    Les tests assurent que tous les produits sont correctement affichés sur la page d’inventaire :
            * Présence de tous les produits attendus
            * Affichage correct des noms et des prix
            * Présence d’une image pour chaque produit
            * Présence et activation du bouton Add to cart
            * Noms des produits cliquables

    📄 Tests concernés :
            * test_all_products_have_images
            * test_all_products_have_add_to_cart_button
            * test_all_products_have_clickable_names

🔍 Tests de navigation vers les détails produit
    Ces tests valident la navigation depuis la liste des produits vers la page de détails :
            * Clic sur l’image ou le nom du produit
            * Vérification de l’URL de la page de détails
            * Vérification du nom et du prix du produit
            * Retour vers la page d’inventaire

    📄 Tests concernés :
            * test_product_detail_navigation[Sauce Labs Backpack]
            * test_product_detail_navigation[Sauce Labs Bike Light]
            * test_product_detail_navigation[Sauce Labs Fleece Jacket]

🧪 Test de vérification de la structure HTML

    Un test dédié permet d’analyser la structure HTML des produits afin de faciliter le debug et la maintenance :
            * Vérification de la structure DOM des produits
            * Identification des classes, liens et attributs HTML
            * Confirmation du nombre total de produits affichés

    📄 Test concerné :
            * test_debug_product_structure

📊 Résumé de l’exécution
        ✔️ 9 tests exécutés
        ✔️ 8 tests réussis
        ❌ 1 test en échec (utilisateur locked_out_user)
        ⏱️ Temps total d’exécution : ~2 minutes 40 secondes

🧹 Bonnes pratiques appliquées

       * Page Object Model (POM)
       * Tests data-driven (utilisateurs / produits)
       * Logs détaillés pour chaque étape
       * Assertions explicites
       * Rapport HTML automatique avec pytest-html

⚠️ Limitations
        * Tests dépendants de l’interface utilisateur
        * Sensibles aux changements visuels