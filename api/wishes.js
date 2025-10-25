import { promises as fs } from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'wishes.json');

async function readWishes() {
  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist or error, return empty array
    return [];
  }
}

async function writeWishes(wishes) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(wishes, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const wishes = await readWishes();
    return res.status(200).json(wishes);
  }

  if (req.method === 'POST') {
    const { fullName, email, message, photo } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const wishes = await readWishes();

    const newWish = {
      _id: Date.now().toString(),
      fullName,
      email,
      message,
      photo: photo || '',
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    wishes.unshift(newWish); // add newest on top

    await writeWishes(wishes);

    return res.status(201).json(newWish);
  }

  if (req.method === 'POST' && req.url.match(/^\/api\/wishes\/\d+\/like$/)) {
    // For your like endpoint (you can implement this as a separate file or add logic here)
    return res.status(501).json({ error: 'Like endpoint not implemented yet' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
