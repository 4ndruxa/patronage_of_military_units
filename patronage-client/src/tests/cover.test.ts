import { coverClass } from '../utils/cover';

describe('coverClass', () => {
  test('is deterministic and cycles through the six gradients', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 12].map(coverClass)).toEqual(
      ['pm-g2', 'pm-g3', 'pm-g4', 'pm-g5', 'pm-g6', 'pm-g1', 'pm-g2', 'pm-g1'],
    );
    expect(coverClass(42)).toBe(coverClass(42));
  });

  test('handles zero, negative and odd ids', () => {
    expect(coverClass(0)).toBe('pm-g1');
    expect(coverClass(-7)).toBe('pm-g2');
    expect(coverClass(NaN)).toBe('pm-g1');
    expect(coverClass(Infinity)).toBe('pm-g1');
    expect(coverClass(7.9)).toBe('pm-g2');
  });
});
