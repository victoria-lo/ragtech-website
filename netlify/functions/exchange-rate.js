exports.handler = async (event) => {
  const { target, amount = '1' } = event.queryStringParameters || {};

  if (!target) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing target currency' }),
    };
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' }),
    };
  }

  try {
    const url = `http://api.exchangerate.host/live?access_key=${apiKey}&source=SGD&currencies=${encodeURIComponent(target)}&format=1`;
    const res = await fetch(url);
    
    if (!res.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Exchange rate API failed' }),
      };
    }
    
    const data = await res.json();
    const quoteKey = `SGD${target.toUpperCase()}`;
    
    if (data && data.quotes && typeof data.quotes[quoteKey] === 'number') {
      const rate = data.quotes[quoteKey];
      const convertedAmount = rate * parseFloat(amount);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rate, convertedAmount }),
      };
    }
    
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Invalid response from exchange API' }),
    };
  } catch (err) {
    console.error('Exchange rate fetch error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
