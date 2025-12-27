# Waitlist Email Collection Setup

## ✅ Setup Complete!

The waitlist API route has been updated to use Vercel Postgres. Follow these steps to complete the setup:

## Setting Up Vercel Postgres

### Step 1: Create Postgres Database in Vercel
1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project → Go to **Storage** tab
3. Click **"Create Database"** → Select **"Postgres"**
4. Choose a name (e.g., "labmind-db") and region (closest to your users)
5. Click **"Create"**

### Step 2: Create Waitlist Table
In the Vercel dashboard, go to **Storage → Your Database → SQL Editor** and run:

**Option A: Copy from migration file**
Open `migrations/create_waitlist_table.sql` and copy the SQL, then paste it into the SQL Editor.

**Option B: Run this SQL directly:**
```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
```

Click **"Run"** to execute the SQL.

### Step 3: Verify Code is Updated ✅
The API route (`app/api/waitlist/route.ts`) has already been updated to use Vercel Postgres. The code:
- ✅ Imports `@vercel/postgres`
- ✅ Inserts emails into the database
- ✅ Handles duplicate emails gracefully
- ✅ Returns waitlist entries via GET endpoint

### Step 4: Deploy to Production
1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Set up Vercel Postgres for waitlist"
   git push
   ```

2. Vercel will automatically:
   - Detect the `@vercel/postgres` package
   - Connect to your Postgres database
   - Deploy the updated API route

3. Test the waitlist form on your production site!

## How to Access Emails

### Option 1: Vercel Dashboard (Easiest)
1. Go to Vercel Dashboard → Your Project → Storage
2. Click on your Postgres database
3. Go to "Tables" → Select `waitlist` table
4. View all emails with timestamps
5. Export as CSV if needed

### Option 2: SQL Query in Vercel
1. Vercel Dashboard → Storage → Your Database → SQL Editor
2. Run: `SELECT * FROM waitlist ORDER BY created_at DESC;`
3. Export results

### Option 3: Create Admin Page (Optional)
I can create a simple admin page at `/admin/waitlist` to view emails (with password protection).

### Option 4: API Endpoint
After setting up Postgres, you can access emails via:
```
GET https://your-domain.vercel.app/api/waitlist
```
**Note:** Add authentication before enabling this in production!

## Email Notifications (Optional)
Want to get notified when someone joins? I can set up:
- **Resend** (free tier: 3,000 emails/month) - sends email to you
- **Vercel KV** to trigger notifications

Let me know if you want this added!

## Development vs Production
- **Development**: Emails logged to function logs (view in Vercel dashboard → Functions)
- **Production**: Use Vercel Postgres as described above


