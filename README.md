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

### 3. Lancer l'application
```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

✅ **Aucune configuration nécessaire !** Les credentials Supabase sont hardcodés dans le code.

## 📦 Déploiement sur Vercel

1. Importez le projet sur Vercel
2. Déployez directement - aucune variable d'environnement à configurer !

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

## 🔒 Configuration Supabase

Les credentials Supabase sont configurés dans `lib/supabase/config.ts`. Si vous souhaitez utiliser votre propre projet Supabase, modifiez ce fichier avec vos credentials (disponibles dans Supabase Dashboard > Settings > API).
