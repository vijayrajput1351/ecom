const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.json());
app.use(cors());

const USER_SERVICE    = process.env.USER_SERVICE_URL    || 'http://localhost:3001';
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const ORDER_SERVICE   = process.env.ORDER_SERVICE_URL   || 'http://localhost:3003';
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004';

app.get('/health', (req, res) => res.json({ status: 'OK', service: 'api-gateway' }));

// Proxy routes - API calls pehle handle karo
app.use('/api/users', createProxyMiddleware({
  target: USER_SERVICE,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'User service unavailable!' });
    }
  }
}));

app.use('/api/products', createProxyMiddleware({
  target: PRODUCT_SERVICE,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'Product service unavailable!' });
    }
  }
}));

app.use('/api/orders', createProxyMiddleware({
  target: ORDER_SERVICE,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'Order service unavailable!' });
    }
  }
}));

app.use('/api/payments', createProxyMiddleware({
  target: PAYMENT_SERVICE,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'Payment service unavailable!' });
    }
  }
}));

// Frontend serve karo
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));
