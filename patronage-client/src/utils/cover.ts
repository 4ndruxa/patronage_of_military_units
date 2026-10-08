// Card and page covers: one of six palette gradients (.pm-g1..6 in styles/_fundraising.scss),
// picked by id so the same fundraising always gets the same cover on every list and page.
export const COVER_COUNT = 6;

export const coverClass = (id: number): string => {
  if (!Number.isFinite(id)) {
    return 'pm-g1';
  }
  return `pm-g${(Math.abs(Math.trunc(id)) % COVER_COUNT) + 1}`;
};
