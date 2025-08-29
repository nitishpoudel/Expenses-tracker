# Backend Deployment Checklist

## Step 1: Verify Backend Deployment

### Check Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Look for your backend project in the dashboard
3. Check if it shows "Deployed" status
4. Copy the deployment URL

### Test Backend Health
Try visiting your backend URL + `/api/health` in your browser:
```
https://your-backend-url.vercel.app/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-29T10:30:00.000Z"
}
```

## Step 2: Environment Variables

Make sure these are set in your **backend** Vercel project:

```
MONGO_DB=your_mongodb_connection_string
NODE_ENV=production
CORS_ALLOW_ALL=true
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://expenses-tracker-5acj.vercel.app
```

## Step 3: Frontend Configuration

In your **frontend** Vercel project, set:

```
VITE_API_BASE_URL=https://your-actual-backend-url.vercel.app
```

## Step 4: Test Connection

1. **Test Backend**: Visit your backend health endpoint
2. **Test Frontend**: Try logging in from your frontend
3. **Check Console**: Look for any errors in browser console

## Common Issues

### Issue: Backend Not Deployed
**Solution**: Deploy your backend to Vercel

### Issue: Wrong Backend URL
**Solution**: Find the correct URL in Vercel dashboard

### Issue: CORS Errors
**Solution**: Set `CORS_ALLOW_ALL=true` in backend

### Issue: Environment Variables Missing
**Solution**: Add all required environment variables

## Quick Fix

If you're unsure about your backend URL:

1. **Set CORS to allow all** in backend:
   ```
   CORS_ALLOW_ALL=true
   ```

2. **Find your backend URL** in Vercel dashboard

3. **Set frontend environment variable**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.vercel.app
   ```

4. **Redeploy both frontend and backend**

## Need Help?

If you can't find your backend:
1. Check if you've deployed the backend folder to Vercel
2. Look for any backend projects in your Vercel dashboard
3. Check your deployment history
