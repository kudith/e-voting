import { electionSchema } from '@/validations/ElectionSchme';

describe('electionSchema', () => {
  test('accepts valid election configuration', () => {
    const payload = {
      title: 'Pemilihan Ketua BEM 2025',
      description: 'Pemilihan untuk menentukan ketua Badan Eksekutif Mahasiswa periode 2025.',
      startDate: '2025-04-01T08:00:00Z',
      endDate: '2025-04-05T17:00:00Z',
      status: 'upcoming',
    };

    const result = electionSchema.parse(payload);

    expect(result).toEqual(payload);
  });

  test('rejects invalid fields and date ordering', () => {
    const invalidResult = electionSchema.safeParse({
      title: '',
      description: 'Pendek',
      startDate: 'bukan-tanggal',
      endDate: '2025-04-05T17:00:00Z',
      status: 'draft',
    });

    expect(invalidResult.success).toBe(false);
    const errors = invalidResult.error?.flatten().fieldErrors ?? {};

    expect(errors.title?.[0]).toMatch(/required/);
    expect(errors.description?.[0]).toMatch(/least 10/);
    expect(errors.startDate?.[0]).toMatch(/tidak valid/);
    expect(errors.status?.[0]).toMatch(/ongoing/);

    const orderResult = electionSchema.safeParse({
      title: 'Pemilu',
      description: 'Deskripsi resmi untuk pemilihan ketua organisasi.',
      startDate: '2025-04-10T08:00:00Z',
      endDate: '2025-04-09T17:00:00Z',
      status: 'ongoing',
    });

    expect(orderResult.success).toBe(false);
    const orderErrors = orderResult.error?.flatten().fieldErrors ?? {};
    expect(orderErrors.endDate?.[0]).toMatch(/harus setelah/);
  });
});

