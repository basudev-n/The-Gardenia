const DEFAULT_DEV_BASE_URL = 'https://gardenia-admin.up.railway.app';

const trimTrailingSlash = (value = '') => String(value).trim().replace(/\/+$/, '');

const getLeadApiBaseUrl = () => {
  const explicitBaseUrl = String(
    process.env.REACT_APP_LEAD_API_BASE_URL || process.env.REACT_APP_API_URL || ''
  ).trim();

  if (explicitBaseUrl) {
    return trimTrailingSlash(explicitBaseUrl);
  }

  if (process.env.NODE_ENV === 'development') {
    return DEFAULT_DEV_BASE_URL;
  }

  return '';
};

const buildLeadApiUrl = (path) => {
  const baseUrl = getLeadApiBaseUrl();
  return baseUrl ? `${baseUrl}${path}` : path;
};

const normalizeIndianPhone = (phone = '') => String(phone).trim().replace(/[\s-]/g, '');

const isValidIndianPhone = (phone = '') => /^\+91\d{10}$/.test(normalizeIndianPhone(phone));

const submitLead = async (path, payload) => {
  let response;
  try {
    response = await fetch(buildLeadApiUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    // In development, if the real API is unreachable (CORS or network),
    // mock a successful response so local flow (redirect to thank-you) can be tested.
    if (process.env.NODE_ENV === 'development') {
      return { success: true };
    }
    throw err;
  }

  let responseBody = null;

  try {
    responseBody = await response.json();
  } catch (error) {
    responseBody = null;
  }

  if (!response.ok) {
    const message = responseBody?.message || responseBody?.error || 'Unable to submit lead right now.';
    throw new Error(message);
  }

  return responseBody;
};

module.exports = {
  buildLeadApiUrl,
  getLeadApiBaseUrl,
  isValidIndianPhone,
  normalizeIndianPhone,
  submitLead
};