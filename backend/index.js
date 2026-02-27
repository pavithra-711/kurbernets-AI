const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { OpenAI } = require('openai');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Mock OpenAI integration (to avoid needing a real API key for basic setup)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-api-key',
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// MongoDB Setup (Optional / Failsafe)
let isMongoConnected = false;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kubehire', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
    isMongoConnected = true;
}).catch(err => {
    console.log('MongoDB connection warning (running without DB):', err.message);
});

const AnalyticsSchema = new mongoose.Schema({
    type: String, // 'visit' or 'interview'
    timestamp: { type: Date, default: Date.now }
});
const Analytics = mongoose.model('Analytics', AnalyticsSchema);

// Analytics tracking endpoint
let analyticsData = { visitors: 0, interviews: 0 };
app.post('/api/analytics/visit', async (req, res) => {
    analyticsData.visitors++;
    if (isMongoConnected) await Analytics.create({ type: 'visit' });

    io.emit('analytics_update', analyticsData);
    res.status(200).json({ success: true, visitors: analyticsData.visitors });
});

app.post('/api/analytics/interview', async (req, res) => {
    analyticsData.interviews++;
    if (isMongoConnected) await Analytics.create({ type: 'interview' });

    io.emit('analytics_update', analyticsData);
    res.status(200).json({ success: true, interviews: analyticsData.interviews });
});

app.post('/api/interview/evaluate', async (req, res) => {
    try {
        const { question, answer } = req.body;

        // For local dev without a real key, we mock the NLP response:
        const mockResponse = {
            score: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
            feedback: `You provided a good answer. To improve, try connecting the concepts more directly to scalability and production architecture.`,
            areas_for_improvement: ['Deep dive into specific examples', 'Explain trade-offs']
        };

        res.json(mockResponse);
    } catch (error) {
        console.error('Interview evaluation error:', error);
        res.status(500).json({ error: 'Failed to evaluate interview response' });
    }
});

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    socket.emit('analytics_update', analyticsData);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`KubeHire Backend running on port ${PORT}`);
});
