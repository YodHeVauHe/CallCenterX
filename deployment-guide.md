# Edge Functions Deployment Guide

## 🚀 Deploying Edge Functions to Supabase

Your Edge Functions are ready to be deployed! Follow these steps to deploy them to your Supabase project:

### Prerequisites
1. **Supabase CLI installed** - [Install Guide](https://supabase.com/docs/guides/cli)
2. **Supabase project created** - [Create Project](https://supabase.com/dashboard)
3. **Environment variables set** in your Supabase project

### Step 1: Initialize Supabase Project
```bash
# Login to Supabase
supabase login

# Link to your existing project
supabase link --project-ref YOUR_PROJECT_REF
```

### Step 2: Deploy Database Migrations
```bash
# Apply the auth trigger migration
supabase db push
```

### Step 3: Deploy Edge Functions
```bash
# Deploy the login function
supabase functions deploy login

# Deploy the register function
supabase functions deploy register
```

### Step 4: Set Environment Variables
In your Supabase Dashboard → Settings → Edge Functions, set:
- `SUPABASE_URL` (automatically available)
- `SUPABASE_SERVICE_ROLE_KEY` (from Settings → API)

### Step 5: Test the Functions
```bash
# Test login function
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/login' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"password123"}'

# Test register function
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/register' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"admin"}'
```

## 🔧 Environment Variables Required

Make sure these are set in your `.env` file:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 📋 Function Endpoints

Once deployed, your functions will be available at:
- **Login**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/login`
- **Register**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/register`

## 🔐 Security Features

✅ **Server-side authentication** - All auth logic runs securely on Edge Functions
✅ **Automatic profile creation** - Database trigger creates profiles for new users
✅ **Role-based access** - Users assigned roles during registration
✅ **Session management** - Proper Supabase session handling
✅ **Error handling** - Comprehensive error responses
✅ **CORS support** - Cross-origin requests properly handled

## 🐛 Troubleshooting

### Common Issues:
1. **Function not found**: Ensure functions are deployed with correct names
2. **Environment variables**: Check all required env vars are set
3. **Database permissions**: Ensure service role key has proper permissions
4. **CORS errors**: Functions include proper CORS headers

### Logs:
```bash
# View function logs
supabase functions logs login
supabase functions logs register
```

## ✅ Verification

After deployment, test the authentication flow:
1. Try registering a new user
2. Try logging in with the new user
3. Check that profiles are created in the database
4. Verify role-based redirects work correctly

Your authentication system is now fully deployed and secure! 🎉