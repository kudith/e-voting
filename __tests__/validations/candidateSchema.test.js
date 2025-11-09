// __tests__/validations/candidateSchema.test.js
// Unit tests untuk validations/CandidateSchema.js
// Testing: Zod schema validation untuk candidate data

import { candidateSchema } from '@/validations/CandidateSchema';

describe('validations/CandidateSchema.js - Candidate Schema Validation', () => {
  // Helper untuk membuat data candidate yang valid
  const createValidCandidateData = (overrides = {}) => ({
    name: 'John Doe',
    photo: 'https://example.com/photo.jpg',
    vision: 'My vision for the future of this organization',
    mission: 'My mission to achieve the vision stated above',
    shortBio: 'A dedicated leader with 5 years of experience',
    electionId: 'election-123',
    details: 'Detailed biography of the candidate with background information',
    socialMedia: {
      twitter: 'https://twitter.com/johndoe',
      facebook: 'https://facebook.com/johndoe',
      instagram: 'https://instagram.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      website: 'https://johndoe.com',
    },
    education: [
      {
        degree: 'Bachelor of Science',
        institution: 'University of Example',
        year: '2020',
      },
    ],
    experience: [
      {
        position: 'President',
        organization: 'Student Council',
        period: '2020-2021',
      },
    ],
    achievements: [
      {
        title: 'Best Leader Award',
        description: 'Awarded for outstanding leadership',
        year: '2020',
      },
    ],
    programs: [
      {
        title: 'Educational Reform',
        description: 'Reform the educational system',
      },
    ],
    stats: {
      experience: 85,
      leadership: 90,
      innovation: 75,
      publicSupport: 80,
    },
    ...overrides,
  });

  // ============================================================
  // TEST SUITE 1: Valid Data
  // ============================================================
  describe('Valid Candidate Data', () => {
    test('should validate complete candidate data', () => {
      const validData = createValidCandidateData();
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should validate minimal required fields only', () => {
      const minimalData = {
        name: 'Jane Smith',
        photo: 'https://example.com/jane.jpg',
        vision: 'Vision for better future in this place',
        mission: 'Mission to accomplish the vision above',
        shortBio: 'Experienced leader with proven track record',
        electionId: 'election-456',
      };

      const result = candidateSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    test('should validate with empty optional fields', () => {
      const dataWithEmptyOptionals = createValidCandidateData({
        details: '',
        socialMedia: '',
      });

      const result = candidateSchema.safeParse(dataWithEmptyOptionals);
      expect(result.success).toBe(true);
    });

    test('should validate with undefined optional fields', () => {
      const dataWithUndefinedOptionals = {
        name: 'Test Candidate',
        photo: 'https://example.com/test.jpg',
        vision: 'My vision for the future',
        mission: 'My mission to serve',
        shortBio: 'Short biography here',
        electionId: 'election-789',
      };

      const result = candidateSchema.safeParse(dataWithUndefinedOptionals);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 2: Name Validation
  // ============================================================
  describe('Name Validation', () => {
    test('should reject name less than 3 characters', () => {
      const invalidData = createValidCandidateData({ name: 'Jo' });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('minimal 3 karakter');
      }
    });

    test('should reject name exceeding 100 characters', () => {
      const invalidData = createValidCandidateData({ name: 'a'.repeat(101) });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('maksimal 100 karakter');
      }
    });

    test('should accept name with exactly 3 characters', () => {
      const validData = createValidCandidateData({ name: 'Bob' });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept name with exactly 100 characters', () => {
      const validData = createValidCandidateData({ name: 'a'.repeat(100) });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject empty name', () => {
      const invalidData = createValidCandidateData({ name: '' });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject missing name', () => {
      const invalidData = createValidCandidateData();
      delete invalidData.name;
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // TEST SUITE 3: Photo URL Validation
  // ============================================================
  describe('Photo URL Validation', () => {
    test('should reject invalid photo URL', () => {
      const invalidData = createValidCandidateData({ photo: 'not-a-url' });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('URL yang valid');
      }
    });

    test('should accept http URL', () => {
      const validData = createValidCandidateData({ photo: 'http://example.com/photo.jpg' });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept https URL', () => {
      const validData = createValidCandidateData({ photo: 'https://example.com/photo.jpg' });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject empty photo URL', () => {
      const invalidData = createValidCandidateData({ photo: '' });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject missing photo URL', () => {
      const invalidData = createValidCandidateData();
      delete invalidData.photo;
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // TEST SUITE 4: Vision Validation
  // ============================================================
  describe('Vision Validation', () => {
    test('should reject vision less than 10 characters', () => {
      const invalidData = createValidCandidateData({ vision: 'Too short' });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('minimal 10 karakter');
      }
    });

    test('should reject vision exceeding 500 characters', () => {
      const invalidData = createValidCandidateData({ vision: 'a'.repeat(501) });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('maksimal 500 karakter');
      }
    });

    test('should accept vision with exactly 10 characters', () => {
      const validData = createValidCandidateData({ vision: '0123456789' });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept vision with exactly 500 characters', () => {
      const validData = createValidCandidateData({ vision: 'a'.repeat(500) });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 5: Mission Validation
  // ============================================================
  describe('Mission Validation', () => {
    test('should reject mission less than 10 characters', () => {
      const invalidData = createValidCandidateData({ mission: 'Too short' });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('minimal 10 karakter');
      }
    });

    test('should reject mission exceeding 500 characters', () => {
      const invalidData = createValidCandidateData({ mission: 'a'.repeat(501) });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('maksimal 500 karakter');
      }
    });

    test('should accept mission with exactly 10 characters', () => {
      const validData = createValidCandidateData({ mission: '0123456789' });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept mission with exactly 500 characters', () => {
      const validData = createValidCandidateData({ mission: 'a'.repeat(500) });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 6: Short Bio Validation
  // ============================================================
  describe('Short Bio Validation', () => {
    test('should reject shortBio less than 10 characters', () => {
      const invalidData = createValidCandidateData({ shortBio: 'Too short' });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('minimal 10 karakter');
      }
    });

    test('should reject shortBio exceeding 300 characters', () => {
      const invalidData = createValidCandidateData({ shortBio: 'a'.repeat(301) });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('maksimal 300 karakter');
      }
    });

    test('should accept shortBio with exactly 10 characters', () => {
      const validData = createValidCandidateData({ shortBio: '0123456789' });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept shortBio with exactly 300 characters', () => {
      const validData = createValidCandidateData({ shortBio: 'a'.repeat(300) });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 7: Details Validation (Optional)
  // ============================================================
  describe('Details Validation', () => {
    test('should accept empty details', () => {
      const validData = createValidCandidateData({ details: '' });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject details less than 10 characters when provided', () => {
      const invalidData = createValidCandidateData({ details: 'Too short' });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('minimal 10 karakter');
      }
    });

    test('should reject details exceeding 2000 characters', () => {
      const invalidData = createValidCandidateData({ details: 'a'.repeat(2001) });
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('maksimal');
      }
    });

    test('should accept details with exactly 10 characters', () => {
      const validData = createValidCandidateData({ details: '0123456789' });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept details with exactly 2000 characters', () => {
      const validData = createValidCandidateData({ details: 'a'.repeat(2000) });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept undefined details', () => {
      const validData = createValidCandidateData();
      delete validData.details;
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 8: Social Media Validation
  // ============================================================
  describe('Social Media Validation', () => {
    test('should accept valid social media URLs', () => {
      const validData = createValidCandidateData({
        socialMedia: {
          twitter: 'https://twitter.com/user',
          facebook: 'https://facebook.com/user',
          instagram: 'https://instagram.com/user',
          linkedin: 'https://linkedin.com/in/user',
          website: 'https://example.com',
        },
      });

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject invalid social media URLs', () => {
      const invalidData = createValidCandidateData({
        socialMedia: {
          twitter: 'not-a-url',
          facebook: '',
          instagram: '',
          linkedin: '',
          website: '',
        },
      });

      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should accept empty string for optional social media', () => {
      const validData = createValidCandidateData({
        socialMedia: {
          twitter: '',
          facebook: '',
          instagram: '',
          linkedin: '',
          website: '',
        },
      });

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept partial social media URLs', () => {
      const validData = createValidCandidateData({
        socialMedia: {
          twitter: 'https://twitter.com/user',
          facebook: '',
          instagram: '',
          linkedin: '',
          website: '',
        },
      });

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept empty socialMedia', () => {
      const validData = createValidCandidateData({ socialMedia: '' });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 9: Education Array Validation
  // ============================================================
  describe('Education Array Validation', () => {
    test('should accept valid education array', () => {
      const validData = createValidCandidateData({
        education: [
          { degree: 'Bachelor', institution: 'University A', year: '2020' },
          { degree: 'Master', institution: 'University B', year: '2022' },
        ],
      });

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept empty education array', () => {
      const validData = createValidCandidateData({ education: [] });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject education with missing required fields', () => {
      const invalidData = createValidCandidateData({
        education: [{ degree: 'Bachelor' }],
      });

      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject education with empty required fields', () => {
      const invalidData = createValidCandidateData({
        education: [{ degree: '', institution: '', year: '' }],
      });

      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // TEST SUITE 10: Experience Array Validation
  // ============================================================
  describe('Experience Array Validation', () => {
    test('should accept valid experience array', () => {
      const validData = createValidCandidateData({
        experience: [
          { position: 'President', organization: 'Org A', period: '2020-2021' },
          { position: 'Vice President', organization: 'Org B', period: '2021-2022' },
        ],
      });

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept empty experience array', () => {
      const validData = createValidCandidateData({ experience: [] });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject experience with missing required fields', () => {
      const invalidData = createValidCandidateData({
        experience: [{ position: 'President' }],
      });

      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // TEST SUITE 11: Achievements Array Validation
  // ============================================================
  describe('Achievements Array Validation', () => {
    test('should accept valid achievements array', () => {
      const validData = createValidCandidateData({
        achievements: [
          { title: 'Award 1', description: 'Description', year: '2020' },
          { title: 'Award 2', description: '', year: '' },
        ],
      });

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept empty achievements array', () => {
      const validData = createValidCandidateData({ achievements: [] });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject achievements with empty title', () => {
      const invalidData = createValidCandidateData({
        achievements: [{ title: '', description: 'Test' }],
      });

      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should accept achievements with optional fields empty', () => {
      const validData = createValidCandidateData({
        achievements: [{ title: 'Award Title', description: '', year: '' }],
      });

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============================================================
  // TEST SUITE 12: Programs Array Validation
  // ============================================================
  describe('Programs Array Validation', () => {
    test('should accept valid programs array', () => {
      const validData = createValidCandidateData({
        programs: [
          { title: 'Program 1', description: 'Description 1' },
          { title: 'Program 2', description: 'Description 2' },
        ],
      });

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept empty programs array', () => {
      const validData = createValidCandidateData({ programs: [] });
      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject programs with missing required fields', () => {
      const invalidData = createValidCandidateData({
        programs: [{ title: 'Program 1' }],
      });

      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject programs with empty required fields', () => {
      const invalidData = createValidCandidateData({
        programs: [{ title: '', description: '' }],
      });

      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // TEST SUITE 13: Stats Validation
  // ============================================================
  describe('Stats Validation', () => {
    test('should accept valid stats', () => {
      const validData = createValidCandidateData({
        stats: {
          experience: 75,
          leadership: 85,
          innovation: 90,
          publicSupport: 80,
        },
      });

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept stats with value 0', () => {
      const validData = createValidCandidateData({
        stats: {
          experience: 0,
          leadership: 0,
          innovation: 0,
          publicSupport: 0,
        },
      });

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept stats with value 100', () => {
      const validData = createValidCandidateData({
        stats: {
          experience: 100,
          leadership: 100,
          innovation: 100,
          publicSupport: 100,
        },
      });

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject stats with value less than 0', () => {
      const invalidData = createValidCandidateData({
        stats: {
          experience: -1,
          leadership: 50,
          innovation: 50,
          publicSupport: 50,
        },
      });

      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject stats with value greater than 100', () => {
      const invalidData = createValidCandidateData({
        stats: {
          experience: 101,
          leadership: 50,
          innovation: 50,
          publicSupport: 50,
        },
      });

      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should use default values when stats not provided', () => {
      const validData = createValidCandidateData();
      delete validData.stats;

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stats).toEqual({
          experience: 0,
          leadership: 0,
          innovation: 0,
          publicSupport: 0,
        });
      }
    });
  });

  // ============================================================
  // TEST SUITE 14: Missing Required Fields
  // ============================================================
  describe('Missing Required Fields', () => {
    test('should reject data with all fields missing', () => {
      const invalidData = {};
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    test('should list all missing required fields in error', () => {
      const invalidData = {};
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map(issue => issue.path[0]);
        expect(paths).toContain('name');
        expect(paths).toContain('photo');
        expect(paths).toContain('vision');
        expect(paths).toContain('mission');
        expect(paths).toContain('shortBio');
        expect(paths).toContain('electionId');
      }
    });

    test('should reject data missing electionId', () => {
      const invalidData = createValidCandidateData();
      delete invalidData.electionId;
      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

