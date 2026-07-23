# ITConnect — API Backend

API REST de la plateforme **ITConnect**, mettant en relation particuliers, entreprises et professionnels IT (dépannage, développement, administration réseau, cybersécurité…).

Projet réalisé dans le cadre de la certification **DWWM (Développeur Web et Web Mobile)**.

---

## Stack technique

| Composant       | Technologie          |
|-----------------|-----------------------|
| Runtime         | Node.js               |
| Framework       | Express 4             |
| Base de données | MySQL 8               |
| ORM             | Sequelize 6           |
| Authentification| JWT (jsonwebtoken) + bcryptjs |
| Autres          | cors, dotenv          |

---

## Prérequis

- [Node.js](https://nodejs.org/) ≥ 18
- [MySQL](https://www.mysql.com/) ≥ 8 (serveur local ou distant)
- npm

---

## Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd itconnect-backend

# 2. Installer les dépendances
npm install

# 3. Créer la base de données MySQL
#    (adapter le nom si besoin, voir DB_NAME ci-dessous)
mysql -u root -p -e "CREATE DATABASE itconnect;"

# 4. Copier et compléter le fichier d'environnement
cp .env.example .env
```

---

## Variables d'environnement

Créer un fichier `.env` à la racine, sur la base de l'exemple suivant :

```env
# ── Serveur ──
PORT=3000

# ── Base de données MySQL ──
DB_HOST=localhost
DB_PORT=3306
DB_NAME=itconnect
DB_USER=root
DB_PASSWORD=your_password_here

# ── JWT ──
JWT_SECRET=change_this_in_production
JWT_EXPIRES_IN=7d

# ── CORS ──
FRONTEND_URL=http://localhost:5173
```

> ⚠️ `.env` ne doit **jamais** être versionné (vérifier qu'il est bien listé dans `.gitignore`). `JWT_SECRET` doit être une chaîne longue et aléatoire en production.

---

## Lancer le projet

```bash
# Mode développement (redémarrage auto avec nodemon)
npm run dev

# Mode production
npm start
```

Au démarrage, le serveur :
1. Se connecte à MySQL (`connectDB`)
2. Synchronise les modèles Sequelize avec les tables (`sequelize.sync`)
3. Démarre sur `http://localhost:3000` (ou le `PORT` défini)

Une requête `GET /` confirme que l'API est opérationnelle :
```json
{ "message": "🚀 API ITConnect opérationnelle", "version": "1.0.0" }
```

---

## Structure du projet

```
itconnect-backend/
├── config/
│   └── database.js       # Connexion Sequelize / MySQL
├── middlewares/
│   └── erreurs.js        # Gestion centralisée des erreurs
├── models/                # Modèles Sequelize (Utilisateur, Professionnel, Demande…)
├── routes/
│   ├── auth.js            # Inscription, connexion, profil courant
│   ├── professionnels.js  # Liste et détail des professionnels
│   ├── demandes.js         # Création et suivi des demandes
│   └── entreprises.js     # Ressources liées aux entreprises
├── server.js               # Point d'entrée de l'application
└── .env                    # Variables d'environnement (non versionné)
```

---

## Routes principales de l'API

Toutes les routes sont préfixées par `/api`.

| Préfixe             | Rôle                                                      |
|---------------------|-------------------------------------------------------------|
| `/api/auth`          | Inscription, connexion, récupération de l'utilisateur courant (JWT) |
| `/api/professionnels`| Recherche et consultation des profils professionnels        |
| `/api/demandes`       | Création, consultation et suivi des demandes d'intervention |
| `/api/entreprises`    | Ressources et actions spécifiques aux comptes entreprise     |

Toute route non reconnue renvoie une **404 JSON** :
```json
{ "message": "Route GET /api/inconnue introuvable." }
```

---

## Rôles utilisateurs

L'application distingue plusieurs rôles, avec des accès et tableaux de bord dédiés côté frontend :

- **Particulier** — recherche et contacte des professionnels
- **Entreprise** — gère des prestataires et demandes de maintenance
- **Professionnel IT** — reçoit des demandes, gère ses missions et avis
- **Admin** — supervision des utilisateurs et signalements

---

## Sécurité

- Mots de passe hashés avec **bcryptjs**
- Authentification par **JWT**, avec expiration configurable (`JWT_EXPIRES_IN`)
- **CORS** restreint à l'origine du frontend (`FRONTEND_URL`)
- Réponses forcées en `application/json; charset=utf-8` (bon rendu des accents et emojis)

---

## Auteur

Projet développé par Loïc dans le cadre du titre professionnel DWWM.
