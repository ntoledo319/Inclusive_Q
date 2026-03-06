const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Data directory - use Fly volume if available, otherwise local
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const RESPONSES_FILE = path.join(DATA_DIR, 'responses.json');
const ADMIN_KEY = process.env.ADMIN_KEY || 'necypaa2026';

app.use(express.json({ limit: '5mb' }));
app.use(express.static('public'));

// Load responses
function loadResponses() {
  try {
    if (fs.existsSync(RESPONSES_FILE)) {
      return JSON.parse(fs.readFileSync(RESPONSES_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading responses:', e);
  }
  return {};
}

// Save responses
function saveResponses(data) {
  fs.writeFileSync(RESPONSES_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// API: Save form progress
app.post('/api/save', (req, res) => {
  try {
    const { answers, progress, lastSection } = req.body;
    const data = loadResponses();
    data.answers = answers || {};
    data.progress = progress ?? 0;
    data.lastSection = lastSection ?? 0;
    data.lastUpdated = new Date().toISOString();
    if (!data.firstStarted) data.firstStarted = new Date().toISOString();
    saveResponses(data);
    res.json({ ok: true });
  } catch (e) {
    console.error('Save error:', e);
    res.status(500).json({ error: 'Failed to save' });
  }
});

// API: Load saved progress
app.get('/api/load', (req, res) => {
  try {
    const data = loadResponses();
    res.json(data);
  } catch (e) {
    res.json({});
  }
});

// API: Mark as submitted
app.post('/api/submit', (req, res) => {
  try {
    const { answers } = req.body;
    const data = loadResponses();
    data.answers = answers || data.answers || {};
    data.submitted = true;
    data.submittedAt = new Date().toISOString();
    data.lastUpdated = new Date().toISOString();
    saveResponses(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit' });
  }
});

// Admin dashboard
app.get('/admin', (req, res) => {
  const key = req.query.key;
  if (key !== ADMIN_KEY) {
    return res.status(401).send(`
      <!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Admin Access</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:-apple-system,system-ui,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
        .box{background:#1e293b;padding:40px;border-radius:16px;max-width:400px;width:100%;text-align:center}
        h2{margin-bottom:16px;color:#f1f5f9}
        form{display:flex;flex-direction:column;gap:12px}
        input{padding:12px 16px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:16px}
        button{padding:12px;border-radius:8px;border:none;background:#0e7c7b;color:white;font-size:16px;font-weight:600;cursor:pointer}
        button:hover{background:#0a6362}
      </style></head><body>
      <div class="box">
        <h2>🔒 Admin Access</h2>
        <form method="GET" action="/admin">
          <input type="password" name="key" placeholder="Enter admin key" autofocus>
          <button type="submit">View Responses</button>
        </form>
      </div></body></html>
    `);
  }

  const data = loadResponses();
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Admin API (with key check)
app.get('/api/admin/responses', (req, res) => {
  if (req.query.key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  res.json(loadResponses());
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Questionnaire running on port ${PORT}`);
});
