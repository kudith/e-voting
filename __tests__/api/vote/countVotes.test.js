// __tests__/api/vote/countVotes.test.js
// Integration tests untuk app/api/vote/countVotes/route.js
// Testing: vote counting dengan berbagai skenario

import { POST } from '@/app/api/vote/countVotes/route';
import * as encryption from '@/lib/encryption';
import {
  createMockElection,
  createMockCandidate,
  createMockVote,
} from '@/__tests__/setup/prisma-mock';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    election: {
      findUnique: jest.fn(),
    },
    vote: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    candidate: {
      update: jest.fn(),
    },
  },
}));

import prisma from '@/lib/prisma';

describe('POST /api/vote/countVotes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // TEST SUITE 1: Successful Vote Counting
  // ============================================================
  describe('Successful Vote Counting', () => {
    // Test 1.1: Count votes for completed election
    test('should count votes successfully for completed election', async () => {
      const electionId = 'election-123';
      const candidateId1 = 'candidate-456';
      const candidateId2 = 'candidate-789';

      // Mock election (completed)
      const mockElection = createMockElection({
        id: electionId,
        status: 'completed',
      });

      // Mock vote data
      const voteData1 = {
        electionId,
        candidateId: candidateId1,
        voterId: 'voter-001',
        timestamp: new Date().toISOString(),
      };

      const voteData2 = {
        electionId,
        candidateId: candidateId2,
        voterId: 'voter-002',
        timestamp: new Date().toISOString(),
      };

      const voteData3 = {
        electionId,
        candidateId: candidateId1,
        voterId: 'voter-003',
        timestamp: new Date().toISOString(),
      };

      // Create encrypted votes
      const encrypted1 = encryption.hybridEncrypt(JSON.stringify(voteData1));
      const encrypted2 = encryption.hybridEncrypt(JSON.stringify(voteData2));
      const encrypted3 = encryption.hybridEncrypt(JSON.stringify(voteData3));

      const uncountedVotes = [
        createMockVote({
          id: 'vote-001',
          electionId,
          voterId: 'voter-001',
          encryptedData: encrypted1.encryptedData,
          encryptedKey: encrypted1.encryptedKey,
          iv: encrypted1.iv,
          authTag: encrypted1.authTag,
          isCounted: false,
        }),
        createMockVote({
          id: 'vote-002',
          electionId,
          voterId: 'voter-002',
          encryptedData: encrypted2.encryptedData,
          encryptedKey: encrypted2.encryptedKey,
          iv: encrypted2.iv,
          authTag: encrypted2.authTag,
          isCounted: false,
        }),
        createMockVote({
          id: 'vote-003',
          electionId,
          voterId: 'voter-003',
          encryptedData: encrypted3.encryptedData,
          encryptedKey: encrypted3.encryptedKey,
          iv: encrypted3.iv,
          authTag: encrypted3.authTag,
          isCounted: false,
        }),
      ];

      // Mock Prisma responses
      prisma.election.findUnique.mockResolvedValue(mockElection);
      prisma.vote.findMany.mockResolvedValue(uncountedVotes);
      prisma.vote.update.mockResolvedValue({});
      prisma.candidate.update.mockResolvedValue({});

      // Create request
      const req = {
        json: jest.fn().mockResolvedValue({ electionId }),
      };

      // Execute
      const response = await POST(req);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Votes counted successfully');
      expect(data.data.totalVotesCounted).toBe(3);
      expect(data.data.voteCounts[candidateId1]).toBe(2);
      expect(data.data.voteCounts[candidateId2]).toBe(1);
      expect(data.data.voteDetails).toHaveLength(3);

      // Verify all votes were marked as counted
      expect(prisma.vote.update).toHaveBeenCalledTimes(3);
      
      // Verify candidate vote counts were updated
      expect(prisma.candidate.update).toHaveBeenCalledTimes(2);
    });

    // Test 1.2: No uncounted votes
    test('should handle election with no uncounted votes', async () => {
      const electionId = 'election-123';

      const mockElection = createMockElection({
        id: electionId,
        status: 'completed',
      });

      prisma.election.findUnique.mockResolvedValue(mockElection);
      prisma.vote.findMany.mockResolvedValue([]); // No uncounted votes

      const req = {
        json: jest.fn().mockResolvedValue({ electionId }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.totalVotesCounted).toBe(0);
      expect(data.data.voteCounts).toEqual({});
      expect(data.data.voteDetails).toEqual([]);
    });

    // Test 1.3: Multiple votes for single candidate
    test('should correctly count multiple votes for same candidate', async () => {
      const electionId = 'election-123';
      const candidateId = 'candidate-456';

      const mockElection = createMockElection({
        id: electionId,
        status: 'completed',
      });

      // Create 5 votes for same candidate
      const uncountedVotes = [];
      for (let i = 0; i < 5; i++) {
        const voteData = {
          electionId,
          candidateId,
          voterId: `voter-${i}`,
          timestamp: new Date().toISOString(),
        };
        const encrypted = encryption.hybridEncrypt(JSON.stringify(voteData));
        
        uncountedVotes.push(
          createMockVote({
            id: `vote-${i}`,
            electionId,
            voterId: `voter-${i}`,
            encryptedData: encrypted.encryptedData,
            encryptedKey: encrypted.encryptedKey,
            iv: encrypted.iv,
            authTag: encrypted.authTag,
            isCounted: false,
          })
        );
      }

      prisma.election.findUnique.mockResolvedValue(mockElection);
      prisma.vote.findMany.mockResolvedValue(uncountedVotes);
      prisma.vote.update.mockResolvedValue({});
      prisma.candidate.update.mockResolvedValue({});

      const req = {
        json: jest.fn().mockResolvedValue({ electionId }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.totalVotesCounted).toBe(5);
      expect(data.data.voteCounts[candidateId]).toBe(5);
      expect(data.data.voteDetails).toHaveLength(5);
    });
  });

  // ============================================================
  // TEST SUITE 2: Validation Errors
  // ============================================================
  describe('Validation Errors', () => {
    // Test 2.1: Missing electionId
    test('should return 400 if electionId is missing', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({}),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing electionId');
      expect(data.details.suggestion).toBeTruthy();
    });

    // Test 2.2: Election not found
    test('should return 404 if election does not exist', async () => {
      prisma.election.findUnique.mockResolvedValue(null);

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId: 'nonexistent-election',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Election not found');
      expect(data.details).toHaveProperty('electionId');
    });

    // Test 2.3: Election not completed
    test('should return 400 if election is not completed', async () => {
      const mockElection = createMockElection({
        status: 'ongoing', // Not completed
      });

      prisma.election.findUnique.mockResolvedValue(mockElection);

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId: 'election-123',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Election is not completed yet');
      expect(data.details.currentStatus).toBe('ongoing');
    });

    // Test 2.4: Election status upcoming
    test('should return 400 if election status is upcoming', async () => {
      const mockElection = createMockElection({
        status: 'upcoming',
      });

      prisma.election.findUnique.mockResolvedValue(mockElection);

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId: 'election-123',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Election is not completed yet');
      expect(data.details.currentStatus).toBe('upcoming');
    });
  });

  // ============================================================
  // TEST SUITE 3: Decryption and Data Integrity
  // ============================================================
  describe('Decryption and Data Integrity', () => {
    // Test 3.1: Successfully decrypt votes
    test('should successfully decrypt all votes', async () => {
      const electionId = 'election-123';
      const candidateId = 'candidate-456';

      const mockElection = createMockElection({
        id: electionId,
        status: 'completed',
      });

      // Create vote with known data
      const voteData = {
        electionId,
        candidateId,
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      };

      const encrypted = encryption.hybridEncrypt(JSON.stringify(voteData));

      const uncountedVotes = [
        createMockVote({
          id: 'vote-123',
          electionId,
          voterId: 'voter-789',
          encryptedData: encrypted.encryptedData,
          encryptedKey: encrypted.encryptedKey,
          iv: encrypted.iv,
          authTag: encrypted.authTag,
          isCounted: false,
        }),
      ];

      prisma.election.findUnique.mockResolvedValue(mockElection);
      prisma.vote.findMany.mockResolvedValue(uncountedVotes);
      prisma.vote.update.mockResolvedValue({});
      prisma.candidate.update.mockResolvedValue({});

      const req = {
        json: jest.fn().mockResolvedValue({ electionId }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.voteDetails[0]).toEqual({
        voteId: 'vote-123',
        candidateId,
        voterId: 'voter-789',
        timestamp: '2024-01-15T10:30:00Z',
      });
    });

    // Test 3.2: Handle corrupted vote data gracefully
    test('should skip corrupted votes and continue counting', async () => {
      const electionId = 'election-123';
      const candidateId1 = 'candidate-456';
      const candidateId2 = 'candidate-789';

      const mockElection = createMockElection({
        id: electionId,
        status: 'completed',
      });

      // Valid vote 1
      const voteData1 = {
        electionId,
        candidateId: candidateId1,
        voterId: 'voter-001',
        timestamp: new Date().toISOString(),
      };
      const encrypted1 = encryption.hybridEncrypt(JSON.stringify(voteData1));

      // Valid vote 2
      const voteData2 = {
        electionId,
        candidateId: candidateId2,
        voterId: 'voter-003',
        timestamp: new Date().toISOString(),
      };
      const encrypted2 = encryption.hybridEncrypt(JSON.stringify(voteData2));

      const uncountedVotes = [
        createMockVote({
          id: 'vote-001',
          electionId,
          voterId: 'voter-001',
          encryptedData: encrypted1.encryptedData,
          encryptedKey: encrypted1.encryptedKey,
          iv: encrypted1.iv,
          authTag: encrypted1.authTag,
          isCounted: false,
        }),
        createMockVote({
          id: 'vote-002-corrupted',
          electionId,
          voterId: 'voter-002',
          encryptedData: 'corrupted-data',
          encryptedKey: 'corrupted-key',
          iv: 'corrupted-iv',
          authTag: 'corrupted-tag',
          isCounted: false,
        }),
        createMockVote({
          id: 'vote-003',
          electionId,
          voterId: 'voter-003',
          encryptedData: encrypted2.encryptedData,
          encryptedKey: encrypted2.encryptedKey,
          iv: encrypted2.iv,
          authTag: encrypted2.authTag,
          isCounted: false,
        }),
      ];

      prisma.election.findUnique.mockResolvedValue(mockElection);
      prisma.vote.findMany.mockResolvedValue(uncountedVotes);
      prisma.vote.update.mockResolvedValue({});
      prisma.candidate.update.mockResolvedValue({});

      const req = {
        json: jest.fn().mockResolvedValue({ electionId }),
      };

      const response = await POST(req);
      const data = await response.json();

      // Should successfully count valid votes despite corrupted one
      expect(response.status).toBe(200);
      expect(data.data.voteDetails).toHaveLength(2); // Only 2 valid votes
      expect(data.data.voteCounts[candidateId1]).toBe(1);
      expect(data.data.voteCounts[candidateId2]).toBe(1);
    });

    // Test 3.3: Verify vote details are correctly extracted
    test('should extract correct vote details from encrypted data', async () => {
      const electionId = 'election-123';

      const mockElection = createMockElection({
        id: electionId,
        status: 'completed',
      });

      const voteData = {
        electionId: 'election-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T12:00:00Z',
      };

      const encrypted = encryption.hybridEncrypt(JSON.stringify(voteData));

      const uncountedVotes = [
        createMockVote({
          id: 'vote-123',
          electionId,
          encryptedData: encrypted.encryptedData,
          encryptedKey: encrypted.encryptedKey,
          iv: encrypted.iv,
          authTag: encrypted.authTag,
          isCounted: false,
        }),
      ];

      prisma.election.findUnique.mockResolvedValue(mockElection);
      prisma.vote.findMany.mockResolvedValue(uncountedVotes);
      prisma.vote.update.mockResolvedValue({});
      prisma.candidate.update.mockResolvedValue({});

      const req = {
        json: jest.fn().mockResolvedValue({ electionId }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.voteDetails[0]).toMatchObject({
        voteId: 'vote-123',
        candidateId: 'candidate-456',
        voterId: 'voter-789',
        timestamp: '2024-01-15T12:00:00Z',
      });
    });
  });

  // ============================================================
  // TEST SUITE 4: Vote Status Update
  // ============================================================
  describe('Vote Status Update', () => {
    // Test 4.1: All votes should be marked as counted
    test('should mark all votes as counted', async () => {
      const electionId = 'election-123';
      const mockElection = createMockElection({
        id: electionId,
        status: 'completed',
      });

      // Create 3 uncounted votes
      const uncountedVotes = [];
      for (let i = 0; i < 3; i++) {
        const voteData = {
          electionId,
          candidateId: 'candidate-456',
          voterId: `voter-${i}`,
          timestamp: new Date().toISOString(),
        };
        const encrypted = encryption.hybridEncrypt(JSON.stringify(voteData));
        
        uncountedVotes.push(
          createMockVote({
            id: `vote-${i}`,
            electionId,
            encryptedData: encrypted.encryptedData,
            encryptedKey: encrypted.encryptedKey,
            iv: encrypted.iv,
            authTag: encrypted.authTag,
            isCounted: false,
          })
        );
      }

      prisma.election.findUnique.mockResolvedValue(mockElection);
      prisma.vote.findMany.mockResolvedValue(uncountedVotes);
      prisma.vote.update.mockResolvedValue({});
      prisma.candidate.update.mockResolvedValue({});

      const req = {
        json: jest.fn().mockResolvedValue({ electionId }),
      };

      await POST(req);

      // Verify vote.update was called for each vote
      expect(prisma.vote.update).toHaveBeenCalledTimes(3);
      
      // Verify each call had correct parameters
      for (let i = 0; i < 3; i++) {
        expect(prisma.vote.update).toHaveBeenCalledWith({
          where: { id: `vote-${i}` },
          data: { isCounted: true },
        });
      }
    });
  });

  // ============================================================
  // TEST SUITE 5: Candidate Vote Count Update
  // ============================================================
  describe('Candidate Vote Count Update', () => {
    // Test 5.1: Should update candidate vote counts correctly
    test('should increment candidate vote counts correctly', async () => {
      const electionId = 'election-123';
      const candidateId1 = 'candidate-456';
      const candidateId2 = 'candidate-789';

      const mockElection = createMockElection({
        id: electionId,
        status: 'completed',
      });

      // 3 votes for candidate1, 2 votes for candidate2
      const voteDistribution = [
        { candidateId: candidateId1, voterId: 'voter-1' },
        { candidateId: candidateId1, voterId: 'voter-2' },
        { candidateId: candidateId1, voterId: 'voter-3' },
        { candidateId: candidateId2, voterId: 'voter-4' },
        { candidateId: candidateId2, voterId: 'voter-5' },
      ];

      const uncountedVotes = voteDistribution.map((vote, index) => {
        const voteData = {
          electionId,
          candidateId: vote.candidateId,
          voterId: vote.voterId,
          timestamp: new Date().toISOString(),
        };
        const encrypted = encryption.hybridEncrypt(JSON.stringify(voteData));
        
        return createMockVote({
          id: `vote-${index}`,
          electionId,
          voterId: vote.voterId,
          encryptedData: encrypted.encryptedData,
          encryptedKey: encrypted.encryptedKey,
          iv: encrypted.iv,
          authTag: encrypted.authTag,
          isCounted: false,
        });
      });

      prisma.election.findUnique.mockResolvedValue(mockElection);
      prisma.vote.findMany.mockResolvedValue(uncountedVotes);
      prisma.vote.update.mockResolvedValue({});
      prisma.candidate.update.mockResolvedValue({});

      const req = {
        json: jest.fn().mockResolvedValue({ electionId }),
      };

      await POST(req);

      // Verify candidate update was called for each candidate
      expect(prisma.candidate.update).toHaveBeenCalledWith({
        where: { id: candidateId1 },
        data: { voteCount: { increment: 3 } },
      });

      expect(prisma.candidate.update).toHaveBeenCalledWith({
        where: { id: candidateId2 },
        data: { voteCount: { increment: 2 } },
      });
    });
  });

  // ============================================================
  // TEST SUITE 6: Error Handling
  // ============================================================
  describe('Error Handling', () => {
    // Test 6.1: Database error
    test('should handle database errors gracefully', async () => {
      prisma.election.findUnique.mockRejectedValue(
        new Error('Database connection error')
      );

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId: 'election-123',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
      expect(data.details).toHaveProperty('message');
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

    // Test 6.3: Vote query error
    test('should handle vote query errors', async () => {
      const mockElection = createMockElection({ status: 'completed' });
      
      prisma.election.findUnique.mockResolvedValue(mockElection);
      prisma.vote.findMany.mockRejectedValue(new Error('Query failed'));

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId: 'election-123',
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  // ============================================================
  // TEST SUITE 7: Edge Cases
  // ============================================================
  describe('Edge Cases', () => {
    // Test 7.1: Empty election ID
    test('should handle empty election ID', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({ electionId: '' }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing electionId');
    });

    // Test 7.2: Null election ID
    test('should handle null election ID', async () => {
      const req = {
        json: jest.fn().mockResolvedValue({ electionId: null }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing electionId');
    });

    // Test 7.3: Large number of votes
    test('should handle large number of votes', async () => {
      const electionId = 'election-123';
      const mockElection = createMockElection({
        id: electionId,
        status: 'completed',
      });

      // Create 100 votes
      const uncountedVotes = [];
      const candidateIds = ['candidate-1', 'candidate-2', 'candidate-3'];
      
      for (let i = 0; i < 100; i++) {
        const candidateId = candidateIds[i % 3];
        const voteData = {
          electionId,
          candidateId,
          voterId: `voter-${i}`,
          timestamp: new Date().toISOString(),
        };
        const encrypted = encryption.hybridEncrypt(JSON.stringify(voteData));
        
        uncountedVotes.push(
          createMockVote({
            id: `vote-${i}`,
            electionId,
            encryptedData: encrypted.encryptedData,
            encryptedKey: encrypted.encryptedKey,
            iv: encrypted.iv,
            authTag: encrypted.authTag,
            isCounted: false,
          })
        );
      }

      prisma.election.findUnique.mockResolvedValue(mockElection);
      prisma.vote.findMany.mockResolvedValue(uncountedVotes);
      prisma.vote.update.mockResolvedValue({});
      prisma.candidate.update.mockResolvedValue({});

      const req = {
        json: jest.fn().mockResolvedValue({ electionId }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.totalVotesCounted).toBe(100);
      
      // Each candidate should have roughly 33-34 votes
      expect(data.data.voteCounts['candidate-1']).toBeGreaterThanOrEqual(33);
      expect(data.data.voteCounts['candidate-2']).toBeGreaterThanOrEqual(33);
      expect(data.data.voteCounts['candidate-3']).toBeGreaterThanOrEqual(33);
    });
  });
});

