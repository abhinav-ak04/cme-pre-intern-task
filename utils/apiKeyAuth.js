export default function requireApiKey(options = {}) {
  // options: { headerName: 'x-api-key', allowedKeys: ['...'] }
  const headerName = options.headerName || 'x-api-key';
  const allowedKeys = options.allowedKeys || [];

  return (req, res, next) => {
    const method = req.method.toUpperCase();
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next();
    }

    const key = req.header(headerName);
    if (!key) {
      return res.status(401).json({ message: 'API key required' });
    }

    if (!allowedKeys.includes(key)) {
      return res.status(403).json({ message: 'Invalid API key' });
    }

    req.client = { apiKeyId: key };
    return next();
  };
}
