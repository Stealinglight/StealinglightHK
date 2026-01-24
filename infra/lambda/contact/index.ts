import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

const ses = new SESClient({ region: 'us-west-2' });

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitize(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

function getCorsHeaders(origin: string | undefined): Record<string, string> {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const origin = event.headers?.origin;
  const corsHeaders = getCorsHeaders(origin);

  // Handle preflight
  if (event.requestContext.http.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // Parse and validate body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing request body' }),
      };
    }

    const data: ContactFormData = JSON.parse(event.body);

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    // Validate email format
    if (!isValidEmail(data.email)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Sanitize inputs
    const name = sanitize(data.name);
    const email = sanitize(data.email);
    const subject = sanitize(data.subject);
    const message = sanitize(data.message);

    // Length limits
    if (name.length > 100 || email.length > 254 || subject.length > 200 || message.length > 5000) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Input exceeds maximum length' }),
      };
    }

    const fromEmail = process.env.FROM_EMAIL!;
    const toEmail = process.env.TO_EMAIL!;

    // Send email via SES
    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [toEmail],
      },
      ReplyToAddresses: [email],
      Message: {
        Subject: {
          Data: `[Stealinglight Contact] ${subject}`,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: `New message from your portfolio contact form:\n\n` +
              `Name: ${name}\n` +
              `Email: ${email}\n` +
              `Subject: ${subject}\n\n` +
              `Message:\n${message}\n\n` +
              `---\nSent from stealinglight.hk contact form`,
            Charset: 'UTF-8',
          },
          Html: {
            Data: `
              <h2>New Contact Form Submission</h2>
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br />')}</p>
              <hr />
              <p style="color: #666; font-size: 12px;">Sent from stealinglight.hk contact form</p>
            `,
            Charset: 'UTF-8',
          },
        },
      },
    });

    await ses.send(command);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Message sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to send message. Please try again later.' }),
    };
  }
}
