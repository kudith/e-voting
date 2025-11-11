import {
  cn,
  formatDate,
  formatDateTime,
  formatNumber,
  getTimeDifference,
  timeRemaining,
  normalizeToArray,
} from '@/lib/utils';

describe('lib/utils', () => {
  test('cn merges class names and ignores falsy values', () => {
    const result = cn(
      'btn',
      undefined,
      null,
      'btn-primary',
      { active: true, disabled: false },
      ['rounded', false && 'hidden'],
    );

    expect(result).toBe('btn btn-primary active rounded');
  });

  test('formatDate normalises different inputs and handles fallbacks', () => {
    const date = new Date(Date.UTC(2025, 2, 15, 0, 0, 0));
    const expected = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    expect(formatDate(date)).toBe(expected);
    expect(formatDate(date.toISOString())).toBe(expected);
    expect(formatDate(null)).toBe('-');
    expect(formatDate('not-a-date')).toBe('Invalid Date');
  });

  test('formatDateTime combines date and time or returns dash for invalid values', () => {
    const source = new Date('2025-06-01T12:45:00Z');
    const expectedDate = new Date(source).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const expectedTime = new Date(source).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    expect(formatDateTime(source)).toBe(`${expectedDate}, ${expectedTime}`);
    expect(formatDateTime(source.toISOString())).toBe(`${expectedDate}, ${expectedTime}`);
    expect(formatDateTime(undefined)).toBe('-');
  });

  test('formatNumber applies localisation and safeguards nullish values', () => {
    const formatted = formatNumber(1234567);
    const expected = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(1234567);
    expect(formatted).toBe(expected);

    const withDecimals = formatNumber(9876.54, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const expectedDecimals = new Intl.NumberFormat('id-ID', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(9876.54);
    expect(withDecimals).toBe(expectedDecimals);

    expect(formatNumber(null)).toBe('0');
  });

  test('getTimeDifference returns human readable ranges or dash for invalid inputs', () => {
    const diff = getTimeDifference('2025-01-01T00:00:00Z', '2025-01-03T03:30:00Z');
    expect(diff).toBe('2 hari, 3 jam');

    const shortDiff = getTimeDifference('2025-01-01T00:00:00Z', '2025-01-01T00:00:30Z');
    expect(shortDiff).toBe('Kurang dari 1 menit');

    expect(getTimeDifference(null, '2025-01-01T00:00:00Z')).toBe('-');
  });

  test('timeRemaining reports future intervals and completed states', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-02-01T00:00:00Z'));

    expect(timeRemaining('2025-02-03T00:00:00Z')).toBe('2 hari');
    expect(timeRemaining('2025-02-01T05:00:00Z')).toBe('5 jam');
    expect(timeRemaining('2025-01-31T23:59:00Z')).toBe('Selesai');
    expect(timeRemaining(null)).toBe('-');

    jest.useRealTimers();
  });

  test('normalizeToArray extracts arrays from various payload shapes', () => {
    expect(normalizeToArray([1, 2, 3])).toEqual([1, 2, 3]);
    expect(normalizeToArray({ items: [{ id: 1 }] })).toEqual([{ id: 1 }]);
    expect(normalizeToArray({ data: [1] }, 'data')).toEqual([1]);
    expect(normalizeToArray({ elections: ['a', 'b'] })).toEqual(['a', 'b']);
    expect(normalizeToArray(undefined)).toEqual([]);
    expect(normalizeToArray({})).toEqual([]);
  });
});

