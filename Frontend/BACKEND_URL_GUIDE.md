# Backend URL Configuration Guide

## Current Issue
Your frontend is trying to connect to `https://expenses-tracker-backend.vercel.app` which doesn't exist or isn't accessible.

## Step 1: Find Your Actual Backend URL

### Method 1: Check Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Look for your backend project in the dashboard
3. Click on the project
4. Copy the deployment URL (it will look like `https://your-project-name.vercel.app`)

### Method 2: Check Your Backend Deployment
If you deployed your backend to Vercel, the URL will be in your Vercel dashboard.

### Method 3: Common Backend URL Patterns
Your backend URL might be one of these:
- `https://expenses-tracker-backend-abc123.vercel.app`
- `https://expenses-tracker-backend-git-main-abc123.vercel.app`
- `https://your-username-expenses-tracker-backend.vercel.app`

## Step 2: Update the Backend URL

### Option A: Environment Variable (Recommended)
1. Go to your **frontend** Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-actual-backend-url.vercel.app`
   - Environment: Production, Preview, Development

### Option B: Direct Code Update
Update `src/config/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-actual-backend-url.vercel.app';
```

## Step 3: Test the Connection

### Use the Test Component
1. Add the `ApiTest` component to your app temporarily
2. Visit the test page
3. Click "Test Backend Connection"
4. Check the results

### Manual Testing
Test these URLs in your browser:
- `https://your-backend-url.vercel.app/api/health`
- `https://your-backend-url.vercel.app/api/cors-test`

## Step 4: Verify Backend is Working

Make sure your backend:
1. Is deployed on Vercel
2. Has the correct environment variables set
3. Is accessible via the health endpoint

## Common Issues and Solutions

### Issue: "net::ERR_FAILED"
**Solution**: The backend URL is incorrect or the backend is not deployed

### Issue: CORS Errors
**Solution**: Set `CORS_ALLOW_ALL=true` in your backend environment variables

### Issue: 404 Errors
**Solution**: Check that your backend endpoints exist and are properly configured

## Quick Debug Steps

1. **Check Vercel Dashboard**: Find your backend project URL
2. **Test Health Endpoint**: Visit `https://your-backend-url.vercel.app/api/health`
3. **Update Frontend**: Set the correct URL in environment variables
4. **Deploy Frontend**: Redeploy with the new environment variable
5. **Test Login**: Try logging in from your frontend

## Example Configuration

### Frontend Environment Variable:
```
VITE_API_BASE_URL=https://expenses-tracker-backend-abc123.vercel.app
```

### Backend Environment Variables:
```
MONGO_DB=your_mongodb_connection_string
NODE_ENV=production
CORS_ALLOW_ALL=true
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://expenses-tracker-5acj.vercel.app
```

## Need Help?

If you can't find your backend URL:
1. Check your Vercel dashboard for all projects
2. Look for any recent deployments
3. Check your browser history for backend URLs you've visited
4. Ask me to help you find it!
