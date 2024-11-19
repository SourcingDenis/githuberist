import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  // Handle both POST and GET requests
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Extract the code based on the request method
    const code =
      event.httpMethod === 'POST'
        ? JSON.parse(event.body || '{}').code
        : event.queryStringParameters?.code;

    if (!code) {
      return {
        statusCode: 400,
        body: 'Bad Request: Missing code parameter',
      };
    }

    // Exchange the code for an access token
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error_description || 'Failed to retrieve access token' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data), // Return access token and additional info
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export { handler };
