<h1 align="center">Recipe Remix 👨‍🍳🥗</h1>

A full-stack recipe and meal-planning app that helps you **turn what you already have into meals reducing leftovers and potential food waste**.  
Track pantry ingredients, discover recipes with dietary filters, save favorites, build shopping lists, share your recipes, and connect with a community.

**Quick start:** [Run with Docker](#option-a-recommended-run-with-docker) · [Manual setup](#option-b-manual-setup-install-dependencies-locally)

---

## Tech stack

- **Frontend:** React, Redux, MUI, TailwindCSS  
- **Backend:** Node.js, Express, MongoDB, JWT  
- **APIs:** Suggestic (recipe search), Google Maps/Places, Nodemailer

---

## Key features

- **Google Sign-In**: optional OAuth login alongside email/password.
- **2FA (email code)**: optional two-factor auth for additional account security.
- **Pantry-first recipe discovery**: search recipes by ingredients you already have.
- **Saved recipes & folders**: bookmark recipes and organize them into custom folders.
- **Shopping list**: turn recipes into an actionable grocery list.
- **Grocery store finder**: map view powered by Google Maps + Places.
- **Community**: create posts, comment/reply, and interact with other users.
- **Auth flows**: JWT auth + email confirmation + password reset (email provider required).
- **Dietary preferences**: filter results with common dietary restrictions/preferences (e.g., gluten-free, vegan, etc.).
- **Direct messaging**: one-to-one conversations inside the app.
- **Automated reminders**: optional scheduled email reminders (cron + email provider required).

### Demo

https://github.com/user-attachments/assets/2c666330-8a38-4174-a156-e880c15b30b4

### Shopping List + Nearby Grocery Store Map

[![Preview docs](docs/img/shopping_list.png)](https://github.com/kraisr/Recipe-Remix)

### Profile

[![Preview docs](docs/img/profile.png)](https://github.com/kraisr/Recipe-Remix)

### Community

[![Preview docs](docs/img/community.png)](https://github.com/kraisr/Recipe-Remix)

### Register

[![Preview docs](docs/img/register.png)](https://github.com/kraisr/Recipe-Remix)

### Login

[![Preview docs](docs/img/login.png)](https://github.com/kraisr/Recipe-Remix)

### Password Recovery

[![Preview docs](docs/img/recovery.png)](https://github.com/kraisr/Recipe-Remix)

---

## Run locally

### Option A (Recommended): Run with Docker

**Prereqs:** Docker Desktop

1) Clone the repository and enter into the new directory:

```bash
git clone https://github.com/kraisr/Recipe-Remix && cd Recipe-Remix
```

2) Create backend/.env:

```bash
MONGO_URL=your_mongo_url

JWT_SECRET=replace-with-a-long-random-string

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REFRESH_TOKEN=your_google_oauth_refresh_token

SUGGESTIC_TOKEN=your_suggestic_token
SUGGESTIC_USER_ID=your_suggestic_user_id
GIPHY_TOKEN=your_giphy_token
```

3) Start the full stack (frontend + backend + local MongoDB):

```bash
docker compose up --build
```

4) Open:

- Frontend: http://localhost:3000

- Backend: http://localhost:8080

5) Stop containers (keeps DB data):

```bash
docker compose down
```

- Reset everything including local DB data:

```bash
docker compose down -v
```

### Option B: Manual setup (install dependencies locally)

1) Clone the repository and enter into the new directory:

```bash
git clone https://github.com/kraisr/Recipe-Remix && cd Recipe-Remix
```

- Enter the backend directory and install dependencies:

```bash
cd backend && npm ci
```

- Enter the frontend directory and install dependencies:

```bash
cd ../frontend && npm ci
```

2) Set environment variables:

- Create backend/.env (see template above)

3) Start the apps:

- Terminal 1 (backend):
```bash
cd backend && npm start
```


- Terminal 2 (frontend):
```bash
cd frontend && npm start
```

4) Open:

- Frontend: http://localhost:3000

- Backend: http://localhost:8080
