# Academic Portfolio — Full-Stack Website

A production-ready portfolio website with an **Express.js backend** and a dynamic frontend that fetches all content from a REST API.

## Project Structure

```
portfolio/
├── server.js              # Express backend
├── package.json
├── public/
│   └── index.html         # Frontend (fetches data from API)
└── data/
    ├── profile.json        # Your personal info, bio, stats
    ├── projects.json       # Featured projects
    ├── publications.json   # Research papers
    ├── skills.json         # Technical skills + percentages
    ├── awards.json         # Honours & achievements
    ├── timeline.json       # Education + experience history
    ├── interests.json      # Research interest cards
    ├── messages.json       # Contact form submissions (auto-created)
    └── stats.json          # Page view counter (auto-created)
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start
# → http://localhost:3000

# For development with auto-reload:
npm run dev
```

## API Endpoints

| Method | Route              | Description                          |
|--------|--------------------|--------------------------------------|
| GET    | `/api/portfolio`   | All data in one request              |
| GET    | `/api/projects`    | Projects list                        |
| GET    | `/api/publications`| Publications list                    |
| GET    | `/api/skills`      | Skills + percentages                 |
| GET    | `/api/awards`      | Awards & achievements                |
| POST   | `/api/contact`     | Submit contact form message          |
| POST   | `/api/track`       | Increment page view counter          |
| GET    | `/api/stats`       | Page view stats                      |

## Customising Your Portfolio

Edit the JSON files in `/data/` — **no code changes needed**:

### `data/profile.json`
Change your name, email, GitHub, LinkedIn, bio, tags, and stats.

### `data/projects.json`
Add/remove projects. Each project has: `title`, `description`, `tags[]`, `link`, `linkLabel`.

### `data/publications.json`
Add papers with venue, year, DOI, status (`"Published"` / `"Under Review"`), and status badge colors.

### `data/skills.json`
Update skill names and percentages (0–100). Change `color` for bar color.

### `data/timeline.json`
Edit education and experience entries. Set `"active": true` for blue dot, `false` for gray.

## Deploying

### Render / Railway / Fly.io
- Set start command: `node server.js`
- Set `PORT` environment variable if needed

### VPS / DigitalOcean
```bash
npm install -g pm2
pm2 start server.js --name portfolio
pm2 save
```

### Environment Variables
```
PORT=3000   # Default port (optional)
```

## Contact Form Messages

All form submissions are saved to `data/messages.json`. You can view them anytime:
```bash
cat data/messages.json
```

Each entry has: `id`, `name`, `email`, `subject`, `message`, `timestamp`, `read`.

# UpdatePortfolio
