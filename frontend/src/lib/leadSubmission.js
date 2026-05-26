export const trimTrailingSlash = (value = '') => String(value).trim().replace(/\/+$/, '');

export const getLeadApiBaseUrl = () => {
  const explicitBaseUrl = String(process.env.REACT_APP_FORMSPREE_ENDPOINT || '').trim();

  if (explicitBaseUrl) {
    return trimTrailingSlash(explicitBaseUrl);
  }

  return 'https://formspree.io/f/mjgzpgyz';
};

export const getLeadFormName = (path = '') => {
  if (path.includes('brochure')) return 'brochure';
  if (path.includes('landing')) return 'landing';
  if (path.includes('contact')) return 'contact';
  return 'lead';
};

export const buildLeadApiUrl = () => getLeadApiBaseUrl();

export const normalizeIndianPhone = (phone = '') => String(phone).trim().replace(/[\s-]/g, '');

export const isValidIndianPhone = (phone = '') => /^\+91\d{10}$/.test(normalizeIndianPhone(phone));

export const submitLead = async (path, payload) => {
  let response;
  const formName = getLeadFormName(path);
  const requestBody = {
    ...payload,
    formName,
    _subject: `New ${formName} inquiry from The Gardenia`,
    ...(payload.email ? { _replyto: payload.email } : {})
  };

  try {
    response = await fetch(buildLeadApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  } catch (err) {
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