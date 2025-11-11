const mockGenerateKeyPairSync = jest.fn();
const mockPublicEncrypt = jest.fn();
const mockPrivateDecrypt = jest.fn();

jest.mock('crypto', () => ({
  constants: { RSA_PKCS1_OAEP_PADDING: 'oaep' },
  generateKeyPairSync: mockGenerateKeyPairSync,
  publicEncrypt: mockPublicEncrypt,
  privateDecrypt: mockPrivateDecrypt,
}));

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

jest.mock('path', () => ({
  join: (...segments) => segments.join('/'),
}));

describe('generate-keys script', () => {
  test('generates and verifies RSA keys with and without passphrase', () => {
    jest.resetModules();
    process.env.RSA_PASSPHRASE = 'test-passphrase';

    mockGenerateKeyPairSync.mockReset();
    mockPublicEncrypt.mockReset();
    mockPrivateDecrypt.mockReset();

    mockGenerateKeyPairSync
      .mockReturnValueOnce({
        publicKey: 'PUBLIC_WITH',
        privateKey: 'PRIVATE_WITH',
      })
      .mockReturnValueOnce({
        publicKey: 'PUBLIC_NO',
        privateKey: 'PRIVATE_NO',
      });

    const encryptedBuffer = Buffer.from('encrypted');
    const decryptedBuffer = Buffer.from('test-verification-data');

    mockPublicEncrypt.mockReturnValue(encryptedBuffer);
    mockPrivateDecrypt.mockReturnValue(decryptedBuffer);

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    require('@/generate-keys');

    expect(mockGenerateKeyPairSync).toHaveBeenNthCalledWith(
      1,
      'rsa',
      expect.objectContaining({
        modulusLength: 2048,
        privateKeyEncoding: expect.objectContaining({
          cipher: 'aes-256-cbc',
          passphrase: 'test-passphrase',
        }),
      }),
    );

    expect(mockGenerateKeyPairSync).toHaveBeenNthCalledWith(
      2,
      'rsa',
      expect.objectContaining({
        modulusLength: 2048,
        privateKeyEncoding: expect.objectContaining({
          type: 'pkcs8',
          format: 'pem',
        }),
      }),
    );

    expect(mockPublicEncrypt).toHaveBeenCalledTimes(2);
    expect(mockPrivateDecrypt).toHaveBeenCalledTimes(2);
    expect(logSpy.mock.calls.some((call) => call.join(' ').includes('RSA_PUBLIC_KEY'))).toBe(true);
    expect(errorSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
    errorSpy.mockRestore();
    delete process.env.RSA_PASSPHRASE;
  });
});

