// __tests__/setup/kinde-mock.js
// Mock untuk Kinde Authentication

/**
 * Mock untuk getKindeServerSession
 * Digunakan untuk testing middleware dan routes yang memerlukan authentication
 */
export const createMockKindeSession = ({
  authenticated = true,
  user = null,
  roles = [],
  permissions = [],
} = {}) => {
  const defaultUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    given_name: 'Test',
    family_name: 'User',
  };

  return {
    isAuthenticated: jest.fn().mockResolvedValue(authenticated),
    getUser: jest.fn().mockResolvedValue(user || defaultUser),
    getClaim: jest.fn((claimName) => {
      if (claimName === 'roles') {
        return Promise.resolve({
          value: roles.map(role => ({ key: role, name: role })),
        });
      }
      return Promise.resolve(null);
    }),
    getPermission: jest.fn((permissionName) => {
      return Promise.resolve({
        isGranted: permissions.includes(permissionName),
      });
    }),
    getAccessToken: jest.fn().mockResolvedValue({
      permissions: permissions,
    }),
  };
};

/**
 * Mock scenarios untuk testing berbagai kondisi auth
 */
export const mockAuthScenarios = {
  // Admin dengan full access
  admin: createMockKindeSession({
    authenticated: true,
    user: {
      id: 'admin-123',
      email: 'admin@test.com',
      given_name: 'Admin',
      family_name: 'User',
    },
    roles: ['admin'],
    permissions: ['access:admin', 'manage:elections', 'manage:voters'],
  }),

  // Voter dengan akses terbatas
  voter: createMockKindeSession({
    authenticated: true,
    user: {
      id: 'voter-123',
      email: 'voter@test.com',
      given_name: 'Voter',
      family_name: 'User',
    },
    roles: ['voter'],
    permissions: ['access:voter', 'submit:vote'],
  }),

  // User tidak terautentikasi
  unauthenticated: createMockKindeSession({
    authenticated: false,
    user: null,
    roles: [],
    permissions: [],
  }),

  // User terautentikasi tapi tanpa role
  noRole: createMockKindeSession({
    authenticated: true,
    user: {
      id: 'norole-123',
      email: 'norole@test.com',
      given_name: 'No',
      family_name: 'Role',
    },
    roles: [],
    permissions: [],
  }),
};



