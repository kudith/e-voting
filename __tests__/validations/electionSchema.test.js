// __tests__/validations/electionSchema.test.js
// Unit tests untuk validations/ElectionSchme.js
// Testing: Zod schema validation untuk election data

import { electionSchema } from '@/validations/ElectionSchme';

describe('validations/ElectionSchme.js - Election Schema Validation', () => {
  // ============================================================
  // TEST SUITE 1: Valid Data
  // ============================================================
  describe('Valid Election Data', () => {
    test('should validate correct election data', () => {
      const validData = {
        title: 'Presidential Election 2024',
        description: 'Election for the president of student body',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-01-20T23:59:59Z',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should validate status: ongoing', () => {
      const validData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should validate status: completed', () => {
      const validData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'completed',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should validate status: upcoming', () => {
      const validData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'upcoming',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should validate same day start and end dates', () => {
      const validData = {
        title: 'One Day Election',
        description: 'Election that starts and ends on same day',
        startDate: '2024-01-15T08:00:00Z',
        endDate: '2024-01-15T18:00:00Z',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 2: Title Validation
  // ============================================================
  describe('Title Validation', () => {
    test('should reject empty title', () => {
      const invalidData = {
        title: '',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('required');
      }
    });

    test('should reject missing title', () => {
      const invalidData = {
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject title exceeding 100 characters', () => {
      const invalidData = {
        title: 'a'.repeat(101),
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at most 100');
      }
    });

    test('should accept title with exactly 100 characters', () => {
      const validData = {
        title: 'a'.repeat(100),
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept title with exactly 1 character', () => {
      const validData = {
        title: 'A',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept title with special characters', () => {
      const validData = {
        title: 'Election 2024 - President & Vice President',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 3: Description Validation
  // ============================================================
  describe('Description Validation', () => {
    test('should reject description less than 10 characters', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Short',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 10');
      }
    });

    test('should reject description exceeding 500 characters', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'a'.repeat(501),
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at most 500');
      }
    });

    test('should accept description with exactly 10 characters', () => {
      const validData = {
        title: 'Test Election',
        description: '0123456789',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept description with exactly 500 characters', () => {
      const validData = {
        title: 'Test Election',
        description: 'a'.repeat(500),
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject empty description', () => {
      const invalidData = {
        title: 'Test Election',
        description: '',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject missing description', () => {
      const invalidData = {
        title: 'Test Election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // TEST SUITE 4: Start Date Validation
  // ============================================================
  describe('Start Date Validation', () => {
    test('should reject empty startDate', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('wajib diisi');
      }
    });

    test('should reject missing startDate', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject invalid startDate format', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: 'invalid-date',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('tidak valid');
      }
    });

    test('should accept ISO 8601 date format', () => {
      const validData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-01-20T23:59:59Z',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept simple date format (YYYY-MM-DD)', () => {
      const validData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept date with time', () => {
      const validData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15 10:30:00',
        endDate: '2024-01-20 18:00:00',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 5: End Date Validation
  // ============================================================
  describe('End Date Validation', () => {
    test('should reject empty endDate', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('wajib diisi');
      }
    });

    test('should reject missing endDate', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject invalid endDate format', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: 'invalid-date',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('tidak valid');
      }
    });

    test('should reject endDate before startDate', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-20',
        endDate: '2024-01-15',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('setelah');
      }
    });

    test('should accept endDate equal to startDate', () => {
      const validData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15T08:00:00Z',
        endDate: '2024-01-15T18:00:00Z',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept endDate after startDate', () => {
      const validData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 6: Status Validation
  // ============================================================
  describe('Status Validation', () => {
    test('should reject invalid status', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'invalid-status',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('ongoing');
        expect(result.error.issues[0].message).toContain('completed');
        expect(result.error.issues[0].message).toContain('upcoming');
      }
    });

    test('should reject empty status', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: '',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject missing status', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject case-sensitive invalid status', () => {
      const invalidStatuses = ['Ongoing', 'ONGOING', 'Completed', 'COMPLETED', 'Upcoming', 'UPCOMING'];

      invalidStatuses.forEach(status => {
        const invalidData = {
          title: 'Test Election',
          description: 'Test description for election',
          startDate: '2024-01-15',
          endDate: '2024-01-20',
          status,
        };

        const result = electionSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    test('should accept all valid status values', () => {
      const validStatuses = ['ongoing', 'completed', 'upcoming'];

      validStatuses.forEach(status => {
        const validData = {
          title: 'Test Election',
          description: 'Test description for election',
          startDate: '2024-01-15',
          endDate: '2024-01-20',
          status,
        };

        const result = electionSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  // ============================================================
  // TEST SUITE 7: Date Range Validation (Custom Refine)
  // ============================================================
  describe('Date Range Validation', () => {
    test('should validate endDate >= startDate', () => {
      const validData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15',
        endDate: '2024-01-15',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject endDate < startDate', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-20',
        endDate: '2024-01-15',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const dateError = result.error.issues.find(issue => issue.path.includes('endDate'));
        expect(dateError).toBeDefined();
        expect(dateError.message).toContain('setelah');
      }
    });

    test('should handle time components in date comparison', () => {
      const validData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15T08:00:00Z',
        endDate: '2024-01-15T18:00:00Z',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject when endDate time is before startDate time on same day', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-15T18:00:00Z',
        endDate: '2024-01-15T08:00:00Z',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should accept long duration elections', () => {
      const validData = {
        title: 'Test Election',
        description: 'Test description for election',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 8: Missing Fields
  // ============================================================
  describe('Missing Required Fields', () => {
    test('should reject data with all fields missing', () => {
      const invalidData = {};

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    test('should reject data with only some fields', () => {
      const invalidData = {
        title: 'Test Election',
        description: 'Test description',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    test('should list all missing fields in error', () => {
      const invalidData = {
        title: 'Test Election',
      };

      const result = electionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map(issue => issue.path[0]);
        expect(paths).toContain('description');
        expect(paths).toContain('startDate');
        expect(paths).toContain('endDate');
        expect(paths).toContain('status');
      }
    });
  });

  // ============================================================
  // TEST SUITE 9: Edge Cases
  // ============================================================
  describe('Edge Cases', () => {
    test('should handle very long election duration', () => {
      const validData = {
        title: 'Multi-Year Election',
        description: 'Election spanning multiple years',
        startDate: '2024-01-01',
        endDate: '2030-12-31',
        status: 'upcoming',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should handle election with minimal valid duration', () => {
      const validData = {
        title: 'Quick Election',
        description: 'Very short election period',
        startDate: '2024-01-15T08:00:00Z',
        endDate: '2024-01-15T08:00:01Z',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should handle dates in different formats', () => {
      const dateFormats = [
        { startDate: '2024-01-15', endDate: '2024-01-20' },
        { startDate: '2024-01-15T00:00:00Z', endDate: '2024-01-20T23:59:59Z' },
        { startDate: '2024-01-15 00:00:00', endDate: '2024-01-20 23:59:59' },
      ];

      dateFormats.forEach(dates => {
        const validData = {
          title: 'Test Election',
          description: 'Test description for election',
          ...dates,
          status: 'ongoing',
        };

        const result = electionSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    test('should handle timezone differences', () => {
      const validData = {
        title: 'Global Election',
        description: 'Election across timezones',
        startDate: '2024-01-15T00:00:00+07:00',
        endDate: '2024-01-20T23:59:59+07:00',
        status: 'ongoing',
      };

      const result = electionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});

