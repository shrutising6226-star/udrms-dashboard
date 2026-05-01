import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretteamhubkey123';

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, agencyName: user.agencyName }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, agencyName: user.agencyName }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/v1/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.sendStatus(404);
    
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, agencyName: user.agencyName });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- UDRMS ROUTES ---

// 1. Central Resource & Activity Registry
app.get('/api/v1/activities', authenticateToken, async (req, res) => {
  try {
    const activities = await prisma.activityRegistry.findMany({
      include: { agency: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/v1/activities', authenticateToken, async (req, res) => {
  try {
    const { agencyId, title, activityType, description, zone, latitude, longitude, budget, beneficiaries } = req.body;
    
    // DEDUPLICATION ENGINE LOGIC
    // Find activities of the SAME type, within ~5km radius (roughly 0.045 degrees lat/lng)
    const threshold = 0.045; 
    
    const overlapping = await prisma.activityRegistry.findMany({
      where: {
        activityType,
        latitude: { gte: latitude - threshold, lte: latitude + threshold },
        longitude: { gte: longitude - threshold, lte: longitude + threshold },
        status: { not: 'COMPLETED' }
      },
      include: { agency: true }
    });

    const isDuplicated = overlapping.length > 0;
    const duplicateNotes = isDuplicated 
      ? `Flagged: Overlap with ${overlapping.map(o => o.agency.name).join(', ')} conducting ${activityType} nearby.`
      : null;

    const newActivity = await prisma.activityRegistry.create({
      data: {
        agencyId, title, activityType, description, zone, latitude, longitude, budget, beneficiaries,
        startDate: new Date(),
        isDuplicated, duplicateNotes
      },
      include: { agency: true }
    });

    res.json(newActivity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/v1/activities/:id/resolve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedActivity = await prisma.activityRegistry.update({
      where: { id: id },
      data: { isDuplicated: false, duplicateNotes: null }
    });
    res.json(updatedActivity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Dashboard Summary
app.get('/api/v1/dashboard/summary', authenticateToken, async (req, res) => {
  try {
    const totalActivities = await prisma.activityRegistry.count();
    const activeAgencies = await prisma.agency.count();
    
    const funds = await prisma.fundDisbursement.aggregate({ _sum: { amount: true } });
    
    const duplicatedCount = await prisma.activityRegistry.count({ where: { isDuplicated: true } });

    res.json({
      totalActivities,
      activeAgencies,
      totalFundsDisbursed: funds._sum.amount || 0,
      duplicatedCount
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Agencies
app.get('/api/v1/agencies', authenticateToken, async (req, res) => {
  try {
    const agencies = await prisma.agency.findMany({
      include: {
        _count: {
          select: { activities: true, funds: true }
        }
      }
    });
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Post-Disaster Analysis (Lessons Learned)
app.get('/api/v1/analysis', authenticateToken, async (req, res) => {
  try {
    const analyses = await prisma.disasterAnalysis.findMany({
      orderBy: { dateOccurred: 'desc' }
    });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/v1/analysis', authenticateToken, async (req, res) => {
  try {
    const { disasterType, region, dateOccurred, whatWorked, whatFailed, populationsMissed, tags } = req.body;
    
    const newAnalysis = await prisma.disasterAnalysis.create({
      data: {
        disasterType,
        region,
        dateOccurred: new Date(dateOccurred),
        whatWorked,
        whatFailed,
        populationsMissed,
        tags,
        authorId: req.user.id
      }
    });
    res.json(newAnalysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Resources Marketplace
app.get('/api/v1/resources/inventory', authenticateToken, async (req, res) => {
  try {
    const inventory = await prisma.resourceInventory.findMany({ include: { agency: true }, orderBy: { createdAt: 'desc' } });
    res.json(inventory);
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

app.post('/api/v1/resources/inventory', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const inv = await prisma.resourceInventory.create({ data, include: { agency: true } });
    res.json(inv);
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

app.get('/api/v1/resources/needs', authenticateToken, async (req, res) => {
  try {
    const needs = await prisma.resourceNeed.findMany({ include: { agency: true }, orderBy: { createdAt: 'desc' } });
    res.json(needs);
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

app.post('/api/v1/resources/needs', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const need = await prisma.resourceNeed.create({ data, include: { agency: true } });
    res.json(need);
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// 6. Logistics Progress Update
app.put('/api/v1/activities/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { completionPct, supplyStage } = req.body;
    const updated = await prisma.activityRegistry.update({
      where: { id },
      data: { completionPct, supplyStage }
    });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// 7. Public Endpoints
app.get('/api/v1/public/activities', async (req, res) => {
  try {
    const activities = await prisma.activityRegistry.findMany({
      include: { agency: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(activities);
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

app.get('/api/v1/public/dashboard', async (req, res) => {
  try {
    const totalActivities = await prisma.activityRegistry.count();
    const activeAgencies = await prisma.agency.count();
    const funds = await prisma.fundDisbursement.aggregate({ _sum: { amount: true } });
    
    res.json({
      totalActivities,
      activeAgencies,
      totalFundsDisbursed: funds._sum.amount || 0
    });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

app.get('/api/v1/public/posts', async (req, res) => {
  try {
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

app.post('/api/v1/public/posts', async (req, res) => {
  try {
    const { author, content } = req.body;
    const post = await prisma.communityPost.create({
      data: { author: author || 'Anonymous', content }
    });
    res.json(post);
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// Serve static files in production or use Vite middleware in dev
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('{/*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);

  app.use(async (req, res, next) => {
    try {
      let template = await fs.readFile(path.join(__dirname, '../index.html'), 'utf-8');
      template = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`UDRMS API Server running on port ${PORT}`);
});
