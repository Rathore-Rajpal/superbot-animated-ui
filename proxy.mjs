import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.post('/api/forward-chat', async (req, res) => {
  try {
    const response = await fetch('https://n8nautomation.site/webhook/cf1de04f-3e38-426c-89f0-3bdb110a5dcf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
    console.log('N8N webhook status:', response.status);
    console.log('N8N webhook response:', data);
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
