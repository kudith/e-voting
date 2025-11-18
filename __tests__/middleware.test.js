jest.mock('next/server', () => {
  const next = jest.fn(() => ({ type: 'next' }));
  const redirect = jest.fn((url) => ({ type: 'redirect', url }));

  return {
    NextResponse: {
      next,
      redirect,
    },
  };
});

const isAuthenticatedMock = jest.fn();
const getClaimMock = jest.fn();
const getUserMock = jest.fn();
const getAccessTokenMock = jest.fn();

jest.mock('@kinde-oss/kinde-auth-nextjs/server', () => ({
  getKindeServerSession: jest.fn(() => ({
    isAuthenticated: isAuthenticatedMock,
    getClaim: getClaimMock,
    getUser: getUserMock,
    getPermission: jest.fn(),
    getAccessToken: getAccessTokenMock,
  })),
}));

import { middleware } from '@/middleware';
import { NextResponse } from 'next/server';

const createRequest = (pathname) => {
  const cloneTarget = { pathname };
  return {
    nextUrl: {
      pathname,
      clone: () => ({ ...cloneTarget }),
    },
  };
};

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('allows admin user with proper permission to proceed', async () => {
    isAuthenticatedMock.mockResolvedValue(true);
    getUserMock.mockResolvedValue({ email: 'admin@example.com' });
    getClaimMock.mockResolvedValue({ value: [{ key: 'admin' }] });
    getAccessTokenMock.mockResolvedValue({ permissions: ['access:admin'] });

    const result = await middleware(createRequest('/admin/dashboard'));

    expect(isAuthenticatedMock).toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toEqual({ type: 'next' });
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  test('redirects unauthenticated user to /unauthorized', async () => {
    isAuthenticatedMock.mockResolvedValue(false);
    getUserMock.mockResolvedValue(null);
    getClaimMock.mockResolvedValue({ value: [] });
    getAccessTokenMock.mockResolvedValue({ permissions: [] });

    const result = await middleware(createRequest('/voter'));

    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(result).toEqual({ type: 'redirect', url: expect.objectContaining({ pathname: '/unauthorized' }) });
  });
});

