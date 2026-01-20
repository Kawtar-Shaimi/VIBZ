# VIBZ 🎵

Une application de gestion et lecture de musique locale construite avec Angular 19+. MusicStream permet aux utilisateurs d'uploader, d'organiser et d'écouter leurs fichiers audio locaux avec une interface moderne et intuitive.

![Angular](https://img.shields.io/badge/Angular-19.2-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38bdf8?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Architecture](#architecture)
- [Concepts Angular utilisés](#concepts-angular-utilisés)
- [Contribuer](#contribuer)
- [License](#license)

## 🎯 Aperçu

MusicStream est une application web musicale moderne qui offre :
- **Stockage local** : Vos fichiers audio sont stockés dans IndexedDB directement dans votre navigateur
- **Interface intuitive** : Design dark moderne inspiré par Spotify avec des animations fluides
- **Gestion complète** : CRUD complet pour gérer votre bibliothèque musicale
- **Lecteur audio** : Contrôles de lecture persist ants avec support du volume, de la progression et du mode aléatoire
- **Recherche et filtrage** : Trouvez rapidement vos pistes préférées

## ✨ Fonctionnalités

### Gestion des pistes
- ✅ **Ajout de pistes** : Upload de fichiers audio (MP3, WAV, OGG)
- ✅ **Édition** : Modification des métadonnées (nom, artiste, catégorie, description)
- ✅ **Suppression** : Retrait de pistes de la bibliothèque
- ✅ **Validation** : Taille maximale de 10MB, formats audio supportés
- ✅ **Métadonnées automatiques** : Date d'ajout et durée calculées automatiquement

### Bibliothèque musicale
- 📚 **Affichage en grille** : Interface visuelle avec cartes de pistes
- 🔍 **Barre de recherche** : Recherche par nom de chanson ou artiste
- 🎚️ **Filtres multiples** :
  - Tous
  - Récemment ajoutés
  - Plus écoutés
  - Par artistes
  - Par albums
- 🎨 **Catégories colorées** : 13 catégories musicales avec codes couleur

### Lecteur audio
- ▶️ **Contrôles essentiels** : Play, pause, next, previous
- 🔊 **Contrôle du volume** : Ajustement avec slider
- ⏱️ **Barre de progression** : Navigation dans la piste avec seek
- 🔀 **Mode aléatoire** : Lecture aléatoire des pistes
- 🔁 **Mode répétition** : Répétition d'une piste
- 📊 **Compteur d'écoutes** : Suivi des lectures

### Pages principales
1. **Bibliothèque** (`/library`) : Vue d'ensemble de toutes les pistes
2. **Upload** (`/upload`) : Formulaire d'ajout/édition de piste
3. **Détails** (`/track/:id`) : Page de détails avec lecture

## 🛠️ Technologies utilisées

### Frontend
- **Angular 19.2** - Framework frontend moderne
- **TypeScript 5.7** - Typage statique pour JavaScript
- **RxJS 7.8** - Programmation réactive avec Observables
- **Tailwind CSS 4.1** - Framework CSS utility-first

### Stockage
- **IndexedDB** - Base de données côté navigateur pour le stockage des fichiers audio et métadonnées

### APIs Web
- **HTMLAudioElement** - API native pour la lecture audio
- **File API** - Gestion des upload de fichiers
- **Blob API** - Manipulation des fichiers binaires

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (v18.x ou supérieur) - [Télécharger Node.js](https://nodejs.org/)
- **npm** (v9.x ou supérieur) - Inclus avec Node.js
- **Angular CLI** (v19.x) - Installé globalement

```bash
# Vérifier les versions installées
node --version
npm --version
ng version
```

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/VIBZ.git
cd VIBZ
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer l'application en mode développement

```bash
npm start
# ou
ng serve
```

L'application sera accessible sur `http://localhost:4200/`

### 4. Builder pour la production

```bash
npm run build
# ou
ng build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## 📖 Utilisation

### Ajouter une piste

1. Cliquez sur le bouton **"Ajouter une piste"** dans la bibliothèque
2. Sélectionnez un fichier audio (MP3, WAV ou OGG, max 10MB)
3. Remplissez les informations :
   - Nom de la chanson (max 50 caractères)
   - Nom de l'artiste
   - Catégorie musicale
   - Description optionnelle (max 200 caractères)
4. Cliquez sur **"Ajouter la piste"**

### Écouter une piste

**Option 1** : Depuis la bibliothèque
- Survolez une carte de piste
- Cliquez sur le bouton de lecture (▶️) qui apparaît

**Option 2** : Depuis les détails
- Cliquez sur une carte de piste pour voir les détails
- Cliquez sur le bouton **"Lire"**

### Utiliser le lecteur audio

Le lecteur audio est persistant en bas de l'écran :
- **Play/Pause** : Bouton central
- **Piste suivante/précédente** : Boutons latéraux
- **Volume** : Slider de volume à droite
- **Progression** : Cliquez sur la barre de progression pour naviguer
- **Mode aléatoire** : Bouton shuffle (🔀)
- **Mode répétition** : Bouton repeat (🔁)

### Rechercher et filtrer

- **Recherche** : Tapez dans la barre de recherche en haut (recherche par nom ou artiste)
- **Filtres** : Cliquez sur les boutons de filtre pour trier par critères

## 📁 Structure du projet

```
VIBZ/
├── src/
│   ├── app/
│   │   ├── features/              # Modules de fonctionnalités
│   │   │   ├── library/           # Page bibliothèque
│   │   │   │   ├── library.component.ts
│   │   │   │   ├── library.component.html
│   │   │   │   └── library.component.css
│   │   │   ├── upload/            # Page upload/édition
│   │   │   │   ├── upload.component.ts
│   │   │   │   ├── upload.component.html
│   │   │   │   └── upload.component.css
│   │   │   └── track-detail/      # Page détails de piste
│   │   │       ├── track-detail.component.ts
│   │   │       ├── track-detail.component.html
│   │   │       └── track-detail.component.css
│   │   │
│   │   ├── shared/                # Composants partagés
│   │   │   └── components/
│   │   │       ├── sidebar/       # Barre latérale de navigation
│   │   │       │   ├── sidebar.component.ts
│   │   │       │   ├── sidebar.component.html
│   │   │       │   └── sidebar.component.css
│   │   │       └── audio-player-bar/  # Lecteur audio persistant
│   │   │           ├── audio-player-bar.component.ts
│   │   │           ├── audio-player-bar.component.html
│   │   │           └── audio-player-bar.component.css
│   │   │
│   │   ├── services/              # Services Angular
│   │   │   ├── storage.service.ts       # Gestion IndexedDB
│   │   │   ├── track.service.ts         # Gestion des pistes  
│   │   │   ├── audio-player.service.ts  # Lecteur audio
│   │   │   └── index.ts                 # Barrel exports
│   │   │
│   │   ├── models/                # Modèles TypeScript
│   │   │   ├── track.model.ts           # Interface Track
│   │   │   ├── audio-player-state.model.ts
│   │   │   ├── category.enum.ts         # Catégories musicales
│   │   │   ├── player-state.enum.ts
│   │   │   ├── loading-state.enum.ts
│   │   │   └── index.ts                 # Barrel exports
│   │   │
│   │   ├── app.component.ts       # Composant racine
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.routes.ts          # Configuration routing
│   │   └── app.config.ts          # Configuration app
│   │
│   ├── styles.css                 # Styles globaux
│   └── index.html                 # Point d'entrée HTML
│
├── angular.json                   # Configuration Angular
├── package.json                   # Dépendances npm
├── tsconfig.json                  # Configuration TypeScript
├── tailwind.config.js             # Configuration Tailwind
└── README.md                      # Ce fichier
```

## 🏗️ Architecture

### Pattern de services

L'application utilise une architecture basée sur les services Angular avec injection de dépendances :

```
┌─────────────────┐
│   Components    │  ← Présentation
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Services     │  ← Logique métier
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  StorageService │  ← Persistance
│   (IndexedDB)   │
└─────────────────┘
```

### Flux de données (RxJS)

Les services utilisent `BehaviorSubject` pour gérer l'état réactif :

```typescript
// Service
private tracksSubject = new BehaviorSubject<Track[]>([]);
public tracks$ = this.tracksSubject.asObservable();

// Composant
this.trackService.tracks$.subscribe(tracks => {
  this.tracks = tracks;
});
```

### Lazy Loading

Les routes utilisent le lazy loading pour optimiser les performances :

```typescript
{
  path: 'library',
  loadComponent: () => import('./features/library/library.component')
    .then(m => m.LibraryComponent)
}
```

## 🎓 Concepts Angular utilisés

### Core
- ✅ **Components** : Composants standalone pour une architecture modulaire
- ✅ **Services** : Injection de dépendances avec `@Injectable({ providedIn: 'root' })`
- ✅ **Routing** : Lazy loading et paramètres de route
- ✅ **Signals** : Alternative aux Observables (prévu pour Angular 19+)

### Reactive Programming
- ✅ **RxJS Observables** : `BehaviorSubject`, `Observable`, `Subject`
- ✅ **Operators** : `takeUntil`, `pipe`
- ✅ **Async Pipe** : Subscription automatique dans les templates

### Forms
- ✅ **Reactive Forms** : `FormGroup`, `FormBuilder`, `Validators`
- ✅ **Custom Validators** : Validation de fichiers et longueur de texte
- ✅ **Error Handling** : Affichage des erreurs de validation

### Data Binding
- ✅ **Property Binding** : `[property]="value"`
- ✅ **Event Binding** : `(event)="handler()"`
- ✅ **Two-way Binding** : `[(ngModel)]="property"`
- ✅ **Interpolation** : `{{ expression }}`

### Directives
- ✅ **Structural** : `*ngIf`, `*ngFor`
- ✅ **Attribute** : `[class.active]`, `[style.color]`

### Pipes
- ✅ **Built-in** : Async pipe dans les templates
- ✅ **Custom** : Formatage de durée et dates

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Guidelines

- Suivez les conventions de code Angular
- Ajoutez des commentaires pour le code complexe
- Testez vos modifications avant de soumettre
- Mettez à jour la documentation si nécessaire

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

Projet réalisé dans le cadre d'une formation Angular. 

## 🙏 Remerciements

- Design inspiré par Spotify et les applications musicales modernes
- Icônes SVG personnalisées
- Communauté Angular pour la documentation excellente

## 📞 Support

Pour toute question ou problème :
- Ouvrez une [issue](https://github.com/votre-username/VIBZ/issues)
- Consultez la [documentation Angular](https://angular.dev)

---

