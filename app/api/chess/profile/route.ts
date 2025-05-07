import { NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/app/db/client';
import { chessProfile, chessStats } from '@/app/db/schema';

const CHESS_API_BASE = 'https://api.chess.com/pub';

interface ChessStats {
  last?: { rating: number };
  record?: {
    win: number;
    loss: number;
    draw: number;
  };
}

interface ChessProfile {
  name: string;
  title?: string;
  country?: string;
  location?: string;
  bio?: string;
  avatar?: string;
}

export async function GET() {
  try {
    const username = 'BlunderRasta';
    
    // Fetch profile data from chess.com
    const [profileResponse, statsResponse] = await Promise.all([
      axios.get<ChessProfile>(`${CHESS_API_BASE}/player/${username}`),
      axios.get<Record<string, ChessStats>>(`${CHESS_API_BASE}/player/${username}/stats`)
    ]);

    const profileData = profileResponse.data;
    const statsData = statsResponse.data;

    // Store profile data
    const profile = await db.insert(chessProfile)
      .values({
        id: username,
        username: username,
        name: profileData.name,
        title: profileData.title || null,
        country: profileData.country || null,
        location: profileData.location || null,
        bio: profileData.bio || null,
        avatar: profileData.avatar || null,
        rawData: profileData
      })
      .onConflictDoUpdate({
        target: chessProfile.id,
        set: {
          name: profileData.name,
          title: profileData.title || null,
          country: profileData.country || null,
          location: profileData.location || null,
          bio: profileData.bio || null,
          avatar: profileData.avatar || null,
          rawData: profileData,
          lastUpdated: new Date()
        }
      })
      .returning();

    // Store stats data for each game type
    const statsPromises = Object.entries(statsData).map(async ([gameType, stats]) => {
      if (typeof stats === 'object' && stats !== null) {
        return db.insert(chessStats)
          .values({
            id: `${username}_${gameType}`,
            playerId: username,
            gameType,
            rating: stats.last?.rating || null,
            wins: stats.record?.win || 0,
            losses: stats.record?.loss || 0,
            draws: stats.record?.draw || 0,
            rawData: stats
          })
          .onConflictDoUpdate({
            target: chessStats.id,
            set: {
              rating: stats.last?.rating || null,
              wins: stats.record?.win || 0,
              losses: stats.record?.loss || 0,
              draws: stats.record?.draw || 0,
              rawData: stats,
              lastUpdated: new Date()
            }
          })
          .returning();
      }
      return undefined;
    });

    const stats = await Promise.all(statsPromises.filter(Boolean));

    return NextResponse.json({
      status: 'success',
      data: {
        profile: profile[0],
        stats: stats.flat()
      }
    });

  } catch (error) {
    console.error('Error fetching chess.com data:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch chess.com data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 