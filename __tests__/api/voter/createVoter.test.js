jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    faculty: {
      findUnique: jest.fn(),
    },
    major: {
      findUnique: jest.fn(),
    },
    voter: {
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { POST } from '@/app/api/voter/createVoter/route';
import prisma from '@/lib/prisma';

const createRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

describe('POST /api/voter/createVoter', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.KINDE_API_URL = 'https://kinde.example.com';
    process.env.KINDE_API_KEY = 'secret';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    delete global.fetch;
  });

  test('creates voter and returns 201 when payload is valid', async () => {
    prisma.faculty.findUnique.mockResolvedValue({ id: 'faculty-1', name: 'Engineering' });
    prisma.major.findUnique.mockResolvedValue({
      id: 'major-1',
      name: 'Software',
      facultyId: 'faculty-1',
    });
    prisma.voter.count.mockResolvedValue(0);
    prisma.voter.create.mockResolvedValue({ id: 'voter-1' });

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'kinde-user-1' }),
    });

    const response = await POST(
      createRequest({
        name: 'Budi Gunawan',
        email: 'budi@example.com',
        phone: '081234567890',
        facultyId: 'faculty-1',
        majorId: 'major-1',
        year: '2024',
        status: 'active',
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.message).toBe('Voter created successfully');
    expect(prisma.voter.create).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/user'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  test('returns 400 when validation fails', async () => {
    const response = await POST(
      createRequest({
        name: 'A',
        email: 'invalid-email',
        phone: '123',
        facultyId: '',
        majorId: '',
        year: '20',
        status: 'inactive',
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(Array.isArray(payload.errors)).toBe(true);
    expect(payload.errors.length).toBeGreaterThan(0);
    expect(prisma.faculty.findUnique).not.toHaveBeenCalled();
  });
});

