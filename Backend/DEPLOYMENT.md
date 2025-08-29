# Vercel Deployment Troubleshooting Guide

## Current Issue
The serverless function is crashing with `FUNCTION_INVOCATION_FAILED` error.

## Step-by-Step Testing

### 1. Test Simple Function First
Deploy with the current `vercel.json` that uses `api/simple.js`. This should work as it has no external dependencies.

Test endpoints:
- `https://your-app.vercel.app/api/health`
- `https://your-app.vercel.app/` (any path)

### 2. If Simple Function Works
The issue is with the main application. Check:

1. **Environment Variables**: Make sure these are set in Vercel:
   - `MONGO_DB`: Your MongoDB connection string
   - `NODE_ENV`: `production`

2. **Database Connection**: The MongoDB connection might be failing. Try:
   - Check if your MongoDB Atlas cluster allows connections from Vercel's IP ranges
   - Make sure the connection string is correct
   - Test the connection string locally

### 3. If Simple Function Fails
The issue is with the basic setup. Check:

1. **Package.json**: Make sure all dependencies are compatible
2. **Node.js Version**: Vercel might be using a different Node.js version
3. **File Structure**: Ensure all files are in the correct locations

## Environment Variables Setup

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add these variables:
   ```
   MONGO_DB=your_mongodb_connection_string
   NODE_ENV=production
   CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://expenses-tracker-brown-eta.vercel.app,https://expenses-tracker-5acj.vercel.app
   CORS_ALLOW_ALL=false
   ```

## Testing Commands

After deployment, test these endpoints:

```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Test any endpoint
curl https://your-app.vercel.app/

# Test with POST
curl -X POST https://your-app.vercel.app/api/test
```

## Common Issues and Solutions

1. **Database Connection Timeout**: MongoDB Atlas might block connections from Vercel
   - Solution: Add Vercel's IP ranges to MongoDB Atlas whitelist
   - Or use MongoDB Atlas with "Allow access from anywhere" (0.0.0.0/0)

2. **Environment Variables Not Set**: Check Vercel dashboard
   - Make sure variables are set for "Production" environment

3. **Dependencies Issues**: Some packages might not work in serverless
   - Solution: Use compatible versions or find alternatives

## Next Steps

1. Deploy with current simple function
2. Test the health endpoint
3. If it works, gradually add back the main application
4. If it fails, check the Vercel logs for specific error messages
