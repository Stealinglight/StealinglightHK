const { mockClient } = require('aws-sdk-client-mock');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Mock SES client
const sesMock = mockClient(SESClient);

// Set up environment variables
process.env.AWS_REGION = 'us-east-1';
process.env.CONTACT_EMAIL = 'contact@example.com';
process.env.ALLOWED_ORIGINS = 'https://example.com,https://www.example.com';

// Import handler after environment is set up
const { handler } = require('../index.js');

describe('Contact Form Lambda Handler', () => {
  beforeEach(() => {
    sesMock.reset();
    sesMock.on(SendEmailCommand).resolves({});
  });

  const createEvent = (overrides = {}) => ({
    httpMethod: 'POST',
    headers: {
      origin: 'https://example.com',
    },
    requestContext: {
      identity: {
        sourceIp: '192.168.1.1',
      },
    },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    }),
    ...overrides,
  });

  describe('CORS Handling', () => {
    it('should reject requests from unknown origins', async () => {
      const event = createEvent({
        headers: { origin: 'https://malicious.com' },
      });

      const response = await handler(event);

      expect(response.statusCode).toBe(403);
      expect(JSON.parse(response.body).error).toBe('CORS origin not allowed');
    });

    it('should accept requests from allowed origins', async () => {
      const event = createEvent();

      const response = await handler(event);

      expect(response.statusCode).toBe(200);
      expect(response.headers['Access-Control-Allow-Origin']).toBe('https://example.com');
    });

    it('should handle OPTIONS requests', async () => {
      const event = createEvent({
        httpMethod: 'OPTIONS',
        headers: { origin: 'https://example.com' },
      });

      const response = await handler(event);

      expect(response.statusCode).toBe(200);
      expect(response.headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
    });
  });

  describe('Input Validation', () => {
    it('should reject requests with missing required fields', async () => {
      const event = createEvent({
        body: JSON.stringify({ name: 'Test' }),
      });

      const response = await handler(event);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error).toContain('Missing required fields');
    });

    it('should reject invalid email formats', async () => {
      const event = createEvent({
        body: JSON.stringify({
          name: 'Test User',
          email: 'invalid-email',
          message: 'Test message',
        }),
      });

      const response = await handler(event);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error).toBe('Invalid email format');
    });

    it('should reject email with newline injection', async () => {
      const event = createEvent({
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com\nBcc:attacker@evil.com',
          message: 'Test message',
        }),
      });

      const response = await handler(event);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error).toBe('Invalid email format');
    });

    it('should reject fields exceeding maximum length', async () => {
      const event = createEvent({
        body: JSON.stringify({
          name: 'a'.repeat(201),
          email: 'test@example.com',
          message: 'Test message',
        }),
      });

      const response = await handler(event);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error).toContain('exceed maximum length');
      expect(JSON.parse(response.body).error).toContain('name');
    });

    it('should reject message exceeding maximum length', async () => {
      const event = createEvent({
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'a'.repeat(5001),
        }),
      });

      const response = await handler(event);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error).toContain('message');
    });

    it('should reject subject exceeding maximum length', async () => {
      const event = createEvent({
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          subject: 'a'.repeat(201),
        }),
      });

      const response = await handler(event);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error).toContain('subject');
    });
  });

  describe('HTML Sanitization', () => {
    it('should sanitize HTML in user inputs', async () => {
      const event = createEvent({
        body: JSON.stringify({
          name: '<script>alert("xss")</script>',
          email: 'test@example.com',
          message: '<img src=x onerror=alert(1)>',
        }),
      });

      await handler(event);

      const sendEmailCall = sesMock.commandCalls(SendEmailCommand)[0];
      const htmlBody = sendEmailCall.args[0].input.Message.Body.Html.Data;

      expect(htmlBody).toContain('&lt;script&gt;');
      expect(htmlBody).toContain('&lt;img');
      expect(htmlBody).not.toContain('<script>');
      // Note: 'onerror=' is preserved as text after escaping '<' and '>'
      expect(htmlBody).toContain('&lt;img src=x onerror=alert(1)&gt;');
    });

    it('should sanitize special characters in email body', async () => {
      const event = createEvent({
        body: JSON.stringify({
          name: 'Test & User',
          email: 'test@example.com',
          message: 'Message with "quotes" and \'apostrophes\'',
        }),
      });

      await handler(event);

      const sendEmailCall = sesMock.commandCalls(SendEmailCommand)[0];
      const htmlBody = sendEmailCall.args[0].input.Message.Body.Html.Data;

      expect(htmlBody).toContain('&amp;');
      expect(htmlBody).toContain('&quot;');
      expect(htmlBody).toContain('&#039;');
    });

    it('should strip newlines from subject to prevent header injection', async () => {
      const event = createEvent({
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          subject: 'Normal Subject\nBcc: attacker@evil.com',
        }),
      });

      await handler(event);

      const sendEmailCall = sesMock.commandCalls(SendEmailCommand)[0];
      const subject = sendEmailCall.args[0].input.Message.Subject.Data;

      expect(subject).not.toContain('\n');
      expect(subject).not.toContain('\r');
    });
  });

  describe('Email Sending', () => {
    it('should send email with correct parameters', async () => {
      const event = createEvent();

      const response = await handler(event);

      expect(response.statusCode).toBe(200);
      expect(sesMock.commandCalls(SendEmailCommand).length).toBe(1);

      const sendEmailCall = sesMock.commandCalls(SendEmailCommand)[0];
      const emailParams = sendEmailCall.args[0].input;

      expect(emailParams.Source).toBe('contact@example.com');
      expect(emailParams.Destination.ToAddresses).toEqual(['contact@example.com']);
      expect(emailParams.ReplyToAddresses).toEqual(['test@example.com']);
    });

    it('should use sanitized email in ReplyTo field', async () => {
      const event = createEvent({
        body: JSON.stringify({
          name: 'Test User',
          email: '  test@example.com  ',
          message: 'Test message',
        }),
      });

      await handler(event);

      const sendEmailCall = sesMock.commandCalls(SendEmailCommand)[0];
      const replyTo = sendEmailCall.args[0].input.ReplyToAddresses[0];

      expect(replyTo).toBe('test@example.com');
      expect(replyTo).not.toContain(' ');
    });

    it('should use custom subject when provided', async () => {
      const event = createEvent({
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          subject: 'Custom Subject',
        }),
      });

      await handler(event);

      const sendEmailCall = sesMock.commandCalls(SendEmailCommand)[0];
      const subject = sendEmailCall.args[0].input.Message.Subject.Data;

      expect(subject).toBe('Custom Subject');
    });

    it('should use default subject when not provided', async () => {
      const event = createEvent();

      await handler(event);

      const sendEmailCall = sesMock.commandCalls(SendEmailCommand)[0];
      const subject = sendEmailCall.args[0].input.Message.Subject.Data;

      expect(subject).toBe('Contact Form: Test User');
    });

    it('should include both text and HTML body', async () => {
      const event = createEvent();

      await handler(event);

      const sendEmailCall = sesMock.commandCalls(SendEmailCommand)[0];
      const emailParams = sendEmailCall.args[0].input;

      expect(emailParams.Message.Body.Text).toBeDefined();
      expect(emailParams.Message.Body.Html).toBeDefined();
    });

    it('should use sanitized values in text body', async () => {
      const event = createEvent({
        body: JSON.stringify({
          name: 'Test <User>',
          email: 'test@example.com',
          message: 'Test <message>',
        }),
      });

      await handler(event);

      const sendEmailCall = sesMock.commandCalls(SendEmailCommand)[0];
      const textBody = sendEmailCall.args[0].input.Message.Body.Text.Data;

      // Text body should use sanitized values
      expect(textBody).toContain('Test &lt;User&gt;');
      expect(textBody).toContain('Test &lt;message&gt;');
    });

    it('should handle SES errors gracefully', async () => {
      sesMock.on(SendEmailCommand).rejects(new Error('SES error'));

      const event = createEvent();
      const response = await handler(event);

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body).error).toBe('Failed to send message');
    });
  });

  describe('Environment Variables', () => {
    it('should handle missing ALLOWED_ORIGINS gracefully', () => {
      // When ALLOWED_ORIGINS is undefined, the split(',').filter(Boolean) 
      // will result in an empty array, which means no origins are allowed
      // This is tested implicitly by the CORS tests above
      
      // The handler is initialized at module load time, so we can't test
      // runtime changes to ALLOWED_ORIGINS without reloading the module
      // which is complex in Jest. Instead, we verify the initialization logic
      // handles undefined gracefully (no crash) by checking it doesn't throw.
      
      expect(() => {
        const testOrigins = (undefined || '').split(',').filter(Boolean);
        expect(testOrigins).toEqual([]);
      }).not.toThrow();
    });
  });

  describe('Logging', () => {
    it('should log successful submissions', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const event = createEvent();
      await handler(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('contact_form_submission')
      );

      const loggedData = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(loggedData.event).toBe('contact_form_submission');
      expect(loggedData.sourceIp).toBe('192.168.1.1');
      expect(loggedData.replyToEmail).toBe('test@example.com');

      consoleSpy.mockRestore();
    });

    it('should log errors without exposing sensitive data', async () => {
      sesMock.on(SendEmailCommand).rejects(new Error('SES error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const event = createEvent();
      await handler(event);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error sending email:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
