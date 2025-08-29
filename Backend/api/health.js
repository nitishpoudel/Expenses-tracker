export default function handler(req, res) {
    res.status(200).json({
        success: true,
        message: 'Health check passed',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
}
