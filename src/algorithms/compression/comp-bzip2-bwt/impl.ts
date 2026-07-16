export interface BwtHooks {
  onRotation?: (i: number, last: number) => void;
}
export function bwtTransform(
  text: string,
  hooks: BwtHooks = {},
): { last: string; primary: number } {
  const s = text + '$';
  const n = s.length;
  const rotations = Array.from({ length: n }, (_, i) => s.slice(i) + s.slice(0, i));
  rotations.sort();
  let primary = 0;
  const last = rotations
    .map((r, i) => {
      if (r === s) primary = i;
      hooks.onRotation?.(i, r.charCodeAt(n - 1));
      return r[n - 1]!;
    })
    .join('');
  return { last, primary };
}
