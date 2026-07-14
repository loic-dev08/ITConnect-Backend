-- ============================================================
-- BASE DE DONNÉES ITConnect
-- Script de création et d'insertion des données fictives
-- À exécuter dans phpMyAdmin ou MySQL Workbench
-- ============================================================

CREATE DATABASE IF NOT EXISTS itconnect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE itconnect;

-- ── TABLE utilisateurs ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS utilisateurs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  prenom        VARCHAR(100)  NOT NULL,
  nom           VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  mot_de_passe  VARCHAR(255)  NOT NULL,
  role          ENUM('particulier','entreprise','professionnel','admin') NOT NULL DEFAULT 'particulier',
  ville         VARCHAR(100)  DEFAULT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── TABLE professionnels ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS professionnels (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT           NOT NULL UNIQUE,
  specialite       VARCHAR(150)  NOT NULL,
  bio              TEXT          DEFAULT NULL,
  ville            VARCHAR(100)  NOT NULL,
  tarif            VARCHAR(50)   DEFAULT NULL,
  experience       VARCHAR(50)   DEFAULT NULL,
  competences      JSON          DEFAULT NULL,
  disponible       TINYINT(1)    NOT NULL DEFAULT 1,
  note_moyenne     DECIMAL(3,2)  DEFAULT NULL,
  nombre_avis      INT           NOT NULL DEFAULT 0,
  nombre_missions  INT           NOT NULL DEFAULT 0,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── TABLE demandes ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS demandes (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  client_id        INT           NOT NULL,
  professionnel_id INT           NOT NULL,
  objet            VARCHAR(255)  NOT NULL,
  message          TEXT          NOT NULL,
  statut           ENUM('En attente','En cours','Terminée','Refusée') NOT NULL DEFAULT 'En attente',
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id)        REFERENCES utilisateurs(id)    ON DELETE CASCADE,
  FOREIGN KEY (professionnel_id) REFERENCES professionnels(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── TABLE avis ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS avis (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  client_id        INT           NOT NULL,
  professionnel_id INT           NOT NULL,
  note             INT           NOT NULL CHECK (note BETWEEN 1 AND 5),
  texte            TEXT          NOT NULL,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_avis (client_id, professionnel_id),
  FOREIGN KEY (client_id)        REFERENCES utilisateurs(id)    ON DELETE CASCADE,
  FOREIGN KEY (professionnel_id) REFERENCES professionnels(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- INSERTION DES DONNÉES FICTIVES
-- Mots de passe : tous hashés avec bcrypt pour "Test1234!"
-- Hash bcrypt de "Test1234!" : $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- ============================================================

-- ── Utilisateurs ─────────────────────────────────────────────
INSERT INTO utilisateurs (prenom, nom, email, mot_de_passe, role, ville) VALUES

-- Admin
('Loïc',        'Carrasco',    'loic.carrasco@itconnect.fr',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',         'Montereau'),

-- Professionnels IT
('Larry',       'Max',         'larry.max@gmail.com',            '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professionnel', 'Melun'),
('Amélie',      'Chevalier',   'a.chevalier@gmail.com',         '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professionnel', 'Sens'),
('Thomas',      'Moreau',      't.moreau@outlook.fr',           '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professionnel', 'Auxerre'),
('Lucie',       'Perrin',      'lucie.perrin@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professionnel', 'Montereau'),
('Romain',      'Bernard',     'romain.bernard@outlook.fr',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professionnel', 'Montpellier'),
('Nina',        'Vallet',      'nina.vallet.ux@gmail.com',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professionnel', 'Melun'),
('Thomas',     'Mercier',       't.mercier@gmail.com',             '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professionnel', 'Auxerre'),

-- Entreprises
('DataSolutions', 'SAS',       'contact@datasolutions66.fr',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'entreprise',    'Melun'),
('WebTech',     'Hérault',     'n.simon@webtech-herault.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'entreprise',    'Montpellier'),
('ITServices',  'Pro',         'itservices30@hotmail.com',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'entreprise',    'Bordeaux'),
('NumériCap',   'SARL',        'contact@numericap.fr',          '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'entreprise',    'Auxerre'),

-- Particuliers
('Claire',      'Girard',      'claire-girard@laposte.net',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'particulier',   'Sens'),
('Jean-Paul',   'Renard',      'jp.renard@orange.fr',           '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'particulier',   'Marseille'),
('Manon',       'Bouchard',    'm.bouchard@free.fr',            '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'particulier',   'Lunel'),
('Antoine',     'Lefebvre',    'a.lefebvre@sfr.fr',             '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'particulier',   'Bordeaux'),
('Isabelle',    'Roy',         'i.roy@gmail.com',               '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'particulier',   'Mérignac');

-- ── Profils professionnels ────────────────────────────────────
-- Les IDs correspondent aux utilisateurs insérés ci-dessus
-- user_id 2 = Karim, 3 = Amélie, 4 = Thomas, 5 = Lucie, 6 = Romain, 7 = Nina, 8 = Youssef

INSERT INTO professionnels (user_id, specialite, bio, ville, tarif, experience, competences, disponible, note_moyenne, nombre_avis, nombre_missions) VALUES

(2, 'Réseau & Cybersécurité',
 'Expert réseau et cybersécurité depuis 8 ans. Interventions chez particuliers et PME. Certifié Cisco CCNA et CompTIA Security+. Disponible en déplacement dans un rayon de 60 km autour de Melun.',
 'Melun', '65 €/h', '8 ans',
 '[{"label":"Cisco / VLAN","icon":"🔧"},{"label":"Pare-feu & VPN","icon":"🛡️"},{"label":"Audit sécurité","icon":"🔍"},{"label":"Linux / Windows Server","icon":"🖥️"},{"label":"CCNA","icon":"📜"}]',
 1, 5.00, 24, 47),

(3, 'Développement Web & Applications',
 'Développeuse freelance spécialisée en création de sites vitrine et applications web sur mesure. Travail en méthode agile, livraison dans les délais.',
 'Sens', '60 €/h', '4 ans',
 '[{"label":"React / Vite","icon":"⚛️"},{"label":"Node.js","icon":"🟢"},{"label":"MySQL","icon":"🗄️"},{"label":"Figma","icon":"🎨"},{"label":"WordPress","icon":"🌐"}]',
 0, 4.50, 17, 22),

(4, 'Support & Dépannage Informatique',
 'Réparation PC, Mac et smartphones. Dépannage à domicile en moins de 24h dans le département 89. Tarifs accessibles pour particuliers et retraités.',
 'Auxerre', '40 €/h', '6 ans',
 '[{"label":"Dépannage PC/Mac","icon":"💻"},{"label":"Récupération données","icon":"💾"},{"label":"Réparation smartphones","icon":"📱"},{"label":"Formation utilisateurs","icon":"🎓"}]',
 1, 3.50, 8, 31),

(5, 'Administration Systèmes',
 'Administratrice Linux/Windows Server. Gestion des parcs informatiques pour TPE et associations locales. Contrats de maintenance et migration cloud.',
 'Montereau', '55 €/h', '6 ans',
 '[{"label":"Windows Server","icon":"🖥️"},{"label":"Linux Ubuntu","icon":"🐧"},{"label":"Active Directory","icon":"👥"},{"label":"Azure / Office 365","icon":"☁️"},{"label":"Sauvegarde & PRA","icon":"💾"}]',
 1, 4.80, 31, 38),

(6, 'Développement Mobile',
 'Développeur React Native et Flutter. Applications iOS et Android pour startups et commerçants locaux. Portfolio disponible sur demande.',
 'Montpellier', '65 €/h', '5 ans',
 '[{"label":"React Native","icon":"📱"},{"label":"Flutter","icon":"🦋"},{"label":"Firebase","icon":"🔥"},{"label":"API REST","icon":"🔌"},{"label":"App Store / Play Store","icon":"📲"}]',
 0, 4.20, 13, 18),

(7, 'UX Design & Intégration Web',
 'Designer UX/UI et intégratrice HTML/CSS. Maquettes Figma, accessibilité et intégration responsive. Spécialisée dans les interfaces inclusives et accessibles.',
 'Melun', '55 €/h', '5 ans',
 '[{"label":"Figma","icon":"🎨"},{"label":"HTML / CSS","icon":"🌐"},{"label":"Accessibilité WCAG","icon":"♿"},{"label":"Prototypage","icon":"🖊️"},{"label":"Design System","icon":"🧩"}]',
 1, 4.90, 19, 25),

(8, 'Data Science & Intelligence Artificielle',
 'Data scientist et consultant IA. Tableaux de bord et modèles prédictifs pour PME et collectivités. Formé en Machine Learning et analyse de données massives.',
 'Auxerre', '70 €/h', '7 ans',
 '[{"label":"Python / Pandas","icon":"🐍"},{"label":"Machine Learning","icon":"🤖"},{"label":"Power BI","icon":"📊"},{"label":"SQL / NoSQL","icon":"🗄️"},{"label":"TensorFlow","icon":"🧠"}]',
 1, 4.50, 7, 15);

-- ── Demandes fictives ─────────────────────────────────────────
-- client_id 13 = Claire, 14 = Jean-Paul, 15 = Manon, 16 = Antoine, 17 = Isabelle
-- professionnel_id 1 = Karim, 2 = Amélie, 3 = Thomas, 4 = Lucie, 5 = Romain, 6 = Nina, 7 = Youssef

INSERT INTO demandes (client_id, professionnel_id, objet, message, statut) VALUES

(13, 1, 'Configuration réseau Wi-Fi',
 'Bonjour Karim, mon réseau Wi-Fi ne fonctionne plus depuis une mise à jour de ma box. J\'aurais besoin d\'une intervention rapide pour configurer le routeur et vérifier les connexions dans toute la maison.',
 'Terminée'),

(9, 4, 'Maintenance parc informatique',
 'Bonjour Lucie, nous gérons un parc de 40 postes et cherchons un prestataire fiable pour la maintenance mensuelle. Pouvez-vous nous proposer un contrat adapté à nos besoins ?',
 'En cours'),

(15, 2, 'Création site vitrine',
 'Bonjour Amélie, je suis auto-entrepreneuse dans le coaching et j\'ai besoin d\'un site vitrine professionnel avec formulaire de contact et présentation de mes offres. Budget : 1500 €.',
 'En attente'),

(14, 3, 'Formation informatique débutant',
 'Bonjour Thomas, je suis retraité et j\'aimerais apprendre à utiliser mon ordinateur de manière sécurisée : emails, photos, antivirus. Pouvez-vous me proposer quelques séances de formation à domicile ?',
 'En attente'),

(16, 1, 'Récupération de données',
 'Bonjour Karim, mon disque dur externe semble défaillant et je n\'arrive plus à accéder à mes photos de famille. Est-ce que vous pouvez tenter une récupération de données ?',
 'En cours'),

(17, 4, 'Installation NAS familial',
 'Bonjour Lucie, je souhaite installer un NAS pour sauvegarder automatiquement mes cours et documents. Je voudrais aussi que ce soit accessible depuis mon smartphone.',
 'En attente');

-- ── Avis fictifs ──────────────────────────────────────────────
INSERT INTO avis (client_id, professionnel_id, note, texte) VALUES

(13, 1, 5, 'Karim a configuré mon réseau en moins d\'une heure. Service impeccable, je recommande vivement !'),
(9,  4, 5, 'Lucie gère notre parc de 40 postes avec une efficacité remarquable. Partenaire de confiance depuis 2 ans.'),
(15, 2, 4, 'Amélie a créé mon site vitrine en 3 semaines. Design moderne et livraison dans les délais.'),
(16, 1, 5, 'Très professionnel, explique bien ce qu\'il fait. Mon réseau est enfin stable après des mois de problèmes.'),
(17, 6, 5, 'Nina a réalisé une maquette Figma superbe pour notre application. Très à l\'écoute et créative.');

-- ============================================================
-- VÉRIFICATION
-- ============================================================
SELECT 'utilisateurs' AS table_name, COUNT(*) AS total FROM utilisateurs
UNION ALL
SELECT 'professionnels', COUNT(*) FROM professionnels
UNION ALL
SELECT 'demandes', COUNT(*) FROM demandes
UNION ALL
SELECT 'avis', COUNT(*) FROM avis;
