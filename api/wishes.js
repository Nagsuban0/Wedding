import 'dotenv/config'; 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch wishes ordered by newest first
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { fullName, email, message, photo } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase.from('wishes').insert([
      {
        fullName,
        email,
        message,
        photo: photo || null,
        likes: 0
      }
    ]).select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
