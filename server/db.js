import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPromise = open({
  filename: path.join(__dirname, 'database.sqlite'),
  driver: sqlite3.Database
});

export async function setupDatabase() {
  const db = await dbPromise;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org TEXT NOT NULL,
      zone TEXT NOT NULL,
      task TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS deployments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      supply TEXT NOT NULL,
      org TEXT NOT NULL,
      isNeed BOOLEAN NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      disaster TEXT NOT NULL,
      insight TEXT NOT NULL,
      type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS providers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orgName TEXT NOT NULL,
      resources TEXT NOT NULL,
      contactInfo TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `);

  // Seed tasks
  const taskCount = await db.get('SELECT COUNT(*) as count FROM tasks');
  if (taskCount.count === 0) {
    await db.exec(`
      INSERT INTO tasks (org, zone, task, status) VALUES 
      ('Red Cross', 'Village A', 'Distribute 500L Water', 'In Progress'),
      ('Gov Public Works', 'Sector 4', 'Clear Main Road Debris', 'Claimed'),
      ('Unclaimed', 'Village B', 'Medical Tents Required', 'Open Needs'),
      ('UNICEF', 'Village C', 'Provide Baby Formula', 'Completed');
    `);
  }

  // Seed deployments
  const depCount = await db.get('SELECT COUNT(*) as count FROM deployments');
  if (depCount.count === 0) {
    await db.exec(`
      INSERT INTO deployments (name, x, y, supply, org, isNeed) VALUES 
      ('Village A', 30, 30, 'Water', 'Red Cross', 0),
      ('Sector 4', 60, 50, 'Shelter', 'Gov Housing', 0),
      ('Village B', 40, 70, 'Medical', 'Open Need', 1),
      ('Zone C', 75, 25, 'Water', 'UNICEF', 0);
    `);
  }

  // Seed lessons
  const lessonCount = await db.get('SELECT COUNT(*) as count FROM lessons');
  if (lessonCount.count === 0) {
    await db.exec(`
      INSERT INTO lessons (disaster, insight, type) VALUES 
      ('2018 Floods', 'Avoid setting up camps in Valley B. It is prone to secondary flooding within 48 hours.', 'warning'),
      ('2021 Cyclone', 'Local community halls are better distribution points than schools to avoid disrupting education.', 'recommendation'),
      ('2019 Earthquake', 'There was a 40% surplus of donated clothing. Cash transfers are more effective for initial relief.', 'observation');
    `);
  }

  // Seed providers
  const providerCount = await db.get('SELECT COUNT(*) as count FROM providers');
  if (providerCount.count === 0) {
    await db.exec(`
      INSERT INTO providers (orgName, resources, contactInfo, status) VALUES 
      ('Red Cross Global', 'Medical Teams, Tents, Clean Water', 'dispatch@redcross.org | +1 800 555 0199', 'Available'),
      ('World Central Kitchen', 'Mobile Kitchens, Hot Meals, Rations', 'ops@wck.org | +1 800 555 0200', 'Deployed'),
      ('Doctors Without Borders', 'Trauma Surgeons, Medicine, Field Hospitals', 'fieldops@msf.org | +41 22 849 84 00', 'Available'),
      ('UNICEF', 'Child Protection, Education Kits, Nutrition', 'emergency@unicef.org | +1 212 326 7000', 'Available');
    `);
  }

  return db;
}

export default dbPromise;
