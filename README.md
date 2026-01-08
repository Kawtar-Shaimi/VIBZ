# MusicStream (VIBZ)

![CI/CD Pipeline](https://github.com/Kawtar-Shaimi/VIBZ/workflows/CI/CD%20Pipeline/badge.svg)
![Code Quality](https://github.com/Kawtar-Shaimi/VIBZ/workflows/Code%20Quality%20Check/badge.svg)

## 🎵 À propos

**MusicStream** est une application web de gestion et lecture de musique locale développée avec Angular 19. Elle permet aux utilisateurs d'organiser, rechercher et écouter leur collection musicale locale avec une interface moderne et intuitive.

## ✨ Fonctionnalités

- 🎧 **Lecteur Audio Complet** : Play, pause, next, previous, contrôle du volume
- 📁 **Gestion CRUD des Tracks** : Créer, lire, modifier, supprimer des chansons
- 🔍 **Recherche et Filtres** : Recherche par nom et filtrage par catégorie musicale
- 💾 **Stockage Local** : Persistance des fichiers audio avec IndexedDB
- 🎨 **UI Moderne** : Interface responsive avec Tailwind CSS
- 🖼️ **Couvertures d'Album** : Support des images de couverture (PNG, JPEG)
- ✅ **Validation** : Validation des formats et tailles de fichiers

## 🛠️ Technologies

- **Framework** : Angular 19
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Gestion d'État** : RxJS / Angular Signals
- **Stockage** : IndexedDB (via Dexie.js)
- **Tests** : Jasmine + Karma
- **CI/CD** : GitHub Actions

## 📋 Prérequis

- Node.js >= 20.x
- npm >= 10.x
- Angular CLI 19.x

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/Kawtar-Shaimi/VIBZ.git
cd VIBZ

# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve
```

L'application sera accessible sur `http://localhost:4200/`

## 📦 Build

```bash
# Build de production
npm run build

# Les fichiers de build seront dans dist/vibz/
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture de code
npm run test -- --code-coverage

# Tests en mode headless (CI)
npm run test -- --watch=false --browsers=ChromeHeadless
```

## 📁 Structure du Projet

```
src/app/
├── core/
│   ├── models/         # Interfaces et Enums
│   ├── services/       # Services (Storage, Track, AudioPlayer)
│   └── guards/         # Route Guards
├── features/
│   ├── library/        # Page bibliothèque musicale
│   ├── track-detail/   # Page détail d'un track
│   └── upload/         # Page d'upload de musique
├── shared/
│   ├── components/     # Composants réutilisables
│   └── pipes/          # Pipes personnalisés
└── app.routes.ts       # Configuration du routing
```

## 🎯 Concepts Angular Utilisés

- ✅ Standalone Components
- ✅ Lazy Loading
- ✅ Reactive Forms
- ✅ Dependency Injection
- ✅ RxJS Observables & Signals
- ✅ Custom Pipes
- ✅ Route Guards
- ✅ Services avec BehaviorSubject

## 🔒 Contraintes

- Formats audio supportés : MP3, WAV, OGG
- Taille maximale par fichier : 10MB
- Formats d'image : PNG, JPEG
- Limite de caractères : Titre (50), Description (200)

## 👤 Auteur

**Kawtar Shaimi**

- GitHub: [@Kawtar-Shaimi](https://github.com/Kawtar-Shaimi)

## 📅 Projet Académique

- **Durée** : 10 jours (05/01/2026 - 16/01/2026)
- **Type** : Projet individuel
- **Technologies imposées** : Angular 17+, RxJS/Signals, IndexedDB

## 📄 Licence

Ce projet est développé dans un cadre académique.

---

⭐ Si vous aimez ce projet, n'hésitez pas à lui donner une étoile sur GitHub !
