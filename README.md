# Accessibilities Chair Questionnaire — Fly.io Deployment

## What This Is
A beautiful, mobile-first questionnaire for your Accessibilities Chair. 
Auto-saves progress, works on any device, admin dashboard for you to view responses.

## Deploy to Fly.io (5 minutes)

### If you have an existing Fly app you want to replace:

```bash
# 1. Extract the project
tar -xzf questionnaire-app.tar.gz
cd questionnaire-app

# 2. Edit fly.toml — change the app name to your existing app name
#    Also change ADMIN_KEY to whatever password you want

# 3. Create a volume for persistent data storage
fly volumes create questionnaire_data --size 1 --region ewr

# 4. Deploy
fly deploy
```

### If creating a fresh Fly app:

```bash
# 1. Extract the project
tar -xzf questionnaire-app.tar.gz
cd questionnaire-app

# 2. Launch (creates the app)
fly launch --no-deploy

# 3. Create a volume for persistent data
fly volumes create questionnaire_data --size 1 --region ewr

# 4. Deploy
fly deploy
```

## URLs

- **Form**: `https://YOUR-APP.fly.dev` — send this to your Accessibilities Chair
- **Admin**: `https://YOUR-APP.fly.dev/admin` — enter your admin key to view responses
  - Direct link: `https://YOUR-APP.fly.dev/admin?key=necypaa2026`

## Config

Edit `fly.toml` to change:
- `app` — your Fly app name  
- `ADMIN_KEY` — password to access admin dashboard (default: `necypaa2026`)
- `primary_region` — closest to you (`ewr` = Newark/NYC area)

## Features
- Auto-saves every answer as she types
- She can close her phone and come back — picks up right where she left off
- 10 sections with smooth navigation
- Every technical term has a plain-English explainer
- Mobile-first, dark theme, accessible
- Admin dashboard shows all responses in real-time
