// Introselect v2 · 实现
export interface IsHooks {
  onPivot?: (p: number, mode: 'random' | 'mom') => void;
  onResult?: (v: number) => void;
}
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function insertSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const x = a[i]!;
    let j = i - 1;
    while (j >= 0 && a[j]! > x) {
      a[j + 1] = a[j]!;
      j--;
    }
    a[j + 1] = x;
  }
  return a;
}
function momPivot(a: number[], left: number, right: number): number {
  const sub = a.slice(left, right + 1);
  const meds: number[] = [];
  for (let i = 0; i < sub.length; i += 5) {
    const g = insertSort(sub.slice(i, i + 5));
    meds.push(g[Math.floor(g.length / 2)]!);
  }
  return meds.length <= 5
    ? insertSort(meds)[Math.floor(meds.length / 2)]!
    : momPivot(meds, 0, meds.length - 1);
}
export function introselect(arr: number[], k: number, seed = 3, hooks: IsHooks = {}): number {
  const a = [...arr];
  const rng = makeRng(seed);
  const limit = 2 * Math.ceil(Math.log2(a.length + 1));
  function rec(left: number, right: number, kk: number, depth: number): number {
    if (left === right) {
      hooks.onResult?.(a[left]!);
      return a[left]!;
    }
    let pi: number;
    if (depth < limit) {
      pi = left + Math.floor(rng() * (right - left + 1));
      hooks.onPivot?.(a[pi]!, 'random');
    } else {
      const p = momPivot(a, left, right);
      hooks.onPivot?.(p, 'mom');
      pi = left;
      for (let i = left; i <= right; i++)
        if (a[i] === p) {
          pi = i;
          break;
        }
    }
    const pivot = a[pi]!;
    [a[pi], a[right]] = [a[right]!, a[pi]!];
    let i = left;
    for (let j = left; j < right; j++)
      if (a[j]! < pivot) {
        [a[i], a[j]] = [a[j]!, a[i]!];
        i++;
      }
    [a[i], a[right]] = [a[right]!, a[i]!];
    const rank = i - left;
    if (kk === rank) {
      hooks.onResult?.(a[i]!);
      return a[i]!;
    }
    if (kk < rank) return rec(left, i - 1, kk, depth + 1);
    return rec(i + 1, right, kk - rank - 1, depth + 1);
  }
  return rec(0, a.length - 1, k, 0);
}
