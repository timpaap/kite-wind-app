import { NextResponse } from 'next/server';

export async function GET() {
  const yrUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=52.3745&lon=4.5305';

  const response = await fetch(yrUrl, {
    headers: {
      'User-Agent': 'kite-wind-app (your-email@example.com)',
      'Accept': 'application/json',
    },
    next: {
      revalidate: 600,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: 'Yr.no fetch failed', details: errorText }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
