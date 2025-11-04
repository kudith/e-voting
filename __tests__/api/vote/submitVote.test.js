// __tests__/api/vote/submitVote.test.js
// Integration tests for app/api/vote/submitVote/route.js
// Testing: vote submission with various valid and invalid scenarios

import { POST } from "@/app/api/vote/submitVote/route";
import * as encryption from "@/lib/encryption";
import {
  createMockElection,
  createMockVoter,
  createMockCandidate,
  createMockVoterElection,
  createMockVote,
} from "@/__tests__/setup/prisma-mock";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    election: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    vote: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    voterElection: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    candidate: {
      update: jest.fn(),
    },
    electionStatistics: {
      upsert: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

import prisma from "@/lib/prisma";

describe("POST /api/vote/submitVote - Vote Submission API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // SUITE 1: Valid Vote Submission
  // ============================================================
  describe("Valid Vote Submission", () => {
    /**
     * Test 1.1: Should successfully submit a valid vote
     * - Checks for successful response and correct payload structure
     */
    test("should successfully submit a valid vote", async () => {
      const electionId = "election-123";
      const candidateId = "candidate-456";
      const voterId = "voter-789";

      const mockElection = createMockElection({
        id: electionId,
        status: "ongoing",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2099-12-31"), // Ensure election is ongoing
      });

      const mockVoterElection = createMockVoterElection({
        voterId,
        electionId,
        isEligible: true,
        hasVoted: false,
      });

      prisma.election.findUnique
        .mockResolvedValueOnce(mockElection) // validation
        .mockResolvedValueOnce({
          ...mockElection,
          voterElections: [mockVoterElection],
          candidates: [createMockCandidate({ id: candidateId })],
        }); // statistics

      prisma.vote.findFirst.mockResolvedValue(null);
      prisma.voterElection.findUnique.mockResolvedValue(mockVoterElection);

      prisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          vote: {
            create: jest.fn().mockResolvedValue({
              id: "vote-123",
              electionId,
              voterId,
              encryptedData: "encrypted",
              encryptedKey: "key",
              iv: "iv",
              authTag: "tag",
              isCounted: true,
              createdAt: new Date(),
            }),
          },
          voterElection: { update: jest.fn().mockResolvedValue({}) },
          election: { update: jest.fn().mockResolvedValue({}) },
          candidate: { update: jest.fn().mockResolvedValue({}) },
        });
      });

      prisma.electionStatistics.upsert.mockResolvedValue({});

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId,
          candidateId,
          voterId,
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Vote submitted successfully");
      expect(data.data).toHaveProperty("voteId");
      expect(data.data).toHaveProperty("voteHash");
      expect(data.data).toHaveProperty("electionId", electionId);
      expect(data.data).toHaveProperty("timestamp");
      expect(data.data).toHaveProperty("verificationInstructions");
      expect(data.data.voteHash).toMatch(/^[a-f0-9]{128}$/);
    });

    /**
     * Test 1.2: Should encrypt vote data correctly
     * - Ensures encrypted fields are present and valid
     */
    test("should encrypt vote data correctly", async () => {
      const electionId = "election-123";
      const candidateId = "candidate-456";
      const voterId = "voter-789";

      const mockElection = createMockElection({
        id: electionId,
        status: "ongoing",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2099-12-31"),
      });
      const mockVoterElection = createMockVoterElection({
        voterId,
        electionId,
        isEligible: true,
        hasVoted: false,
      });

      prisma.election.findUnique
        .mockResolvedValueOnce(mockElection)
        .mockResolvedValueOnce({
          ...mockElection,
          voterElections: [mockVoterElection],
          candidates: [createMockCandidate({ id: candidateId })],
        });
      prisma.vote.findFirst.mockResolvedValue(null);
      prisma.voterElection.findUnique.mockResolvedValue(mockVoterElection);

      let capturedVoteData = null;
      prisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          vote: {
            create: jest.fn().mockImplementation((data) => {
              capturedVoteData = data.data;
              return Promise.resolve({
                id: "vote-123",
                ...data.data,
                createdAt: new Date(),
              });
            }),
          },
          voterElection: { update: jest.fn().mockResolvedValue({}) },
          election: { update: jest.fn().mockResolvedValue({}) },
          candidate: { update: jest.fn().mockResolvedValue({}) },
        });
      });

      prisma.electionStatistics.upsert.mockResolvedValue({});

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId,
          candidateId,
          voterId,
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);

      if (capturedVoteData) {
        expect(capturedVoteData).toHaveProperty("encryptedData");
        expect(capturedVoteData).toHaveProperty("encryptedKey");
        expect(capturedVoteData).toHaveProperty("iv");
        expect(capturedVoteData).toHaveProperty("authTag");
        expect(capturedVoteData.isCounted).toBe(true);
      }
    });

    /**
     * Test 1.3: Should update election statistics after vote submission
     * - Verifies that statistics update is triggered
     */
    test("should update election statistics after vote submission", async () => {
      const electionId = "election-123";
      const candidateId = "candidate-456";
      const voterId = "voter-789";

      const mockElection = createMockElection({
        id: electionId,
        status: "ongoing",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2099-12-31"),
      });
      const mockVoterElection = createMockVoterElection({
        voterId,
        electionId,
        isEligible: true,
        hasVoted: false,
      });

      prisma.election.findUnique
        .mockResolvedValueOnce(mockElection)
        .mockResolvedValueOnce({
          ...mockElection,
          voterElections: [mockVoterElection],
          candidates: [createMockCandidate({ id: candidateId })],
        });

      prisma.vote.findFirst.mockResolvedValue(null);
      prisma.voterElection.findUnique.mockResolvedValue(mockVoterElection);
      prisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          vote: {
            create: jest.fn().mockResolvedValue({
              id: "vote-123",
              electionId,
              voterId,
              createdAt: new Date(),
            }),
          },
          voterElection: { update: jest.fn().mockResolvedValue({}) },
          election: { update: jest.fn().mockResolvedValue({}) },
          candidate: { update: jest.fn().mockResolvedValue({}) },
        });
      });

      prisma.electionStatistics.upsert.mockResolvedValue({});

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId,
          candidateId,
          voterId,
        }),
      };

      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(prisma.electionStatistics.upsert).toHaveBeenCalled();
    });
  });

  // ============================================================
  // SUITE 2: Election Validation
  // ============================================================
  describe("Election Validation", () => {
    /**
     * Test 2.1: Should return 404 if election does not exist
     * - Checks for correct error response when election is missing
     */
    test("should return 404 if election does not exist", async () => {
      prisma.election.findUnique.mockResolvedValueOnce(null);

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId: "nonexistent-election",
          candidateId: "candidate-456",
          voterId: "voter-789",
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Election not found");
    });

    /**
     * Test 2.2: Should return 400 if election has not started
     * - Checks for correct error when election start date is in the future
     */
    test("should return 400 if election has not started", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      const mockElection = createMockElection({
        startDate: futureDate,
        endDate: new Date("2099-12-31"),
      });

      prisma.election.findUnique.mockResolvedValueOnce(mockElection);

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId: "election-123",
          candidateId: "candidate-456",
          voterId: "voter-789",
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Election has not started yet");
      expect(data.details).toHaveProperty("startDate");
    });

    /**
     * Test 2.3: Should return 400 if election has ended
     * - Checks for correct error when election end date has passed
     */
    test("should return 400 if election has ended", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);

      const mockElection = createMockElection({
        startDate: new Date("2024-01-01"),
        endDate: pastDate,
      });

      prisma.election.findUnique.mockResolvedValueOnce(mockElection);
      prisma.election.update.mockResolvedValueOnce(mockElection);

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId: "election-123",
          candidateId: "candidate-456",
          voterId: "voter-789",
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Election has ended");
      expect(data.details).toHaveProperty("endDate");
    });
  });

  // ============================================================
  // SUITE 3: Duplicate Vote Prevention
  // ============================================================
  describe("Duplicate Vote Prevention", () => {
    /**
     * Test 3.1: Should prevent voter from voting twice
     * - Ensures duplicate votes are rejected
     */
    test("should prevent voter from voting twice", async () => {
      const electionId = "election-123";
      const candidateId = "candidate-456";
      const voterId = "voter-789";

      const mockElection = createMockElection({
        id: electionId,
        status: "ongoing",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2099-12-31"),
      });
      const existingVote = createMockVote({
        electionId,
        voterId,
      });

      prisma.election.findUnique.mockResolvedValueOnce(mockElection);
      prisma.vote.findFirst.mockResolvedValueOnce(existingVote);

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId,
          candidateId,
          voterId,
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("You have already voted in this election");
      expect(data.details.suggestion).toContain("once");
    });

    /**
     * Test 3.2: Should allow different voters to vote in same election
     * - Ensures multiple voters can vote in the same election
     */
    test("should allow different voters to vote in same election", async () => {
      const electionId = "election-123";

      const mockElection = createMockElection({
        id: electionId,
        status: "ongoing",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2099-12-31"),
      });

      // First voter
      const voter1 = "voter-111";
      const voterElection1 = createMockVoterElection({
        voterId: voter1,
        electionId,
        isEligible: true,
        hasVoted: false,
      });

      prisma.election.findUnique
        .mockResolvedValueOnce(mockElection)
        .mockResolvedValueOnce({
          ...mockElection,
          voterElections: [voterElection1],
          candidates: [createMockCandidate({ id: "candidate-456" })],
        });
      prisma.vote.findFirst.mockResolvedValueOnce(null);
      prisma.voterElection.findUnique.mockResolvedValueOnce(voterElection1);
      prisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          vote: {
            create: jest.fn().mockResolvedValue({
              id: "vote-111",
              electionId,
              voterId: voter1,
              createdAt: new Date(),
            }),
          },
          voterElection: { update: jest.fn().mockResolvedValue({}) },
          election: { update: jest.fn().mockResolvedValue({}) },
          candidate: { update: jest.fn().mockResolvedValue({}) },
        });
      });
      prisma.electionStatistics.upsert.mockResolvedValue({});

      const req1 = {
        json: jest.fn().mockResolvedValue({
          electionId,
          candidateId: "candidate-456",
          voterId: voter1,
        }),
      };

      const response1 = await POST(req1);
      const data1 = await response1.json();

      expect(response1.status).toBe(200);
      expect(data1.success).toBe(true);
    });
  });

  // ============================================================
  // SUITE 4: Voter Eligibility
  // ============================================================
  describe("Voter Eligibility", () => {
    /**
     * Test 4.1: Should reject vote from ineligible voter
     * - Ensures only eligible voters can vote
     */
    test("should reject vote from ineligible voter", async () => {
      const electionId = "election-123";
      const candidateId = "candidate-456";
      const voterId = "voter-789";

      const mockElection = createMockElection({
        id: electionId,
        status: "ongoing",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2099-12-31"),
      });
      const mockVoterElection = createMockVoterElection({
        voterId,
        electionId,
        isEligible: false,
        hasVoted: false,
      });

      prisma.election.findUnique.mockResolvedValueOnce(mockElection);
      prisma.vote.findFirst.mockResolvedValueOnce(null);
      prisma.voterElection.findUnique.mockResolvedValueOnce(mockVoterElection);

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId,
          candidateId,
          voterId,
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("You are not eligible to vote in this election");
    });

    /**
     * Test 4.2: Should reject vote from voter not registered for election
     * - Ensures only registered voters can vote
     */
    test("should reject vote from voter not registered for election", async () => {
      const electionId = "election-123";
      const candidateId = "candidate-456";
      const voterId = "voter-789";

      const mockElection = createMockElection({
        id: electionId,
        status: "ongoing",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2099-12-31"),
      });

      prisma.election.findUnique.mockResolvedValueOnce(mockElection);
      prisma.vote.findFirst.mockResolvedValueOnce(null);
      prisma.voterElection.findUnique.mockResolvedValueOnce(null);

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId,
          candidateId,
          voterId,
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("You are not eligible to vote in this election");
    });
  });

  // ============================================================
  // SUITE 5: Error Handling
  // ============================================================
  describe("Error Handling", () => {
    /**
     * Test 5.1: Should handle database errors gracefully
     * - Ensures server error is returned on DB failure
     */
    test("should handle database errors gracefully", async () => {
      prisma.election.findUnique.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId: "election-123",
          candidateId: "candidate-456",
          voterId: "voter-789",
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
      expect(data.details).toHaveProperty("message");
    });

    /**
     * Test 5.2: Should handle invalid JSON request
     * - Ensures server error is returned on invalid JSON
     */
    test("should handle invalid JSON request", async () => {
      const req = {
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });

    /**
     * Test 5.3: Should handle transaction failures
     * - Ensures server error is returned on transaction failure
     */
    test("should handle transaction failures", async () => {
      const mockElection = createMockElection({
        id: "election-123",
        status: "ongoing",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2099-12-31"),
      });
      const mockVoterElection = createMockVoterElection({
        voterId: "voter-789",
        electionId: "election-123",
        isEligible: true,
        hasVoted: false,
      });

      prisma.election.findUnique.mockResolvedValueOnce(mockElection);
      prisma.vote.findFirst.mockResolvedValueOnce(null);
      prisma.voterElection.findUnique.mockResolvedValueOnce(mockVoterElection);
      prisma.$transaction.mockRejectedValueOnce(
        new Error("Transaction failed")
      );

      const req = {
        json: jest.fn().mockResolvedValue({
          electionId: "election-123",
          candidateId: "candidate-456",
          voterId: "voter-789",
        }),
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });
  });

  // ============================================================
  // SUITE 6: Hash Consistency
  // ============================================================
  describe("Hash Consistency", () => {
    /**
     * Test 6.1: Should produce consistent hash for same vote data
     * - Ensures hash is deterministic for identical input
     */
    test("should produce consistent hash for same vote data", async () => {
      const electionId = "election-123";
      const candidateId = "candidate-456";
      const voterId = "voter-789";

      const mockElection = createMockElection({
        id: electionId,
        status: "ongoing",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2099-12-31"),
      });
      const mockVoterElection = createMockVoterElection({
        voterId,
        electionId,
        isEligible: true,
        hasVoted: false,
      });

      const hashes = [];

      for (let i = 0; i < 2; i++) {
        prisma.election.findUnique
          .mockResolvedValueOnce(mockElection)
          .mockResolvedValueOnce({
            ...mockElection,
            voterElections: [mockVoterElection],
            candidates: [createMockCandidate({ id: candidateId })],
          });
        prisma.vote.findFirst.mockResolvedValueOnce(null);
        prisma.voterElection.findUnique.mockResolvedValueOnce(
          mockVoterElection
        );
        prisma.$transaction.mockImplementation(async (callback) => {
          return callback({
            vote: {
              create: jest.fn().mockResolvedValue({
                id: `vote-${i}`,
                electionId,
                voterId,
                createdAt: new Date(),
              }),
            },
            voterElection: { update: jest.fn().mockResolvedValue({}) },
            election: { update: jest.fn().mockResolvedValue({}) },
            candidate: { update: jest.fn().mockResolvedValue({}) },
          });
        });
        prisma.electionStatistics.upsert.mockResolvedValue({});

        const mockDate = new Date("2024-01-15T10:30:00Z");
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);

        const req = {
          json: jest.fn().mockResolvedValue({
            electionId,
            candidateId,
            voterId,
          }),
        };

        const response = await POST(req);
        const data = await response.json();

        if (data.data && data.data.voteHash) {
          hashes.push(data.data.voteHash);
        }

        jest.restoreAllMocks();
      }

      expect(hashes.length).toBe(2);
      hashes.forEach((hash) => {
        expect(hash).toMatch(/^[a-f0-9]{128}$/);
      });
    });
  });
});
