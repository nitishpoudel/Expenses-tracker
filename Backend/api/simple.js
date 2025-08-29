export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Handle different routes
    if (req.method === 'GET') {
        if (req.url === '/api/health' || req.url === '/api/health/') {
            res.status(200).json({
                success: true,
                message: 'Simple health check working',
                timestamp: new Date().toISOString(),
                method: req.method,
                url: req.url
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            message: 'Simple serverless function working',
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url
        });
        return;
    }
    
    // Handle POST requests
    if (req.method === 'POST') {
        res.status(200).json({
            success: true,
            message: 'POST request received',
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url
        });
        return;
    }
    
    // Default response
    res.status(404).json({
        success: false,
        message: 'Route not found',
        method: req.method,
        url: req.url
    });
}
