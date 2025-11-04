// __tests__/api/vote/verifyVote.test.js
// Integration tests untuk app/api/vote/verifyVote/route.js
// Testing: vote verification dengan berbagai skenario

import { POST } from '@/app/api/vote/verifyVote/route';
import * as encryption from '@/lib/encryption';
import {
  createMockElection,
  createMockVote,
} from '@/__tests__/setup/prisma-mock';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    vote: {
      findUnique: jest.fn(),
    },
  },
}));

import prisma from '@/lib/prisma';

describe('POST /api/vote/verifyVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // TEST SUITE 1: Successful Vote Verification
  // ============================================================
  describe('Successful Vote Verification', () => {
    // Test 1.1: Verify vote with correct hash
    test('should successfully verify vote with correct hash', async () => {
      const electionId = 'election-123';
      const candidateId = 'candidate-456';
      const voterId = 'voter-789';
      const voteId = 'vote-123';

      // Create vote data and hash
      const voteData = {
        electionId,
        candidateId,
        voterId,
        timestamp: '2024-01-15T10:30:00Z',
      };
      const voteString = JSON.stringify(voteData);
      const voteHash = encryption.generateSecureHash(voteString);

      // Encrypt vote data
      const encrypted = encryption.hybridEncrypt(voteString);

      // Mock election
      const mockElection = createMockElection({
        id: electionId,
        title: 'Test Election 2024',
        status: 'completed',
        endDate: new Date('2024-12-31'),
      });

      // Mock vote
      const mockVote = createMockVote({
        id: voteId,
        electionId,
        voterId,
        encryptedData: encrypted.encryptedData,
        encryptedKey: encrypted.encryptedKey,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        isCounted: true,
      });

      // Add election relation to mock vote
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      // Create request
      const req = {
        json: jest.fn().mockResolvedValue({
          voteId,
          voteHash,
        }),
      };

      // Execute
      const response = await POST(req);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Vote verified successfully');
      expect(data.data).toHaveProperty('voteId', voteId);
      expect(data.data).toHaveProperty('electionId', electionId);
      expect(data.data).toHaveProperty('isCounted', true);
      expect(data.data).toHaveProperty('electionStatus', 'completed');
      expect(data.data).toHaveProperty('electionTitle', 'Test Election 2024');
      expect(data.data).toHaveProperty('timestamp', '2024-01-15T10:30:00Z');
      expect(data.data.verificationDetails).toHaveProperty('method');
      expect(data.data.verificationDetails).toHaveProperty('hashAlgorithm', 'SHA-512');
      expect(data.data.verificationDetails).toHaveProperty('verificationTime');
    });

    // Test 1.2: Verify vote that has been counted
    test('should verify counted vote successfully', async () => {
      const voteId = 'vote-123';
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };
      const voteString = JSON.stringify(voteData);
      const voteHash = encryption.generateSecureHash(voteString);
      const encrypted = encryption.hybridEncrypt(voteString);

      const mockElection = createMockElection({ status: 'completed' });
      const mockVote = createMockVote({
        id: voteId,
        encryptedData: encrypted.encryptedData,
        encryptedKey: encrypted.encryptedKey,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        isCounted: true,
      });
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      const req = {
        json: jest.fn().mockResolvedValue({ voteId, voteHash }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.isCounted).toBe(true);
    });

    // Test 1.3: Verify vote that has not been counted yet
    test('should verify uncounted vote successfully', async () => {
      const voteId = 'vote-123';
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };
      const voteString = JSON.stringify(voteData);
      const voteHash = encryption.generateSecureHash(voteString);
      const encrypted = encryption.hybridEncrypt(voteString);

      const mockElection = createMockElection({ status: 'ongoing' });
      const mockVote = createMockVote({
        id: voteId,
        encryptedData: encrypted.encryptedData,
        encryptedKey: encrypted.encryptedKey,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        isCounted: false,
      });
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      const req = {
        json: jest.fn().mockResolvedValue({ voteId, voteHash }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.isCounted).toBe(false);
      expect(data.data.electionStatus).toBe('ongoing');
    });
  });

  // ============================================================
  // TEST SUITE 2: Missing Required Fields
  // ============================================================
  describe('Missing Required Fields', () => {
    // Test 2.1: Missing voteId
    test('should return 400 if voteId is missing', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          voteHash: 'some-hash',
          // voteId missing
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
      expect(data.details.missingFields.voteId).toBe(true);
      expect(data.details.suggestion).toBeTruthy();
    });

    // Test 2.2: Missing voteHash
    test('should return 400 if voteHash is missing', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          voteId: 'vote-123',
          // voteHash missing
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
      expect(data.details.missingFields.voteHash).toBe(true);
    });

    // Test 2.3: Both fields missing
    test('should return 400 if both fields are missing', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({}),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
      expect(data.details.missingFields.voteId).toBe(true);
      expect(data.details.missingFields.voteHash).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 3: Vote Not Found
  // ============================================================
  describe('Vote Not Found', () => {
    // Test 3.1: Nonexistent vote ID
    test('should return 404 if vote does not exist', async () => {
      prisma.vote.findUnique.mockResolvedValue(null);

      const req = {
        json: jest.fn().mockResolvedValue({
          voteId: 'nonexistent-vote',
          voteHash: 'some-hash',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Vote not found');
      expect(data.details).toHaveProperty('voteId', 'nonexistent-vote');
      expect(data.details.suggestion).toContain('check');
    });
  });

  // ============================================================
  // TEST SUITE 4: Invalid Hash Detection
  // ============================================================
  describe('Invalid Hash Detection', () => {
    // Test 4.1: Incorrect hash
    test('should reject vote with incorrect hash', async () => {
      const voteId = 'vote-123';
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };
      const voteString = JSON.stringify(voteData);
      const encrypted = encryption.hybridEncrypt(voteString);

      // Use wrong hash (hash of different data)
      const wrongData = { ...voteData, candidateId: 'candidate-999' };
      const wrongHash = encryption.generateSecureHash(JSON.stringify(wrongData));

      const mockElection = createMockElection();
      const mockVote = createMockVote({
        id: voteId,
        encryptedData: encrypted.encryptedData,
        encryptedKey: encrypted.encryptedKey,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      });
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      const req = {
        json: jest.fn().mockResolvedValue({
          voteId,
          voteHash: wrongHash,
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid vote hash');
      expect(data.details.possibleIssues).toContain('The provided hash does not match the vote data');
      expect(data.details.suggestions).toBeTruthy();
    });

    // Test 4.2: Tampered vote data detection
    test('should detect tampered vote data', async () => {
      const voteId = 'vote-123';
      
      // Original vote data
      const originalVoteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };
      const originalString = JSON.stringify(originalVoteData);
      const originalHash = encryption.generateSecureHash(originalString);
      
      // Tampered vote data (different candidate)
      const tamperedVoteData = {
        electionId: 'election-123',
        candidateId: 'candidate-999', // Changed!
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };
      const tamperedString = JSON.stringify(tamperedVoteData);
      const encrypted = encryption.hybridEncrypt(tamperedString);

      const mockElection = createMockElection();
      const mockVote = createMockVote({
        id: voteId,
        encryptedData: encrypted.encryptedData,
        encryptedKey: encrypted.encryptedKey,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      });
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      const req = {
        json: jest.fn().mockResolvedValue({
          voteId,
          voteHash: originalHash, // Using original hash with tampered data
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid vote hash');
    });

    // Test 4.3: Completely wrong hash format
    test('should reject completely invalid hash', async () => {
      const voteId = 'vote-123';
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };
      const encrypted = encryption.hybridEncrypt(JSON.stringify(voteData));

      const mockElection = createMockElection();
      const mockVote = createMockVote({
        id: voteId,
        encryptedData: encrypted.encryptedData,
        encryptedKey: encrypted.encryptedKey,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      });
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      const req = {
        json: jest.fn().mockResolvedValue({
          voteId,
          voteHash: 'totally-wrong-hash',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid vote hash');
    });
  });

  // ============================================================
  // TEST SUITE 5: Decryption Errors
  // ============================================================
  describe('Decryption Errors', () => {
    // Test 5.1: Corrupted encrypted data
    test('should handle corrupted encrypted data', async () => {
      const voteId = 'vote-123';

      const mockElection = createMockElection();
      const mockVote = createMockVote({
        id: voteId,
        encryptedData: 'corrupted-base64-data',
        encryptedKey: 'corrupted-key',
        iv: 'corrupted-iv',
        authTag: 'corrupted-auth-tag',
      });
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      const req = {
        json: jest.fn().mockResolvedValue({
          voteId,
          voteHash: 'some-hash',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Failed to verify vote');
      expect(data.details).toHaveProperty('message');
      expect(data.details.possibleCauses).toBeTruthy();
    });

    // Test 5.2: Invalid encrypted key
    test('should handle invalid encrypted key', async () => {
      const voteId = 'vote-123';
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };
      const encrypted = encryption.hybridEncrypt(JSON.stringify(voteData));

      const mockElection = createMockElection();
      const mockVote = createMockVote({
        id: voteId,
        encryptedData: encrypted.encryptedData,
        encryptedKey: Buffer.from('invalid-key').toString('base64'), // Invalid key
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      });
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      const req = {
        json: jest.fn().mockResolvedValue({
          voteId,
          voteHash: 'some-hash',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Failed to verify vote');
    });

    // Test 5.3: Modified auth tag
    test('should detect modified auth tag', async () => {
      const voteId = 'vote-123';
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };
      const encrypted = encryption.hybridEncrypt(JSON.stringify(voteData));

      const mockElection = createMockElection();
      const mockVote = createMockVote({
        id: voteId,
        encryptedData: encrypted.encryptedData,
        encryptedKey: encrypted.encryptedKey,
        iv: encrypted.iv,
        authTag: Buffer.from('modified-auth-tag-00').toString('base64'), // Modified tag
      });
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      const req = {
        json: jest.fn().mockResolvedValue({
          voteId,
          voteHash: 'some-hash',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Failed to verify vote');
      expect(data.details.possibleCauses).toContain('The vote data might be corrupted');
    });
  });

  // ============================================================
  // TEST SUITE 6: Error Handling
  // ============================================================
  describe('Error Handling', () => {
    // Test 6.1: Database error
    test('should handle database errors gracefully', async () => {
      prisma.vote.findUnique.mockRejectedValue(
        new Error('Database connection error')
      );

      const req = {
        json: jest.fn().mockResolvedValue({
          voteId: 'vote-123',
          voteHash: 'some-hash',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
      expect(data.details).toHaveProperty('message');
      expect(data.details.supportInfo).toHaveProperty('errorCode', 'VERIFY_ERROR_500');
    });

    // Test 6.2: Invalid JSON request
    test('should handle invalid JSON request', async () => {
      const req = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  // ============================================================
  // TEST SUITE 7: Complete Verification Flow
  // ============================================================
  describe('Complete Verification Flow', () => {
    // Test 7.1: End-to-end verification flow
    test('should handle complete verification flow correctly', async () => {
      // Step 1: Create vote data
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };

      // Step 2: Generate hash (as done in submitVote)
      const voteString = JSON.stringify(voteData);
      const voteHash = encryption.generateSecureHash(voteString);

      // Step 3: Encrypt data (as done in submitVote)
      const encrypted = encryption.hybridEncrypt(voteString);

      // Step 4: Store vote (simulated)
      const voteId = 'vote-123';
      const mockElection = createMockElection({
        id: 'election-123',
        title: 'Presidential Election 2024',
        status: 'completed',
        endDate: new Date('2024-12-31'),
      });

      const mockVote = createMockVote({
        id: voteId,
        electionId: 'election-123',
        voterId: 'voter-789',
        encryptedData: encrypted.encryptedData,
        encryptedKey: encrypted.encryptedKey,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        isCounted: true,
      });
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      // Step 5: Verify vote (what we're testing)
      const req = {
        json: jest.fn().mockResolvedValue({
          voteId,
          voteHash,
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      // Step 6: Validate verification response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Vote verified successfully');
      
      // Validate returned data
      expect(data.data.voteId).toBe(voteId);
      expect(data.data.electionId).toBe('election-123');
      expect(data.data.electionTitle).toBe('Presidential Election 2024');
      expect(data.data.isCounted).toBe(true);
      expect(data.data.timestamp).toBe('2024-01-15T10:30:00Z');
      
      // Validate verification details
      expect(data.data.verificationDetails.hashAlgorithm).toBe('SHA-512');
      expect(data.data.verificationDetails.method).toContain('AES-256-GCM');
      expect(data.data.verificationDetails.verificationTime).toBeTruthy();
    });

    // Test 7.2: Multiple verifications of same vote
    test('should allow multiple verifications of same vote', async () => {
      const voteId = 'vote-123';
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };
      const voteString = JSON.stringify(voteData);
      const voteHash = encryption.generateSecureHash(voteString);
      const encrypted = encryption.hybridEncrypt(voteString);

      const mockElection = createMockElection();
      const mockVote = createMockVote({
        id: voteId,
        encryptedData: encrypted.encryptedData,
        encryptedKey: encrypted.encryptedKey,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      });
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      // Verify multiple times
      for (let i = 0; i < 3; i++) {
        const req = {
          json: jest.fn().mockResolvedValue({ voteId, voteHash }),
        };

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
      }

      // Verify was called 3 times
      expect(prisma.vote.findUnique).toHaveBeenCalledTimes(3);
    });
  });

  // ============================================================
  // TEST SUITE 8: Edge Cases
  // ============================================================
  describe('Edge Cases', () => {
    // Test 8.1: Empty string values
    test('should handle empty string for voteId', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          voteId: '',
          voteHash: 'some-hash',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    // Test 8.2: Empty string for hash
    test('should handle empty string for voteHash', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          voteId: 'vote-123',
          voteHash: '',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    // Test 8.3: Very long voteId
    test('should handle very long voteId', async () => {
      const longVoteId = 'vote-' + 'x'.repeat(1000);
      
      prisma.vote.findUnique.mockResolvedValue(null);

      const req = {
        json: jest.fn().mockResolvedValue({
          voteId: longVoteId,
          voteHash: 'some-hash',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Vote not found');
    });

    // Test 8.4: Special characters in voteId
    test('should handle special characters in voteId', async () => {
      const specialVoteId = 'vote-!@#$%^&*()';
      
      prisma.vote.findUnique.mockResolvedValue(null);

      const req = {
        json: jest.fn().mockResolvedValue({
          voteId: specialVoteId,
          voteHash: 'some-hash',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Vote not found');
    });
  });

  // ============================================================
  // TEST SUITE 9: Hash Algorithm Verification
  // ============================================================
  describe('Hash Algorithm Verification', () => {
    // Test 9.1: Verify SHA-512 is used
    test('should use SHA-512 hashing algorithm', async () => {
      const voteId = 'vote-123';
      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };
      const voteString = JSON.stringify(voteData);
      const voteHash = encryption.generateSecureHash(voteString);
      const encrypted = encryption.hybridEncrypt(voteString);

      const mockElection = createMockElection();
      const mockVote = createMockVote({
        id: voteId,
        encryptedData: encrypted.encryptedData,
        encryptedKey: encrypted.encryptedKey,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      });
      mockVote.election = mockElection;

      prisma.vote.findUnique.mockResolvedValue(mockVote);

      const req = {
        json: jest.fn().mockResolvedValue({ voteId, voteHash }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.verificationDetails.hashAlgorithm).toBe('SHA-512');
      
      // SHA-512 produces 128 hex characters
      expect(voteHash).toHaveLength(128);
      expect(voteHash).toMatch(/^[a-f0-9]{128}$/);
    });
  });
});

