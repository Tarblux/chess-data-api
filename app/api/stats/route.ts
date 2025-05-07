import { db } from '@/app/db/client';
import { chessStats } from '@/app/db/schema';
import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';

// POST /api/stats - Write stats
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.gameType || !body.rating) {
      return NextResponse.json(
        { error: 'gameType and rating are required' },
        { status: 400 }
      );
    }

    // Create a unique ID for the stats entry
    const statsId = `BlunderRasta_${body.gameType}_${Date.now()}`;

    // Create the stats entry
    const [stats] = await db.insert(chessStats).values({
      id: statsId,
      playerId: 'BlunderRasta',
      gameType: body.gameType,
      rating: body.rating,
      wins: body.wins || 0,
      losses: body.losses || 0,
      draws: body.draws || 0,
      rawData: body.rawData || null,
    }).returning();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error creating stats:', error);
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return NextResponse.json(
      { error: 'Failed to create stats', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/stats - Get my stats
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameType = searchParams.get('gameType');

    // Build the query with all conditions at once
    const stats = await db
      .select()
      .from(chessStats)
      .where(
        gameType 
          ? and(
              eq(chessStats.playerId, 'BlunderRasta'),
              eq(chessStats.gameType, gameType)
            )
          : eq(chessStats.playerId, 'BlunderRasta')
      )
      .orderBy(chessStats.lastUpdated)
      .limit(10);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 