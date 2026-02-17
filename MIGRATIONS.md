# 🔧 Guide d'application des migrations Supabase

## ⚠️ IMPORTANT : Migrations à appliquer

Si vous obtenez l'erreur **"new row violates row-level security policy"**, c'est que les migrations ne sont pas appliquées dans votre base de données.

## 📋 Étapes pour appliquer les migrations

### Option 1 : Via le Dashboard Supabase (Recommandé)

1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. Allez dans **SQL Editor**
4. Cliquez sur **New Query**
5. Copiez-collez le contenu de chaque fichier de migration dans l'ordre :

#### Migration 1 : Schema initial
Copiez tout le contenu de `supabase/migrations/00001_initial_schema.sql`

#### Migration 2 : Retrait authentification (OBLIGATOIRE)
Copiez tout le contenu de `supabase/migrations/00002_no_auth_teacher_only.sql`

#### Migration 3 : Retrait code classe
Copiez tout le contenu de `supabase/migrations/00003_remove_classe_code.sql`

6. Cliquez sur **Run** pour chaque migration

### Option 2 : Via CLI Supabase

```bash
# Installez Supabase CLI si pas déjà fait
npm install -g supabase

# Connectez-vous
supabase login

# Liez votre projet
supabase link --project-ref votre-project-ref

# Appliquez les migrations
supabase db push
```

## ✅ Vérification

Une fois les migrations appliquées, l'application devrait fonctionner sans erreur RLS !

Pour vérifier que les politiques sont actives, allez dans Supabase Dashboard > **Authentication** > **Policies** et vérifiez que les politiques `allow_all_*` existent.
