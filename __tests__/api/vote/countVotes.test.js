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

jest.mock('@/lib/encryption', () => ({
  hybridDecrypt: jest.fn(),
}));

import { POST } from '@/app/api/vote/countVotes/route';
import prisma from '@/lib/prisma';
import { hybridDecrypt } from '@/lib/encryption';

const createRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

describe('POST /api/vote/countVotes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 400 when electionId is missing', async () => {
    const response = await POST(createRequest({}));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Missing electionId');
  });

  test('returns 404 when election cannot be found', async () => {
    prisma.election.findUnique.mockResolvedValue(null);

    const response = await POST(createRequest({ electionId: 'e-1' }));
    const payload = await response.json();

    expect(prisma.election.findUnique).toHaveBeenCalledWith({ where: { id: 'e-1' } });
    expect(response.status).toBe(404);
    expect(payload.error).toBe('Election not found');
  });

  test('counts uncounted votes and updates candidate tallies', async () => {
    prisma.election.findUnique.mockResolvedValue({ id: 'e-1', status: 'completed' });
    prisma.vote.findMany.mockResolvedValue([
      {
        id: 'vote-1',
        encryptedData: 'a',
        encryptedKey: 'k',
        iv: 'iv',
        authTag: 'tag',
      },
      {
        id: 'vote-2',
        encryptedData: 'b',
        encryptedKey: 'k2',
        iv: 'iv2',
        authTag: 'tag2',
      },
    ]);

    hybridDecrypt
      .mockReturnValueOnce(
        JSON.stringify({
          candidateId: 'candidate-1',
          voterId: 'voter-1',
          timestamp: 't1',
        }),
      )
      .mockReturnValueOnce(
        JSON.stringify({
          candidateId: 'candidate-1',
          voterId: 'voter-2',
          timestamp: 't2',
        }),
      );

    prisma.vote.update.mockResolvedValue({});
    prisma.candidate.update.mockResolvedValue({});

    const response = await POST(createRequest({ electionId: 'e-1' }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data.totalVotesCounted).toBe(2);
    expect(payload.data.voteCounts).toEqual({ 'candidate-1': 2 });
    expect(prisma.candidate.update).toHaveBeenCalledWith({
      where: { id: 'candidate-1' },
      data: { voteCount: { increment: 2 } },
    });
  });
});

