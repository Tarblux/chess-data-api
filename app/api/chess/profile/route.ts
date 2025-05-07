import { NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/app/db/client';
import { chessProfile, chessStats } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

const CHESS_API_BASE = 'https://api.chess.com/pub';

export async function GET() {
  try {
    const username = 'BlunderRasta';
    
    // Fetch profile data from chess.com
    const [profileResponse, statsResponse] = await Promise.all([
      axios.get(`${CHESS_API_BASE}/player/${username}`),
      axios.get(`${CHESS_API_BASE}/player/${username}/stats`)
    ]);

    const profileData = profileResponse.data;
    const statsData = statsResponse.data;

    // Store profile data
    const profile = await db.insert(chessProfile)
      .values({
        id: username,
        username: username,
        name: profileData.name,
        title: profileData.title,
        country: profileData.country,
        location: profileData.location,
        bio: profileData.bio,
        avatar: profileData.avatar,
        rawData: profileData
      })
      .onConflictDoUpdate({
        target: chessProfile.id,
        set: {
          name: profileData.name,
          title: profileData.title,
          country: profileData.country,
          location: profileData.location,
          bio: profileData.bio,
          avatar: profileData.avatar,
          rawData: profileData,
          lastUpdated: new Date()
        }
      })
      .returning();

    // Store stats data for each game type
    const statsPromises = Object.entries(statsData).map(async ([gameType, stats]: [string, any]) => {
      if (typeof stats === 'object' && stats !== null) {
        return db.insert(chessStats)
          .values({
            id: `${username}_${gameType}`,
            playerId: username,
            gameType,
            rating: stats.last?.rating,
            wins: stats.record?.win,
            losses: stats.record?.loss,
            draws: stats.record?.draw,
            rawData: stats
          })
          .onConflictDoUpdate({
            target: chessStats.id,
            set: {
              rating: stats.last?.rating,
              wins: stats.record?.win,
              losses: stats.record?.loss,
              draws: stats.record?.draw,
              rawData: stats,
              lastUpdated: new Date()
            }
          })
          .returning();
      }
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