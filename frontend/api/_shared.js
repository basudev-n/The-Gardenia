const { isValidIndianPhone, normalizeIndianPhone } = require('../src/lib/leadSubmission');

const getWebhookUrl = () =>
  String(
    process.env.LEAD_WEBHOOK_URL ||
      process.env.LEAD_SHEETS_WEBHOOK_URL ||
      process.env.LEAD_CRM_WEBHOOK_URL ||
      ''
  ).trim();

const parsePayload = (body) => {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (error) {
      return null;
    }
  }

  if (typeof body === 'object') {
    return body;
  }

  return null;
};

const forwardLead = async (webhookUrl, lead) => {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lead)
  });

  const contentType = response.headers.get('content-type') || '';
  const responseBody = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '');

  return {
    ok: response.ok,
    status: response.status,
    body: responseBody
  };
};

const createLeadHandler = (channel) => async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = parsePayload(req.body);

  if (!payload) {
    return res.status(400).json({ error: 'Invalid JSON payload.' });
  }

  const name = String(payload.name || '').trim();
  const phone = normalizeIndianPhone(payload.phone || '');

  if (!name || !isValidIndianPhone(phone)) {
    return res.status(400).json({
      error: 'Name and a valid +91 phone number are required.'
    });
  }

  const lead = {
    ...payload,
    name,
    phone,
    source: payload.source || channel,
    channel,
    submittedAt: new Date().toISOString()
  };

  const webhookUrl = getWebhookUrl();

  if (webhookUrl) {
    try {
      const upstream = await forwardLead(webhookUrl, lead);

      if (!upstream.ok) {
        return res.status(502).json({
          error: 'Lead relay failed',
          details: upstream.body
        });
      }

      return res.status(200).json({
        success: true,
        forwarded: true,
        channel,
        details: upstream.body
      });
    } catch (error) {
      return res.status(502).json({
        error: 'Lead relay failed',
        details: error.message
      });
    }
  }

  return res.status(200).json({
    success: true,
    received: true,
    channel,
    lead,
    message: 'Lead gateway is ready. Configure a webhook to forward submissions.'
  });
};

module.exports = {
  createLeadHandler
};