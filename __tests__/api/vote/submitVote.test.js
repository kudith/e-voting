jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    election: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    vote: {
      findFirst: jest.fn(),
    },
    voterElection: {
      findUnique: jest.fn(),
    },
    electionStatistics: {
      upsert: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock('@/lib/encryption', () => ({
  hybridEncrypt: jest.fn(() => ({
    encryptedData: 'encrypted-data',
    encryptedKey: 'encrypted-key',
    iv: 'iv',
    authTag: 'auth-tag',
  })),
  generateSecureHash: jest.fn(() => 'hash'),
}));

import { POST } from '@/app/api/vote/submitVote/route';
import prisma from '@/lib/prisma';
import { hybridEncrypt, generateSecureHash } from '@/lib/encryption';

const createRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

describe('POST /api/vote/submitVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 400 when required fields are missing', async () => {
    const response = await POST(createRequest({ electionId: null }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Missing required fields');
  });

  test('returns 404 when election does not exist', async () => {
    prisma.election.findUnique.mockResolvedValueOnce(null);

    const response = await POST(
      createRequest({
        electionId: 'e-1',
        candidateId: 'c-1',
        voterId: 'v-1',
      }),
    );
    const payload = await response.json();

    expect(prisma.election.findUnique).toHaveBeenCalledWith({ where: { id: 'e-1' } });
    expect(response.status).toBe(404);
    expect(payload.error).toBe('Election not found');
  });

  test('submits a vote successfully for eligible voter', async () => {
    const electionId = 'election-1';
    const candidateId = 'candidate-1';
    const voterId = 'voter-1';

    const election = {
      id: electionId,
      status: 'ongoing',
      startDate: new Date(Date.now() - 1_000).toISOString(),
      endDate: new Date(Date.now() + 60_000).toISOString(),
    };

    prisma.election.findUnique
      .mockResolvedValueOnce(election) // validation
      .mockResolvedValueOnce({
        ...election,
        voterElections: [{ isEligible: true, hasVoted: true }],
        candidates: [{ id: candidateId }],
      }); // statistics

    prisma.vote.findFirst.mockResolvedValue(null);
    prisma.voterElection.findUnique.mockResolvedValue({
      voterId,
      electionId,
      isEligible: true,
      hasVoted: false,
    });

    prisma.$transaction.mockImplementation(async (callback) =>
      callback({
        vote: {
          create: jest.fn().mockResolvedValue({
            id: 'vote-1',
            encryptedData: 'encrypted-data',
          }),
        },
        voterElection: { update: jest.fn().mockResolvedValue({}) },
        election: { update: jest.fn().mockResolvedValue({}) },
        candidate: { update: jest.fn().mockResolvedValue({}) },
      }),
    );

    const response = await POST(
      createRequest({
        electionId,
        candidateId,
        voterId,
      }),
    );
    const payload = await response.json();

    expect(generateSecureHash).toHaveBeenCalled();
    expect(hybridEncrypt).toHaveBeenCalled();
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(prisma.electionStatistics.upsert).toHaveBeenCalled();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data.voteId).toBe('vote-1');
    expect(payload.data.voteHash).toBe('hash');
  });
});

