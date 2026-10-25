# Deployment Strategy: Separate Vercel Admin URL

This guide explains how to deploy the admin component separately on Vercel to obtain a distinct admin URL, while maintaining security and proper routing.

## Overview

The admin component can be deployed in two ways:
1. **Integrated approach**: Admin is part of the main frontend application (current setup)
2. **Separate approach**: Admin has its own Vercel deployment with a unique URL

This guide focuses on the **separate deployment** approach.

## Prerequisites

- Vercel account
- Node.js installed
- Git configured

## Step 1: Create Admin Directory Structure

Create a separate directory for the admin frontend:

```bash
mkdir statestreet-admin
cd statestreet-admin
# Copy the necessary frontend files:
# - src/pages/AdminLoginPage.tsx
# - src/pages/AdminDashboardPage.tsx  
# - src/pages/AdminSupportPage.tsx
# - src/pages/AdminChatPage.tsx
# - src/components/ (any shared components)
# - package.json (with react, @mui, etc.)
# - vite.config.ts
# - tsconfig.json
# - tailwind.config.js (if used)
# - index.html (if using CRA or custom setup)
```

## Step 2: Set up package.json

Create a minimal package.json:

```json
{
  "name": "statestreet-admin",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "npx tsc -b && vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@emotion/react": "^11.11.10",
    "@emotion/styled": "^11.11.10",
    "@mui/material": "^5.16.0",
    "@mui/icons-material": "^5.16.0",
    "react-router-dom": "^7.18.1"
  },
  "devDependencies": {
    "@types/node": "^24.13.2",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@vitejs/plugin-react": "^6.0.3",
    "oxlint": "^1.71.0",
    "typescript": "~6.0.2",
    "vite": "^8.1.1"
  }
}
```

## Step 3: Create vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000
  }
})
```

## Step 4: Configure vercel.json for Admin

Create `vercel.json` in the admin directory:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://statestreet-production-url.up.railway.app/api/:path*"
    },
    {
      "source": "/login",
      "destination": "/src/pages/AdminLoginPage.tsx"
    },
    {
      "source": "/dashboard",
      "destination": "/src/pages/AdminDashboardPage.tsx"
    },
    {
      "source": "/support",
      "destination": "/src/pages/AdminSupportPage.tsx"
    },
    {
      "source": "/chat",
      "destination": "/src/pages/AdminChatPage.tsx"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Admin-Panel",
          "value": "true"
        }
      ]
    }
  ]
}
```

*Note: The API destination should point to your existing backend (Koyeb, Railway, or other hosting).*

## Step 5: Environment Variables

Create `.env.local` file:

```
VITE_API_URL=https://your-backend-url.com/api/v1
ADMIN_PASSWORD=states26investment
```

## Step 6: Deploy to Vercel

### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Initialize project
vercel init

# Set environment variables
vercel env add VITE_API_URL production
vercel env add ADMIN_PASSWORD production

# Deploy
vercel --prod
```

### Option B: GitHub Integration

1. Push the admin folder to a GitHub repository
2. Connect the repository to Vercel
3. Set environment variables in the Vercel dashboard
4. Deploy automatically on push

## Step 7: Update Main Application

Update the main `App.tsx` to redirect to the separate admin URL:

```typescript
// In main App.tsx, replace admin routes
<Route path="/admin/login" element={<Navigate to="https://your-admin-vercel-url/login" replace />} />
<Route path="/admin/dashboard" element={<Navigate to="https://your-admin-vercel-url/dashboard" replace />} />
```

Or implement redirect in the admin login:

```typescript
// AdminLoginPage.tsx - after successful login
localStorage.setItem('adminToken', data.token)
window.location.href = 'https://your-admin-vercel-url/dashboard'
```

## Step 8: Security Considerations

1. **Admin Password**: The password `states26investment` is implemented in the AdminLoginPage
2. **API Protection**: Ensure the backend API has proper admin authentication middleware
3. **HTTPS**: Always use HTTPS for the admin URL
4. **Rate Limiting**: Implement rate limiting on admin login attempts
5. **Session Management**: Use secure cookies or JWT with proper expiration

## Step 9: Maintenance

- Update the admin frontend when the main frontend changes
- Sync the admin password if changed in the backend
- Monitor Vercel analytics for the admin deployment
- Set up custom domain if desired (e.g., admin.statestreetinvestment.com)

## Current Implementation Status

The admin password protection is already implemented in `frontend/src/pages/AdminLoginPage.tsx` with password `states26investment`. The admin routes are defined in `frontend/src/App.tsx` at `/admin/login` and `/admin/dashboard`.

For separate Vercel deployment, follow the steps above to create a dedicated admin URL while maintaining the password protection security layer.