# Testing Waitlist in Production

## Pre-Deployment Checklist

Before testing in production, ensure:

- [ ] Vercel Postgres database is created
- [ ] Waitlist table is created (run `migrations/create_waitlist_table.sql`)
- [ ] Code changes are committed and pushed
- [ ] Deployment is successful (check Vercel dashboard)

## Testing Steps

### 1. Test Waitlist Signup (POST)

**Using curl:**
```bash
curl -X POST https://your-domain.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully joined waitlist"
}
```

**Using browser console:**
```javascript
fetch('/api/waitlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
})
.then(r => r.json())
.then(console.log)
```

### 2. Test Duplicate Email Handling

Try submitting the same email twice:
```bash
# First submission
curl -X POST https://your-domain.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"duplicate@example.com"}'

# Second submission (should succeed but not create duplicate)
curl -X POST https://your-domain.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"duplicate@example.com"}'
```

Both should return success, but only one entry should exist in the database.

### 3. Test Email Validation

**Invalid email formats:**
```bash
# Missing @
curl -X POST https://your-domain.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"invalidemail.com"}'

# Missing domain
curl -X POST https://your-domain.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@"}'

# Empty email
curl -X POST https://your-domain.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":""}'
```

All should return `400 Bad Request` with error message.

### 4. Test Viewing Waitlist (GET)

**Using curl:**
```bash
curl https://your-domain.vercel.app/api/waitlist
```

**Expected Response:**
```json
{
  "emails": [
    {
      "email": "test@example.com",
      "created_at": "2024-12-27T19:30:00.000Z"
    }
  ],
  "count": 1
}
```

**⚠️ Security Note:** The GET endpoint is currently unauthenticated. Consider adding authentication before enabling in production, or remove it entirely if you only need to view emails via the Vercel dashboard.

### 5. Verify in Vercel Dashboard

1. Go to **Vercel Dashboard → Your Project → Storage**
2. Click on your Postgres database
3. Go to **Tables → waitlist**
4. Verify that test emails appear with correct timestamps

### 6. Test Frontend Form

1. Visit your production site
2. Find the waitlist form
3. Enter a test email
4. Submit the form
5. Verify success message appears
6. Check Vercel dashboard to confirm email was saved

## Common Issues & Solutions

### Issue: "relation 'waitlist' does not exist"
**Solution:** Run the SQL migration in Vercel Dashboard → Storage → SQL Editor

### Issue: "Cannot read properties of null"
**Solution:** Ensure Vercel Postgres database is properly connected. Check environment variables in Vercel dashboard.

### Issue: API returns 500 error
**Solution:** 
1. Check Vercel function logs (Dashboard → Functions → View Logs)
2. Verify database connection
3. Ensure table exists

### Issue: Emails not appearing in database
**Solution:**
1. Check Vercel function logs for errors
2. Verify SQL query syntax
3. Check database connection status

## Production Monitoring

### View Function Logs
1. Vercel Dashboard → Your Project → Functions
2. Click on `/api/waitlist` function
3. View real-time logs

### Monitor Database
1. Vercel Dashboard → Storage → Your Database
2. View table data, query performance, and connection status

## Next Steps

After successful testing:
- [ ] Monitor for any errors in production
- [ ] Set up email notifications (optional)
- [ ] Add authentication to GET endpoint (if needed)
- [ ] Consider rate limiting to prevent abuse
- [ ] Set up analytics to track signups

