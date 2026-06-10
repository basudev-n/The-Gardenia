const DEFAULT_TELECRM_API_BASE_URL = 'https://next-api.telecrm.in';

function compact(values) {
  return Object.fromEntries(
    Object.entries(values)
      .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  );
}

function buildTelecrmPayload(body) {
  const formType = body.formType || body.intent || 'landing-lead';
  const fields = compact({
    name: body.name,
    phone: body.phone,
    email: body.email,
    [process.env.TELECRM_FIELD_PREFERENCE || 'preference']: body.preference,
    [process.env.TELECRM_FIELD_MESSAGE || 'message']: body.message,
    [process.env.TELECRM_FIELD_FORM_TYPE || 'form_type']: formType,
    [process.env.TELECRM_FIELD_SOURCE || 'contact_source']: 'Website',
    [process.env.TELECRM_FIELD_PAGE_URL || 'page_url']: body.pageUrl,
  });

  const payload = { fields };

  if (process.env.TELECRM_ACTION_TYPE) {
    payload.actions = [{
      type: process.env.TELECRM_ACTION_TYPE,
      fields: compact({
        note: `${formType.replace(/-/g, ' ')} submitted from The Gardenia landing page`,
        message: body.message,
      }),
    }];
  }

  return payload;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const enterpriseId = process.env.TELECRM_ENTERPRISE_ID;
  const asyncToken = process.env.TELECRM_ASYNC_TOKEN;

  if (!enterpriseId || !asyncToken) {
    return res.status(500).json({ error: 'TeleCRM environment variables are not configured.' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body.' });
    }
  }

  if (!body.name || !body.phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }

  const baseUrl = process.env.TELECRM_API_BASE_URL || DEFAULT_TELECRM_API_BASE_URL;
  const telecrmUrl = `${baseUrl.replace(/\/$/, '')}/enterprise/${enterpriseId}/autoupdatelead`;

  try {
    const telecrmResponse = await fetch(telecrmUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${asyncToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildTelecrmPayload(body)),
    });

    const responseText = await telecrmResponse.text();

    if (!telecrmResponse.ok) {
      return res.status(telecrmResponse.status).json({
        error: 'TeleCRM submission failed.',
        details: responseText,
      });
    }

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : { status: 'QUEUED' };
    } catch {
      data = { status: 'QUEUED', raw: responseText };
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({
      error: 'Unable to reach TeleCRM.',
      details: error.message,
    });
  }
};