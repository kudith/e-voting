jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    vote: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/lib/encryption', () => ({
  hybridDecrypt: jest.fn(),
  generateSecureHash: jest.fn(),
}));

import { POST } from '@/app/api/vote/verifyVote/route';
import prisma from '@/lib/prisma';
import { hybridDecrypt, generateSecureHash } from '@/lib/encryption';

const createRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

describe('POST /api/vote/verifyVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 400 when voteId or voteHash is missing', async () => {
    const response = await POST(createRequest({ voteId: 'vote-1' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Missing required fields');
  });

  test('verifies vote when hash matches decrypted data', async () => {
    prisma.vote.findUnique.mockResolvedValue({
      id: 'vote-1',
      electionId: 'election-1',
      encryptedData: 'encrypted',
      encryptedKey: 'key',
      iv: 'iv',
      authTag: 'tag',
      isCounted: true,
      election: {
        status: 'completed',
        title: 'General Election',
        endDate: '2025-01-01T00:00:00Z',
      },
      createdAt: '2024-12-01T00:00:00Z',
    });

    const votePayload = {
      voteId: 'vote-1',
      candidateId: 'candidate-1',
      voterId: 'voter-1',
      timestamp: '2024-12-01T00:00:00Z',
    };

    hybridDecrypt.mockReturnValue(JSON.stringify(votePayload));
    generateSecureHash.mockReturnValueOnce('expected-hash');

    const response = await POST(createRequest({ voteId: 'vote-1', voteHash: 'expected-hash' }));
    const payload = await response.json();

    expect(prisma.vote.findUnique).toHaveBeenCalledWith({
      where: { id: 'vote-1' },
      include: { election: true },
    });
    expect(hybridDecrypt).toHaveBeenCalled();
    expect(generateSecureHash).toHaveBeenCalledWith(JSON.stringify(votePayload));

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data.voteId).toBe('vote-1');
  });
});

