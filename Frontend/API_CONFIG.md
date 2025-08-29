# Frontend API Configuration Guide

## Environment Variables

Create a `.env` file in your Frontend directory with the following:

### For Local Development:
```
VITE_API_BASE_URL=http://localhost:8000
```

### For Vercel Deployment:
```
VITE_API_BASE_URL=https://your-backend-app.vercel.app
```

## Setting Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Navigate to your frontend project settings
3. Go to "Environment Variables"
4. Add:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend-app.vercel.app` (replace with your actual backend URL)
   - Environment: Production, Preview, Development

## Important Notes

1. **HTTPS Required**: Always use `https://` for production URLs
2. **No Port Numbers**: Vercel doesn't use port numbers like `:8000`
3. **Correct Backend URL**: Make sure to use your actual backend Vercel URL

## Testing

After deployment, test your API calls:
- Login: `https://your-backend-app.vercel.app/api/users/login`
- Register: `https://your-backend-app.vercel.app/api/users/register`
- Health Check: `https://your-backend-app.vercel.app/api/health`

## Troubleshooting

If you see "Mixed Content" errors:
- Make sure you're using `https://` not `http://`
- Remove any port numbers from the URL
- Check that your backend is properly deployed on Vercel
