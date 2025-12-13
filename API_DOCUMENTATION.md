# Documentation des API - Plateforme de Moissonnage de Données

## Configuration de base

**Base URL:** `http://127.0.0.1:8000/` (local) | `https://edwin2025.pythonanywhere.com/` (production)

**Headers:** 
- `Content-Type: application/json`
- `Authorization: Token {token}` (ajouté automatiquement après connexion)

---

## 1. Authentification

### Inscription
**`POST /api/register/`** - Fichier: `src/pages/Register.tsx`

**Body:**
```json
{
  "username": "string (requis, unique)",
  "email": "string (requis)",
  "password": "string (requis)"
}
```

**Réponse (201):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

---

### Connexion
**`POST /api/token-auth/`** - Fichier: `src/pages/Login.tsx`

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Réponse (200):**
```json
{
  "token": "d559bff427c4dffbd1920b36729f1b7714fc1c2b"
}
```

> Le token est stocké dans localStorage et ajouté automatiquement à toutes les requêtes.

---

## 2. Gestion du profil

### Récupération du profil
**`GET /api/me/`** - Fichier: `src/pages/Profil.tsx` (ligne 32)

**Authentification:** Requise

**Réponse (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

---

### Modification du profil
**`PATCH /api/me/`** - Fichier: `src/pages/Profil.tsx` (ligne 53)

**Authentification:** Requise

**Body (tous optionnels):**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string"
}
```

> Note: Le champ `username` n'est pas modifiable.

---

## 3. Jeux de données

### Liste complète
**`GET /api/donnees/`** - Fichier: `src/store/donneesSlice.tsx` (ligne 33)

**Authentification:** Requise

**Réponse (200):**
```json
[
  {
    "id": 1,
    "titre": "Données météorologiques 2024",
    "description": "Description...",
    "organisation": "Environnement Canada",
    "source_catalogue": "CKAN",
    "url_source": "https://example.com/dataset/1",
    "date_creation_source": "2024-01-15T10:30:00Z",
    "date_modification_source": "2024-03-20T14:45:00Z"
  }
]
```

**Filtrage:** Effectué côté frontend (recherche par titre, filtre par organisation)

---

### Détails d'un jeu de données
**`GET /api/donnees/{id}/`** - Fichier: `src/pages/Details.tsx` (ligne 18)

**Authentification:** Requise

**Paramètres:** `id` (integer) dans l'URL

**Réponse (200):** Même structure qu'un élément de la liste

---

## 4. GraphQL

### Requête GraphQL
**`POST /graphql/`** - Fichier: `src/pages/Graphql.tsx` (ligne 31)

**Authentification:** Requise

**Body:**
```json
{
  "query": "query { allJeuDonnees { id titre organisation } }"
}
```

**Réponse (200):**
```json
{
  "data": {
    "allJeuDonnees": [
      {
        "id": "1",
        "titre": "Données météo",
        "organisation": "Environnement Canada"
      }
    ]
  }
}
```

**Champs disponibles:** `id`, `titre`, `description`, `organisation`, `sourceCatalogue`, `urlSource`, `dateCreationSource`, `dateModificationSource`

---

## 5. Statistiques

**Note:** Calculées côté frontend à partir de `GET /api/donnees/`

**Fichier:** `src/components/DataCharts.tsx`

- Répartition par source de catalogue
- Top 5 des organisations contributrices

---

## Codes de réponse HTTP

| Code | Description |
|------|-------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Paramètres invalides |
| 401 | Unauthorized - Token manquant/invalide |
| 404 | Not Found - Ressource introuvable |
| 500 | Internal Server Error |

---

## Structure TypeScript

```typescript
interface JeuDeDonnees {
  id: number;
  titre: string;
  description: string;
  organisation: string;
  source_catalogue: string;
  url_source: string;
  date_creation_source: string | null;
  date_modification_source: string | null;
}
```

---

**Version:** 1.0 | **Date:** 13 décembre 2025
