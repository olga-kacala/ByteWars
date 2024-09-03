const crypto = require('crypto');
const jwt = require('../utils/jwt');

describe('JWT Module', () => {
  const secret = 'supersecretkey';
  const payload = { userId: 123, name: 'John Doe' };

  test('should correctly sign a payload', () => {
    const token = jwt.sign(payload, secret);

    // Token should be a string
    expect(typeof token).toBe('string');

    // Token should have three parts separated by '.'
    const parts = token.split('.');
    expect(parts.length).toBe(3);
    
    // Verify each part
    const [header, base64Payload, signature] = parts;
    const expectedSignature = base64url(crypto.createHmac('sha256', secret).update(`${header}.${base64Payload}`).digest('base64'));

    expect(signature).toBe(expectedSignature);
  });

  test('should correctly verify a valid token', () => {
    const token = jwt.sign(payload, secret);

    const isValid = jwt.verify(token, secret);
    expect(isValid).toBe(true);
  });

  test('should reject an invalid token', () => {
    const token = jwt.sign(payload, secret);

    // Modify the token to make it invalid
    const invalidToken = token.replace('a', 'b');

    const isValid = jwt.verify(invalidToken, secret);
    expect(isValid).toBe(false);
  });

  test('should reject a token with incorrect secret', () => {
    const token = jwt.sign(payload, secret);

    const isValid = jwt.verify(token, 'wrongsecret');
    expect(isValid).toBe(false);
  });

  test('should reject a token with invalid structure', () => {
    // Token with too few parts
    const invalidTokenFewParts = 'header.payload';
    expect(jwt.verify(invalidTokenFewParts, secret)).toBe(false);

    // Token with too many parts
    const invalidTokenManyParts = 'header.payload.signature.extra';
    expect(jwt.verify(invalidTokenManyParts, secret)).toBe(false);
  });
});

// Helper function for base64url encoding used in tests
function base64url(source) {
  let encodedSource = Buffer.from(source).toString('base64');
  encodedSource = encodedSource.replace(/=+$/, '');
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');
  return encodedSource;
}
