const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: process.env.AWS_REGION });
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(',');

// Sanitize user input to prevent HTML injection
const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);
  const sourceIp = event.requestContext?.identity?.sourceIp || 'unknown';

  const baseHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Strict CORS: reject requests from unknown origins
  if (!isAllowedOrigin) {
    return {
      statusCode: 403,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'CORS origin not allowed' }),
    };
  }

  const headers = {
    ...baseHeaders,
    'Access-Control-Allow-Origin': origin,
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Note: Rate limiting is handled by API Gateway (throttlingRateLimit/throttlingBurstLimit)
  // This provides reliable, infrastructure-level protection that works across Lambda instances

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, message, subject } = body;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: name, email, message' }),
      };
    }

    // Simple email validation - intentionally basic for a contact form
    // More complex validation could reject valid emails; SES will reject invalid addresses at send time
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    const MAX_NAME_LENGTH = 200;
    const MAX_SUBJECT_LENGTH = 200;
    const MAX_MESSAGE_LENGTH = 5000;

    const lengthErrors = [];
    if (name.length > MAX_NAME_LENGTH) lengthErrors.push(`name (max ${MAX_NAME_LENGTH} chars)`);
    if (message.length > MAX_MESSAGE_LENGTH) lengthErrors.push(`message (max ${MAX_MESSAGE_LENGTH} chars)`);
    if (subject && subject.length > MAX_SUBJECT_LENGTH) lengthErrors.push(`subject (max ${MAX_SUBJECT_LENGTH} chars)`);
    if (lengthErrors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: `Field(s) exceed maximum length: ${lengthErrors.join(', ')}` }),
      };
    }

    // Sanitize inputs for email subject and HTML body
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const safeSubject = subject ? escapeHtml(subject) : null;

    const emailSubject = safeSubject || `Contact Form: ${safeName}`;

    await ses.send(new SendEmailCommand({
      Source: CONTACT_EMAIL,
      Destination: { ToAddresses: [CONTACT_EMAIL] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: emailSubject },
        Body: {
          Text: {
            Data: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          },
          Html: {
            Data: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${safeName}</p>
              <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              <h3>Message:</h3>
              <p>${safeMessage.replace(/\n/g, '<br>')}</p>
            `,
          },
        },
      },
    }));

    // Log successful submission for monitoring
    console.log(JSON.stringify({
      event: 'contact_form_submission',
      sourceIp,
      replyToEmail: email,
      timestamp: new Date().toISOString(),
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Message sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send message' }),
    };
  }
};
