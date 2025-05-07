import { checkConnection } from '@/app/db/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dbConnected = await checkConnection();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 