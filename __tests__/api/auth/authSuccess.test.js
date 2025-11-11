jest.mock('next/server', () => {
  const redirect = jest.fn((url) => ({
    status: 307,
    headers: {
      get: (header) => (header.toLowerCase() === 'location' ? url : null),
    },
  }));

  return {
    NextResponse: {
      redirect,
    },
  };
});

jest.mock('@prisma/client', () => {
  const findUnique = jest.fn();
  const create = jest.fn();

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      voter: {
        findUnique,
        create,
      },
    })),
    __mocks__: {
      findUnique,
      create,
    },
  };
});

const { __mocks__: prismaMocks } = jest.requireMock('@prisma/client');

const getUserMock = jest.fn();

jest.mock('@kinde-oss/kinde-auth-nextjs/server', () => ({
  getKindeServerSession: jest.fn(() => ({
    getUser: getUserMock,
  })),
}));

import { GET } from '@/app/api/auth/succsess/route';
import { NextResponse } from 'next/server';

describe('GET /api/auth/succsess', () => {
  beforeEach(() => {
    NextResponse.redirect.mockClear();
    prismaMocks.findUnique.mockReset();
    prismaMocks.create.mockReset();
    getUserMock.mockReset();
  });

  test('redirects to dashboard when voter exists', async () => {
    getUserMock.mockResolvedValue({
      id: 'kinde-1',
      given_name: 'Andi',
      email: 'andi@example.com',
    });

    prismaMocks.findUnique.mockResolvedValue({ id: 'voter-1' });

    const response = await GET();

    expect(getUserMock).toHaveBeenCalled();
    expect(prismaMocks.findUnique).toHaveBeenCalledWith({
      where: { kindeId: 'kinde-1' },
    });
    expect(prismaMocks.create).not.toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/dashboard');
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/dashboard');
  });

  test('creates voter record when none exists', async () => {
    getUserMock.mockResolvedValue({
      id: 'kinde-2',
      given_name: 'Budi',
      email: 'budi@example.com',
    });

    prismaMocks.findUnique.mockResolvedValue(null);
    prismaMocks.create.mockResolvedValue({ id: 'voter-2' });

    await GET();

    expect(prismaMocks.create).toHaveBeenCalledWith({
      data: {
        kindeId: 'kinde-2',
        nim: '',
        name: 'Budi',
        email: 'budi@example.com',
        voted: false,
        votes: [],
      },
    });
    expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/dashboard');
  });

  test('throws error when user session is unavailable', async () => {
    getUserMock.mockResolvedValue(undefined);

    await expect(GET()).rejects.toThrow(/Autentikasi gagal/);
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });
});

