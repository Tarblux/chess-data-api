import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`SELECT NOW()`;
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection successful',
      timestamp: result[0].now 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 