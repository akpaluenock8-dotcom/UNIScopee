
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const reference = body.reference;
    if (!reference) {
      return { statusCode: 400, body: JSON.stringify({ error: 'missing reference' }) };
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return { statusCode: 500, body: JSON.stringify({ error: 'server misconfigured: missing PAYSTACK_SECRET_KEY' }) };
    }

    const resp = await fetch('https://api.paystack.co/transaction/verify/' + encodeURIComponent(reference), {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + secret,
        'Content-Type': 'application/json'
      }
    });

    const data = await resp.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'verification failed', detail: String(err) }) };
  }
};
