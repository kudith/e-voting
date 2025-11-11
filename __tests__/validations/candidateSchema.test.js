import { candidateSchema } from '@/validations/CandidateSchema';

describe('candidateSchema', () => {
  test('accepts complete candidate payload and preserves structured fields', () => {
    const payload = {
      name: 'Calon Ketua BEM',
      photo: 'https://example.com/photo.png',
      vision: 'Mewujudkan kampus yang aktif dan inklusif untuk semua mahasiswa.',
      mission: 'Meningkatkan partisipasi mahasiswa melalui program kolaboratif yang terukur.',
      shortBio: 'Mahasiswa aktif dengan pengalaman organisasi selama empat tahun.',
      electionId: 'election-01',
      details: 'Biografi lengkap calon dengan berbagai pencapaian dan rencana kerja.',
      socialMedia: {
        twitter: '',
        instagram: 'https://instagram.com/calon',
      },
      education: [
        { degree: 'S1', institution: 'Universitas Contoh', year: '2024' },
      ],
      experience: [
        { position: 'Ketua UKM', organization: 'UKM Debat', period: '2023' },
      ],
      achievements: [{ title: 'Juara 1 Debat', description: 'Tingkat nasional' }],
      programs: [{ title: 'Program Transparansi', description: 'Laporan rutin ke mahasiswa' }],
      stats: {
        experience: 80,
        leadership: 75,
        innovation: 70,
        publicSupport: 85,
      },
    };

    const result = candidateSchema.parse(payload);

    expect(result.name).toBe(payload.name);
    expect(result.education).toHaveLength(1);
    expect(result.programs[0].title).toBe('Program Transparansi');
    expect(result.stats.leadership).toBe(75);
  });

  test('rejects payloads that violate candidate constraints', () => {
    const invalid = {
      name: 'AB',
      photo: 'invalid-url',
      vision: 'Singkat',
      mission: 'Pendek',
      shortBio: 'Mini',
      electionId: '',
      details: 'tiny',
      socialMedia: {
        twitter: 'notaurl',
      },
    };

    const result = candidateSchema.safeParse(invalid);

    expect(result.success).toBe(false);
    const errors = result.error?.flatten().fieldErrors ?? {};

    expect(errors.name?.[0]).toMatch(/minimal 3/);
    expect(errors.photo?.[0]).toMatch(/URL/);
    expect(errors.electionId?.[0]).toMatch(/wajib/);
    expect(errors.vision?.[0]).toMatch(/minimal 10/);
    expect(errors.mission?.[0]).toMatch(/minimal 10/);
    expect(errors.shortBio?.[0]).toMatch(/minimal 10/);
  });
});

