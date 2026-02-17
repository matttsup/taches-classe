# Répartition des tâches — Classe primaire

Application dédiée à la répartition des tâches dans une classe de primaire (balai, ranger les chaises, collation, etc.) avec un calendrier jour par jour.

- **Enseignant** : créer une classe, gérer les élèves et les tâches, remplir le calendrier.
- **Élève** : rejoindre une classe avec un code, voir ses tâches à venir.

## Stack

- Next.js 14, React, TypeScript, Tailwind CSS
- Supabase (auth + base de données)
- Déploiement : Vercel + GitHub

## Installation

```bash
npm install
cp .env.local.example .env.local
```

Renseignez dans `.env.local` votre URL et clé anon Supabase.

## Base de données

Créez un **projet Supabase dédié** pour cette app (séparé de l’app hockey). Dans le SQL Editor, exécutez le contenu de :

`supabase/migrations/00001_initial_schema.sql`

Configurez dans Supabase Authentication les URLs de redirection (Site URL et Redirect URLs pour votre domaine Vercel et `http://localhost:3000` en dev).

## Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Déploiement (Vercel + GitHub)

1. Créez un **nouveau dépôt GitHub** pour ce projet.
2. Poussez le code : `git init && git add . && git commit -m "Initial" && git remote add origin <url> && git push -u origin main`
3. Sur [vercel.com](https://vercel.com), importez ce dépôt.
4. Ajoutez les variables d’environnement : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Déployez. Puis dans Supabase, ajoutez l’URL Vercel en Site URL et en Redirect URL (`https://votre-app.vercel.app/auth/callback`).
