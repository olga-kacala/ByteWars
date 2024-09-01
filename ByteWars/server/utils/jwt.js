const crypto = require('crypto');

// Helper function to encode in base64url
const base64url = (source) => {
  // Encode in classical base64
  let encodedSource = Buffer.from(source).toString('base64');
  
  // Remove padding '='
  encodedSource = encodedSource.replace(/=+$/, '');
  
  // Replace '+' with '-'
  encodedSource = encodedSource.replace(/\+/g, '-');
  
  // Replace '/' with '_'
  encodedSource = encodedSource.replace(/\//g, '_');
  
  return encodedSource;
};

const jwt = {
  sign: (payload, secret) => {
    const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
    const base64Header = base64url(header);
    const base64Payload = base64url(JSON.stringify(payload));
    const signature = base64url(crypto.createHmac('sha256', secret).update(`${base64Header}.${base64Payload}`).digest('base64'));
    return `${base64Header}.${base64Payload}.${signature}`;
  },
  verify: (token, secret) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false; // Invalid token structure
    }
    const [header, payload, signature] = parts;
    const expectedSignature = base64url(crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64'));
    return signature === expectedSignature;
  }
};

module.exports = jwt;
