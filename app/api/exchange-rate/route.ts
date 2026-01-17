import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const target = searchParams.get('target');
  const amount = searchParams.get('amount') || '1';

  if (!target) {
    return NextResponse.json({ error: 'Missing target currency' }, { status: 400 });
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const url = `http://api.exchangerate.host/live?access_key=${apiKey}&source=SGD&currencies=${encodeURIComponent(target)}&format=1`;
    const res = await fetch(url);
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Exchange rate API failed' }, { status: 502 });
    }
    
    const data = await res.json();
    const quoteKey = `SGD${target.toUpperCase()}`;
    
    if (data && data.quotes && typeof data.quotes[quoteKey] === 'number') {
      const rate = data.quotes[quoteKey];
      const convertedAmount = rate * parseFloat(amount);
      return NextResponse.json({ rate, convertedAmount });
    }
    
    return NextResponse.json({ error: 'Invalid response from exchange API' }, { status: 502 });
  } catch (err) {
    console.error('Exchange rate fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
