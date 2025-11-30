// netlify/functions/verify-payment.js
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    let reference = null;

    // Accept both GET and POST
    if (event.httpMethod === "GET") {
      reference = event.queryStringParameters?.reference;
    } else {
      const body = event.body ? JSON.parse(event.body) : {};
      reference = body.reference;
    }

    if (!reference) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "missing reference" }),
      };
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "server misconfigured: missing PAYSTACK_SECRET_KEY",
        }),
      };
    }

    const resp = await fetch(
      "https://api.paystack.co/transaction/verify/" +
        encodeURIComponent(reference),
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + secret,
          "Content-Type": "application/json",
        },
      }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      return {
        statusCode: resp.status,
        body: JSON.stringify({
          error: "paystack-verification-failed",
          details: txt,
        }),
      };
    }

    const data = await resp.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "verification failed",
        detail: String(err),
      }),
    };
  }
};
