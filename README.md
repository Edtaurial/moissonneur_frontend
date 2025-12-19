# 🌾 Moissonneur - Frontend

Une application web moderne développée avec React pour la consultation et l'analyse de données environnementales. Ce projet sert d'interface utilisateur pour visualiser des jeux de données, consulter des statistiques détaillées et gérer son profil utilisateur.

🔗 **Démo en ligne :** [https://moissonneur-frontend.vercel.app](https://moissonneur-frontend.vercel.app)

## 🚀 Fonctionnalités

*   **Authentification Sécurisée :** Inscription et connexion utilisateurs.
*   **Tableau de Bord :** Vue d'ensemble avec navigation intuitive.
*   **Catalogue de Données :** Liste filtrable de données environnementales (Climat, Hydrologie, etc.).
*   **Visualisation de Données :** Graphiques interactifs et statistiques (via Recharts).
*   **Interface Responsive :** Design adaptatif pour mobile et desktop (Tailwind CSS + Shadcn/ui).
*   **Routage :** Navigation fluide côté client (React Router).

## 🛠️ Stack Technique

*   **Framework :** [React](https://react.dev/) (Vite)
*   **Langage :** [TypeScript](https://www.typescriptlang.org/)
*   **Style :** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
*   **État Global :** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Graphiques :** [Recharts](https://recharts.org/)
*   **Icônes :** [Lucide React](https://lucide.dev/)
*   **Déploiement :** Vercel

## 📦 Installation et Démarrage

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/Edtaurial/moissonneur_frontend.git
    cd moissonneur_frontend
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Lancer le serveur de développement :**
    ```bash
    npm start
    ```
    L'application sera accessible sur `http://localhost:5173`.

## 🏗️ Structure du Projet

```text
src/
├── components/     # Composants réutilisables (Navbar, Charts, UI...)
├── pages/          # Pages principales (Login, Accueil, Stats...)
├── store/          # Gestion d'état Redux (Auth, Data...)
├── App.tsx         # Configuration des routes
└── main.tsx        # Point d'entrée de l'application