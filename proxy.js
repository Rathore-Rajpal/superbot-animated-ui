const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.post('/api/forward-chat', async (req, res) => {
  try {
    const response = await fetch('https://n8nautomation.site/webhook/cf1de04f-3e38-426c-89f0-3bdb110a5dcf/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).send('Proxy error');
  }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
