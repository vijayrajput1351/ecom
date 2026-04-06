const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:mypassword@localhost:27017/paymentdb?authSource=admin';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Payment Service MongoDB Connected!'))
  .catch(err => console.log('❌ MongoDB Error:', err.message));

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['card', 'upi', 'netbanking'], required: true },
  status: { type: String, default: 'completed', enum: ['pending', 'completed', 'failed', 'refunded'] },
  transactionId: { type: String, default: () => 'TXN' + Date.now() },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

app.get('/health', (req, res) => res.json({ status: 'OK', service: 'payment-service' }));

app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const { orderId, userId, amount, method } = req.body;
    if (!orderId || !userId || !amount || !method) {
      return res.status(400).json({ error: 'All fields required!' });
    }
    const payment = new Payment({ orderId, userId, amount, method, status: 'completed' });
    await payment.save();
    res.json({ message: 'Payment successful!', payment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/payments/:orderId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) return res.status(404).json({ error: 'Payment not found!' });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`🚀 Payment Service running on port ${PORT}`));
