// __tests__/validations/voterSchema.test.js
// Unit tests untuk validations/voterSchema.js
// Testing: Zod schema validation untuk voter data

import { voterSchema } from '@/validations/voterSchema';

describe('validations/voterSchema.js - Voter Schema Validation', () => {
  // ============================================================
  // TEST SUITE 1: Valid Data
  // ============================================================
  describe('Valid Voter Data', () => {
    test('should validate correct voter data', () => {
      const validData = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe('+6281234567890'); // Transformed
      }
    });

    test('should validate phone starting with +62', () => {
      const validData = {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '+6281234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe('+6281234567890'); // Not transformed
      }
    });

    test('should validate minimum length phone', () => {
      const validData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '0812345678', // 10 digits (minimum)
        status: 'active',
      };

      const result = voterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should validate maximum length phone', () => {
      const validData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '08123456789012', // 14 digits total (0 + 13 digits after 0 = maximum)
        status: 'active',
      };

      const result = voterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 2: Full Name Validation
  // ============================================================
  describe('Full Name Validation', () => {
    test('should reject empty full name', () => {
      const invalidData = {
        fullName: '',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('wajib diisi');
      }
    });

    test('should reject full name exceeding 100 characters', () => {
      const invalidData = {
        fullName: 'a'.repeat(101),
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('maksimal 100');
      }
    });

    test('should accept full name with exactly 100 characters', () => {
      const validData = {
        fullName: 'a'.repeat(100),
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept full name with special characters', () => {
      const validData = {
        fullName: "O'Brien-Smith",
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 3: Email Validation
  // ============================================================
  describe('Email Validation', () => {
    test('should reject invalid email format', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'invalid-email',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('tidak valid');
      }
    });

    test('should reject email without domain', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject email without @', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test.example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should accept valid email with subdomain', () => {
      const validData = {
        fullName: 'Test User',
        email: 'test@mail.example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept email with plus sign', () => {
      const validData = {
        fullName: 'Test User',
        email: 'test+tag@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 4: Faculty and Major Validation
  // ============================================================
  describe('Faculty and Major Validation', () => {
    test('should reject empty facultyId', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: '',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('wajib dipilih');
      }
    });

    test('should reject empty majorId', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: '',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('wajib dipilih');
      }
    });

    test('should reject missing facultyId', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject missing majorId', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // TEST SUITE 5: Year Validation
  // ============================================================
  describe('Year Validation', () => {
    test('should reject empty year', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('wajib diisi');
      }
    });

    test('should reject year with less than 4 digits', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '202',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('4 digit');
      }
    });

    test('should reject year with more than 4 digits', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '20244',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('4 digit');
      }
    });

    test('should reject year with non-numeric characters', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '202a',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('4 digit');
      }
    });

    test('should accept valid 4-digit year', () => {
      const validYears = ['2020', '2024', '2025', '2030'];
      
      validYears.forEach(year => {
        const validData = {
          fullName: 'Test User',
          email: 'test@example.com',
          facultyId: 'faculty-123',
          majorId: 'major-456',
          year,
          phone: '081234567890',
          status: 'active',
        };

        const result = voterSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  // ============================================================
  // TEST SUITE 6: Phone Number Validation
  // ============================================================
  describe('Phone Number Validation', () => {
    test('should reject empty phone', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('wajib diisi');
      }
    });

    test('should reject phone not starting with 0 or +62', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '81234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('dimulai dengan 0 atau +62');
      }
    });

    test('should reject phone with less than 10 digits', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10-15 digit');
      }
    });

    test('should reject phone with more than 15 digits', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '0812345678901234',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10-15 digit');
      }
    });

    test('should reject phone with non-numeric characters', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '0812-3456-7890',
        status: 'active',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should transform phone starting with 0 to +62', () => {
      const validData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe('+6281234567890');
      }
    });

    test('should not transform phone already starting with +62', () => {
      const validData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '+6281234567890',
        status: 'active',
      };

      const result = voterSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe('+6281234567890');
      }
    });

    test('should accept various valid phone formats', () => {
      const validPhones = [
        '081234567890',
        '082345678901',
        '085678901234',
        '+6281234567890',
        '+6282345678901',
      ];

      validPhones.forEach(phone => {
        const validData = {
          fullName: 'Test User',
          email: 'test@example.com',
          facultyId: 'faculty-123',
          majorId: 'major-456',
          year: '2024',
          phone,
          status: 'active',
        };

        const result = voterSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  // ============================================================
  // TEST SUITE 7: Status Validation
  // ============================================================
  describe('Status Validation', () => {
    test('should reject empty status', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
        status: '',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('wajib dipilih');
      }
    });

    test('should reject missing status', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
        facultyId: 'faculty-123',
        majorId: 'major-456',
        year: '2024',
        phone: '081234567890',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should accept any non-empty status string', () => {
      const validStatuses = ['active', 'inactive', 'pending', 'custom-status'];

      validStatuses.forEach(status => {
        const validData = {
          fullName: 'Test User',
          email: 'test@example.com',
          facultyId: 'faculty-123',
          majorId: 'major-456',
          year: '2024',
          phone: '081234567890',
          status,
        };

        const result = voterSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  // ============================================================
  // TEST SUITE 8: Missing Fields
  // ============================================================
  describe('Missing Required Fields', () => {
    test('should reject data with all fields missing', () => {
      const invalidData = {};

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    test('should reject data with only some fields', () => {
      const invalidData = {
        fullName: 'Test User',
        email: 'test@example.com',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    test('should list all missing fields in error', () => {
      const invalidData = {
        fullName: 'Test User',
      };

      const result = voterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map(issue => issue.path[0]);
        expect(paths).toContain('email');
        expect(paths).toContain('facultyId');
        expect(paths).toContain('majorId');
        expect(paths).toContain('year');
        expect(paths).toContain('phone');
        expect(paths).toContain('status');
      }
    });
  });
});

