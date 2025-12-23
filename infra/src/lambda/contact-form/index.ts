import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: process.env.AWS_REGION || 'us-west-2' });

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  source: 'creative' | 'security';
  serviceType?: string;
  // Honeypot field - should be empty if legitimate
  website?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate form data
function validateFormData(data: Partial<ContactFormData>): ValidationResult {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email address is required');
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message is required and must be at least 10 characters');
  }

  if (!data.source || !['creative', 'security'].includes(data.source)) {
    errors.push('Valid source (creative or security) is required');
  }

  // Honeypot check - if website field is filled, it's likely spam
  if (data.website && data.website.trim().length > 0) {
    errors.push('Spam detected');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Build email subject based on source and form data
function buildSubject(data: ContactFormData): string {
  const prefix = data.source === 'creative' ? '[Creative]' : '[Security]';
  const subject = data.subject || 'Contact Form Submission';
  return `${prefix} ${subject}`;
}

// Build email body
function buildEmailBody(data: ContactFormData): string {
  const lines = [
    `New contact form submission from ${data.source}.stealinglight.hk`,
    '',
    '---',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
  ];

  if (data.source === 'security' && data.serviceType) {
    lines.push(`Service Type: ${data.serviceType}`);
  }

  if (data.subject) {
    lines.push(`Subject: ${data.subject}`);
  }

  lines.push('', 'Message:', '', data.message, '', '---', '', `Submitted at: ${new Date().toISOString()}`);

  return lines.join('\n');
}

// Build HTML email body
function buildHtmlEmailBody(data: ContactFormData): string {
  const serviceTypeRow =
    data.source === 'security' && data.serviceType
      ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Service Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.serviceType)}</td></tr>`
      : '';

  const subjectRow = data.subject
    ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.subject)}</td></tr>`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: ${data.source === 'creative' ? '#e74c3c' : '#00d4aa'}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">From ${data.source}.stealinglight.hk</p>
  </div>
  
  <div style="background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(data.name)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
      </tr>
      ${serviceTypeRow}
      ${subjectRow}
    </table>
    
    <div style="margin-top: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #555;">Message:</h3>
      <div style="background: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
    </div>
  </div>
  
  <div style="background: #333; color: #999; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; text-align: center;">
    Submitted at ${new Date().toISOString()}
  </div>
</body>
</html>
`;
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const data: Partial<ContactFormData> = JSON.parse(event.body);

    // Validate form data
    const validation = validateFormData(data);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Validation failed',
          details: validation.errors,
        }),
      };
    }

    const formData = data as ContactFormData;

    // Get destination email from environment
    const toEmail = process.env.CONTACT_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@stealinglight.hk';

    if (!toEmail) {
      // eslint-disable-next-line no-console
      console.error('CONTACT_EMAIL environment variable not set');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Send email via SES
    const sendCommand = new SendEmailCommand({
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: {
          Data: buildSubject(formData),
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: buildEmailBody(formData),
            Charset: 'UTF-8',
          },
          Html: {
            Data: buildHtmlEmailBody(formData),
            Charset: 'UTF-8',
          },
        },
      },
      Source: fromEmail,
      ReplyToAddresses: [formData.email],
    });

    await ses.send(sendCommand);

    // Don't log PII - only log metadata
    // eslint-disable-next-line no-console
    console.log(`Contact form submitted successfully from ${formData.source}`);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Your message has been sent successfully',
      }),
    };
  } catch (error) {
    // Log error without PII
    // eslint-disable-next-line no-console
    console.error('Error processing contact form:', error instanceof Error ? error.message : 'Unknown error');

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to process your request. Please try again later.',
      }),
    };
  }
};
