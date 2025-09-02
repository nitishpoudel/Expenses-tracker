import app from '../app.js';

// Standard Vercel serverless function format
export default function handler(req, res) {
  return app(req, res);
}
