// __tests__/api/auth/authSuccess.test.js
// Unit test untuk Auth Success Route Handler

import { GET } from '@/app/api/auth/succsess/route';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// Mock modules
jest.mock('@kinde-oss/kinde-auth-nextjs/server');
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    voter: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

describe('Auth Success Route - GET /api/auth/succsess', () => {
  let mockPrisma;

  beforeEach(() => {
    // Reset semua mocks sebelum setiap test
    jest.clearAllMocks();
    
    // Dapatkan instance mock prisma
    mockPrisma = new PrismaClient();
  });

  describe('Successful Authentication', () => {
    test('should create new voter if user does not exist in database', async () => {
      // Arrange
      const mockUser = {
        id: 'kinde-user-123',
        given_name: 'John',
        family_name: 'Doe',
        email: 'john.doe@example.com',
      };

      const mockCreatedVoter = {
        id: 'voter-123',
        kindeId: 'kinde-user-123',
        nim: '',
        name: 'John',
        email: 'john.doe@example.com',
        voted: false,
        votes: [],
      };

      // Mock getKindeServerSession
      getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(mockUser),
      });

      // Mock Prisma - user tidak ditemukan, kemudian dibuat
      mockPrisma.voter.findUnique.mockResolvedValue(null);
      mockPrisma.voter.create.mockResolvedValue(mockCreatedVoter);

      // Act
      const response = await GET();

      // Assert
      expect(getKindeServerSession).toHaveBeenCalled();
      expect(mockPrisma.voter.findUnique).toHaveBeenCalledWith({
        where: { kindeId: 'kinde-user-123' },
      });
      expect(mockPrisma.voter.create).toHaveBeenCalledWith({
        data: {
          kindeId: 'kinde-user-123',
          nim: '',
          name: 'John',
          email: 'john.doe@example.com',
          voted: false,
          votes: [],
        },
      });
      expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/dashboard');
    });

    test('should return existing voter if user already exists in database', async () => {
      // Arrange
      const mockUser = {
        id: 'kinde-user-456',
        given_name: 'Jane',
        family_name: 'Smith',
        email: 'jane.smith@example.com',
      };

      const mockExistingVoter = {
        id: 'voter-456',
        kindeId: 'kinde-user-456',
        nim: '12345678',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        voted: true,
        votes: ['vote-1', 'vote-2'],
      };

      // Mock getKindeServerSession
      getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(mockUser),
      });

      // Mock Prisma - user sudah ada
      mockPrisma.voter.findUnique.mockResolvedValue(mockExistingVoter);

      // Act
      const response = await GET();

      // Assert
      expect(getKindeServerSession).toHaveBeenCalled();
      expect(mockPrisma.voter.findUnique).toHaveBeenCalledWith({
        where: { kindeId: 'kinde-user-456' },
      });
      expect(mockPrisma.voter.create).not.toHaveBeenCalled();
      expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/dashboard');
    });

    test('should handle user with null given_name gracefully', async () => {
      // Arrange
      const mockUser = {
        id: 'kinde-user-789',
        given_name: null,
        email: 'noname@example.com',
      };

      const mockCreatedVoter = {
        id: 'voter-789',
        kindeId: 'kinde-user-789',
        nim: '',
        name: '',
        email: 'noname@example.com',
        voted: false,
        votes: [],
      };

      getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(mockUser),
      });

      mockPrisma.voter.findUnique.mockResolvedValue(null);
      mockPrisma.voter.create.mockResolvedValue(mockCreatedVoter);

      // Act
      const response = await GET();

      // Assert
      expect(mockPrisma.voter.create).toHaveBeenCalledWith({
        data: {
          kindeId: 'kinde-user-789',
          nim: '',
          name: '',
          email: 'noname@example.com',
          voted: false,
          votes: [],
        },
      });
      expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/dashboard');
    });

    test('should handle user with null email gracefully', async () => {
      // Arrange
      const mockUser = {
        id: 'kinde-user-999',
        given_name: 'Test',
        email: null,
      };

      const mockCreatedVoter = {
        id: 'voter-999',
        kindeId: 'kinde-user-999',
        nim: '',
        name: 'Test',
        email: '',
        voted: false,
        votes: [],
      };

      getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(mockUser),
      });

      mockPrisma.voter.findUnique.mockResolvedValue(null);
      mockPrisma.voter.create.mockResolvedValue(mockCreatedVoter);

      // Act
      const response = await GET();

      // Assert
      expect(mockPrisma.voter.create).toHaveBeenCalledWith({
        data: {
          kindeId: 'kinde-user-999',
          nim: '',
          name: 'Test',
          email: '',
          voted: false,
          votes: [],
        },
      });
    });
  });

  describe('Authentication Failures', () => {
    test('should throw error when user is null', async () => {
      // Arrange
      getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(null),
      });

      // Act & Assert
      await expect(GET()).rejects.toThrow(/Autentikasi gagal/);
      expect(mockPrisma.voter.findUnique).not.toHaveBeenCalled();
      expect(mockPrisma.voter.create).not.toHaveBeenCalled();
    });

    test('should throw error when user has no id', async () => {
      // Arrange
      const mockUser = {
        id: null,
        given_name: 'Test',
        email: 'test@example.com',
      };

      getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(mockUser),
      });

      // Act & Assert
      await expect(GET()).rejects.toThrow(/Autentikasi gagal/);
      expect(mockPrisma.voter.findUnique).not.toHaveBeenCalled();
      expect(mockPrisma.voter.create).not.toHaveBeenCalled();
    });

    test('should throw error when user is undefined', async () => {
      // Arrange
      getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(undefined),
      });

      // Act & Assert
      await expect(GET()).rejects.toThrow(/Autentikasi gagal/);
    });
  });

  describe('Database Errors', () => {
    test('should propagate error when findUnique fails', async () => {
      // Arrange
      const mockUser = {
        id: 'kinde-user-error',
        given_name: 'Error',
        email: 'error@example.com',
      };

      getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(mockUser),
      });

      mockPrisma.voter.findUnique.mockRejectedValue(
        new Error('Database connection failed')
      );

      // Act & Assert
      await expect(GET()).rejects.toThrow('Database connection failed');
      expect(mockPrisma.voter.create).not.toHaveBeenCalled();
    });

    test('should propagate error when create fails', async () => {
      // Arrange
      const mockUser = {
        id: 'kinde-user-create-error',
        given_name: 'Create Error',
        email: 'create.error@example.com',
      };

      getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(mockUser),
      });

      mockPrisma.voter.findUnique.mockResolvedValue(null);
      mockPrisma.voter.create.mockRejectedValue(
        new Error('Failed to create voter')
      );

      // Act & Assert
      await expect(GET()).rejects.toThrow('Failed to create voter');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string values in user data', async () => {
      // Arrange
      const mockUser = {
        id: 'kinde-user-empty',
        given_name: '',
        email: '',
      };

      const mockCreatedVoter = {
        id: 'voter-empty',
        kindeId: 'kinde-user-empty',
        nim: '',
        name: '',
        email: '',
        voted: false,
        votes: [],
      };

      getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(mockUser),
      });

      mockPrisma.voter.findUnique.mockResolvedValue(null);
      mockPrisma.voter.create.mockResolvedValue(mockCreatedVoter);

      // Act
      const response = await GET();

      // Assert
      expect(mockPrisma.voter.create).toHaveBeenCalledWith({
        data: {
          kindeId: 'kinde-user-empty',
          nim: '',
          name: '',
          email: '',
          voted: false,
          votes: [],
        },
      });
      expect(NextResponse.redirect).toHaveBeenCalled();
    });

    test('should handle concurrent calls gracefully', async () => {
      // Arrange
      const mockUser = {
        id: 'kinde-user-concurrent',
        given_name: 'Concurrent',
        email: 'concurrent@example.com',
      };

      const mockCreatedVoter = {
        id: 'voter-concurrent',
        kindeId: 'kinde-user-concurrent',
        nim: '',
        name: 'Concurrent',
        email: 'concurrent@example.com',
        voted: false,
        votes: [],
      };

      getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(mockUser),
      });

      mockPrisma.voter.findUnique.mockResolvedValue(null);
      mockPrisma.voter.create.mockResolvedValue(mockCreatedVoter);

      // Act - panggil GET beberapa kali secara concurrent
      const promises = [GET(), GET(), GET()];
      const responses = await Promise.all(promises);

      // Assert - semua response harus redirect
      responses.forEach(response => {
        expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/dashboard');
      });
    });
  });
});

