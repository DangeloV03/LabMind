import { NextResponse } from 'next/server'

// For development: store in memory (will reset on redeploy)
// For production: use Vercel Postgres (see README.md for setup)
const waitlistEmails: string[] = []

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // TODO: Replace with Vercel Postgres (see instructions below)
    // For now, this logs to Vercel function logs which you can view in dashboard
    console.log('📧 New waitlist signup:', email, new Date().toISOString())

    // In production with Vercel Postgres, you would do:
    /*
    import { sql } from '@vercel/postgres'
    await sql`
      INSERT INTO waitlist (email, created_at)
      VALUES (${email}, NOW())
      ON CONFLICT (email) DO NOTHING
    `
    */

    // Store in memory for development (will be lost on redeploy)
    if (!waitlistEmails.includes(email)) {
      waitlistEmails.push(email)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully joined waitlist'
    })
  } catch (error) {
    console.error('Waitlist signup error:', error)
    return NextResponse.json(
      { error: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to view waitlist (for admin access)
// In production, add authentication!
export async function GET() {
  try {
    // TODO: Replace with Vercel Postgres query
    /*
    import { sql } from '@vercel/postgres'
    const result = await sql`
      SELECT email, created_at 
      FROM waitlist 
      ORDER BY created_at DESC
    `
    return NextResponse.json({ emails: result.rows })
    */

    return NextResponse.json({ 
      emails: waitlistEmails,
      count: waitlistEmails.length,
      note: 'In-memory storage - use Vercel Postgres for production'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    )
  }
}

