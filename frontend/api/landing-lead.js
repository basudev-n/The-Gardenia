const { createLeadHandler } = require('./_shared');

const handler = createLeadHandler('landing');

module.exports = async (req, res) => {
	try {
		await handler(req, res);
	} catch (error) {
		console.error('FUNCTION_ERROR', error && error.stack ? error.stack : error);
		res.status(500).json({ error: 'Function invocation failed', details: String(error && error.message ? error.message : error) });
	}
};