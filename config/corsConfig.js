const cors = require('cors');

// Function to determine the frontend URL based on the request
function getFrontendUrl(req) {
    const host = req.get('host');
    if (host.includes('test.bizcard.pfdigital.in')) {
        return 'https://test.bizcard.pfdigital.in';
    } else if (host.includes('erocard.pfdigital.in')) {
        return 'https://erocard.pfdigital.in';
    } else {
        // Default frontend URL or development URL
        return process.env.FRONTEND_URL || 'http://localhost:3000';
    }
}

// CORS configuration middleware
const corsMiddleware = (req, res, next) => {
    const frontendUrl = getFrontendUrl(req);
    cors({
        origin: frontendUrl,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })(req, res, next);
};

module.exports = corsMiddleware;