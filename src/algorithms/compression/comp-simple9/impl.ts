export interface S9Hooks {
  onWord?: (selector: number, count: number) => void;
}
const LAYOUTS = [
  [28, 1],
  [14, 2],
  [9, 3],
  [7, 4],
  [5, 5],
  [4, 7],
  [3, 9],
  [2, 14],
  [1, 28],
];
export function simple9Encode(values: number[], hooks: S9Hooks = {}): number[] {
  const out: number[] = [];
  let i = 0;
  while (i < values.length) {
    let chosen = -1;
    for (let s = 0; s < LAYOUTS.length; s++) {
      const [bits, cnt] = LAYOUTS[s]!;
      const max = (1 << bits!) - 1;
      let ok = true;
      let used = 0;
      for (let k = 0; k < Math.min(cnt!, values.length - i); k++) {
        if (values[i + k]! > max) {
          ok = false;
          break;
        }
        used = k + 1;
      }
      if (ok && used > 0) {
        chosen = s;
        break;
      }
    }
    if (chosen < 0) {
      chosen = 8;
    }
    const [bits, cnt] = LAYOUTS[chosen]!;
    let word = chosen << 28;
    for (let k = 0; k < Math.min(cnt!, values.length - i); k++)
      word |= (values[i + k]! & ((1 << bits!) - 1)) << (k * bits!);
    hooks.onWord?.(chosen, Math.min(cnt!, values.length - i));
    out.push(word >>> 0);
    i += Math.min(cnt!, values.length - i);
  }
  return out;
}
