# Deployment Guide for Todo App

This guide will help you deploy the Todo App to Vercel with both frontend and backend components.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a MongoDB Atlas cluster for production database
3. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket

## Environment Variables Setup

### 1. MongoDB Atlas Setup
1. Create a MongoDB Atlas account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string (replace `<username>` and `<password>` with your credentials)

### 2. Vercel Environment Variables
In your Vercel dashboard, add these environment variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management?retryWrites=true&w=majority
JWT_SECRET=your-very-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-app-name.vercel.app
VITE_API_URL=https://your-app-name.vercel.app/api
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Project**:
   - Root Directory: `./` (leave empty)
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/dist`

3. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all the variables listed above

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## Project Structure for Deployment

The project is configured with the following structure:

```
├── vercel.json          # Vercel configuration
├── package.json         # Root package.json with build scripts
├── .env.production      # Production environment template
├── client/              # React frontend
│   ├── .env.production  # Client production environment
│   └── dist/           # Built frontend (generated)
└── server/             # Node.js backend
    └── src/            # Server source code
```

## Configuration Files

### vercel.json
- Configures both frontend and backend deployment
- Routes API calls to the serverless function
- Serves static files from the client build

### Environment Files
- `.env.production`: Server environment variables template
- `client/.env.production`: Client environment variables template

## Post-Deployment Steps

1. **Update CORS Configuration**:
   - Replace `your-app-name.vercel.app` with your actual Vercel domain
   - Update both server CORS settings and client API URL

2. **Test the Application**:
   - Visit your Vercel URL
   - Test user registration and login
   - Create and manage tasks
   - Verify all features work correctly

3. **Monitor Logs**:
   - Check Vercel function logs for any errors
   - Monitor database connections

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `CLIENT_URL` matches your Vercel domain
   - Check CORS configuration in `server/src/index.ts`

2. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas (allow all: 0.0.0.0/0)
   - Ensure database user has proper permissions

3. **Environment Variables**:
   - Verify all required environment variables are set in Vercel
   - Check variable names match exactly (case-sensitive)

4. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are listed in package.json
   - Verify TypeScript compilation passes

### Useful Commands

```bash
# Install all dependencies
npm run install:all

# Build for production
npm run build

# Test locally
npm run dev

# Deploy to Vercel
vercel --prod
```

## Security Considerations

1. **JWT Secret**: Use a strong, unique JWT secret for production
2. **Database Security**: Enable MongoDB Atlas IP whitelist and authentication
3. **Environment Variables**: Never commit sensitive data to version control
4. **HTTPS**: Vercel provides HTTPS by default
5. **Rate Limiting**: The app includes rate limiting middleware

## Scaling Considerations

1. **Database**: MongoDB Atlas provides automatic scaling
2. **Serverless Functions**: Vercel automatically scales based on demand
3. **CDN**: Static assets are served via Vercel's global CDN
4. **Monitoring**: Use Vercel Analytics and MongoDB Atlas monitoring

## Support

If you encounter issues:
1. Check Vercel function logs
2. Review MongoDB Atlas logs
3. Verify environment variables
4. Test API endpoints directly

For more help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)