# Backend API

This is the backend API for the chat application.

## Environment Variables

Make sure to set these environment variables in your Vercel deployment:

- `MONGO_DB`: Your MongoDB connection string
- `NODE_ENV`: Set to `production` for Vercel
- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `CORS_ALLOW_ALL`: Set to `true` to allow all origins in development

## Deployment to Vercel

1. Make sure your MongoDB database is accessible from Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy the backend folder to Vercel
4. Test the health endpoint: `https://your-app.vercel.app/api/health`

## API Endpoints

- `GET /api/health` - Health check
- `GET /home` - Test endpoint
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

## Local Development

```bash
npm install
npm run dev
```

The server will start on port 8000 (or the port specified in PORT environment variable).
