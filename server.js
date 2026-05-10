const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DEV_AUTORELOAD = process.env.DEV_AUTORELOAD === '1';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const readJSON = (file) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
const writeJSON = (file, data) => fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));

const reloadClients = new Set();

if (DEV_AUTORELOAD) {
  const watchTargets = [path.join(__dirname, 'public'), DATA_DIR];
  let reloadTimer = null;

  const broadcastReload = () => {
    for (const client of reloadClients) {
      client.write('data: reload\n\n');
    }
  };

  const scheduleReload = () => {
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(broadcastReload, 120);
  };

  for (const target of watchTargets) {
    try {
      fs.watch(target, { recursive: true }, scheduleReload);
    } catch (error) {
      console.warn(`Auto-reload watch failed for ${target}: ${error.message}`);
    }
  }

  app.get('/__dev/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    res.write('retry: 500\n\n');

    reloadClients.add(res);
    req.on('close', () => reloadClients.delete(res));
  });
}

app.get('/api/portfolio', (req, res) => {
  try {
    const profile = readJSON('profile.json');
    const projects = readJSON('projects.json');
    const pubs = readJSON('publications.json');
    const awards = readJSON('awards.json');
    const skills = readJSON('skills.json');
    const timeline = readJSON('timeline.json');
    const interests = readJSON('interests.json');
    const extracurricular = readJSON('extracurricular.json');
    const training = readJSON('training.json');
    res.json({ profile, projects, publications: pubs, awards, skills, timeline, interests, extracurricular, training });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load portfolio data' });
  }
});

app.get('/api/projects', (req, res) => res.json(readJSON('projects.json')));
app.get('/api/publications', (req, res) => res.json(readJSON('publications.json')));
app.get('/api/skills', (req, res) => res.json(readJSON('skills.json')));
app.get('/api/awards', (req, res) => res.json(readJSON('awards.json')));
app.get('/api/extracurricular', (req, res) => res.json(readJSON('extracurricular.json')));
app.get('/api/training', (req, res) => res.json(readJSON('training.json')));

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const messages = readJSON('messages.json');
  const entry = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    subject: (subject || '').trim(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
    read: false
  };
  messages.push(entry);
  writeJSON('messages.json', messages);

  console.log(`New message from ${name} <${email}>`);
  res.json({ success: true, message: 'Message received! I will get back to you soon.' });
});

app.post('/api/track', (req, res) => {
  const stats = readJSON('stats.json');
  stats.views = (stats.views || 0) + 1;
  stats.lastVisit = new Date().toISOString();
  writeJSON('stats.json', stats);
  res.json({ views: stats.views });
});

app.get('/api/stats', (req, res) => res.json(readJSON('stats.json')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
  if (DEV_AUTORELOAD) {
    console.log('Auto-reload is enabled for public/ and data/.');
  }
});
