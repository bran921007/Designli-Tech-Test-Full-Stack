import { isOverlap } from './is-overlap';

describe('isOverlap', () => {
  it('should return true when ranges overlap (partial)', () => {
    const start1 = new Date('2024-01-01T10:00:00Z');
    const end1 = new Date('2024-01-01T12:00:00Z');
    const start2 = new Date('2024-01-01T11:00:00Z');
    const end2 = new Date('2024-01-01T13:00:00Z');

    expect(isOverlap(start1, end1, start2, end2)).toBe(true);
  });

  it('should return true when ranges overlap (contained)', () => {
    const start1 = new Date('2024-01-01T10:00:00Z');
    const end1 = new Date('2024-01-01T14:00:00Z');
    const start2 = new Date('2024-01-01T11:00:00Z');
    const end2 = new Date('2024-01-01T12:00:00Z');

    expect(isOverlap(start1, end1, start2, end2)).toBe(true);
  });

  it('should return false when ranges do not overlap (before)', () => {
    const start1 = new Date('2024-01-01T10:00:00Z');
    const end1 = new Date('2024-01-01T11:00:00Z');
    const start2 = new Date('2024-01-01T11:00:00Z');
    const end2 = new Date('2024-01-01T12:00:00Z');

    expect(isOverlap(start1, end1, start2, end2)).toBe(false);
  });

  it('should return false when ranges do not overlap (after)', () => {
    const start1 = new Date('2024-01-01T12:00:00Z');
    const end1 = new Date('2024-01-01T13:00:00Z');
    const start2 = new Date('2024-01-01T10:00:00Z');
    const end2 = new Date('2024-01-01T12:00:00Z');

    expect(isOverlap(start1, end1, start2, end2)).toBe(false);
  });
});
