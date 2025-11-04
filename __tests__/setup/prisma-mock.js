// __tests__/setup/prisma-mock.js
// Mock untuk Prisma Client - digunakan untuk testing tanpa database asli

/**
 * Factory function untuk membuat mock Prisma Client
 * Setiap test dapat menggunakan mock ini untuk mensimulasikan database operations
 */
export const createMockPrismaClient = () => {
  const mockPrisma = {
    // Mock untuk model Election
    election: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    // Mock untuk model Vote
    vote: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    // Mock untuk model Voter
    voter: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    // Mock untuk model Candidate
    candidate: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    // Mock untuk model VoterElection
    voterElection: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    // Mock untuk model ElectionStatistics
    electionStatistics: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    
    // Mock untuk model Faculty
    faculty: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    // Mock untuk model Major
    major: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    // Mock untuk transactions
    $transaction: jest.fn((callback) => {
      // Jika callback adalah function, jalankan dengan mock prisma
      if (typeof callback === 'function') {
        return callback(mockPrisma);
      }
      // Jika array of operations, return resolved promise
      return Promise.resolve(callback);
    }),
    
    // Mock untuk disconnect
    $disconnect: jest.fn(),
  };
  
  return mockPrisma;
};

/**
 * Helper function untuk create mock election data
 */
export const createMockElection = (overrides = {}) => ({
  id: 'election-123',
  title: 'Test Election',
  description: 'Test Election Description',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  status: 'ongoing',
  totalVotes: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Helper function untuk create mock voter data
 */
export const createMockVoter = (overrides = {}) => ({
  id: 'voter-123',
  kindeId: 'kinde-voter-123',
  voterCode: 'V001',
  name: 'Test Voter',
  email: 'voter@test.com',
  phone: '081234567890',
  facultyId: 'faculty-123',
  majorId: 'major-123',
  year: '2023',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Helper function untuk create mock candidate data
 */
export const createMockCandidate = (overrides = {}) => ({
  id: 'candidate-123',
  name: 'Test Candidate',
  photo: 'https://example.com/photo.jpg',
  vision: 'Test Vision',
  mission: 'Test Mission',
  shortBio: 'Test Short Bio',
  voteCount: 0,
  electionId: 'election-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  details: 'Test Details',
  ...overrides,
});

/**
 * Helper function untuk create mock vote data
 */
export const createMockVote = (overrides = {}) => ({
  id: 'vote-123',
  electionId: 'election-123',
  voterId: 'voter-123',
  encryptedData: 'encrypted-data',
  encryptedKey: 'encrypted-key',
  iv: 'initialization-vector',
  authTag: 'auth-tag',
  isCounted: false,
  createdAt: new Date(),
  ...overrides,
});

/**
 * Helper function untuk create mock voter election data
 */
export const createMockVoterElection = (overrides = {}) => ({
  id: 'voter-election-123',
  voterId: 'voter-123',
  electionId: 'election-123',
  isEligible: true,
  hasVoted: false,
  ...overrides,
});

/**
 * Helper function untuk create mock election statistics
 */
export const createMockElectionStatistics = (overrides = {}) => ({
  id: 'stats-123',
  electionId: 'election-123',
  totalVoters: 100,
  eligibleVoters: 90,
  votersWhoVoted: 0,
  participationRate: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Helper function untuk create mock faculty data
 */
export const createMockFaculty = (overrides = {}) => ({
  id: 'faculty-123',
  name: 'Faculty of Engineering',
  code: 'FE',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Helper function untuk create mock major data
 */
export const createMockMajor = (overrides = {}) => ({
  id: 'major-123',
  name: 'Computer Science',
  code: 'CS',
  facultyId: 'faculty-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

