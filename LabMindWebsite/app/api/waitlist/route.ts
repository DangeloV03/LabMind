import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

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

    // Insert email into Vercel Postgres
    // ON CONFLICT ensures we don't add duplicate emails
    await sql`
      INSERT INTO waitlist (email, created_at)
      VALUES (${email.toLowerCase().trim()}, NOW())
      ON CONFLICT (email) DO NOTHING
    `

    console.log('📧 New waitlist signup:', email, new Date().toISOString())

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
// TODO: In production, add authentication!
export async function GET() {
  try {
    const result = await sql`
      SELECT email, created_at 
      FROM waitlist 
      ORDER BY created_at DESC
    `
    
    return NextResponse.json({ 
      emails: result.rows,
      count: result.rows.length
    })
  } catch (error) {
    console.error('Waitlist fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    )
  }
}


