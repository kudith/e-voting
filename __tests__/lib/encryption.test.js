import crypto from 'crypto';
import {
  hybridEncrypt,
  hybridDecrypt,
  generateSecureHash,
  verifyHash,
  generateAndReturnRSAKeys,
} from '@/lib/encryption';

const HEX_512_REGEX = /^[a-f0-9]{128}$/;
const BASE64_REGEX = /^[A-Za-z0-9+/=]+$/;

describe('lib/encryption', () => {
  test('generateSecureHash produces deterministic hexadecimal output', () => {
    const inputs = [
      'voter-123',
      'voter-123',
      'candidate-456',
      '',
      '🗳️ ballot',
    ];

    const hashes = inputs.map((value) => generateSecureHash(value));

    // Deterministic for identical input
    expect(hashes[0]).toBe(hashes[1]);

    // Hexadecimal format (SHA-512)
    hashes.forEach((hash) => {
      expect(hash).toMatch(HEX_512_REGEX);
    });

    // Different inputs produce different hashes
    expect(hashes[0]).not.toBe(hashes[2]);
    expect(hashes[0]).not.toBe(hashes[3]);
    expect(hashes[2]).not.toBe(hashes[4]);
  });

  test('verifyHash distinguishes valid, tampered, and case-variant payloads', () => {
    const payload = JSON.stringify({ voterId: '1', candidateId: 'A' });
    const hash = generateSecureHash(payload);

    expect(verifyHash(payload, hash)).toBe(true);
    expect(verifyHash(`${payload}-tampered`, hash)).toBe(false);
    expect(verifyHash(payload.toUpperCase(), hash)).toBe(false);
    expect(verifyHash(payload, generateSecureHash('different'))).toBe(false);
  });

  test('hybridEncrypt returns complete base64 encoded payload', () => {
    const encrypted = hybridEncrypt('secret ballot data');

    expect(encrypted).toMatchObject({
      encryptedData: expect.any(String),
      encryptedKey: expect.any(String),
      iv: expect.any(String),
      authTag: expect.any(String),
    });

    expect(encrypted.encryptedData).toMatch(BASE64_REGEX);
    expect(encrypted.encryptedKey).toMatch(BASE64_REGEX);
    expect(encrypted.iv).toMatch(BASE64_REGEX);
    expect(encrypted.authTag).toMatch(BASE64_REGEX);
  });

  test('hybridEncrypt and hybridDecrypt perform reliable roundtrips', () => {
    const scenarios = [
      'simple vote',
      '',
      JSON.stringify({ electionId: 'EL-1', timestamp: new Date().toISOString() }),
      'x'.repeat(2048),
    ];

    scenarios.forEach((original) => {
      const payload = hybridEncrypt(original);
      const decrypted = hybridDecrypt(
        payload.encryptedData,
        payload.encryptedKey,
        payload.iv,
        payload.authTag,
      );

      expect(decrypted).toBe(original);
    });
  });

  test('hybridDecrypt throws descriptive error when payload is tampered', () => {
    const payload = hybridEncrypt('vote integrity check');

    const tamperedAuthTagBuffer = Buffer.from(payload.authTag, 'base64');
    tamperedAuthTagBuffer[0] ^= 0xff;
    const tamperedAuthTag = tamperedAuthTagBuffer.toString('base64');

    expect(() =>
      hybridDecrypt(
        payload.encryptedData,
        payload.encryptedKey,
        payload.iv,
        tamperedAuthTag,
      ),
    ).toThrow(/Failed to decrypt data/);
  });

  test('generateAndReturnRSAKeys creates PEM formatted keys that work for encryption', () => {
    const keys = generateAndReturnRSAKeys();

    expect(keys.publicKey).toContain('BEGIN PUBLIC KEY');
    expect(keys.publicKey).toContain('END PUBLIC KEY');
    expect(keys.privateKey).toContain('BEGIN ENCRYPTED PRIVATE KEY');
    expect(keys.privateKey).toContain('END ENCRYPTED PRIVATE KEY');
    expect(typeof keys.passphrase).toBe('string');
    expect(keys.passphrase.length).toBeGreaterThan(0);

    const sample = Buffer.from('ballot verification');
    const encrypted = crypto.publicEncrypt(
      {
        key: keys.publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      sample,
    );

    const decrypted = crypto.privateDecrypt(
      {
        key: keys.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
        passphrase: keys.passphrase,
      },
      encrypted,
    );

    expect(decrypted.toString()).toBe('ballot verification');
  });
});

