const express = require('express');
const cors = require('cors');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/healthz', (req, res) => {
  const healthcheck = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Service is healthy',
  };
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.status = 'DOWN';
    healthcheck.message = error.message;
    res.status(503).json(healthcheck);
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js API' });
});

// Sample API routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Webhook endpoint
app.post('/api/webhook', (req, res) => {
  try {
    // Get the payload from the request
    const payload = req.body;
    
    // Log the webhook payload (for debugging)
    console.log('Webhook received:', payload);
    
    // Here you can add your webhook processing logic
    // For example, you might want to verify a secret token
    const webhookSecret = req.headers['x-webhook-secret'];
    if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Invalid webhook secret' });
    }
    
    // Process different types of webhook events
    if (payload.event) {
      console.log(`Processing ${payload.event} event`);
      // Add your event handling logic here
    }
    
    // Respond with a success message
    res.status(200).json({ 
      status: 'success',
      message: 'Webhook received successfully',
      event: payload.event || 'unknown'
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error processing webhook',
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;
