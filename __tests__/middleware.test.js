// __tests__/middleware.test.js
// Tests untuk middleware.js - Authentication & Authorization
// Testing: role-based access control untuk admin dan voter routes

import { middleware } from '@/middleware';
import { NextResponse } from 'next/server';
import { mockAuthScenarios, createMockKindeSession } from '@/__tests__/setup/kinde-mock';

// Mock Kinde auth
jest.mock('@kinde-oss/kinde-auth-nextjs/server', () => ({
  getKindeServerSession: jest.fn(),
}));

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

describe('middleware.js - Authentication & Authorization', () => {
  // Helper function to create mock request
  const createMockRequest = (pathname) => ({
    nextUrl: {
      pathname,
      clone: () => ({
        pathname,
      }),
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // TEST SUITE 1: Admin Route Access Control
  // ============================================================
  describe('Admin Route Access Control', () => {
    // Test 1.1: Admin with valid credentials can access admin routes
    test('should allow admin with valid role and permission to access admin routes', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      // Should allow access (NextResponse.next())
      expect(response.status).toBe(200);
      expect(mockSession.isAuthenticated).toHaveBeenCalled();
      expect(mockSession.getClaim).toHaveBeenCalledWith('roles');
      expect(mockSession.getAccessToken).toHaveBeenCalled();
    });

    // Test 1.2: Redirect /admin to /admin/dashboard
    test('should redirect /admin to /admin/dashboard for valid admin', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin');
      const response = await middleware(req);

      // Should redirect to dashboard
      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/admin/dashboard');
    });

    // Test 1.3: Unauthenticated user cannot access admin routes
    test('should deny unauthenticated user access to admin routes', async () => {
      const mockSession = createMockKindeSession({
        authenticated: false,
        user: null,
        roles: [],
        permissions: [],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      // Should redirect to unauthorized
      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 1.4: Authenticated user without admin role cannot access admin routes
    test('should deny authenticated user without admin role', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'voter@test.com' },
        roles: ['voter'], // Not admin
        permissions: [],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      // Should redirect to unauthorized
      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 1.5: Admin without access:admin permission cannot access admin routes
    test('should deny admin without access:admin permission', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: [], // No access:admin permission
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      // Should redirect to unauthorized
      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 1.6: User with admin role but without permission
    test('should deny user with admin role but no access:admin permission', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'partial-admin@test.com' },
        roles: ['admin'],
        permissions: ['some:other:permission'], // Has role but not access:admin
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/elections');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 1.7: Access to nested admin routes
    test('should allow admin to access nested admin routes', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const nestedRoutes = [
        '/admin/dashboard/voters',
        '/admin/dashboard/elections',
        '/admin/dashboard/candidates',
        '/admin/dashboard/monitoring',
      ];

      for (const route of nestedRoutes) {
        jest.clearAllMocks();
        const req = createMockRequest(route);
        const response = await middleware(req);
        expect(response.status).toBe(200);
      }
    });
  });

  // ============================================================
  // TEST SUITE 2: Voter Route Access Control
  // ============================================================
  describe('Voter Route Access Control', () => {
    // Test 2.1: Voter with valid credentials can access voter routes
    test('should allow voter with valid role to access voter routes', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'voter@test.com' },
        roles: ['voter'],
        permissions: ['access:voter'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/voter/dashboard');
      const response = await middleware(req);

      // Should allow access
      expect(response.status).toBe(200);
      expect(mockSession.isAuthenticated).toHaveBeenCalled();
      expect(mockSession.getClaim).toHaveBeenCalledWith('roles');
    });

    // Test 2.2: Redirect /voter to /voter/dashboard
    test('should redirect /voter to /voter/dashboard for valid voter', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'voter@test.com' },
        roles: ['voter'],
        permissions: ['access:voter'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/voter');
      const response = await middleware(req);

      // Should redirect to dashboard
      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/voter/dashboard');
    });

    // Test 2.3: Unauthenticated user cannot access voter routes
    test('should deny unauthenticated user access to voter routes', async () => {
      const mockSession = createMockKindeSession({
        authenticated: false,
        user: null,
        roles: [],
        permissions: [],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/voter/dashboard');
      const response = await middleware(req);

      // Should redirect to unauthorized
      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 2.4: Authenticated user without voter role cannot access voter routes
    test('should deny authenticated user without voter role', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'], // Not voter
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/voter/dashboard');
      const response = await middleware(req);

      // Should redirect to unauthorized
      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 2.5: User with no roles cannot access voter routes
    test('should deny user with no roles', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'norole@test.com' },
        roles: [],
        permissions: [],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/voter/vote');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 2.6: Access to nested voter routes
    test('should allow voter to access nested voter routes', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'voter@test.com' },
        roles: ['voter'],
        permissions: ['access:voter'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const nestedRoutes = [
        '/voter/dashboard',
        '/voter/vote',
        '/voter/candidates',
        '/voter/result',
        '/voter/verify',
      ];

      for (const route of nestedRoutes) {
        jest.clearAllMocks();
        const req = createMockRequest(route);
        const response = await middleware(req);
        expect(response.status).toBe(200);
      }
    });
  });

  // ============================================================
  // TEST SUITE 3: Role Separation
  // ============================================================
  describe('Role Separation', () => {
    // Test 3.1: Admin cannot access voter routes
    test('should prevent admin from accessing voter routes', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/voter/dashboard');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 3.2: Voter cannot access admin routes
    test('should prevent voter from accessing admin routes', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'voter@test.com' },
        roles: ['voter'],
        permissions: ['access:voter'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 3.3: User with both roles should be able to access both areas
    test('should allow user with both admin and voter roles to access both areas', async () => {
      const mockSessionAdmin = createMockKindeSession({
        authenticated: true,
        user: { email: 'superuser@test.com' },
        roles: ['admin', 'voter'],
        permissions: ['access:admin', 'access:voter'],
      });

      getKindeServerSession.mockReturnValue(mockSessionAdmin);

      // Test admin access
      const adminReq = createMockRequest('/admin/dashboard');
      const adminResponse = await middleware(adminReq);
      expect(adminResponse.status).toBe(200);

      // Reset and test voter access
      jest.clearAllMocks();
      
      const mockSessionVoter = createMockKindeSession({
        authenticated: true,
        user: { email: 'superuser@test.com' },
        roles: ['admin', 'voter'],
        permissions: ['access:admin', 'access:voter'],
      });

      getKindeServerSession.mockReturnValue(mockSessionVoter);

      const voterReq = createMockRequest('/voter/dashboard');
      const voterResponse = await middleware(voterReq);
      expect(voterResponse.status).toBe(200);
    });
  });

  // ============================================================
  // TEST SUITE 4: Edge Cases
  // ============================================================
  describe('Edge Cases', () => {
    // Test 4.1: Null user object
    test('should handle null user object', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: null, // Null user
        roles: ['admin'],
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      // Should still work if roles and permissions are valid
      expect(response.status).toBe(200);
    });

    // Test 4.2: Empty roles array
    test('should handle empty roles array', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'test@test.com' },
        roles: [], // Empty roles
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 4.3: Undefined roles
    test('should handle undefined roles', async () => {
      const mockSession = {
        isAuthenticated: jest.fn().mockResolvedValue(true),
        getUser: jest.fn().mockResolvedValue({ email: 'test@test.com' }),
        getClaim: jest.fn().mockResolvedValue(null), // Returns null
        getAccessToken: jest.fn().mockResolvedValue({ permissions: [] }),
      };

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 4.4: Case sensitivity in roles
    test('should handle role case sensitivity correctly', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'test@test.com' },
        roles: ['Admin'], // Capital A
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      // Should deny (expecting lowercase 'admin')
      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 4.5: Extra whitespace in pathname
    test('should handle pathname with trailing slash', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard/');
      const response = await middleware(req);

      // Should still allow access
      expect(response.status).toBe(200);
    });

    // Test 4.6: Very long pathname
    test('should handle very long pathname', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const longPath = '/admin/' + 'path/'.repeat(50) + 'endpoint';
      const req = createMockRequest(longPath);
      const response = await middleware(req);

      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // TEST SUITE 5: Permission Variations
  // ============================================================
  describe('Permission Variations', () => {
    // Test 5.1: Multiple permissions with admin
    test('should allow admin with multiple permissions', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: ['access:admin', 'manage:elections', 'manage:voters'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      expect(response.status).toBe(200);
    });

    // Test 5.2: Permission array is empty
    test('should deny access if permissions array is empty', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: [], // Empty permissions
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    // Test 5.3: Permission is undefined
    test('should deny access if permissions is undefined', async () => {
      const mockSession = {
        isAuthenticated: jest.fn().mockResolvedValue(true),
        getUser: jest.fn().mockResolvedValue({ email: 'admin@test.com' }),
        getClaim: jest.fn().mockResolvedValue({
          value: [{ key: 'admin', name: 'admin' }],
        }),
        getAccessToken: jest.fn().mockResolvedValue({}), // No permissions
      };

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });
  });

  // ============================================================
  // TEST SUITE 6: Authentication State Changes
  // ============================================================
  describe('Authentication State Changes', () => {
    // Test 6.1: Session expires during request
    test('should handle authentication check failure', async () => {
      const mockSession = {
        isAuthenticated: jest.fn().mockRejectedValue(new Error('Auth failed')),
        getUser: jest.fn(),
        getClaim: jest.fn(),
        getAccessToken: jest.fn(),
      };

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');

      // Should throw error or handle gracefully
      await expect(middleware(req)).rejects.toThrow();
    });

    // Test 6.2: Authentication returns false
    test('should redirect when authentication returns false', async () => {
      const mockSession = createMockKindeSession({
        authenticated: false,
        user: null,
        roles: [],
        permissions: [],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });
  });

  // ============================================================
  // TEST SUITE 7: Multiple Role Scenarios
  // ============================================================
  describe('Multiple Role Scenarios', () => {
    // Test 7.1: User with multiple roles including admin
    test('should allow user with multiple roles including admin', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'multi@test.com' },
        roles: ['admin', 'moderator', 'voter'],
        permissions: ['access:admin', 'access:voter'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      expect(response.status).toBe(200);
    });

    // Test 7.2: User with multiple roles but no admin
    test('should deny user with multiple non-admin roles', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'multi@test.com' },
        roles: ['moderator', 'supporter', 'viewer'],
        permissions: ['some:permission'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });
  });

  // ============================================================
  // TEST SUITE 8: Redirect Behavior
  // ============================================================
  describe('Redirect Behavior', () => {
    // Test 8.1: Verify redirect to /admin/dashboard from /admin
    test('should redirect from /admin to /admin/dashboard', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      const location = response.headers.get('Location');
      expect(location).toContain('/admin/dashboard');
    });

    // Test 8.2: Verify redirect to /voter/dashboard from /voter
    test('should redirect from /voter to /voter/dashboard', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'voter@test.com' },
        roles: ['voter'],
        permissions: ['access:voter'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/voter');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      const location = response.headers.get('Location');
      expect(location).toContain('/voter/dashboard');
    });

    // Test 8.3: Verify redirect to /unauthorized for denied access
    test('should redirect to /unauthorized for denied access', async () => {
      const mockSession = createMockKindeSession({
        authenticated: false,
        user: null,
        roles: [],
        permissions: [],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin/dashboard');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      const location = response.headers.get('Location');
      expect(location).toContain('/unauthorized');
    });
  });

  // ============================================================
  // TEST SUITE 9: Config Matcher Verification
  // ============================================================
  describe('Config Matcher Verification', () => {
    // Note: We can't directly test the config.matcher in unit tests,
    // but we can verify the paths that should be matched

    // Test 9.1: Base paths should be handled
    test('should handle base /admin path', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const req = createMockRequest('/admin');
      const response = await middleware(req);

      // Should be redirected to dashboard
      expect(response.status).toBe(307);
    });

    // Test 9.2: Nested paths should be handled
    test('should handle nested admin paths', async () => {
      const mockSession = createMockKindeSession({
        authenticated: true,
        user: { email: 'admin@test.com' },
        roles: ['admin'],
        permissions: ['access:admin'],
      });

      getKindeServerSession.mockReturnValue(mockSession);

      const nestedPaths = [
        '/admin/dashboard',
        '/admin/dashboard/voters',
        '/admin/elections/create',
        '/admin/monitoring/real-time',
      ];

      for (const path of nestedPaths) {
        jest.clearAllMocks();
        const req = createMockRequest(path);
        const response = await middleware(req);
        expect(response.status).toBe(200);
      }
    });
  });
});

