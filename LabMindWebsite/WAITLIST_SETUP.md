# Waitlist Email Collection Setup

## Current Setup
The waitlist form currently stores emails in-memory (function logs) for development. For production, set up Vercel Postgres to permanently store emails.

## Setting Up Vercel Postgres (Recommended)

### Step 1: Create Postgres Database
1. Go to your Vercel dashboard → Your Project → Storage tab
2. Click "Create Database" → Select "Postgres"
3. Choose a name (e.g., "labmind-db") and region
4. Click "Create"

### Step 2: Create Waitlist Table
In the Vercel dashboard, go to Storage → Your Database → SQL Editor and run:

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at DESC);
```

### Step 3: Install Dependencies
```bash
npm install @vercel/postgres
```

### Step 4: Update API Route
Uncomment the Vercel Postgres code in `app/api/waitlist/route.ts`:

```typescript
import { sql } from '@vercel/postgres'

// In POST handler, replace the console.log with:
await sql`
  INSERT INTO waitlist (email, created_at)
  VALUES (${email}, NOW())
  ON CONFLICT (email) DO NOTHING
`

// In GET handler, replace waitlistEmails with:
const result = await sql`
  SELECT email, created_at 
  FROM waitlist 
  ORDER BY created_at DESC
`
return NextResponse.json({ emails: result.rows })
```

### Step 5: Deploy
Push your changes and Vercel will automatically connect to your database.

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


