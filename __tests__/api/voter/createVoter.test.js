// __tests__/api/voter/createVoter.test.js
// Unit test untuk Create Voter Route Handler

// Set environment variables BEFORE importing modules
process.env.KINDE_API_URL = 'https://test.kinde.com';
process.env.KINDE_API_KEY = 'test-api-key';

import { POST } from '@/app/api/voter/createVoter/route';
import { NextResponse } from 'next/server';

// Mock modules
jest.mock('@/lib/prisma', () => {
  const mockPrisma = {
    voter: {
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    faculty: {
      findUnique: jest.fn(),
    },
    major: {
      findUnique: jest.fn(),
    },
  };
  return mockPrisma;
});

// Mock dotenv to prevent loading actual .env file
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

// Mock global fetch for Kinde API calls
global.fetch = jest.fn();

// Import prisma mock after mocking
import prisma from '@/lib/prisma';

describe('Create Voter Route - POST /api/voter/createVoter', () => {
  beforeEach(() => {
    // Reset semua mocks sebelum setiap test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful Voter Creation', () => {
    test('should create voter successfully with valid data', async () => {
      // Arrange
      const validVoterData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = {
        id: 'faculty-123',
        name: 'Engineering',
      };

      const mockMajor = {
        id: 'major-123',
        name: 'Computer Science',
        facultyId: 'faculty-123',
      };

      const mockKindeResponse = {
        id: 'kinde-user-123',
        profile: { given_name: 'John Doe' },
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(validVoterData),
      };

      // Mock Prisma calls
      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);
      prisma.voter.count.mockResolvedValue(5);
      prisma.voter.create.mockResolvedValue({
        id: 'voter-123',
        ...validVoterData,
        kindeId: 'kinde-user-123',
        voterCode: 'ENG-COM-0006',
      });

      // Mock Kinde API
      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockKindeResponse),
      });

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(mockRequest.json).toHaveBeenCalled();
      expect(prisma.faculty.findUnique).toHaveBeenCalledWith({
        where: { id: 'faculty-123' },
      });
      expect(prisma.major.findUnique).toHaveBeenCalledWith({
        where: { id: 'major-123' },
      });
      expect(prisma.voter.count).toHaveBeenCalledWith({
        where: { facultyId: 'faculty-123', majorId: 'major-123' },
      });
      expect(global.fetch).toHaveBeenCalled();
      
      // Verify fetch was called with correct structure
      const fetchCall = global.fetch.mock.calls[0];
      expect(fetchCall[0]).toMatch(/\/api\/v1\/user$/); // URL ends with /api/v1/user
      expect(fetchCall[1].method).toBe('POST');
      expect(fetchCall[1].headers['Content-Type']).toBe('application/json');
      expect(fetchCall[1].headers['Authorization']).toMatch(/^Bearer /); // Has Bearer token
      expect(prisma.voter.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          kindeId: 'kinde-user-123',
          voterCode: 'ENG-COM-0006',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+6281234567890',
          facultyId: 'faculty-123',
          majorId: 'major-123',
          year: '2024',
          status: 'active',
        }),
      });
      expect(response.status).toBe(201);
      expect(responseData).toEqual({ message: 'Voter created successfully' });
    });

    test('should transform phone number starting with 0 to +62', async () => {
      // Arrange
      const voterData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = { id: 'faculty-123', name: 'Science' };
      const mockMajor = { id: 'major-123', name: 'Physics', facultyId: 'faculty-123' };
      const mockKindeResponse = { id: 'kinde-123' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);
      prisma.voter.count.mockResolvedValue(0);
      prisma.voter.create.mockResolvedValue({ id: 'voter-123' });

      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockKindeResponse),
      });

      // Act
      await POST(mockRequest);

      // Assert
      expect(prisma.voter.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          phone: '+6281234567890',
        }),
      });
    });

    test('should keep phone number starting with +62', async () => {
      // Arrange
      const voterData = {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+6287654321098',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = { id: 'faculty-123', name: 'Arts' };
      const mockMajor = { id: 'major-123', name: 'Design', facultyId: 'faculty-123' };
      const mockKindeResponse = { id: 'kinde-456' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);
      prisma.voter.count.mockResolvedValue(0);
      prisma.voter.create.mockResolvedValue({ id: 'voter-456' });

      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockKindeResponse),
      });

      // Act
      await POST(mockRequest);

      // Assert
      expect(prisma.voter.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          phone: '+6287654321098',
        }),
      });
    });

    test('should generate correct voter code', async () => {
      // Arrange
      const voterData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = { id: 'faculty-123', name: 'Engineering' };
      const mockMajor = { id: 'major-123', name: 'Informatics', facultyId: 'faculty-123' };
      const mockKindeResponse = { id: 'kinde-789' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);
      prisma.voter.count.mockResolvedValue(99); // Should generate 0100
      prisma.voter.create.mockResolvedValue({ id: 'voter-789' });

      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockKindeResponse),
      });

      // Act
      await POST(mockRequest);

      // Assert
      expect(prisma.voter.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          voterCode: 'ENG-INF-0100',
        }),
      });
    });
  });

  describe('Validation Errors', () => {
    test('should return 400 for invalid email', async () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidData),
      };

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.errors).toBeDefined();
      expect(responseData.errors[0]).toContain('Invalid email format');
    });

    test('should return 400 for name too short', async () => {
      // Arrange
      const invalidData = {
        name: 'Jo',
        email: 'john@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidData),
      };

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.errors).toBeDefined();
      expect(responseData.errors[0]).toContain('Name must be at least 3 characters');
    });

    test('should return 400 for invalid phone number', async () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '12345',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidData),
      };

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.errors).toBeDefined();
      expect(responseData.errors[0]).toContain('Phone must start with 0 or +62');
    });

    test('should return 400 for invalid year format', async () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '24',
        status: 'active',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidData),
      };

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.errors).toBeDefined();
      expect(responseData.errors[0]).toContain('Year must be a 4-digit number');
    });

    test('should return 400 for invalid status', async () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'invalid-status',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidData),
      };

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.errors).toBeDefined();
    });

    test('should return 400 for missing required fields', async () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        // Missing phone, facultyId, majorId, year, status
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidData),
      };

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.errors).toBeDefined();
      expect(responseData.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Faculty and Major Validation', () => {
    test('should return 400 when faculty not found', async () => {
      // Arrange
      const voterData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        facultyId: 'non-existent-faculty',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(null);

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Faculty not found.');
    });

    test('should return 400 when major not found', async () => {
      // Arrange
      const voterData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'non-existent-major',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = { id: 'faculty-123', name: 'Engineering' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(null);

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Major not found.');
    });

    test('should return 400 when major does not belong to faculty', async () => {
      // Arrange
      const voterData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = { id: 'faculty-123', name: 'Engineering' };
      const mockMajor = { 
        id: 'major-456', 
        name: 'Physics', 
        facultyId: 'faculty-999' // Different faculty
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Major does not belong to the specified faculty.');
    });
  });

  describe('Kinde API Integration', () => {
    test('should handle Kinde API USER_ALREADY_EXISTS error for existing email', async () => {
      // Arrange
      const voterData = {
        name: 'John Doe',
        email: 'existing@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = { id: 'faculty-123', name: 'Engineering' };
      const mockMajor = { id: 'major-123', name: 'Computer', facultyId: 'faculty-123' };
      const mockExistingVoter = { 
        id: 'voter-existing', 
        email: 'existing@example.com' 
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);
      prisma.voter.count.mockResolvedValue(0);
      prisma.voter.findUnique.mockResolvedValue(mockExistingVoter);

      // Mock Kinde API error
      global.fetch.mockResolvedValue({
        ok: false,
        text: jest.fn().mockResolvedValue(
          JSON.stringify({ errors: [{ code: 'USER_ALREADY_EXISTS' }] })
        ),
      });

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(409);
      expect(responseData.error).toContain('Email sudah terdaftar');
    });

    test('should handle Kinde API generic error', async () => {
      // Arrange
      const voterData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = { id: 'faculty-123', name: 'Engineering' };
      const mockMajor = { id: 'major-123', name: 'Computer', facultyId: 'faculty-123' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);
      prisma.voter.count.mockResolvedValue(0);

      // Mock Kinde API error
      global.fetch.mockResolvedValue({
        ok: false,
        text: jest.fn().mockResolvedValue('Internal Server Error'),
      });

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.error).toContain('Gagal membuat user di sistem autentikasi');
    });

    test('should send correct data to Kinde API', async () => {
      // Arrange
      const voterData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = { id: 'faculty-123', name: 'Engineering' };
      const mockMajor = { id: 'major-123', name: 'Computer', facultyId: 'faculty-123' };
      const mockKindeResponse = { id: 'kinde-123' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);
      prisma.voter.count.mockResolvedValue(0);
      prisma.voter.create.mockResolvedValue({ id: 'voter-123' });

      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockKindeResponse),
      });

      // Act
      await POST(mockRequest);

      // Assert
      expect(global.fetch).toHaveBeenCalled();
      
      // Verify fetch was called with correct structure
      const fetchCall = global.fetch.mock.calls[0];
      expect(fetchCall[0]).toMatch(/\/api\/v1\/user$/); // URL ends with /api/v1/user
      expect(fetchCall[1].method).toBe('POST');
      expect(fetchCall[1].headers['Content-Type']).toBe('application/json');
      expect(fetchCall[1].headers['Authorization']).toMatch(/^Bearer /);

      // Verify the body contains correct data
      const bodyData = JSON.parse(fetchCall[1].body);
      expect(bodyData.profile.given_name).toBe('Test User');
      expect(bodyData.identities).toContainEqual({
        type: 'email',
        is_verified: true,
        details: { email: 'test@example.com' },
      });
      expect(bodyData.identities).toContainEqual({
        type: 'username',
        details: { username: 'ENG-COM-0001' },
      });
    });
  });

  describe('Database Errors', () => {
    test('should handle database connection error', async () => {
      // Arrange
      const voterData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockRejectedValue(
        new Error('Database connection failed')
      );

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.error).toBe('Internal server error');
    });

    test('should handle voter creation error in database', async () => {
      // Arrange
      const voterData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = { id: 'faculty-123', name: 'Engineering' };
      const mockMajor = { id: 'major-123', name: 'Computer', facultyId: 'faculty-123' };
      const mockKindeResponse = { id: 'kinde-123' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);
      prisma.voter.count.mockResolvedValue(0);
      prisma.voter.create.mockRejectedValue(
        new Error('Failed to insert voter')
      );

      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockKindeResponse),
      });

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.error).toBe('Internal server error');
    });
  });

  describe('Edge Cases', () => {
    test('should handle very long faculty and major names in voter code', async () => {
      // Arrange
      const voterData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = { 
        id: 'faculty-123', 
        name: 'Very Long Faculty Name Engineering' 
      };
      const mockMajor = { 
        id: 'major-123', 
        name: 'Very Long Major Name Computer Science', 
        facultyId: 'faculty-123' 
      };
      const mockKindeResponse = { id: 'kinde-123' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);
      prisma.voter.count.mockResolvedValue(0);
      prisma.voter.create.mockResolvedValue({ id: 'voter-123' });

      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockKindeResponse),
      });

      // Act
      await POST(mockRequest);

      // Assert
      expect(prisma.voter.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          voterCode: 'VER-VER-0001', // First 3 chars uppercase
        }),
      });
    });

    test('should handle inactive status', async () => {
      // Arrange
      const voterData = {
        name: 'Inactive User',
        email: 'inactive@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'inactive',
      };

      const mockFaculty = { id: 'faculty-123', name: 'Engineering' };
      const mockMajor = { id: 'major-123', name: 'Computer', facultyId: 'faculty-123' };
      const mockKindeResponse = { id: 'kinde-123' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);
      prisma.voter.count.mockResolvedValue(0);
      prisma.voter.create.mockResolvedValue({ id: 'voter-123' });

      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockKindeResponse),
      });

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(prisma.voter.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: 'inactive',
        }),
      });
    });

    test('should handle large voter count for code generation', async () => {
      // Arrange
      const voterData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        facultyId: 'faculty-123',
        majorId: 'major-123',
        year: '2024',
        status: 'active',
      };

      const mockFaculty = { id: 'faculty-123', name: 'Engineering' };
      const mockMajor = { id: 'major-123', name: 'Computer', facultyId: 'faculty-123' };
      const mockKindeResponse = { id: 'kinde-123' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(voterData),
      };

      prisma.faculty.findUnique.mockResolvedValue(mockFaculty);
      prisma.major.findUnique.mockResolvedValue(mockMajor);
      prisma.voter.count.mockResolvedValue(9999); // Should generate 10000
      prisma.voter.create.mockResolvedValue({ id: 'voter-123' });

      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockKindeResponse),
      });

      // Act
      await POST(mockRequest);

      // Assert
      expect(prisma.voter.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          voterCode: 'ENG-COM-10000',
        }),
      });
    });
  });
});

