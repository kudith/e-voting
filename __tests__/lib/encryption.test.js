// __tests__/lib/encryption.test.js
// Unit tests untuk lib/encryption.js
// Testing: hashing, hybrid encryption/decryption, dan RSA key generation

import crypto from 'crypto';
import {
  hybridEncrypt,
  hybridDecrypt,
  generateSecureHash,
  verifyHash,
  generateAndReturnRSAKeys,
} from '@/lib/encryption';

describe('lib/encryption.js - Core Security Module', () => {
  // ============================================================
  // TEST SUITE 1: Secure Hashing Functions
  // ============================================================
  describe('generateSecureHash()', () => {
    // Test 1.1: Hash consistency - hash yang sama harus dihasilkan untuk data yang sama
    test('should generate consistent hash for same data', () => {
      const data = 'test-vote-data';
      const hash1 = generateSecureHash(data);
      const hash2 = generateSecureHash(data);

      // Hash harus identik untuk data yang sama
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(128); // SHA-512 menghasilkan 128 karakter hex
    });

    // Test 1.2: Hash uniqueness - data berbeda harus menghasilkan hash berbeda
    test('should generate different hashes for different data', () => {
      const data1 = 'vote-for-candidate-A';
      const data2 = 'vote-for-candidate-B';
      
      const hash1 = generateSecureHash(data1);
      const hash2 = generateSecureHash(data2);

      // Hash harus berbeda untuk data yang berbeda
      expect(hash1).not.toBe(hash2);
    });

    // Test 1.3: Hash format - hash harus berupa hexadecimal string
    test('should generate valid hexadecimal hash', () => {
      const data = 'test-data';
      const hash = generateSecureHash(data);

      // Verifikasi format hexadecimal
      expect(hash).toMatch(/^[a-f0-9]{128}$/);
    });

    // Test 1.4: Edge case - empty string
    test('should handle empty string', () => {
      const hash = generateSecureHash('');
      
      // Hash untuk empty string tetap valid
      expect(hash).toHaveLength(128);
      expect(hash).toMatch(/^[a-f0-9]{128}$/);
    });

    // Test 1.5: Edge case - large data
    test('should handle large data strings', () => {
      const largeData = 'x'.repeat(10000); // 10KB data
      const hash = generateSecureHash(largeData);

      // Hash tetap memiliki panjang yang sama
      expect(hash).toHaveLength(128);
      expect(hash).toMatch(/^[a-f0-9]{128}$/);
    });

    // Test 1.6: Special characters handling
    test('should handle special characters', () => {
      const specialChars = '!@#$%^&*()_+-={}[]|\\:";\'<>?,./`~';
      const hash = generateSecureHash(specialChars);

      expect(hash).toHaveLength(128);
      expect(hash).toMatch(/^[a-f0-9]{128}$/);
    });

    // Test 1.7: Unicode handling
    test('should handle unicode characters', () => {
      const unicodeData = '🗳️ Vote untuk 候选人 🎉';
      const hash = generateSecureHash(unicodeData);

      expect(hash).toHaveLength(128);
      expect(hash).toMatch(/^[a-f0-9]{128}$/);
    });
  });

  // ============================================================
  // TEST SUITE 2: Hash Verification
  // ============================================================
  describe('verifyHash()', () => {
    // Test 2.1: Valid hash verification
    test('should verify correct hash', () => {
      const data = 'test-vote-data';
      const hash = generateSecureHash(data);
      
      // Verifikasi hash yang benar
      const isValid = verifyHash(data, hash);
      expect(isValid).toBe(true);
    });

    // Test 2.2: Invalid hash verification
    test('should reject incorrect hash', () => {
      const data = 'test-vote-data';
      const wrongHash = generateSecureHash('different-data');
      
      // Verifikasi hash yang salah
      const isValid = verifyHash(data, wrongHash);
      expect(isValid).toBe(false);
    });

    // Test 2.3: Tampered data detection
    test('should detect tampered data', () => {
      const originalData = 'vote-for-candidate-A';
      const hash = generateSecureHash(originalData);
      
      const tamperedData = 'vote-for-candidate-B';
      
      // Verifikasi harus gagal untuk data yang diubah
      const isValid = verifyHash(tamperedData, hash);
      expect(isValid).toBe(false);
    });

    // Test 2.4: Edge case - empty data
    test('should verify empty string correctly', () => {
      const emptyData = '';
      const hash = generateSecureHash(emptyData);
      
      expect(verifyHash(emptyData, hash)).toBe(true);
      expect(verifyHash('not-empty', hash)).toBe(false);
    });

    // Test 2.5: Case sensitivity
    test('should be case sensitive', () => {
      const data = 'TestData';
      const hash = generateSecureHash(data);
      
      expect(verifyHash('TestData', hash)).toBe(true);
      expect(verifyHash('testdata', hash)).toBe(false);
      expect(verifyHash('TESTDATA', hash)).toBe(false);
    });
  });

  // ============================================================
  // TEST SUITE 3: Hybrid Encryption (AES-256-GCM + RSA)
  // ============================================================
  describe('hybridEncrypt()', () => {
    // Test 3.1: Successful encryption
    test('should encrypt data successfully', () => {
      const testData = 'secret-vote-data';
      const encrypted = hybridEncrypt(testData);

      // Verifikasi struktur hasil enkripsi
      expect(encrypted).toHaveProperty('encryptedData');
      expect(encrypted).toHaveProperty('encryptedKey');
      expect(encrypted).toHaveProperty('iv');
      expect(encrypted).toHaveProperty('authTag');

      // Verifikasi semua field adalah base64 string
      expect(encrypted.encryptedData).toBeTruthy();
      expect(encrypted.encryptedKey).toBeTruthy();
      expect(encrypted.iv).toBeTruthy();
      expect(encrypted.authTag).toBeTruthy();
    });

    // Test 3.2: Encrypted data should be different from original
    test('should produce encrypted data different from original', () => {
      const testData = 'secret-vote-data';
      const encrypted = hybridEncrypt(testData);

      // Data terenkripsi tidak boleh sama dengan data asli
      expect(encrypted.encryptedData).not.toBe(testData);
    });

    // Test 3.3: Multiple encryptions should produce different results (nonce uniqueness)
    test('should produce different encrypted output for same data', () => {
      const testData = 'secret-vote-data';
      const encrypted1 = hybridEncrypt(testData);
      const encrypted2 = hybridEncrypt(testData);

      // Setiap enkripsi harus menghasilkan output berbeda karena IV random
      expect(encrypted1.encryptedData).not.toBe(encrypted2.encryptedData);
      expect(encrypted1.encryptedKey).not.toBe(encrypted2.encryptedKey);
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
    });

    // Test 3.4: Edge case - empty string encryption
    test('should encrypt empty string', () => {
      const encrypted = hybridEncrypt('');
      
      expect(encrypted).toHaveProperty('encryptedData');
      expect(encrypted).toHaveProperty('encryptedKey');
      expect(encrypted).toHaveProperty('iv');
      expect(encrypted).toHaveProperty('authTag');
    });

    // Test 3.5: Large data encryption
    test('should encrypt large data', () => {
      const largeData = 'x'.repeat(10000); // 10KB data
      const encrypted = hybridEncrypt(largeData);

      expect(encrypted).toHaveProperty('encryptedData');
      expect(encrypted.encryptedData).toBeTruthy();
    });

    // Test 3.6: JSON data encryption
    test('should encrypt JSON stringified data', () => {
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: new Date().toISOString(),
      };
      const jsonString = JSON.stringify(voteData);
      const encrypted = hybridEncrypt(jsonString);

      expect(encrypted).toHaveProperty('encryptedData');
      expect(encrypted.encryptedData).toBeTruthy();
    });

    // Test 3.7: Special characters encryption
    test('should encrypt special characters', () => {
      const specialData = '!@#$%^&*()_+-={}[]|\\:";\'<>?,./`~';
      const encrypted = hybridEncrypt(specialData);

      expect(encrypted).toHaveProperty('encryptedData');
      expect(encrypted.encryptedData).toBeTruthy();
    });

    // Test 3.8: Unicode encryption
    test('should encrypt unicode characters', () => {
      const unicodeData = '🗳️ Vote untuk 候选人 🎉';
      const encrypted = hybridEncrypt(unicodeData);

      expect(encrypted).toHaveProperty('encryptedData');
      expect(encrypted.encryptedData).toBeTruthy();
    });
  });

  // ============================================================
  // TEST SUITE 4: Hybrid Decryption
  // ============================================================
  describe('hybridDecrypt()', () => {
    // Test 4.1: Successful encryption and decryption round-trip
    test('should decrypt data correctly (round-trip test)', () => {
      const originalData = 'secret-vote-data';
      const encrypted = hybridEncrypt(originalData);
      
      const decrypted = hybridDecrypt(
        encrypted.encryptedData,
        encrypted.encryptedKey,
        encrypted.iv,
        encrypted.authTag
      );

      // Data yang didekripsi harus sama dengan data asli
      expect(decrypted).toBe(originalData);
    });

    // Test 4.2: Complex data round-trip
    test('should handle complex JSON data round-trip', () => {
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };
      const originalData = JSON.stringify(voteData);
      const encrypted = hybridEncrypt(originalData);
      
      const decrypted = hybridDecrypt(
        encrypted.encryptedData,
        encrypted.encryptedKey,
        encrypted.iv,
        encrypted.authTag
      );

      expect(decrypted).toBe(originalData);
      
      // Verify JSON parsing works
      const parsedData = JSON.parse(decrypted);
      expect(parsedData).toEqual(voteData);
    });

    // Test 4.3: Empty string round-trip
    test('should handle empty string round-trip', () => {
      const originalData = '';
      const encrypted = hybridEncrypt(originalData);
      const decrypted = hybridDecrypt(
        encrypted.encryptedData,
        encrypted.encryptedKey,
        encrypted.iv,
        encrypted.authTag
      );

      expect(decrypted).toBe(originalData);
    });

    // Test 4.4: Large data round-trip
    test('should handle large data round-trip', () => {
      const originalData = 'x'.repeat(10000);
      const encrypted = hybridEncrypt(originalData);
      const decrypted = hybridDecrypt(
        encrypted.encryptedData,
        encrypted.encryptedKey,
        encrypted.iv,
        encrypted.authTag
      );

      expect(decrypted).toBe(originalData);
    });

    // Test 4.5: Invalid encrypted key should throw error
    test('should throw error with invalid encrypted key', () => {
      const originalData = 'secret-vote-data';
      const encrypted = hybridEncrypt(originalData);
      
      // Gunakan encrypted key yang salah
      const invalidKey = Buffer.from('invalid-key').toString('base64');

      expect(() => {
        hybridDecrypt(
          encrypted.encryptedData,
          invalidKey,
          encrypted.iv,
          encrypted.authTag
        );
      }).toThrow();
    });

    // Test 4.6: Tampered encrypted data should throw error
    test('should throw error with tampered encrypted data', () => {
      const originalData = 'secret-vote-data';
      const encrypted = hybridEncrypt(originalData);
      
      // Modify encrypted data by changing base64 content
      const encryptedBuffer = Buffer.from(encrypted.encryptedData, 'base64');
      // Flip some bits in the encrypted data
      encryptedBuffer[0] = encryptedBuffer[0] ^ 0xFF;
      const tamperedData = encryptedBuffer.toString('base64');

      expect(() => {
        hybridDecrypt(
          tamperedData,
          encrypted.encryptedKey,
          encrypted.iv,
          encrypted.authTag
        );
      }).toThrow();
    });

    // Test 4.7: Invalid IV should throw error
    test('should throw error with invalid IV', () => {
      const originalData = 'secret-vote-data';
      const encrypted = hybridEncrypt(originalData);
      
      // Use different IV
      const invalidIV = Buffer.from('0123456789abcdef').toString('base64');

      expect(() => {
        hybridDecrypt(
          encrypted.encryptedData,
          encrypted.encryptedKey,
          invalidIV,
          encrypted.authTag
        );
      }).toThrow();
    });

    // Test 4.8: Invalid auth tag should throw error
    test('should throw error with invalid auth tag', () => {
      const originalData = 'secret-vote-data';
      const encrypted = hybridEncrypt(originalData);
      
      // Use different auth tag
      const invalidAuthTag = Buffer.from('invalid-auth-tag').toString('base64');

      expect(() => {
        hybridDecrypt(
          encrypted.encryptedData,
          encrypted.encryptedKey,
          encrypted.iv,
          invalidAuthTag
        );
      }).toThrow();
    });

    // Test 4.9: Missing parameters should throw error
    test('should throw error with missing parameters', () => {
      expect(() => {
        hybridDecrypt(null, null, null, null);
      }).toThrow();
    });
  });

  // ============================================================
  // TEST SUITE 5: RSA Key Generation
  // ============================================================
  describe('generateAndReturnRSAKeys()', () => {
    // Test 5.1: Should generate valid RSA key pair
    test('should generate valid RSA key pair', () => {
      const keys = generateAndReturnRSAKeys();

      expect(keys).toHaveProperty('publicKey');
      expect(keys).toHaveProperty('privateKey');
      expect(keys).toHaveProperty('passphrase');

      // Keys should be PEM format strings
      expect(keys.publicKey).toContain('BEGIN PUBLIC KEY');
      expect(keys.publicKey).toContain('END PUBLIC KEY');
      expect(keys.privateKey).toContain('BEGIN ENCRYPTED PRIVATE KEY');
      expect(keys.privateKey).toContain('END ENCRYPTED PRIVATE KEY');
    });

    // Test 5.2: Generated keys should be usable for encryption/decryption
    test('generated keys should work for encryption/decryption', () => {
      const keys = generateAndReturnRSAKeys();
      const testData = Buffer.from('test data');

      // Test encryption with public key
      const encrypted = crypto.publicEncrypt(
        {
          key: keys.publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        testData
      );

      expect(encrypted).toBeTruthy();
      expect(encrypted.length).toBeGreaterThan(0);

      // Test decryption with private key
      const decrypted = crypto.privateDecrypt(
        {
          key: keys.privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
          passphrase: keys.passphrase,
        },
        encrypted
      );

      expect(decrypted.toString()).toBe('test data');
    });

    // Test 5.3: Each generation should produce unique keys
    test('should generate different keys each time', () => {
      const keys1 = generateAndReturnRSAKeys();
      const keys2 = generateAndReturnRSAKeys();

      expect(keys1.publicKey).not.toBe(keys2.publicKey);
      expect(keys1.privateKey).not.toBe(keys2.privateKey);
    });
  });

  // ============================================================
  // TEST SUITE 6: Integration Tests - Complete Voting Flow
  // ============================================================
  describe('Complete Vote Encryption Flow', () => {
    // Test 6.1: Full vote encryption, hashing, and verification flow
    test('should handle complete vote encryption and verification flow', () => {
      // Step 1: Create vote data
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: new Date().toISOString(),
      };
      const voteString = JSON.stringify(voteData);

      // Step 2: Generate hash for verification
      const voteHash = generateSecureHash(voteString);
      expect(voteHash).toHaveLength(128);

      // Step 3: Encrypt vote data
      const encrypted = hybridEncrypt(voteString);
      expect(encrypted).toHaveProperty('encryptedData');

      // Step 4: Decrypt vote data
      const decrypted = hybridDecrypt(
        encrypted.encryptedData,
        encrypted.encryptedKey,
        encrypted.iv,
        encrypted.authTag
      );
      expect(decrypted).toBe(voteString);

      // Step 5: Verify hash
      const isValid = verifyHash(decrypted, voteHash);
      expect(isValid).toBe(true);

      // Step 6: Parse and verify data integrity
      const parsedVote = JSON.parse(decrypted);
      expect(parsedVote).toEqual(voteData);
    });

    // Test 6.2: Detect tampering after encryption
    test('should detect data tampering in complete flow', () => {
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: new Date().toISOString(),
      };
      const voteString = JSON.stringify(voteData);
      const voteHash = generateSecureHash(voteString);

      // Encrypt data
      const encrypted = hybridEncrypt(voteString);

      // Simulate tampering by using different data for verification
      const tamperedData = JSON.stringify({
        ...voteData,
        candidateId: 'candidate-999', // Changed!
      });

      // Hash verification should fail for tampered data
      const isValid = verifyHash(tamperedData, voteHash);
      expect(isValid).toBe(false);
    });

    // Test 6.3: Multiple votes with unique hashes
    test('should handle multiple votes with unique hashes', () => {
      const votes = [
        { candidateId: 'candidate-1', voterId: 'voter-1' },
        { candidateId: 'candidate-2', voterId: 'voter-2' },
        { candidateId: 'candidate-3', voterId: 'voter-3' },
      ];

      const encryptedVotes = votes.map(vote => {
        const voteString = JSON.stringify(vote);
        const hash = generateSecureHash(voteString);
        const encrypted = hybridEncrypt(voteString);
        return { hash, encrypted };
      });

      // All hashes should be unique
      const hashes = encryptedVotes.map(v => v.hash);
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(votes.length);

      // Verify each vote can be decrypted correctly
      encryptedVotes.forEach((encVote, index) => {
        const decrypted = hybridDecrypt(
          encVote.encrypted.encryptedData,
          encVote.encrypted.encryptedKey,
          encVote.encrypted.iv,
          encVote.encrypted.authTag
        );
        const parsedVote = JSON.parse(decrypted);
        expect(parsedVote).toEqual(votes[index]);
      });
    });
  });
});

