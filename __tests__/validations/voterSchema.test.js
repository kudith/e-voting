import { voterSchema } from '@/validations/voterSchema';

describe('voterSchema', () => {
  test('parses valid voter data and normalises phone numbers', () => {
    const payload = {
      fullName: 'Andi Wijaya',
      email: 'andi@example.com',
      facultyId: 'FAC-1',
      majorId: 'MAJ-2',
      year: '2025',
      phone: '081234567890',
      status: 'registered',
    };

    const result = voterSchema.parse(payload);

    expect(result.fullName).toBe(payload.fullName);
    expect(result.phone).toBe('+6281234567890');
  });

  test('rejects invalid voter submissions with descriptive errors', () => {
    const invalid = {
      fullName: '',
      email: 'invalid-email',
      facultyId: '',
      majorId: '',
      year: '25',
      phone: '12345',
      status: '',
    };

    const result = voterSchema.safeParse(invalid);

    expect(result.success).toBe(false);
    const errors = result.error?.flatten().fieldErrors ?? {};

    expect(errors.fullName?.[0]).toMatch(/wajib diisi/);
    expect(errors.email?.[0]).toMatch(/tidak valid/);
    expect(errors.year?.[0]).toMatch(/4 digit/);
    expect(errors.phone?.[0]).toMatch(/dimulai dengan 0 atau \+62/);
  });
});

