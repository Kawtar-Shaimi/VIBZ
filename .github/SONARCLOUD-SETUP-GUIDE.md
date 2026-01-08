# 🔧 Guide de Configuration SonarCloud - VIBZ

## 🚨 Erreur Actuelle

**Erreur GitHub Actions** :
```
ERROR Could not find a default branch for project with key 'VIBZ'. Make sure project exists.
```

**Cause** : Le projet n'existe pas encore sur SonarCloud !

---

## ✅ Solution : Créer le Projet sur SonarCloud

### Étape 1 : Se Connecter à SonarCloud

1. Allez sur : **https://sonarcloud.io**
2. Cliquez sur **"Log in"**
3. Choisissez **"With GitHub"**
4. Autorisez SonarCloud à accéder à votre compte GitHub

![Connexion SonarCloud](C:/Users/kawta/.gemini/antigravity/brain/f9778f54-3ef2-4209-a425-a7da6f65eeb5/uploaded_image_1767882581084.png)

---

### Étape 2 : Importer le Projet VIBZ

1. Une fois connecté, cliquez sur le **"+"** en haut à droite
2. Sélectionnez **"Analyze new project"**
3. Vous verrez la liste de vos repositories GitHub
4. Cochez **"VIBZ"**
5. Cliquez sur **"Set Up"**

**Important** : SonarCloud créera automatiquement :
- **Organization** : `kawtar-shaimi` (basé sur votre username GitHub)
- **Project Key** : `kawtar-shaimi_VIBZ` (format: `org_repo`)

---

### Étape 3 : Configurer l'Analyse avec GitHub Actions

1. Choisissez **"With GitHub Actions"**
2. SonarCloud vous montrera un token à copier
3. Copiez le **SONAR_TOKEN** (commence par `sqp_...`)

---

### Étape 4 : Ajouter le Secret dans GitHub

1. Allez sur votre repository : **https://github.com/Kawtar-Shaimi/VIBZ**
2. Cliquez sur **Settings** (onglet en haut)
3. Dans le menu de gauche : **Secrets and variables** → **Actions**
4. Cliquez sur **"New repository secret"**
5. Ajoutez le secret :
   - **Name** : `SONAR_TOKEN`
   - **Value** : Collez le token copié depuis SonarCloud
6. Cliquez sur **"Add secret"**

---

### Étape 5 : Vérifier la Configuration

Votre fichier `sonar-project.properties` a été corrigé :

```properties
sonar.organization=kawtar-shaimi        ✅ (sans espace !)
sonar.projectKey=kawtar-shaimi_VIBZ     ✅ (format correct)
```

**⚠️ IMPORTANT** : L'organisation **NE PEUT PAS** avoir d'espaces. ça doit être en kebab-case.

---

### Étape 6 : Re-déclencher le Workflow

#### Option A : Faire un nouveau commit (Recommandé)

```bash
git add sonar-project.properties
git commit -m "fix: correct SonarCloud organization name"
git push origin master
```

#### Option B : Re-run le workflow existant

1. Allez sur : **https://github.com/Kawtar-Shaimi/VIBZ/actions**
2. Cliquez sur le workflow qui a échoué
3. Cliquez sur **"Re-run all jobs"**

---

## 📋 Checklist

- [ ] Compte SonarCloud créé et connecté avec GitHub
- [ ] Projet "VIBZ" importé dans SonarCloud
- [ ] Token `SONAR_TOKEN` copié
- [ ] Secret `SONAR_TOKEN` ajouté dans GitHub (Settings → Secrets → Actions)
- [ ] Fichier `sonar-project.properties` corrigé (sans espace dans l'organisation)
- [ ] Nouveau commit/push fait OU workflow re-run manuellement

---

## 🎯 Résultat Attendu

Après avoir suivi ces étapes, le workflow devrait :
1. ✅ Checkout du code
2. ✅ Installation des dépendances
3. ✅ Exécution des tests avec couverture
4. ✅ Build de l'application
5. ✅ **Analyse SonarCloud réussie** 🎉

Vous verrez ensuite le tableau de bord SonarCloud avec :
- Code coverage
- Code smells
- Bugs
- Vulnerabilities
- Security hotspots

---

## 🔗 Liens Rapides

- **SonarCloud Dashboard** : https://sonarcloud.io
- **Votre Projet (après création)** : https://sonarcloud.io/project/overview?id=kawtar-shaimi_VIBZ
- **GitHub Actions** : https://github.com/Kawtar-Shaimi/VIBZ/actions

---

## ⚠️ Erreurs Courantes

### "Organization not found"
→ Vérifiez que `sonar.organization` est bien `kawtar-shaimi` (sans espace, en minuscules)

### "Invalid SONAR_TOKEN"
→ Regénérez le token sur SonarCloud : My Account → Security → Generate Token

### "Project already exists with a different key"
→ Utilisez exactement `kawtar-shaimi_VIBZ` comme clé (format SonarCloud automatique)

---

## 💡 Astuce

Une fois que SonarCloud fonctionne, ajoutez le badge dans votre `README.md` :

```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kawtar-shaimi_VIBZ&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=kawtar-shaimi_VIBZ)
```

---

**Besoin d'aide pour une étape spécifique ? Faites-le moi savoir !** 😊
