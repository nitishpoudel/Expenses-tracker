# CORS Troubleshooting Guide

## Current Issue
Frontend at `https://expenses-tracker-5acj.vercel.app` is blocked by CORS policy when trying to access backend.

## Quick Fix

### Option 1: Allow All Origins (Temporary)
Set this environment variable in your backend Vercel project:
```
CORS_ALLOW_ALL=true
```

### Option 2: Set Correct CORS Origins
Set this environment variable in your backend Vercel project:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://expenses-tracker-brown-eta.vercel.app,https://expenses-tracker-5acj.vercel.app
```

## Environment Variables for Backend

In your **backend** Vercel project settings, add:

1. **MONGO_DB**: Your MongoDB connection string
2. **NODE_ENV**: `production`
3. **CORS_ORIGINS**: `http://localhost:5173,http://localhost:5174,https://expenses-tracker-brown-eta.vercel.app,https://expenses-tracker-5acj.vercel.app`
4. **CORS_ALLOW_ALL**: `false` (or `true` for testing)

## Environment Variables for Frontend

In your **frontend** Vercel project settings, add:

1. **VITE_API_BASE_URL**: Your backend Vercel URL (e.g., `https://expenses-tracker-backend.vercel.app`)

## Testing Steps

1. **Test Backend Health**: Visit `https://your-backend-url.vercel.app/api/health`
2. **Test CORS**: Visit `https://your-backend-url.vercel.app/api/cors-test`
3. **Test from Frontend**: Try logging in from your frontend

## Debugging

If CORS still fails:

1. Check the browser console for the exact error
2. Check the backend logs in Vercel dashboard
3. Verify that your backend URL is correct in the frontend
4. Make sure both frontend and backend are deployed on Vercel

## Common Issues

1. **Wrong Backend URL**: Make sure the frontend is pointing to the correct backend URL
2. **Environment Variables Not Set**: Check Vercel dashboard for both projects
3. **Deployment Issues**: Make sure both projects are properly deployed

## Quick Test

To quickly test if CORS is working, you can temporarily set:
```
CORS_ALLOW_ALL=true
```

This will allow all origins and help identify if the issue is CORS-related or something else.
