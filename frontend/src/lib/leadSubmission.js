export const normalizeIndianPhone = (phone = '') => String(phone).trim().replace(/[\s-]/g, '');

export const isValidIndianPhone = (phone = '') => /^\+91\d{10}$/.test(normalizeIndianPhone(phone));

export const submitLead = async (path, payload) => {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let responseBody = null;
  try {
    responseBody = await response.json();
  } catch {
    responseBody = null;
  }

  if (!response.ok) {
    const message = responseBody?.error || responseBody?.message || 'Unable to submit lead right now.';
    throw new Error(message);
  }

  return responseBody;
};