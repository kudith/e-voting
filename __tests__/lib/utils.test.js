// __tests__/lib/utils.test.js
// Unit tests untuk lib/utils.js
// Testing: utility functions untuk formatting dan data normalization

import {
  cn,
  formatDate,
  formatDateTime,
  formatNumber,
  getTimeDifference,
  timeRemaining,
  normalizeToArray,
} from '@/lib/utils';

describe('lib/utils.js - Utility Functions', () => {
  // ============================================================
  // TEST SUITE 1: cn() - Class Name Utility
  // ============================================================
  describe('cn()', () => {
    test('should merge class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    test('should handle conditional classes', () => {
      const result = cn('class1', false && 'class2', 'class3');
      expect(result).toBe('class1 class3');
    });

    test('should merge Tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      // twMerge should merge conflicting classes
      expect(result).toBe('py-1 px-4');
    });

    test('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    test('should handle undefined and null', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toBe('class1 class2');
    });
  });

  // ============================================================
  // TEST SUITE 2: formatDate() - Date Formatting
  // ============================================================
  describe('formatDate()', () => {
    test('should format valid Date object', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain('Januari');
    });

    test('should format valid date string', () => {
      const dateString = '2024-01-15';
      const result = formatDate(dateString);
      expect(result).toContain('2024');
      expect(result).toContain('Januari');
    });

    test('should handle null date', () => {
      const result = formatDate(null);
      expect(result).toBe('-');
    });

    test('should handle undefined date', () => {
      const result = formatDate(undefined);
      expect(result).toBe('-');
    });

    test('should handle empty string', () => {
      const result = formatDate('');
      expect(result).toBe('-');
    });

    test('should handle invalid date string', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });

    test('should apply custom options', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const options = { month: 'short', year: '2-digit' };
      const result = formatDate(date, options);
      expect(result).toBeTruthy();
    });

    test('should handle different date formats', () => {
      const dates = [
        '2024-01-15',
        '2024/01/15',
        '2024-01-15T10:30:00Z',
      ];
      dates.forEach(date => {
        const result = formatDate(date);
        expect(result).toBeTruthy();
        expect(result).not.toBe('-');
      });
    });
  });

  // ============================================================
  // TEST SUITE 3: formatDateTime() - Date Time Formatting
  // ============================================================
  describe('formatDateTime()', () => {
    test('should format valid Date object with time', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDateTime(date);
      expect(result).toContain('2024');
      expect(result).toContain(',');
    });

    test('should format valid date string with time', () => {
      const dateString = '2024-01-15T14:30:00Z';
      const result = formatDateTime(dateString);
      expect(result).toContain('2024');
      expect(result).toContain(',');
    });

    test('should handle null date', () => {
      const result = formatDateTime(null);
      expect(result).toBe('-');
    });

    test('should handle undefined date', () => {
      const result = formatDateTime(undefined);
      expect(result).toBe('-');
    });

    test('should handle empty string', () => {
      const result = formatDateTime('');
      expect(result).toBe('-');
    });

    test('should handle invalid date string', () => {
      const result = formatDateTime('invalid-date');
      expect(result).toContain('Invalid Date');
    });

    test('should include both date and time components', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDateTime(date);
      // Indonesian locale uses . as separator for time (21.30 instead of 21:30)
      expect(result).toMatch(/\d{1,2}\s\w+\s\d{4},\s\d{2}.\d{2}/);
    });
  });

  // ============================================================
  // TEST SUITE 4: formatNumber() - Number Formatting
  // ============================================================
  describe('formatNumber()', () => {
    test('should format integer with thousand separator', () => {
      const result = formatNumber(1000);
      expect(result).toBe('1.000');
    });

    test('should format large number with thousand separator', () => {
      const result = formatNumber(1234567);
      expect(result).toBe('1.234.567');
    });

    test('should handle zero', () => {
      const result = formatNumber(0);
      expect(result).toBe('0');
    });

    test('should handle negative number', () => {
      const result = formatNumber(-1000);
      expect(result).toBe('-1.000');
    });

    test('should handle null', () => {
      const result = formatNumber(null);
      expect(result).toBe('0');
    });

    test('should handle undefined', () => {
      const result = formatNumber(undefined);
      expect(result).toBe('0');
    });

    test('should handle decimal numbers with custom options', () => {
      const result = formatNumber(1234.5678, { maximumFractionDigits: 2 });
      expect(result).toContain('1.234');
    });

    test('should handle very large numbers', () => {
      const result = formatNumber(999999999);
      expect(result).toBe('999.999.999');
    });

    test('should handle small numbers', () => {
      const result = formatNumber(1);
      expect(result).toBe('1');
    });
  });

  // ============================================================
  // TEST SUITE 5: getTimeDifference() - Time Difference Calculation
  // ============================================================
  describe('getTimeDifference()', () => {
    test('should calculate days difference', () => {
      const start = new Date('2024-01-01T00:00:00Z');
      const end = new Date('2024-01-03T00:00:00Z');
      const result = getTimeDifference(start, end);
      expect(result).toContain('hari');
    });

    test('should calculate hours difference', () => {
      const start = new Date('2024-01-01T00:00:00Z');
      const end = new Date('2024-01-01T05:00:00Z');
      const result = getTimeDifference(start, end);
      expect(result).toContain('jam');
    });

    test('should calculate minutes difference', () => {
      const start = new Date('2024-01-01T00:00:00Z');
      const end = new Date('2024-01-01T00:30:00Z');
      const result = getTimeDifference(start, end);
      expect(result).toContain('menit');
    });

    test('should handle very short time difference', () => {
      const start = new Date('2024-01-01T00:00:00Z');
      const end = new Date('2024-01-01T00:00:30Z');
      const result = getTimeDifference(start, end);
      expect(result).toBe('Kurang dari 1 menit');
    });

    test('should handle null start date', () => {
      const end = new Date('2024-01-01T00:00:00Z');
      const result = getTimeDifference(null, end);
      expect(result).toBe('-');
    });

    test('should handle null end date', () => {
      const start = new Date('2024-01-01T00:00:00Z');
      const result = getTimeDifference(start, null);
      expect(result).toBe('-');
    });

    test('should handle both null', () => {
      const result = getTimeDifference(null, null);
      expect(result).toBe('-');
    });

    test('should handle invalid dates', () => {
      const result = getTimeDifference('invalid', 'invalid');
      // Invalid dates will result in NaN calculation, but function still returns a result
      expect(result).toBeTruthy();
    });

    test('should handle days and hours combination', () => {
      const start = new Date('2024-01-01T00:00:00Z');
      const end = new Date('2024-01-02T03:00:00Z');
      const result = getTimeDifference(start, end);
      expect(result).toContain('hari');
      expect(result).toContain('jam');
    });

    test('should handle hours and minutes combination', () => {
      const start = new Date('2024-01-01T00:00:00Z');
      const end = new Date('2024-01-01T02:30:00Z');
      const result = getTimeDifference(start, end);
      expect(result).toContain('jam');
      expect(result).toContain('menit');
    });

    test('should handle negative time difference', () => {
      const start = new Date('2024-01-02T00:00:00Z');
      const end = new Date('2024-01-01T00:00:00Z');
      const result = getTimeDifference(start, end);
      // Should still return result (negative values will be handled)
      expect(result).toBeTruthy();
    });
  });

  // ============================================================
  // TEST SUITE 6: timeRemaining() - Time Remaining Calculation
  // ============================================================
  describe('timeRemaining()', () => {
    test('should calculate days remaining for future date', () => {
      const future = new Date();
      future.setDate(future.getDate() + 5);
      const result = timeRemaining(future);
      expect(result).toContain('hari');
    });

    test('should calculate hours remaining for near future', () => {
      const future = new Date();
      future.setHours(future.getHours() + 3);
      const result = timeRemaining(future);
      expect(result).toContain('jam');
    });

    test('should return "Selesai" for past date', () => {
      const past = new Date('2020-01-01T00:00:00Z');
      const result = timeRemaining(past);
      expect(result).toBe('Selesai');
    });

    test('should return "Selesai" for current time', () => {
      const now = new Date();
      const result = timeRemaining(now);
      expect(result).toBe('Selesai');
    });

    test('should handle null date', () => {
      const result = timeRemaining(null);
      expect(result).toBe('-');
    });

    test('should handle undefined date', () => {
      const result = timeRemaining(undefined);
      expect(result).toBe('-');
    });

    test('should handle empty string', () => {
      const result = timeRemaining('');
      expect(result).toBe('-');
    });

    test('should handle invalid date string', () => {
      const result = timeRemaining('invalid-date');
      // Invalid date returns "NaN jam" from the calculation
      expect(result).toBeTruthy();
    });

    test('should handle date string format', () => {
      const future = new Date();
      future.setDate(future.getDate() + 10);
      const futureString = future.toISOString();
      const result = timeRemaining(futureString);
      expect(result).toContain('hari');
    });
  });

  // ============================================================
  // TEST SUITE 7: normalizeToArray() - Data Normalization
  // ============================================================
  describe('normalizeToArray()', () => {
    test('should return array as-is', () => {
      const data = [1, 2, 3];
      const result = normalizeToArray(data);
      expect(result).toEqual([1, 2, 3]);
    });

    test('should extract array from object with specified key', () => {
      const data = { items: [1, 2, 3] };
      const result = normalizeToArray(data, 'items');
      expect(result).toEqual([1, 2, 3]);
    });

    test('should extract from common keys - elections', () => {
      const data = { elections: [{ id: 1 }, { id: 2 }] };
      const result = normalizeToArray(data);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    test('should extract from common keys - candidates', () => {
      const data = { candidates: [{ id: 1 }, { id: 2 }] };
      const result = normalizeToArray(data);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    test('should extract from common keys - voters', () => {
      const data = { voters: [{ id: 1 }] };
      const result = normalizeToArray(data);
      expect(result).toEqual([{ id: 1 }]);
    });

    test('should extract from common keys - data', () => {
      const data = { data: [{ id: 1 }] };
      const result = normalizeToArray(data);
      expect(result).toEqual([{ id: 1 }]);
    });

    test('should extract from common keys - items', () => {
      const data = { items: [{ id: 1 }] };
      const result = normalizeToArray(data);
      expect(result).toEqual([{ id: 1 }]);
    });

    test('should extract from common keys - results', () => {
      const data = { results: [{ id: 1 }] };
      const result = normalizeToArray(data);
      expect(result).toEqual([{ id: 1 }]);
    });

    test('should return empty array for null', () => {
      const result = normalizeToArray(null);
      expect(result).toEqual([]);
    });

    test('should return empty array for undefined', () => {
      const result = normalizeToArray(undefined);
      expect(result).toEqual([]);
    });

    test('should return empty array for object without array property', () => {
      const data = { name: 'test', value: 123 };
      const result = normalizeToArray(data);
      expect(result).toEqual([]);
    });

    test('should return empty array for empty object', () => {
      const data = {};
      const result = normalizeToArray(data);
      expect(result).toEqual([]);
    });

    test('should prioritize specified key over common keys', () => {
      const data = { 
        data: [{ id: 1 }],
        items: [{ id: 2 }] 
      };
      const result = normalizeToArray(data, 'items');
      expect(result).toEqual([{ id: 2 }]);
    });

    test('should handle nested objects', () => {
      const data = { 
        nested: { 
          data: [{ id: 1 }] 
        } 
      };
      const result = normalizeToArray(data);
      expect(result).toEqual([]);
    });

    test('should handle empty array', () => {
      const data = [];
      const result = normalizeToArray(data);
      expect(result).toEqual([]);
    });

    test('should handle array of primitives', () => {
      const data = [1, 2, 'three', true];
      const result = normalizeToArray(data);
      expect(result).toEqual([1, 2, 'three', true]);
    });
  });
});

