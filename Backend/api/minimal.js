import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Minimal serverless function working',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Health check passed',
        timestamp: new Date().toISOString()
    });
});

export default app;
