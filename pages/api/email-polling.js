export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://nsbjkxbfkhauitmjnkxh.supabase.co/functions/v1/email-polling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json(data);
      }
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro ao executar polling',
        details: error.message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 