# Déploiement de l’app Tâches en classe

Ce guide décrit comment déployer l’application Next.js avec Supabase (backend + auth).

---

## 1. Supabase (backend)

### 1.1 Créer ou lier un projet

- Allez sur [supabase.com](https://supabase.com) et connectez-vous.
- Créez un nouveau projet ou utilisez un projet existant.
- Notez l’**URL du projet** et la clé **anon public** (Settings → API).

### 1.2 Appliquer les migrations

**Option A – Dashboard Supabase**

1. Dans le projet : **SQL Editor**.
2. Ouvrez le fichier `supabase/migrations/00001_initial_schema.sql`.
3. Copiez tout le contenu et exécutez-le dans l’éditeur SQL.

**Option B – CLI Supabase**

```bash
# Installer la CLI si besoin : https://supabase.com/docs/guides/cli
npx supabase link --project-ref VOTRE_PROJECT_REF
npx supabase db push
```

`VOTRE_PROJECT_REF` est l’identifiant du projet (dans l’URL du projet Supabase).

### 1.3 Configurer l’authentification

1. Dans Supabase : **Authentication** → **URL Configuration**.
2. **Site URL** : l’URL de production de l’app (ex. `https://votre-app.vercel.app`).
3. **Redirect URLs** : ajoutez au minimum :
   - `https://votre-app.vercel.app/**`
   - `https://votre-app.vercel.app/auth/callback`

Pour le développement local, gardez aussi :
- `http://localhost:3000/**`
- `http://localhost:3000/auth/callback`

---

## 2. Déployer le frontend (Vercel)

### 2.1 Prérequis

- Compte [Vercel](https://vercel.com).
- Projet poussé sur un dépôt Git (GitHub, GitLab ou Bitbucket).

### 2.2 Créer le projet sur Vercel

1. Sur [vercel.com](https://vercel.com) : **Add New** → **Project**.
2. Importez le dépôt du projet.
3. Framework : **Next.js** (détecté automatiquement).
4. Ne déployez pas tout de suite : on va d’abord ajouter les variables d’environnement.

### 2.3 Variables d’environnement

Dans **Settings** → **Environment Variables**, ajoutez :

| Nom | Valeur | Environnement |
|-----|--------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon (publique) du projet | Production, Preview |

Vous les trouvez dans Supabase : **Settings** → **API** (Project URL et anon public key).

### 2.4 Déploiement

- **Deploy** (ou nouveau déploiement après un push).
- Une fois le déploiement terminé, récupérez l’URL (ex. `https://taches-classe-xxx.vercel.app`).

### 2.5 Revenir dans Supabase

Mettez à jour **Site URL** et **Redirect URLs** avec l’URL réelle de Vercel (voir 1.3).

---

## 3. Vérifications après déploiement

1. Ouvrir l’URL de l’app : la page d’accueil s’affiche.
2. **Inscription** : créer un compte (prof ou élève).
3. **Connexion** : se connecter et compléter le profil si demandé.
4. **Prof** : accéder à la classe, ajouter des tâches/élèves, utiliser le calendrier.
5. **Élève** : rejoindre une classe avec un code et voir les tâches assignées.

Si la connexion ou les redirections échouent, revérifiez les Redirect URLs dans Supabase (point 1.3).

---

## 4. Résumé des URLs à configurer dans Supabase

- **Site URL** : `https://VOTRE_DOMAINE_VERCEL`
- **Redirect URLs** :  
  `https://VOTRE_DOMAINE_VERCEL/**`  
  `https://VOTRE_DOMAINE_VERCEL/auth/callback`

Remplacez `VOTRE_DOMAINE_VERCEL` par l’URL réelle (ex. `taches-classe-xxx.vercel.app`).
