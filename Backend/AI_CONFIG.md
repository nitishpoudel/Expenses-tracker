# AI Service Configuration Guide

## Security Setup

To hide the API key from the frontend and network tab, follow these steps:

### 1. Create Environment File

Create a `.env` file in the Backend directory with the following content:

```bash
# Gemini AI API Key
GEMINI_API_KEY=AIzaSyCQ2BAKV_uv16e4H8LkQ-9F80VmriWOvg8

# Other environment variables
NODE_ENV=development
PORT=8000
MONGO_DB=your_mongodb_connection_string_here
SECRET_KEY=your_jwt_secret_key_here
```

### 2. What This Achieves

- ✅ **API Key Hidden**: The Gemini API key is no longer visible in the frontend code
- ✅ **Network Tab Clean**: API calls now go through your backend proxy endpoint
- ✅ **Secure**: API key is stored in environment variables on the server
- ✅ **Professional**: No sensitive information exposed to users

### 3. How It Works Now

1. **Frontend** → Sends message to `/api/users/ai/generate`
2. **Backend** → Receives request and adds API key from environment
3. **Backend** → Calls Gemini API with the key
4. **Backend** → Returns response to frontend
5. **User** → Sees only your backend endpoint, not the actual AI API

### 4. Benefits

- **Security**: API key is never exposed to the client
- **Control**: You can add rate limiting, authentication, etc.
- **Monitoring**: Track all AI usage through your backend
- **Professional**: Clean network tab without external API details

### 5. Testing

After setting up the `.env` file:

1. Restart your backend server
2. Test the AI chat functionality
3. Check the network tab - you'll only see calls to your backend
4. The Gemini API key will be completely hidden

### 6. Deployment

For production deployment:
- Set `GEMINI_API_KEY` in your hosting platform's environment variables
- Never commit the `.env` file to version control
- Use different API keys for development and production

## Important Notes

- The `.env` file should be in your `.gitignore`
- Restart the backend server after adding the `.env` file
- The frontend will now show connection status instead of API key status
