# TP_ENSIM_Cloud — Wordle sur Render + MongoDB Atlas

TP Cloud Computing : déployer un clone Wordle (Bun + React 19) sur Render avec une base MongoDB Atlas.

## 📋 Contenu

- [`wordle/`](wordle/) — Application Wordle (clone de [yanngv29/wordle](https://github.com/yanngv29/wordle)), migrée de SQLite vers MongoDB
- [`start-wordle.bat`](start-wordle.bat) — Script de lancement local Windows (installe Bun si nécessaire, démarre le serveur)
- [`TP_spec.md`](TP_spec.md) — Énoncé du TP

## 🚀 Lancement local

1. **Créer un fichier `wordle/.env`** avec :
   ```env
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=...
   MONGO_DB_NAME=wordle
   PORT=3000
   ```

2. **Double-cliquer sur `start-wordle.bat`**
   - Installe Bun si absent
   - Lance le serveur sur http://localhost:3000

> ⚠️ Sous **Windows + Bun**, il y a un bug TLS/DNS sur les URI `mongodb+srv://`.
> Utiliser une URI standard (`mongodb://host1,host2,host3/?...&tlsInsecure=true`) en local.
> Sur Render (Linux), l'URI SRV fonctionne nativement sans `tlsInsecure`.

## 🏗️ Architecture

- **Runtime** : Bun 1.3
- **Frontend** : React 19 + Tailwind CSS 4
- **Backend** : Serveur HTTP Bun avec endpoints API
- **Base de données** : MongoDB Atlas (cluster M0 free)
  - Collection `players` — stats des joueurs
  - Collection `games` — historique des parties

## 📦 Déploiement Render

Variables d'environnement à configurer sur Render :
- `MONGO_URI` — URI SRV MongoDB Atlas (format `mongodb+srv://...`)
- `MONGO_DB_NAME` — `wordle`

Le port est géré automatiquement par Render via `process.env.PORT`.
