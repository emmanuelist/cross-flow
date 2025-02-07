// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticate = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];

	try {
		const decoded = jwt.verify(token, config.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ error: 'Invalid token' });
	}
};

const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
	const requests = new Map();

	return (req, res, next) => {
		const ip = req.ip;
		const current = requests.get(ip) || { count: 0, reset: Date.now() + windowMs };

		if (Date.now() > current.reset) {
			requests.delete(ip);
			return next();
		}

		if (current.count >= max) {
			return res.status(429).json({ error: 'Too many requests' });
		}

		requests.set(ip, { ...current, count: current.count + 1 });
		next();
	};
};