// Netlify Function to get form submission count
// This requires Netlify API access token to be set as environment variable

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // You need to set NETLIFY_API_TOKEN in your Netlify environment variables
    const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;
    const SITE_ID = process.env.SITE_ID;
    
    if (!NETLIFY_API_TOKEN || !SITE_ID) {
      console.log('Missing environment variables');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ count: 0, message: 'Config pending' })
      };
    }

    // Fetch form submissions from Netlify API
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${SITE_ID}/submissions`,
      {
        headers: {
          'Authorization': `Bearer ${NETLIFY_API_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Netlify API error: ${response.status}`);
    }

    const submissions = await response.json();
    
    // Filter for techie-taboo-waitlist form
    const waitlistSubmissions = submissions.filter(
      sub => sub.form_name === 'techie-taboo-waitlist'
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        count: waitlistSubmissions.length,
        message: 'Success'
      })
    };

  } catch (error) {
    console.error('Error fetching submissions:', error);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        count: 0, 
        message: 'Error fetching count',
        error: error.message 
      })
    };
  }
};
