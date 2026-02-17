# 🏫 Tâches Classe - École Chanoine-Joseph-Théorêt

Application de gestion des tâches de classe pour enseignants.

## 🚀 Installation sur un nouveau PC

### 1. Cloner le projet
```bash
git clone https://github.com/matttsup/taches-classe.git
cd taches-classe
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. **IMPORTANT** : Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-ici
```

**Où trouver ces valeurs ?**
1. Connectez-vous à [Supabase](https://supabase.com)
2. Ouvrez votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

⚠️ **Sans ces variables, l'application ne fonctionnera pas !**

### 4. Lancer l'application
```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## 🐛 Résolution des erreurs courantes

### Erreur: "application error: a server-side exception has occurred"

**Cause**: Le fichier `.env.local` est manquant ou mal configuré.

**Solution**: 
1. Vérifiez que le fichier `.env.local` existe à la racine du projet
2. Vérifiez que les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont correctement définies
3. Redémarrez le serveur de développement (`Ctrl+C` puis `npm run dev`)

## 📦 Déploiement sur Vercel

1. Importez le projet sur Vercel
2. Dans les paramètres du projet, ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Déployez !

## 📝 Fonctionnalités

- ✅ Gestion des élèves
- ✅ Gestion des tâches
- ✅ Calendrier d'assignation des tâches
- ✅ Multi-classes
- ✅ Médailles automatiques (🥇🥈🥉)
- ✅ Export PDF du calendrier
- ✅ Rotation automatique des tâches
- ✅ Intégration du calendrier scolaire (congés, pédago, relâche)

## 🔧 Technologies

- **Next.js 14** (App Router)
- **Supabase** (Base de données PostgreSQL)
- **Tailwind CSS** (Styling)
- **TypeScript**
