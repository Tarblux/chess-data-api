import { NextResponse } from 'next/server';
import axios from 'axios';

// Official docs: https://www.chess.com/news/view/published-data-api#pubapi-endpoint-player
const CHESS_API_BASE = 'https://api.chess.com/pub';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Missing username parameter' }, { status: 400 });
  }

  try {
    // Username must be lowercased for the Chess.com API
    const response = await axios.get(`${CHESS_API_BASE}/player/${encodeURIComponent(username.toLowerCase())}`);
    const { country } = response.data;
    if (!country) {
      return NextResponse.json({ error: 'Country not found for this user' }, { status: 404 });
    }
    // Extract country code from the country URL
    const countryCode = country.split('/').pop();
    return NextResponse.json({ country_url: country, country_code: countryCode });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch player country', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 