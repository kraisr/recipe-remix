<h1 align="center">Recipe Remix 👨‍🍳🥗</h1>

A full-stack recipe and meal-planning app that helps you **turn what you already have into meals reducing leftovers and potential food waste**.  
Track pantry ingredients, discover recipes with dietary filters, save favorites, build shopping lists, share your recipes, and connect with a community.

---

## Tech stack

- **Frontend:** React, Redux, MUI, TailwindCSS  
- **Backend:** Node.js, Express, MongoDB, JWT  
- **APIs:** Suggestic (recipe search), Google Maps/Places, Nodemailer

---

## Key features

- **Pantry-first recipe discovery**: search recipes by ingredients you already have.
- **Dietary preferences**: filter results with common dietary restrictions/preferences (e.g., gluten-free, vegan, etc.).
- **Saved recipes & folders**: bookmark recipes and organize them into custom folders.
- **Shopping list**: turn recipes into an actionable grocery list.
- **Grocery store finder**: map view powered by Google Maps + Places.
- **Community**: create posts, comment/reply, and interact with other users.
- **Direct messaging**: one-to-one conversations inside the app.
- **Auth flows**: JWT auth + email confirmation + password reset (email provider required).
- **Automated reminders**: optional scheduled email reminders (cron + email provider required).

---

## Run locally

### 1) Install

```
git clone https://github.com/kraisr/Recipe-Remix && cd Recipe-Remix
```
```
cd backend && npm ci
```
```
cd ../frontend && npm ci
```

### 2) Set environment variables

Create backend/.env:
```
MONGO_URL=mongodb://127.0.0.1:27017/recipe_remix

JWT_SECRET=replace-with-a-long-random-string

SUGGESTIC_USER_ID=your_suggestic_user_id
SUGGESTIC_TOKEN=your_suggestic_token

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REFRESH_TOKEN=your_google_oauth_refresh_token
```

### 3) Start the apps

Terminal 1 (backend):
```
cd backend && npm start
```


Terminal 2 (frontend):
```
cd frontend && npm start
```


Frontend: http://localhost:3000

Backend: http://localhost:8080
