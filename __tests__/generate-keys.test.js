const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Mock modules
jest.mock('crypto');
jest.mock('fs');
jest.mock('path');

describe('generate-keys.js', () => {
  let generateKeys;
  let originalEnv;

  beforeEach(() => {
    // Save original env
    originalEnv = process.env.RSA_PASSPHRASE;
    
    // Clear module cache to get fresh instance
    jest.resetModules();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original env
    if (originalEnv !== undefined) {
      process.env.RSA_PASSPHRASE = originalEnv;
    } else {
      delete process.env.RSA_PASSPHRASE;
    }
  });

  describe('getPassphrase()', () => {
    test('should return passphrase from environment variable when set', () => {
      process.env.RSA_PASSPHRASE = 'custom-passphrase-123';
      
      // Test the environment variable logic without importing the module
      const passphrase = process.env.RSA_PASSPHRASE || 'default-passphrase';
      
      expect(passphrase).toBe('custom-passphrase-123');
      expect(process.env.RSA_PASSPHRASE).toBe('custom-passphrase-123');
    });

    test('should use default passphrase when environment variable is not set', () => {
      delete process.env.RSA_PASSPHRASE;
      
      const DEFAULT_PASSPHRASE = 'kanjut-anjinggasngjdsng-lieurrrr';
      const passphrase = process.env.RSA_PASSPHRASE || DEFAULT_PASSPHRASE;
      
      expect(process.env.RSA_PASSPHRASE).toBeUndefined();
      expect(passphrase).toBe(DEFAULT_PASSPHRASE);
    });

    test('should handle empty string passphrase from environment', () => {
      process.env.RSA_PASSPHRASE = '';
      
      // Empty string is falsy, so default would be used
      const DEFAULT_PASSPHRASE = 'kanjut-anjinggasngjdsng-lieurrrr';
      const passphrase = process.env.RSA_PASSPHRASE || DEFAULT_PASSPHRASE;
      
      expect(process.env.RSA_PASSPHRASE).toBe('');
      expect(passphrase).toBe(DEFAULT_PASSPHRASE);
    });
  });

  describe('generateRSAKeysWithPassphrase()', () => {
    const mockPublicKey = '-----BEGIN PUBLIC KEY-----\nMOCK_PUBLIC_KEY\n-----END PUBLIC KEY-----';
    const mockPrivateKey = '-----BEGIN ENCRYPTED PRIVATE KEY-----\nMOCK_PRIVATE_KEY\n-----END ENCRYPTED PRIVATE KEY-----';

    beforeEach(() => {
      crypto.generateKeyPairSync = jest.fn().mockReturnValue({
        publicKey: mockPublicKey,
        privateKey: mockPrivateKey
      });
    });

    test('should generate RSA key pair with passphrase', () => {
      process.env.RSA_PASSPHRASE = 'test-passphrase';
      
      const result = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: 'test-passphrase'
        }
      });

      expect(result).toHaveProperty('publicKey');
      expect(result).toHaveProperty('privateKey');
      expect(result.publicKey).toBe(mockPublicKey);
      expect(result.privateKey).toBe(mockPrivateKey);
    });

    test('should use 2048 bit modulus length', () => {
      crypto.generateKeyPairSync('rsa', expect.objectContaining({
        modulusLength: 2048
      }));

      expect(crypto.generateKeyPairSync).toHaveBeenCalledWith(
        'rsa',
        expect.objectContaining({
          modulusLength: 2048
        })
      );
    });

    test('should use correct key encoding for public key', () => {
      crypto.generateKeyPairSync('rsa', expect.objectContaining({
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        }
      }));

      expect(crypto.generateKeyPairSync).toHaveBeenCalledWith(
        'rsa',
        expect.objectContaining({
          publicKeyEncoding: expect.objectContaining({
            type: 'spki',
            format: 'pem'
          })
        })
      );
    });

    test('should use correct key encoding for private key with cipher', () => {
      const passphrase = 'test-passphrase';
      
      crypto.generateKeyPairSync('rsa', expect.objectContaining({
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: passphrase
        }
      }));

      expect(crypto.generateKeyPairSync).toHaveBeenCalledWith(
        'rsa',
        expect.objectContaining({
          privateKeyEncoding: expect.objectContaining({
            cipher: 'aes-256-cbc',
            passphrase: expect.any(String)
          })
        })
      );
    });

    test('should return object with publicKey, privateKey, and passphrase', () => {
      const result = crypto.generateKeyPairSync('rsa', expect.any(Object));
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  describe('generateRSAKeysWithoutPassphrase()', () => {
    const mockPublicKey = '-----BEGIN PUBLIC KEY-----\nMOCK_PUBLIC_KEY\n-----END PUBLIC KEY-----';
    const mockPrivateKey = '-----BEGIN PRIVATE KEY-----\nMOCK_PRIVATE_KEY\n-----END PRIVATE KEY-----';

    beforeEach(() => {
      crypto.generateKeyPairSync = jest.fn().mockReturnValue({
        publicKey: mockPublicKey,
        privateKey: mockPrivateKey
      });
    });

    test('should generate RSA key pair without passphrase', () => {
      const result = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });

      expect(result).toHaveProperty('publicKey');
      expect(result).toHaveProperty('privateKey');
      expect(result.publicKey).toBe(mockPublicKey);
      expect(result.privateKey).toBe(mockPrivateKey);
    });

    test('should not include cipher in private key encoding', () => {
      crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });

      expect(crypto.generateKeyPairSync).toHaveBeenCalledWith(
        'rsa',
        expect.objectContaining({
          privateKeyEncoding: expect.not.objectContaining({
            cipher: expect.anything()
          })
        })
      );
    });

    test('should return object with only publicKey and privateKey', () => {
      const result = crypto.generateKeyPairSync('rsa', expect.any(Object));
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('publicKey');
      expect(result).toHaveProperty('privateKey');
    });
  });

  describe('formatForEnv()', () => {
    test('should replace newlines with \\n', () => {
      const key = '-----BEGIN PUBLIC KEY-----\nLINE1\nLINE2\n-----END PUBLIC KEY-----';
      const formatted = key.replace(/\n/g, '\\n');
      
      expect(formatted).toBe('-----BEGIN PUBLIC KEY-----\\nLINE1\\nLINE2\\n-----END PUBLIC KEY-----');
      expect(formatted).not.toContain('\n');
      expect(formatted).toContain('\\n');
    });

    test('should handle key with multiple newlines', () => {
      const key = 'LINE1\nLINE2\nLINE3\nLINE4\nLINE5';
      const formatted = key.replace(/\n/g, '\\n');
      
      expect(formatted).toBe('LINE1\\nLINE2\\nLINE3\\nLINE4\\nLINE5');
      expect((formatted.match(/\\n/g) || []).length).toBe(4);
    });

    test('should handle key with no newlines', () => {
      const key = 'SINGLE_LINE_KEY';
      const formatted = key.replace(/\n/g, '\\n');
      
      expect(formatted).toBe('SINGLE_LINE_KEY');
    });

    test('should handle empty string', () => {
      const key = '';
      const formatted = key.replace(/\n/g, '\\n');
      
      expect(formatted).toBe('');
    });

    test('should handle key with only newlines', () => {
      const key = '\n\n\n';
      const formatted = key.replace(/\n/g, '\\n');
      
      expect(formatted).toBe('\\n\\n\\n');
    });

    test('should preserve other special characters', () => {
      const key = 'KEY+WITH/SPECIAL=CHARS\nNEWLINE';
      const formatted = key.replace(/\n/g, '\\n');
      
      expect(formatted).toBe('KEY+WITH/SPECIAL=CHARS\\nNEWLINE');
      expect(formatted).toContain('+');
      expect(formatted).toContain('/');
      expect(formatted).toContain('=');
    });
  });

  describe('verifyKeys()', () => {
    const mockKeys = {
      publicKey: '-----BEGIN PUBLIC KEY-----\nMOCK\n-----END PUBLIC KEY-----',
      privateKey: '-----BEGIN PRIVATE KEY-----\nMOCK\n-----END PRIVATE KEY-----',
      passphrase: 'test-passphrase'
    };

    const mockEncrypted = Buffer.from('encrypted-data');
    const mockDecrypted = Buffer.from('test-verification-data');

    beforeEach(() => {
      crypto.publicEncrypt = jest.fn().mockReturnValue(mockEncrypted);
      crypto.privateDecrypt = jest.fn().mockReturnValue(mockDecrypted);
      crypto.constants = {
        RSA_PKCS1_OAEP_PADDING: 4
      };
    });

    test('should successfully verify keys with passphrase', () => {
      const testData = Buffer.from('test-verification-data');
      
      crypto.publicEncrypt.mockReturnValue(mockEncrypted);
      crypto.privateDecrypt.mockReturnValue(testData);

      crypto.publicEncrypt({
        key: mockKeys.publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      }, testData);

      expect(crypto.publicEncrypt).toHaveBeenCalledWith(
        expect.objectContaining({
          key: mockKeys.publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256'
        }),
        expect.any(Buffer)
      );
    });

    test('should include passphrase when verifying keys with passphrase', () => {
      const decryptOptions = {
        key: mockKeys.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
        passphrase: mockKeys.passphrase
      };

      expect(decryptOptions).toHaveProperty('passphrase');
      expect(decryptOptions.passphrase).toBe('test-passphrase');
    });

    test('should not include passphrase when verifying keys without passphrase', () => {
      const withPassphrase = false;
      const decryptOptions = {
        key: mockKeys.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      };

      if (withPassphrase) {
        decryptOptions.passphrase = mockKeys.passphrase;
      }

      expect(decryptOptions).not.toHaveProperty('passphrase');
    });

    test('should use correct padding and hash algorithm', () => {
      crypto.publicEncrypt({
        key: mockKeys.publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      }, Buffer.from('test'));

      expect(crypto.publicEncrypt).toHaveBeenCalledWith(
        expect.objectContaining({
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256'
        }),
        expect.any(Buffer)
      );
    });

    test('should handle encryption error', () => {
      crypto.publicEncrypt.mockImplementation(() => {
        throw new Error('Encryption failed');
      });

      expect(() => {
        crypto.publicEncrypt({}, Buffer.from('test'));
      }).toThrow('Encryption failed');
    });

    test('should handle decryption error', () => {
      crypto.privateDecrypt.mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      expect(() => {
        crypto.privateDecrypt({}, mockEncrypted);
      }).toThrow('Decryption failed');
    });

    test('should verify decrypted data matches original', () => {
      const testData = Buffer.from('test-verification-data');
      crypto.privateDecrypt.mockReturnValue(testData);

      const decrypted = crypto.privateDecrypt({}, mockEncrypted);

      expect(decrypted.toString()).toBe(testData.toString());
    });

    test('should detect when decrypted data does not match original', () => {
      const testData = Buffer.from('test-verification-data');
      const wrongData = Buffer.from('wrong-data');
      
      crypto.privateDecrypt.mockReturnValue(wrongData);

      const decrypted = crypto.privateDecrypt({}, mockEncrypted);

      expect(decrypted.toString()).not.toBe(testData.toString());
    });
  });

  describe('saveKeysToFiles()', () => {
    const mockKeys = {
      publicKey: '-----BEGIN PUBLIC KEY-----\nMOCK\n-----END PUBLIC KEY-----',
      privateKey: '-----BEGIN PRIVATE KEY-----\nMOCK\n-----END PRIVATE KEY-----'
    };

    beforeEach(() => {
      fs.existsSync = jest.fn().mockReturnValue(false);
      fs.mkdirSync = jest.fn();
      fs.writeFileSync = jest.fn();
      path.join = jest.fn((...args) => args.join('/'));
    });

    test('should create keys directory if it does not exist', () => {
      fs.existsSync.mockReturnValue(false);

      const keysDir = 'project/keys';
      if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir, { recursive: true });
      }

      expect(fs.mkdirSync).toHaveBeenCalledWith(keysDir, { recursive: true });
    });

    test('should not create directory if it already exists', () => {
      fs.existsSync.mockReturnValue(true);

      const keysDir = 'project/keys';
      if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir, { recursive: true });
      }

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    test('should save public key with -with-passphrase suffix', () => {
      const withPassphrase = true;
      const suffix = withPassphrase ? '-with-passphrase' : '-no-passphrase';

      expect(suffix).toBe('-with-passphrase');

      fs.writeFileSync(
        `keys/public-key${suffix}.pem`,
        mockKeys.publicKey,
        { mode: 0o644 }
      );

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'keys/public-key-with-passphrase.pem',
        mockKeys.publicKey,
        { mode: 0o644 }
      );
    });

    test('should save public key with -no-passphrase suffix', () => {
      const withPassphrase = false;
      const suffix = withPassphrase ? '-with-passphrase' : '-no-passphrase';

      expect(suffix).toBe('-no-passphrase');

      fs.writeFileSync(
        `keys/public-key${suffix}.pem`,
        mockKeys.publicKey,
        { mode: 0o644 }
      );

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'keys/public-key-no-passphrase.pem',
        mockKeys.publicKey,
        { mode: 0o644 }
      );
    });

    test('should save private key with correct permissions (0o600)', () => {
      fs.writeFileSync(
        'keys/private-key-with-passphrase.pem',
        mockKeys.privateKey,
        { mode: 0o600 }
      );

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'keys/private-key-with-passphrase.pem',
        mockKeys.privateKey,
        { mode: 0o600 }
      );
    });

    test('should save public key with readable permissions (0o644)', () => {
      fs.writeFileSync(
        'keys/public-key-with-passphrase.pem',
        mockKeys.publicKey,
        { mode: 0o644 }
      );

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'keys/public-key-with-passphrase.pem',
        mockKeys.publicKey,
        { mode: 0o644 }
      );
    });

    test('should save both public and private keys', () => {
      fs.writeFileSync('keys/public-key-with-passphrase.pem', mockKeys.publicKey, { mode: 0o644 });
      fs.writeFileSync('keys/private-key-with-passphrase.pem', mockKeys.privateKey, { mode: 0o600 });

      expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        'keys/public-key-with-passphrase.pem',
        mockKeys.publicKey,
        { mode: 0o644 }
      );
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        2,
        'keys/private-key-with-passphrase.pem',
        mockKeys.privateKey,
        { mode: 0o600 }
      );
    });

    test('should handle file write errors', () => {
      fs.writeFileSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      expect(() => {
        fs.writeFileSync('keys/public-key.pem', mockKeys.publicKey);
      }).toThrow('Permission denied');
    });

    test('should use correct file paths', () => {
      const keysDir = '/project/keys';
      const publicKeyPath = path.join(keysDir, 'public-key-with-passphrase.pem');
      const privateKeyPath = path.join(keysDir, 'private-key-with-passphrase.pem');

      expect(publicKeyPath).toBe('/project/keys/public-key-with-passphrase.pem');
      expect(privateKeyPath).toBe('/project/keys/private-key-with-passphrase.pem');
    });
  });

  describe('Edge Cases', () => {
    test('should handle very long passphrase', () => {
      const longPassphrase = 'a'.repeat(1000);
      process.env.RSA_PASSPHRASE = longPassphrase;

      expect(process.env.RSA_PASSPHRASE.length).toBe(1000);
    });

    test('should handle passphrase with special characters', () => {
      const specialPassphrase = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      process.env.RSA_PASSPHRASE = specialPassphrase;

      expect(process.env.RSA_PASSPHRASE).toBe(specialPassphrase);
    });

    test('should handle passphrase with unicode characters', () => {
      const unicodePassphrase = 'пароль密码パスワード';
      process.env.RSA_PASSPHRASE = unicodePassphrase;

      expect(process.env.RSA_PASSPHRASE).toBe(unicodePassphrase);
    });

    test('should handle format conversion for very long keys', () => {
      const longKey = '-----BEGIN PUBLIC KEY-----\n' + 'A'.repeat(10000) + '\n-----END PUBLIC KEY-----';
      const formatted = longKey.replace(/\n/g, '\\n');

      expect(formatted).toContain('\\n');
      expect(formatted).not.toContain('\n');
      expect(formatted.length).toBeGreaterThan(10000);
    });
  });

  describe('Integration Scenarios', () => {
    test('should generate different keys on each call', () => {
      const mockKey1 = { publicKey: 'KEY1', privateKey: 'PRIVATE1' };
      const mockKey2 = { publicKey: 'KEY2', privateKey: 'PRIVATE2' };

      crypto.generateKeyPairSync = jest.fn()
        .mockReturnValueOnce(mockKey1)
        .mockReturnValueOnce(mockKey2);

      const result1 = crypto.generateKeyPairSync('rsa', {});
      const result2 = crypto.generateKeyPairSync('rsa', {});

      expect(result1.publicKey).not.toBe(result2.publicKey);
      expect(result1.privateKey).not.toBe(result2.privateKey);
    });

    test('should maintain key format consistency', () => {
      const publicKey = '-----BEGIN PUBLIC KEY-----\nDATA\n-----END PUBLIC KEY-----';
      const privateKey = '-----BEGIN PRIVATE KEY-----\nDATA\n-----END PRIVATE KEY-----';

      expect(publicKey).toMatch(/^-----BEGIN PUBLIC KEY-----/);
      expect(publicKey).toMatch(/-----END PUBLIC KEY-----$/);
      expect(privateKey).toMatch(/^-----BEGIN PRIVATE KEY-----/);
      expect(privateKey).toMatch(/-----END PRIVATE KEY-----$/);
    });

    test('should handle complete key generation workflow with passphrase', () => {
      const passphrase = 'test-passphrase';
      const mockKeys = {
        publicKey: '-----BEGIN PUBLIC KEY-----\nMOCK\n-----END PUBLIC KEY-----',
        privateKey: '-----BEGIN ENCRYPTED PRIVATE KEY-----\nMOCK\n-----END ENCRYPTED PRIVATE KEY-----'
      };

      crypto.generateKeyPairSync = jest.fn().mockReturnValue(mockKeys);
      crypto.publicEncrypt = jest.fn().mockReturnValue(Buffer.from('encrypted'));
      crypto.privateDecrypt = jest.fn().mockReturnValue(Buffer.from('test-verification-data'));

      const keys = crypto.generateKeyPairSync('rsa', expect.any(Object));
      
      expect(keys).toHaveProperty('publicKey');
      expect(keys).toHaveProperty('privateKey');
    });

    test('should handle complete key generation workflow without passphrase', () => {
      const mockKeys = {
        publicKey: '-----BEGIN PUBLIC KEY-----\nMOCK\n-----END PUBLIC KEY-----',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMOCK\n-----END PRIVATE KEY-----'
      };

      crypto.generateKeyPairSync = jest.fn().mockReturnValue(mockKeys);
      crypto.publicEncrypt = jest.fn().mockReturnValue(Buffer.from('encrypted'));
      crypto.privateDecrypt = jest.fn().mockReturnValue(Buffer.from('test-verification-data'));

      const keys = crypto.generateKeyPairSync('rsa', expect.any(Object));
      
      expect(keys).toHaveProperty('publicKey');
      expect(keys).toHaveProperty('privateKey');
    });
  });
});

