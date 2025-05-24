import { NextResponse } from 'next/server';
import axios from 'axios';

const CHESS_API_BASE = 'https://api.chess.com/pub';
const USERNAME = 'BlunderRasta';

export async function GET() {
  try {
    const response = await axios.get(`${CHESS_API_BASE}/player/${USERNAME}`);
    const { last_online } = response.data;
    const lastOnlineDate = last_online ? new Date(last_online * 1000).toISOString() : null;
    return NextResponse.json({
      username: USERNAME,
      last_online,
      last_online_date: lastOnlineDate
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch last_online data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 